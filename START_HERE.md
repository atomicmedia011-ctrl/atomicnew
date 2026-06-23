# 🎯 START HERE - ATOMIC MEDIA Backend Setup

## ✨ What You Have

A **complete, production-ready Node.js backend** for your ATOMIC MEDIA Framer website with:
- ✅ Contact form handling
- ✅ Project inquiry system
- ✅ Admin authentication
- ✅ Email notifications
- ✅ AI chatbot
- ✅ Free deployment ready

**Status:** Ready to use immediately!

---

## 🚀 30-Second Quick Start

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with:
#    - MongoDB connection string
#    - Gmail app password
#    - Keep others as-is for now

# 5. Start backend
npm start

# ✅ Done! Backend running at http://localhost:5000
```

---

## 📖 Read These Documents in Order

### 1. **This File** ← You are here
Quick orientation

### 2. **[QUICK_START.md](QUICK_START.md)** (5 min read)
- 60-second setup overview
- Common issues
- All API endpoints

### 3. **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** (10 min read)
- Complete checklist
- Step-by-step instructions
- Testing guide

### 4. **[EXACT_INTEGRATION_LOCATIONS.md](EXACT_INTEGRATION_LOCATIONS.md)** (15 min read)
- **MOST IMPORTANT** - Where to add your backend URL
- Copy-paste code for your forms
- Framer-specific instructions

### 5. **[README_BACKEND.md](README_BACKEND.md)** (Full reference)
- Complete API documentation
- All endpoint details
- Deployment guide

### 6. **[API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)** (Testing)
- Test every endpoint
- Example requests/responses
- Troubleshooting

### 7. **[FILE_STRUCTURE.md](FILE_STRUCTURE.md)** (Reference)
- Understand the code structure
- What each file does
- How files connect

---

## 🔑 Three Critical Things to Know

### 1. Backend URL
Your backend will run at:
```
Development: http://localhost:5000
Production:  https://your-app.onrender.com
```

You'll add this to your Framer forms (see EXACT_INTEGRATION_LOCATIONS.md)

### 2. Environment Variables (.env)
You must create a `.env` file with:
```
MONGODB_URI=<your MongoDB connection>
EMAIL_PASS=<your Gmail app password>
JWT_SECRET=<any random string>
```

See SETUP_CHECKLIST.md for detailed setup

### 3. Admin Access
After backend starts, register your first admin:
```
POST http://localhost:5000/api/auth/register
Email: admin@atomicmedia.com
Password: YourPassword123
```

Then login to manage leads and inquiries

---

## 🎯 Your Next Steps

### TODAY
- [ ] Read QUICK_START.md
- [ ] Run: `cd backend && npm install && npm start`
- [ ] Test: `curl http://localhost:5000/api/health`

### THIS WEEK
- [ ] Setup MongoDB Atlas (free)
- [ ] Setup Gmail App Password
- [ ] Create .env file
- [ ] Read EXACT_INTEGRATION_LOCATIONS.md
- [ ] Add backend URLs to your Framer forms

### BEFORE LAUNCH
- [ ] Test all forms locally
- [ ] Deploy backend to Render
- [ ] Update URLs to production
- [ ] Final end-to-end testing
- [ ] Go live!

---

## 📁 What's in the `backend/` Folder

```
backend/
├── server.js              ← Main application (start here)
├── package.json           ← Dependencies
├── .env.example           ← Environment template
├── config/db.js           ← Database connection
├── models/                ← Data schemas (Lead, Inquiry, Admin)
├── controllers/           ← Business logic
├── routes/                ← API endpoints (/api/leads, /api/inquiries, etc.)
├── middleware/            ← Security & error handling
└── utils/                 ← Email sending utility
```

Everything is organized and ready to use!

---

## 🔗 How to Connect to Your Framer Forms

**Quick example for Contact Form:**

```javascript
// Add this to your Framer contact form's submit handler:

const BACKEND_URL = "http://localhost:5000"; // Change for production

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
  })
})
```

**👉 See EXACT_INTEGRATION_LOCATIONS.md for complete code for each form type!**

---

## 🧪 Test It Works

After `npm start`, test these endpoints:

```bash
# 1. Health check
curl http://localhost:5000/api/health
# Expected: {"message":"Server is running ✓"}

# 2. Create a test lead
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test","email":"test@test.com","phone":"123",
    "service":"Web Development","budget":"$10K - $25K",
    "message":"This is a test message with at least 10 characters."
  }'

# 3. Check you got an email notification ✉️
```

---

## ⚙️ Setup Your Environment (.env)

**Create `backend/.env`** file with:

```env
# Copy from .env.example and fill in:

PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atomic-media

JWT_SECRET=your-secret-key-here-make-it-random-and-long
JWT_EXPIRE=7d

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
ADMIN_EMAIL=admin@atomicmedia.com

FRONTEND_URL=http://localhost:3000
```

### Getting These Values:
- **MONGODB_URI**: From [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
- **EMAIL_USER & EMAIL_PASS**: From [Gmail with App Password](https://myaccount.google.com/security)

See SETUP_CHECKLIST.md for detailed instructions on each.

---

## 🚀 Production Deployment (Later)

When ready to go live:

1. Deploy backend to [Render](https://render.com) (free tier)
2. Update backend URL in Framer to: `https://your-app.onrender.com`
3. Update MONGODB_URI and EMAIL settings on Render
4. Test with live forms

See README_BACKEND.md for detailed deployment steps.

---

## 📊 API Endpoints Overview

### For Your Framer Forms (Public - No Login)
```
POST /api/leads       - Submit contact form
POST /api/inquiries   - Submit project inquiry
POST /api/ai/chat     - Chat with AI
```

### For Admin Dashboard (Requires Login)
```
POST   /api/auth/register     - Create first admin
POST   /api/auth/login        - Login
GET    /api/leads             - View all leads
PATCH  /api/leads/:id         - Update lead
DELETE /api/leads/:id         - Delete lead
[Similar for /api/inquiries]
```

Full list: See README_BACKEND.md or API_TESTING_GUIDE.md

---

## ❓ Common Questions

**Q: Do I need to modify any code?**
A: No! It's ready to use as-is. Just configure .env and connect your forms.

**Q: Is the database included?**
A: No, you need free MongoDB Atlas (takes 5 minutes to setup).

**Q: How do I send emails?**
A: Gmail App Password (takes 5 minutes to setup).

**Q: Can I change the form fields?**
A: Yes, but keep the field names as defined in the models.

**Q: Is this free?**
A: Yes! MongoDB Atlas free tier, Gmail free, Render free tier.

**Q: What about my Framer design?**
A: Completely untouched - this is just backend!

---

## 🆘 Stuck? Here's Help

| Issue | Solution |
|-------|----------|
| "npm: not found" | Install Node.js from nodejs.org |
| "Cannot connect to DB" | Check MongoDB URI in .env |
| "Emails not sending" | Use Gmail App Password (not regular password) |
| "CORS error" | Add your Framer URL to FRONTEND_URL in .env |
| "Port 5000 in use" | Change PORT in .env or kill process using port 5000 |

More help: See README_BACKEND.md Troubleshooting section.

---

## ✅ You're All Set!

Your backend is complete and ready. Just follow these steps:

1. ✅ `npm install` - Install dependencies
2. ✅ Create `.env` file - Configure environment
3. ✅ `npm start` - Start backend
4. ✅ Connect forms - Add backend URL to Framer
5. ✅ Test - Submit test form
6. ✅ Deploy - Push to Render when ready

---

## 📚 Full Documentation

| Document | What It's For |
|----------|---------------|
| **QUICK_START.md** | 60-second overview |
| **SETUP_CHECKLIST.md** | Step-by-step guide |
| **EXACT_INTEGRATION_LOCATIONS.md** | Where to paste code |
| **README_BACKEND.md** | Complete reference |
| **API_TESTING_GUIDE.md** | Test endpoints |
| **FILE_STRUCTURE.md** | Understand code |
| **FILE_README_START.md** | This file |

---

## 🎯 Recommended Reading Order

```
1. This file (done!)
    ↓
2. QUICK_START.md (5 min)
    ↓
3. EXACT_INTEGRATION_LOCATIONS.md (important!)
    ↓
4. SETUP_CHECKLIST.md (detailed)
    ↓
5. README_BACKEND.md (full reference)
```

---

## 💬 Need Help?

1. **Read** the relevant documentation above
2. **Check** SETUP_CHECKLIST.md troubleshooting
3. **Review** README_BACKEND.md FAQ
4. **Test** endpoints in API_TESTING_GUIDE.md

All common issues are documented!

---

## 🚀 Ready to Begin?

### Start Now:
```bash
cd backend
npm install
npm start
```

### Then Read:
[QUICK_START.md](QUICK_START.md) → [EXACT_INTEGRATION_LOCATIONS.md](EXACT_INTEGRATION_LOCATIONS.md)

---

**Your backend is ready. Let's build something amazing!** 🎉

✨ **Status: Production Ready** ✨
Version 1.0.0
Created: 2024
