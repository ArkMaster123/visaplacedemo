Getting started with React Flow UI

Hayleigh Thompson
Software Engineer
Update July 2025: “React Flow UI” was formerly known as “React Flow Components”. We renamed it because it now includes both components and templates. Additionally, since it’s built on shadcn/ui, the “UI” naming makes it easier for developers to recognize the connection and understand what we offer.

Recently, we launched an exciting new addition to our open-source roster: React Flow Components. These are pre-built nodes, edges, and other ui elements that you can quickly add to your React Flow applications to get up and running. The catch is these components are built on top of shadcn/ui  and the shadcn CLI.

We’ve previously written about our experience and what led us to choosing shadcn over on the xyflow blog , but in this tutorial we’re going to focus on how to get started from scratch with shadcn, Tailwind CSS, and React Flow Components.

Wait, what’s shadcn?

No what, who! Shadcn is the author of a collection of pre-designed components known as shadcn/ui. Notice how we didn’t say library there? Shadcn takes a different approach where components are added to your project’s source code and are “owned” by you: once you add a component you’re free to modify it to suit your needs!

Getting started
To begin with, we’ll set up a new vite project along with all the dependencies and config we’ll need. Start by running the following command:


npx create-vite@latest
Vite is able to scaffold projects for many popular frameworks, but we only care about React! Additionally, make sure to set up a TypeScript project. React Flow’s documentation is a mix of JavaScript and TypeScript, but for shadcn components TypeScript is required!

All shadcn and React Flow components are styled with Tailwind CSS , so we’ll need to install that and a few other dependencies next:


npm install -D tailwindcss postcss autoprefixer
Tailwind is a heavily customizable utility-first CSS framework and much of that customization is done in a tailwind.config.js file. Fortunately, the package can generate a default config for us:


npx tailwindcss init -p
Tailwind works by scanning your project’s source code and building a CSS file that contains only the utilities you’re using. To make sure that happens we need to change two things:

Update the content field in tailwind.config.js to include any source files that might contain Tailwind classes.
tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
Replace the generated src/index.css file with the Tailwind directives:
src/index.css

@tailwind base;
@tailwind components;
@tailwind utilities;
Finally, we can go ahead and delete the generated src/App.css file and update src/App.jsx to just render an empty div:

src/App.jsx

function App() {
  return <div className="w-screen h-screen p-8"></div>;
}
 
export default App;
The classes w-screen and h-screen are two examples of Tailwind’s utility classes. If you’re used to styling React apps using a different approach, you might find this a bit strange at first. You can think of Tailwind classes as supercharged inline styles: they’re constrained to a set design system and you have access to responsive media queries or pseudo-classes like hover and focus.

Setting up shadcn/ui
Vite scaffolds some tsconfig files for us when generating a TypeScript project and we’ll need to make some changes to these so the shadcn components can work correctly. The shadcn CLI is pretty clever (we’ll get to that in a second) but it can’t account for every project structure so instead shadcn components that depend on one another make use of TypeScript’s import paths.

In both tsconfig.json and tsconfig.app.json add the following to the compilerOptions object:

tsconfig.json

{
  ...
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
And then we need to teach Vite how to resolve these paths:


npm i -D @types/node
vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
 
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
At this point feel free to pat yourself on the back and take a tea break. There’s a lot of up-front configuration to get through but once we have the shadcn CLI set up we’ll be able to add new components to our project with a single command - even if they have dependencies or need to modify existing files!

We can now run the following command to set up shadcn/ui in our project:


npx shadcn@latest init
The CLI will ask you a few questions about your project and then it will generate a components.json file in the root of your project, and update your tailwind.config.js with some extensions to your theme. We can take all the default options for now:


✔ Which style would you like to use? › New York
✔ Which color would you like to use as the base color? › Neutral
✔ Would you like to use CSS variables for theming? yes
Adding your first components
To demonstrate how powerful shadcn can be, let’s dive right into making a new React Flow app! Now everything is set up, we can add the <BaseNode /> component with a single command:


npx shadcn@latest add https://ui.reactflow.dev/base-node
This command will generate a new file src/components/base-node.tsx as well as update our dependencies to include @xyflow/react!

That <BaseNode /> component is not a React Flow node directly. Instead, as the name implies, it’s a base that many of our other nodes build upon. It also comes with additional components that you can use to provide a header and content for your nodes. These components are:

<BaseNodeHeader />
<BaseNodeHeaderTitle />
<BaseNodeContent />
<BaseNodeFooter />
You can use it to have a unified style for all of your nodes as well. Let’s see what it looks like by updating our App.jsx file:

src/App.jsx

import '@xyflow/react/dist/style.css';
 
import { BaseNode } from '@/components/base-node';
 
function App() {
  return (
    <div className="w-screen h-screen p-8">
      <BaseNode>
        <BaseNodeHeader>
          <BaseNodeHeaderTitle>Base Node</BaseNodeHeaderTitle>
        </BaseNodeHeader>
        <BaseNodeContent>
          This is a base node component that can be used to build other nodes.
        </BaseNodeContent>
      </BaseNode>
    </div>
  );
}
 
export default App;
Ok, not super exciting…

A screenshot of a simple React application. It renders one element, a rounded container with a blue border and the text 'Hi! 👋' inside.
Remember that the <BaseNode /> component is used by any other React Flow components we add using the shadcn CLI, so what happens if we change it? Let’s update the <BaseNode /> component to render any text as bold monospace instead:

src/components/base-node.tsx

import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";
 
export const BaseNode = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative rounded-md border bg-card text-card-foreground',
        'hover:ring-1',
        // React Flow displays node elements inside of a `NodeWrapper` component,
        // which compiles down to a div with a the class `react-flow__node`.
        // When a node is selected, the class `selected` is added to the
        // `react-flow__node` element. This allows us to style the node when it
        // is selected, using Tailwind's `&` selector.
        '[.react-flow\\_\\_node.selected_&]:border-muted-foreground',
        '[.react-flow\\_\\_node.selected_&]:shadow-lg',
        className,
      )}
      tabIndex={0}
      {...props}
    />
  ),
);
BaseNode.displayName = 'BaseNode';
 
/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export const BaseNodeHeader = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <header
      ref={ref}
      {...props}
      className={cn(
        'mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2',
        // Remove or modify these classes if you modify the padding in the
        // `<BaseNode />` component.
        className,
      )}
    />
  ),
);
BaseNodeHeader.displayName = 'BaseNodeHeader';
 
/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export const BaseNodeHeaderTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="base-node-title"
    className={cn('user-select-none flex-1 font-semibold', className)}
    {...props}
  />
));
BaseNodeHeaderTitle.displayName = 'BaseNodeHeaderTitle';
 
export const BaseNodeContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="base-node-content"
      className={cn('flex flex-col gap-y-2 p-3', className)}
      {...props}
    />
  ),
);
BaseNodeContent.displayName = 'BaseNodeContent';
 
export const BaseNodeFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="base-node-footer"
      className={cn(
        'flex flex-col items-center gap-y-2 border-t px-3 pb-3 pt-2',
        className,
      )}
      {...props}
    />
  ),
);
BaseNodeFooter.displayName = 'BaseNodeFooter';
 
Now we’ll add an actual node from the React Flow UI registry and see what happens:


npx shadcn@latest add https://ui.reactflow.dev/node-tooltip
And we’ll update our App.tsx file to render a proper flow. We’ll use the same basic setup as most of our examples so we won’t break down the individual pieces here. If you’re still new to React Flow and want to learn a bit more about how to set up a basic flow from scratch, check out our quickstart guide.

src/App.tsx

import React from 'react';
import { ReactFlow, type Node, Position, useNodesState } from '@xyflow/react';
 
import '@xyflow/react/dist/style.css';
 
import {
  NodeTooltip,
  NodeTooltipContent,
  NodeTooltipTrigger,
} from './components/node-tooltip';
import { BaseNodeContent } from './components/base-node';
 
function Tooltip() {
  return (
    <NodeTooltip>
      <NodeTooltipContent position={Position.Top}>Hidden Content</NodeTooltipContent>
      <BaseNode>
        <BaseNodeContent>
          <NodeTooltipTrigger>Hover</NodeTooltipTrigger>
        </BaseNodeContent>
      </BaseNode>
    </NodeTooltip>
  );
}
 
const nodeTypes = {
  tooltip: Tooltip,
};
 
const initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: {},
    type: 'tooltip',
  },
];
 
function Flow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
 
  return (
    <div className="h-screen w-screen p-8 bg-gray-50 rounded-xl">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
      />
    </div>
  );
}
export function App() {
  return <Flow />;
}
And would you look at that, the tooltip node we added automatically uses the <BaseNode /> component we customized!






Moving fast and making things
Now we’ve got a basic understanding of how shadcn/ui and the CLI works, we can begin to see how easy it is to add new components and build out a flow. To see everything React Flow Components has to offer let’s build out a simple calculator flow.

First let’s remove the <NodeTooltip /> and undo our changes to <BaseNode />. In addition to pre-made nodes, React Flow UI also contains building blocks for creating your own custom nodes. To see them, we’ll add the labeled-handle component:


npx shadcn@latest add https://ui.reactflow.dev/labeled-handle
The first node we’ll create is a simple number node with some buttons to increment and decrement the value and a handle to connect it to other nodes. Create a folder src/components/nodes and then add a new file src/components/nodes/num-node.tsx.

Paste the following into the new file and install the following dependencies:


npx shadcn@latest add dropdown-menu button
src/components/nodes/num-node.tsx

import { type Node, type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
 
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from '@/components/base-node';
import { LabeledHandle } from '@/components/labeled-handle';
 
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
 
export type NumNode = Node<{
  value: number;
}>;
 
export function NumNode({ id, data }: NodeProps<NumNode>) {
  const { updateNodeData, setNodes } = useReactFlow();
 
  const handleReset = useCallback(() => {
    updateNodeData(id, { value: 0 });
  }, [id, updateNodeData]);
 
  const handleDelete = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  }, [id, setNodes]);
 
  const handleIncr = useCallback(() => {
    updateNodeData(id, { value: data.value + 1 });
  }, [id, data.value, updateNodeData]);
 
  const handleDecr = useCallback(() => {
    updateNodeData(id, { value: data.value - 1 });
  }, [id, data.value, updateNodeData]);
 
  return (
    <BaseNode>
      <BaseNodeHeader className="border-b">
        <BaseNodeHeaderTitle>Num</BaseNodeHeaderTitle>
 
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="nodrag p-1"
              aria-label="Node Actions"
              title="Node Actions"
            >
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={handleReset}>Reset</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BaseNodeHeader>
 
      <BaseNodeContent>
        <div className="flex gap-2 items-center">
          <Button onClick={handleDecr}>-</Button>
          <pre>{String(data.value).padStart(3, ' ')}</pre>
          <Button onClick={handleIncr}>+</Button>
        </div>
      </BaseNodeContent>
 
      <BaseNodeFooter className="bg-gray-100 items-end px-0 py-1 w-full">
        <LabeledHandle title="out" type="source" position={Position.Right} />
      </BaseNodeFooter>
    </BaseNode>
  );
}
This isn’t a tutorial for basic React Flow concepts like flows and custom nodes so we’re skipping over some of the basics. If you’re new to React Flow and want to learn how to add custom nodes and edges to a flow, check out the guide on custom nodes.

In the snippet above we’ve highlighted the imports and components that come from shadcn/ui and React Flow Components. In just a few lines of code we already have quite a capable node:






Our <NumNode /> component…

Has a header with a title and functional dropdown menu.
Contains some simple controls to increment and decrement a value.
Has a labelled handle to connect it to other nodes.
Next we’ll create a second node that will compute the sum of two input values. We don’t need to add any additional components for this node, so go ahead and create a new file src/components/nodes/sum-node.tsx and paste in the following:

src/components/nodes/sum-node.tsx

import {
  type Node,
  type NodeProps,
  Position,
  useReactFlow,
  useStore,
} from '@xyflow/react';
import { useEffect } from 'react';
 
import { BaseNode, BaseNodeHeader, BaseNodeHeaderTitle } from '../base-node';
import { LabeledHandle } from '../labeled-handle';
 
export type SumNode = Node<{
  value: number;
}>;
 
export function SumNode({ id }: NodeProps<SumNode>) {
  const { updateNodeData, getHandleConnections } = useReactFlow();
  const { x, y } = useStore((state) => ({
    x: getHandleValue(
      getHandleConnections({ nodeId: id, id: 'x', type: 'target' }),
      state.nodeLookup,
    ),
    y: getHandleValue(
      getHandleConnections({ nodeId: id, id: 'y', type: 'target' }),
      state.nodeLookup,
    ),
  }));
 
  useEffect(() => {
    updateNodeData(id, { value: x + y });
  }, [x, y]);
 
  return (
    <BaseNode className="w-32">
      <BaseNodeHeader>
        <BaseNodeHeaderTitle>Sum</BaseNodeHeaderTitle>
      </BaseNodeHeader>
 
      <footer className="bg-gray-100">
        <LabeledHandle title="x" id="x" type="target" position={Position.Left} />
        <LabeledHandle title="y" id="y" type="target" position={Position.Left} />
        <LabeledHandle title="out" type="source" position={Position.Right} />
      </footer>
    </BaseNode>
  );
}
 
function getHandleValue(
  connections: Array<{ source: string }>,
  lookup: Map<string, Node<any>>,
) {
  return connections.reduce((acc, { source }) => {
    const node = lookup.get(source)!;
    const value = node.data.value;
 
    return typeof value === 'number' ? acc + value : acc;
  }, 0);
}
React Flow UI doesn’t just provide components for building nodes. We also provide pre-built edges and other UI elements you can drop into your flows for quick building.

To better visualize data in our calculator flow, let’s pull in the data-edge component. This edge renders a field from the source node’s data object as a label on the edge itself. Add the data-edge component to your project:


npx shadcn@latest add https://ui.reactflow.dev/data-edge
The <DataEdge /> component works by looking up a field from its source node’s data object. We’ve been storing the value of each node in our calculator field in a "value" property so we’ll update our edgeType object to include the new data-edge and we’ll update the onConnect handler to create a new edge of this type, making sure to set the edge’s data object correctly:

src/App.tsx

import '@xyflow/react/dist/style.css';
 
import {
  ReactFlow,
  OnConnect,
  Position,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Node,
} from '@xyflow/react';
 
import { NumNode } from '@/components/nodes/num-node';
import { SumNode } from '@/components/nodes/sum-node';
 
import { DataEdge } from '@/components/data-edge';
 
const nodeTypes = {
  num: NumNode,
  sum: SumNode,
};
 
const initialNodes: Node[] = [
  { id: 'a', type: 'num', data: { value: 0 }, position: { x: 0, y: 0 } },
  { id: 'b', type: 'num', data: { value: 0 }, position: { x: 0, y: 200 } },
  { id: 'c', type: 'sum', data: { value: 0 }, position: { x: 300, y: 100 } },
  { id: 'd', type: 'num', data: { value: 0 }, position: { x: 0, y: 400 } },
  { id: 'e', type: 'sum', data: { value: 0 }, position: { x: 600, y: 400 } },
];
 
const edgeTypes = {
  data: DataEdge,
};
 
const initialEdges: Edge[] = [
  {
    id: 'a->c',
    type: 'data',
    data: { key: 'value' },
    source: 'a',
    target: 'c',
    targetHandle: 'x',
  },
  {
    id: 'b->c',
    type: 'data',
    data: { key: 'value' },
    source: 'b',
    target: 'c',
    targetHandle: 'y',
  },
  {
    id: 'c->e',
    type: 'data',
    data: { key: 'value' },
    source: 'c',
    target: 'e',
    targetHandle: 'x',
  },
  {
    id: 'd->e',
    type: 'data',
    data: { key: 'value' },
    source: 'd',
    target: 'e',
    targetHandle: 'y',
  },
];
 
function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((edges) =>
        addEdge({ type: 'data', data: { key: 'value' }, ...params }, edges),
      );
    },
    [setEdges],
  );
 
  return (
    <div className="h-screen w-screen p-8">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      />
    </div>
  );
}
 
export default App;
Putting everything together we end up with quite a capable little calculator!






You could continue to improve this flow by adding nodes to perform other operations or to take user input using additional components from the shadcn/ui registry . In fact, keep your eyes peeled soon for a follow-up to this guide where we’ll show a complete application built using React Flow Components 👀.

Wrapping up
In just a short amount of time we’ve managed to build out a fairly complete flow using the components and building blocks provided by shadcn React Flow Components. We’ve learned:

How editing the <BaseNode /> component will affect other nodes pulled from the React Flow UI registry.

How to use building blocks like the <BaseNodeHeader /> and <LabeledHandle /> components to build our own custom nodes without starting from scratch.

That React Flow UI also provides custom edges like the <DataEdge /> to drop into our applications.

And thanks to the power of Tailwind, tweaking the visual style of these components is as simple as editing tailwind.config.js and editing the variables in your CSS file.

That’s all for now! You can see all the components we currently have available over on the UI docs page. The React Flow UI project is still in its infancy: if you have any suggestions or requests for new components we’d love to hear about them. Or perhaps you’re already starting to build something with shadcn and React Flow UI. Either way make sure you let us know on our Discord server  or on Twitter !

Get Pro examples, prioritized bug reports, 1:1 support from the maintainers, and more with React Flow Pro