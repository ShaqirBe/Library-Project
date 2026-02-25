# Library Management System (DAB Resit 2)

## Application Installation and Usage Instructions
1. Clone the repository from the GitHub Classroom link.
2. Install dependencies:
   - `npm install`
3. Create environment file:
   - `cp .env.example .env`
4. Fill `.env` values for MySQL.
5. Start the app:
   - `npm start`
6. Open:
   - [http://localhost:3000](http://localhost:3000)

## Environment Variables
```env
DATABASE_NAME=librarydb
ADMIN_USERNAME=dabcaowner
ADMIN_PASSWORD=dabca1234
DIALECT=mysql
HOST=localhost
SESSION_SECRET=replace-with-a-strong-secret
```

## Additional Libraries/Packages Used
- cookie-parser
- debug
- dotenv
- ejs
- express
- express-session
- http-errors
- morgan
- mysql2
- passport
- passport-local
- sequelize

## NodeJS Version Used
- Node.js v22

## DATABASE
```sql
CREATE DATABASE `librarydb`;
```

## DATABASEACCESS
```sql
CREATE USER 'dabcaowner'@'localhost' IDENTIFIED BY 'dabca1234';
GRANT ALL PRIVILEGES ON `librarydb`.* TO 'dabcaowner'@'localhost';
FLUSH PRIVILEGES;
```
