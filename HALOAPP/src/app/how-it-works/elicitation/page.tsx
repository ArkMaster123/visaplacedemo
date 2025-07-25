import InfoPage from '@/components/info-page';
import { Sparkles } from 'lucide-react';

export default function ElicitationPage() {
  const sections = [
    {
      title: "What is Narrative Storytelling Elicitation?",
      items: [
        "A conversational method that captures your expertise through detailed stories",
        "Focuses on real experiences, challenges, and moments that shaped your knowledge",
        "Uses open-ended prompts to surface tacit insights and intuitive knowledge",
        "Builds a comprehensive narrative foundation of your professional journey",
        "Captures both explicit knowledge and implicit patterns you've developed"
      ]
    },
    {
      title: "How the Process Works",
      items: [
        "Spark AI guides you through 3-5 detailed stories from your career",
        "Each story explores a specific challenge, success, or decision point",
        "Follow-up questions help uncover deeper insights and patterns",
        "Stories are captured with full context and emotional resonance",
        "The AI adapts questions based on your unique background and domain"
      ]
    },
    {
      title: "What to Expect During Your Session",
      items: [
        "Warm, conversational interaction with Spark AI",
        "Guided prompts to help you recall meaningful experiences",
        "Opportunity to share both successes and learning moments",
        "Questions that help you reflect on your decision-making process",
        "Time to elaborate on the context and impact of your experiences"
      ]
    },
    {
      title: "Benefits of This Method",
      items: [
        "Captures knowledge that's difficult to express in structured formats",
        "Reveals patterns and heuristics you use unconsciously",
        "Preserves the emotional and contextual richness of your expertise",
        "Creates a searchable archive of your professional wisdom",
        "Helps identify transferable skills and insights for future use"
      ]
    },
    {
      title: "Tips for a Great Session",
      items: [
        "Choose stories that had significant impact on your career or thinking",
        "Don't worry about perfect storytelling - focus on authenticity",
        "Include both the situation and your thought process",
        "Share what you learned and how it changed your approach",
        "Feel free to explore both positive and challenging experiences"
      ]
    }
  ];

  return (
    <InfoPage
      title="Knowledge Elicitation"
      subtitle="Method 1: Narrative Storytelling"
      description="Share 3-5 detailed stories from your expertise journey. This method captures broad experiences, challenges, and tacit insights through open-ended storytelling. Spark will guide you to surface the moments that shaped your expertise."
      icon={<Sparkles size={40} />}
      sections={sections}
    />
  );
} 