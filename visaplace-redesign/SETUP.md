# VisaPlace Setup Instructions

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory with:

```env
# OpenAI API Key for AI Chatbot (Required for chatbot functionality)
OPENAI_API_KEY=your_openai_api_key_here

# Next.js App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**To get an OpenAI API Key:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env.local` file

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🤖 AI Chatbot

The AI chatbot is powered by Vercel AI SDK and OpenAI. It provides:
- Immigration guidance for Canada and US
- Lead qualification
- 24/7 assistance
- Professional handoff to human consultants

**Note:** The chatbot requires a valid OpenAI API key to function.

## 📁 Project Structure

```
visaplace-redesign/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/chat/       # AI chatbot API route
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── header.tsx     # Navigation header
│   │   ├── footer.tsx     # Site footer
│   │   └── ai-chatbot.tsx # AI chatbot component
│   └── lib/
│       └── utils.ts       # Utility functions
├── public/
│   ├── images/            # Images and logos
│   └── favicon.svg        # Site favicon
├── tailwind.config.ts     # Tailwind configuration
└── package.json
```

## 🎨 Design System

- **Colors**: Deep blue primary (#1e3a8a), red accent (#dc2626)
- **Typography**: Inter font family
- **Style**: Minimalist Apple-inspired design
- **Framework**: Tailwind CSS with custom utilities

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Features

✅ **Completed:**
- Modern, responsive design
- AI-powered chatbot
- Professional team showcase
- Country-specific immigration pathways
- Trust indicators and testimonials
- Clean navigation and footer
- Mobile-first approach
- Performance optimized

## 🚀 Deployment

The project is ready for deployment on Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## 📞 Support

For technical support or questions about the implementation, please refer to the documentation or contact the development team. 