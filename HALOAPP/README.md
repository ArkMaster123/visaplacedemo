# VisaPlace - Immigration Law Firm Website

A modern, minimalist website for VisaPlace immigration law firm built with Next.js, featuring an AI-powered chatbot for client assistance.

## 🚀 Features

- **Minimalist Apple-style Design** - Clean, professional interface with subtle animations
- **AI-Powered Chatbot** - Vercel AI SDK integration for immigration assistance
- **Dual Country Focus** - Canadian and US immigration services
- **Mobile-First Responsive** - Optimized for all devices
- **Performance Optimized** - Built with Next.js 14+ and Tailwind CSS
- **SEO Ready** - Comprehensive metadata and structured data

## 🛠 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **AI Integration**: Vercel AI SDK with OpenAI
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Font**: Inter (Google Fonts)

## 🎨 Design System

### Colors
- **Primary Blue**: `#1e3a8a` (Trust, professionalism)
- **Accent Red**: `#dc2626` (Canada flag accent)
- **Neutral Grays**: Clean whites and grays for backgrounds
- **System Colors**: Success, warning, and error states

### Typography
- **Font Family**: Inter
- **Responsive Scale**: 14px to 48px
- **Font Weights**: 400 (regular) to 700 (bold)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (for AI chatbot)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd visaplace-redesign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

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
│   │   └── ai-chatbot.tsx # AI chatbot component
│   └── lib/
│       └── utils.ts       # Utility functions
├── tailwind.config.ts     # Tailwind configuration
└── package.json
```

## 🤖 AI Chatbot Features

The AI chatbot is powered by Vercel AI SDK and includes:

- **Immigration Expertise**: Trained on Canadian and US immigration processes
- **Lead Qualification**: Intelligent questioning to qualify potential clients
- **Minimalist UI**: Apple-inspired chat interface
- **Real-time Streaming**: Instant responses with typing indicators
- **Conversation Memory**: Context-aware conversations
- **Professional Handoff**: Seamless transition to human consultants

### Chatbot Capabilities
- Express Entry guidance
- Work permit information
- Green card processes
- Family sponsorship advice
- Study permit assistance
- Business immigration options

## 🎯 Key Pages & Components

### Homepage
- Hero section with country selector (🇨🇦/🇺🇸)
- Trust indicators and statistics
- Popular immigration pathways
- Why choose VisaPlace section
- Call-to-action sections

### Navigation
- Sticky header with glass effect
- Dropdown menus for services
- Mobile-responsive hamburger menu
- Quick access to assessments and consultations

### AI Chatbot
- Floating chat button (bottom-right)
- Expandable chat window
- Pre-defined quick questions
- Professional disclaimer and consultation booking

## 🎨 Design Principles

1. **Minimalism**: Clean, uncluttered interface
2. **Apple-inspired**: Subtle shadows, rounded corners, smooth animations
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Performance**: Optimized loading and Core Web Vitals
5. **Mobile-first**: Responsive design starting from mobile

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The project can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📊 Performance Targets

- **Lighthouse Score**: 90+ across all categories
- **Core Web Vitals**:
  - LCP: < 2.5 seconds
  - FID: < 100 milliseconds
  - CLS: < 0.1

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for chatbot | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved by VisaPlace.

## 📞 Support

For technical support or questions about this project, please contact the development team.

---

**Built with ❤️ for VisaPlace Immigration Law Firm**
