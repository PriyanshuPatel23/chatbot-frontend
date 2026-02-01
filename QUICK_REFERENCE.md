# 🚀 Quick Reference - GLP-1 Frontend

## Installation & Running

### First Time Setup
```bash
# Clone or navigate to project
cd chatbot-frontend

# Install dependencies
npm install

# Configure backend URL (if needed)
# Edit .env.local and update NEXT_PUBLIC_API_BASE_URL

# Start development server
npm run dev
```

### Access the App
```
http://localhost:3000
```

## Build Commands

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

**File:** `.env.local`

```env
# Backend API URL (default: http://localhost:8000)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Enable debug logging (optional)
NEXT_PUBLIC_DEBUG_MODE=false
```

## Project Structure

```
app/
├── page.tsx                    # Main page - complete flow
├── store.ts                    # Redux store
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── components/
│   ├── atoms/                 # Basic UI elements
│   ├── molecules/             # Message bubbles
│   ├── organisms/             # Complex components
│   │   ├── ChatWindow.tsx
│   │   ├── EligibilityDisplay.tsx
│   │   ├── RecommendationDisplay.tsx
│   │   ├── MessageList.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── PatientDataSummary.tsx
│   └── templates/             # Page templates
├── features/chat/             # Redux logic
└── lib/
    ├── api.ts                # API calls
    └── types.ts              # TypeScript types
```

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main application logic & flow |
| `lib/api.ts` | All API endpoint calls |
| `lib/types.ts` | Complete TypeScript types |
| `app/features/chat/chatSlice.ts` | Redux state management |
| `app/components/templates/ChatWindow.tsx` | Chat UI |
| `app/components/organisms/EligibilityDisplay.tsx` | Eligibility results |
| `app/components/organisms/RecommendationDisplay.tsx` | Recommendation details |
| `.env.local` | Environment configuration |

## API Endpoints

```typescript
// Initialization
POST /start-conversation

// Chat
POST /chat

// Eligibility
POST /eligibility/evaluate
POST /eligibility/check-contraindications
GET /eligibility/criteria

// Recommendation
POST /recommendation/complete
GET /recommendation/pipeline-info

// Health
GET /health
```

## Component Hierarchy

```
Home (page.tsx)
├── Header
├── Main Content Grid
│   ├── ChatWindow (or Eligibility/Recommendation)
│   │   ├── MessageList
│   │   │   ├── MessageBubble (repeated)
│   │   │   └── TypingIndicator
│   │   └── Input Section
│   └── Sidebar
│       ├── ProgressIndicator
│       ├── PatientDataSummary
│       └── StatusCard
└── Footer
```

## Redux State

```typescript
state.chat = {
  // Chat
  messages: ConversationEntry[]
  collectedData: CollectedData
  sessionId?: string
  completionPercentage: number
  isConversationComplete: boolean
  
  // Eligibility
  eligibility?: EligibilityResponse
  eligibilityLoading: boolean
  eligibilityError?: string
  
  // Recommendation
  recommendation?: CompleteRecommendationResponse
  recommendationLoading: boolean
  recommendationError?: string
  
  // UI
  currentStep: 'chat' | 'eligibility' | 'recommendation'
  loading: boolean
  error?: string
}
```

## Common Tasks

### Add a New API Call
1. Add function to `lib/api.ts`
2. Add types to `lib/types.ts`
3. Dispatch Redux action in component

### Add a New Component
1. Create file in `components/organisms/`
2. Import in parent component
3. Add TypeScript props interface
4. Use Redux state with `useSelector`

### Debug Redux State
```typescript
// In browser console
store.getState() // View entire state
store.dispatch(action) // Dispatch action
```

### Check API Communication
```bash
# Backend health check
curl http://localhost:8000/health

# Frontend API logs (check browser console)
# All API calls are logged in the api.ts file
```

## Troubleshooting

### Backend Not Connecting
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check `.env.local` has correct API URL
3. Ensure backend CORS is enabled
4. Restart frontend with `npm run dev`

### Typescript Import Errors
1. Run: `npm run lint`
2. Check if file exports the type
3. Verify import path is correct
4. Restart TypeScript server in editor

### State Not Updating
1. Check Redux DevTools (browser extension)
2. Verify dispatch is called
3. Check reducer has the action
4. Use `useSelector` to access state

### Styling Issues
1. Verify Tailwind CSS is loaded
2. Check class names are valid Tailwind v4
3. Run `npm run dev` again
4. Clear browser cache (Ctrl+Shift+Delete)

## Performance Tips

1. **Memoize Components**: Use `React.memo()` for expensive renders
2. **Code Splitting**: Next.js auto-code-splits at page level
3. **Optimize Images**: Use Next.js Image component
4. **Redux Selectors**: Use `useSelector()` to subscribe to specific state parts

## Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy automatically via Vercel
# Set env var: NEXT_PUBLIC_API_BASE_URL
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
ENV NEXT_PUBLIC_API_BASE_URL=http://api:8000
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment for Prod
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
NEXT_PUBLIC_DEBUG_MODE=false
```

## Testing

### Run Tests (when configured)
```bash
npm run test
npm run test:watch
```

### Manual Testing
See `TEST_PLAN.md` for comprehensive test cases

### Browser DevTools
- **Redux DevTools**: Monitor state changes
- **Network Tab**: Monitor API calls
- **Console**: View logs and errors
- **Performance**: Monitor render times

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
# Commit
git add .
git commit -m "feat: add feature"

# Push
git push origin feature/feature-name

# Create pull request
```

## Documentation

- **FRONTEND_INTEGRATION_GUIDE.md** - Complete integration guide
- **TEST_PLAN.md** - Comprehensive testing guide
- **IMPLEMENTATION_SUMMARY.md** - What's been implemented
- **API.md** - Backend API docs (in main repo)
- **COMPLETE_API_DOCUMENTATION.md** - Full API reference

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## Support Contacts

- **Backend Issues**: Check backend logs
- **API Issues**: Check COMPLETE_API_DOCUMENTATION.md
- **Frontend Issues**: Check browser console
- **Questions**: Review code comments and docstrings

## Version Info

- **App Version**: 1.0.0
- **Node**: 18+
- **npm**: 9+
- **Next.js**: 16.0.1
- **React**: 19.2.0
- **Tailwind**: 4.x
- **Framer Motion**: 12.x

---

**Status**: ✅ Production Ready  
**Last Updated**: February 1, 2026
