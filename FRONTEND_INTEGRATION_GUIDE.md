# GLP-1 Chatbot Frontend - Complete Integration Guide

## 🎯 Overview

This is a fully integrated React/Next.js frontend for the GLP-1 Medication Eligibility Assessment system. It implements a three-stage flow:

1. **Chat Phase**: Conversational data collection
2. **Eligibility Phase**: Clinical assessment and scoring
3. **Recommendation Phase**: Medication recommendations and detailed prescription

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:8000` (or update `.env.local`)

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm build
npm start
```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

### API Base URL

Update `.env.local` to point to your backend server:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 📊 Features Implemented

### ✅ Complete API Integration

#### Conversation Management
- `POST /start-conversation` - Initialize a chat session
- `POST /chat` - Send messages and get AI responses
- Real-time progress tracking (0-100%)
- Auto-transition to eligibility when conversation complete

#### Eligibility Assessment
- `POST /eligibility/evaluate` - Get eligibility score and status
- `POST /eligibility/check-contraindications` - Quick contraindication check
- `GET /eligibility/criteria` - Get scoring criteria

#### Medication Recommendation
- `POST /recommendation/complete` - Get full recommendation with:
  - Eligibility assessment results
  - Primary medication recommendation (with scoring)
  - Alternative medication options
  - Detailed prescription with:
    - Titration schedule
    - Administration instructions
    - Baseline lab requirements
    - Follow-up schedule
    - Side effects (common & serious)
    - Drug interactions
    - Lifestyle modifications
    - Dietary recommendations
    - Expected outcomes

#### Health & Utility
- `GET /health` - API health check

### 🎨 UI Components

#### Organisms
- **ChatWindow**: Message input/output with progress bar
- **MessageList**: Scrollable conversation history with typing indicator
- **EligibilityDisplay**: Clinical assessment with scores and decision support
- **RecommendationDisplay**: Multi-tab recommendation viewer
  - Medication tab: Scores and rationale
  - Prescription tab: Detailed prescription details
  - Alternatives tab: Other medication options
  - Next steps tab: Action plan

#### Atoms & Molecules
- MessageBubble: Styled conversation messages
- Button: Reusable button component
- Input: Text input field
- ProgressIndicator: Multi-category progress tracking
- PatientDataSummary: Collected patient information display

### 🔄 State Management (Redux)

Complete Redux integration with:
- Chat state (messages, session, progress)
- Eligibility state (results, loading, error)
- Recommendation state (results, loading, error)
- UI state (current step, errors)

Actions:
```typescript
addMessage, setSession, mergeCollectedData, setChatCompletion,
setEligibilityLoading, setEligibility, setEligibilityError,
setRecommendationLoading, setRecommendation, setRecommendationError,
setCurrentStep, setError, reset
```

## 📁 Project Structure

```
app/
├── page.tsx                          # Main entry point with full flow
├── store.ts                          # Redux store configuration
├── layout.tsx                        # App layout
├── globals.css                       # Global styles
├── api/                              # API routes (optional)
├── components/
│   ├── atoms/
│   │   ├── Button.tsx               # Reusable button
│   │   └── Input.tsx                # Reusable input
│   ├── molecules/
│   │   └── MessageBubble.tsx        # Chat message styling
│   ├── organisms/
│   │   ├── MessageList.tsx          # Conversation history
│   │   ├── EligibilityDisplay.tsx   # Eligibility results
│   │   ├── RecommendationDisplay.tsx # Full recommendation
│   │   ├── ProgressIndicator.tsx    # Progress tracking
│   │   └── PatientDataSummary.tsx   # Data summary
│   ├── templates/
│   │   └── ChatWindow.tsx           # Chat input/output interface
│   └── pages/                        # Page-level components
├── features/
│   └── chat/
│       └── chatSlice.ts             # Redux chat reducer
├── hooks/
│   └── useQuestionFlow.ts           # Custom hook (optional)
└── lib/
    ├── api.ts                       # API service with all endpoints
    └── types.ts                     # Complete TypeScript types
```

## 🔌 API Endpoints Used

### Chat Flow
```
POST /start-conversation
  ↓
POST /chat (multiple times)
  ↓
POST /eligibility/evaluate
  ↓
POST /recommendation/complete
```

## 💾 Data Flow

1. **Initialization**
   - User loads page
   - Frontend calls `POST /start-conversation`
   - Gets initial message and session ID
   - Redux state initialized

2. **Chat Phase**
   - User sends messages via input
   - `POST /chat` called with message + conversation history
   - API extracts structured data and updates progress
   - Progress bar updates (0-100%)
   - When progress reaches 100%, chat auto-transitions

3. **Eligibility Phase**
   - `POST /eligibility/evaluate` with all collected data
   - Shows eligibility score, status, clinical assessment
   - Displays decision support and physician review notes
   - User can proceed to recommendation or start over

4. **Recommendation Phase**
   - `POST /recommendation/complete` fetches full recommendation
   - Displays eligibility + medication scores + prescription details
   - User can review medication alternatives
   - Can start new assessment

## 🎨 Styling

- **Framework**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Color Scheme**: Blue/Purple gradient theme
- **Responsive**: Mobile-first design with lg breakpoint for sidebar

## 🔐 Security Considerations

- ✅ CORS enabled for all endpoints
- ✅ No authentication required (backend token in env)
- ✅ HTTPS ready (update API_BASE_URL for production)
- ✅ Data stored in Redux (not persisted)

## 🐛 Error Handling

- Global error display with retry capability
- API error messages propagated to UI
- Try-catch blocks on all async operations
- User-friendly error messages

## 📱 Mobile Responsive

- Mobile-first design
- Sidebar moves below on sm screens
- Touch-friendly buttons and inputs
- Scrollable chat area

## 🚦 Testing the Flow

### 1. Start Assessment
```bash
npm run dev
# Visit http://localhost:3000
```

### 2. Complete Chat
- Answer all questions (progress should reach 100%)
- Chat automatically proceeds to eligibility

### 3. Review Eligibility
- Check score and clinical assessment
- Review decision support notes
- Click "Get Medication Recommendation"

### 4. Review Recommendation
- Browse medication scores
- Check prescription details (tabs)
- Review alternatives
- See next steps

### 5. Start New
- Click "Start New Assessment" to reset

## 🔄 Redux State Structure

```typescript
interface ChatState {
  // Conversation
  messages: ConversationEntry[]
  collectedData: CollectedData
  sessionId?: string
  completionPercentage: number
  isConversationComplete: boolean
  nextExpectedField?: string

  // Eligibility
  eligibility?: EligibilityResponse
  eligibilityLoading: boolean
  eligibilityError?: string

  // Recommendation
  recommendation?: CompleteRecommendationResponse
  recommendationLoading: boolean
  recommendationError?: string

  // UI
  currentStep: 'chat' | 'eligibility' | 'recommendation' | 'complete'
  loading: boolean
  error?: string
  medicalFlags: string[]
}
```

## 📦 Dependencies

```json
{
  "@reduxjs/toolkit": "^2.11.2",
  "clsx": "^2.1.1",
  "date-fns": "^4.1.0",
  "framer-motion": "^12.23.24",
  "next": "16.0.1",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "react-redux": "^9.2.0",
  "tailwindcss": "^4"
}
```

## 🌟 Key Features

- ✅ **Conversational AI**: Natural language data collection
- ✅ **Progressive Disclosure**: Shows only relevant questions
- ✅ **Real-time Progress**: Visual progress tracking
- ✅ **Clinical Scoring**: Eligibility scores and decision support
- ✅ **Multi-Medication Ranking**: MCDM-based recommendations
- ✅ **Detailed Prescriptions**: Complete medication guidance
- ✅ **Side Effect Info**: Common and serious side effects
- ✅ **Drug Interactions**: Medication interaction warnings
- ✅ **Lifestyle Guidance**: Diet and exercise recommendations
- ✅ **Responsive Design**: Mobile and desktop optimization
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Smooth Animations**: Framer Motion transitions

## 📝 API Type Definitions

All TypeScript types are in `lib/types.ts`:
- `ConversationEntry`
- `CollectedData`
- `ChatResponse`
- `EligibilityResponse`
- `CompleteRecommendationResponse`
- `MedicationScore`
- `Prescription`
- Plus many more structured types...

## 🔗 API Service

All API calls centralized in `lib/api.ts`:
```typescript
api.startConversation()
api.sendChatMessage(...)
api.evaluateEligibility(...)
api.getCompleteRecommendation(...)
api.checkHealth()
```

## 💡 Usage Example

```tsx
// In any component
const dispatch = useDispatch()
const { messages, eligibility, recommendation } = useSelector(
  (root: RootState) => root.chat
)

// Trigger API call
const sendMessage = async (text: string) => {
  dispatch(setLoading(true))
  const response = await api.sendChatMessage(text, messages, data, sessionId)
  dispatch(addMessage({ role: 'assistant', content: response.response, timestamp: new Date().toISOString() }))
}
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
# Update NEXT_PUBLIC_API_BASE_URL in Vercel project settings
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

## 📞 Support

For issues or questions:
1. Check the API documentation (COMPLETE_API_DOCUMENTATION.md)
2. Verify backend is running and accessible
3. Check browser console for error messages
4. Ensure environment variables are set correctly

## 📄 License

This project is part of the GLP-1 Medication Assessment System.

---

**Version**: 1.0.0  
**Last Updated**: February 1, 2026  
**Status**: Production Ready ✅
