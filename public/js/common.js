function bookoutBook(id) {
    fetch('/books/borrow/' + id, {
        method: 'POST',
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            alert('Book borrowed successfully.');
            window.location.reload();
            return;
        }
        alert('Failed to borrow book: ' + (data.error || data.message || 'Unknown error'));
    })
    .catch((error) => console.error('Error:', error));
}

function returnBook(id) {
    fetch('/books/return/' + id, {
        method: 'POST',
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            alert('Book returned successfully.');
            window.location.reload();
            return;
        }
        alert('Failed to return book: ' + (data.error || data.message || 'Unknown error'));
    })
    .catch((error) => console.error('Error:', error));
}

function updateGenre(genreId) {
    const newName = prompt('Enter new genre name:');
    if (!newName || !newName.trim()) {
        return;
    }

    fetch('/genres/update/' + genreId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: newName.trim() }),
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            window.location.reload();
            return;
        }
        alert(data.message || 'Failed to update genre');
    })
    .catch((error) => console.error('Error:', error));
}

function deleteGenre(genreId) {
    fetch('/genres/delete/' + genreId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            window.location.reload();
            return;
        }
        alert(data.message || 'Failed to delete genre');
    })
    .catch((error) => console.error('Error:', error));
}

function updateAuthor(authorId) {
    const newName = prompt('Enter new author name:');
    if (!newName || !newName.trim()) {
        return;
    }

    fetch('/authors/update/' + authorId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: newName.trim() }),
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            window.location.reload();
            return;
        }
        alert(data.message || 'Failed to update author');
    })
    .catch((error) => console.error('Error:', error));
}

function deleteAuthor(authorId) {
    fetch('/authors/delete/' + authorId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            window.location.reload();
            return;
        }
        alert(data.message || 'Failed to delete author');
    })
    .catch((error) => console.error('Error:', error));
}

function updateLanguage(languageId) {
    const newName = prompt('Enter new language name:');
    if (!newName || !newName.trim()) {
        return;
    }

    fetch('/languages/update/' + languageId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: newName.trim() }),
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            window.location.reload();
            return;
        }
        alert(data.message || 'Failed to update language');
    })
    .catch((error) => console.error('Error:', error));
}

function deleteLanguage(languageId) {
    fetch('/languages/delete/' + languageId, {
        method: 'POST',
        credentials: 'include'
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            window.location.reload();
            return;
        }
        alert(data.message || 'Failed to delete language');
    })
    .catch((error) => console.error('Error:', error));
}

function sqlQuery1() {
    fetch('/books/by-author', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => response.json())
    .then((books) => updateBooksTable(books))
    .catch((error) => console.error('Error:', error));
}

function sqlQuery2() {
    fetch('/books/currently-borrowed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => response.json())
    .then((data) => updateBooksTable(data))
    .catch((error) => console.error('Error:', error));
}

function sqlQuery3() {
    fetch('/books/ordered-by-age', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => response.json())
    .then((data) => updateBooksTable(data))
    .catch((error) => console.error('Error:', error));
}

function sqlQuery4() {
    fetch('/books/multilingual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => response.json())
    .then((data) => updateBooksTable(data))
    .catch((error) => console.error('Error:', error));
}

function sqlQuery5() {
    fetch('/books/portuguese-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => {
        if (response.status === 403) {
            alert('Only admins can run this query.');
            return null;
        }
        return response.json();
    })
    .then((data) => {
        if (!data) {
            return;
        }
        alert('Number of Portuguese books: ' + data.count);
    })
    .catch((error) => console.error('Error:', error));
}

function allBooks() {
    fetch('/books/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then((response) => response.json())
    .then((data) => updateBooksTable(data.books))
    .catch((error) => console.error('Error:', error));
}

function updateBooksTable(books) {
    const booksContainer = document.getElementById('books-results');
    if (!booksContainer) {
        return;
    }

    booksContainer.innerHTML = '';
    const currentYear = new Date().getFullYear();

    books.forEach((book) => {
        const age = book.Age !== undefined ? book.Age : (book.year ? currentYear - book.year : '');
        const language = book.language || book.languages || '';
        const role = window.currentUserRole || '';
        const borrowButton = role === 'member'
            ? `<button class=\"btn-sm btn-warning\" onclick=\"bookoutBook('${book.id}')\">Borrow</button>`
            : '<button class=\"btn-sm btn-secondary\" disabled>Borrow</button>';
        const returnButton = role === 'admin'
            ? `<button class=\"btn-sm btn-danger\" onclick=\"returnBook('${book.id}')\">Return</button>`
            : '<button class=\"btn-sm btn-secondary\" disabled>Return</button>';

        const bookRow = document.createElement('div');
        bookRow.className = 'row px-3 py-1';
        bookRow.innerHTML = `
        <span class="col-1 py-1 bg-light">${book.id}</span>
        <span class="col-1 py-1 bg-light">${book.author || ''}</span>
        <span class="col-1 py-1 bg-light">${book.title || ''}</span>
        <span class="col-2 py-1 bg-light">${book.description || ''}</span>
        <span class="col-1 py-1 bg-light">${book.publisher || ''}</span>
        <span class="col-1 py-1 bg-light">${age}</span>
        <span class="col-2 py-1 bg-light">${language}</span>
        <span class="col-1 py-1 bg-light">${book.genre || ''}</span>
        <span class="col-1 py-1 bg-light">${book.borrowed ? 'Borrowed' : 'Available'}</span>
        <span class="col-1 py-1 bg-light text-center">
          ${borrowButton}
          ${returnButton}
        </span>
      `;

        booksContainer.appendChild(bookRow);
    });
}
