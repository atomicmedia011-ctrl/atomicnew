# ATOMIC MEDIA Backend - Complete Setup Guide

## 📋 Overview

This is a production-ready Node.js/Express backend for ATOMIC MEDIA's website. It includes:
- Contact Form API
- Project Inquiry API
- Admin Authentication & Management Panel
- Email Notifications
- AI Chatbot Backend
- Full validation & error handling
- JWT Authentication
- MongoDB integration

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas Account (free tier)
- Gmail Account (for email notifications)
- Code Editor (VS Code recommended)

### Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Go to **Database Access** and create a username/password
5. Go to **Network Access** and add your IP (or 0.0.0.0 for anywhere)
6. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/atomic-media?retryWrites=true&w=majority`

### Step 2: Setup Gmail for Emails

1. Use your Gmail account
2. Generate an **App Password** (2FA must be enabled):
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Go to App Passwords > Mail > Windows/Linux
   - Copy the 16-character password
3. Use this password in `.env` as `EMAIL_PASS`

### Step 3: Install & Configure Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values
# - MONGODB_URI
# - EMAIL_USER (your Gmail)
# - EMAIL_PASS (app password)
# - JWT_SECRET (create a random string)
# - FRONTEND_URL (where your Framer site is hosted)
```

### Step 4: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
╔═══════════════════════════════════════╗
║   ATOMIC MEDIA Backend Server Started   ║
║   Port: 5000                          ║
║   Environment: development            ║
╚═══════════════════════════════════════╝
```

---

## 🔗 Connect Frontend to Backend

In your Framer frontend, update your form submission URLs to point to your backend:

### For Contact Form:
```javascript
// Replace with your backend URL
const BACKEND_URL = "http://localhost:5000"; // or your Render URL

// When form is submitted:
fetch(`${BACKEND_URL}/api/leads`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    service: formData.service,
    budget: formData.budget,
    message: formData.message,
  }),
})
```

### For Project Inquiry Form:
```javascript
fetch(`${BACKEND_URL}/api/inquiries`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    clientName: formData.clientName,
    businessName: formData.businessName,
    email: formData.email,
    phone: formData.phone,
    websiteType: formData.websiteType,
    requirements: formData.requirements,
    budget: formData.budget,
    deadline: formData.deadline,
    contactDetails: {
      website: formData.website || "",
      company: formData.company || "",
      location: formData.location || "",
    },
  }),
})
```

### For AI Chatbot:
```javascript
fetch(`${BACKEND_URL}/api/ai/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: userMessage,
    conversationHistory: previousMessages, // optional
  }),
})
```

---

## 📡 API Endpoints

### ✅ Contact Form API (Public)

#### Create Lead
**POST** `/api/leads`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "service": "Web Development",
  "budget": "$10K - $25K",
  "message": "I need a professional website for my business..."
}
```

Response (201):
```json
{
  "message": "Lead created successfully",
  "lead": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "New",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

### ✅ Project Inquiry API (Public)

#### Create Inquiry
**POST** `/api/inquiries`

Request:
```json
{
  "clientName": "Jane Smith",
  "businessName": "Tech Startup Inc",
  "email": "jane@startup.com",
  "phone": "+1-234-567-8900",
  "websiteType": "SaaS Platform",
  "requirements": "We need an e-commerce platform with payment integration, user dashboard, and analytics...",
  "budget": "$25K - $50K",
  "deadline": "3-6 months",
  "contactDetails": {
    "website": "https://startup.com",
    "company": "Tech Startup Inc",
    "location": "San Francisco, CA"
  }
}
```

Response (201):
```json
{
  "message": "Project inquiry created successfully",
  "inquiry": {
    "_id": "65abc456...",
    "clientName": "Jane Smith",
    "status": "New",
    "createdAt": "2024-01-20T10:35:00Z"
  }
}
```

---

### 🤖 AI Chatbot API (Public)

#### Send Message
**POST** `/api/ai/chat`

Request:
```json
{
  "message": "What services do you offer?",
  "conversationHistory": []
}
```

Response (200):
```json
{
  "reply": "We offer Web Development, Mobile Apps, UI/UX Design, Branding, SEO, Content Writing, and Digital Marketing.",
  "conversationHistory": [
    {
      "user": "What services do you offer?",
      "assistant": "We offer Web Development, Mobile Apps, UI/UX Design..."
    }
  ],
  "powered": "smart-replies",
  "note": "For OpenAI/Gemini integration, update the AI logic in aiController.js"
}
```

#### Get Chat Suggestions
**GET** `/api/ai/suggestions`

Response (200):
```json
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

### 👤 Admin Authentication API (Protected)

#### Register First Admin (One-time setup)
**POST** `/api/auth/register`

Request:
```json
{
  "email": "admin@atomicmedia.com",
  "password": "SecurePassword123",
  "name": "Admin Name"
}
```

Response (201):
```json
{
  "message": "Admin account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "65abc789...",
    "email": "admin@atomicmedia.com",
    "name": "Admin Name",
    "role": "super-admin"
  }
}
```

#### Admin Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "admin@atomicmedia.com",
  "password": "SecurePassword123"
}
```

Response (200):
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "65abc789...",
    "email": "admin@atomicmedia.com",
    "name": "Admin Name",
    "role": "super-admin"
  }
}
```

#### Verify Token
**POST** `/api/auth/verify`

Headers: `Authorization: Bearer YOUR_JWT_TOKEN`

Response (200):
```json
{
  "message": "Token is valid",
  "admin": {
    "id": "65abc789...",
    "email": "admin@atomicmedia.com",
    "name": "Admin Name",
    "role": "super-admin"
  }
}
```

#### Get Admin Profile
**GET** `/api/auth/profile`

Headers: `Authorization: Bearer YOUR_JWT_TOKEN`

---

### 📊 Admin Leads Management API (Protected)

All these endpoints require JWT token in header: `Authorization: Bearer YOUR_TOKEN`

#### Get All Leads
**GET** `/api/leads?status=New&service=Web Development&search=John&sortBy=-createdAt`

Query Parameters:
- `status`: Filter by status (New, Contacted, Converted, Rejected)
- `service`: Filter by service type
- `search`: Search in name, email, phone
- `sortBy`: Sort field (default: -createdAt)

Response (200):
```json
{
  "count": 5,
  "leads": [
    {
      "_id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-234-567-8900",
      "service": "Web Development",
      "status": "New",
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ]
}
```

#### Get Single Lead
**GET** `/api/leads/:id`

#### Update Lead Status
**PATCH** `/api/leads/:id`

Request:
```json
{
  "status": "Contacted",
  "notes": "Called the client on 2024-01-20"
}
```

#### Delete Lead
**DELETE** `/api/leads/:id`

---

### 📊 Admin Inquiries Management API (Protected)

All these endpoints require JWT token in header: `Authorization: Bearer YOUR_TOKEN`

#### Get All Inquiries
**GET** `/api/inquiries?status=New&websiteType=E-commerce&search=Jane&sortBy=-createdAt`

Query Parameters:
- `status`: Filter by status
- `websiteType`: Filter by website type
- `search`: Search in clientName, businessName, email
- `sortBy`: Sort field

#### Get Single Inquiry
**GET** `/api/inquiries/:id`

#### Update Inquiry Status
**PATCH** `/api/inquiries/:id`

Request:
```json
{
  "status": "Contacted",
  "notes": "Sent proposal"
}
```

#### Delete Inquiry
**DELETE** `/api/inquiries/:id`

---

## 🔐 Admin Dashboard URL

After setting up the backend, you'll need to create an admin dashboard to manage leads. Here's a simple example:

```javascript
const adminToken = localStorage.getItem('adminToken');

// Fetch all leads
fetch('http://localhost:5000/api/leads', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
})
.then(res => res.json())
.then(data => console.log(data.leads));

// Update lead status
fetch('http://localhost:5000/api/leads/65abc123.../update', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    status: 'Contacted',
    notes: 'Called client'
  })
})
```

---

## 🚢 Deploy to Render (Free Tier)

### Step 1: Prepare Repository
```bash
# Create .gitignore
echo "node_modules/
.env
.env.local" > .gitignore

# Initialize git repo (if not already)
git init
git add .
git commit -m "Initial commit: ATOMIC MEDIA backend"
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create New → Web Service
4. Connect your GitHub repository
5. Fill in:
   - **Name**: atomic-media-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - Copy all values from your `.env` file
   - Update `FRONTEND_URL` to your Framer site URL
7. Click Deploy

**Your backend URL will be**: `https://atomic-media-backend.onrender.com`

---

## 📧 Email Configuration

### Gmail App Password Setup (Recommended):

1. Enable 2-Step Verification on your Gmail
2. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
3. Find "App passwords" section
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Use in `.env` as `EMAIL_PASS`

**Note**: Regular Gmail passwords won't work. You must use an App Password.

### Alternative Email Services:

You can modify `utils/sendEmail.js` to use:
- SendGrid
- Mailgun
- Postmark
- AWS SES

---

## 🔒 Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | Random string (min 32 chars) |
| `JWT_EXPIRE` | Token expiration time | `7d` |
| `EMAIL_USER` | Gmail address for sending emails | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail app password | 16-character password |
| `ADMIN_EMAIL` | Email to receive notifications | `admin@atomicmedia.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

---

## ✅ Validation Rules

### Contact Form (Leads):
- **Name**: Required, min 2 characters
- **Email**: Valid email format required
- **Phone**: Required
- **Service**: Must be from predefined list
- **Budget**: Must be from predefined ranges
- **Message**: Min 10 characters, max 2000

### Project Inquiry:
- **Client Name**: Required, min 2 characters
- **Business Name**: Required
- **Email**: Valid email required
- **Phone**: Required
- **Website Type**: Must be from predefined list
- **Requirements**: Min 20 characters, max 3000
- **Budget**: Must be from predefined ranges
- **Deadline**: Must be from predefined options

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### MongoDB Connection Error
- Check MongoDB URI in `.env`
- Verify network access on MongoDB Atlas
- Ensure your IP is whitelisted

### Email Not Sending
- Use Gmail App Password, not regular password
- Enable 2-Step Verification on Gmail
- Check `.env` EMAIL_USER and EMAIL_PASS

### CORS Error
- Add your frontend URL to `FRONTEND_URL` in `.env`
- Update CORS list in `server.js` if needed

### Token Expired
- Tokens expire after 7 days (configurable via JWT_EXPIRE)
- User needs to login again

---

## 🔄 Future Enhancements

The backend is ready for:
1. **OpenAI Integration**: Update `controllers/aiController.js`
2. **Google Gemini Integration**: Add API key and logic
3. **Payment Gateway**: Stripe or Razorpay
4. **Analytics Dashboard**: Track lead sources and conversions
5. **API Rate Limiting**: Prevent spam
6. **File Upload**: Resume/portfolio uploads
7. **SMS Notifications**: Twilio integration

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review endpoint documentation
3. Check console logs for error messages
4. Verify all environment variables are set correctly

---

## 📄 License

This backend is part of ATOMIC MEDIA project.

**Created**: 2024
**Version**: 1.0.0
