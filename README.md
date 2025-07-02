# JeevanSetu ID

A modern web application for creating, managing, and verifying emergency health profiles using a unique JeevanSetu ID. Built with Node.js, Express, MySQL, and Tailwind CSS.

## 🚀 Features
- User registration and login
- Create and update a personal health profile (blood group, allergies, conditions, emergency contact, etc.)
- Permanent, unique JeevanSetu ID generated for each user
- Share JeevanSetu ID for emergency access
- Doctor/NGO verification page to view health info by JeevanSetu ID
- Data stored securely in MySQL

## 🖥️ Technologies Used
- Node.js + Express (backend API)
- MySQL (database)
- HTML, CSS (Tailwind), JavaScript (frontend)

## 🏁 Getting Started

### 1. Clone the repository
```
git clone https://github.com/yourusername/jeevansetu.git
cd jeevansetu
```

### 2. Install dependencies
```
npm install
```

### 3. Set up the MySQL database
- Create a MySQL database and user (update credentials in `server.js` if needed).
- Run the SQL script to create tables:
```
mysql -u root -p < db.sql
```

### 4. Start the server
```
npm start
```
- The app will be available at [http://localhost:3000](http://localhost:3000)

## 🧑‍💻 User Flow
- Register and log in
- Fill out your health profile and save
- Your JeevanSetu ID is generated and shown
- Share your ID for emergency access

## 🩺 Doctor/NGO Flow
- Open `verify.html`
- Enter a JeevanSetu ID to view the associated health profile (no login required)

## 📂 Project Structure
- `server.js` — Node.js backend
- `db.sql` — MySQL schema
- `dashboard.html` — User dashboard
- `verify.html` — Doctor/NGO verification page
- `index.html`, `login.html`, `register.html` — Landing and auth pages

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](LICENSE)

## API Endpoints

- `POST /api/register` — Register a new user
  - Body: `{ name, email, password }`
- `POST /api/login` — Login
  - Body: `{ email, password }`

## Note
- This backend uses an in-memory user store. All data will be lost when the server restarts. For production, connect to a real database. 