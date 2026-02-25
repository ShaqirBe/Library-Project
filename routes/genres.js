var express = require('express');
var router = express.Router();
const booksDatabase = require('../services/booksDatabase');
const { isAdmin, isAuthenticated } = require('../middleware/index');

router.get('/', isAuthenticated, async function(req, res) {
    res.render('genres', { user: req.user, genres: [] });
});

router.post('/list', isAuthenticated, async function(req, res) {
    try {
        const genres = await booksDatabase.getAllGenres();
        res.json({ genres });
    } catch (error) {
        console.error('Error fetching genres:', error);
        res.status(500).json({ success: false, message: 'Error fetching genres' });
    }
});
// Add a new genre (only accessible to admin)
router.post('/add', isAdmin, async function (req, res) {
    try {
        const name = (req.body.name || '').trim();
        if (!name) {
            return res.status(400).send('Genre name is required');
        }

        await booksDatabase.addGenre(name);
        res.redirect('/genres');
    } catch (error) {
        console.error('Error adding genre:', error);
        res.status(500).json({ success: false, message: 'Error updating genre' });
    }
});

// Update an existing genre (only accessible to admin)
// POST route to update a genre
router.post('/update/:id', isAdmin, async function (req, res) {
    const genreId = req.params.id;
    const newName = (req.body.newName || '').trim();
    if (!newName) {
        return res.status(400).json({ success: false, message: 'Genre name cannot be empty' });
    }

    try {
        const updated = await booksDatabase.updateGenre(genreId, newName);
        if (updated) {
            res.json({ success: true, message: 'Genre updated successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Genre update failed' });
        }
    } catch (error) {
        console.error('Error updating genre:', error);
        res.status(500).json({ success: false, message: 'Error updating genre' });
    }
});

// Delete a genre (only accessible to admin, with dependency check)
router.post('/delete/:id', isAdmin, async function(req, res) {
    const genreId = req.params.id;
    try {
        const result = await booksDatabase.deleteGenre(genreId);
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result); 
        }
    } catch (error) {
        console.error('Error deleting genre:', error);
        res.status(500).send('Error deleting genre');
    }
});

module.exports = router;
