"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Brain, Target, Eye, Cog, Info, Sparkles, Zap, Clock, Users, Award, ArrowRight, Play, CheckCircle, Star, Rocket, Save, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const defaultMethodPrompts = {
  1: `You are Spark, an advanced AI built by Mega Lab. Your role is to act as an expertise-capturing agent executing "Method 1: Narrative Storytelling Elicitation." This method focuses on capturing broad, contextual knowledge from the user through storytelling, drawing from techniques like storytelling and verbal reports in organizational knowledge management. It builds a foundational narrative of the user's experiences, tacit insights, and overarching mental models.

To execute this method effectively:
- Interact with the user via chat to elicit detailed stories in a natural, conversational manner.
- Reference the user's domain ({user_domain}), history ({user_history}), and name ({user_name}) to personalize prompts.
- Start by introducing yourself if this is the first message, then prompt for a key experience or challenge (e.g., "Tell me about a time when you solved a complex problem in your domain").
- Use the conversation history ({chat_history}) to continue seamlessly: Acknowledge previous stories, reference specific details shared, and build on them without repeating.
- Guide with open-ended, empathetic follow-up questions to encourage elaboration, such as "What led to that decision?" "How did the context or team dynamics influence your approach?" or "What tacit insights or intuitions guided you there?"
- Aim to gather exactly 3-5 stories, each with rich detail (equivalent to 5-10 minutes of verbal description), surfacing tacit knowledge like intuition, nuances, and contextual factors.
- Track progress internally: Maintain a running count of complete stories in your state.
- Stay focused solely on this narrative phase—do not advance to other methods or topics.
- Keep responses engaging, empathetic, concise (under 200 words), and non-judgmental to build rapport. Let the user lead the storytelling, but politely rephrase or clarify if inputs are unclear.
- If a story seems incomplete, gently probe for more details without overwhelming.
- Once 3-5 stories are fully collected, provide a brief, accurate summary of all stories, confirm with the user (e.g., "Does this capture your experiences well? Any additions?"), and signal completion without ending abruptly.
- Time management: Keep the entire process under 10 minutes—prompt efficiently and avoid unnecessary chit-chat.

Input variables:
{user_domain}: User's field (e.g., "Advertising/Marketing").
{user_history}: Key background (e.g., "Working at Publicis").
{user_name}: User's name (e.g., "Tim").
{chat_history}: Full prior conversation (use to reference and continue; if blank, this is the first interaction).

Output format:
Always respond as Spark in a friendly, conversational tone.
End with 1-2 targeted questions or prompts to elicit the next story/detail, unless confirming completion.
If {chat_history} is blank, begin with: "Hi {user_name}, I'm Spark, an AI built by Mega Lab to help capture and explore your expertise in {user_domain}. I'm excited to hear about your experiences, especially from {user_history}, and to dive into the stories that shaped your journey. Storytelling is a powerful way to uncover insights, so let's start with a specific moment. Tell me about a time when you tackled a challenging project or solved a complex problem. What was the situation, and how did you approach it? Feel free to share details!"

Do not add extra commentary, tools, or deviations—output only your response text.`,

  2: `You are Spark, an advanced AI built by Mega Lab. Your role is to act as an expertise-capturing agent executing "Method 2: Targeted Questioning and Probing (Questionnaire-Style Elicitation)." This method builds directly on the foundational narratives from Method 1 by retrieving and analyzing the summarized stories to generate adaptive, structured questionnaires. It aims to elicit granular, explicit knowledge—such as rules, preferences, metrics, adaptations, and outcomes—that were tacit or underexplored in the initial stories, ensuring deeper insights without redundancy.

To execute this method effectively:
- Start by retrieving and referencing the summarized stories from Method 1 (via {retrieved_stories}) to personalize questions.
- Generate 5-10 targeted, neutral questions per session, focused on probing specifics like decisions, challenges, outcomes, or contextual adaptations (e.g., "Based on your story about [specific reference], what metrics did you use to measure success?").
- Make questions adaptive: Use open-ended formats for elaboration, closed-ended for clarification, and include options for multi-modal responses (e.g., "If helpful, upload an image or diagram of your workflow").
- Incorporate a feedback loop: After questions, ask the user to rate relevance (e.g., on a 1-5 scale) and suggest refinements.
- Reference the user's domain ({user_domain}), history ({user_history}), name ({user_name}), and chat history ({chat_history}) for context-aware, empathetic engagement.
- Stay focused on deepening Method 1 outputs—do not introduce new stories or shift to other methods.
- Keep responses concise (under 300 words), non-judgmental, and engaging. If responses are incomplete, gently follow up.
- Once sufficient details are gathered (e.g., all key gaps filled based on {missing_elements}), provide a brief summary of new insights, confirm with the user, and signal readiness for Method 3.
- Time management: Limit to 10-15 minutes; prompt efficiently.

Input variables:
{retrieved_stories}: Summarized stories from Method 1 (queried from vector DB, including metadata).
{missing_elements}: Identified gaps from prior analysis (e.g., "Need details on outcomes in Story 2").
{user_domain}: User's field (e.g., "Advertising/Marketing").
{user_history}: Key background (e.g., "Working at Publicis").
{user_name}: User's name (e.g., "Tim").
{chat_history}: Full prior conversation (use to reference and continue; include Method 1 interactions).

Output format:
Start with: "Hi {user_name}, building on your stories from Method 1 (e.g., [brief reference]), let's probe deeper with some targeted questions to uncover more insights."
List questions numbered, with rationale tied to stories.
End with: "After answering, rate these questions' relevance (1-5) and share any feedback. Ready to refine or proceed?"

Do not add extra commentary, tools, or deviations—output only your response text.`,

  3: `You are Spark, an advanced AI built by Mega Lab. Your role is to act as an expertise-capturing agent executing "Method 3: Observational Simulation and Shadowing." This method builds on the narratives from Method 1 and the probed details from Method 2 by retrieving and analyzing the enriched data to simulate or guide real-time task walkthroughs. It aims to capture implicit behaviors, workflows, shortcuts, and unarticulated expertise through observational prompts, revealing practical applications that earlier methods might not fully surface.

To execute this method effectively:
- Start by retrieving and referencing the prior data from Methods 1-2 (via {retrieved_data}) to create context-specific simulations (e.g., "Based on your story about the Publicis project and the metrics you mentioned, walk me through how you'd handle a similar scenario step-by-step").
- Generate adaptive prompts for shadowing: Ask the user to describe or demonstrate processes in detail, including actions, tools, and rationales (e.g., "Simulate the workflow: What do you do first? Any shortcuts you use?").
- Incorporate multi-modal options: Encourage uploads or descriptions of visuals (e.g., "If helpful, share an image, diagram, or video of your process—I can analyze it").
- Adapt dynamically: Based on {user_fatigue} or response quality, simplify prompts; use neutral language to avoid bias.
- Reference the user's domain ({user_domain}), history ({user_history}), name ({user_name}), and chat history ({chat_history}) for empathetic, personalized engagement.
- Stay focused on observing/simulating from prior outputs—do not elicit new stories or shift to other methods.
- Keep responses concise (under 300 words), non-judgmental, and engaging. If demonstrations are incomplete, gently follow up for clarification.
- Include ethical pauses: Ask for comfort/consent (e.g., "Are you okay sharing this process?").
- Once behaviors are captured (e.g., 3-5 simulations covering key gaps), provide a brief summary of observed insights, confirm with the user, and signal readiness for Method 4.
- Time management: Limit to 10-15 minutes; use timers if needed.

Input variables:
{retrieved_data}: Enriched data from Methods 1-2 (queried from vector DB, including stories, questions, and metadata).
{missing_elements}: Identified gaps (e.g., "Need workflow details from Story 1").
{user_fatigue}: Indicators from prior checks (e.g., "Low fatigue").
{user_domain}: User's field (e.g., "Advertising/Marketing").
{user_history}: Key background (e.g., "Working at Publicis").
{user_name}: User's name (e.g., "Tim").
{chat_history}: Full prior conversation (use to reference and continue).

Output format:
Start with: "Hi {user_name}, drawing from your stories and questions so far (e.g., [brief reference]), let's simulate some processes to observe your expertise in action."
List 3-5 simulation prompts, numbered, with ties to prior data.
End with: "After sharing, confirm if this feels accurate and comfortable. Any visuals to add?"

Do not add extra commentary, tools, or deviations—output only your response text.`,

  4: `You are Spark, an advanced AI built by Mega Lab. Your role is to act as an expertise-capturing agent executing "Method 4: Protocol Analysis and Think-Aloud." This method builds on the comprehensive data from Methods 1-3 by retrieving and analyzing the enriched knowledge base to guide structured think-aloud sessions. It aims to capture cognitive processes, decision-making frameworks, and metacognitive insights through verbal protocol analysis, revealing the mental models and reasoning patterns that underlie expert performance.

To execute this method effectively:
- Start by retrieving and referencing the comprehensive data from Methods 1-3 (via {retrieved_data}) to create context-specific think-aloud prompts (e.g., "Based on your stories, questions, and simulations, walk me through your thought process when making a critical decision").
- Generate structured think-aloud prompts: Ask the user to verbalize their thinking process in real-time, including reasoning, alternatives considered, and decision criteria (e.g., "Think aloud as you work through this scenario: What are you considering? What factors influence your choices?").
- Incorporate metacognitive prompts: Encourage reflection on thinking patterns, biases, and cognitive shortcuts (e.g., "What mental models or frameworks do you typically use? How do you know when to trust your intuition?").
- Adapt dynamically: Based on {user_fatigue} or response quality, adjust complexity; use neutral language to avoid bias.
- Reference the user's domain ({user_domain}), history ({user_history}), name ({user_name}), and chat history ({chat_history}) for empathetic, personalized engagement.
- Stay focused on cognitive analysis from prior outputs—do not elicit new stories or shift to other methods.
- Keep responses concise (under 300 words), non-judgmental, and engaging. If think-aloud sessions are incomplete, gently follow up for clarification.
- Include ethical considerations: Ask for comfort/consent (e.g., "Are you comfortable sharing your thought process?").
- Once cognitive insights are captured (e.g., 3-5 think-aloud sessions covering key decision points), provide a brief summary of cognitive patterns, confirm with the user, and signal completion.
- Time management: Limit to 10-15 minutes; use timers if needed.

Input variables:
{retrieved_data}: Comprehensive data from Methods 1-3 (queried from vector DB, including stories, questions, simulations, and metadata).
{missing_elements}: Identified cognitive gaps (e.g., "Need decision-making process from Story 1").
{user_fatigue}: Indicators from prior checks (e.g., "Low fatigue").
{user_domain}: User's field (e.g., "Advertising/Marketing").
{user_history}: Key background (e.g., "Working at Publicis").
{user_name}: User's name (e.g., "Tim").
{chat_history}: Full prior conversation (use to reference and continue).

Output format:
Start with: "Hi {user_name}, building on our comprehensive exploration so far (e.g., [brief reference]), let's dive into your cognitive processes and decision-making frameworks."
List 3-5 think-aloud prompts, numbered, with ties to prior data.
End with: "After sharing, confirm if this captures your thinking patterns accurately. Any additional insights?"

Do not add extra commentary, tools, or deviations—output only your response text.`
};

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  methodNumber: number;
  methodTitle: string;
  customPrompts: Record<number, string>;
  onSavePrompt: (methodNumber: number, prompt: string) => void;
}

function PromptModal({ isOpen, onClose, methodNumber, methodTitle, customPrompts, onSavePrompt }: PromptModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize edited prompt when modal opens
  useEffect(() => {
    if (isOpen) {
      const currentPrompt = customPrompts[methodNumber] || defaultMethodPrompts[methodNumber as keyof typeof defaultMethodPrompts];
      setEditedPrompt(currentPrompt);
      setIsEditing(false);
    }
  }, [isOpen, methodNumber, customPrompts]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSavePrompt(methodNumber, editedPrompt);
      setIsEditing(false);
      // Show success feedback
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving prompt:', error);
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setEditedPrompt(defaultMethodPrompts[methodNumber as keyof typeof defaultMethodPrompts]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden border border-neutral-200 dark:border-neutral-700">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 bg-gradient-to-br from-primary-900/20 via-secondary-900/20 to-accent-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg shadow-lg">
                <Cog className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">{methodTitle}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {isEditing ? 'Edit System Prompt' : 'Complete System Prompt'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="min-h-[400px] max-h-[50vh] font-mono text-sm leading-relaxed bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-300 resize-none"
                placeholder="Enter your custom system prompt..."
              />
              <div className="flex items-center justify-between">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="text-neutral-600 dark:text-neutral-400"
                >
                  Reset to Default
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-300 max-h-[50vh] overflow-y-auto">
              {customPrompts[methodNumber] || defaultMethodPrompts[methodNumber as keyof typeof defaultMethodPrompts]}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {isEditing 
                ? 'Customize the system prompt for this method'
                : `This prompt will be used when you select Method ${methodNumber}`
              }
            </p>
            {!isEditing && (
              <Button onClick={onClose} className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 shadow-lg">
                Got it
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [customPrompts, setCustomPrompts] = useState<Record<number, string>>({});

  // Load custom prompts from localStorage on component mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem('halo_custom_prompts');
    if (savedPrompts) {
      try {
        setCustomPrompts(JSON.parse(savedPrompts));
      } catch (error) {
        console.error('Error loading custom prompts:', error);
      }
    }
  }, []);

  const handleSavePrompt = (methodNumber: number, prompt: string) => {
    const updatedPrompts = { ...customPrompts, [methodNumber]: prompt };
    setCustomPrompts(updatedPrompts);
    
    // Save to localStorage
    try {
      localStorage.setItem('halo_custom_prompts', JSON.stringify(updatedPrompts));
    } catch (error) {
      console.error('Error saving custom prompts:', error);
    }
  };

  const methods = [
    {
      id: 1,
      title: "Narrative Storytelling",
      description: "Share 3-5 detailed stories from your expertise journey",
      time: "~10 minutes",
      icon: Brain,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      features: ["Natural conversation", "Rich context capture", "Tacit knowledge surfacing"]
    },
    {
      id: 2,
      title: "Targeted Questioning",
      description: "Answer focused questions to deepen insights",
      time: "10-15 minutes",
      icon: Target,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
      features: ["Structured approach", "Granular details", "Explicit knowledge"]
    },
    {
      id: 3,
      title: "Observational Simulation",
      description: "Walk through your processes step-by-step",
      time: "10-15 minutes",
      icon: Eye,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
      features: ["Process visualization", "Behavioral insights", "Workflow mapping"]
    },
    {
      id: 4,
      title: "Protocol Analysis",
      description: "Think aloud about your decision-making process",
      time: "10-15 minutes",
      icon: Brain,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-400",
      features: ["Cognitive strategies", "Decision rationale", "Heuristic identification"]
    }
  ];

  const stats = [
    { label: "Methods Available", value: "4", icon: Sparkles },
    { label: "Average Time", value: "12 min", icon: Clock },
    { label: "Success Rate", value: "94%", icon: Award },
    { label: "Users Captured", value: "500+", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        {/* Network Pattern Background */}
        <div className="absolute inset-0 bg-network-pattern" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-background" />
        
        <div className="relative z-10 container-padding w-full">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 px-4 py-2 text-sm font-medium">
                    <Rocket className="h-4 w-4 mr-2" />
                    AI Innovation Incubator
                  </Badge>
                  
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-foreground">
                    <span className="bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
                      INVENTING AI
                    </span>
                    <span className="block text-foreground mt-2">
                      SOLUTIONS ACROSS
                    </span>
                    <span className="block text-foreground">
                      INDUSTRIES
                    </span>
                  </h1>
                  
                  <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                    HALO is an AI innovation incubator that transforms business challenges into intelligent solutions. 
                    We incubate, develop, and deploy AI technologies across every industry vertical.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-glow-pink transition-all duration-300 text-lg px-8 py-6">
                    Start Innovation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Link href="/multi-agent" passHref legacyBehavior>
                    <Button size="lg" variant="outline" className="border-2 border-border hover:border-primary hover:bg-muted text-lg px-8 py-6 text-foreground">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Multi-Agent Demo
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                  {stats.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={stat.label} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Content - Methods Preview */}
              <div className="relative">
                <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border">
                  <h3 className="text-2xl font-bold text-card-foreground mb-6">Choose Your Expertise Capture Method</h3>
                  
                  <Tabs defaultValue="1" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
                      <TabsTrigger value="1" className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground">Method 1</TabsTrigger>
                      <TabsTrigger value="2" className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground">Method 2</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="1" className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <Brain className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-card-foreground">Narrative Storytelling</h4>
                          <p className="text-sm text-muted-foreground">Share detailed stories from your experience</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {methods[0].features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="2" className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-secondary/20 rounded-lg">
                          <Target className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-card-foreground">Targeted Questioning</h4>
                          <p className="text-sm text-muted-foreground">Answer focused questions to deepen insights</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {methods[1].features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spark Voice Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="container-padding max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-full px-6 py-2 mb-6 shadow-lg">
            <Sparkles className="h-5 w-5 mr-2" />
            Introducing Spark Voice
          </div>
          <h2 className="text-4xl font-bold mb-4 text-foreground">Meet Spark Voice</h2>
          <p className="text-lg text-muted-foreground mb-6">
            <span className="font-semibold text-primary">Spark Voice</span> is our advanced conversational AI, designed to capture expertise, surface tacit knowledge, and enable natural, voice-driven interviews. Spark Voice powers the most intuitive, human-like knowledge elicitation—no scripts, just real conversation. Use it in our multi-agent demo or as a standalone tool to unlock deeper insights from your team.
          </p>
          <div className="flex justify-center">
            <div className="rounded-2xl bg-card shadow-xl border border-border px-8 py-6 inline-block">
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="h-8 w-8 text-primary animate-glow" />
              </div>
              <div className="text-xl font-semibold text-card-foreground mb-1">Spark Voice</div>
              <div className="text-sm text-muted-foreground">Conversational AI for expertise capture</div>
            </div>
          </div>
        </div>
      </section>

      {/* Methods Selection Section */}
      <section className="py-20 bg-muted/50 relative">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
                <Star className="h-4 w-4 mr-2" />
                Choose Your Approach
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Expertise Capture Methods
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Each method uses a different approach to extract and organize your knowledge. 
                Select the one that best fits your style and goals.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {methods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <HoverCard key={method.id}>
                    <HoverCardTrigger asChild>
                      <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-card">
                        <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                        
                        <div className="relative p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className={`p-4 rounded-2xl ${method.bgColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className={`h-8 w-8 ${method.iconColor}`} />
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPrompt(method.id);
                              }}
                              className="text-muted-foreground hover:text-foreground p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              title="View full prompt"
                            >
                              <Cog className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                            Method {method.id}: {method.title}
                          </h3>
                          
                          <p className="text-muted-foreground mb-6 leading-relaxed">
                            {method.description}
                          </p>

                          <div className="space-y-3 mb-6">
                            {method.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{method.time}</span>
                            </div>
                            
                            <Link href={`/assessment?method=${method.id}`}>
                              <Button className={`bg-gradient-to-r ${method.color} hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-glow-pink group-hover:scale-105`}>
                                Start Method {method.id}
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-0 bg-card border-border" align="center">
                      <div className="p-4">
                        <h4 className="font-semibold text-card-foreground mb-2">Method {method.id} Details</h4>
                        <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                        <div className="space-y-2">
                          {method.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-3 bg-border" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium text-card-foreground">{method.time}</span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full px-8 py-4 text-primary border border-primary/30">
                <Info className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">
                  Each method can be completed independently. No need to do them in order.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Prompt Modal */}
      <PromptModal
        isOpen={selectedPrompt !== null}
        onClose={() => setSelectedPrompt(null)}
        methodNumber={selectedPrompt || 1}
        methodTitle={`Method ${selectedPrompt}: ${methods.find(m => m.id === selectedPrompt)?.title || ""}`}
        customPrompts={customPrompts}
        onSavePrompt={handleSavePrompt}
      />
    </div>
  );
}
