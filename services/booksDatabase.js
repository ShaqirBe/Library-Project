const fs = require('fs');
const path = require('path');
const db = require('../models'); 
const Genre = db.Genre;
const Language = db.Language; 
const Author = db.Author;

async function getAllBooks() {
    try {
        const books = await db.Book.findAll();
        
        return books;
    } catch (error) {
        console.error('Error fetching all books:', error);
    }
}

async function getBook( id ) {
    try {
        const book = await db.Book.findByPk(id);
        
        return book;
    } catch (error) {
        console.error('Error fetching book with id ', error);
    }
}
async function getAllGenres() {
    try {
        const genres = await Genre.findAll();
        return genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error; 
    }
}
// Add a new genre
async function addGenre(name) {
    try {
        return await Genre.create({ name });
    } catch (error) {
        console.error('Error adding genre:', error);
        throw error;
    }
}

// Update an existing genre
async function updateGenre(genreId, newName) {
    try {
        const genre = await Genre.findByPk(genreId);
        if (!genre) {
            console.error('Genre not found');
            return false; 
        }

        await genre.update({ name: newName });
        return true; 
    } catch (error) {
        console.error('Error updating genre:', error);
        return false; 
    }
}


// delete genre
async function deleteGenre(genreId) {
    try {
        
        const booksWithGenre = await db.Book.findAll({ where: { genreId: genreId } });
        if (booksWithGenre.length > 0) {
            
            return { success: false, message: 'Genre cannot be deleted as it has associated books.' };
        }

        
        const genre = await db.Genre.findByPk(genreId);
        if (!genre) {
            return { success: false, message: 'Genre not found.' };
        }

        await genre.destroy();
        return { success: true, message: 'Genre deleted successfully.' };
    } catch (error) {
        console.error('Error deleting genre:', error);
        return { success: false, message: 'Error deleting genre.' };
    }
}



// Get all languages
async function getAllLanguages() {
    return await Language.findAll();
}

// Add a new language
async function addLanguage(name) {
    return await Language.create({ name });
}

// Update an existing language
async function updateLanguage(languageId, newName) {
    const language = await Language.findByPk(languageId);
    if (!language) {
        return { success: false, message: 'Language not found.' };
    }
    await language.update({ name: newName });
    return { success: true, message: 'Language updated successfully.' };
}

// Delete a language
async function deleteLanguage(languageId) {
    const booksWithLanguage = await db.Book.findAll({
        include: [{
            model: Language,
            where: { id: languageId }
        }]
    });

    if (booksWithLanguage.length > 0) {
        return { success: false, message: 'Language cannot be deleted as it is used by books.' };
    }

    const language = await Language.findByPk(languageId);
    if (!language) {
        return { success: false, message: 'Language not found.' };
    }

    await language.destroy();
    return { success: true, message: 'Language deleted successfully.' };
}

// Get all languages
async function getAllAuthors() {
    return await Author.findAll();
}






module.exports = {
    getAllBooks,
    getBook,
    getAllGenres,
    addGenre,
    updateGenre,
    deleteGenre,
    getAllLanguages,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    getAllAuthors
}