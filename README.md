# Sismedika POS Frontend

Modern Point of Sale (POS) web application built with **React +
TypeScript + TailwindCSS**.

---

## 🚀 Tech Stack

- React
- TypeScript
- React Router
- Zustand (State Management)
- Axios
- TailwindCSS
- Vite

---

## 📦 Installation

```bash
git clone <your-repo-url>
cd sismedika-frontend
npm install
```

---

## ▶️ Running the Project

```bash
npm run dev
```

The application will run at:

    http://localhost:5173

Make sure the backend API is running at:

    http://127.0.0.1:8000/api

---

## 🔐 Login Credentials

### 👨‍🍳 Waiter Role

- **Email:** waiter@sismedika.com\
- **Password:** password

Capabilities: - Open new orders - Add & remove items - View order
details

---

### 💳 Cashier Role

- **Email:** cashier@sismedika.com\
- **Password:** password

Capabilities: - View order details - Close orders\

- Cannot open new orders\
- Cannot modify order items
  s

---

## 🧱 Project Structure

    src/
     ├── layouts/        # App layout (Sidebar, structure)
     ├── pages/          # Page components (Dashboard, Order, Login)
     ├── services/       # API layer (Axios calls)
     ├── store/          # Zustand store (Auth state)
     ├── routes/         # Routing configuration
     └── main.tsx        # App entry point

---

## 📊 Features

- Table monitoring dashboard
- Role-based access control (Waiter & Cashier)
- Order detail page
- Add / Remove order items
- Close order
- Professional responsive UI

---

## 🏗 Architecture Overview

Frontend communicates with backend API using Axios.

Authentication flow: 1. User logs in 2. Backend returns token + user 3.
Token stored in Zustand 4. Token attached to all API requests

---
