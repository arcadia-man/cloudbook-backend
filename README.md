# cloudbook-backend

REST API for a cloud notes application. Handles user registration with OTP email verification, JWT authentication, and CRUD operations on notes.

## Tech Stack

Node.js · Express · MongoDB (Mongoose) · JWT · bcrypt · Nodemailer

## Features

- User registration with 4-digit OTP email verification
- Login with email and password, returns a JWT
- Password reset via OTP
- Create, read, update and delete notes (requires auth)
- JWT middleware protects all note routes

## Getting Started

### Prerequisites

Node.js 18+ · MongoDB Atlas account · SMTP email credentials

### Setup

```bash
git clone https://github.com/arcadia-man/cloudbook-backend.git
cd cloudbook-backend
cp .env.example .env   # fill in your values
npm install
node index.js
```

Server starts on port `5000` (or `PORT` from env).

## API Routes

### Auth — `/api/mauth`

| Method | Route | Description |
|---|---|---|
| POST | `/mcreateuser` | Register — sends OTP to email |
| POST | `/verify` | Verify OTP to activate account |
| POST | `/resend` | Resend OTP |
| POST | `/login` | Login — returns JWT |
| POST | `/forpass` | Reset password with OTP |
| GET | `/getuser` | Get current user (auth required) |

### Notes — `/api/notes`

| Method | Route | Description |
|---|---|---|
| GET | `/fetchallnotes` | Get all notes for current user |
| POST | `/addnote` | Create a note |
| PUT | `/updatenote/:id` | Update a note |
| DELETE | `/deletenote/:id` | Delete a note |

All note routes require `auth-token` header with a valid JWT.

## Project Structure

```
cloudbook-backend/
├── dbs.js              # MongoDB connection
├── index.js            # Express server entry point
├── middleware/
│   └── fetchuser.js    # JWT auth middleware
├── models/
│   ├── Muser.js        # User schema (email, password, OTP, status)
│   └── Note.js         # Note schema
├── routes/
│   ├── mauth.js        # Auth routes
│   └── notes.js        # Notes routes
└── mails/
    ├── otp.js          # OTP email sender
    └── authmail.js     # Account notification email
```

## Environment Variables

See `.env.example` for all required variables.
