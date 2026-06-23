const https = require('https');
const Lead = require('../models/Lead');
const Inquiry = require('../models/Inquiry');
const { sendAdminNotification, sendClientConfirmation } = require('../utils/sendEmail');
const { sendWhatsAppNotification } = require('../utils/sendWhatsApp');
const SiteSettings = require('../models/SiteSettings');

// Helper to make API calls to Gemini or OpenAI using native HTTPS
const callLLM = async (prompt, systemInstruction = '') => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (res.statusCode === 200) {
              const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              resolve(text || '');
            } else {
              reject(new Error(parsed.error?.message || `Gemini API returned status ${res.statusCode}`));
            }
          } catch (e) {
            reject(new Error(`Failed to parse Gemini response: ${body}`));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(postData);
      req.end();
    });
  } else if (openaiKey) {
    return new Promise((resolve, reject) => {
      const messages = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const postData = JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
      });

      const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': `Bearer ${openaiKey}`,
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (res.statusCode === 200) {
              resolve(parsed.choices?.[0]?.message?.content || '');
            } else {
              reject(new Error(parsed.error?.message || `OpenAI API returned status ${res.statusCode}`));
            }
          } catch (e) {
            reject(new Error(`Failed to parse OpenAI response: ${body}`));
          }
        });
      });

      req.on('error', (e) => reject(e));
      req.write(postData);
      req.end();
    });
  } else {
    // If no key is set, we return mock results for local testing/demo
    console.warn('⚠️ No GEMINI_API_KEY or OPENAI_API_KEY found. Running in simulation/mock mode.');
    return null;
  }
};

// @desc    AI Chatbot for lead qualification
// @route   POST /api/ai/chat
// @access  Public
exports.aiChat = async (req, res, next) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are "Atom", the premium AI consultant for Atomic Media (a design, branding, and development agency).
Your goal is to guide visitors, qualify them, and capture their lead details.
Be extremely professional, friendly, and elegant in your tone.

To qualify a lead, you must retrieve:
1. Client Name
2. Email Address
3. Phone Number (optional, but ask if possible)
4. Service / Project Type they need (Web, Brand, App, SEO, etc.)
5. Budget bracket (e.g. Under $5K, $5K-$10K, $10K-$25K, $25K+)

Keep questions conversational. Do not ask for everything at once. Build rapport.

CRITICAL: Once (and only when) you have successfully collected the client's Name, Email, Service, and Budget, append a JSON block at the very end of your response like this:
[QUALIFIED_LEAD_DATA]
{
  "name": "Client Name",
  "email": "email@example.com",
  "phone": "1234567890",
  "service": "Web Development",
  "budget": "$5K - $10K",
  "message": "Summarized project details from chat"
}
[END_QUALIFIED_LEAD_DATA]
Never output the JSON structure if info is still missing. Keep the JSON block exactly matching this format. Do not prefix or suffix it inside the bracket markers.`;

    // Construct history prompt
    let prompt = '';
    conversationHistory.forEach((turn) => {
      prompt += `User: ${turn.user}\n`;
      if (turn.assistant) prompt += `Atom: ${turn.assistant}\n`;
    });
    prompt += `User: ${message}\nAtom:`;

    let reply = await callLLM(prompt, systemInstruction);

    // If key not configured, simulate a smart lead qualification conversation flow
    if (reply === null) {
      const historyLength = conversationHistory.length;
      if (historyLength === 0) {
        reply = "Hello! I'm Atom, your digital success consultant. Are you looking to build a website, refresh your brand, or scale your digital presence?";
      } else if (historyLength === 1) {
        reply = "That sounds exciting! We specialize in premium design and custom development. To help me guide you, could I get your name and email address?";
      } else if (historyLength === 2) {
        reply = "Thanks! Lastly, what budget scale do you have planned for this project? (e.g., Under $5K, $5K-$10K, $10K-$25K, or $25K+)?";
      } else {
        const userName = conversationHistory.find(h => h.user.match(/[a-zA-Z]+/))?.user || 'Guest';
        reply = `Fantastic! I have noted down all your details. One of our lead engineers will contact you at your email. Have a great day!\n\n[QUALIFIED_LEAD_DATA]\n{\n  "name": "${userName}",\n  "email": "test-client@example.com",\n  "phone": "9999999999",\n  "service": "Web Development",\n  "budget": "$5K - $10K",\n  "message": "Interested in premium web design"\n}\n[END_QUALIFIED_LEAD_DATA]`;
      }
    }

    // Check if qualified lead data is returned in LLM reply
    const qualifiedRegex = /\[QUALIFIED_LEAD_DATA\]([\s\S]*?)\[END_QUALIFIED_LEAD_DATA\]/;
    const match = reply.match(qualifiedRegex);
    let isQualified = false;

    if (match) {
      try {
        const leadJson = JSON.parse(match[1].trim());
        isQualified = true;

        // Strip the JSON block from the reply so the user doesn't see raw JSON
        reply = reply.replace(qualifiedRegex, '').trim();

        // Create the lead in database
        const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
        const newLead = new Lead({
          name: leadJson.name,
          email: leadJson.email,
          phone: leadJson.phone || '',
          service: leadJson.service || 'Other',
          budget: leadJson.budget || 'Under $5K',
          message: `${leadJson.message}\n[QUALIFIED BY AI CHATBOT]`,
          status: 'New',
          ipAddress,
        });

        await newLead.save();

        // Send notifications
        await sendAdminNotification(newLead, 'lead');
        await sendClientConfirmation(newLead.email, newLead.name, 'lead');

        // WhatsApp notification
        try {
          const settings = await SiteSettings.findOne();
          const wsMessage = `🤖 *AI Qualified Lead - ATOMIC MEDIA*\n\n👤 *Name:* ${newLead.name}\n✉️ *Email:* ${newLead.email}\n📞 *Phone:* ${newLead.phone || '—'}\n🛠️ *Service:* ${newLead.service}\n💰 *Budget:* ${newLead.budget}\n\n💬 *Summary:* "${leadJson.message}"`;
          await sendWhatsAppNotification(wsMessage, settings);
        } catch (wsErr) {}

      } catch (jsonErr) {
        console.error('Error parsing qualified lead JSON from AI response:', jsonErr.message);
      }
    }

    res.status(200).json({
      success: true,
      reply,
      isQualified,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Content / Blog Ideas
// @route   POST /api/ai/generate-ideas
// @access  Private (Admin)
exports.generateIdeas = async (req, res, next) => {
  try {
    const { keyword } = req.body;
    if (!keyword) {
      return res.status(400).json({ error: 'Please provide a keyword or topic' });
    }

    const prompt = `Act as an SEO Specialist and Content Director. Generate exactly 5 viral, high-converting blog post or case study ideas for a premium digital agency website (Atomic Media) about the topic: "${keyword}".
For each idea, return:
1. A catchy SEO-Optimized Title
2. Target keywords
3. A short, bulleted structural outline (intro, 3 body sections, conclusion)
Keep the formatting clean in markdown.`;

    let content = await callLLM(prompt);

    if (content === null) {
      // Mock fallback
      content = `### 1. Master the Digital Core: Why Custom Web Design Beats Templates in 2026
- **Target Keywords**: Custom Web Design, Web design 2026, Framer design
- **Outline**:
  - **Introduction**: The templates trap vs. brand identity.
  - **Section 1**: Custom performance - Speed, SEO, conversion rates.
  - **Section 2**: Designing for brand personality.
  - **Section 3**: Scaling your tech stack as your business grows.
  - **Conclusion**: Why custom web experiences are the ultimate branding asset.

### 2. High-Performance Branding: How to Revitalize Your Agency Identity
- **Target Keywords**: Brand identity, Brand strategy, Rebranding
- **Outline**:
  - **Introduction**: The lifecycle of agency branding.
  - **Section 1**: Identifying brand misalignment.
  - **Section 2**: Researching competitors and positioning.
  - **Section 3**: Rolling out a modern visual system.
  - **Conclusion**: A stronger brand means premium pricing.`;
    }

    res.status(200).json({ success: true, ideas: content });
  } catch (error) {
    next(error);
  }
};

// @desc    Get SEO suggestions for blog content
// @route   POST /api/ai/seo-suggestions
// @access  Private (Admin)
exports.seoSuggestions = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Please provide title and content' });
    }

    const prompt = `Analyze this draft post/project content:
Title: "${title}"
Content: "${content.substring(0, 1000)}"

Provide SEO recommendations:
1. Recommended Meta Title (under 60 chars)
2. Recommended Meta Description (under 160 chars)
3. 5 Target SEO Keyword Tags (comma-separated list)
4. 3 suggestions for improving readability and search ranking.
Format as JSON matching:
{
  "metaTitle": "",
  "metaDescription": "",
  "keywords": "tag1, tag2, tag3, tag4, tag5",
  "tips": ["tip1", "tip2", "tip3"]
}`;

    const rawResponse = await callLLM(prompt);
    let result;

    if (rawResponse) {
      try {
        // Strip code block formatting if any
        const cleaned = rawResponse.replace(/```json|```/g, '').trim();
        result = JSON.parse(cleaned);
      } catch (err) {
        result = { error: 'Failed to parse AI response', raw: rawResponse };
      }
    } else {
      result = {
        metaTitle: `${title} | Premium Insights by Atomic Media`,
        metaDescription: `Read about "${title}". Discover professional insights and agency expertise to accelerate your brand's growth.`,
        keywords: "agency insights, custom web, branding strategy, digital growth, atomic media",
        tips: [
          "Include H2 headers with target keywords",
          "Ensure your key term appears in the first paragraph",
          "Add alt text to all project images"
        ]
      };
    }

    res.status(200).json({ success: true, suggestions: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate proposal from project inquiry details
// @route   GET /api/ai/generate-proposal/:inquiryId
// @access  Private (Admin)
exports.generateProposal = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.inquiryId);
    if (!inquiry) {
      return res.status(404).json({ error: 'Project inquiry not found' });
    }

    const prompt = `Create a premium Project Proposal (in beautiful Markdown format) based on this client inquiry:
Client Name: ${inquiry.clientName}
Business Name: ${inquiry.businessName || 'N/A'}
Inquiry Type: ${inquiry.websiteType}
Budget: ${inquiry.budget}
Timeline/Deadline: ${inquiry.deadline}
Requirements: "${inquiry.requirements}"

Make the proposal highly persuasive, structured as follows:
1. Executive Summary & Project Objectives
2. Proposed Solution & Architecture
3. Scope of Work (broken down into phases: Strategy/UX, Design, Development, Launch)
4. Timeline & Milestones
5. Budget & Cost Breakdown (Tailor to the client's budget of ${inquiry.budget})
6. Why Atomic Media (Premium values, support)
7. Next Steps to Proceed
Keep the language extremely premium, elegant, and standard corporate proposal tone.`;

    let proposal = await callLLM(prompt);

    if (proposal === null) {
      proposal = `# Project Proposal: Custom ${inquiry.websiteType} for ${inquiry.businessName || inquiry.clientName}

**Prepared by:** ATOMIC MEDIA Team  
**Prepared for:** ${inquiry.clientName}  
**Date:** ${new Date().toLocaleDateString()}

---

## 1. Executive Summary
We are thrilled to propose a custom ${inquiry.websiteType} solution for ${inquiry.businessName || inquiry.clientName}. Based on your requirements, we will build a premium, fast, and high-converting platform tailored to your audience.

## 2. Scope of Work
- **Phase 1: Strategy & Wireframing** (UX architecture, site structure)
- **Phase 2: Custom Visual Design** (Branding, typography, interactive mockups)
- **Phase 3: High-Performance Development** (CMS integration, full animations)
- **Phase 4: Launch & Optimization** (SEO integration, page speed check)

## 3. Cost & Timeline
- **Estimated Timeline:** ${inquiry.deadline === 'urgent' ? '2-3 weeks' : '4-6 weeks'}
- **Total Project Investment:** ${inquiry.budget}`;
    }

    res.status(200).json({ success: true, proposal });
  } catch (error) {
    next(error);
  }
};
