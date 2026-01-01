# React Library Management System

A modern, responsive library management system built with React and Tailwind CSS. This application allows users to register, login, view and manage books, pay fines, and access their profiles. Admins can manage books and users through a dedicated dashboard.

## Features
- User authentication (register, login, protected routes)
- Book listing and management
- Admin dashboard for book/user management
- Fine payment functionality
- User profile management
- Responsive UI with Tailwind CSS

## Folder Structure
```
src/
  App.jsx                # Main app component
  index.css              # Global styles
  main.jsx               # Entry point
  api/
    api.js               # API calls
  components/
    BookForm.jsx         # Add/edit book form
    BookList.jsx         # List of books
    Navbar.jsx           # Navigation bar
    ProtectedRoute.jsx   # Route protection
  context/
    AuthContext.jsx      # Authentication context
  pages/
    AdminDashboard.jsx   # Admin dashboard
    Books.jsx            # Books page
    Login.jsx            # Login page
    PayFine.jsx          # Fine payment page
    Profile.jsx          # User profile page
    Register.jsx         # Registration page
  styles/
    adminDashboard.css   # Admin dashboard styles
    auth.css             # Auth styles
    books.css            # Books styles
    common.css           # Common styles
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd reactLibraryManagement
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## Configuration
- Tailwind CSS for styling
- Vite for fast development and build
- ESLint for code linting

## Deployment
You can deploy this app on Vercel, Netlify, or any static hosting provider. See `vercel.json` for Vercel configuration.

## License
MIT

## Author
- Pavithra P N

---
Feel free to contribute or open issues for improvements!
