# Hume AI Tool Calling Setup Guide

This guide explains how to set up and use Hume AI's tool calling feature to capture expertise and route it to specialized AI agents.

## 🎯 **Overview**

The system now uses Hume AI's tool calling feature to:
1. **Capture voice input** through Hume AI's voice interface
2. **Route to specialized agents** (Narrative, Questionnaire, Simulation, Protocol)
3. **Process and structure** the captured expertise
4. **Display results** with captured knowledge and next steps

## 🚀 **Setup Instructions**

### **1. Environment Variables**

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_HUME_API_KEY=your_hume_api_key_here
NEXT_PUBLIC_HUME_SECRET_KEY=your_hume_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### **2. Register the Tool with Hume AI**

Run the tool registration script:

```bash
cd HALOAPP
node scripts/register-hume-tools.js
```

This will register the `capture_expertise` tool with Hume AI's tool calling API.

### **3. Start the Development Server**

```bash
npm run dev
```

## 🔧 **How It Works**

### **1. Voice Input Capture**
- User speaks through Hume AI's voice interface
- Voice is converted to text and sent to the appropriate agent

### **2. Tool Calling**
- Hume AI calls the `capture_expertise` tool with user input
- Tool routes input to the correct agent based on `capture_type`
- Agent processes the input and returns structured knowledge

### **3. Agent Processing**
Each agent specializes in different expertise capture methods:

- **Orchestrator**: Coordinates workflow and manages context
- **Narrative**: Captures stories and experiences
- **Questionnaire**: Asks targeted questions for deeper insights
- **Simulation**: Guides task walkthroughs and process mapping
- **Protocol**: Analyzes cognitive processes and decision-making

### **4. Results Display**
- Captured expertise is displayed in the results section
- Shows agent responses and structured knowledge
- Provides next steps for further processing

## 📁 **File Structure**

```
HALOAPP/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── hume-tools/
│   │   │       └── capture-expertise/
│   │   │           └── route.ts          # Tool calling API endpoint
│   │   └── multi-agent/
│   │       └── page.tsx                  # Main voice interface
│   └── components/
│       └── multi-agent/
│           └── hume-widget.tsx           # Hume AI voice widget
├── scripts/
│   └── register-hume-tools.js            # Tool registration script
└── HUME_TOOL_CALLING_SETUP.md            # This file
```

## 🎮 **Usage**

### **1. Start Voice Session**
1. Navigate to `/multi-agent`
2. Click "Start Voice Session"
3. Allow microphone permissions
4. Speak about your expertise

### **2. Agent Interaction**
- The system will automatically route your input to the appropriate agent
- Each agent will process your expertise using their specialized methods
- You'll see real-time responses and captured knowledge

### **3. Review Results**
- After the session, review captured expertise
- See how each agent processed your input
- Follow the next steps to export or refine your knowledge

## 🔍 **API Endpoints**

### **POST /api/hume-tools/capture-expertise**

Processes user input through specialized agents.

**Request Body:**
```json
{
  "location": "optional_location",
  "expertise_domain": "marketing|engineering|healthcare|etc",
  "capture_type": "narrative|questionnaire|simulation|protocol|orchestrator",
  "user_input": "user's voice input or expertise content"
}
```

**Response:**
```json
{
  "success": true,
  "agent": "Agent Name",
  "captured_expertise": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "agent": "Agent Name",
    "domain": "expertise_domain",
    "input": "user_input",
    "response": "agent_response",
    "capture_type": "capture_type"
  },
  "response": "agent_response",
  "next_steps": ["step1", "step2", "step3", "step4"]
}
```

## 🛠 **Customization**

### **Adding New Agents**
1. Add new agent type to the `capture_type` enum in the API route
2. Add corresponding agent prompt in the `processWithAgent` function
3. Update the tool registration script with new parameters

### **Modifying Agent Prompts**
Edit the agent prompts in `src/app/api/hume-tools/capture-expertise/route.ts` to customize how each agent processes expertise.

### **Adding New Tools**
1. Create new API route in `src/app/api/hume-tools/`
2. Register the tool using the Hume AI API
3. Update the voice widget to use the new tool

## 🐛 **Troubleshooting**

### **Tool Not Registered**
- Run the registration script: `node scripts/register-hume-tools.js`
- Check that your Hume AI API key is correct
- Verify the tool appears in your Hume AI dashboard

### **Voice Not Working**
- Check microphone permissions in browser
- Verify Hume AI credentials are set correctly
- Check browser console for errors

### **Agent Responses Not Showing**
- Check the API route is working: `curl -X POST /api/hume-tools/capture-expertise`
- Verify OpenAI API key is set correctly
- Check server logs for errors

## 📚 **Resources**

- [Hume AI Documentation](https://docs.hume.ai/)
- [Hume AI Tool Calling Guide](https://docs.hume.ai/docs/tool-calling)
- [React SDK Documentation](https://github.com/HumeAI/empathic-voice-api-js/tree/main/packages/react)

## 🎉 **Next Steps**

1. **Test the voice interface** with different types of expertise
2. **Customize agent prompts** for your specific domain
3. **Add more specialized tools** for advanced expertise capture
4. **Integrate with database** for persistent storage
5. **Add export functionality** for captured expertise 