# Blood Bank

A small blood bank management app with donor management and request handling.

## Features

- Add donors with email, phone, blood group, address, age, and gender
- View donor list and delete donors
- Submit blood requests and track request status
- Mark requests as read and delete completed requests
- Simple Express backend with MySQL database

## Setup

1. Install dependencies for backend and frontend:

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

3. Start the frontend dev server:

   ```bash
   cd frontend
   npm run dev
   ```

4. Open the app in your browser:
   - Frontend: `http://localhost:5174`
   - Backend API: `http://localhost:5000/api`

## Git push instructions

```bash
git add .
git commit -m "Add README and fix request delete button + donor card layout"
git push origin main
```

## Notes

- The request delete button appears after a request is marked as read.
- Donor details are now aligned to the side in donor cards for a cleaner layout.
