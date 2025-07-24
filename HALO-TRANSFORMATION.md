# HALO Expert Intake App Transformation (Simplified)

## Project Overview

Transform the existing immigration assessment app into **HALO** - a simple expert knowledge capture platform with 4 different Spark AI interview methods. Keep it simple: just rebrand and add a method selection menu.

### Core Concept
- **From**: Immigration assessment chatbot
- **To**: 4 different Spark AI interview methods (standalone, no interlinking)
- **Goal**: Simple expertise capture with method selection menu

## Tech Stack Requirements

### Current Stack (Keep Everything)
- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Current chatbot infrastructure
- ✅ Existing API routes

### New Requirements (Minimal)
- [ ] **HALO branding** (replace VisaPlace)
- [ ] **Method selection menu** (4 Spark methods)
- [ ] **New prompts** for each method
- [ ] **User input collection** (name, domain, history)

## Simple Transformation Checklist

### 1. Branding Update
- [ ] Replace "VisaPlace" with "HALO" in all text
- [ ] Update logos and favicons
- [ ] Change immigration references to "expertise capture"
- [ ] Update page titles and metadata

### 2. Method Selection Interface
- [ ] Create simple method selection page/menu
- [ ] 4 method cards: 
  - Method 1: Narrative Storytelling
  - Method 2: Targeted Questioning  
  - Method 3: Observational Simulation
  - Method 4: Protocol Analysis
- [ ] Each method links to assessment page with different prompts

### 3. User Input Form
- [ ] Add form to collect user info before starting any method:
  - [ ] Name (user_name)
  - [ ] Domain/Field (user_domain) - e.g., "Advertising/Marketing"
  - [ ] Background/History (user_history) - e.g., "Working at Publicis"
- [ ] Store in session/local storage for use in prompts

### 4. Chatbot Modification (Keep Existing Structure)
- [ ] Modify existing assessment chatbot to use dynamic prompts
- [ ] Add method parameter to route (e.g., `/assessment?method=1`)
- [ ] Use different Spark prompt based on method parameter
- [ ] Keep all existing chat UI and functionality

## The 4 Spark Method Prompts

### Method 1: Narrative Storytelling Elicitation
**Prompt Focus**: Story collection (3-5 detailed stories)
**Time**: Under 10 minutes
**Goal**: Capture broad experiences and tacit insights

**Key Features**:
- [ ] Introduce as Spark from Mega Lab
- [ ] Collect 3-5 detailed stories
- [ ] Track story count internally
- [ ] Empathetic follow-up questions
- [ ] Confirm completion with summary

### Method 2: Targeted Questioning and Probing  
**Prompt Focus**: Structured questionnaires (5-10 questions)
**Time**: 10-15 minutes
**Goal**: Elicit granular, explicit knowledge

**Key Features**:
- [ ] Reference "summarized stories from Method 1" (simulated)
- [ ] Generate 5-10 targeted questions
- [ ] Ask for relevance rating (1-5 scale)
- [ ] Probe specifics like metrics, decisions, outcomes

### Method 3: Observational Simulation and Shadowing
**Prompt Focus**: Process walkthroughs (3-5 simulations)  
**Time**: 10-15 minutes
**Goal**: Capture workflows and behaviors

**Key Features**:
- [ ] Reference prior data from Methods 1-2 (simulated)
- [ ] Ask for step-by-step process demonstrations
- [ ] Encourage multi-modal descriptions
- [ ] Focus on shortcuts and implicit behaviors

### Method 4: Protocol Analysis and Think-Aloud
**Prompt Focus**: Verbalized reasoning (4-8 prompts)
**Time**: 10-15 minutes  
**Goal**: Uncover cognitive strategies and decision-making

**Key Features**:
- [ ] Reference full data from Methods 1-3 (simulated)
- [ ] Focus on thought processes and alternatives
- [ ] Ask for knowledge depth self-assessment (1-5)
- [ ] Generate holistic summary at end

## Implementation Steps (Simplified)

### Step 1: Create Method Selection Page
- [ ] Create new page `/methods` or update home page
- [ ] Add 4 method cards with descriptions
- [ ] Each card links to `/assessment?method=1` (or 2,3,4)
- [ ] Simple, clean design

### Step 2: Add User Info Collection
- [ ] Create simple form for user details (before starting method)
- [ ] Collect: name, domain, background/history
- [ ] Store in session storage or local state
- [ ] Use in prompt variables

### Step 3: Modify Assessment Page & API
- [ ] Update `/assessment` page to accept `?method=X` parameter
- [ ] Modify chat API to use different prompts based on method
- [ ] Keep existing chatbot UI completely the same
- [ ] Just change the system prompt based on method

### Step 4: Update Branding
- [ ] Replace "VisaPlace" with "HALO" throughout app
- [ ] Change immigration language to expertise capture
- [ ] Update logos and colors if needed

## Files to Modify (Minimal Changes)

### Core Files
- [ ] `src/app/page.tsx` - Add method selection or link to methods page
- [ ] `src/app/assessment/page.tsx` - Read method parameter, show user form
- [ ] `src/app/api/assessment/route.ts` - Use different prompts based on method
- [ ] `src/components/assessment-chatbot.tsx` - Minor updates for user variables

### Optional New Files  
- [ ] `src/app/methods/page.tsx` - Method selection page (if separate)
- [ ] `src/components/method-selector.tsx` - Method cards component
- [ ] `src/components/user-info-form.tsx` - User details form

## Quick Implementation Plan (1-2 Days)

### Day 1: Basic Structure
- [ ] Create method selection page with 4 cards
- [ ] Add user info form (name, domain, history)
- [ ] Update assessment page to read method parameter
- [ ] Test basic navigation flow

### Day 2: Prompt Integration  
- [ ] Add the 4 Spark prompts to API route
- [ ] Implement prompt switching based on method
- [ ] Test each method with sample conversations
- [ ] Update branding from VisaPlace to HALO

### Testing Checklist
- [ ] All 4 methods load with correct prompts
- [ ] User variables (name, domain, history) work in prompts
- [ ] Navigation between method selection and chat works
- [ ] Chat functionality identical to current assessment
- [ ] Branding updated throughout

## Exact Prompt Implementation

### Method Variables to Replace:
- `{user_name}` - from user form
- `{user_domain}` - from user form  
- `{user_history}` - from user form
- `{chat_history}` - existing chat history
- `{retrieved_stories}` - simulate with "your stories from Method 1"
- `{retrieved_data}` - simulate with "your data from previous methods"
- `{missing_elements}` - can ignore or simulate
- `{user_fatigue}` - can ignore or set to "Low fatigue"

### Implementation Notes:
- Keep existing chatbot UI exactly the same
- Only change the system prompt based on method parameter
- For Methods 2-4, simulate references to previous methods
- No need for actual data retrieval - just reference "previous stories/data"
- Focus on getting the Spark persona and method-specific prompts working

---

## Getting Started (Simplified)

1. **Navigate to project**
   ```bash
   cd HALO
   ```

2. **Start development**
   ```bash
   npm run dev
   ```

3. **Begin with method selection page**
   - Create simple 4-card layout
   - Link each card to `/assessment?method=X`

4. **Update assessment route**
   - Read method parameter
   - Use appropriate Spark prompt
   - Keep everything else the same 