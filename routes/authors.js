var express = require('express');
var router = express.Router();
const booksDatabase = require('../services/booksDatabase');
const { isAdmin, isAuthenticated } = require('../middleware/index');
const db = require('../models');

router.get('/', isAuthenticated, async function(req, res) {
	try {
		const authors = await booksDatabase.getAllAuthors();
		res.render('authors', { user: req.user, authors });
	} catch (error) {
		console.error('Error fetching author:', error);
		res.status(500).send('Error fetching author');
	}
});

router.post('/add', isAdmin, async function(req, res) {
	try {
		const name = (req.body.name || '').trim();
		if (!name) {
			return res.status(400).send('Author name is required');
		}

		await db.Author.create({ name });
		res.redirect('/authors');
	} catch (error) {
		console.error('Error adding author:', error);
		res.status(500).send('Error adding author');
	}
});

router.post('/update/:id', isAdmin, async function(req, res) {
	try {
		const newName = (req.body.newName || '').trim();
		if (!newName) {
			return res.status(400).json({ success: false, message: 'Author name cannot be empty' });
		}

		const author = await db.Author.findByPk(req.params.id);
		if (!author) {
			return res.status(404).json({ success: false, message: 'Author not found' });
		}

		await author.update({ name: newName });
		res.json({ success: true });
	} catch (error) {
		console.error('Error updating author:', error);
		res.status(500).json({ success: false, message: 'Error updating author' });
	}
});

router.post('/delete/:id', isAdmin, async function(req, res) {
	try {
		const author = await db.Author.findByPk(req.params.id);
		if (!author) {
			return res.status(404).json({ success: false, message: 'Author not found' });
		}

		await author.destroy();
		res.json({ success: true });
	} catch (error) {
		console.error('Error deleting author:', error);
		res.status(500).json({ success: false, message: 'Error deleting author' });
	}
});

module.exports = router;
