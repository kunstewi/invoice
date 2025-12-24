# Invoice Generator Backend

A complete backend API for an invoice generator application built with Node.js, Express, MongoDB, and Google Generative AI.

## Features

- **User Authentication**: Register and login with JWT tokens
- **User Profile Management**: Update profile, upload profile pictures, change password
- **Invoice Management**: Full CRUD operations for invoices
- **AI-Powered Features**: Generate item descriptions and suggestions using Google Gemini AI
- **Auto-generated Invoice Numbers**: Format: INV-YYYY-XXXX
- **File Upload Support**: Profile picture uploads with Multer

## Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Google Generative AI (Gemini)
- Multer for file uploads
- CORS enabled

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/invoice-generator
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. Make sure MongoDB is running on your system

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management (Protected)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile-picture` - Upload profile picture
- `PUT /api/users/change-password` - Change password

### Invoice Management (Protected)
- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - Get all invoices (with pagination)
- `GET /api/invoices/user` - Get user's invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `PATCH /api/invoices/:id/status` - Update invoice status

### AI Features (Protected)
- `POST /api/ai/generate-description` - Generate item description
- `POST /api/ai/suggest-items` - Suggest invoice items

### Health Check
- `GET /api/health` - API health check
- `GET /` - Welcome message

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5001) |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT tokens | Yes |
| GEMINI_API_KEY | Google Gemini API key | No (AI features disabled if not provided) |
| NODE_ENV | Environment (development/production) | No |
| FRONTEND_URL | Frontend URL for CORS | No (default: http://localhost:5173) |

## Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── gemini.js          # Google AI configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── userController.js  # User management logic
│   ├── invoiceController.js # Invoice CRUD logic
│   └── aiController.js    # AI features logic
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Error handling
│   └── upload.js          # File upload configuration
├── models/
│   ├── User.js            # User schema
│   └── Invoice.js         # Invoice schema
├── routes/
│   ├── authRoutes.js      # Auth routes
│   ├── userRoutes.js      # User routes
│   ├── invoiceRoutes.js   # Invoice routes
│   └── aiRoutes.js        # AI routes
├── utils/
│   ├── generateToken.js   # JWT token generation
│   └── invoiceNumber.js   # Invoice number generation
├── uploads/               # Uploaded files directory
├── .env.example           # Environment variables example
├── .gitignore
├── package.json
└── server.js              # Main server file
```

## Notes

- The AI features require a valid Google Gemini API key. If not provided, those endpoints will return a 503 error.
- Profile pictures are stored in the `uploads/` directory and served as static files.
- All protected routes require a valid JWT token in the Authorization header: `Bearer <token>`
- Invoice numbers are auto-generated in the format: INV-YYYY-XXXX (e.g., INV-2024-0001)
