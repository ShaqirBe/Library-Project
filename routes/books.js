var express = require('express');
var router = express.Router();
const booksDatabase = require('../services/booksDatabase');
var { isAdmin, isAuthenticated } = require("../middleware/index");
const db = require('../models');
const { Op } = require('sequelize');

router.get('/', async function (req, res, next) {
    try {
        let books = await booksDatabase.getAllBooks();
		
        const currentYear = new Date().getFullYear();

        
        books = books.map(book => ({
            ...book.dataValues,
            Age: currentYear - book.year
        }));
        res.render('books', { user: req.user, books: books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books');
    }
});


router.post('/borrow/:id', isAuthenticated, async function(req, res) {
    const bookId = req.params.id;
    const book = await booksDatabase.getBook(bookId);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    if (book.borrowed) {
        return res.status(400).json({ error: 'Book already borrowed' });
    }
    
    await book.update({ borrowed: true }, { where: { id: bookId } });
    res.json({ success: 'Book borrowed successfully', bookId: bookId });
});



router.post('/return/:id', isAuthenticated, isAdmin, async function(req, res) {
    const bookId = req.params.id;
    const book = await booksDatabase.getBook(bookId);

    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    if (!book.borrowed) {
        return res.status(400).json({ error: 'Book is not borrowed' });
    }

    await book.update({ borrowed: false }, { where: { id: bookId } });
    res.json({ success: 'Book returned successfully', bookId: bookId });
});


// this is route handler for the selecting author
router.post('/by-author', async (req, res) => {
    try {
        const authorName = 'J.K. Rowling'; 
        const booksByRowling = await db.Book.findAll({
            where: { author: authorName }
        });
        res.json(booksByRowling);
    } catch (error) {
        console.error('Error fetching books by J.K. Rowling:', error);
        res.status(500).send('Server error');
    }
});
// this is for the currently borrowed book
router.post('/currently-borrowed', async (req, res) => {
    try {
        
        const borrowedBooks = await db.Book.findAll({
            where: { borrowed: true }
        });

        res.json(borrowedBooks);
    } catch (error) {
        console.error('Error fetching currently borrowed books:', error);
        res.status(500).send('Error fetching currently borrowed books');
    }
});

//This is for the order books by the age 
router.post('/ordered-by-age', async (req, res) => {
    try {
        
        const booksOrderedByAge = await db.Book.findAll({
            order: [['year', 'ASC']] 
        });

        res.json(booksOrderedByAge);
    } catch (error) {
        console.error('Error ordering books by age:', error);
        res.status(500).send('Error ordering books by age');
    }
});

router.post('/multilingual', async (req, res) => {
    try {
        
        const multilingualBooks = await db.Book.findAll({
            where: db.sequelize.where(
                db.sequelize.fn('CHAR_LENGTH', db.sequelize.fn('REPLACE', db.sequelize.col('language'), ',', '')),
                '<', 
                db.sequelize.fn('CHAR_LENGTH', db.sequelize.col('language'))
            )
        });

        res.json(multilingualBooks);
    } catch (error) {
        console.error('Error fetching multilingual books:', error);
        res.status(500).send('Server error');
    }
});
router.post('/portuguese-books', async (req, res) => {
    try {
		
        const portugeseBooks = await db.Book.findAll({
            where: {
                language: {
                    [Op.like]: '%Portuguese%'
                }
            }
        });

        res.json({ books: portugeseBooks });
    } catch (error) {
        console.error('Error counting Portuguese books:', error);
        res.status(500).send('Server error');
    }
});
router.post('/all', async (req, res) => {
    try {
        const allBooks = await db.Book.findAll();
        res.json({ books: allBooks });
    } catch (error) {
        console.error('Error fetching all books:', error);
        res.status(500).send('Server error');
    }
});




module.exports = router;
