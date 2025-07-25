"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  User, 
  ArrowRight, 
  CheckCircle, 
  Calendar,
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Brain,
  MessageSquare,
  Target,
  Sparkles,
  Settings,
  RotateCcw,
  Zap,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import { useRouter } from 'next/navigation';

interface AssessmentOption {
  id: string;
  text: string;
  value: string;
  description?: string;
}

interface AssessmentResponse {
  message: string;
  currentStep: string;
  progress: number;
  options: AssessmentOption[];
  nextAction: 'continue' | 'complete' | 'redirect';
  recommendations?: string[];
  eligibilityScore?: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  assessment?: AssessmentResponse;
}

interface UserInfo {
  name: string;
  domain: string;
  history: string;
}

interface AssessmentChatbotProps {
  method: string;
  userInfo: UserInfo | null;
}

type AIModel = 'gpt-4o-mini' | 'gpt-4.1-nano';

export default function AssessmentChatbot({ method, userInfo }: AssessmentChatbotProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Record<string, any>>({});
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState<AIModel>('gpt-4o-mini');
  const [interactionMode, setInteractionMode] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiModels = [
    {
      id: 'gpt-4o-mini' as AIModel,
      name: 'GPT-4o Mini',
      description: 'Fast and cost-effective',
      icon: Zap,
      badge: 'Recommended'
    },
    {
      id: 'gpt-4.1-nano' as AIModel,
      name: 'GPT-4.1 Nano',
      description: 'Ultra-fast and efficient',
      icon: Cpu,
      badge: 'Fastest'
    }
  ];

  const howItWorksSteps = [
    {
      title: "Spark AI Expertise Capture",
      icon: Brain,
      description: "Meet Spark, an advanced AI built by Mega Lab to capture and organize your professional expertise through intelligent conversation.",
      details: [
        "Uses sophisticated prompting to extract tacit knowledge",
        "Adapts questioning style based on your responses",
        "Captures stories, processes, and decision-making patterns",
        "Built specifically for expertise elicitation and knowledge management"
      ]
    },
    {
      title: "Method-Specific Approach",
      icon: MessageSquare,
      description: `Method ${method} uses a specialized approach to capture different aspects of your expertise and professional knowledge.`,
      details: [
        method === '1' ? "Captures 3-5 detailed stories from your expertise" :
        method === '2' ? "Generates targeted questions based on your responses" :
        method === '3' ? "Guides step-by-step process demonstrations" :
        "Facilitates think-aloud protocols for decision-making",
        "Builds rapport through empathetic conversation",
        "Tracks progress and completion internally",
        "Focuses on extracting tacit knowledge and insights"
      ]
    },
    {
      title: "Knowledge Extraction Process",
      icon: Target,
      description: "The AI uses proven techniques from organizational knowledge management to capture your unique expertise.",
      details: [
        "Elicits both explicit and tacit knowledge",
        "Captures contextual factors and nuances",
        "Documents decision-making processes",
        "Preserves institutional knowledge and experience"
      ]
    },
    {
      title: "Structured Output",
      icon: Sparkles,
      description: "Your expertise is captured and organized for future reference and knowledge sharing within your organization.",
      details: [
        "Comprehensive summary of captured knowledge",
        "Organized by themes and patterns",
        "Ready for knowledge base integration",
        "Preserves your unique insights and experience"
      ]
    }
  ];

  // Auto-scroll function - only scroll when messages change, not on every interaction
  const scrollToBottom = () => {
    // Only scroll if we have messages and the messages container exists
    if (messages.length > 0 && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Only scroll when messages or loading state changes, and only after initial load
  useEffect(() => {
    // Don't scroll on initial empty state
    if (messages.length > 0 || isLoading) {
      scrollToBottom();
    }
  }, [messages.length, isLoading]);

  // Initialize the assessment
  useEffect(() => {
    startAssessment();
  }, []);

  const startAssessment = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Starting assessment with model:', selectedModel);
      
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Start expertise capture session' }],
          userProfile,
          model: selectedModel,
          method: method,
          userInfo: userInfo,
          interactionMode: interactionMode
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`Failed to start assessment: ${response.status} ${errorText}`);
      }

      const assessmentData: AssessmentResponse = await response.json();
      console.log('Received assessment data:', assessmentData);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: assessmentData.message,
        assessment: assessmentData
      };
      
      setMessages([newMessage]);
      setCurrentProgress(assessmentData.progress);
      
    } catch (error) {
      console.error('Assessment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to start assessment');
      
      // Add fallback message
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Welcome to your expertise capture session! I'm here to help capture and explore your professional knowledge and experience. Let's begin by understanding your background.",
        assessment: {
                      message: "Welcome to your expertise capture session! I'm here to help capture and explore your professional knowledge and experience. Let's begin by understanding your background.",
          currentStep: "Country Selection",
          progress: 5,
          options: [
            {
              id: "country",
              text: "I want to immigrate to Canada",
              value: "canada",
              description: "Explore Canadian immigration pathways including Express Entry, PNP, and more"
            },
            {
              id: "country",
              text: "I want to immigrate to the United States",
              value: "usa",
              description: "Learn about US Green Cards, work visas, and family immigration"
            },
            {
              id: "country",
              text: "I'm not sure which country is better for me",
              value: "unsure",
              description: "Get guidance on choosing between Canada and US immigration"
            }
          ],
          nextAction: 'continue' as const
        }
      };
      
      setMessages([fallbackMessage]);
      setCurrentProgress(5);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = async (option: AssessmentOption) => {
    setIsLoading(true);
    setError(null);
    
    // Handle interaction mode selection
    if (option.id === 'mode_buttons' || option.id === 'mode_conversation') {
      setInteractionMode(option.value);
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: option.text
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Update user profile
    const updatedProfile = { ...userProfile, [option.id]: option.value };
    setUserProfile(updatedProfile);
    
    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          userProfile: updatedProfile,
          model: selectedModel,
          method: method,
          userInfo: userInfo,
          interactionMode: interactionMode
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get assessment response: ${response.status}`);
      }

      const assessmentData: AssessmentResponse = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assessmentData.message,
        assessment: assessmentData
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentProgress(assessmentData.progress);
      
    } catch (error) {
      console.error('Assessment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textInput.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTextInput(''); // Clear input
    
    try {
      const response = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          userProfile: userProfile,
          model: selectedModel,
          method: method,
          userInfo: userInfo,
          interactionMode: interactionMode
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get assessment response: ${response.status}`);
      }

      const assessmentData: AssessmentResponse = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assessmentData.message,
        assessment: assessmentData
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentProgress(assessmentData.progress);
      
    } catch (error) {
      console.error('Assessment error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setUserProfile({});
    setCurrentProgress(0);
    setError(null);
    setIsLoading(false);
    sessionStorage.removeItem('halo_user_info');
    sessionStorage.removeItem('halo_method');
    router.push('/');
  };

  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);
    setShowSettings(false);
    // Optionally restart assessment with new model
    // handleReset();
  };

  const handleBookConsultation = () => {
    window.open('/consultation', '_blank');
  };

  const openHowItWorks = () => {
    setShowHowItWorks(true);
    setCurrentStep(0);
  };

  const closeHowItWorks = () => {
    setShowHowItWorks(false);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const nextStep = () => {
    if (currentStep < howItWorksSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeHowItWorks();
      closeSettings();
    }
  };

  // Keyboard navigation for modals
  useEffect(() => {
    if (!showHowItWorks && !showSettings) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeHowItWorks();
        closeSettings();
      } else if (showHowItWorks) {
        if (e.key === 'ArrowRight' && currentStep < howItWorksSteps.length - 1) {
          nextStep();
        } else if (e.key === 'ArrowLeft' && currentStep > 0) {
          prevStep();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showHowItWorks, showSettings, currentStep]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showHowItWorks || showSettings) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showHowItWorks, showSettings]);

  return (
    <>
      {/* How It Works Modal */}
      {showHowItWorks && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalClick}
        >
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/20 dark:border-slate-700/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Brain className="h-5 w-5 text-blue-800 dark:text-blue-200" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">How Our AI Assessment Works</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Step {currentStep + 1} of {howItWorksSteps.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeHowItWorks}
                className="rounded-full w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-center mb-6">
                <div className="flex space-x-2">
                  {howItWorksSteps.map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-3 h-3 rounded-full transition-colors",
                        index === currentStep
                          ? "bg-blue-800"
                          : index < currentStep
                          ? "bg-blue-400"
                          : "bg-slate-200"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Current Step Content */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mx-auto mb-4">
                  {React.createElement(howItWorksSteps[currentStep].icon, {
                    className: "h-8 w-8 text-blue-800"
                  })}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                  {howItWorksSteps[currentStep].title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-6">
                  {howItWorksSteps[currentStep].description}
                </p>

                {/* Details List */}
                <div className="bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-lg p-4">
                  <ul className="space-y-2 text-left">
                    {howItWorksSteps[currentStep].details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep < howItWorksSteps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={closeHowItWorks}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Got it!
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleModalClick}
        >
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-white/20 dark:border-slate-700/20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Settings className="h-5 w-5 text-blue-800 dark:text-blue-200" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">AI Model Settings</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Choose your preferred AI model
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeSettings}
                className="rounded-full w-8 h-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-3">
                {aiModels.map((model) => (
                  <div
                    key={model.id}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700",
                      selectedModel === model.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-600"
                    )}
                    onClick={() => handleModelChange(model.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700">
                          {React.createElement(model.icon, {
                            className: "h-4 w-4 text-slate-600 dark:text-slate-300"
                          })}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-slate-900 dark:text-white">{model.name}</h3>
                            <Badge 
                              variant={model.badge === 'Recommended' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {model.badge}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{model.description}</p>
                        </div>
                      </div>
                      {selectedModel === model.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> Changing the model will affect future responses. 
                  Consider resetting the assessment to start fresh with the new model.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Content - No wrapper card, just the content */}
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
              <Briefcase className="h-5 w-5 text-blue-800 dark:text-blue-200" />
            </div>
            <div>
                              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Expertise Capture Session</h2>
                              <p className="text-sm text-slate-600 dark:text-slate-300 font-normal">
                  AI-powered knowledge elicitation with Spark
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2 text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={openSettings}
              className="flex items-center gap-2 text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={openHowItWorks}
              className="flex items-center gap-2 text-blue-800 border-blue-200 hover:bg-blue-50"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">How it works</span>
            </Button>
          </div>
        </div>
        
        {/* Model Indicator */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Using {aiModels.find(m => m.id === selectedModel)?.name}
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Expertise Capture Progress</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">{currentProgress}%</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Error:</strong> {error}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={startAssessment}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-6 mb-6 max-h-96 overflow-y-auto scroll-smooth" id="messages-container">
          {messages.map((message) => (
            <div key={message.id} className="space-y-4">
              {/* Message */}
              <div className={cn(
                "flex gap-4",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}>
                {message.role === 'assistant' && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex-shrink-0 mt-1">
                    <Briefcase className="h-4 w-4 text-blue-800 dark:text-blue-200" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === 'user'
                    ? 'bg-blue-800 text-white'
                    : 'bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-white'
                )}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {message.role === 'user' && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  </div>
                )}
              </div>

              {/* Assessment Data */}
              {message.assessment && (
                <div className="ml-12 space-y-4">
                  {/* Current Step */}
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-800">
                      {message.assessment.currentStep}
                    </Badge>
                  </div>

                  {/* Options - Show buttons for mode selection or button mode */}
                  {message.assessment.options.length > 0 && (interactionMode === 'buttons' || !interactionMode) && (
                    <div className="grid gap-3">
                      {message.assessment.options.map((option) => (
                        <Button
                          key={option.id}
                          variant="outline"
                          className="justify-start text-left h-auto p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 border-slate-200 dark:border-slate-600"
                          onClick={() => handleOptionClick(option)}
                          disabled={isLoading}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <ArrowRight className="h-4 w-4 text-blue-800 dark:text-blue-300 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="font-medium text-slate-900 dark:text-white">{option.text}</div>
                              {option.description && (
                                <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Text Input for Conversation Mode */}
                  {interactionMode === 'conversation' && message === messages[messages.length - 1] && (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !isLoading && textInput.trim()) {
                            handleTextSubmit();
                          }
                        }}
                        placeholder="Type your response here..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Button
                        onClick={handleTextSubmit}
                        disabled={isLoading || !textInput.trim()}
                        className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? '...' : 'Send'}
                      </Button>
                    </div>
                  )}

                  {/* Recommendations */}
                  {message.assessment.recommendations && message.assessment.recommendations.length > 0 && (
                    <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">Recommendations</span>
                      </div>
                      <ul className="space-y-1 text-sm text-green-700">
                        {message.assessment.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Knowledge Capture Status */}
                  {message.assessment.eligibilityScore !== undefined && message.assessment.eligibilityScore > 0 && (
                    <div className="bg-green-50/80 backdrop-blur-sm border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-800">Knowledge Captured</span>
                        <span className="text-lg font-semibold text-green-800">
                          Session Active
                        </span>
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        Your expertise is being captured and analyzed
                      </div>
                    </div>
                  )}

                  {/* Consultation CTA */}
                  {message.assessment.nextAction === 'complete' && (
                    <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-lg p-4">
                      <div className="text-center">
                        <h3 className="font-semibold text-blue-800 mb-2">
                          Ready for the Next Step?
                        </h3>
                        <p className="text-sm text-blue-700 mb-4">
                          Book a consultation with our immigration experts to discuss your personalized plan.
                        </p>
                        <Button 
                          onClick={handleBookConsultation}
                          className="bg-blue-800 hover:bg-blue-900 text-white"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Free Consultation
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 flex-shrink-0">
                <Briefcase className="h-4 w-4 text-blue-800" />
              </div>
              <div className="bg-slate-100/80 backdrop-blur-sm rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </>
  );
} 