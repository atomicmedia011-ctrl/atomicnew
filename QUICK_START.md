# ATOMIC MEDIA Backend - Quick Start Summary

## 📦 What's Included

✅ **Complete backend structure** ready to deploy
✅ **All APIs** for forms, inquiries, admin, and AI chatbot
✅ **Email notifications** for leads and inquiries
✅ **JWT authentication** with secure password hashing
✅ **MongoDB integration** with Mongoose ODM
✅ **Input validation** and error handling
✅ **Free deployment** ready for Render
✅ **Comprehensive documentation**

---

## 🚀 60-Second Setup

### 1. Setup MongoDB (Free)
```
1. Go to mongodb.com/cloud/atlas
2. Create account → Create cluster (free tier)
3. Create database user
4. Get connection string
```

### 2. Setup Gmail
```
1. Enable 2-Step Verification on Gmail
2. Create App Password for Gmail
3. Copy the 16-character password
```

### 3. Configure Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI and Gmail credentials
npm start
```

**Your backend is ready at:** `http://localhost:5000`

---

## 📍 Where to Add Backend URLs

### In Your Framer Forms:

**Contact Form:**
```
POST http://localhost:5000/api/leads
```

**Project Inquiry Form:**
```
POST http://localhost:5000/api/inquiries
```

**AI Chatbot:**
```
POST http://localhost:5000/api/ai/chat
GET http://localhost:5000/api/ai/suggestions
```

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for exact code.

---

## 🔑 Admin Panel Access

### First-Time Setup
```bash
POST http://localhost:5000/api/auth/register
{
  "email": "your-email@atomicmedia.com",
  "password": "YourSecurePassword",
  "name": "Your Name"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
{
  "email": "your-email@atomicmedia.com",
  "password": "YourSecurePassword"
}
```

Response includes JWT token to manage leads/inquiries.

---

## 📊 All API Endpoints

### Public (No Authentication Required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/leads` | Submit contact form |
| POST | `/api/inquiries` | Submit project inquiry |
| POST | `/api/ai/chat` | Chat with AI |
| GET | `/api/ai/suggestions` | Get chat suggestions |

### Admin Only (JWT Required)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register first admin |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/verify` | Verify JWT token |
| GET | `/api/auth/profile` | Get admin profile |
| GET | `/api/leads` | View all leads |
| GET | `/api/leads/:id` | View single lead |
| PATCH | `/api/leads/:id` | Update lead status |
| DELETE | `/api/leads/:id` | Delete lead |
| GET | `/api/inquiries` | View all inquiries |
| GET | `/api/inquiries/:id` | View single inquiry |
| PATCH | `/api/inquiries/:id` | Update inquiry status |
| DELETE | `/api/inquiries/:id` | Delete inquiry |

---

## 📁 File Structure Created

```
backend/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env.example              # Environment template
├── config/
│   └── db.js                # MongoDB connection
├── models/
│   ├── Lead.js              # Contact form schema
│   ├── Inquiry.js           # Project inquiry schema
│   └── Admin.js             # Admin user schema
├── controllers/
│   ├── leadController.js    # Lead logic
│   ├── inquiryController.js # Inquiry logic
│   ├── authController.js    # Auth logic
│   └── aiController.js      # AI chatbot logic
├── routes/
│   ├── leadRoutes.js        # Lead endpoints
│   ├── inquiryRoutes.js     # Inquiry endpoints
│   ├── authRoutes.js        # Auth endpoints
│   └── aiRoutes.js          # AI endpoints
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   └── errorMiddleware.js   # Error handling
└── utils/
    └── sendEmail.js         # Email sending
```

---

## 🧪 Quick Testing

### Test All Endpoints:

```bash
# 1. Check server health
curl http://localhost:5000/api/health

# 2. Create a test lead
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "1234567890",
    "service": "Web Development",
    "budget": "$10K - $25K",
    "message": "This is a test message with at least 10 characters."
  }'

# 3. Create a test inquiry
curl -X POST http://localhost:5000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test Client",
    "businessName": "Test Business",
    "email": "client@example.com",
    "phone": "1234567890",
    "websiteType": "E-commerce",
    "requirements": "Need a complete e-commerce solution with at least twenty characters of requirements.",
    "budget": "$10K - $25K",
    "deadline": "3-6 months"
  }'

# 4. Test AI chat
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What services do you offer?"}'
```

See [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md) for full testing documentation.

---

## 🚢 Deploy to Render (Free)

### Step-by-Step:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "ATOMIC MEDIA backend"
   git push origin main
   ```

2. **Go to Render.com**
   - Sign up with GitHub
   - Create New → Web Service
   - Connect your repo
   - Fill in settings:
     - **Name:** atomic-media-backend
     - **Build:** `npm install`
     - **Start:** `npm start`

3. **Add Environment Variables**
   - Copy all from `.env` file
   - Update `FRONTEND_URL` to your Framer site

4. **Deploy** 🎉

Your production URL: `https://atomic-media-backend.onrender.com`

---

## ✅ Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string working
- [ ] Gmail account setup with App Password
- [ ] `.env` file configured locally
- [ ] All forms tested locally
- [ ] Backend running without errors
- [ ] Emails sending successfully
- [ ] Admin can login
- [ ] Leads can be viewed in admin panel
- [ ] GitHub repo created and code pushed
- [ ] Render account setup
- [ ] Environment variables added to Render
- [ ] Production backend URL working
- [ ] Frontend updated with production URL
- [ ] Final end-to-end testing done

---

## 📧 Email Configuration Tips

**Problem:** Emails not sending?

1. **Check Gmail:**
   - Is 2FA enabled? ✓
   - Is App Password generated? ✓
   - Using App Password (not regular password)? ✓

2. **Check .env:**
   - `EMAIL_USER` is your Gmail address
   - `EMAIL_PASS` is 16-character App Password
   - `ADMIN_EMAIL` is where notifications go

3. **Check logs:**
   ```bash
   # Look for email sending logs in console
   npm run dev  # Run in development mode
   ```

---

## 🔒 Security Notes

✅ **Passwords:** Hashed with bcrypt (10 rounds)
✅ **Tokens:** JWT with expiration (7 days)
✅ **Validation:** All inputs validated
✅ **CORS:** Restricted to frontend origin
✅ **Error Messages:** Don't leak sensitive info
✅ **Environment Variables:** Never hardcoded

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| "Cannot connect to MongoDB" | Check connection string in `.env` |
| "CORS error" | Add frontend URL to `FRONTEND_URL` in `.env` |
| "Emails not sending" | Use Gmail App Password, enable 2FA |
| "Invalid token" | Token expired, user needs to login again |
| "Form validation fails" | Check field names match exactly |

See [README_BACKEND.md](README_BACKEND.md) for more troubleshooting.

---

## 📚 Documentation Files

1. **[README_BACKEND.md](README_BACKEND.md)**
   - Complete setup and deployment guide
   - All API documentation
   - Troubleshooting guide

2. **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)**
   - How to connect frontend to backend
   - Code examples for each form
   - Framer-specific instructions

3. **[API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)**
   - All endpoint details
   - Request/response examples
   - Testing checklist

---

## 🎯 Next Steps

1. ✅ **Run backend locally** - Test everything works
2. ✅ **Connect Framer forms** - Use INTEGRATION_GUIDE.md
3. ✅ **Test end-to-end** - Submit forms, check emails
4. ✅ **Deploy to Render** - Follow deployment section
5. ✅ **Update frontend URL** - Point to production backend
6. ✅ **Go live!** - Monitor for issues

---

## 💡 Future Enhancements

Ready for:
- OpenAI/Gemini AI integration
- Payment processing (Stripe)
- Advanced analytics
- SMS notifications (Twilio)
- File uploads
- Rate limiting
- Advanced admin dashboard

---

## 📞 Support Resources

- **Error logs:** Check browser console (F12)
- **Backend logs:** Check terminal/console
- **MongoDB Atlas:** Check connection metrics
- **Gmail:** Verify App Password settings
- **Documentation:** All guides in root folder

---

## ✨ You're All Set!

Your ATOMIC MEDIA backend is complete and ready to:
- ✅ Receive leads from contact forms
- ✅ Process project inquiries
- ✅ Send email notifications
- ✅ Manage admin dashboard
- ✅ Power AI chatbot
- ✅ Deploy globally

**Start now:**
```bash
cd backend
npm install
npm start
```

---

**Created:** 2024
**Version:** 1.0.0
**Status:** Production Ready ✓
