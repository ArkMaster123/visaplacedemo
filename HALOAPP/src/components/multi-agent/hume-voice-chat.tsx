"use client";

import { VoiceProvider, useVoice } from "@humeai/voice-react";
import { ComponentRef, useRef, useEffect, forwardRef } from "react";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { motion, AnimatePresence } from "motion/react";
import { 
  Mic, 
  MicOff, 
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Expressions from './expressions';
import MicFFT from './mic-fft';

interface HumeVoiceChatProps {
  accessToken: string;
  activeAgent: string;
  onMessageReceived: (message: string) => void;
  onAgentResponse: (response: string) => void;
}

export default function HumeVoiceChat({
  accessToken,
  activeAgent,
  onMessageReceived,
  onAgentResponse
}: HumeVoiceChatProps) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // Use the specific HALO model config ID
  const configId = "5203e88d-cf3e-44ce-9ac7-aff76715e23d";

  console.log('HumeVoiceChat rendered with accessToken:', !!accessToken);

  return (
    <div className="relative w-full h-full">
      <VoiceProvider
        onMessage={() => {
          console.log('VoiceProvider onMessage triggered');
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
        onError={(error) => {
          console.error('VoiceProvider error:', error);
          toast.error(error.message);
        }}
      >
        <Messages 
          ref={ref} 
          onMessageReceived={onMessageReceived}
          onAgentResponse={onAgentResponse}
        />
        <Controls />
        <StartCall configId={configId} accessToken={accessToken} />
      </VoiceProvider>
    </div>
  );
}

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  {
    onMessageReceived: (message: string) => void;
    onAgentResponse: (response: string) => void;
  }
>(function Messages({ onMessageReceived, onAgentResponse }, ref) {
  const { messages } = useVoice();

  console.log('Messages component rendered with', messages.length, 'messages');
  
  // Log each message for debugging
  messages.forEach((msg, index) => {
    console.log(`Message ${index}:`, {
      type: msg.type,
      content: msg.message?.content,
      role: msg.message?.role,
      receivedAt: msg.receivedAt
    });
  });

  // Handle new messages for callbacks
  useEffect(() => {
    console.log('Messages useEffect triggered, messages.length:', messages.length);
    
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      console.log('Latest message:', latestMessage);
      
      if (latestMessage.type === 'user_message') {
        console.log('Calling onMessageReceived with:', latestMessage.message.content);
        onMessageReceived(latestMessage.message.content || '');
      } else if (latestMessage.type === 'assistant_message') {
        console.log('Calling onAgentResponse with:', latestMessage.message.content);
        onAgentResponse(latestMessage.message.content || '');
      }
    }
  }, [messages, onMessageReceived, onAgentResponse]);

  return (
    <motion.div
      layoutScroll
      className="grow overflow-auto p-4 pt-24 h-full"
      ref={ref}
    >
      <motion.div
        className="max-w-2xl mx-auto w-full flex flex-col gap-4 pb-24"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => {
            if (
              msg.type === "user_message" ||
              msg.type === "assistant_message"
            ) {
              return (
                <motion.div
                  key={msg.type + index}
                  className={cn(
                    "w-[80%]",
                    "bg-card",
                    "border border-border rounded-xl",
                    msg.type === "user_message" ? "ml-auto" : ""
                  )}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 0,
                  }}
                >
                  <div className="flex items-center justify-between pt-4 px-3">
                    <div
                      className={cn(
                        "text-xs capitalize font-medium leading-none opacity-50 tracking-tight"
                      )}
                    >
                      {msg.message.role}
                    </div>
                    <div
                      className={cn(
                        "text-xs capitalize font-medium leading-none opacity-50 tracking-tight"
                      )}
                    >
                      {msg.receivedAt.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                        second: undefined,
                      })}
                    </div>
                  </div>
                  <div className="pb-3 px-3">{msg.message.content}</div>
                  <Expressions values={{ ...msg.models.prosody?.scores }} />
                </motion.div>
              );
            }

            return null;
          })}
        </AnimatePresence>
        
        {/* Debug info when no messages */}
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center space-y-2">
              <Phone className="h-12 w-12 mx-auto opacity-30" />
              <p className="text-sm opacity-70">No messages yet</p>
              <p className="text-xs opacity-50">Start talking to see messages here</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});

function Controls() {
  const { disconnect, status, isMuted, unmute, mute, micFft } = useVoice();

  console.log('Controls rendered with status:', status.value, 'isMuted:', isMuted);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4 pb-6 flex items-center justify-center",
        "bg-gradient-to-t from-card via-card/90 to-card/0"
      )}
    >
      <AnimatePresence>
        {status.value === "connected" ? (
          <motion.div
            initial={{
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: "100%",
              opacity: 0,
            }}
            className="p-4 bg-card border border-border/50 rounded-full flex items-center gap-4"
          >
            <Toggle
              className="rounded-full"
              pressed={!isMuted}
              onPressedChange={() => {
                console.log('Toggle mute, current isMuted:', isMuted);
                if (isMuted) {
                  unmute();
                } else {
                  mute();
                }
              }}
            >
              {isMuted ? (
                <MicOff className="size-4" />
              ) : (
                <Mic className="size-4" />
              )}
            </Toggle>

            <div className="relative grid h-8 w-48 shrink grow-0">
              <MicFFT fft={micFft} className="fill-current" />
            </div>

            <Button
              className="flex items-center gap-1 rounded-full"
              onClick={() => {
                console.log('Disconnecting...');
                disconnect();
              }}
              variant="destructive"
            >
              <span>
                <Phone
                  className="size-4 opacity-50 fill-current"
                  strokeWidth={0}
                />
              </span>
              <span>End Call</span>
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function StartCall({ configId, accessToken }: { configId?: string, accessToken: string }) {
  const { status, connect } = useVoice();

  console.log('StartCall rendered with status:', status.value, 'accessToken present:', !!accessToken);

  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <motion.div
          className="fixed inset-0 p-4 flex items-center justify-center bg-background"
          initial="initial"
          animate="enter"
          exit="exit"
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1 },
            exit: { opacity: 0 },
          }}
        >
          <AnimatePresence>
            <motion.div
              variants={{
                initial: { scale: 0.5 },
                enter: { scale: 1 },
                exit: { scale: 0.5 },
              }}
            >
              <Button
                className="z-50 flex items-center gap-1.5 rounded-full"
                onClick={() => {
                  console.log('Attempting to connect with:', { accessToken: !!accessToken, configId });
                  connect({ 
                    auth: { type: "accessToken", value: accessToken },
                    configId
                  })
                    .then(() => {
                      console.log('Successfully connected to Hume AI!');
                      toast.success("Connected to Hume AI!");
                    })
                    .catch((error) => {
                      console.error('Connection failed:', error);
                      toast.error("Unable to start call");
                    });
                }}
              >
                <span>
                  <Phone
                    className="size-4 opacity-50 fill-current"
                    strokeWidth={0}
                  />
                </span>
                <span>Start Interview</span>
              </Button>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
} 