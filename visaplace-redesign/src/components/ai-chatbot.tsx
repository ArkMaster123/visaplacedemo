"use client";

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Briefcase, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Smooth auto-scroll function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      // Smooth scroll animation
      const startScrollTop = container.scrollTop;
      const distance = maxScrollTop - startScrollTop;
      const duration = 300; // 300ms for smooth scroll
      let startTime: number | null = null;

      const animateScroll = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        const easedProgress = easeInOutCubic(progress);
        
        container.scrollTop = startScrollTop + distance * easedProgress;
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  };

  // Auto-scroll when messages change or when loading
  useEffect(() => {
    if (messages.length > 0 || isLoading) {
      // Small delay to ensure DOM is updated
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isLoading]);

  // Auto-scroll when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 200);
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-soft-lg hover:shadow-lg transition-all duration-300 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center relative"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6" />
              {/* Briefcase overlay */}
              <div className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm">
                <Briefcase className="h-3 w-3 text-red-600" />
              </div>
            </>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
          <Card className="card-minimal shadow-soft-lg border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                  <Briefcase className="h-4 w-4 text-red-600" />
                </div>
                VisaPlace Assistant
              </CardTitle>
              <p className="text-sm text-neutral-600">
                Get instant help with your immigration questions
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="h-80 overflow-y-auto space-y-3 pr-2 scroll-smooth"
                style={{ scrollBehavior: 'smooth' }}
              >
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-3">
                      <Briefcase className="h-6 w-6 text-red-600" />
                    </div>
                    <p className="text-sm text-neutral-600 mb-4">
                      Hi! I'm here to help with your Canadian and US immigration questions.
                    </p>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start"
                        onClick={() => {
                          const syntheticEvent = {
                            preventDefault: () => {},
                          } as React.FormEvent<HTMLFormElement>;
                          handleInputChange({
                            target: { value: "I want to immigrate to Canada" }
                          } as React.ChangeEvent<HTMLInputElement>);
                          setTimeout(() => handleSubmit(syntheticEvent), 100);
                        }}
                      >
                        I want to immigrate to Canada
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start"
                        onClick={() => {
                          const syntheticEvent = {
                            preventDefault: () => {},
                          } as React.FormEvent<HTMLFormElement>;
                          handleInputChange({
                            target: { value: "Tell me about US Green Cards" }
                          } as React.ChangeEvent<HTMLInputElement>);
                          setTimeout(() => handleSubmit(syntheticEvent), 100);
                        }}
                      >
                        Tell me about US Green Cards
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start"
                        onClick={() => {
                          const syntheticEvent = {
                            preventDefault: () => {},
                          } as React.FormEvent<HTMLFormElement>;
                          handleInputChange({
                            target: { value: "How can I check my eligibility?" }
                          } as React.ChangeEvent<HTMLInputElement>);
                          setTimeout(() => handleSubmit(syntheticEvent), 100);
                        }}
                      >
                        How can I check my eligibility?
                      </Button>
                    </div>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 text-sm",
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 flex-shrink-0">
                        <Briefcase className="h-4 w-4 text-red-600" />
                      </div>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2",
                        message.role === 'user'
                          ? 'bg-red-600 text-white'
                          : 'bg-neutral-100 text-neutral-900'
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-200 flex-shrink-0">
                        <User className="h-4 w-4 text-neutral-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 text-sm justify-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 flex-shrink-0">
                      <Briefcase className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="bg-neutral-100 rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Invisible div to scroll to */}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about immigration..."
                  className="flex-1 rounded-xl border-neutral-200 focus:border-red-300 focus:ring-red-200"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              <p className="text-xs text-neutral-500 text-center">
                This AI assistant provides general information. For personalized advice, 
                <button 
                  className="text-red-600 hover:underline ml-1"
                  onClick={() => window.open('/consultation', '_blank')}
                >
                  book a consultation
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
} 