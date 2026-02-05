// 1. THE CENTERPIECE (Static Anchor)
export const centerKeyword = "VIBE ARCHITECT"

// 2. LEVEL 1: Big Floating (The Main Message)
export const bigKeywords = [
    "Problem Solver",
    "AI Innovation",
    "Art Direction",
    "Product Lead",
    "UI/UX Strategy",
    "Visual Strategy",
    "System Thinking",
    "Data Driven",
    "Rapid Prototype"
]

// 3. LEVEL 2: Background (Context)
export const backgroundKeywords = [
    "Growth Marketing", "Efficiency Ops", "Interaction Design",
    "Cross-functional", "Business Logic", "SOP Design",
    "PRD Writing", "Agile Management", "Vendor Liaison",
    "Prompt Engineering", "Digital Asset", "Motion",
    "Brand Identity", "User Experience", "Scrum",
    "KPI", "Wireframe", "Prototype", "Logic & Magic",
    "Project Management", "System Design", "User Story",
    "Market Fit", "Leadership", "Roadmap", "Sprint"
]

// 4. LEVEL 3: Filler (Code/Tech Texture - Small & Dense)
export const fillerKeywords = [
    "System", "Render", "Node", "Void", "Null", "Undefined",
    "Array", "Object", "Function", "Commit", "Push", "Pull",
    "Merge", "Branch", "Master", "Main", "Beta", "Alpha",
    "v1.0", "v2.0", "0xFFFF", "return", "await", "async",
    "import", "export", "class", "const", "let", "var",
    "<div>", "<span>", "API", "JSON", "HTTP", "WSS"
]

export const allKeywords = [centerKeyword, ...bigKeywords, ...backgroundKeywords, ...fillerKeywords]
