# GLP-1 Frontend - Complete Testing Guide

## 🧪 Test Plan

### Prerequisites
1. Backend running on `http://localhost:8000` (or configured URL)
2. Ollama model running (`llama3:8b`)
3. Frontend running on `http://localhost:3000`

---

## ✅ Test Case 1: Full Assessment Flow

### Step 1: Initialize Chat
**Expected:**
- Page loads with header and chat window
- Chat displays initial greeting message
- Progress bar shows 0%
- Session ID created and stored

**Actual Result:** _______________

### Step 2: Answer Chat Questions
**Questions to Answer:**
1. Name: "John Doe"
2. Age: "42"
3. Height: "5'10\""
4. Weight: "220"
5. Pregnancy/Breastfeeding: "No"
6. Medical conditions: "Type 2 diabetes, hypertension"
7. Current medications: "Metformin, Lisinopril"
8. Weight loss goal: "Lose 30 pounds"

**Expected:**
- Messages appear in chat in chronological order
- User messages appear on right (blue background)
- AI responses appear on left (white background)
- Progress bar increases with each response
- Patient data summary updates in sidebar
- Timestamps display on messages

**Actual Result:** _______________

### Step 3: Conversation Completion
**Expected:**
- Progress reaches ~100%
- Chat shows "Assessment Complete!" message
- Input area changes to show completion state
- After 2 seconds, automatically transitions to eligibility assessment

**Actual Result:** _______________

### Step 4: Review Eligibility Assessment
**Expected:**
- Page shows eligibility score (0-100)
- Status shows: ELIGIBLE / CONDITIONALLY_ELIGIBLE / INELIGIBLE
- Risk level displayed (LOW / MODERATE / HIGH / CRITICAL)
- Clinical assessment cards show:
  - BMI with value and category
  - Diabetes status
  - Comorbidities
  - Weight loss goal
  - Contraindications status
- Decision support section shows recommendation
- Physician review section lists focus areas
- Action button visible to proceed to recommendation

**Actual Result:** _______________

### Step 5: Get Complete Recommendation
**Expected:**
- Loading indicator appears
- API processes full recommendation
- Page transitions to recommendation display
- Shows medication tabs:
  - Recommended (primary choice)
  - Prescription details
  - Alternatives
  - Next steps

**Actual Result:** _______________

### Step 6: Review Medication Recommendation
**Expected:**
- Primary recommendation displays with:
  - Medication name and rank
  - Total score and component scores
  - Strengths (green highlight)
  - Weaknesses (amber highlight)
  - Rationale paragraph

**Actual Result:** _______________

### Step 7: Review Prescription Details
**Expected:**
- Patient information section
- Dosing schedule (titration steps)
- Administration instructions
- Baseline labs checklist
- Follow-up schedule with timepoints
- Common side effects with management tips
- Serious side effects with warnings
- Drug interactions table
- Lifestyle modifications list
- Dietary recommendations
- Expected outcomes
- When to contact physician

**Actual Result:** _______________

### Step 8: Review Alternative Medications
**Expected:**
- Shows 3+ alternative medications
- Each card includes:
  - Medication name and rank
  - Total score
  - Rationale
  - Strengths and weaknesses
  - Score breakdown

**Actual Result:** _______________

### Step 9: View Next Steps
**Expected:**
- Numbered action items
- Completion message
- Buttons to:
  - Start new assessment
  - Print report

**Actual Result:** _______________

### Step 10: Reset and Start New
**Expected:**
- Click "Start New Assessment"
- All state clears
- Returns to initial chat screen
- New session ID created
- Can restart the flow

**Actual Result:** _______________

---

## ⚠️ Test Case 2: Error Handling

### Test 2.1: Backend Unavailable
**Precondition:** Stop the backend server

**Expected:**
- Error message displays
- "Try Again" button appears
- Can retry the action

**Actual Result:** _______________

### Test 2.2: Timeout Handling
**Precondition:** Slow network or backend delay

**Expected:**
- Loading indicator shows
- Message doesn't disappear
- Eventually shows result or error
- User can retry

**Actual Result:** _______________

### Test 2.3: Invalid Response
**Expected:**
- Error displayed to user
- Error message is helpful
- Can continue or retry

**Actual Result:** _______________

---

## 📱 Test Case 3: UI/UX

### Test 3.1: Responsive Design
**Devices to Test:**
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

**Expected:**
- All content visible
- Sidebar moves below on mobile
- Buttons are touch-friendly
- Text is readable

**Desktop:** _______________  
**Tablet:** _______________  
**Mobile:** _______________

### Test 3.2: Animations
**Expected:**
- Smooth transitions between screens
- Progress bar animates smoothly
- Messages fade in
- Buttons have hover effects

**Actual Result:** _______________

### Test 3.3: Accessibility
**Expected:**
- Keyboard navigation works (Tab key)
- Screen reader compatible
- Proper ARIA labels
- Color contrast sufficient

**Actual Result:** _______________

---

## 🔄 Test Case 4: State Management

### Test 4.1: Redux State
**Expected:**
- All state properly stored in Redux
- State persists during navigation
- Can dispatch actions correctly
- Selectors return correct data

**Actual Result:** _______________

### Test 4.2: Session Management
**Expected:**
- Session ID created and maintained
- Conversation history preserved
- Collected data preserved across steps
- Reset clears all state

**Actual Result:** _______________

---

## 📊 Test Case 5: Data Validation

### Test 5.1: Numeric Fields
**Test Values:**
- Age: 42 ✓
- Age: -5 (should handle)
- Weight: 220 ✓
- Weight: 0 (should handle)

**Actual Result:** _______________

### Test 5.2: Text Fields
**Test Values:**
- Name: "John Doe" ✓
- Name: "" (empty)
- Long text (100+ chars)

**Actual Result:** _______________

### Test 5.3: Special Characters
**Test Values:**
- Name: "José García"
- Medical conditions: "Type 2 Diabetes & Hypertension"

**Actual Result:** _______________

---

## 🔐 Test Case 6: Security

### Test 6.1: No Sensitive Data in Console
**Expected:**
- Patient data not logged to console
- Tokens not exposed
- Errors don't leak information

**Actual Result:** _______________

### Test 6.2: HTTPS Ready
**Expected:**
- Works with both http and https
- No mixed content warnings
- Secure headers configured

**Actual Result:** _______________

---

## 📈 Test Case 7: Performance

### Test 7.1: Initial Load
**Metric:** Time to interactive
- Target: < 3 seconds

**Actual Result:** ___ seconds _______________

### Test 7.2: API Response Time
**Metric:** Time for chat response
- Target: < 5 seconds (local), < 10 seconds (with delay)

**Actual Result:** ___ seconds _______________

### Test 7.3: Memory Usage
**Expected:**
- No memory leaks
- Smooth scrolling in chat history
- Multiple messages don't cause slowdown

**Actual Result:** _______________

---

## 🎯 Test Case 8: Feature-Specific Tests

### Test 8.1: Message Copy
**Expected:**
- Can select and copy messages
- Formatting preserved

**Actual Result:** _______________

### Test 8.2: Export/Print
**Expected:**
- Can print recommendation
- Print layout is readable
- All information included

**Actual Result:** _______________

### Test 8.3: Progress Tracking
**Expected:**
- Progress bar updates correctly
- Percentage reflects actual completion
- Sidebar shows progress by category

**Actual Result:** _______________

### Test 8.4: Tab Navigation (Recommendation)
**Expected:**
- Can switch between tabs
- Tab content loads correctly
- Smooth transitions
- Current tab highlighted

**Actual Result:** _______________

---

## 🧮 Eligibility Scenarios to Test

### Scenario 1: Eligible Patient
**Data:**
- Age: 45
- BMI: 32 (weight 200, height 5'7")
- Type 2 Diabetes: Yes, controlled
- Hypertension: Yes
- No contraindications

**Expected Status:** ELIGIBLE
**Expected Score:** 60-100

**Actual Result:** _______________

### Scenario 2: Conditionally Eligible
**Data:**
- Age: 50
- BMI: 29.5
- Type 2 Diabetes: Yes, uncontrolled
- Unknown kidney function

**Expected Status:** CONDITIONALLY_ELIGIBLE
**Expected Score:** 40-59

**Actual Result:** _______________

### Scenario 3: Ineligible
**Data:**
- Age: 25
- Pregnant: Yes

**Expected Status:** INELIGIBLE
**Expected Score:** < 20

**Actual Result:** _______________

---

## 📋 Browser Compatibility

- [ ] Chrome 120+
- [ ] Firefox 121+
- [ ] Safari 17+
- [ ] Edge 120+

---

## ✨ Edge Cases

### Test EC1: Rapid Message Sending
**Action:** Send messages rapidly without waiting for response

**Expected:** 
- Messages queue properly
- No state corruption
- Responses arrive in order

**Actual Result:** _______________

### Test EC2: Browser Back Button
**Action:** Press browser back during assessment

**Expected:**
- Navigation handled gracefully
- State preserved or reset appropriately

**Actual Result:** _______________

### Test EC3: Tab Switch
**Action:** Switch browser tabs and return

**Expected:**
- State preserved
- No re-initialization needed
- Can continue assessment

**Actual Result:** _______________

### Test EC4: Very Long Input
**Action:** Send very long message (1000+ chars)

**Expected:**
- Handled without error
- Display truncated appropriately
- Functionality preserved

**Actual Result:** _______________

---

## 📝 Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA | __________ | __________ | ✓/✗ |
| Dev | __________ | __________ | ✓/✗ |
| PM  | __________ | __________ | ✓/✗ |

---

## 🐛 Known Issues

|  ID | Description | Severity | Status |
|-----|-------------|----------|--------|
| 1   |             | High/Med/Low | Open/Fixed |
| 2   |             | High/Med/Low | Open/Fixed |

---

**Test Execution Date:** _______________  
**Backend Version:** _______________  
**Frontend Version:** 1.0.0
