# CyberShield - Cyber Crime Support Platform

**CyberShield** is a web application designed to help victims of cyber crime. It connects users with verified cyber security experts, allows for anonymous reporting of incidents, and provides essential digital safety tools.

### 🔴 [Live Demo (MVP)](https://cyber-shield-silk.vercel.app/)

![CyberShield Screenshot](frontend/assets/screenshot.png) 
*(Note: Add a screenshot to frontend/assets/screenshot.png or remove this line)*

## 🚀 Features

*   **Anonymous Reporting**: Victims can report crimes without revealing their identity to the public.
*   **Expert Connection**: Direct channel to chat and get help from verified security professionals.
*   **Real-time Feed**: A community feed (like a forum) to share awareness about recent scams and how to prevent them.
*   **Dashboard**: Track the status of your reported tickets.
*   **Safety Tools**:
    *   URL Scanner (Mock)
    *   Email Breach Checker (Mock)
    *   Password Strength Meter
    *   Emergency Guide

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3, Vanilla JavaScript (No heavy frameworks, fast & lightweight).
*   **Backend**: Node.js, Express.js.
*   **Database**: Google Firebase Firestore (NoSQL).
*   **Authentication**: Google Firebase Authentication.

## 📦 Project Structure

```
cybercare/
├── backend/            # Node.js Express Server
│   ├── config/         # Firebase Admin SDK setup
│   ├── middleware/     # Auth verification
│   ├── routes/         # API endpoints (Auth, Tickets, Feed)
│   └── server.js       # Entry point
│
├── frontend/           # Static Client
│   ├── utils/          # API & Firebase configurations
│   ├── index.html      # Main landing page
│   ├── dashboard.html  # User dashboard
│   ├── create.html     # Ticket creation form
│   ├── script.js       # Core logic
│   └── style.css       # Styling
│
└── .gitignore          # Ignores sensitive keys (serviceAccountKey.json, .env)
```

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js installed.
*   A Firebase Project (for API keys).

### 1. Backend Setup
1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Firebase Config**:
    *   Download your `serviceAccountKey.json` from Firebase Console > Project Settings > Service Accounts.
    *   Place it in `backend/config/serviceAccountKey.json`.
4.  Start the server:
    ```bash
    npm start
    ```
    *Server runs on port 5000.*

### 2. Frontend Setup
1.  Navigate to the frontend folder:
    ```bash
    cd ../frontend
    ```
2.  **Firebase Config**:
    *   Open `utils/firebase-config.js`.
    *   Update `firebaseConfig` object with your details from Firebase Console.
3.  Serve the application:
    ```bash
    npx serve
    ```
    *App runs on http://localhost:3000.*

## 🔒 Security Note
This repository does **not** contain the private API keys (`serviceAccountKey.json`) or environment variables for security reasons. You must provide your own Firebase credentials to run this locally.

## 🤝 Contributing
1.  Fork the repo.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
Developed with ❤️ by Team CyberShield.
