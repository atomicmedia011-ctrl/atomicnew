# 🔗 EXACTLY Where & How to Add Backend URLs

This file shows you EXACTLY where to place your backend URL in each Framer form and component.

---

## 📍 Backend URL Variables

### Development (Local Testing)
```javascript
const BACKEND_URL = "http://localhost:5000";
```

### Production (After Deployment on Render)
```javascript
const BACKEND_URL = "https://your-app-name.onrender.com";
```

---

## 📝 Contact Form Integration

### Find Your Form in Framer
1. Open your Framer project
2. Locate the **Contact Form** component
3. Find the **Submit Button** or form handler

### Add This Code

If you have a **Submit Button** with an action, add a custom code handler:

```javascript
// ATOMIC MEDIA - Contact Form Handler
const BACKEND_URL = "http://localhost:5000"; // Change for production

export async function submitContactForm(event) {
  event.preventDefault();
  
  // Get form values (adjust field names to match your form)
  const formData = {
    name: document.querySelector('input[name="name"]')?.value,
    email: document.querySelector('input[name="email"]')?.value,
    phone: document.querySelector('input[name="phone"]')?.value,
    service: document.querySelector('select[name="service"]')?.value,
    budget: document.querySelector('select[name="budget"]')?.value,
    message: document.querySelector('textarea[name="message"]')?.value,
  };

  // Validate
  if (!formData.name || !formData.email || !formData.message) {
    alert("❌ Please fill all required fields");
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Thank you! We'll contact you soon.");
      // Reset form
      document.querySelector('form')?.reset();
    } else {
      alert("❌ Error: " + (result.error || "Failed to submit"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Connection error. Please try again.");
  }
}
```

### Or Use Fetch Directly in Framer Props

If your form has a custom action property:

```
Action: Custom Code
Code:
fetch("http://localhost:5000/api/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: formValues.name,
    email: formValues.email,
    phone: formValues.phone,
    service: formValues.service,
    budget: formValues.budget,
    message: formValues.message
  })
}).then(res => res.json()).then(data => {
  if (res.ok) alert("✅ Sent!");
  else alert("❌ Error: " + data.error);
})
```

---

## 🏢 Project Inquiry Form Integration

### Find Your Form in Framer
1. Open your Framer project
2. Locate the **Project Inquiry Form** or **Request Quote Form**
3. Find the **Submit Button** or form handler

### Add This Code

```javascript
// ATOMIC MEDIA - Project Inquiry Handler
const BACKEND_URL = "http://localhost:5000"; // Change for production

export async function submitInquiryForm(event) {
  event.preventDefault();
  
  // Get form values
  const formData = {
    clientName: document.querySelector('input[name="clientName"]')?.value,
    businessName: document.querySelector('input[name="businessName"]')?.value,
    email: document.querySelector('input[name="email"]')?.value,
    phone: document.querySelector('input[name="phone"]')?.value,
    websiteType: document.querySelector('select[name="websiteType"]')?.value,
    requirements: document.querySelector('textarea[name="requirements"]')?.value,
    budget: document.querySelector('select[name="budget"]')?.value,
    deadline: document.querySelector('select[name="deadline"]')?.value,
    contactDetails: {
      website: document.querySelector('input[name="website"]')?.value || "",
      company: document.querySelector('input[name="company"]')?.value || "",
      location: document.querySelector('input[name="location"]')?.value || "",
    },
  };

  // Validate
  if (!formData.clientName || !formData.email || !formData.requirements) {
    alert("❌ Please fill all required fields");
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok) {
      alert("✅ Inquiry submitted! We'll review and contact you soon.");
      document.querySelector('form')?.reset();
    } else {
      alert("❌ Error: " + (result.error || "Failed to submit"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Connection error. Please try again.");
  }
}
```

---

## 🤖 AI Chatbot Integration

### Find Your Chatbot Component in Framer

1. Open your Framer project
2. Locate the **Chatbot** or **Chat Widget** component
3. Find where messages are sent

### Add This Code

```javascript
// ATOMIC MEDIA - AI Chatbot Handler
const BACKEND_URL = "http://localhost:5000"; // Change for production
let conversationHistory = [];

export async function sendChatMessage(userMessage) {
  if (!userMessage.trim()) return;

  // Add user message to history
  conversationHistory.push({ user: userMessage, assistant: "" });

  try {
    const response = await fetch(`${BACKEND_URL}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        conversationHistory: conversationHistory,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // Update last message with assistant response
      conversationHistory[conversationHistory.length - 1].assistant = result.reply;
      return result.reply;
    } else {
      return "Sorry, I couldn't process your message. Please try again.";
    }
  } catch (error) {
    console.error("Chat error:", error);
    return "Connection error. Please try again.";
  }
}

export async function loadChatSuggestions() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/ai/suggestions`);
    const result = await response.json();
    return result.suggestions || [];
  } catch (error) {
    console.error("Error loading suggestions:", error);
    return [
      "What services do you offer?",
      "How much does a website cost?",
      "What is your process?",
    ];
  }
}
```

---

## 🔄 Step-by-Step Framer Integration

### For Framer Beginners:

1. **Open your Framer project**

2. **Find the form component** (e.g., "ContactForm")

3. **Click on Submit Button**

4. **In the right panel**, look for **"Interactions"** or **"Events"**

5. **Add new event** → Select "Click" → Choose "Open" or "Custom Code"

6. **If "Custom Code"** option exists:
   - Click it
   - Paste the JavaScript code from above
   - Modify the `BACKEND_URL` if needed

7. **If no "Custom Code"** option:
   - Right-click the form
   - Select "Add Code"
   - Paste code in the code editor

---

## 📱 Complete Example: Minimal Contact Form

Create a **Code Component** in Framer:

```javascript
import { useState } from 'react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const BACKEND_URL = "http://localhost:5000";

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
      const response = await fetch(`${BACKEND_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          budget: '',
          message: '',
        });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      alert('Connection error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      {submitted && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
          ✅ Thank you! We'll contact you soon.
        </div>
      )}

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <input
        type="tel"
        name="phone"
        placeholder="Your Phone"
        value={formData.phone}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
      />

      <select
        name="service"
        value={formData.service}
        onChange={handleChange}
        required
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
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
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
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
        placeholder="Your Message (min 10 characters)"
        value={formData.message}
        onChange={handleChange}
        required
        minLength="10"
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '120px' }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

---

## ✅ Testing After Integration

### 1. **Local Testing**
```bash
# Make sure backend is running
cd backend
npm start

# Submit a test form in your Framer project
# Check that you receive an email
# Check backend logs show the submission
```

### 2. **Verify Email Sent**
- Check your ADMIN_EMAIL inbox for notification
- Check sender email inbox for confirmation

### 3. **Check Admin Panel**
```javascript
// Login to admin
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@atomicmedia.com',
    password: 'YourPassword'
  })
})
.then(res => res.json())
.then(data => {
  const token = data.token;
  // Use token to fetch leads
  fetch('http://localhost:5000/api/leads', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(leads => console.log('All leads:', leads));
});
```

---

## 🚀 Production Deployment Steps

### 1. **Deploy Backend to Render**
- See [README_BACKEND.md](README_BACKEND.md) for details

### 2. **Update Framer with Production URL**

Change this:
```javascript
const BACKEND_URL = "http://localhost:5000";
```

To this:
```javascript
const BACKEND_URL = "https://atomic-media-backend.onrender.com";
```

### 3. **Publish Framer Project**
- All forms now point to production backend

### 4. **Test Production Forms**
- Submit a test form from your live site
- Verify email arrives
- Check data in admin panel

---

## 🔍 Debugging Tips

### "Form won't submit"
```javascript
// Add logging to see what's happening
console.log("Sending to:", BACKEND_URL);
console.log("Form data:", formData);
console.log("Response:", response);
```

### "Getting CORS error"
- Check that `FRONTEND_URL` in backend `.env` matches your Framer domain
- Restart backend after changing `.env`

### "No email received"
- Check that `EMAIL_USER` and `EMAIL_PASS` are correct
- Use Gmail App Password, not regular password
- Check spam folder

### "Can't see leads in admin"
- Verify you're logged in and have valid JWT token
- Token expires after 7 days
- Login again to get new token

---

## 📋 Field Name Reference

### Contact Form Fields
- `name` - Text input
- `email` - Email input
- `phone` - Tel input
- `service` - Select dropdown
- `budget` - Select dropdown
- `message` - Textarea

### Inquiry Form Fields
- `clientName` - Text input
- `businessName` - Text input
- `email` - Email input
- `phone` - Tel input
- `websiteType` - Select dropdown
- `requirements` - Textarea
- `budget` - Select dropdown
- `deadline` - Select dropdown
- `contactDetails.website` - Optional text
- `contactDetails.company` - Optional text
- `contactDetails.location` - Optional text

---

## ✨ You're Ready!

Your backend is connected when:
✅ Forms submit without errors
✅ Emails arrive at ADMIN_EMAIL
✅ Data appears in admin panel
✅ No console errors

**Next:** Monitor submissions and adjust as needed!
