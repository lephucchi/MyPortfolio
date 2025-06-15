# Portfolio Project

## Introduction

This is a personal Portfolio project, including a system for managing posts, projects, and a reaction (react) feature. The project is built with a separated architecture: back-end (NestJS) and front-end (ReactJS).

## Features

- Manage personal posts and projects.
- User registration and login.
- Send reactions (react) to posts and projects.
- Manage and display the count of each reaction type.
- Modern, user-friendly interface.
- RESTful API, secured with JWT.

---

## Project Structure

```
portfolio/
│
├── back-end/         # Back-end source code (NestJS)
│   ├── src/
│   ├── package.json
│   └── ...
│
├── front-end/        # Front-end source code (ReactJS)
│   ├── src/
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
└── README.md
```

---

## System Requirements

- Node.js >= 18.x
- npm >= 9.x
- Docker & Docker Compose (if using containers)
- Database system (PostgreSQL/MySQL/MongoDB, depending on configuration)

---

## Installation

### 1. Clone the project

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Install back-end dependencies

```bash
cd back-end
npm install
```

### 3. Install front-end dependencies

```bash
cd ../front-end
npm install
```

---

## Running the Project

### 1. Run with Docker Compose

```bash
docker-compose up --build
```

### 2. Run manually

#### Back-end

```bash
cd back-end
npm run start:dev
```

#### Front-end

```bash
cd front-end
npm start
```

---

## Environment Configuration

### Back-end

Create a `.env` file in the `back-end` directory with the following example content:

```
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
JWT_SECRET=your_jwt_secret
```

### Front-end

Create a `.env` file in the `front-end` directory with the following example content:

```
REACT_APP_API_URL=http://localhost:5000
```

---

## Usage Guide

1. Access the user interface at `http://localhost:3000`.
2. Register an account and log in.
3. Create a new post or project.
4. Send reactions (react) to posts or projects.
5. View statistics of each reaction type.

---

## Contribution

All contributions are welcome! Please create a pull request or issue to discuss further.
