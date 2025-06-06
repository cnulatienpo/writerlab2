
# ✅ Writing Game Website Checklist

---

## 🚀 ESSENTIAL FOR LAUNCH

### 🔐 User System
- [x ] Sign up / Log in / Log out
- [x ] Password encryption
- [x ] Forgot password / Reset password
- [x ] Basic profile view/edit

### 📦 Writing Upload & Feedback
- [ x] Upload text or file (txt/docx/pdf)
- [x ] In-browser writing option (basic editor)
- [ x] Save drafts
- [ x] View past uploads
- [ x] Show AI elemental feedback

### 🎟 Token System
- [x ] Show current token balance
- [ ] Track token usage per action
- [ ] Token purchase system (Stripe or PayPal)

### 🔒 Security
- [ ] HTTPS enabled
- [ ] Secure password hashing (e.g., bcrypt)
- [ ] Limit accepted file types
- [x ] Bot protection (e.g., basic rate limit or CAPTCHA)

### 🧱 Core Pages
- [x ] Homepage
- [ x] Login / Signup page
- [x ] Upload page
- [x ] Feedback view page
- [ ] Token store page
- [x ] User dashboard

---

## 🔄 POST-LAUNCH

### 🛠 Admin Tools
- [ ] View & manage users
- [ ] Adjust token balances
- [ ] View submission logs
- [ ] Upload/edit/delete prompts & elements

### 📬 Communication
- [ ] Welcome email
- [ ] Password reset email
- [ ] Submission received / Feedback ready email
- [ ] Contact/support form

### 📈 Engagement & Stats
- [ ] Writing history timeline
- [ ] Word count tracking
- [ ] Submission stats per user
- [ ] Sept0cat feedback notes panel

### 💳 Payment Upgrades
- [ ] Subscription tier support
- [ ] Discount codes / coupons
- [ ] Transaction history / invoices

---

## 🧃 SCALING & NICE TO HAVE

### 🎮 Gamified Progress
- [ ] Unlock rooms based on activity
- [ ] Writing streaks or milestones
- [ ] Achievements
- [ ] Bookmark/favorite prompts

### 👥 Community Features
- [ ] Writing showcase gallery
- [ ] Commenting / reactions
- [ ] Feedback trade or peer review system

### 🧠 Smart Tools
- [ ] AI prompt suggestions based on writing history
- [ ] Style or genre comparisons
- [ ] Personalized next steps

### ☁️ Storage & Export
- [ ] Connect Google Drive / Dropbox
- [ ] Export all user writing as .zip or .txt

# ✅ DeepSeek Compliance Checklist

## LEGAL & POLICY

- [ ] Add **Terms of Use** to the site
- [ ] Add a **Privacy Policy** that includes:
  - [ ] What user data is collected (inputs, outputs, usage)
  - [ ] That inputs are sent to DeepSeek
  - [ ] Whether outputs are stored and how to request deletion
  - [ ] If model improvement uses data, and how users can opt out
- [ ] Include clear disclaimers:
  - [ ] Content is AI-generated
  - [ ] Outputs may be inaccurate or biased
  - [ ] Not professional advice (medical, legal, financial)
- [ ] Require users to **explicitly agree** to Terms (checkbox or button)

---

## CONTENT & MODERATION

- [ ] Create an **Acceptable Use Policy** covering:
  - [ ] No hate, violence, harassment, porn, impersonation
  - [ ] Enforcement policy (e.g. account suspension or ban)
- [ ] Add a **Report Abuse** feature or contact link
- [ ] Set up **moderation**:
  - [ ] Manual review or filters for unsafe inputs/outputs

---

## USER INTERFACE

- [ ] Label all AI results as **AI-generated**
- [ ] Add **“Powered by DeepSeek”** tag near AI features or in footer
- [ ] Show **token usage or limits** to users (if applicable)
- [ ] Include toggle for **opt-out of training data usage** (if DeepSeek supports it)

---

## TECH & BACKEND

- [ ] Log **inputs and outputs** (anonymized) for safety and debugging
- [ ] Monitor **API token usage** per user
- [ ] Enforce **usage limits** per user (daily/monthly)
- [ ] Ensure **HTTPS + basic auth security**

---

## COPY & LANGUAGE

- [ ] Add disclaimer on AI outputs:  
  *“This content was generated using AI and may contain errors. Do not rely on it for professional advice.”*

- [ ] On signup/login, include:
  - [ ] “By using this service, you agree to our Terms of Use and Privacy Policy”
  - [ ] Checkbox or Continue button confirming agreement

# ✅ Website Legal & Branding Checklist

## 🧾 Legal Essentials
- [ ] Buy and register domain name
- [ ] Enable domain privacy protection
- [ ] Create Terms of Service
- [ ] Create Privacy Policy
- [ ] Add cookie consent banner (if tracking users)
- [ ] Decide on business structure (LLC, Sole Prop)
- [ ] Register business (if forming LLC)
- [ ] Check AI tool terms of service (DeepSeek, GPT, etc.)

## ⚖️ Branding & Ownership
- [ ] Decide on permanent name for site/game
- [ ] Search trademark database to check name availability
- [ ] Register trademark (optional)
- [ ] Register copyright for original writing/art/code (optional)

## 🧠 Data & User Safety
- [ ] Make clear what data is collected from users
- [ ] Comply with GDPR/CCPA if collecting user data

## 🤝 Collaboration
- [ ] Write agreements for collaborators (ownership, revenue)

# ✅ WRITING GAME CHECKLIST

Your full dev map for building the Writing Game project, room by room.

---

## 🎮 CORE GAME SYSTEMS

### 🧱 Base Architecture
- [x ] Build homepage with Periodic Table interface  
- [ ] Create system for Rooms and Elements  
- [ ] Make each Element clickable → opens Workbench  
- [ ] Build Workbench layout template (shared across rooms)  
- [ ] Set up Inventory system to track unlocked Elements  
- [ ] Add Writing Gym (practice area)  
- [ ] Add Portfolio/Save system  
- [ ] Add GPT assistant (with default creative behavior + confidence rules)  
- [ ] Implement “Reader Mode” (spot elements in examples)

---

### 🧠 Element Template (Used in Every Room)
- [ ] Definition  
- [ ] Short examples  
- [ ] How to Spot It (3-question method)  
- [ ] Symptoms of Absence  
- [ ] Tools to Add/Subtract (tropes, etc.)  
- [ ] Writing Prompts  
- [ ] Feedback prompts (GPT-powered, supportive only)

---

### 🛠 Systems
- [ ] Feedback Engine (gentle, hype, emotionally honest)  
- [ ] Periodic Table navigation logic  
- [ ] Writing Gym level selector  
- [ ] Save/load past writing  
- [ ] “What Have I Unlocked?” tracker  
- [ ] Custom Instructions embed  
- [ ] Project folder structure maintained  

# 🧠 Coach Mode - Memory System To-Do List

## ✅ Phase 1: Build the Core Memory
- [ ] Create a player profile system (local or cloud-based)
  - [ ] Store username, date started, current progress
- [ ] Build data tracking for writing sessions
  - [ ] Save each writing prompt + user response
  - [ ] Record which Element it connects to (e.g., Conflict, Dialogue)
  - [ ] Tag metadata: word count, genre, tone, keywords
- [ ] Track user interaction with Elements
  - [ ] Count how often each one is used
  - [ ] Mark user-tagged Elements as "hard," "easy," or "favorite"

---# 🧪 Player Projects System – Development Checklist

## 🔧 Core Features

- [ ] Set up a system to **create a new experiment** (aka story project)
- [ ] Allow player to **name or rename the experiment**
- [ ] Save all progress **per experiment** (elements used, notes, writing samples)
- [ ] Show a **Project Select screen** with a list of existing experiments
- [ ] Let player **choose which experiment** they want to work on
- [ ] Allow player to **delete an experiment**
- [ ] Display **element progress** within each experiment (e.g., Desire ✅, Theme ⬜)

## 💾 Data Structure

- [ ] Create a folder or file system to store **separate save files per experiment**
- [ ] Link each experiment to:
  - [ ] Name
  - [ ] Unique ID
  - [ ] Timestamp of last opened
  - [ ] List of completed elements
  - [ ] Writing or notes per element (optional)

## 🎨 UI/UX Basics

- [ ] Design a **Project Dashboard** (Lab Bench)
  - [ ] List of experiments with:
    - [ ] Title
    - [ ] Element progress
    - [ ] Last modified date
  - [ ] Buttons for:
    - [ ] New Experiment
    - [ ] Continue
    - [ ] Delete
- [ ] Add clear feedback when player creates or deletes an experiment

# ✅ Element Tracker System To-Do

## 🎯 Core Design Decisions
- [ ] Define which elements are "Living Threads" and must be tracked
- [ ] Define which elements are "One-Time Hits" and don’t need trackers
- [ ] Add tags or icons to each element to signal if it’s trackable (🎯 vs 🧩)

## 🧠 Player Education
- [ ] Write intro text for players explaining what a "Living Thread" is
- [ ] Create survival rules (Interrupt, Complicate, Cost, Evolve)
- [ ] Add clear warning/consent message when player selects a tracked element

## 🛠 Tracker System UI
- [ ] Design Tracker interface on the player’s Workbench
- [ ] Add buttons or toggles for:  
  - [ ] Interrupted?  
  - [ ] Complicated?  
  - [ ] Cost something?  
  - [ ] Evolved?
- [ ] Add visual feedback if the thread goes untouched for too long (⚠️ pulse, alert, etc.)
- [ ] Create final “thread resolution” check at story end

## 🔁 Game Integration
- [ ] Auto-add a Tracker to the Workbench when player selects a required element
- [ ] Let players manually add optional trackers if they want
- [ ] Build logic that checks in after each scene/beat to ask:
  - [ ] “Did this strengthen, weaken, or change the thread?”

## 🧪 Testing & Debugging
- [ ] Test a short story using Desire as a Living Thread
- [ ] Track how often the thread changes (simulate)
- [ ] Test what happens if a player ignores the thread
- [ ] Run playtest to see if players understand how to keep it alive

## 🗃 Tracker Data Storage (Later Dev Phase)
- [ ] Decide how tracker data is saved per project (local or cloud)
- [ ] Show a timeline view of tracker health/progression



## 🔮 Optional Cool Shit (for later)

- [ ] Add cover image or vibe thumbnail per project
- [ ] Tag each project with mood/genre
- [ ] Show a timeline of writing progress inside a project
- [ ] Show a heatmap of element usage across experiments


## 🧰 Phase 2: Analyze the Writing
- [ ] Set up OpenAI (or DeepSeek) API connection
  - [ ] Send recent writing + past patterns to AI
- [ ] Create prompt template for AI feedback
  - [ ] Highlight patterns in strengths
  - [ ] Suggest one challenge or next step
  - [ ] Return in a consistent format (short paragraph + bold advice)
- [ ] Store feedback in player’s record

---

## 💬 Phase 3: Coach Interface
- [ ] Design post-writing popup or journal screen
  - [ ] Show today’s feedback + Element progress
  - [ ] Offer a “Next Challenge” button
- [ ] Add a history panel (let user reread past sessions)
- [ ] Optional: Daily writing streaks / encouragement messages

---

## 🗂 Phase 4: Build the Soul Folder (Optional but Awesome)
- [ ] Let the player save favorite lines or ideas
- [ ] Display a personal timeline of growth
- [ ] Show recurring themes or phrases in their writing
- [ ] Add an "In Case You Forget Who You Are" screen that pulls great lines from their past

---

## 🌐 Future (Cloud Features)
- [ ] Set up Supabase or Firebase backend
  - [ ] User login & secure storage
  - [ ] Sync player data across devices
- [ ] Build admin dashboard to see anonymized writing patterns (for future updates)

---

## 🧪 Testing
- [ ] Test saving + loading writing data
- [ ] Test feedback generation accuracy
- [ ] Test interface flow (write → feedback → challenge)


---

## 🏛 ROOMS

### ✍️ Writing Room
- [ ] Build Scene, Desire, Conflict, Change  
- [ ] Connect to Writing Gym  
- [ ] Add beginner prompts  
- [ ] Enable portfolio snapshot  
- [ ] Workbench for each element

# 🧠 Writing Game: Funhouse Build Checklist

## 🗺️ Overall Funhouse Setup
- [ ] Create base folder for Funhouse system
- [ ] Design core loop (enter → choose mood/intent → receive game)
- [ ] Build directory for prompt files
- [ ] Set up toggle system for: 
  - [ ] Freestyle Mode
  - [ ] Project Mode (customize prompts to player’s story world)
- [ ] Create system to track player mood/intent (check-in form or state memory)

---

## ✅ Player Check-In System
- [ ] Build UI form for player to answer:
  - [ ] "What are you working on?"
  - [ ] "What kind of writing energy do you want today?" (Exploration / Movement / Risk / Emotion / Chaos)
  - [ ] "Want to use your story world or play freely?"
- [ ] Save check-in responses to guide prompt selection
- [ ] Add manual override ("Surprise me" button)

---

## 🔁 Prompt Engine Logic
- [ ] Create list of Funhouse games with metadata:
  - [ ] Skill targeted (tone, character, structure, etc)
  - [ ] Intensity level (light, wild, emotional, technical)
  - [ ] Mood match (stuck, blocked, playful, daring, etc)
- [ ] Write prompt variations for:
  - [ ] Freestyle version
  - [ ] Story world version (uses saved character or WIP info)
- [ ] Build prompt delivery system (random or mood-matched)

---

## 🛠️ Story World Integration (Project Mode)
- [ ] Build "World Entry Tool" (set your WIP title, genre, vibe, character list)
- [ ] Store WIP info in session memory or local cache
- [ ] Enable prompts to reference:
  - [ ] WIP world name
  - [ ] Main character name(s)
  - [ ] Genre/mood tone
- [ ] Add toggle to all Funhouse prompts: [Use My Story World]

---

## 🧩 Writing Workout Modes Integration
- [ ] Group writing workouts by type:
  - [ ] Tone drills
  - [ ] Emotion drills
  - [ ] Constraint games
  - [ ] Character POV tests
  - [ ] Dialogue workouts
- [ ] Add game logic to pull from workout bank if player selects "skill building" intent
- [ ] Add option to favorite/save specific workouts for later

---

## 💾 Saving + Exporting
- [ ] Create a local save option for:
  - [ ] Favorite prompts
  - [ ] Completed rooms
  - [ ] Insights or lines worth keeping
- [ ] Option to export writing from sessions to markdown or .txt file

---

## 🎨 Optional (Later)
- [ ] Design UI for the Funhouse map (clickable rooms with themes)
- [ ] Add hidden rooms unlockable only after specific behaviors
- [ ] Create voice/personality for the Funhouse (snarky? haunted? trickster?)
- [ ] Add unlockables or badges ("Chaos Trained," "Emotion Tanked," "Voice Unleashed")

---

# 🧷 Stretch Goals
- [ ] Make your own Funhouse Room Builder tool (user-made games)
- [ ] Connect Writing Gym + Funhouse to skill tracking system
- [ ] Add AI-based prompt suggestions based on user writing samples

---

# ✅ Periodic Table of Writing Elements — Master Checklist

## 1. Core Structure (Skeleton of Narrative)
- [ x] Desire
- [ x] Conflict
- [ x] Change
- [ ] Scene
- [ ] Chapter
- [ x] Climax
- [x ] Turning Point
- [x ] Decision
- [x ] Outcome
- [x ] Stakes
- [x ] Setup / Payoff
- [ ] Chapter Design
- [ ] Book Openings

---

## 2. Tone & Mood (Emotional Flavor)
- [ ] Awe
- [ ] Dread
- [ ] Tension
- [ ] Melancholy
- [ ] Comfort
- [ ] Humor
- [ ] Romance
- [ ] Alienation
- [ ] Wonder
- [ ] Coldness
- [ ] Cynicism
- [ ] Sincerity
- [ ] Whimsy
- [ ] Mood Reversal
- [ ] Misdirection of Tone
- [ ] Atmosphere (light, color, texture, emotion blend)

---

## 3. Character Dynamics (Roles, Power, Flaws)
- [ ] Want vs Need
- [ ] Flaw vs Virtue
- [ ] Power Shift
- [ ] Relationship Arc
- [ ] Archetypes & Breakers
- [ ] Secret / Lie / Mask
- [ ] Internal Monologue

---

## 4. Dialogue Styles (How Characters Speak)
- [ ] Sarcasm
- [ ] Subtext
- [ ] Exposition Dump
- [ ] Rambling Confession
- [ ] Confrontation
- [ ] Wit & Banter
- [ ] Silence as Speech
- [ ] Dialogue Tags / Beats

---

## 5. Theme Carriers (Meaning Over Time)
- [ ] Guilt
- [ ] Freedom
- [ ] Legacy
- [ ] Class
- [ ] Identity
- [ ] Power & Corruption
- [ ] The One Thing You Must Say
- [ ] Authorial Voice

---

## 6. Pacing Modifiers (Speed & Intensity)
- [ ] Fast Cuts
- [ ] Slow Burn
- [ ] Breath Catch
- [ ] Scene Breaks
- [ ] Tension Throttles
- [ ] Scene Transitions

---

## 7. Narrative Devices (Story Tricks)
- [ ] Flashbacks
- [ ] Frame Stories
- [ ] Timelines
- [ ] Shifting POVs
- [ ] Nested Structure
- [ ] Reveal Timing
- [ ] Exposition Delivery

---

## 8. Reader Manipulators (Mind Games)
- [ ] Red Herring
- [ ] Dramatic Irony
- [ ] Unreliable Narrator
- [ ] Perspective Control
- [ ] Surprise vs Suspense
- [ ] Withholding / Reveal Mechanics

---

## 9. Scene Starters (How to Begin a Moment)
- [ ] In Media Res
- [ ] Dialogue Drop
- [ ] Description-Heavy
- [ ] Action Launch
- [ ] Emotional Hook
- [ ] World-Build Signal

---

## 10. Scene Enders (How to Exit a Moment)
- [ ] Cliffhanger
- [ ] Emotional Gut-Punch
- [ ] Poetic Fade
- [ ] Joke
- [ ] Reveal / Question
- [ ] Quiet Exit

---

## 11. Genre-Bending Tools (Meta Devices)
- [ ] Fourth Wall Break
- [ ] Surrealism
- [ ] Story as Object
- [ ] Playing with Tropes
- [ ] Ungenre

---

## 12. Progression Tools (Zoomed-Out Structure)
- [ ] Story Beats
- [ ] Three-Act Structure
- [ ] Four-Act Structure
- [ ] Parallel Arcs
- [ ] Spiral / Circular Structure
- [ ] Ensemble Structure
- [ ] Rashomon / Multi-POV
- [ ] Fragmented / Nonlinear
- [ ] Anti-Climax
- [ ] Serial Structure

---

## 13. Repetition & Motifs (Echoes and Recurrence)
- [ ] Repeated Lines
- [ ] Visual Motifs
- [ ] Thematic Echoes
- [ ] Structural Recursion
- [ ] Callback Moments

---

## 14. Conflict Elements (Sources of Tension)
- [ ] Person vs Person
- [ ] Person vs Self
- [ ] Person vs Nature
- [ ] Person vs System
- [ ] Person vs God
- [ ] Interpersonal Drama
- [ ] Inner Battle
- [ ] Movement / Physicality Writing

---

## 15. Symbolic Devices (Slow Burn Tools)
- [ ] Metaphor
- [ ] Recurring Object
- [ ] Prop as Symbol
- [ ] Color Symbolism
- [ ] Naming / Renaming
- [ ] Symbols of Loss / Change

---

## 16. Emotion (Fuel & Depth)
- [ ] Emotional Truth
- [ ] Emotional Anchoring
- [ ] Vulnerability
- [ ] Scene-Level Emotional Arcs
- [ ] Writing from the Body

---

## 17. Indulgence (Do What You Love)
- [ ] Writer Kink (feet, fights, fashion, etc)
- [ ] Personal Passion Threads
- [ ] Inside Jokes / Recurring Bits
- [ ] Selfish Scenes
- [ ] Emotional Fixations

---

## 18. Description (Sensory Power)
- [ ] Texture
- [ ] Smell & Taste
- [ ] Light & Shadow
- [ ] Sound Design
- [ ] Physicality
- [ ] Setting as Character

---

## 19. Memoir Room (True Storytelling)
- [ ] Emotional Honesty
- [ ] Compression of Time
- [ ] Self vs Other
- [ ] Narrative Distance
- [ ] Voice over Facts
- [ ] Memory as Story

---

## 20. Poetry Room (Line & Language)
- [ ] Line Break Logic
- [ ] Rhythm & Pulse
- [ ] Metaphor Weaving
- [ ] Form (Sonnet, Free Verse, etc)
- [ ] Image Chains
- [ ] Poetic Voice vs Prose Voice

---

## 21. Screenwriting Room (Script Tools)
- [ ] Scene Sluglines
- [ ] Parentheticals
- [ ] Dialogue Rhythm
- [ ] Visual Action
- [ ] Beat Control
- [ ] Economy of Language

---

## 22. Comics Room (Panel-by-Panel Storytelling)
- [ ] Panel Description
- [ ] Dialogue vs Caption
- [ ] Page Turn Reveal
- [ ] Visual Blocking
- [ ] Layout Rhythm
- [ ] Art as Narrative

---

## 23. Comedy Room (Writing for Laughter)
- [ ] Setup → Mix → Punchline
- [ ] Premise Structure
- [ ] Escalation / Left Turn
- [ ] Absurdity
- [ ] Satire vs Slapstick
- [ ] Sketch, Stand-Up, Improv

---

## 24. Journalism Room (Truth as Story)
- [ ] Inverted Pyramid
- [ ] Lede Writing
- [ ] Interview Dialogue
- [ ] Factual Compression
- [ ] Emotional Objectivity
- [ ] Structure under Deadline

---

## 25. Genre Room (Playbook of Tropes)
- [ ] Horror
- [ ] Romance
- [ ] Thriller
- [ ] Fantasy
- [ ] Sci-Fi
- [ ] Noir
- [ ] Coming-of-Age
- [ ] Western
- [ ] Mystery
- [ ] Speculative

---

## 26. Worldbuilding Room (The Ecosystem of Story)
- [ ] Culture & Custom
- [ ] Geography & Physics
- [ ] Magic & Technology
- [ ] Power & Economy
- [ ] History & Myth
- [ ] Language & Symbol


