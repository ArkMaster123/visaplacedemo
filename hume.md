# EVI Next.js Quickstart

> A quickstart guide for implementing the Empathic Voice Interface (EVI) with Next.js.

With Humeâ€™s [React SDK](https://www.npmjs.com/package/@humeai/voice-react), WebSocket connection management is handled
for you and the complexities of audio capture, playback, and streaming are abstracted away. You can integrate EVI into
your React app with just a few hooks and components, without writing any low-level WebSocket or audio code.

In this guide, youâ€™ll learn how to integrate EVI into your Next.js applications using Humeâ€™s React SDK, with
step-by-step instructions for both the **App Router** and the **Pages Router**.

<CardGroup cols={1}>
  <Card title="EVI Next.js Starter" icon="rocket" iconPosition="left" href="https://vercel.com/templates/next.js/empathic-voice-interface-starter">
    Kickstart your project with our pre-configured Vercel template
  </Card>
</CardGroup>

<CardGroup>
  <Card title="Looking for sample code?" icon="brands github" href="https://github.com/HumeAI/hume-api-examples/tree/main/evi">
    See the complete implementation of this guide on GitHub
  </Card>

  <Card
    title="React SDK"
    icon={
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
        alt="React logo"
      />
    }
    href="https://github.com/HumeAI/empathic-voice-api-js/tree/main/packages/react"
  >
    Explore or contribute to Hume's React SDK on GitHub
  </Card>
</CardGroup>

**This guide is broken up into five sections:**

1. [**Installation**](#installation): Install Hume SDK packages.
2. [**Authentication**](#authenticate): Generate and use an access token to authenticate with EVI.
3. [**Context provider**](#context-provider): Set up the `<VoiceProvider/>`.
4. [**Connection**](#connection): Open a WebSocket connection and start a chat with EVI.
5. [**Display chat**](#display-chat): Display chat messages in the UI.

<Callout intent="info">
  Before you begin, you'll need an existing [Next.js project](https://nextjs.org/docs/getting-started/installation).
</Callout>

## Installation \[#installation]

Install Hume's [React SDK](https://www.npmjs.com/package/@humeai/voice-react) and [TypeScript
SDK](https://www.npmjs.com/package/hume) packages.

<Tabs>
  <Tab title="pnpm">
    ```sh
    pnpm i @humeai/voice-react hume
    ```
  </Tab>

  <Tab title="npm">
    ```sh
    npm i @humeai/voice-react hume
    ```
  </Tab>

  <Tab title="yarn">
    ```sh
    yarn add @humeai/voice-react hume 
    ```
  </Tab>

  <Tab title="bun">
    ```sh
    bun add @humeai/voice-react hume
    ```
  </Tab>
</Tabs>

## Authentication \[#authenticate]

Generate an access token for authentication. Doing so will require your **API key** and **Secret key**. These keys can
be obtained by logging into the portal and visiting the [API keys page](https://platform.hume.ai/settings/keys).

<Callout intent="warning">
  **Load your API key and secret from environment variables.** Avoid hardcoding them in your code to prevent
  credential leaks and unauthorized access.
</Callout>

<Tabs>
  <Tab title="App Router">
    In your root component, use the TypeScript SDK's `fetchAccessToken` method to fetch your access token.

    <CodeBlock title="./app/page.tsx">
      ```tsx maxLines=0
      import dynamic from "next/dynamic";
      import { fetchAccessToken } from "hume";

      const Chat = dynamic(() => import("@/components/Chat"), {
        ssr: false,
      });

      export default async function Page() {
        const accessToken = await fetchAccessToken({
          apiKey: String(process.env.HUME_API_KEY),
          secretKey: String(process.env.HUME_SECRET_KEY),
        });

        return (
          <div className={"grow flex flex-col"}>
            <Chat accessToken={accessToken} />
          </div>
        );
      }
      ```
    </CodeBlock>
  </Tab>

  <Tab title="Pages Router">
    In `index.tsx` define a function called `getServerSideProps` within `index.tsx` for fetching your access token.

    <CodeBlock title="./pages/index.tsx">
      ```tsx maxLines=0
      import StartCall from "@/components/StartCall";
      import Messages from "@/components/Messages";
      import { fetchAccessToken } from "hume";
      import { VoiceProvider } from "@humeai/voice-react";
      import { InferGetServerSidePropsType } from "next";

      export const getServerSideProps = async () => {
        try {
          const accessToken = await fetchAccessToken({
            apiKey: String(process.env.HUME_API_KEY),
            secretKey: String(process.env.HUME_SECRET_KEY),
          });

          return {
            props: {
              accessToken,
            },
          };
        } catch (error) {
          console.error("Failed to fetch access token:", error);
          throw error;
        }
      };

      type PageProps = InferGetServerSidePropsType<
        typeof getServerSideProps
      >;

      export default function Page({ accessToken }: PageProps) {
        return (
          <div className={"grow flex flex-col"}>
          </div>
        );
      }
      ```
    </CodeBlock>
  </Tab>
</Tabs>

## Context Provider \[#context-provider]

After fetching our access token we can pass it to our `Chat` component. First we set up the `<VoiceProvider/>` so that
our `Messages` and `StartCall` components can access the context.

We also pass the access token to the `accessToken` prop of the `StartCall` component for setting up the WebSocket
connection.

<Tabs>
  <Tab title="App Router">
    <CodeBlock title="./app/page.tsx">
      ```tsx maxLines=0
      import { VoiceProvider } from "@humeai/voice-react";
      import Messages from "./Messages";
      import StartCall from "./StartCall";

      export default function Chat({
        accessToken,
      }: {
        accessToken: string;
      }) {
        return (
          <VoiceProvider>
            <Messages />
            <StartCall accessToken={accessToken}/>
          </VoiceProvider>
        );
      }
      ```
    </CodeBlock>
  </Tab>

  <Tab title="Pages Router">
    <CodeBlock title="./pages/index.tsx">
      ```tsx maxLines=0
      import StartCall from "@/components/StartCall";
      import Messages from "@/components/Messages";
      import { fetchAccessToken } from "hume";
      import { VoiceProvider } from "@humeai/voice-react";
      import { InferGetServerSidePropsType } from "next";

      export const getServerSideProps = async () => {
        try {
          const accessToken = await fetchAccessToken({
            apiKey: String(process.env.HUME_API_KEY),
            secretKey: String(process.env.HUME_SECRET_KEY),
          });

          return {
            props: {
              accessToken,
            },
          };
        } catch (error) {
          console.error("Failed to fetch access token:", error);
          throw error;
        }
      };

      type PageProps = InferGetServerSidePropsType<
        typeof getServerSideProps
      >;

      export default function Page({ accessToken }: PageProps) {
        return (
          <div className={"grow flex flex-col"}>
            <VoiceProvider>
              <Messages />
              <StartCall accessToken={accessToken}/>
            </VoiceProvider>
          </div>
        );
      }
      ```
    </CodeBlock>
  </Tab>
</Tabs>

## Connection \[#connection]

Use the `useVoice` hook's `connect` method for starting a Chat session. It is important that this event is
attached to a user interaction event (like a click) so that the browser is capable of recording and playing
back audio.

<Callout intent="info">
  Implementing this step is the same whether you are using the **App Router** or **Pages Router**.
</Callout>

<CodeBlock title="./components/StartCall.tsx">
  ```tsx maxLines=0
  "use client";
  import {
    useVoice,
    ConnectOptions,
    VoiceReadyState
  } from "@humeai/voice-react";

  export default function StartCall({
    accessToken,
  }: {
    accessToken: string;
  }) {
    const { connect, disconnect, readyState } = useVoice();

    if (readyState === VoiceReadyState.OPEN) {
      return (
        <button
          onClick={() => {
            disconnect();
          }}
        >
          End Session
        </button>
      );
    }

    return (
      <button
        onClick={() => {
          connect({
            auth: { type: "accessToken", value: accessToken }
          })
            .then(() => {
              /* handle success */
            })
            .catch(() => {
              /* handle error */
            });
        }}
      >
        Start Session
      </button>
    );
  }
  ```
</CodeBlock>

## Display chat \[#display-chat]

Use the `useVoice` hook to access the `messages` array. We can then map over the `messages` array to display the
role (`Assistant` or `User`) and content of each message.

<Callout intent="info">
  Implementing this step is the same whether you are using the **App Router** or **Pages Router**.
</Callout>

<CodeBlock title="./components/Messages.tsx">
  ```tsx maxLines=0
  import { useVoice } from "@humeai/voice-react";

  export default function Messages() {
    const { messages } = useVoice();

    return (
      <div>
        {messages.map((msg, index) => {
          if (msg.type === "user_message" || msg.type === "assistant_message") {
            return null;
          }

          return (
            <div key={msg.type + index}>
              <div>{msg.message.role}</div>
              <div>{msg.message.content}</div>
            </div>
          );
        })}
      </div>
    );
  }
  ```
</CodeBlock>

## Next steps

**Congratulations!** Youâ€™ve successfully integrated EVI using Humeâ€™s React SDK.

Next, consider exploring these areas to enhance your EVI application:

<CardGroup>
  <Card title="Configure EVI" icon="sliders" href="/docs/speech-to-speech-evi/configuration/build-a-configuration">
    See detailed instructions on how you can customize EVI for your application needs.
  </Card>

  <Card title="Chat History" icon="history" href="/docs/speech-to-speech-evi/features/chat-history">
    Learn how you can access and manage conversation transcripts and expression measures.
  </Card>
</CardGroup>

<Callout intent="info">
  For further details and practical examples, explore the [API
  Reference](/reference/speech-to-speech-evi/chat/chat) and our [Hume API
  Examples](https://github.com/HumeAI/hume-api-examples/tree/main/evi) on GitHub.
</Callout>

***



Tool Calling:

Create tool
POST
https://api.hume.ai/v0/evi/tools
POST
/v0/evi/tools

TypeScript

import { HumeClient } from "hume";
const client = new HumeClient({ apiKey: "YOUR_API_KEY" });
await client.empathicVoice.tools.createTool({
    name: "get_current_weather",
    parameters: "{ \"type\": \"object\", \"properties\": { \"location\": { \"type\": \"string\", \"description\": \"The city and state, e.g. San Francisco, CA\" }, \"format\": { \"type\": \"string\", \"enum\": [\"celsius\", \"fahrenheit\"], \"description\": \"The temperature unit to use. Infer this from the users location.\" } }, \"required\": [\"location\", \"format\"] }",
    versionDescription: "Fetches current weather and uses celsius or fahrenheit based on location of user.",
    description: "This tool is for getting the current weather.",
    fallbackContent: "Unable to fetch current weather."
});
Try it
201
Created

{
  "tool_type": "FUNCTION",
  "id": "aa9b71c4-723c-47ff-9f83-1a1829e74376",
  "version": 0,
  "version_type": "FIXED",
  "name": "get_current_weather",
  "created_on": 1715275452390,
  "modified_on": 1715275452390,
  "parameters": "{ \"type\": \"object\", \"properties\": { \"location\": { \"type\": \"string\", \"description\": \"The city and state, e.g. San Francisco, CA\" }, \"format\": { \"type\": \"string\", \"enum\": [\"celsius\", \"fahrenheit\"], \"description\": \"The temperature unit to use. Infer this from the users location.\" } }, \"required\": [\"location\", \"format\"] }",
  "version_description": "Fetches current weather and uses celsius or fahrenheit based on location of user.",
  "fallback_content": "Unable to fetch current weather.",
  "description": "This tool is for getting the current weather."
}
Creates a Tool that can be added to an EVI configuration.

Refer to our tool use guide for comprehensive instructions on defining and integrating tools into EVI.

Headers
X-Hume-Api-Key
string
Required
Request
This endpoint expects an object.
name
string
Required
Name applied to all versions of a particular Tool.
parameters
string
Required
Stringified JSON defining the parameters used by this version of the Tool.

These parameters define the inputs needed for the Tool’s execution, including the expected data type and description for each input field. Structured as a stringified JSON schema, this format ensures the Tool receives data in the expected format.

version_description
string
Optional
An optional description of the Tool version.
description
string
Optional
An optional description of what the Tool does, used by the supplemental LLM to choose when and how to call the function.
fallback_content
string
Optional
Optional text passed to the supplemental LLM in place of the tool call result. The LLM then uses this text to generate a response back to the user, ensuring continuity in the conversation if the Tool errors.
Response
Created
tool_type
enum
Type of Tool. Either BUILTIN for natively implemented tools, like web search, or FUNCTION for user-defined tools.

Allowed values:
BUILTIN
FUNCTION
id
string
Identifier for a Tool. Formatted as a UUID.
version
integer
Version number for a Tool. Tools, Configs, Custom Voices, and Prompts are versioned. This versioning system supports iterative development, allowing you to progressively refine tools and revert to previous versions if needed. Version numbers are integer values representing different iterations of the Tool. Each update to the Tool increments its version number.
version_type
enum
Versioning method for a Tool. Either FIXED for using a fixed version number or LATEST for auto-updating to the latest version.

Allowed values:
FIXED
LATEST
name
string
Name applied to all versions of a particular Tool.
created_on
long
Time at which the Tool was created. Measured in seconds since the Unix epoch.

