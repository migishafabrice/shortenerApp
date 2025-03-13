# shortenerApp

shortenerApp is a full-stack URL shortening web application built with React (frontend) and Node.js (backend). 
It provides users with a simple and secure way to shorten URLs, track clicks, and view analytics,
 while also ensuring user authentication and data protection.

## Features

### Authentication

- JWT-based authentication with access and refresh tokens
- CSRF protection for secure login/logout

### URL Management

- Shorten long URLs with a unique identifier
- Track total clicks for each shortened URL
- View user-specific URLs and their performance

### Analytics

- Display total clicks and number of URLs for logged-in users
- Fetch user visits count from the database

### Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT, CSRF
- **Version Control:** Git & GitHub Actions

## Project Structure

├── frontend/ # React app (client-side)
├── backend/ # Node.js app (server-side)
├── .env # Essential configuration (minimal setup)
├── README.md # Project documentation
└── package.json # Project dependencies

## Installation

1. **Clone the repository:**

git clone https://github.com/migishafabrice/shortenerApp
cd shortenerApp

2. **Set up environment variables:**

Create a `.env` file in both `frontend` and `backend` folders with the following minimal configuration:

**Backend `.env`:**


2. **Set up environment variables:**

Create a `.env` file in both `frontend` and `backend` folders with the following minimal configuration:

**Backend `.env`:**

DB_HOST=your_host
DB_PORT=3306
DB_NAME=shorturlsdb
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET_KEY=your_jwt_key_any
REFRESH_TOKEN_SECRET=your_refresh_key_any

**Frontend `.env`:**

REACT_APP_API_URL=http://localhost:5000

3. **Install dependencies:**

Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

4. **Run the development servers:**

Backend
cd backend
nodem app.js

Frontend
cd ../frontend
npm start

## API Endpoints

**Base URL:** `/api`

- `POST /auth/login` — Authenticate user and issue tokens
- `POST /auth/register` — Register a new user
- `GET /short-url/urls` — Get all URLs for the logged-in user
- `PUT /short-url/shorten` — Shorten a new URL
- `GET /short-url/analytics` — Get total clicks, URLs, and user visits

## Database Schema

### `users` Table

- `id` (Primary key)
- `username`
- `password`
- `visits`
- `created_at`

### `urls` Table

- `id` (Primary key)
- `userid` (Foreign key referencing `users.id`)
- `description_url`
- `long_url`
- `short_code`(unique) indexed as short_code
- `clicks`
- `created_at`

## GitHub Actions

- Automates CI/CD workflows

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
