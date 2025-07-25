# Multi-Agent Expertise Capture System

A sophisticated AI-powered system that uses multiple specialized agents working together to capture and analyze human expertise through various methods and voice interactions.

## 🚀 Features

### Multi-Agent Architecture
- **Orchestrator Agent**: Coordinates all other agents and manages workflow
- **Narrative Agent**: Captures stories and experiences through storytelling (Method 1)
- **Questionnaire Agent**: Probes deeper with targeted questions (Method 2)
- **Simulation Agent**: Guides real-time task walkthroughs (Method 3)
- **Protocol Agent**: Captures cognitive processes and decision-making (Method 4)

### Voice Integration
- **Voice Input**: Speak directly to agents using microphone
- **Text-to-Speech**: Agents can respond with voice
- **Real-time Processing**: Live audio level indicators
- **Hume AI Ready**: Prepared for integration with Hume AI's voice capabilities

### Visual Workflow
- **React Flow Visualization**: Interactive flow diagram showing agent connections
- **Real-time Status**: Live status indicators for each agent
- **Dynamic Connections**: Visual representation of data flow between agents

### Advanced UI
- **Responsive Design**: Works on desktop and mobile
- **Dark/Light Mode**: Theme support
- **Real-time Updates**: Live status and progress indicators
- **Interactive Controls**: Easy agent switching and voice controls

## 🏗️ Architecture

### Agent System
```
Orchestrator Agent
├── Narrative Agent (Method 1)
├── Questionnaire Agent (Method 2)
├── Simulation Agent (Method 3)
└── Protocol Agent (Method 4)
```

### Data Flow
1. **User Input** → Voice/Text → Active Agent
2. **Agent Processing** → AI Analysis → Response
3. **Context Sharing** → Other Agents → Coordinated Workflow
4. **Results** → Analysis → Insights

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React Flow**: Interactive flow diagrams
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library
- **Lucide React**: Icon library

### Backend
- **AI SDK**: Vercel's AI SDK for LLM integration
- **OpenAI**: GPT-4o-mini for agent responses
- **Next.js API Routes**: Server-side API endpoints

### Voice Integration
- **Web Audio API**: Browser-based audio processing
- **MediaRecorder API**: Audio capture and recording
- **Speech Synthesis**: Text-to-speech capabilities
- **Hume AI Ready**: Prepared for Hume AI integration

## 📁 Project Structure

```
src/
├── app/
│   ├── multi-agent/
│   │   └── page.tsx                 # Main multi-agent page
│   └── api/
│       └── multi-agent/
│           ├── orchestrator/
│           │   └── route.ts         # Orchestrator agent API
│           ├── narrative/
│           │   └── route.ts         # Narrative agent API (Method 1)
│           ├── questionnaire/
│           │   └── route.ts         # Questionnaire agent API (Method 2)
│           ├── simulation/
│           │   └── route.ts         # Simulation agent API (Method 3)
│           └── protocol/
│               └── route.ts         # Protocol agent API (Method 4)
├── components/
│   └── multi-agent/
│       ├── multi-agent-flow.tsx     # React Flow visualization
│       ├── voice-interface.tsx      # Voice interaction component
│       └── agent-chat.tsx           # Agent chat interface
└── lib/
    └── prompts.ts                   # Agent prompts and methods
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HALOAPP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the multi-agent system**
   Navigate to `http://localhost:3000/multi-agent`

## 🎯 Usage

### Basic Workflow

1. **Enable Voice** (Optional)
   - Click "Enable Voice" to activate voice capabilities
   - Grant microphone permissions when prompted

2. **Select an Agent**
   - Choose from the agent panel on the left
   - Each agent has a specific role and method

3. **Start Interaction**
   - Use voice input or type messages
   - Agents will respond based on their specialized prompts

4. **Monitor Progress**
   - Watch the flow visualization for real-time updates
   - Track agent status and connections

### Agent Methods

#### Method 1: Narrative Storytelling
- **Agent**: Narrative Agent
- **Purpose**: Capture broad stories and experiences
- **Approach**: Natural conversation and storytelling

#### Method 2: Targeted Questioning
- **Agent**: Questionnaire Agent
- **Purpose**: Probe deeper with specific questions
- **Approach**: Structured questioning based on narratives

#### Method 3: Observational Simulation
- **Agent**: Simulation Agent
- **Purpose**: Guide real-time task walkthroughs
- **Approach**: Step-by-step process demonstrations

#### Method 4: Protocol Analysis
- **Agent**: Protocol Agent
- **Purpose**: Capture cognitive processes
- **Approach**: Think-aloud sessions and decision analysis

## 🔧 Configuration

### Agent Prompts
Modify agent behavior by editing prompts in `src/lib/prompts.ts`:

```typescript
export const defaultPrompts = {
  '1': `Narrative Agent prompt...`,
  '2': `Questionnaire Agent prompt...`,
  '3': `Simulation Agent prompt...`,
  '4': `Protocol Agent prompt...`
};
```

### Voice Settings
Configure voice capabilities in the voice interface component:

```typescript
// Enable/disable voice features
const isVoiceEnabled = true;
const isListening = false;
```

### React Flow Customization
Modify the flow visualization in `multi-agent-flow.tsx`:

```typescript
// Add new nodes
const newNodes = [
  {
    id: 'new-agent',
    type: 'agentNode',
    position: { x: 100, y: 100 },
    data: { /* agent data */ }
  }
];
```

## 🔌 Hume AI Integration

The system now includes full Hume AI integration for voice interactions. The Hume AI voice interface provides:

### Features
- **Real-time Voice Chat**: Speak directly to agents using Hume AI's voice capabilities
- **Text-to-Speech**: Agents respond with natural-sounding voice
- **Connection Management**: Automatic connection handling and error recovery
- **Fallback Text Input**: Text input when voice is unavailable
- **Message History**: Complete conversation history with timestamps

### Setup Instructions

1. **Get Hume AI Credentials**
   - Visit [platform.hume.ai](https://platform.hume.ai)
   - Create an account and get your API key and secret key

2. **Configure Environment Variables**
   Add to your `.env.local` file:
   ```bash
   NEXT_PUBLIC_HUME_API_KEY=your_hume_api_key_here
   NEXT_PUBLIC_HUME_SECRET_KEY=your_hume_secret_key_here
   ```

3. **Enable Voice Features**
   - Click "Enable Voice" in the multi-agent interface
   - Click "Connect to Hume AI" to establish voice connection
   - Grant microphone permissions when prompted

### Usage
- **Voice Input**: Click the microphone button and speak to interact with agents
- **Voice Output**: Agents will respond with voice when connected
- **Text Fallback**: Use the text input area when voice is not available
- **Connection Status**: Monitor connection status and errors in real-time

### Components
- `HumeProvider`: Manages authentication and connection state
- `HumeVoiceInterface`: Handles voice interactions and message display
- Integrated with existing agent chat system for seamless workflow

## 🎨 Customization

### Styling
- Modify Tailwind classes for visual changes
- Update color schemes in `tailwind.config.ts`
- Customize component styles in individual files

### Agent Behavior
- Edit prompts in `src/lib/prompts.ts`
- Modify API routes for different LLM models
- Add new agents by creating new API routes

### Flow Visualization
- Add new node types in `multi-agent-flow.tsx`
- Customize edge styles and animations
- Modify node positioning and layout

## 🧪 Testing

### Voice Testing
1. Enable voice in the interface
2. Grant microphone permissions
3. Test voice input and output
4. Verify audio level indicators

### Agent Testing
1. Select different agents
2. Test conversation flows
3. Verify prompt responses
4. Check agent coordination

### Flow Testing
1. Interact with flow visualization
2. Test node selection
3. Verify status updates
4. Check edge animations

## 🚀 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Environment Variables
```
# OpenAI API Configuration (Required)
OPENAI_API_KEY=your_openai_api_key

# Hume AI Configuration (Optional - for voice features)
NEXT_PUBLIC_HUME_API_KEY=your_hume_api_key
NEXT_PUBLIC_HUME_SECRET_KEY=your_hume_secret_key

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- **Advanced Voice Processing**: Enhanced speech recognition
- **Multi-language Support**: Internationalization
- **Analytics Dashboard**: Usage and performance metrics
- **Custom Agent Creation**: User-defined agents
- **Integration APIs**: Third-party service connections
- **Mobile App**: Native mobile application
- **Offline Support**: Local processing capabilities 