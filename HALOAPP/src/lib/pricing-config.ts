// Pricing Configuration - Central source of truth for all pricing
// Agency fee: 12% applied to all prices

const AGENCY_FEE_MULTIPLIER = 1.12;

// Base prices before agency fee
const basePrices = {
  // Individual Components
  chatbot: 5000,
  assessment: 2000,
  salesAnalysis: 1500,
  lawDatabase: 2500,
  customLogic: 1800,
  integrationTesting: 1200,
  ragMemory: 1500,
  knowledgePortal: 3000,
  crmIntegration: 5000,
  analytics: 1000,
  
  // Package Prices - calculated to provide savings
  basePackage: 7000, // chatbot + assessment = 7000, so no savings but convenient package
  customizationPackage: 8000,
  phase1Complete: 13500, // Individual total would be 14000, so $500 savings
  phase2Complete: 4000, // Individual total would be 4500, so $500 savings  
  phase3Complete: 5400, // Individual total would be 6000, so $600 savings
};

// Apply agency fee to all prices
const applyFee = (price: number) => Math.round(price * AGENCY_FEE_MULTIPLIER);

// Component pricing with agency fee applied
export const componentPricing = {
  // Phase 1 - Base
  "chatbot": { 
    name: "AI Chatbot Widget", 
    price: applyFee(basePrices.chatbot), 
    basePrice: basePrices.chatbot,
    phase: 1,
    description: "24/7 intelligent lead capture system"
  },
  "assessment": { 
    name: "Smart Assessment", 
    price: applyFee(basePrices.assessment), 
    basePrice: basePrices.assessment,
    phase: 1,
    description: "Dynamic qualification questionnaire"
  },
  
  // Phase 1 - Customization
  "sales-analysis": { 
    name: "Sales Team Analysis", 
    price: applyFee(basePrices.salesAnalysis), 
    basePrice: basePrices.salesAnalysis,
    phase: 1,
    description: "Deep dive into your current process"
  },
  "law-database": { 
    name: "Immigration Law Database", 
    price: applyFee(basePrices.lawDatabase), 
    basePrice: basePrices.lawDatabase,
    phase: 1,
    description: "Comprehensive legal knowledge base"
  },
  "custom-logic": { 
    name: "Custom Logic Programming", 
    price: applyFee(basePrices.customLogic), 
    basePrice: basePrices.customLogic,
    phase: 1,
    description: "Smart decision trees for visa categories"
  },
  "integration-testing": { 
    name: "Integration & Testing", 
    price: applyFee(basePrices.integrationTesting), 
    basePrice: basePrices.integrationTesting,
    phase: 1,
    description: "Rigorous testing with real cases"
  },
  
  // Phase 2
  "rag-memory": { 
    name: "RAG Memory Database", 
    price: applyFee(basePrices.ragMemory), 
    basePrice: basePrices.ragMemory,
    phase: 2,
    description: "Advanced AI memory system for client interactions"
  },
  "knowledge-portal": { 
    name: "Knowledge Portal", 
    price: applyFee(basePrices.knowledgePortal), 
    basePrice: basePrices.knowledgePortal,
    phase: 2,
    description: "Self-updating content management system"
  },
  
  // Phase 3
  "crm-integration": { 
    name: "Salesforce CRM Integration", 
    price: applyFee(basePrices.crmIntegration), 
    basePrice: basePrices.crmIntegration,
    phase: 3,
    description: "Complete CRM automation and lead routing"
  },
  "analytics": { 
    name: "Analytics Dashboard", 
    price: applyFee(basePrices.analytics), 
    basePrice: basePrices.analytics,
    phase: 3,
    description: "Advanced reporting and business insights"
  }
};

// Phase packages with agency fee applied
export const phasePackages = {
  0: { 
    name: "Base Package", 
    price: applyFee(basePrices.basePackage), 
    basePrice: basePrices.basePackage,
    components: ["chatbot", "assessment"],
    description: "Essential AI foundation for your practice"
  },
  1: { 
    name: "Phase 1: Foundation", 
    price: applyFee(basePrices.phase1Complete), 
    basePrice: basePrices.phase1Complete,
    components: ["chatbot", "assessment", "sales-analysis", "law-database", "custom-logic", "integration-testing"],
    description: "Complete AI system with immigration law expertise"
  },
  2: { 
    name: "Phase 2: Intelligence", 
    price: applyFee(basePrices.phase2Complete), 
    basePrice: basePrices.phase2Complete,
    components: ["rag-memory", "knowledge-portal"],
    description: "Advanced AI memory and knowledge management"
  },
  3: { 
    name: "Phase 3: Enterprise", 
    price: applyFee(basePrices.phase3Complete), 
    basePrice: basePrices.phase3Complete,
    components: ["crm-integration", "analytics"],
    description: "Complete business automation and analytics"
  }
};

// Standalone pricing for display sections
export const displayPricing = {
  basePackage: applyFee(basePrices.basePackage),
  customizationPackage: applyFee(basePrices.customizationPackage),
  phase1Complete: applyFee(basePrices.phase1Complete),
  phase2Complete: applyFee(basePrices.phase2Complete),
  phase3Complete: applyFee(basePrices.phase3Complete),
  
  // Individual component values for display
  chatbotValue: applyFee(basePrices.chatbot),
  assessmentValue: applyFee(basePrices.assessment),
  ragMemoryValue: applyFee(basePrices.ragMemory),
  knowledgePortalValue: applyFee(basePrices.knowledgePortal),
  crmValue: applyFee(basePrices.crmIntegration),
  analyticsValue: applyFee(basePrices.analytics),
};

// Customization items for display
export const customizationItems = [
  { 
    name: "Sales Team Analysis", 
    price: applyFee(basePrices.salesAnalysis), 
    description: "Deep dive into your current process" 
  },
  { 
    name: "Immigration Law Database", 
    price: applyFee(basePrices.lawDatabase), 
    description: "Comprehensive legal knowledge base" 
  },
  { 
    name: "Custom Logic Programming", 
    price: applyFee(basePrices.customLogic), 
    description: "Smart decision trees for visa categories" 
  },
  { 
    name: "Integration & Testing", 
    price: applyFee(basePrices.integrationTesting), 
    description: "Rigorous testing with real cases" 
  }
];

// Utility functions
export const formatPrice = (price: number) => `$${price.toLocaleString()}`;
export const getComponentPrice = (componentId: string) => componentPricing[componentId as keyof typeof componentPricing]?.price || 0;
export const getPhasePrice = (phaseId: number) => phasePackages[phaseId as keyof typeof phasePackages]?.price || 0;

// For easy removal of agency fee later
export const removeFee = () => {
  // This function can be used to quickly revert to base prices
  // Just change AGENCY_FEE_MULTIPLIER to 1.0
  console.log("To remove agency fee, set AGENCY_FEE_MULTIPLIER = 1.0");
}; 