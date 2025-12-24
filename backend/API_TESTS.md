# Invoice Generator API - Test Collection

This file contains sample API requests for testing all endpoints.

## Environment Variables
- `BASE_URL`: http://localhost:5001/api
- `TOKEN`: (Set after login/register)

---

## Authentication

### Register User
```http
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Login User
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

---

## User Profile

### Get Profile
```http
GET {{BASE_URL}}/users/profile
Authorization: Bearer {{TOKEN}}
```

### Update Profile
```http
PUT {{BASE_URL}}/users/profile
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "John Doe Updated",
  "businessName": "Doe Enterprises",
  "businessAddress": "456 Business Ave, Suite 100",
  "phone": "+1-555-0123"
}
```

### Upload Profile Picture
```http
POST {{BASE_URL}}/users/profile-picture
Authorization: Bearer {{TOKEN}}
Content-Type: multipart/form-data

profilePicture: (select file)
```

### Change Password
```http
PUT {{BASE_URL}}/users/change-password
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

---

## Invoices

### Create Invoice
```http
POST {{BASE_URL}}/invoices
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "clientName": "Acme Corporation",
  "clientEmail": "billing@acme.com",
  "clientAddress": "789 Client Street, Business City, ST 12345",
  "items": [
    {
      "description": "Website Development",
      "quantity": 1,
      "price": 5000
    },
    {
      "description": "SEO Optimization",
      "quantity": 3,
      "price": 500
    },
    {
      "description": "Content Writing",
      "quantity": 10,
      "price": 100
    }
  ],
  "tax": 650,
  "discount": 150,
  "issueDate": "2024-12-24",
  "dueDate": "2025-01-24",
  "notes": "Payment terms: Net 30 days. Late payment subject to 1.5% monthly interest.",
  "status": "draft"
}
```

### Get All Invoices (with pagination)
```http
GET {{BASE_URL}}/invoices?page=1&limit=10
Authorization: Bearer {{TOKEN}}
```

### Get All Invoices (filtered by status)
```http
GET {{BASE_URL}}/invoices?status=draft&page=1&limit=10
Authorization: Bearer {{TOKEN}}
```

### Get User's Invoices
```http
GET {{BASE_URL}}/invoices/user?page=1&limit=10
Authorization: Bearer {{TOKEN}}
```

### Get User's Invoices (filtered)
```http
GET {{BASE_URL}}/invoices/user?status=paid&page=1&limit=10
Authorization: Bearer {{TOKEN}}
```

### Get Invoice by ID
```http
GET {{BASE_URL}}/invoices/{{INVOICE_ID}}
Authorization: Bearer {{TOKEN}}
```

### Update Invoice
```http
PUT {{BASE_URL}}/invoices/{{INVOICE_ID}}
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "clientName": "Acme Corporation Updated",
  "items": [
    {
      "description": "Website Development (Updated)",
      "quantity": 1,
      "price": 5500
    }
  ],
  "tax": 550,
  "discount": 100,
  "status": "sent"
}
```

### Update Invoice Status
```http
PATCH {{BASE_URL}}/invoices/{{INVOICE_ID}}/status
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "status": "paid"
}
```

### Delete Invoice
```http
DELETE {{BASE_URL}}/invoices/{{INVOICE_ID}}
Authorization: Bearer {{TOKEN}}
```

---

## AI Features

### Generate Item Description
```http
POST {{BASE_URL}}/ai/generate-description
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "itemName": "Website Maintenance"
}
```

### Suggest Items by Business Type
```http
POST {{BASE_URL}}/ai/suggest-items
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "businessType": "Web Development Agency"
}
```

---

## Utility

### Health Check
```http
GET {{BASE_URL}}/health
```

### Welcome Message
```http
GET http://localhost:5001/
```

---

## Notes

1. **Authentication Flow:**
   - Register or login to get a JWT token
   - Copy the token from the response
   - Use it in the Authorization header for protected routes

2. **Invoice Status Values:**
   - `draft` - Invoice is being created
   - `sent` - Invoice has been sent to client
   - `paid` - Invoice has been paid
   - `overdue` - Invoice is past due date

3. **Pagination:**
   - Default page: 1
   - Default limit: 10
   - Response includes pagination metadata

4. **File Upload:**
   - Supported formats: JPEG, JPG, PNG, GIF, WebP
   - Max file size: 5MB
   - Use multipart/form-data content type

5. **AI Features:**
   - Requires GEMINI_API_KEY in .env file
   - Returns 503 if API key not configured
   - Graceful fallback with error message
