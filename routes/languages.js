var express = require('express');
var router = express.Router();
const booksDatabase = require('../services/booksDatabase');
const { isAdmin } = require('../middleware'); 


// Get all languages
router.get('/', isAdmin, async function(req, res) {
    res.render('languages', { user: req.user, languages: [] });
});

router.post('/list', isAdmin, async function(req, res) {
    try {
        const languages = await booksDatabase.getAllLanguages();
        res.json({ languages });
    } catch (error) {
        console.error('Error fetching languages:', error);
        res.status(500).json({ success: false, message: 'Error fetching languages' });
    }
});

// Add a new language
router.post('/add', isAdmin, async function(req, res) {
    try {
        const name = (req.body.name || '').trim();
        if (!name) {
            return res.status(400).send('Language name is required');
        }

        await booksDatabase.addLanguage(name);
        res.redirect('/languages');
    } catch (error) {
        console.error('Error adding language:', error);
        res.status(500).send('Error adding language');
    }
});

// Update a language
router.post('/update/:id', isAdmin, async function(req, res) {
    try {
        const newName = (req.body.newName || '').trim();
        if (!newName) {
            return res.status(400).json({ success: false, message: 'Language name cannot be empty' });
        }

        const result = await booksDatabase.updateLanguage(req.params.id, newName);
        if (!result.success) {
            return res.status(404).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error('Error updating language:', error);
        res.status(500).json({ success: false, message: 'Error updating language' });
    }
});

// Delete a language
router.post('/delete/:id', isAdmin, async function(req, res) {
    try {
        const result = await booksDatabase.deleteLanguage(req.params.id);
        if (!result.success) {
            return res.status(400).json(result);
        }
        res.json(result);
    } catch (error) {
        console.error('Error deleting language:', error);
        res.status(500).json({ success: false, message: 'Error deleting language' });
    }
});

module.exports = router;
