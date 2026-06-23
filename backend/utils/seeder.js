const Project = require('../models/Project');
const Service = require('../models/Service');

const seedData = async () => {
  try {
    // 1. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log('🌱 Seeding default projects...');
      const defaultProjects = [
        {
          title: 'Kora Consulting',
          shortDescription: 'A premium consulting site designed with smooth animations and layout.',
          description: 'Atomic Media designed and developed Kora, a next-generation corporate consulting platform. Built on modern web principles, it features responsive design, clean typography, and a dark aesthetic tailored for modern businesses.',
          category: 'Consulting Site',
          client: 'Kora Consulting Group',
          technologies: ['Framer', 'React', 'Node.js', 'MongoDB'],
          projectUrl: 'https://atomicmedia.in/projects/essentia',
          featured: true,
          status: 'published',
          order: 1,
          thumbnail: { url: 'https://framerusercontent.com/images/wn56GiYIGN9okbMTZQ8fV2UQ0.jpg', publicId: '' },
          images: [{ url: 'https://framerusercontent.com/images/wn56GiYIGN9okbMTZQ8fV2UQ0.jpg', publicId: '', alt: 'Kora Consulting Website Preview' }]
        },
        {
          title: 'KYMA AI Agency',
          shortDescription: 'AI Automation Agency website featuring dynamic glassmorphism and chatbot.',
          description: 'An ultra-premium corporate website built for KYMA, an AI agency offering automation workflows. The portal integrates automated chatbots, dynamic sliders, and a lead capturing interface.',
          category: 'AI Agency',
          client: 'KYMA Solutions',
          technologies: ['Vite', 'JavaScript', 'Express', 'Gemini API'],
          projectUrl: 'https://atomicmedia.in/projects/quantum',
          featured: true,
          status: 'published',
          order: 2,
          thumbnail: { url: 'https://framerusercontent.com/images/tBF8hMQFxONWA4CXtHf3R4.jpg', publicId: '' },
          images: [{ url: 'https://framerusercontent.com/images/tBF8hMQFxONWA4CXtHf3R4.jpg', publicId: '', alt: 'KYMA AI Agency Preview' }]
        },
        {
          title: 'Mugen Studio',
          shortDescription: 'A gorgeous design studio landing page with 3D elements.',
          description: 'Mugen Studio needed a high-converting, visually striking digital portal to showcase their 3D models and creative designs. We delivered a fast, responsive, and animated dark-mode showcase.',
          category: 'Design studio',
          client: 'Mugen Group',
          technologies: ['Framer', 'Rive', 'Spline', 'Webflow'],
          projectUrl: 'https://atomicmedia.in/projects/orbital',
          featured: true,
          status: 'published',
          order: 3,
          thumbnail: { url: 'https://framerusercontent.com/images/AZe7hFsRlGAWp9spF25RMEwS0gA.jpg', publicId: '' },
          images: [{ url: 'https://framerusercontent.com/images/AZe7hFsRlGAWp9spF25RMEwS0gA.jpg', publicId: '', alt: 'Mugen Studio Showcase' }]
        },
        {
          title: 'Axiom Ecommerce',
          shortDescription: 'High-performance e-commerce digital store for luxury apparel.',
          description: 'Axiom is a luxury fashion brand requiring a premium shopping experience. Atomic Media built a high-speed e-commerce storefront with smooth page transitions, optimized images, and checkout workflows.',
          category: 'Ecommerce Site',
          client: 'Axiom Retail Ltd',
          technologies: ['Next.js', 'Tailwind CSS', 'Shopify API', 'Stripe'],
          projectUrl: 'https://atomicmedia.in/projects/axiom',
          featured: true,
          status: 'published',
          order: 4,
          thumbnail: { url: 'https://framerusercontent.com/images/q3ruKmoVYmFXP9EeyZlQPnTDuVw.jpg', publicId: '' },
          images: [{ url: 'https://framerusercontent.com/images/q3ruKmoVYmFXP9EeyZlQPnTDuVw.jpg', publicId: '', alt: 'Axiom Storefront' }]
        }
      ];
      await Project.create(defaultProjects);
      console.log('✓ Successfully seeded default projects.');
    }

    // 2. Seed Services
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('🌱 Seeding default services...');
      const defaultServices = [
        {
          title: 'Website Development',
          shortDescription: 'Custom Webflow & Framer solutions built to scale.',
          description: 'We develop high-performance, responsive websites with state-of-the-art animations, SEO optimization, and intuitive CMS interfaces.',
          icon: 'code',
          features: ['Framer & Webflow Development', 'Responsive Mobile-First Layouts', 'NextJS & React Integrations'],
          status: 'active',
          order: 1
        },
        {
          title: 'Brand Identity',
          shortDescription: 'Premium branding that sets you apart from competition.',
          description: 'Craft a unique visual identity, including custom logos, color palettes, professional typography guidelines, and brand design assets.',
          icon: 'palette',
          features: ['Custom Logo Design', 'Full Brand Guidelines', 'Social Media Templates'],
          status: 'active',
          order: 2
        },
        {
          title: 'SEO Optimization',
          shortDescription: 'Rank higher on Google and search engines organically.',
          description: 'Boost search engine visibility with detailed keyword research, technical on-page auditing, backlink analysis, and structured metadata tuning.',
          icon: 'globe',
          features: ['Comprehensive Keyword Strategy', 'On-Page Technical Auditing', 'Google Search Console Analytics'],
          status: 'active',
          order: 3
        },
        {
          title: 'Landing Pages',
          shortDescription: 'Conversion-optimized pages built for ad campaigns.',
          description: 'High-impact single pages engineered for high Conversion Rate Optimization (CRO), compelling copy, fast page speeds, and flawless user experiences.',
          icon: 'briefcase',
          features: ['High-Converting Copywriting', 'Flawless User Experience (UX)', 'A/B Testing Integration'],
          status: 'active',
          order: 4
        },
        {
          title: 'Social Media Management',
          shortDescription: 'Content production and scheduling across platforms.',
          description: 'Grow your social community with professional creative designs, engaging video edits, consistent posting plans, and analytics tracking.',
          icon: 'bullhorn',
          features: ['Custom Content Calendar', 'High-Quality Video Edits', 'Performance Reporting'],
          status: 'active',
          order: 5
        },
        {
          title: 'AI Automation',
          shortDescription: 'Optimize operations with custom AI workflows.',
          description: 'Integrate Large Language Models (LLMs) like Gemini, automate repetitive tasks with Make/Zapier, and launch smart lead generation chatbots.',
          icon: 'robot',
          features: ['Automated Lead Qualification', 'Custom LLM Integrations', 'Workflow Optimizations'],
          status: 'active',
          order: 6
        }
      ];
      await Service.create(defaultServices);
      console.log('✓ Successfully seeded default services.');
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

module.exports = seedData;
