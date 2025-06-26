"use client";

import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AIChatbot from "@/components/ai-chatbot";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  MessageCircle, 
  Brain,
  Shield,
  Database,
  Globe,
  BarChart3,
  Users,
  Sparkles,
  Star,
  TrendingUp,
  ShoppingCart,
  Plus,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { 
  componentPricing, 
  phasePackages, 
  displayPricing, 
  customizationItems,
  formatPrice 
} from "@/lib/pricing-config";

export default function PricingPage() {
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedPhases, setSelectedPhases] = useState<number[]>([]);
  const [showBasket, setShowBasket] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);

  const toggleComponent = (componentId: string) => {
    setSelectedComponents(prev => 
      prev.includes(componentId) 
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    );
  };

  const togglePhase = (phaseNumber: number) => {
    setSelectedPhases(prev => 
      prev.includes(phaseNumber) 
        ? prev.filter(p => p !== phaseNumber)
        : [...prev, phaseNumber]
    );
  };

  const getTotal = () => {
    let total = 0;
    
    // Add selected complete phases
    selectedPhases.forEach(phaseNum => {
      total += phasePackages[phaseNum as keyof typeof phasePackages].price;
    });
    
    // Add individual components (only if their phase isn't selected)
    selectedComponents.forEach(componentId => {
      const component = componentPricing[componentId as keyof typeof componentPricing];
      if (component && !selectedPhases.includes(component.phase)) {
        total += component.price;
      }
    });
    
    return total;
  };

  const getSelectedItems = () => {
    const items: Array<{type: 'phase' | 'component', id: string | number, name: string, price: number}> = [];
    
    // Add selected complete phases
    selectedPhases.forEach(phaseNum => {
      const phase = phasePackages[phaseNum as keyof typeof phasePackages];
      items.push({
        type: 'phase',
        id: phaseNum,
        name: phase.name,
        price: phase.price
      });
    });
    
    // Add individual components (show ALL selected components, even if their phase is selected)
    selectedComponents.forEach(componentId => {
      const component = componentPricing[componentId as keyof typeof componentPricing];
      if (component) {
        items.push({
          type: 'component',
          id: componentId,
          name: component.name,
          price: component.price
        });
      }
    });
    
    return items;
  };

  const getDetailedBreakdown = () => {
    const breakdown = {
      phases: [] as Array<{
        number: number,
        name: string,
        price: number,
        components: Array<{name: string, price: number}>
      }>,
      individualComponents: [] as Array<{name: string, price: number, phase: number}>,
      total: 0,
      savings: 0
    };

    // Add selected complete phases
    selectedPhases.forEach(phaseNum => {
      const phase = phasePackages[phaseNum as keyof typeof phasePackages];
      const phaseComponents = phase.components.map(componentId => {
        const component = componentPricing[componentId as keyof typeof componentPricing];
        return {
          name: component.name,
          price: component.price
        };
      });
      
      breakdown.phases.push({
        number: phaseNum,
        name: phase.name,
        price: phase.price,
        components: phaseComponents
      });
    });

    // Add individual components (only if their phase isn't selected)
    selectedComponents.forEach(componentId => {
      const component = componentPricing[componentId as keyof typeof componentPricing];
      if (component && !selectedPhases.includes(component.phase)) {
        breakdown.individualComponents.push({
          name: component.name,
          price: component.price,
          phase: component.phase
        });
      }
    });

    breakdown.total = getTotal();
    
    // Calculate potential savings if they bought everything individually
    const individualTotal = [...selectedPhases, ...selectedComponents.filter(id => {
      const component = componentPricing[id as keyof typeof componentPricing];
      return component && !selectedPhases.includes(component.phase);
    })].reduce((total: number, item) => {
      if (typeof item === 'number') {
        // It's a phase - add up individual component costs
        const phase = phasePackages[item as keyof typeof phasePackages];
        return total + phase.components.reduce((phaseTotal: number, componentId) => {
          const component = componentPricing[componentId as keyof typeof componentPricing];
          return phaseTotal + component.price;
        }, 0);
      } else {
        // It's an individual component
        const component = componentPricing[item as keyof typeof componentPricing];
        return total + component.price;
      }
    }, 0);

    breakdown.savings = Math.max(0, individualTotal - breakdown.total);

    return breakdown;
  };

  const generatePDFProposal = (breakdown: any) => {
    // Create a professional proposal document
    const proposalContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AI Transformation Proposal - VisaPlace</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; color: #1e293b; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1e3a8a; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
        .title { font-size: 32px; font-weight: bold; margin: 20px 0; color: #1e293b; }
        .subtitle { font-size: 16px; color: #64748b; }
        .section { margin: 30px 0; }
        .section-title { font-size: 20px; font-weight: bold; color: #1e3a8a; margin-bottom: 15px; border-left: 4px solid #1e3a8a; padding-left: 15px; }
        .phase-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 15px 0; }
        .phase-title { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 10px; }
        .phase-price { font-size: 24px; font-weight: bold; color: #1e3a8a; float: right; }
        .component-list { margin: 15px 0; }
        .component-item { display: flex; justify-content: between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .component-name { flex: 1; }
        .component-price { font-weight: 600; color: #64748b; }
        .total-section { background: #1e3a8a; color: white; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0; }
        .total-amount { font-size: 36px; font-weight: bold; margin: 10px 0; }
        .benefits { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .benefit-item { margin: 8px 0; }
        .guarantee { background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }
        .footer { margin-top: 40px; text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏛️ VisaPlace</div>
        <div class="title">AI Transformation Proposal</div>
        <div class="subtitle">Revolutionize Your Immigration Practice with AI-First Client Engagement</div>
        <div style="margin-top: 15px; font-size: 14px; color: #64748b;">
            Generated on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
    </div>

    ${breakdown.phases.length > 0 ? `
    <div class="section">
        <div class="section-title">📦 Complete Phase Packages</div>
        ${breakdown.phases.map((phase: any) => `
            <div class="phase-card">
                <div class="phase-title">${phase.name} <span class="phase-price">$${phase.price.toLocaleString()}</span></div>
                <div style="clear: both; margin-top: 15px;">
                    <strong>Included Components:</strong>
                    <div class="component-list">
                        ${phase.components.map((comp: any) => `
                            <div class="component-item">
                                <span class="component-name">• ${comp.name}</span>
                                <span class="component-price">$${comp.price.toLocaleString()}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div style="text-align: right; margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
                        <small style="color: #64748b;">Individual value: $${phase.components.reduce((sum: number, c: any) => sum + c.price, 0).toLocaleString()}</small><br>
                        <strong style="color: #22c55e;">Package savings: $${(phase.components.reduce((sum: number, c: any) => sum + c.price, 0) - phase.price).toLocaleString()}</strong>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${breakdown.individualComponents.length > 0 ? `
    <div class="section">
        <div class="section-title">🎯 Individual Components</div>
        <div class="phase-card">
            ${breakdown.individualComponents.map((comp: any) => `
                <div class="component-item">
                    <span class="component-name">${comp.name} <small style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Phase ${comp.phase}</small></span>
                    <span class="component-price">$${comp.price.toLocaleString()}</span>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div class="total-section">
        <div style="font-size: 18px; margin-bottom: 10px;">Total Investment</div>
        <div class="total-amount">$${breakdown.total.toLocaleString()}</div>
        <div style="font-size: 14px; opacity: 0.9;">One-time setup • 2-4 weeks implementation</div>
    </div>

    <div class="section">
        <div class="section-title">🚀 What You Get</div>
        <div class="benefits">
            <div class="benefit-item">✅ <strong>Enhanced lead capture</strong> - Capture prospects 24/7 when competitors' offices are closed</div>
            <div class="benefit-item">✅ <strong>Streamlined consultations</strong> - Pre-qualified clients arrive ready to proceed</div>
            <div class="benefit-item">✅ <strong>Professional competitive advantage</strong> - Position as the innovative leader in immigration law</div>
            <div class="benefit-item">✅ <strong>Scalable growth platform</strong> - Handle more clients without proportional staff increases</div>
            <div class="benefit-item">✅ <strong>Immigration law expertise built-in</strong> - Not generic AI, but specialized legal intelligence</div>
        </div>
    </div>

    <div class="guarantee">
        <strong>🛡️ Risk-Free Investment</strong><br>
        Quality service guarantee • Professional implementation • Free ongoing support
    </div>

    <div class="section">
        <div class="section-title">📅 Next Steps</div>
        <div style="background: #fefce8; border: 1px solid #eab308; border-radius: 8px; padding: 20px;">
            <div style="margin-bottom: 15px;"><strong>1. Review & Approve:</strong> Review this proposal with your team</div>
            <div style="margin-bottom: 15px;"><strong>2. Schedule Kickoff:</strong> Book your free consultation to discuss implementation timeline</div>
            <div style="margin-bottom: 15px;"><strong>3. Begin Transformation:</strong> Start your 2-4 week implementation process</div>
            <div><strong>4. See Results:</strong> Begin capturing more qualified leads within 30 days</div>
        </div>
    </div>

    <div class="footer">
        <div><strong>VisaPlace AI Transformation Platform</strong></div>
        <div>Contact us to schedule your free consultation and begin your AI transformation</div>
        <div style="margin-top: 10px; font-size: 12px;">This proposal is valid for 30 days from the date of generation.</div>
    </div>
</body>
</html>
    `;

    // Create and download the PDF
    const blob = new Blob([proposalContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VisaPlace-AI-Proposal-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    alert('📄 Proposal generated successfully! The HTML file has been downloaded. You can open it in any browser and print to PDF or use browser "Save as PDF" option.');
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-6 py-3 text-sm font-semibold mb-8">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Immigration Platform
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-slate-900">
              Get More Clients
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Work Less Hours
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your immigration practice with AI-powered client engagement tools that work around the clock.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 mb-12 text-slate-500">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white"></div>
                </div>
                <span className="text-sm font-medium">Professional service</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium">Highly rated</span>
              </div>
              <div className="text-sm font-medium">Proven results</div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS-Style Pricing */}
      <section className="py-20 bg-white">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Start with our core AI system, then add advanced features as you grow. No long-term contracts.
              </p>
            </div>

            {/* Base Package - Hero Style */}
            <div className="max-w-4xl mx-auto mb-20">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 border border-blue-200 relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Start Here
                  </span>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    AI Immigration Assistant
                  </h3>
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="text-6xl font-bold text-blue-600">{formatPrice(displayPricing.basePackage)}</div>
                    <div className="text-left">
                      <div className="text-lg text-slate-600">one-time setup</div>
                      <div className="text-sm text-slate-500">Everything you need to start</div>
                    </div>
                  </div>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Get your AI chatbot and assessment system up and running. Perfect for firms ready to modernize their client intake.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">AI Chatbot Widget</h4>
                        <p className="text-sm text-slate-600">{formatPrice(displayPricing.chatbotValue)} value</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        24/7 lead capture
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Natural conversation flow
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Instant qualification
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">Smart Assessment</h4>
                        <p className="text-sm text-slate-600">{formatPrice(displayPricing.assessmentValue)} value</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Dynamic questionnaire
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Eligibility scoring
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Automated recommendations
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    size="lg" 
                    className={`${selectedPhases.includes(0) ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8 py-4 text-lg font-semibold`}
                    onClick={() => togglePhase(0)}
                  >
                    {selectedPhases.includes(0) ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Base Package Added - {formatPrice(displayPricing.basePackage)}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add Base Package - {formatPrice(displayPricing.basePackage)}
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-slate-500 mt-3">
                    ⚠️ <strong>Important:</strong> This base package needs immigration law customization to be effective
                  </p>
                </div>
              </div>
            </div>

            {/* Required Add-On */}
            <div className="max-w-4xl mx-auto mb-20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Make it work for immigration law
                </h3>
                <p className="text-lg text-slate-600">
                  Generic chatbots fail with complex immigration cases. This customization makes your AI actually useful.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-8 border border-amber-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <Shield className="h-8 w-8 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900">Immigration Law Expertise</h4>
                      <p className="text-amber-700">Required for VisaPlace implementation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-amber-600">{formatPrice(displayPricing.customizationPackage)}</div>
                    <div className="text-sm text-slate-600">one-time setup</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  {customizationItems.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-slate-900">{item.name}</h5>
                        <span className="text-sm font-semibold text-amber-600">{formatPrice(item.price)}</span>
                      </div>
                                              <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl p-6 border border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h5 className="text-lg font-bold text-slate-900">Phase 1 Complete Package</h5>
                      <p className="text-slate-600">Base system + Immigration expertise</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900">{formatPrice(displayPricing.phase1Complete)}</div>
                      <Button 
                        className={`mt-2 ${selectedPhases.includes(1) ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'} text-white`}
                        onClick={() => togglePhase(1)}
                      >
                        {selectedPhases.includes(1) ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Phase 1 Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add Phase 1 to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Always Visible Customization Components */}
                  <div className="mt-6 pt-4 border-t border-amber-200">
                    <h4 className="font-semibold text-amber-900 mb-4 text-center">Or Select Individual Customization Items</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {["sales-analysis", "law-database", "custom-logic", "integration-testing"].map((componentId) => {
                        const component = componentPricing[componentId as keyof typeof componentPricing];
                        const isSelected = selectedComponents.includes(componentId);
                        return (
                          <div key={componentId} className={`p-4 rounded-lg border-2 transition-all ${
                            isSelected ? 'border-amber-500 bg-amber-50' : 'border-amber-200 hover:border-amber-300'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-slate-900">{component.name}</h5>
                              <span className="font-bold text-amber-600">{formatPrice(component.price)}</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{component.description}</p>
                            <Button
                              size="sm"
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => toggleComponent(componentId)}
                              className={`w-full ${isSelected ? 'bg-green-600 hover:bg-green-700' : 'border-amber-300 text-amber-700 hover:bg-amber-50'}`}
                            >
                              {isSelected ? (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Added to Cart
                                </>
                              ) : (
                                <>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add to Cart
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2 - Add-On */}
            <div className="max-w-4xl mx-auto mb-20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Supercharge with AI memory
                </h3>
                <p className="text-lg text-slate-600">
                  Add advanced AI capabilities that remember client interactions and enable self-service knowledge management.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 border border-green-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                      <Brain className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900">Advanced Intelligence & Scale</h4>
                      <p className="text-green-700">Streamlined consultations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-green-600">{formatPrice(displayPricing.phase2Complete)}</div>
                    <div className="text-sm text-slate-600">one-time setup</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Database className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900">RAG Memory Database</h5>
                        <p className="text-sm text-slate-600">{formatPrice(displayPricing.ragMemoryValue)} value</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Client interaction memory
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Contextual conversations
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Advanced AI capabilities
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Globe className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900">Knowledge Portal</h5>
                        <p className="text-sm text-slate-600">{formatPrice(displayPricing.knowledgePortalValue)} value</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Self-updating content
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Staff portal access
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Real-time deployment
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <Button 
                    size="lg" 
                    className={`${selectedPhases.includes(2) ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-green-600 hover:bg-green-700'} text-white px-8 py-4 text-lg font-semibold`}
                    onClick={() => togglePhase(2)}
                  >
                    {selectedPhases.includes(2) ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Phase 2 Added - {formatPrice(displayPricing.phase2Complete)}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add Phase 2 - {formatPrice(displayPricing.phase2Complete)}
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-slate-500 mt-3">
                    Requires Phase 1 to be effective
                  </p>
                </div>
                
                {/* Always Visible Phase 2 Components */}
                <div className="mt-6 pt-6 border-t border-green-200">
                  <h4 className="font-semibold text-slate-900 mb-4 text-center">Or Select Individual Phase 2 Components</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {["rag-memory", "knowledge-portal"].map((componentId) => {
                      const component = componentPricing[componentId as keyof typeof componentPricing];
                      const isSelected = selectedComponents.includes(componentId);
                      return (
                        <div key={componentId} className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected ? 'border-green-500 bg-green-50' : 'border-green-200 hover:border-green-300'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-900">{component.name}</h5>
                            <span className="font-bold text-green-600">{formatPrice(component.price)}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{component.description}</p>
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => toggleComponent(componentId)}
                            className={`w-full ${isSelected ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-green-300 text-green-700 hover:bg-green-50'}`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Added to Cart
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3 - Enterprise */}
            <div className="max-w-4xl mx-auto mb-20">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Complete automation
                </h3>
                <p className="text-lg text-slate-600">
                  Integrate with your CRM and get advanced analytics. Perfect for established firms ready for full automation.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl p-8 border border-purple-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900">Enterprise Integration & CRM</h4>
                      <p className="text-purple-700">Complete automation</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-600">{formatPrice(displayPricing.phase3Complete)}</div>
                    <div className="text-sm text-slate-600">one-time setup</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900">Salesforce CRM Integration</h5>
                        <p className="text-sm text-slate-600">{formatPrice(displayPricing.crmValue)} value</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Automated lead routing
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Pipeline management
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Advanced reporting
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-slate-900">Analytics Dashboard</h5>
                        <p className="text-sm text-slate-600">{formatPrice(displayPricing.analyticsValue)} value</p>
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Performance insights
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Migration support
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        Staff training
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <Button 
                    size="lg" 
                    className={`${selectedPhases.includes(3) ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'} text-white px-8 py-4 text-lg font-semibold`}
                    onClick={() => togglePhase(3)}
                  >
                    {selectedPhases.includes(3) ? (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Phase 3 Added - {formatPrice(displayPricing.phase3Complete)}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add Phase 3 - {formatPrice(displayPricing.phase3Complete)}
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-slate-500 mt-3">
                    Requires Phase 1 & 2 for full automation
                  </p>
                </div>
                
                {/* Always Visible Phase 3 Components */}
                <div className="mt-6 pt-6 border-t border-purple-200">
                  <h4 className="font-semibold text-slate-900 mb-4 text-center">Or Select Individual Phase 3 Components</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {["crm-integration", "analytics"].map((componentId) => {
                      const component = componentPricing[componentId as keyof typeof componentPricing];
                      const isSelected = selectedComponents.includes(componentId);
                      return (
                        <div key={componentId} className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected ? 'border-purple-500 bg-purple-50' : 'border-purple-200 hover:border-purple-300'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-slate-900">{component.name}</h5>
                            <span className="font-bold text-purple-600">{formatPrice(component.price)}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{component.description}</p>
                          <Button
                            size="sm"
                            variant={isSelected ? "default" : "outline"}
                            onClick={() => toggleComponent(componentId)}
                            className={`w-full ${isSelected ? 'bg-indigo-600 hover:bg-indigo-700' : 'border-purple-300 text-purple-700 hover:bg-purple-50'}`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Added to Cart
                              </>
                            ) : (
                              <>
                                <Plus className="mr-2 h-4 w-4" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Package Summary */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl p-8 border border-slate-200">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Complete AI Transformation
                  </h3>
                  <p className="text-lg text-slate-600">
                    Get all three phases together and save. Perfect for firms ready to lead the market.
                  </p>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">All Phases (1 + 2 + 3)</h4>
                    <p className="text-slate-600">Complete AI-first immigration practice</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500 line-through">{formatPrice(displayPricing.phase1Complete + displayPricing.phase2Complete + displayPricing.phase3Complete)} separately</div>
                    <div className="text-4xl font-bold text-slate-900">{formatPrice(displayPricing.phase1Complete + displayPricing.phase2Complete + displayPricing.phase3Complete)}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{formatPrice(displayPricing.phase1Complete)}</div>
                    <div className="text-sm text-slate-600">Phase 1: Foundation</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{formatPrice(displayPricing.phase2Complete)}</div>
                    <div className="text-sm text-slate-600">Phase 2: Intelligence</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatPrice(displayPricing.phase3Complete)}</div>
                    <div className="text-sm text-slate-600">Phase 3: Enterprise</div>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    size="lg" 
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 text-lg font-semibold mb-4"
                    onClick={() => {
                      // Add all phases
                      setSelectedPhases([1, 2, 3]);
                      setSelectedComponents([]);
                    }}
                  >
                    Get Complete Package - {formatPrice(displayPricing.phase1Complete + displayPricing.phase2Complete + displayPricing.phase3Complete)}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-sm text-slate-500">
                    💰 Pay in phases or get 10% discount for full upfront payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Social Proof */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container-padding">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold mb-6">
                <CheckCircle className="mr-2 h-5 w-5" />
                Professional service guarantee
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Join immigration lawyers using AI
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Don't let your competitors get ahead. Start with Phase 1 today and modernize your practice.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">✓</div>
                <div className="text-slate-600">Quality service</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">✓</div>
                <div className="text-slate-600">Modern tools</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">✓</div>
                <div className="text-slate-600">Reliable support</div>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-xl font-bold mb-4" asChild>
                <Link href="/consultation">
                  Start with Phase 1 - {formatPrice(displayPricing.phase1Complete)}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Link>
              </Button>
              <p className="text-slate-600 mb-2">
                🚀 Setup in 2-3 weeks • 💰 Professional implementation • 🛡️ Quality service guarantee
              </p>
              <p className="text-sm text-slate-500">
                Questions? Book a free 15-minute consultation to discuss your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AIChatbot />
      
      {/* Floating Shopping Basket */}
      {(selectedPhases.length > 0 || selectedComponents.length > 0) && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-slate-900">Your Cart</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBasket(!showBasket)}
                className="text-slate-500 hover:text-slate-700 p-1"
              >
                {showBasket ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </Button>
            </div>

            {showBasket && (
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                {getSelectedItems().map((item, index) => {
                  // Check if this component is part of a selected phase
                  const isComponentInSelectedPhase = item.type === 'component' && 
                    selectedPhases.some(phaseNum => {
                      const phase = phasePackages[phaseNum as keyof typeof phasePackages];
                      return phase.components.includes(item.id as string);
                    });
                  
                  return (
                    <div key={`${item.type}-${item.id}`} className={`flex items-center justify-between p-2 rounded-lg ${
                      item.type === 'phase' ? 'bg-blue-50' : 
                      isComponentInSelectedPhase ? 'bg-gray-50' : 'bg-green-50'
                    }`}>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-600">
                          {item.type === 'phase' ? 'Complete Package' : 
                           isComponentInSelectedPhase ? 'Included in Phase (no extra cost)' : 'Individual Component'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold text-sm ${isComponentInSelectedPhase ? 'text-gray-500 line-through' : ''}`}>
                          ${item.price.toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (item.type === 'phase') {
                              togglePhase(item.id as number);
                            } else {
                              toggleComponent(item.id as string);
                            }
                          }}
                          className="text-slate-500 hover:text-red-600 p-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-slate-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${getTotal().toLocaleString()}
                </span>
              </div>
              
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold"
                onClick={() => setShowBreakdownModal(true)}
              >
                Calculate Total & Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="mt-2 text-center">
                <span className="text-xs text-slate-500">
                  💡 Free consultation • No commitment
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Breakdown Modal */}
      {showBreakdownModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Your AI Transformation Package</h2>
                  <p className="text-slate-600">Complete breakdown of your selected features</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBreakdownModal(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {(() => {
                const breakdown = getDetailedBreakdown();
                return (
                  <div className="space-y-6">
                    {/* Selected Complete Phases */}
                    {breakdown.phases.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                          Complete Phase Packages
                        </h3>
                        <div className="space-y-4">
                          {breakdown.phases.map((phase) => (
                            <div key={phase.number} className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-lg font-bold text-slate-900">{phase.name}</h4>
                                  <p className="text-sm text-slate-600">Complete package with all components</p>
                                </div>
                                <div className="text-2xl font-bold text-blue-600">${phase.price.toLocaleString()}</div>
                              </div>
                              
                              <div className="bg-white rounded-lg p-4">
                                <h5 className="font-semibold text-slate-700 mb-3">Included Components:</h5>
                                <div className="grid md:grid-cols-2 gap-3">
                                  {phase.components.map((component, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                      <span className="text-sm text-slate-700">{component.name}</span>
                                      <span className="text-sm font-semibold text-slate-500">${component.price.toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-200 text-right">
                                  <span className="text-sm text-slate-600">
                                    Individual value: ${phase.components.reduce((sum, c) => sum + c.price, 0).toLocaleString()}
                                  </span>
                                  <div className="text-sm font-semibold text-green-600">
                                    Package savings: ${(phase.components.reduce((sum, c) => sum + c.price, 0) - phase.price).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Individual Components */}
                    {breakdown.individualComponents.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                          <Plus className="mr-2 h-5 w-5 text-green-600" />
                          Individual Components
                        </h3>
                        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                          <div className="space-y-3">
                            {breakdown.individualComponents.map((component, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <div>
                                  <span className="font-medium text-slate-900">{component.name}</span>
                                  <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                    Phase {component.phase}
                                  </span>
                                </div>
                                <span className="font-bold text-green-600">${component.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Total Summary */}
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-slate-900">Investment Summary</h3>
                        <div className="text-4xl font-bold text-slate-900">${breakdown.total.toLocaleString()}</div>
                      </div>
                      
                      {breakdown.savings > 0 && (
                        <div className="mb-4 p-3 bg-green-100 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <span className="text-green-800 font-semibold">Package Savings:</span>
                            <span className="text-green-800 font-bold">${breakdown.savings.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            You're saving money by choosing complete packages over individual components!
                          </p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-lg font-bold text-blue-600">{breakdown.phases.length}</div>
                          <div className="text-sm text-slate-600">Complete Phases</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-lg font-bold text-green-600">{breakdown.individualComponents.length}</div>
                          <div className="text-sm text-slate-600">Individual Items</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-lg font-bold text-purple-600">2-4 weeks</div>
                          <div className="text-sm text-slate-600">Setup Time</div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          size="lg" 
                          className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                          onClick={() => {
                            // Generate PDF proposal
                            const breakdown = getDetailedBreakdown();
                            generatePDFProposal(breakdown);
                          }}
                        >
                          📄 Generate PDF Proposal
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1" onClick={() => setShowBreakdownModal(false)}>
                          Continue Shopping
                        </Button>
                      </div>
                      
                      <div className="text-center text-sm text-slate-500 mt-4">
                                                        🛡️ Quality service guarantee • 🚀 Professional service • 💡 Free consultation
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 