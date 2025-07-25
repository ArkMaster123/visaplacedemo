import InfoPage from '@/components/info-page';
import { Brain } from 'lucide-react';

export default function CapturePage() {
  const sections = [
    {
      title: "What is Targeted Questioning & Probing?",
      items: [
        "A structured approach that deepens your expertise through focused questions",
        "Builds directly on the stories captured in Method 1",
        "Uses your previous responses to generate context-aware questions",
        "Probes for explicit knowledge, rules, and decision-making patterns",
        "Helps surface tacit knowledge that wasn't captured in storytelling"
      ]
    },
    {
      title: "How It Builds on Your Stories",
      items: [
        "References specific moments from your narrative sessions",
        "Asks follow-up questions about decisions you mentioned",
        "Explores the reasoning behind your choices and actions",
        "Validates and expands on patterns identified in your stories",
        "Creates connections between different experiences you've shared"
      ]
    },
    {
      title: "Types of Questions You'll Encounter",
      items: [
        "Decision-making questions: 'What factors did you consider?'",
        "Process questions: 'How did you approach this challenge?'",
        "Learning questions: 'What would you do differently now?'",
        "Pattern questions: 'How does this relate to other experiences?'",
        "Future questions: 'How would you adapt this in a new context?'"
      ]
    },
    {
      title: "What to Expect During Your Session",
      items: [
        "Questions that reference your specific experiences and stories",
        "Opportunity to elaborate on your thinking and reasoning",
        "Chance to reflect on patterns across different situations",
        "Questions that help you articulate implicit knowledge",
        "Time to consider how your expertise applies in new contexts"
      ]
    },
    {
      title: "Benefits of This Method",
      items: [
        "Converts tacit knowledge into explicit, shareable insights",
        "Reveals the reasoning behind your professional decisions",
        "Identifies transferable patterns and heuristics",
        "Creates a structured knowledge base from your experiences",
        "Helps others understand your expertise and decision-making process"
      ]
    },
    {
      title: "Tips for Effective Responses",
      items: [
        "Take time to think through your reasoning process",
        "Share both successful and challenging decision examples",
        "Explain the context and constraints you faced",
        "Reflect on what you learned from each experience",
        "Consider how your approach has evolved over time"
      ]
    }
  ];

  return (
    <InfoPage
      title="Expertise Capture"
      subtitle="Method 2: Targeted Questioning"
      description="Answer focused questions to deepen and clarify your expertise. This method builds on your stories, probing for explicit knowledge, rules, and decision-making patterns. Spark adapts questions to your unique background."
      icon={<Brain size={40} />}
      sections={sections}
    />
  );
} 