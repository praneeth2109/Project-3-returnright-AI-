# ReturnRight AI — Smart Refund Policy Assistant

A production-ready retrieval-based AI assistant for retail return & refund policies.
Built with React, Node.js, Express, MongoDB, and a custom TF-IDF retrieval engine.

## Features

- **Smart Retrieval**: TF-IDF keyword scoring ranks the top 3 most relevant policy sections per query
- **Category Filtering**: Filter queries to a specific product category (electronics, clothing, etc.)
- **Grounded Answers**: Responses are built exclusively from retrieved policy text — zero hallucination
- **Keyword Highlighting**: Matched keywords are highlighted in source snippets
- **Chat UI**: Clean ChatGPT-style interface with user/assistant bubbles
- **Dark/Light Theme**: Toggle between themes, persisted in localStorage
- **Policy Upload**: Add new policies via form builder or JSON upload
- **Source Citations**: Every answer shows expandable source cards with match scores

---

## Project Structure

```
returnright/
├── server/                     # Node.js + Express backend
│   ├── index.js                # App entry point
│   ├── package.json
│   ├── .env                    # Environment variables
│   ├── data/
│   │   └── policies.json       # Sample policy dataset (6 categories)
│   ├── models/
│   │   └── Policy.js           # Mongoose schema
│   ├── routes/
│   │   ├── query.js            # POST /api/query
│   │   └── policies.js         # CRUD /api/policies
│   ├── controllers/
│   │   ├── queryController.js  # Retrieval + answer logic
│   │   └── policyController.js # Policy CRUD
│   └── utils/
│       ├── retrieval.js        # TF-IDF engine + keyword highlighter
│       ├── answerGenerator.js  # Grounded answer synthesis
│       └── seeder.js           # Auto-seeds DB on first run
│
└── client/                     # React frontend
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── styles.css          # Full design system (dark/light)
        ├── context/
        │   └── ThemeContext.js # Dark/light theme provider
        ├── hooks/
        │   └── useChat.js      # Chat state management
        ├── services/
        │   └── api.js          # Axios API client
        ├── pages/
        │   └── ChatPage.js     # Main page layout
        └── components/
            ├── TopBar.js       # App header with theme toggle
            ├── Sidebar.js      # Category nav + upload button
            ├── ChatMessage.js  # User/assistant bubble + source cards
            ├── ChatInput.js    # Textarea + example prompts
            ├── TypingIndicator.js
            └── UploadModal.js  # Form + JSON upload modal
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Clone / Extract the project

```bash
cd returnright
```

### 2. Backend Setup

```bash
cd server
npm install
```

Edit `.env` if needed (defaults work with local MongoDB):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/returnright
CLIENT_URL=http://localhost:3000
```

Start the server:

```bash
npm run dev        # with nodemon (auto-restart)
# or
npm start          # production
```

The server will:
- Connect to MongoDB
- Auto-seed 6 policy categories on first run
- Start on http://localhost:5000

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

Opens at http://localhost:3000

---

## API Reference

### POST /api/query
Send a natural language question and get a grounded answer.

**Request:**
```json
{
  "question": "What is the return window for electronics?",
  "category": "electronics"  // optional filter
}
```

**Response:**
```json
{
  "question": "What is the return window for electronics?",
  "answer": "Based on the Return Window section...",
  "primarySource": "Electronics Return & Refund Policy › Return Window",
  "sources": [
    {
      "sectionId": "elec_001",
      "category": "electronics",
      "policyTitle": "Electronics Return & Refund Policy",
      "policyIcon": "💻",
      "heading": "Return Window",
      "content": "Electronics purchased from our store...",
      "highlightedContent": "...<mark>electronics</mark>...",
      "score": 1.17,
      "matchedKeywords": ["electronics", "return", "window"]
    }
  ],
  "confidence": "high",
  "retrievedAt": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/policies/categories
Returns all available policy categories.

### GET /api/policies/:category
Returns full policy document for a category.

### POST /api/policies
Upload a new policy document (auto-indexes TF-IDF at write time).

### DELETE /api/policies/:id
Delete a policy by its ID.

---

## How the Retrieval Works

1. **Indexing**: At write/seed time, each policy section is tokenized (stop words removed, normalized) and term frequencies are computed and stored in MongoDB.

2. **Query Time**: The user's question is tokenized. For each candidate chunk, a TF-IDF score is computed:
   - TF = term frequency in the chunk
   - IDF = log((N+1)/(df+1)) + 1 (smoothed)
   - Score = sum of TF-IDF for all query terms + heading match bonus

3. **Ranking**: Chunks are sorted by score. Top 3 are returned.

4. **Answer Generation**: The top chunk forms the primary answer. Additional chunks append supplementary context. The answer is built entirely from retrieved text.

5. **Highlighting**: Matched keywords are wrapped in `<mark>` tags server-side for display.

---

## Sample Policies Included

| Category    | Icon | Sections |
|-------------|------|----------|
| Electronics | 💻   | 5        |
| Clothing    | 👕   | 5        |
| Furniture   | 🪑   | 4        |
| Grocery     | 🛒   | 4        |
| Toys        | 🎮   | 4        |
| Sports      | ⚽   | 4        |

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Tailwind-inspired CSS   |
| Backend   | Node.js, Express 4                |
| Database  | MongoDB + Mongoose                |
| Retrieval | Custom TF-IDF (no external deps)  |
| Fonts     | Instrument Sans + DM Mono         |
