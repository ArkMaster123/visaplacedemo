"use client";

import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  EdgeTypes,
  NodeTypes,
  Position,
  Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  Users, 
  Play, 
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiAgentFlowProps {
  activeAgent: string;
  agentStatus: Record<string, string>;
  onAgentStatusChange: (status: Record<string, string>) => void;
}

// Custom Node Component with Handles
function AgentNode({ data }: { data: any }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500 bg-green-50';
      case 'processing': return 'border-yellow-500 bg-yellow-50';
      case 'completed': return 'border-blue-500 bg-blue-50';
      case 'error': return 'border-red-500 bg-red-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      <Card className={cn(
        "w-48 border-2 transition-all duration-300",
        getStatusColor(data.status),
        data.isActive && "ring-2 ring-blue-500 ring-offset-2"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg", data.color)}>
                <data.icon className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sm">{data.label}</span>
            </div>
            {getStatusIcon(data.status)}
          </div>
          <p className="text-xs text-gray-600 mb-2">{data.description}</p>
          <Badge variant="outline" className="text-xs capitalize">
            {data.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </>
  );
}

export default function MultiAgentFlow({ 
  activeAgent, 
  agentStatus, 
  onAgentStatusChange 
}: MultiAgentFlowProps) {
  const nodeTypes: NodeTypes = useMemo(() => ({
    agentNode: AgentNode,
  }), []);

  // Define nodes
  const initialNodes: Node[] = useMemo(() => [
    {
      id: 'orchestrator',
      type: 'agentNode',
      position: { x: 300, y: 50 },
      data: {
        label: 'Orchestrator',
        description: 'Coordinates all agents',
        icon: Brain,
        color: 'bg-blue-500',
        status: agentStatus.orchestrator,
        isActive: activeAgent === 'orchestrator'
      },
    },
    {
      id: 'narrative',
      type: 'agentNode',
      position: { x: 50, y: 200 },
      data: {
        label: 'Narrative Agent',
        description: 'Storytelling & experiences',
        icon: MessageSquare,
        color: 'bg-green-500',
        status: agentStatus.narrative,
        isActive: activeAgent === 'narrative'
      },
    },
    {
      id: 'questionnaire',
      type: 'agentNode',
      position: { x: 300, y: 200 },
      data: {
        label: 'Questionnaire Agent',
        description: 'Targeted questioning',
        icon: Users,
        color: 'bg-purple-500',
        status: agentStatus.questionnaire,
        isActive: activeAgent === 'questionnaire'
      },
    },
    {
      id: 'simulation',
      type: 'agentNode',
      position: { x: 550, y: 200 },
      data: {
        label: 'Simulation Agent',
        description: 'Task walkthroughs',
        icon: Play,
        color: 'bg-orange-500',
        status: agentStatus.simulation,
        isActive: activeAgent === 'simulation'
      },
    },
    {
      id: 'protocol',
      type: 'agentNode',
      position: { x: 300, y: 350 },
      data: {
        label: 'Protocol Agent',
        description: 'Cognitive analysis',
        icon: Zap,
        color: 'bg-red-500',
        status: agentStatus.protocol,
        isActive: activeAgent === 'protocol'
      },
    },
  ], [activeAgent, agentStatus]);

  // Define edges
  const initialEdges: Edge[] = useMemo(() => [
    {
      id: 'orchestrator-narrative',
      source: 'orchestrator',
      target: 'narrative',
      type: 'smoothstep',
      animated: activeAgent === 'orchestrator' || activeAgent === 'narrative',
      style: { 
        stroke: activeAgent === 'orchestrator' || activeAgent === 'narrative' ? '#3b82f6' : '#94a3b8',
        strokeWidth: 2
      },
      label: 'Stories',
      labelStyle: { fill: '#6b7280', fontSize: 12 }
    },
    {
      id: 'orchestrator-questionnaire',
      source: 'orchestrator',
      target: 'questionnaire',
      type: 'smoothstep',
      animated: activeAgent === 'orchestrator' || activeAgent === 'questionnaire',
      style: { 
        stroke: activeAgent === 'orchestrator' || activeAgent === 'questionnaire' ? '#3b82f6' : '#94a3b8',
        strokeWidth: 2
      },
      label: 'Questions',
      labelStyle: { fill: '#6b7280', fontSize: 12 }
    },
    {
      id: 'orchestrator-simulation',
      source: 'orchestrator',
      target: 'simulation',
      type: 'smoothstep',
      animated: activeAgent === 'orchestrator' || activeAgent === 'simulation',
      style: { 
        stroke: activeAgent === 'orchestrator' || activeAgent === 'simulation' ? '#3b82f6' : '#94a3b8',
        strokeWidth: 2
      },
      label: 'Simulations',
      labelStyle: { fill: '#6b7280', fontSize: 12 }
    },
    {
      id: 'narrative-protocol',
      source: 'narrative',
      target: 'protocol',
      type: 'smoothstep',
      animated: activeAgent === 'narrative' || activeAgent === 'protocol',
      style: { 
        stroke: activeAgent === 'narrative' || activeAgent === 'protocol' ? '#3b82f6' : '#94a3b8',
        strokeWidth: 2
      },
      label: 'Insights',
      labelStyle: { fill: '#6b7280', fontSize: 12 }
    },
    {
      id: 'questionnaire-protocol',
      source: 'questionnaire',
      target: 'protocol',
      type: 'smoothstep',
      animated: activeAgent === 'questionnaire' || activeAgent === 'protocol',
      style: { 
        stroke: activeAgent === 'questionnaire' || activeAgent === 'protocol' ? '#3b82f6' : '#94a3b8',
        strokeWidth: 2
      },
      label: 'Analysis',
      labelStyle: { fill: '#6b7280', fontSize: 12 }
    },
    {
      id: 'simulation-protocol',
      source: 'simulation',
      target: 'protocol',
      type: 'smoothstep',
      animated: activeAgent === 'simulation' || activeAgent === 'protocol',
      style: { 
        stroke: activeAgent === 'simulation' || activeAgent === 'protocol' ? '#3b82f6' : '#94a3b8',
        strokeWidth: 2
      },
      label: 'Processes',
      labelStyle: { fill: '#6b7280', fontSize: 12 }
    },
  ], [activeAgent]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Update nodes when activeAgent or agentStatus changes
  const updatedNodes = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        status: agentStatus[node.id as keyof typeof agentStatus] || 'idle',
        isActive: activeAgent === node.id
      }
    }));
  }, [nodes, activeAgent, agentStatus]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={updatedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
} 