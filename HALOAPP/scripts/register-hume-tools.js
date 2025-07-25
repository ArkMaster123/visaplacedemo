import { HumeClient } from "hume";

const client = new HumeClient({ 
  apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY 
});

async function registerExpertiseCaptureTool() {
  try {
    const tool = await client.empathicVoice.tools.createTool({
      name: "capture_expertise",
      parameters: JSON.stringify({
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The user's location or context where expertise is being captured"
          },
          expertise_domain: {
            type: "string",
            description: "The domain or field of expertise being captured (e.g., marketing, engineering, healthcare)"
          },
          capture_type: {
            type: "string",
            enum: ["narrative", "questionnaire", "simulation", "protocol", "orchestrator"],
            description: "The type of expertise capture method to use"
          },
          user_input: {
            type: "string",
            description: "The user's voice input or expertise content to be captured and processed"
          }
        },
        required: ["user_input"]
      }),
      versionDescription: "Captures and processes user expertise using specialized AI agents for knowledge elicitation",
      description: "This tool captures user expertise through voice input and routes it to appropriate AI agents for structured knowledge capture and analysis",
      fallbackContent: "I was unable to capture your expertise at this time. Please try again or contact support if the issue persists."
    });

    console.log('Successfully registered expertise capture tool:', tool);
    return tool;
  } catch (error) {
    console.error('Failed to register tool:', error);
    throw error;
  }
}

// Run the registration
registerExpertiseCaptureTool()
  .then(() => {
    console.log('Tool registration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Tool registration failed:', error);
    process.exit(1);
  }); 