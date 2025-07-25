"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Plus, 
  Edit, 
  Save, 
  X,
  Users,
  FileText,
  Brain,
  Play,
  Sparkles,
  ArrowLeft,
  Download,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import MultiAgentFlow from '@/components/multi-agent/multi-agent-flow';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  prompt: string;
  isEditing: boolean;
}

export default function AgentsSetupPage() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'orchestrator',
      name: 'Orchestrator',
      description: 'Coordinates all agents and manages workflow',
      icon: Brain,
      color: 'bg-blue-500',
      prompt: 'You are the Orchestrator Agent, a sophisticated AI coordinator that manages and coordinates multiple specialized agents for expertise capture. Your role is to understand user requests and direct them to the appropriate specialized agent.',
      isEditing: false
    },
    {
      id: 'narrative',
      name: 'Narrative Agent',
      description: 'Captures stories and experiences through storytelling',
      icon: Users,
      color: 'bg-green-500',
      prompt: 'You are the Narrative Agent, specialized in Method 1: Narrative Storytelling Elicitation. Your role is to elicit detailed stories from users about their experiences, challenges, and tacit insights in their domain.',
      isEditing: false
    },
    {
      id: 'questionnaire',
      name: 'Questionnaire Agent',
      description: 'Probes deeper with targeted questions',
      icon: FileText,
      color: 'bg-purple-500',
      prompt: 'You are the Questionnaire Agent, specialized in Method 2: Targeted Questioning and Probing. Your role is to ask targeted questions that deepen specific elements from user narratives.',
      isEditing: false
    },
    {
      id: 'simulation',
      name: 'Simulation Agent',
      description: 'Guides real-time task walkthroughs',
      icon: Play,
      color: 'bg-orange-500',
      prompt: 'You are the Simulation Agent, specialized in Method 3: Observational Simulation and Shadowing. Your role is to guide users through real-time task walkthroughs and capture implicit behaviors.',
      isEditing: false
    },
    {
      id: 'protocol',
      name: 'Protocol Agent',
      description: 'Captures cognitive processes and decision-making',
      icon: Sparkles,
      color: 'bg-red-500',
      prompt: 'You are the Protocol Agent, specialized in Method 4: Protocol Analysis and Think-Aloud Refinement. Your role is to capture cognitive processes and decision-making strategies.',
      isEditing: false
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState<string>('orchestrator');
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState<Record<string, string>>({});
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleEditAgent = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, isEditing: true }
        : { ...agent, isEditing: false }
    ));
  };

  const handleSaveAgent = (agentId: string, newPrompt: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, prompt: newPrompt, isEditing: false }
        : agent
    ));
  };

  const handleCancelEdit = (agentId: string) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, isEditing: false }
        : agent
    ));
  };

  const handleSaveAllPrompts = () => {
    const promptsToSave = agents.reduce((acc, agent) => {
      acc[agent.id] = agent.prompt;
      return acc;
    }, {} as Record<string, string>);
    
    setSavedPrompts(promptsToSave);
    setShowSaveSuccess(true);
    
    // Save to localStorage
    localStorage.setItem('halo-agent-prompts', JSON.stringify(promptsToSave));
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleExportPrompts = () => {
    const promptsToExport = agents.reduce((acc, agent) => {
      acc[agent.name] = agent.prompt;
      return acc;
    }, {} as Record<string, string>);
    
    const dataStr = JSON.stringify(promptsToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'halo-agent-prompts.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const selectedAgentData = agents.find(agent => agent.id === selectedAgent);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container-padding">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/multi-agent">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-muted">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Capture
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <Settings className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Agents Setup
                </h1>
                <p className="text-sm text-muted-foreground">Configure and manage your AI agents</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card">
          <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Agents</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAllPrompts}
                  className="border-border text-foreground hover:bg-muted flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportPrompts}
                  className="border-border text-foreground hover:bg-muted flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {showSaveSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">All prompts saved successfully!</span>
              </div>
            )}

            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-all",
                    selectedAgent === agent.id 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-border/80"
                  )}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-3 h-3 rounded-full", agent.color)}></div>
                      <div className="flex items-center gap-2">
                        <agent.icon className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-sm">{agent.name}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAgent(agent.id);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-7">
                    {agent.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddAgent(!showAddAgent)}
                className="border-border text-foreground hover:bg-muted flex items-center gap-2 w-full"
              >
                <Plus className="h-4 w-4" />
                Add New Agent
              </Button>
              
              {showAddAgent && (
                <Card className="card-modern mt-4 hover-lift transition-modern">
                  <CardHeader>
                    <CardTitle className="text-sm text-gradient-primary">Add New Agent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Coming soon: Add custom agents to your workflow
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col">
          {/* Agent Details */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-4 h-4 rounded-full", selectedAgentData?.color)}></div>
                <h2 className="text-xl font-semibold">{selectedAgentData?.name}</h2>
                <Badge variant="outline">{selectedAgentData?.description}</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Agent Prompt</h3>
                {selectedAgentData?.isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={selectedAgentData.prompt}
                      onChange={(e) => {
                        setAgents(agents.map(agent => 
                          agent.id === selectedAgent 
                            ? { ...agent, prompt: e.target.value }
                            : agent
                        ));
                      }}
                      className="min-h-[120px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveAgent(selectedAgent, selectedAgentData.prompt)}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-3 w-3" />
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelEdit(selectedAgent)}
                        className="flex items-center gap-2"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedAgentData?.prompt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* React Flow Visualization */}
          <div className="flex-1 p-6">
            <div className="h-full border border-border rounded-lg bg-card">
              <MultiAgentFlow 
                activeAgent={selectedAgent}
                agentStatus={{
                  orchestrator: 'active',
                  narrative: 'idle',
                  questionnaire: 'idle',
                  simulation: 'idle',
                  protocol: 'idle'
                }}
                onAgentStatusChange={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 