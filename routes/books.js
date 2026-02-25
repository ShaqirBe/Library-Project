var express = require('express');
var router = express.Router();
var { isAdmin, isAuthenticated } = require('../middleware/index');
const db = require('../models');
const { QueryTypes } = require('sequelize');

const baseBooksSelect = `
SELECT
  b.id,
  a.name AS author,
  b.title,
  b.description,
  b.publisher,
  (YEAR(CURDATE()) - b.year) AS Age,
  GROUP_CONCAT(DISTINCT l.name ORDER BY l.name SEPARATOR ', ') AS language,
  g.name AS genre,
  CASE WHEN COUNT(br.id) > 0 THEN 1 ELSE 0 END AS borrowed
FROM Books b
JOIN Authors a ON a.id = b.authorId
JOIN Genres g ON g.id = b.genreId
LEFT JOIN BookLanguages bl ON bl.BookId = b.id
LEFT JOIN Languages l ON l.id = bl.LanguageId
LEFT JOIN Borrows br ON br.bookId = b.id
`;

const baseBooksGroupBy = `
GROUP BY
  b.id, a.name, b.title, b.description, b.publisher, b.year, g.name
`;

async function runBookQuery(whereClause = '', havingClause = '', orderClause = '', replacements = {}) {
    const sql = `${baseBooksSelect}
${whereClause}
${baseBooksGroupBy}
${havingClause}
${orderClause};`;

    const rows = await db.sequelize.query(sql, {
        type: QueryTypes.SELECT,
        replacements
    });

    return rows.map((row) => ({
        ...row,
        borrowed: Boolean(row.borrowed)
    }));
}

router.get('/', async function (req, res) {
    try {
        const books = await runBookQuery('', '', 'ORDER BY b.id ASC');
        res.render('books', { user: req.user, books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books');
    }
});

router.post('/borrow/:id', isAuthenticated, async function (req, res) {
    try {
        if (req.user.Role !== 'member') {
            return res.status(403).json({ error: 'Only members can borrow books' });
        }

        const bookId = Number(req.params.id);
        const book = await db.Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const existingBorrow = await db.Borrow.findOne({ where: { bookId } });
        if (existingBorrow) {
            return res.status(400).json({ error: 'Book already borrowed' });
        }

        await db.Borrow.create({ userId: req.user.id, bookId });
        await book.update({ borrowed: true });

        res.json({ success: true, message: 'Book borrowed successfully', bookId });
    } catch (error) {
        console.error('Error borrowing book:', error);
        res.status(500).json({ error: 'Server error while borrowing book' });
    }
});

router.post('/return/:id', isAuthenticated, isAdmin, async function (req, res) {
    try {
        const bookId = Number(req.params.id);
        const book = await db.Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const borrowRecord = await db.Borrow.findOne({ where: { bookId } });
        if (!borrowRecord) {
            return res.status(400).json({ error: 'Book is not borrowed' });
        }

        await borrowRecord.destroy();
        await book.update({ borrowed: false });

        res.json({ success: true, message: 'Book returned successfully', bookId });
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ error: 'Server error while returning book' });
    }
});

router.post('/by-author', async (req, res) => {
    try {
        const booksByRowling = await runBookQuery('WHERE a.name = :authorName', '', 'ORDER BY b.id ASC', {
            authorName: 'J.K. Rowling'
        });
        res.json(booksByRowling);
    } catch (error) {
        console.error('Error fetching books by J.K. Rowling:', error);
        res.status(500).send('Server error');
    }
});

router.post('/currently-borrowed', async (req, res) => {
    try {
        const borrowedBooks = await runBookQuery('', 'HAVING COUNT(br.id) > 0', 'ORDER BY b.id ASC');
        res.json(borrowedBooks);
    } catch (error) {
        console.error('Error fetching currently borrowed books:', error);
        res.status(500).send('Error fetching currently borrowed books');
    }
});

router.post('/ordered-by-age', async (req, res) => {
    try {
        const booksOrderedByAge = await runBookQuery('', '', 'ORDER BY b.year ASC');
        res.json(booksOrderedByAge);
    } catch (error) {
        console.error('Error ordering books by age:', error);
        res.status(500).send('Error ordering books by age');
    }
});

router.post('/multilingual', async (req, res) => {
    try {
        const multilingualBooks = await runBookQuery('', 'HAVING COUNT(DISTINCT l.id) > 1', 'ORDER BY b.id ASC');
        res.json(multilingualBooks);
    } catch (error) {
        console.error('Error fetching multilingual books:', error);
        res.status(500).send('Server error');
    }
});

router.post('/portuguese-books', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const [result] = await db.sequelize.query(
            `
            SELECT COUNT(DISTINCT b.id) AS portugueseCount
            FROM Books b
            JOIN BookLanguages bl ON bl.BookId = b.id
            JOIN Languages l ON l.id = bl.LanguageId
            WHERE l.name = 'Portuguese';
            `,
            { type: QueryTypes.SELECT }
        );

        res.json({ count: Number(result.portugueseCount) || 0 });
    } catch (error) {
        console.error('Error counting Portuguese books:', error);
        res.status(500).send('Server error');
    }
});

router.post('/all', async (req, res) => {
    try {
        const allBooks = await runBookQuery('', '', 'ORDER BY b.id ASC');
        res.json({ books: allBooks });
    } catch (error) {
        console.error('Error fetching all books:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
