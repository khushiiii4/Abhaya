# ✅ Abhaya - Testing Checklist

Use this checklist to verify that all integration points are working correctly.

---

## 🔧 Pre-Testing Setup

- [ ] MongoDB is running
- [ ] Backend `.env` file created from `.env.example`
- [ ] Frontend `.env` file created from `.env.example`
- [ ] All dependencies installed (`npm install` in both folders)

---

## 🚀 Server Startup

- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Backend logs show: `✅ MongoDB Connected`
- [ ] Backend logs show: `🚀 Server running on http://localhost:5000`
- [ ] Frontend accessible at `http://localhost:5173`

---

## 👤 Authentication Tests

### Registration
- [ ] Navigate to `/register` or toggle to Register tab
- [ ] Fill in all fields (name, email, phone, password)
- [ ] Submit registration form
- [ ] User redirected to dashboard
- [ ] JWT token saved in localStorage
- [ ] User object saved in localStorage
- [ ] Backend logs show user creation
- [ ] MongoDB shows new user in `users` collection

### Login
- [ ] Navigate to `/login`
- [ ] Enter registered credentials
- [ ] Submit login form
- [ ] User redirected to dashboard
- [ ] JWT token updated in localStorage
- [ ] Backend logs show successful login

### Protected Routes
- [ ] Try accessing `/dashboard` without login → redirected to login
- [ ] After login, `/dashboard` accessible
- [ ] All protected pages require authentication

---

## 🗺️ Dashboard Tests

- [ ] Dashboard loads successfully
- [ ] User location marker appears on map
- [ ] User location is accurate
- [ ] Map is interactive (zoom, pan)
- [ ] Statistics cards show correct counts
- [ ] "Add Safe Zone" button works
- [ ] Navigation buttons work

---

## 👥 Contacts Tests

### View Contacts
- [ ] Navigate to `/contacts`
- [ ] Page loads without errors
- [ ] Empty state shows if no contacts

### Add Contact
- [ ] Click "Add Contact" button
- [ ] Modal opens
- [ ] Enter name and 10-digit phone
- [ ] Submit form
- [ ] Contact appears in list immediately
- [ ] Backend API call visible in Network tab
- [ ] MongoDB `contacts` collection updated
- [ ] Refresh page → contact still there

### Delete Contact
- [ ] Click delete button on a contact
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Contact removed from list
- [ ] Backend API DELETE call successful
- [ ] MongoDB document deleted
- [ ] Refresh page → contact gone

### Validation
- [ ] Phone number must be exactly 10 digits
- [ ] Name field is required
- [ ] Error messages display correctly

---

## 🛡️ Safe Zones Tests

### View Zones
- [ ] Navigate to `/safe-zones`
- [ ] Map loads with user location
- [ ] Empty state shows if no zones
- [ ] Instruction banner appears

### Create Zone
- [ ] Click anywhere on map
- [ ] Popup appears with form
- [ ] Radius slider works (500m - 5000m)
- [ ] Circle updates as radius changes
- [ ] Enter zone name
- [ ] Submit form
- [ ] Zone appears on map with circle
- [ ] Zone card appears below map
- [ ] Backend API POST call successful
- [ ] MongoDB `safezones` collection updated
- [ ] Refresh page → zone still there

### View Existing Zones
- [ ] All zones show on map
- [ ] Circles are properly sized
- [ ] Zone cards show correct info
- [ ] Multiple zones can coexist

### Delete Zone
- [ ] Click delete on zone card
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Zone removed from map and list
- [ ] Backend API DELETE call successful
- [ ] MongoDB document deleted

---

## ⚠️ Danger Reports Tests

### View Reports
- [ ] Navigate to `/reports`
- [ ] Map loads with user location
- [ ] Nearby reports fetch on load
- [ ] Empty state if no reports

### Add Report
- [ ] Click "Add Report" button
- [ ] Form appears
- [ ] Click on map to select location
- [ ] Location marker appears
- [ ] Select category
- [ ] Enter description
- [ ] Select severity (optional)
- [ ] Submit form
- [ ] Report saved successfully
- [ ] Toast notification appears
- [ ] Warning marker appears on map
- [ ] Backend API POST call successful
- [ ] MongoDB `reports` collection updated

### View Report Details
- [ ] Click on warning marker
- [ ] Popup shows report details
- [ ] Category, description, timestamp visible
- [ ] Report icon matches category

### Community Reports
- [ ] Reports from other users visible (if any)
- [ ] GET `/api/reports/nearby` returns data
- [ ] Map shows all active reports

---

## 🚨 SOS System Tests

### Prerequisites
- [ ] At least one emergency contact added
- [ ] Location services enabled

### Trigger SOS
- [ ] Navigate to `/sos` or click SOS button
- [ ] Large SOS button visible and pulsing
- [ ] Click SOS button
- [ ] Confirmation modal appears
- [ ] Confirm SOS trigger
- [ ] Success message appears
- [ ] Backend API `/api/sos/trigger` called
- [ ] Socket.IO event `sos:alert` emitted
- [ ] SMS sent to contacts (if Twilio configured)
- [ ] MongoDB `soslogs` collection updated

### Socket.IO Real-time
- [ ] Open two browser windows
- [ ] Login in both
- [ ] Window 1: Trigger SOS
- [ ] Window 2: Receives real-time alert
- [ ] Browser console shows socket events

### SOS Logs
- [ ] Navigate to SOS history (if page exists)
- [ ] GET `/api/sos/logs` returns data
- [ ] Past SOS events listed
- [ ] Each log shows date, location, contacts notified

### Resolve SOS
- [ ] Trigger a new SOS
- [ ] Click "Resolve" button (if available)
- [ ] SOS status updated to "resolved"
- [ ] Backend API `/api/sos/resolve` called
- [ ] Socket.IO event `sos:resolved` emitted

---

## 🔌 Socket.IO Tests

### Connection
- [ ] Open browser console (F12)
- [ ] Look for: `✅ Socket connected: <socket-id>`
- [ ] Socket connects automatically on login
- [ ] User joins personal room
- [ ] Socket disconnects on logout

### Events
- [ ] Trigger SOS in one tab
- [ ] Other tabs receive `sos:alert` event
- [ ] Browser console logs show events
- [ ] Real-time notifications work

### Reconnection
- [ ] Stop backend server
- [ ] Frontend shows disconnection
- [ ] Restart backend
- [ ] Socket auto-reconnects
- [ ] User rejoins room

---

## 🗺️ Map Integration Tests

### Leaflet Maps
- [ ] Maps load without errors
- [ ] Tiles load correctly
- [ ] No missing map sections
- [ ] Zoom controls work
- [ ] Pan/drag works
- [ ] Custom markers display properly

### User Location
- [ ] User location marker is pulsing
- [ ] Location updates in real-time
- [ ] Accurate coordinates
- [ ] "My Location" button works (if present)

### Multiple Markers
- [ ] Safe zones show as markers + circles
- [ ] Danger reports show as warning icons
- [ ] User location distinct from other markers
- [ ] All markers clickable
- [ ] Popups show correct info

---

## 📱 UI/UX Tests

### Responsive Design
- [ ] Desktop view (1920x1080) works
- [ ] Tablet view (768px) works
- [ ] Mobile view (375px) works
- [ ] All buttons accessible
- [ ] Forms are usable on mobile
- [ ] Maps resize properly

### Navigation
- [ ] Top navbar works
- [ ] Bottom navigation works
- [ ] SOS button elevated and prominent
- [ ] Active page highlighted
- [ ] Back buttons work

### Loading States
- [ ] Spinners show during data fetch
- [ ] Skeleton screens if applicable
- [ ] No blank screens
- [ ] Error states handled gracefully

### Toast Notifications
- [ ] Success toasts appear (green)
- [ ] Error toasts appear (red)
- [ ] Info toasts appear (blue)
- [ ] Toasts auto-dismiss after 3 seconds

---

## 🔒 Security Tests

### Authentication
- [ ] Can't access protected routes without token
- [ ] Invalid token redirects to login
- [ ] Expired token handled correctly
- [ ] Logout clears token and user data

### Authorization
- [ ] Users can only delete their own contacts
- [ ] Users can only delete their own zones
- [ ] Users can only delete their own reports
- [ ] API returns 403 for unauthorized actions

### Input Validation
- [ ] Backend validates all inputs
- [ ] Frontend validates before submission
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized

---

## 🗄️ Database Tests

### MongoDB Collections
- [ ] `users` - User documents created
- [ ] `contacts` - Contact documents created
- [ ] `safezones` - Zone documents created
- [ ] `reports` - Report documents created
- [ ] `soslogs` - SOS log documents created

### Data Integrity
- [ ] User IDs correctly reference users
- [ ] Timestamps (createdAt, updatedAt) work
- [ ] Deleted documents removed from DB
- [ ] No orphaned documents

### Queries
- [ ] GET requests return correct data
- [ ] Filters work (e.g., user-specific data)
- [ ] Sort order correct (newest first)
- [ ] Population works (e.g., userId → user name)

---

## 🛠️ Developer Tools Tests

### Browser Console
- [ ] No critical errors
- [ ] Socket connection logs visible
- [ ] API calls logged (if dev mode)
- [ ] No CORS errors

### Network Tab
- [ ] API calls show correct status codes
- [ ] 200/201 for successful requests
- [ ] 400/404/500 for errors
- [ ] JWT token in Authorization header
- [ ] Response data is correct

### Redux DevTools
- [ ] Redux store visible
- [ ] Actions dispatched correctly
- [ ] State updates properly
- [ ] Time-travel debugging works

### Backend Logs
- [ ] Winston logs to console and file
- [ ] Info logs for successful operations
- [ ] Error logs for failures
- [ ] Request logs from Morgan

---

## 🚀 Performance Tests

- [ ] Page load time < 3 seconds
- [ ] API responses < 500ms
- [ ] Maps load smoothly
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] No jank or stuttering

---

## 📱 Cross-Browser Tests

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## 🔄 Integration Flow Test

Complete end-to-end test:

1. [ ] Register new user
2. [ ] Add 2-3 emergency contacts
3. [ ] Create 2 safe zones on map
4. [ ] Add 1-2 danger reports
5. [ ] Trigger SOS alert
6. [ ] Verify SMS sent (if configured)
7. [ ] Check Socket.IO alert received
8. [ ] Verify SOS log created
9. [ ] View all data in MongoDB
10. [ ] Logout
11. [ ] Login again
12. [ ] Verify all data persisted

---

## 🐛 Error Scenarios

- [ ] Backend down → Frontend shows error
- [ ] MongoDB down → Backend logs error
- [ ] Invalid credentials → Error message shown
- [ ] Network error → Retry or error state
- [ ] Malformed data → Validation errors
- [ ] Duplicate entry → Appropriate message

---

## ✅ Sign-Off

**Tested by:** ___________________  
**Date:** ___________________  
**Environment:** [ ] Local [ ] Staging [ ] Production  
**Overall Status:** [ ] Pass [ ] Fail  

**Notes:**
___________________________________________
___________________________________________
___________________________________________

---

## 🎉 Success Criteria

All items must be checked for production deployment readiness.

**Total Checklist Items:** ~150  
**Minimum Pass Rate:** 95%

---

*Use this checklist systematically to ensure complete integration verification.*
