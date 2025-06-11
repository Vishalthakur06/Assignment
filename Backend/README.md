# Features

- Admin can add products with images
- Admin can generate unique codes for products
- Users can search products by unique codes

# Installation

1. Clone the repository
2. Run `npm install`
3. Create `.env` file
4. Add mongodb_url in db.js and Run MongoDB server
5. Run `npm run setup` to create initial users
6. Run `npm start` to start the server

# API Endpoints

# Authentication

- POST `/api/auth/login` - Login with username and password
- POST `/api/auth/logout` - Logout

# Admin Routes

- POST `/api/admin/products` - Add new product (with image upload)
- POST `/api/admin/generate-codes` - Generate unique codes for a product
- GET `/api/admin/products` - Get all products

# User Routes

- GET `/api/user/search/:code` - Search product by unique code

# Default Users

- Admin: username `admin`, password `admin123`
- User: username `user`, password `user123`
