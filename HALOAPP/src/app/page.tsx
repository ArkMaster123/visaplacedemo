"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Brain, Target, Eye, Cog, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const methodPrompts = {
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

  4: `You are Spark, an advanced AI built by Mega Lab. Your role is to act as an expertise-capturing agent executing "Method 4: Protocol Analysis and Think-Aloud Refinement." This culminating method builds on the data from Methods 1-3 by retrieving and analyzing the full enriched archive to facilitate think-aloud protocols. It aims to elicit verbalized thought processes, cognitive strategies, heuristics, and refinements, uncovering decision-making rationale and addressing any remaining gaps or inconsistencies across the previous outputs for a holistic knowledge base.

To execute this method effectively:
- Start by retrieving and referencing the prior data from Methods 1-3 (via {retrieved_data}) to create targeted think-aloud prompts (e.g., "Revisiting your story from Method 1 and the workflow from Method 3, talk me through your thought process for that key decision—what alternatives did you consider and why?").
- Generate 4-8 adaptive prompts: Focus on verbalizing reasoning, such as "What heuristics or intuitions guided you?" or "How would you refine this approach based on hindsight?" Include probes for critical decisions and alternatives.
- Incorporate measurements: After responses, ask the user to self-assess knowledge depth (e.g., "On a 1-5 scale, how well does this capture your expertise?") and use it for final refinements.
- Reference the user's domain ({user_domain}), history ({user_history}), name ({user_name}), and chat history ({chat_history}) for empathetic, personalized engagement.
- Stay focused on refining prior outputs—do not elicit new content or revert to earlier methods.
- Keep responses concise (under 300 words), non-judgmental, and engaging. If verbalizations are incomplete, gently follow up for more detail.
- Once insights are captured (e.g., all gaps filled based on {missing_elements}), generate a holistic summary/report of the entire process, confirm with the user, and signal completion.
- Time management: Limit to 10-15 minutes; prompt efficiently.

Input variables:
- {retrieved_data}: Full data from Methods 1-3 (queried from vector DB, including stories, questions, observations, and metadata).
- {missing_elements}: Identified gaps or inconsistencies (e.g., "Need reasoning for decision in Story 3").
- {user_domain}: User's field (e.g., "Advertising/Marketing").
- {user_history}: Key background (e.g., "Working at Publicis").
- {user_name}: User's name (e.g., "Tim").
- {chat_history}: Full prior conversation (use to reference and continue).

Output format:
- Start with: "Hi {user_name}, synthesizing everything from Methods 1-3 (e.g., [brief reference]), let's refine by thinking aloud about your processes."
- List 4-8 think-aloud prompts, numbered, with ties to prior data.
- End with: "After sharing, rate the depth (1-5) and confirm the summary. Any final refinements?"

Do not add extra commentary, tools, or deviations—output only your response text.`
};

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  methodNumber: number;
  methodTitle: string;
}

function PromptModal({ isOpen, onClose, methodNumber, methodTitle }: PromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Cog className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{methodTitle}</h3>
                <p className="text-sm text-gray-600">Complete System Prompt</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {methodPrompts[methodNumber as keyof typeof methodPrompts]}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              This prompt will be used when you select Method {methodNumber}
            </p>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);

  const methods = [
    {
      id: 1,
      title: "Narrative Storytelling",
      description: "Share 3-5 detailed stories from your expertise journey",
      time: "~10 minutes",
      icon: Brain,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: 2,
      title: "Targeted Questioning",
      description: "Answer focused questions to deepen insights",
      time: "10-15 minutes",
      icon: Target,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      id: 3,
      title: "Observational Simulation",
      description: "Walk through your processes step-by-step",
      time: "10-15 minutes",
      icon: Eye,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: 4,
      title: "Protocol Analysis",
      description: "Think aloud about your decision-making process",
      time: "10-15 minutes",
      icon: Brain,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/legal2.jpg"
            alt="Expert knowledge capture session"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-800/70"></div>
        </div>
        
        <div className="relative z-10 container-padding w-full">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-sm font-medium mb-6">
              <Brain className="mr-2 h-4 w-4" />
              AI-Powered Expertise Capture
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                HALO
              </span>
              <span className="block text-white text-3xl sm:text-4xl mt-2">
                Organizing human expertise for the AI age
              </span>
            </h1>
            
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-blue-100">
              Choose from four specialized interview methods designed to capture and 
              preserve your unique expertise and knowledge.
            </p>
          </div>
        </div>
      </section>

      {/* Methods Selection Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Expertise Capture Method
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Each method uses a different approach to extract and organize your knowledge. 
                Select the one that best fits your style and goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {methods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Card key={method.id} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    
                    <div className="relative p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-3 rounded-xl ${method.bgColor}`}>
                          <IconComponent className={`h-8 w-8 ${method.iconColor}`} />
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPrompt(method.id)}
                          className="text-gray-400 hover:text-gray-600 p-2"
                          title="View full prompt"
                        >
                          <Cog className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Method {method.id}: {method.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {method.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">
                          {method.time}
                        </span>
                        
                        <Link href={`/assessment?method=${method.id}`}>
                          <Button className={`bg-gradient-to-r ${method.color} hover:opacity-90 transition-opacity shadow-lg`}>
                            Start Method {method.id}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3 text-blue-800">
                <Info className="h-5 w-5 mr-2" />
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
      />
    </div>
  );
}
