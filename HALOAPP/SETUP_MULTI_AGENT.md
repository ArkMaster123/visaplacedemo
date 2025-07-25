# Multi-Agent System Setup Guide

## Quick Start

### 1. Environment Variables

Create a `.env.local` file in the HALOAPP directory with the following variables:

```bash
# OpenAI API Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Hume AI Configuration (Optional - for voice features)
HUME_API_KEY=your_hume_api_key_here
HUME_SECRET_KEY=your_hume_secret_key_here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
cd HALOAPP
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Access the Multi-Agent System

Navigate to: `http://localhost:3000/multi-agent`

## Features Overview

### 🎯 Multi-Agent Architecture
- **Orchestrator**: Coordinates all agents
- **Narrative Agent**: Storytelling method (Method 1)
- **Questionnaire Agent**: Targeted questioning (Method 2)
- **Simulation Agent**: Task walkthroughs (Method 3)
- **Protocol Agent**: Cognitive analysis (Method 4)

### 🎤 Voice Capabilities
- Voice input and output
- Real-time audio processing
- Text-to-speech responses
- Audio level indicators

### 📊 Visual Workflow
- Interactive React Flow diagram
- Real-time agent status
- Dynamic connections between agents
- Live progress tracking

## Usage Instructions

### Basic Workflow

1. **Enable Voice** (Optional)
   - Click "Enable Voice" button
   - Grant microphone permissions

2. **Select an Agent**
   - Choose from the agent panel
   - Each agent has specific expertise

3. **Start Interaction**
   - Use voice or text input
   - Watch real-time responses

4. **Monitor Progress**
   - View flow visualization
   - Track agent status

### Agent Methods

| Agent | Method | Purpose |
|-------|--------|---------|
| Narrative | Method 1 | Capture stories and experiences |
| Questionnaire | Method 2 | Probe with targeted questions |
| Simulation | Method 3 | Guide task walkthroughs |
| Protocol | Method 4 | Analyze cognitive processes |

## Troubleshooting

### Voice Issues
- Ensure microphone permissions are granted
- Check browser compatibility
- Try refreshing the page

### Agent Issues
- Verify OpenAI API key is set
- Check network connectivity
- Review browser console for errors

### Flow Visualization
- Ensure React Flow is properly installed
- Check for JavaScript errors
- Verify all dependencies are installed

## Next Steps

1. **Customize Prompts**: Edit `src/lib/prompts.ts`
2. **Add New Agents**: Create new API routes
3. **Integrate Hume AI**: Follow Hume AI documentation
4. **Deploy**: Use Vercel or your preferred platform

## Support

For issues or questions:
- Check the main README
- Review the code documentation
- Create an issue in the repository 