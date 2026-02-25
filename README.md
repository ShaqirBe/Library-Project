# Library Management System

An Express + Sequelize web application for managing books, borrowing status, authors, genres, languages, and user authentication.

## Features
- User signup and login with hashed passwords
- Session-based authentication with Passport
- Books listing with borrow/return actions
- Admin management for genres, authors, and languages
- MySQL database integration via Sequelize

## Tech Stack
- Node.js
- Express
- EJS
- Sequelize
- MySQL
- Passport (local strategy)

## Setup
1. Clone the repository.
2. Install dependencies:
   - `npm install`
3. Create environment file:
   - `cp .env.example .env`
4. Update `.env` with your database credentials and a strong session secret.
5. Create the database:
   - `CREATE DATABASE librarydb;`
6. Start the app:
   - `npm start`
7. Open:
   - [http://localhost:3000](http://localhost:3000)

## Environment Variables
- `DATABASE_NAME`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `DIALECT` (set to `mysql`)
- `HOST`
- `SESSION_SECRET`

## Database User (Optional)
```sql
CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON `librarydb`.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
```

## Notes
- Initial seed data is inserted only when related tables are empty.
- `.env` is ignored by Git; use `.env.example` as the template.
