# 🗂️ Complete Backend File Structure & Reference

## Project Layout

```
breakable_works_007788.framer.app/
│
├── 📚 DOCUMENTATION (Read these first!)
│   ├── README_BACKEND.md               ← START HERE - Complete guide
│   ├── QUICK_START.md                  ← 60-second setup
│   ├── SETUP_CHECKLIST.md              ← Progress tracker
│   ├── INTEGRATION_GUIDE.md            ← Connect to Framer
│   ├── EXACT_INTEGRATION_LOCATIONS.md  ← Where to add URLs
│   ├── API_TESTING_GUIDE.md            ← Test all endpoints
│   └── FILE_STRUCTURE.md               ← This file
│
├── 🎨 EXISTING FRAMER FRONTEND (Don't touch!)
│   ├── breakable-works-007788.framer.app/
│   ├── index.html
│   ├── _DataURI/                       ← Assets
│   ├── app.framerstatic.com/           ← Dependencies
│   └── [other frontend files]
│
└── 🔧 BACKEND APPLICATION ← YOU ARE HERE
    └── backend/
        │
        ├── 📄 Core Files
        │   ├── server.js               ← Main application (PORT 5000)
        │   ├── package.json            ← Dependencies manifest
        │   ├── .env.example            ← Environment template
        │   └── .env                    ← Your secrets (create from .env.example)
        │
        ├── ⚙️ Configuration
        │   └── config/
        │       └── db.js               ← MongoDB connection setup
        │
        ├── 📊 Database Models (Schemas)
        │   └── models/
        │       ├── Lead.js             ← Contact form data structure
        │       ├── Inquiry.js          ← Project inquiry data structure
        │       └── Admin.js            ← Admin user data structure
        │
        ├── 🎯 Route Handlers (API Endpoints)
        │   └── routes/
        │       ├── leadRoutes.js       ← POST /api/leads, GET /api/leads, etc.
        │       ├── inquiryRoutes.js    ← POST /api/inquiries, GET /api/inquiries, etc.
        │       ├── authRoutes.js       ← POST /api/auth/login, /register, etc.
        │       └── aiRoutes.js         ← POST /api/ai/chat, GET /api/ai/suggestions
        │
        ├── 💼 Business Logic (Controllers)
        │   └── controllers/
        │       ├── leadController.js   ← Lead CRUD operations
        │       ├── inquiryController.js← Inquiry CRUD operations
        │       ├── authController.js   ← Login & authentication logic
        │       └── aiController.js     ← AI response generation
        │
        ├── 🔐 Middleware (Processing)
        │   └── middleware/
        │       ├── authMiddleware.js   ← JWT token verification
        │       └── errorMiddleware.js  ← Error handling & formatting
        │
        └── 🛠️ Utilities (Helpers)
            └── utils/
                └── sendEmail.js        ← Gmail notification sender

```

---

## 📄 File-by-File Explanation

### 🔴 CORE APPLICATION

#### `backend/server.js`
**What:** Main Express application
**Does:** 
- Starts the server on PORT 5000
- Connects to MongoDB
- Sets up CORS for frontend
- Registers all API routes
- Handles errors

**Key lines:**
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { /* server starts */ });
```

---

#### `backend/package.json`
**What:** Node.js dependency manifest
**Does:**
- Lists all npm packages needed
- Specifies Node.js version
- Defines start commands

**Important packages:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT auth
- `bcrypt` - Password hashing
- `nodemailer` - Email sending

---

#### `backend/.env`
**What:** Environment variables (YOUR SECRETS - Never commit!)
**Must contain:**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=app-password
```

---

### 🟢 CONFIGURATION

#### `backend/config/db.js`
**What:** MongoDB connection manager
**Does:**
- Connects to MongoDB Atlas
- Handles connection errors
- Called by server.js on startup

**Function:** `connectDB()`

---

### 🔵 DATA MODELS

#### `backend/models/Lead.js`
**What:** Contact Form data structure
**Fields:**
- `name` (required) - Client name
- `email` (required) - Contact email
- `phone` (required) - Phone number
- `service` (required) - Service selected
- `budget` (required) - Budget range
- `message` (required) - Inquiry message
- `status` - New/Contacted/Converted/Rejected
- `notes` - Admin notes
- `timestamps` - Created/updated dates

---

#### `backend/models/Inquiry.js`
**What:** Project Inquiry data structure
**Fields:**
- `clientName`, `businessName`, `email`, `phone` - Contact info
- `websiteType` - Type of website needed
- `requirements` - Detailed requirements
- `budget`, `deadline` - Project constraints
- `contactDetails` - Extra contact info
- `status` - Lead status
- `timestamps` - Dates

---

#### `backend/models/Admin.js`
**What:** Admin user data structure
**Fields:**
- `email` (unique) - Login email
- `password` (hashed) - Secured password
- `name` - Admin full name
- `role` - super-admin or admin
- `isActive` - Account status
- `lastLogin` - Last login timestamp
- `timestamps` - Account creation/update dates

**Methods:**
- `comparePassword()` - Verify login password
- Pre-save hook - Automatically hashes password

---

### 🟡 API ROUTES

#### `backend/routes/leadRoutes.js`
**What:** Contact form API endpoints
**Endpoints:**
```
POST   /api/leads              Create new lead (PUBLIC)
GET    /api/leads              Get all leads (ADMIN only)
GET    /api/leads/:id          Get one lead (ADMIN only)
PATCH  /api/leads/:id          Update lead status (ADMIN only)
DELETE /api/leads/:id          Delete lead (ADMIN only)
```

---

#### `backend/routes/inquiryRoutes.js`
**What:** Project inquiry API endpoints
**Endpoints:**
```
POST   /api/inquiries          Create inquiry (PUBLIC)
GET    /api/inquiries          Get all inquiries (ADMIN only)
GET    /api/inquiries/:id      Get one inquiry (ADMIN only)
PATCH  /api/inquiries/:id      Update inquiry status (ADMIN only)
DELETE /api/inquiries/:id      Delete inquiry (ADMIN only)
```

---

#### `backend/routes/authRoutes.js`
**What:** Authentication API endpoints
**Endpoints:**
```
POST   /api/auth/register      Register first admin (PUBLIC - one time)
POST   /api/auth/login         Admin login (PUBLIC)
POST   /api/auth/verify        Verify JWT token (ADMIN only)
GET    /api/auth/profile       Get admin profile (ADMIN only)
```

---

#### `backend/routes/aiRoutes.js`
**What:** AI chatbot API endpoints
**Endpoints:**
```
POST   /api/ai/chat            Send message to AI (PUBLIC)
GET    /api/ai/suggestions     Get chat suggestions (PUBLIC)
```

---

### 🟠 BUSINESS LOGIC

#### `backend/controllers/leadController.js`
**What:** Lead management logic
**Functions:**
- `createLead()` - Save form submission, send emails
- `getAllLeads()` - Fetch leads with filters
- `getSingleLead()` - Get one lead details
- `updateLeadStatus()` - Change status & add notes
- `deleteLead()` - Remove lead

---

#### `backend/controllers/inquiryController.js`
**What:** Inquiry management logic
**Functions:** (Similar to leadController)
- `createInquiry()`
- `getAllInquiries()`
- `getSingleInquiry()`
- `updateInquiryStatus()`
- `deleteInquiry()`

---

#### `backend/controllers/authController.js`
**What:** Authentication logic
**Functions:**
- `registerAdmin()` - Create first admin (one-time)
- `loginAdmin()` - Authenticate & generate JWT
- `verifyToken()` - Check token validity
- `getProfile()` - Return admin info

---

#### `backend/controllers/aiController.js`
**What:** AI chatbot logic
**Functions:**
- `chatWithAI()` - Process message & return response
- `getChatSuggestions()` - Return suggested questions

**Current:** Smart replies (ready for OpenAI/Gemini)

---

### 🔐 MIDDLEWARE

#### `backend/middleware/authMiddleware.js`
**What:** JWT token verification
**Does:**
- Checks if request has valid JWT token
- Decodes token & extracts admin ID
- Returns 401 if token invalid/missing
- Attaches admin info to request object

**Usage:** Applied to all admin-only routes

---

#### `backend/middleware/errorMiddleware.js`
**What:** Global error handler
**Does:**
- Catches all errors from other middleware
- Formats error messages
- Returns appropriate status codes
- Handles MongoDB errors specially

**Error types handled:**
- Validation errors (400)
- Auth errors (401)
- Not found errors (404)
- Server errors (500)

---

### 🛠️ UTILITIES

#### `backend/utils/sendEmail.js`
**What:** Email sending utility
**Functions:**
- `sendAdminNotification()` - Email to you when lead arrives
- `sendClientConfirmation()` - Email to client confirming receipt

**Email provider:** Gmail (via nodemailer)

---

## 📊 Data Flow Diagrams

### Contact Form Submission Flow
```
1. User fills form in Framer
           ↓
2. Form data sent to: POST /api/leads
           ↓
3. leadRoutes.js validates input
           ↓
4. leadController.createLead() processes
           ↓
5. Lead.js schema saves to MongoDB
           ↓
6. sendEmail.js sends notifications
           ↓
7. Response sent back to Framer
           ↓
8. User sees confirmation message
```

### Admin Login Flow
```
1. Admin enters email/password
           ↓
2. POST /api/auth/login
           ↓
3. authController.loginAdmin() processes
           ↓
4. Admin.js finds user & verifies password
           ↓
5. JWT token generated
           ↓
6. Token sent to admin (stored in localStorage)
           ↓
7. Admin uses token for API requests
           ↓
8. authMiddleware.js verifies token on each request
```

---

## 🔄 Request/Response Cycle

### Example: Creating a Lead

**REQUEST:**
```
POST /api/leads
Content-Type: application/json
Body: {
  "name": "John",
  "email": "john@example.com",
  "phone": "123456",
  "service": "Web Development",
  "budget": "$10K - $25K",
  "message": "I need a website..."
}
```

**JOURNEY:**
1. `server.js` receives request
2. `leadRoutes.js` matches POST /api/leads
3. `leadController.createLead()` validates & processes
4. `Lead.js` saves to MongoDB
5. `sendEmail.js` sends emails
6. Response created

**RESPONSE:**
```
Status: 201 Created
Body: {
  "message": "Lead created successfully",
  "lead": {
    "_id": "507f...",
    "name": "John",
    "status": "New",
    ...
  }
}
```

---

## 🔑 Key Concepts

### Authentication (JWT)
1. Admin logs in → gets token
2. Token sent with each admin request
3. `authMiddleware.js` verifies token
4. If valid → request proceeds
5. If invalid → 401 Unauthorized error

### Validation
- `express-validator` checks input before saving
- Invalid data returns 400 error with details
- Prevents bad data in MongoDB

### Error Handling
- `errorMiddleware.js` catches all errors
- Formats them nicely
- Returns appropriate HTTP status codes

### Email Notifications
- When lead created → email to admin
- When lead created → confirmation to client
- Uses Gmail SMTP (requires App Password)

---

## 📈 Scaling Path

**Current (Ready Now):**
- Single admin
- Smart AI replies
- Basic email notifications

**Next Steps (Easy to Add):**
1. Multiple admins (add Admin.js permissions)
2. OpenAI integration (update aiController.js)
3. Rate limiting (add middleware)
4. Advanced filtering (update controllers)

**Future (Possible Later):**
1. Payment processing (Stripe)
2. Analytics dashboard
3. SMS notifications
4. File uploads
5. Advanced admin UI

---

## 🧪 Testing Each Component

### Test Database Connection
```bash
# In server.js, check MongoDB connected message
npm start
# Should see: ✓ MongoDB connected: cluster.mongodb.net
```

### Test Email Sending
```javascript
// Call from controller to test
const { sendAdminNotification } = require('../utils/sendEmail');
await sendAdminNotification({
  name: "Test",
  email: "test@test.com"
}, 'lead');
```

### Test JWT Auth
```bash
# Get token from login response
# Add to next request: Authorization: Bearer TOKEN
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/leads
```

---

## 🚀 Deployment File Changes Needed

When deploying to Render:

1. **No code changes** - Works as-is!
2. **Update .env on Render:**
   - Same format as local .env
   - `FRONTEND_URL` → your Framer domain

3. **No database changes:**
   - MongoDB Atlas works globally
   - Same connection string

4. **No route changes:**
   - All endpoints work on Render
   - URL just changes: localhost:5000 → app.onrender.com

---

## 📋 File Dependencies

```
server.js
  ├── Requires: all routes, db, middleware
  ├── Uses: express, cors, dotenv
  └── Starts: port 5000

leadRoutes.js
  ├── Requires: leadController, authMiddleware
  ├── Uses: express-validator
  └── Endpoints: /api/leads/*

leadController.js
  ├── Requires: Lead model, sendEmail utils
  ├── Uses: mongoose, validation
  └── Functions: CRUD operations

Lead.js (Model)
  ├── Uses: mongoose
  ├── Defines: schema, validations
  └── Methods: save, find, update, delete
```

---

## ✨ Summary Table

| File | Type | Purpose | Important |
|------|------|---------|-----------|
| server.js | Core | Application entry | ✅ Don't modify |
| package.json | Core | Dependencies | ⚠️ Install packages |
| .env | Config | Secrets | 🔐 KEEP PRIVATE |
| db.js | Config | MongoDB setup | ✅ Works as-is |
| Lead.js | Model | Contact data | ✅ Ready |
| Inquiry.js | Model | Inquiry data | ✅ Ready |
| Admin.js | Model | User data | ✅ Ready |
| leadRoutes.js | Route | /api/leads endpoints | ✅ Ready |
| inquiryRoutes.js | Route | /api/inquiries endpoints | ✅ Ready |
| authRoutes.js | Route | /api/auth endpoints | ✅ Ready |
| aiRoutes.js | Route | /api/ai endpoints | ✅ Ready |
| leadController.js | Logic | Lead operations | ✅ Ready |
| inquiryController.js | Logic | Inquiry operations | ✅ Ready |
| authController.js | Logic | Auth operations | ✅ Ready |
| aiController.js | Logic | AI operations | ✅ Ready |
| authMiddleware.js | Middleware | JWT verification | ✅ Ready |
| errorMiddleware.js | Middleware | Error handling | ✅ Ready |
| sendEmail.js | Utility | Email sending | ⚠️ Test emails |

---

## 🎯 Quick Reference

**Start backend:** `npm start`

**Install packages:** `npm install`

**Main server file:** `backend/server.js`

**API routes:** `backend/routes/`

**Business logic:** `backend/controllers/`

**Data schemas:** `backend/models/`

**Security:** `backend/middleware/`

**Utilities:** `backend/utils/`

---

## ✅ You Now Understand

✓ What each file does
✓ How they connect
✓ Data flow from request to response
✓ Where to make changes
✓ How to deploy

**Next:** Read [README_BACKEND.md](README_BACKEND.md) for complete API documentation.

---

**File Structure Reference** ✨
Created: 2024 | Version: 1.0.0
