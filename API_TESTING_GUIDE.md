# ATOMIC MEDIA API Testing Guide

## 🧪 Complete API Testing Reference

This file contains all API endpoints with example requests and expected responses.

---

## ✅ Health Check

### Test Server Status
```
GET http://localhost:5000/api/health

Response (200):
{
  "message": "Server is running ✓"
}
```

---

## 📝 Contact Form API (Public)

### Create Lead
```
POST http://localhost:5000/api/leads
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "service": "Web Development",
  "budget": "$10K - $25K",
  "message": "I need a professional website for my online business with e-commerce capability."
}

Valid Services:
- Web Development
- Mobile App
- UI/UX Design
- Branding
- SEO
- Content Writing
- Digital Marketing
- Other

Valid Budget Ranges:
- Under $5K
- $5K - $10K
- $10K - $25K
- $25K - $50K
- $50K+

Response (201):
{
  "message": "Lead created successfully",
  "lead": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-234-567-8900",
    "service": "Web Development",
    "budget": "$10K - $25K",
    "message": "I need a professional website...",
    "status": "New",
    "notes": "",
    "ipAddress": "192.168.1.1",
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z",
    "__v": 0
  }
}

Error Response (400):
{
  "errors": [
    {
      "msg": "Valid email is required",
      "param": "email"
    }
  ]
}
```

---

## 🏢 Project Inquiry API (Public)

### Create Inquiry
```
POST http://localhost:5000/api/inquiries
Content-Type: application/json

Request Body:
{
  "clientName": "Jane Smith",
  "businessName": "Tech Startup Inc",
  "email": "jane@startup.com",
  "phone": "+1-987-654-3210",
  "websiteType": "SaaS Platform",
  "requirements": "We need a custom SaaS platform with user authentication, payment processing, analytics dashboard, and real-time notifications for managing our business operations effectively.",
  "budget": "$25K - $50K",
  "deadline": "3-6 months",
  "contactDetails": {
    "website": "https://startup.com",
    "company": "Tech Startup Inc",
    "location": "San Francisco, CA"
  }
}

Valid Website Types:
- E-commerce
- Corporate Website
- Portfolio
- SaaS Platform
- Blog
- Community
- Other

Valid Budget Ranges:
- Under $5K
- $5K - $10K
- $10K - $25K
- $25K - $50K
- $50K+
- Not sure

Valid Deadlines:
- ASAP
- 1-2 months
- 3-6 months
- 6+ months
- Flexible

Response (201):
{
  "message": "Project inquiry created successfully",
  "inquiry": {
    "_id": "507f1f77bcf86cd799439012",
    "clientName": "Jane Smith",
    "businessName": "Tech Startup Inc",
    "email": "jane@startup.com",
    "phone": "+1-987-654-3210",
    "websiteType": "SaaS Platform",
    "requirements": "We need a custom SaaS platform...",
    "budget": "$25K - $50K",
    "deadline": "3-6 months",
    "contactDetails": {
      "website": "https://startup.com",
      "company": "Tech Startup Inc",
      "location": "San Francisco, CA"
    },
    "status": "New",
    "notes": "",
    "createdAt": "2024-01-20T10:35:00.000Z",
    "updatedAt": "2024-01-20T10:35:00.000Z"
  }
}
```

---

## 🤖 AI Chatbot API (Public)

### Send Chat Message
```
POST http://localhost:5000/api/ai/chat
Content-Type: application/json

Request Body:
{
  "message": "What services do you offer?",
  "conversationHistory": []
}

Response (200):
{
  "reply": "We offer Web Development, Mobile Apps, UI/UX Design, Branding, SEO, Content Writing, and Digital Marketing.",
  "conversationHistory": [
    {
      "user": "What services do you offer?",
      "assistant": "We offer Web Development, Mobile Apps, UI/UX Design, Branding, SEO, Content Writing, and Digital Marketing."
    }
  ],
  "powered": "smart-replies",
  "note": "For OpenAI/Gemini integration, update the AI logic in aiController.js"
}

Suggested Queries That Work Well:
- "What services do you offer?"
- "How much does a website cost?"
- "What is your process?"
- "How long does a project take?"
- "How can I contact you?"
- "Tell me about your team"
- "Hello"
- "Hi"
```

### Get Chat Suggestions
```
GET http://localhost:5000/api/ai/suggestions

Response (200):
{
  "suggestions": [
    "What services do you offer?",
    "How much does a website cost?",
    "What is your process?",
    "How long does a project take?",
    "How can I contact you?",
    "Tell me about your team"
  ]
}
```

---

## 👤 Admin Authentication API

### Register First Admin (One-time only)
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "admin@atomicmedia.com",
  "password": "SecurePassword123",
  "name": "Admin Name"
}

Response (201):
{
  "message": "Admin account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzY5MjAwNTAwMDAwMDAwMDAwMDAwMCIsImVtYWlsIjoiYWRtaW5AZGV4LmNvbSIsImlhdCI6MTcwNjc1NzAwMCwiZXhwIjoxNzA3MzYyMDAwfQ.secret",
  "admin": {
    "id": "507f1f77bcf86cd799439013",
    "email": "admin@atomicmedia.com",
    "name": "Admin Name",
    "role": "super-admin"
  }
}

Error Response (403):
{
  "error": "Admin account already exists. Contact your administrator to create new admin accounts."
}
```

### Admin Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "admin@atomicmedia.com",
  "password": "SecurePassword123"
}

Response (200):
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439013",
    "email": "admin@atomicmedia.com",
    "name": "Admin Name",
    "role": "super-admin"
  }
}

Error Response (401):
{
  "error": "Invalid email or password"
}
```

### Verify Token
```
POST http://localhost:5000/api/auth/verify
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

Response (200):
{
  "message": "Token is valid",
  "admin": {
    "id": "507f1f77bcf86cd799439013",
    "email": "admin@atomicmedia.com",
    "name": "Admin Name",
    "role": "super-admin"
  }
}

Error Response (401):
{
  "error": "Invalid token"
}
```

### Get Admin Profile
```
GET http://localhost:5000/api/auth/profile
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Response (200):
{
  "_id": "507f1f77bcf86cd799439013",
  "email": "admin@atomicmedia.com",
  "name": "Admin Name",
  "role": "super-admin",
  "isActive": true,
  "lastLogin": "2024-01-20T10:30:00.000Z",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z"
}
```

---

## 📊 Admin Leads Management (Protected)

### Get All Leads
```
GET http://localhost:5000/api/leads
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Query Parameters (all optional):
  ?status=New
  ?service=Web Development
  ?search=john
  ?sortBy=-createdAt

Examples:
- Get new leads: /api/leads?status=New
- Get web dev leads: /api/leads?service=Web Development
- Search for John: /api/leads?search=john
- Sort by oldest first: /api/leads?sortBy=createdAt

Response (200):
{
  "count": 3,
  "leads": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-234-567-8900",
      "service": "Web Development",
      "budget": "$10K - $25K",
      "message": "I need a professional website...",
      "status": "New",
      "notes": "Follow up tomorrow",
      "createdAt": "2024-01-20T10:30:00.000Z"
    }
  ]
}
```

### Get Single Lead
```
GET http://localhost:5000/api/leads/507f1f77bcf86cd799439011
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Response (200):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "service": "Web Development",
  "budget": "$10K - $25K",
  "message": "I need a professional website...",
  "status": "New",
  "notes": "",
  "ipAddress": "192.168.1.1",
  "createdAt": "2024-01-20T10:30:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z"
}

Error Response (404):
{
  "error": "Lead not found"
}
```

### Update Lead Status
```
PATCH http://localhost:5000/api/leads/507f1f77bcf86cd799439011
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

Request Body:
{
  "status": "Contacted",
  "notes": "Called the client on 2024-01-20, very interested"
}

Valid Status Values:
- New
- Contacted
- Converted
- Rejected

Response (200):
{
  "message": "Lead updated successfully",
  "lead": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "Contacted",
    "notes": "Called the client on 2024-01-20, very interested",
    "updatedAt": "2024-01-20T11:00:00.000Z"
  }
}
```

### Delete Lead
```
DELETE http://localhost:5000/api/leads/507f1f77bcf86cd799439011
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Response (200):
{
  "message": "Lead deleted successfully"
}

Error Response (404):
{
  "error": "Lead not found"
}
```

---

## 📊 Admin Inquiries Management (Protected)

### Get All Inquiries
```
GET http://localhost:5000/api/inquiries
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Query Parameters (all optional):
  ?status=New
  ?websiteType=E-commerce
  ?search=jane
  ?sortBy=-createdAt

Response (200):
{
  "count": 2,
  "inquiries": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "clientName": "Jane Smith",
      "businessName": "Tech Startup Inc",
      "email": "jane@startup.com",
      "websiteType": "SaaS Platform",
      "budget": "$25K - $50K",
      "deadline": "3-6 months",
      "status": "New",
      "createdAt": "2024-01-20T10:35:00.000Z"
    }
  ]
}
```

### Get Single Inquiry
```
GET http://localhost:5000/api/inquiries/507f1f77bcf86cd799439012
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Response (200):
{
  "_id": "507f1f77bcf86cd799439012",
  "clientName": "Jane Smith",
  "businessName": "Tech Startup Inc",
  "email": "jane@startup.com",
  "phone": "+1-987-654-3210",
  "websiteType": "SaaS Platform",
  "requirements": "We need a custom SaaS platform...",
  "budget": "$25K - $50K",
  "deadline": "3-6 months",
  "status": "New",
  "contactDetails": {
    "website": "https://startup.com",
    "company": "Tech Startup Inc",
    "location": "San Francisco, CA"
  }
}
```

### Update Inquiry Status
```
PATCH http://localhost:5000/api/inquiries/507f1f77bcf86cd799439012
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN
  Content-Type: application/json

Request Body:
{
  "status": "Contacted",
  "notes": "Sent proposal on 2024-01-20"
}

Response (200):
{
  "message": "Inquiry updated successfully",
  "inquiry": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "Contacted",
    "notes": "Sent proposal on 2024-01-20",
    "updatedAt": "2024-01-20T11:00:00.000Z"
  }
}
```

### Delete Inquiry
```
DELETE http://localhost:5000/api/inquiries/507f1f77bcf86cd799439012
Headers:
  Authorization: Bearer YOUR_JWT_TOKEN

Response (200):
{
  "message": "Inquiry deleted successfully"
}
```

---

## 🧬 Using cURL to Test

### Windows PowerShell Examples

#### Create Lead
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    phone = "+1-234-567-8900"
    service = "Web Development"
    budget = "$10K - $25K"
    message = "I need a professional website for my business with e-commerce functionality."
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/leads" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

#### Login Admin
```powershell
$body = @{
    email = "admin@atomicmedia.com"
    password = "SecurePassword123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body

$token = ($response.Content | ConvertFrom-Json).token
Write-Output "Token: $token"
```

#### Get All Leads
```powershell
$token = "YOUR_JWT_TOKEN"

Invoke-WebRequest -Uri "http://localhost:5000/api/leads" `
  -Method GET `
  -Headers @{
    "Content-Type"="application/json"
    "Authorization"="Bearer $token"
  }
```

---

## 📋 Common Error Responses

### 400 Bad Request
```json
{
  "error": "Please provide a name"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Lead not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## ✅ Testing Checklist

- [ ] Health check endpoint works
- [ ] Can create a lead
- [ ] Emails sent to admin on new lead
- [ ] Client receives confirmation email
- [ ] Can create an inquiry
- [ ] Can register first admin
- [ ] Can login as admin
- [ ] Can fetch all leads with token
- [ ] Can update lead status
- [ ] Can delete a lead
- [ ] AI chatbot returns responses
- [ ] All validations working

---

## 🔑 Token Storage

After login, store your token:

```javascript
// Save token
const token = loginResponse.token;
localStorage.setItem('adminToken', token);

// Use token in requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json'
};

// Clear token on logout
localStorage.removeItem('adminToken');
```

---

## 📚 Additional Resources

- [README_BACKEND.md](README_BACKEND.md) - Complete setup guide
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Frontend integration
- Backend folder for source code
