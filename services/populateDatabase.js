const fs = require('fs');
const path = require('path');
const db = require('../models'); 
const bcrypt = require('bcryptjs');

async function populateBooks() {
    const filePath = path.join(__dirname, '../public/json/books.json');
    const books = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    await db.Book.bulkCreate(books);
}

async function populateUsers() {
    const filePath = path.join(__dirname, '../public/json/users.json');
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const normalizedUsers = await Promise.all(users.map(async (user) => ({
        FirstName: user.FirstName,
        LastName: user.LastName || null,
        Username: user.Username,
        Password: await bcrypt.hash(user.Password, 10),
        Role: user.Role
    })));

    await db.User.bulkCreate(normalizedUsers);
}

async function populateAuthor() {
    const filePath = path.join(__dirname, '../public/json/author.json');
    const authors = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    await db.Author.bulkCreate(authors);
}
async function populateGenre() {
    const filePath = path.join(__dirname, '../public/json/genre.json');
    const genres = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    await db.Genre.bulkCreate(genres.map((genre) => ({ name: genre.genre })));
}
async function populateLanguage() {
    const filePath = path.join(__dirname, '../public/json/language.json');
    const languages = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    await db.Language.bulkCreate(languages);
}
module.exports = {
    populateBooks,
    populateUsers,
    populateAuthor,
    populateGenre,
    populateLanguage,
    //populateBookLanguages
};
