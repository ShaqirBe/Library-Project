const fs = require('fs');
const path = require('path');
const db = require('../models');

function readQueryFile(fileName) {
    const filePath = path.join(__dirname, '../public/json', fileName);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function executeQueries(fileName) {
    const entries = readQueryFile(fileName);
    for (const entry of entries) {
        await db.sequelize.query(entry.query, {
            replacements: entry.replacements || {}
        });
    }
}

async function populateAuthors() {
    await executeQueries('authorsQueries.json');
}

async function populateGenres() {
    await executeQueries('genresQueries.json');
}

async function populateLanguages() {
    await executeQueries('languagesQueries.json');
}

async function populateUsers() {
    await executeQueries('usersQueries.json');
}

async function populateBooks() {
    await executeQueries('booksQueries.json');
}

async function populateBookLanguages() {
    await executeQueries('bookLanguagesQueries.json');
}

async function populateBorrows() {
    await executeQueries('borrowsQueries.json');
}

module.exports = {
    populateAuthors,
    populateGenres,
    populateLanguages,
    populateUsers,
    populateBooks,
    populateBookLanguages,
    populateBorrows
};
