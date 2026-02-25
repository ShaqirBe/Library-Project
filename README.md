[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/WIC1ulBu)
![](http://images.restapi.co.za/pvt/Noroff-64.png)

# Noroff

# Back-end Development Year 1

### Databases - Course Assignment Resit 2 <sup>V1</sup>

Startup code for Noroff back-end development 1 - Databases course.

Instruction for the course assignment resit is in the LMS (Moodle) system of Noroff.
[https://lms.noroff.no](https://lms.noroff.no)

![](http://images.restapi.co.za/pvt/ca_important.png)

You will not be able to make any submission after the deadline of the course assignment. Make sure to make all your commit **BEFORE** the deadline

![](http://images.restapi.co.za/pvt/help.png)

If you are unsure of any instructions for the course assignment, contact out to your teacher on **Microsoft Teams**.

**REMEMBER** Your Moodle LMS submission must have your repository link **AND** your Github username in the text file.

---

### Application Installation and Usage Instructions

1. Clone the repository.
2. Install dependencies:
   - `npm install`
3. Create your environment file:
   - `cp .env.example .env`
   - Fill in your own database credentials and session secret.
4. Ensure MySQL is running and create your database:
   - `CREATE DATABASE librarydb;`
5. Start the app:
   - `npm start`
6. Open:
   - `http://localhost:3000`

### Environment Variables

Required values in `.env`:
- `DATABASE_NAME`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `DIALECT` (for this project: `mysql`)
- `HOST`
- `SESSION_SECRET`

### Additional Libraries/Packages

- "bcryptjs": "^2.4.3",
  "cookie-parser": "~1.4.4",
  "debug": "~2.6.9",
  "dotenv": "^16.3.1",
  "ejs": "^3.1.8",
  "express": "^4.18.2",
  "express-session": "^1.18.1",
  "http-errors": "~1.6.3",
  "morgan": "~1.9.1",
  "mysql2": "^3.14.0",
  "passport": "^0.7.0",
  "passport-local": "^1.0.0",
  "sequelize": "^6.37.7"

### NodeJS Version Used

### DATABASE

-Below is the SQL script to create the `librarydb` database in MySQL:

CREATE DATABASE `librarydb`;

### DATABASEACCESS

-Below is the SQL script template to create a new DB user with database owner rights for `librarydb`:

CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';

-- Grant all privileges to your user on `librarydb` database
GRANT ALL PRIVILEGES ON `librarydb`.\* TO 'your_db_user'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;
