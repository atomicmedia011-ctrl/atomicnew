# ATOMIC MEDIA Frontend-Backend Integration Guide

## 🎯 Quick Integration Steps

This guide shows you exactly how to connect your Framer frontend to the ATOMIC MEDIA backend.

---

## 1️⃣ Get Your Backend URL

### Local Development:
```
http://localhost:5000
```

### Production (Render):
```
https://your-app-name.onrender.com
```

---

## 2️⃣ Integration Points in Framer

### Contact Form Connection

In your Framer contact form component, find the form submission action and update it:

```javascript
// BEFORE (if connected to anything)
// Remove or replace existing backend URL

// AFTER - Add this to your form submission
const BACKEND_URL = "http://localhost:5000"; // Change for production

// Form Submit Handler
async function submitContactForm(formData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name || "",
        email: formData.email || "",
        phone: formData.phone || "",
        service: formData.service || "", // Select value
        budget: formData.budget || "", // Select value
        message: formData.message || "",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✓ Thank you! We'll contact you soon.");
      // Reset form
      return true;
    } else {
      alert("✗ Error: " + (data.error || "Failed to submit"));
      return false;
    }
  } catch (error) {
    console.error("Form submission error:", error);
    alert("✗ Connection error. Please try again.");
    return false;
  }
}
```

---

### Project Inquiry Form Connection

```javascript
const BACKEND_URL = "http://localhost:5000";

// Form Submit Handler
async function submitInquiryForm(formData) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientName: formData.clientName || "",
        businessName: formData.businessName || "",
        email: formData.email || "",
        phone: formData.phone || "",
        websiteType: formData.websiteType || "",
        requirements: formData.requirements || "",
        budget: formData.budget || "",
        deadline: formData.deadline || "",
        contactDetails: {
          website: formData.website || "",
          company: formData.company || "",
          location: formData.location || "",
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✓ Inquiry submitted successfully!");
      return true;
    } else {
      alert("✗ Error: " + (data.error || "Failed to submit"));
      return false;
    }
  } catch (error) {
    console.error("Inquiry submission error:", error);
    alert("✗ Connection error. Please try again.");
    return false;
  }
}
```

---

### AI Chatbot Integration

```javascript
const BACKEND_URL = "http://localhost:5000";
let conversationHistory = [];

// Chat Submit Handler
async function sendChatMessage(userMessage) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        conversationHistory: conversationHistory,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      conversationHistory = data.conversationHistory;
      return data.reply;
    } else {
      return "Sorry, I couldn't process your message. Please try again.";
    }
  } catch (error) {
    console.error("Chat error:", error);
    return "Connection error. Please try again.";
  }
}

// Get chat suggestions
async function loadChatSuggestions() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ai/suggestions`);
    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error("Error loading suggestions:", error);
    return [];
  }
}
```

---

## 3️⃣ Framer Specific Instructions

### For Framer Code Components:

1. **Open your Framer project**
2. **Add a Code component** where your form is
3. **Paste the appropriate integration code above**
4. **Update form field mappings** to match your form structure

### Example for Contact Form in Framer:

```javascript
import React, { useState } from 'react';

export function ContactFormWithBackend() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('✓ Form submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          budget: '',
          message: '',
        });
      } else {
        const error = await response.json();
        alert('✗ Error: ' + error.error);
      }
    } catch (error) {
      alert('✗ Connection error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Your Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <select
        name="service"
        value={formData.service}
        onChange={handleChange}
        required
      >
        <option value="">Select Service</option>
        <option value="Web Development">Web Development</option>
        <option value="Mobile App">Mobile App</option>
        <option value="UI/UX Design">UI/UX Design</option>
        <option value="Branding">Branding</option>
        <option value="SEO">SEO</option>
        <option value="Content Writing">Content Writing</option>
        <option value="Digital Marketing">Digital Marketing</option>
        <option value="Other">Other</option>
      </select>
      <select
        name="budget"
        value={formData.budget}
        onChange={handleChange}
        required
      >
        <option value="">Select Budget</option>
        <option value="Under $5K">Under $5K</option>
        <option value="$5K - $10K">$5K - $10K</option>
        <option value="$10K - $25K">$10K - $25K</option>
        <option value="$25K - $50K">$25K - $50K</option>
        <option value="$50K+">$50K+</option>
      </select>
      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

---

## 4️⃣ Testing the Integration

### Step 1: Start Your Backend
```bash
cd backend
npm install
npm start
```

### Step 2: Update Frontend URL
- Change `http://localhost:5000` to your backend URL

### Step 3: Test Each Endpoint

**Test Contact Form:**
```bash
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
```

**Test Inquiry:**
```bash
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
```

**Test AI Chat:**
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What services do you offer?"
  }'
```

---

## 5️⃣ Environment Setup for Production

When deploying to production:

1. **Update Backend URL in Framer:**
   - Change from `http://localhost:5000`
   - To `https://your-app-name.onrender.com`

2. **Update .env on Render:**
   - `FRONTEND_URL=https://yourframersite.com`
   - This enables proper CORS

3. **Test Production Integration:**
   - Submit a test form from your deployed Framer site
   - Check if email notifications arrive

---

## 6️⃣ Common Issues & Solutions

### Issue: "CORS Error - Origin not allowed"
**Solution:**
- Add your Framer URL to `FRONTEND_URL` in .env
- Or update CORS in `server.js` line 29

### Issue: "Forms not submitting"
**Solution:**
- Check browser console for errors (F12)
- Verify backend URL is correct
- Ensure backend is running

### Issue: "Emails not sending"
**Solution:**
- Use Gmail App Password (not regular password)
- Enable 2-Step Verification on Gmail
- Check EMAIL_USER and EMAIL_PASS in .env

### Issue: "Getting 404 errors"
**Solution:**
- Verify endpoint URLs match exactly
- Check request method (POST/GET/PATCH/DELETE)
- Ensure request headers include Content-Type: application/json

---

## 7️⃣ Next Steps

After integration:

1. **Setup Admin Dashboard** to view/manage leads
2. **Configure Email Templates** for better branding
3. **Add Form Validation** in Framer (UX improvement)
4. **Monitor Submissions** via backend logs
5. **Scale Database** if needed (MongoDB Atlas)

---

## 📞 Support

If integration doesn't work:
1. Check the troubleshooting section
2. Verify backend is running
3. Check browser console (F12 → Network tab)
4. Ensure all environment variables are set
5. Review the README_BACKEND.md for more details
