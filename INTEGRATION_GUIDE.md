# 🚀 Abhaya - Frontend Integration Guide

**For: Khushi (Frontend Developer)**  
**Last Updated: November 17, 2025**

---

## 📋 Table of Contents
1. [API Contract - All Endpoints](#api-contract)
2. [Socket Events Contract](#socket-events)
3. [Required Fields Reference](#required-fields)
4. [Mock Data for Development](#mock-data)
5. [Integration Checklist](#integration-checklist)
6. [Common Issues & Solutions](#troubleshooting)

---

## 🔌 API Contract - All Endpoints

### Base URL
**Development:** `http://localhost:5000`  
**Production:** `https://your-backend.onrender.com` (will be provided)

---

## 🔐 AUTH APIs

### 1. Register User
**POST** `/api/auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "Mishka",
  "email": "mishka@example.com",
  "phone": "9876543210",
  "password": "mishka123"
}
```

**Success Response (201):**
```json
{
  "_id": "65abf82e901",
  "name": "Mishka",
  "email": "mishka@example.com",
  "token": "<JWT_TOKEN>"
}
```

**Error Responses:**
- `400` → Invalid input (missing fields or validation error)
- `400` → Duplicate email/phone already exists

---

### 2. Login User
**POST** `/api/auth/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "mishka@example.com",
  "password": "mishka123"
}
```

**Success Response (200):**
```json
{
  "_id": "65abf82e901",
  "name": "Mishka",
  "email": "mishka@example.com",
  "token": "<JWT_TOKEN>"
}
```

**Error Responses:**
- `400` → Invalid credentials
- `404` → User not found

---

### 3. Get Current User Profile
**GET** `/api/auth/me`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Success Response (200):**
```json
{
  "_id": "65abf82e901",
  "name": "Mishka",
  "email": "mishka@example.com",
  "phone": "9876543210",
  "fcmToken": null,
  "createdAt": "2025-01-09T10:30:00.000Z"
}
```

**Error Responses:**
- `401` → Not authorized, invalid token
- `404` → User not found

---

### 4. Update User Profile
**PUT** `/api/auth/profile`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body (all fields optional):**
```json
{
  "name": "New Name",
  "phone": "9876500000",
  "fcmToken": "abcd1234"
}
```

**Success Response (200):**
```json
{
  "_id": "65abf82e901",
  "name": "New Name",
  "email": "mishka@example.com",
  "phone": "9876500000",
  "fcmToken": "abcd1234"
}
```

**Error Responses:**
- `401` → Not authorized
- `400` → Invalid input

---

## 📞 EMERGENCY CONTACTS APIs

### 5. Get All Contacts
**GET** `/api/contacts`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Success Response (200):**
```json
[
  {
    "_id": "9a1b253",
    "name": "Mom",
    "phone": "9999999999"
  },
  {
    "_id": "9a1b254",
    "name": "Dad",
    "phone": "8888888888"
  }
]
```

**Error Responses:**
- `401` → Not authorized

---

### 6. Add New Contact
**POST** `/api/contacts`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "Dad",
  "phone": "8888888888"
}
```

**Success Response (201):**
```json
{
  "_id": "9a1b254",
  "name": "Dad",
  "phone": "8888888888"
}
```

**Error Responses:**
- `401` → Not authorized
- `400` → Invalid input
- `400` → Maximum contacts limit reached

---

### 7. Delete Contact
**DELETE** `/api/contacts/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Success Response (200):**
```json
{
  "message": "Contact removed"
}
```

**Error Responses:**
- `401` → Not authorized
- `404` → Contact not found

---

## 🚨 SOS SYSTEM APIs

### 8. Trigger SOS Alert
**POST** `/api/sos/trigger`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "lat": 19.1133,
  "lng": 72.8691
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "SOS triggered"
}
```

**Side Effects:**
- SMS sent to all emergency contacts
- Socket.io event `sos:alert` emitted to contacts
- SOS log created in database

**Error Responses:**
- `401` → Not authorized
- `400` → Invalid location data

---

### 9. Resolve SOS Alert
**POST** `/api/sos/resolve`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "sosId": "64fa29ab"
}
```

**Success Response (200):**
```json
{
  "message": "SOS resolved"
}
```

**Error Responses:**
- `401` → Not authorized
- `404` → SOS alert not found

---

## 🗺️ SAFE ZONES APIs

### 10. Get All Safe Zones
**GET** `/api/zones`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Success Response (200):**
```json
[
  {
    "_id": "zone123",
    "zoneName": "Home",
    "center": {
      "lat": 19.1123,
      "lng": 72.8810
    },
    "radius": 200
  },
  {
    "_id": "zone124",
    "zoneName": "Office",
    "center": {
      "lat": 19.1200,
      "lng": 72.8900
    },
    "radius": 150
  }
]
```

**Error Responses:**
- `401` → Not authorized

---

### 11. Create Safe Zone
**POST** `/api/zones`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "zoneName": "Home",
  "center": {
    "lat": 19.1123,
    "lng": 72.8810
  },
  "radius": 200
}
```

**Success Response (201):**
```json
{
  "_id": "zone123",
  "zoneName": "Home",
  "center": {
    "lat": 19.1123,
    "lng": 72.8810
  },
  "radius": 200
}
```

**Error Responses:**
- `401` → Not authorized
- `400` → Invalid input

---

### 12. Delete Safe Zone
**DELETE** `/api/zones/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Success Response (200):**
```json
{
  "message": "Zone removed"
}
```

**Error Responses:**
- `401` → Not authorized
- `404` → Zone not found

---

## 🛣️ SAFE ROUTE API

### 13. Get Safe Route
**POST** `/api/routes/safe`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "start": [72.871, 19.114],
  "end": [72.879, 19.119]
}
```

**Note:** Coordinates format is `[longitude, latitude]` (GeoJSON standard)

**Success Response (200):**
```json
{
  "route": {
    "coordinates": [
      [72.8711, 19.1142],
      [72.8732, 19.1151],
      [72.8753, 19.1168],
      [72.8775, 19.1180],
      [72.8790, 19.1190]
    ]
  }
}
```

**Error Responses:**
- `401` → Not authorized
- `400` → Invalid coordinates
- `500` → Mapbox API error

---

## 📝 REPORTS (UNSAFE AREAS) APIs

### 14. Create Unsafe Area Report
**POST** `/api/reports`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "title": "Suspicious Area",
  "description": "Dark street, no lights",
  "location": {
    "lat": 19.1211,
    "lng": 72.8820
  }
}
```

**Success Response (201):**
```json
{
  "_id": "report1",
  "title": "Suspicious Area",
  "description": "Dark street, no lights",
  "location": {
    "lat": 19.1211,
    "lng": 72.8820
  },
  "createdAt": "2025-01-09T10:30:00.000Z"
}
```

**Error Responses:**
- `401` → Not authorized
- `400` → Invalid input

---

### 15. Get Nearby Reports
**GET** `/api/reports/nearby?lat=19.11&lng=72.88`

**Headers:**
```json
{
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

**Query Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in meters (default: 5000)

**Success Response (200):**
```json
[
  {
    "_id": "report1",
    "title": "Suspicious Area",
    "description": "Dark street",
    "location": {
      "lat": 19.1211,
      "lng": 72.8820
    },
    "createdAt": "2025-01-09T10:30:00.000Z"
  },
  {
    "_id": "report2",
    "title": "Poor Lighting",
    "description": "Very dark at night",
    "location": {
      "lat": 19.1150,
      "lng": 72.8850
    },
    "createdAt": "2025-01-08T15:20:00.000Z"
  }
]
```

**Error Responses:**
- `401` → Not authorized
- `400` → Invalid coordinates

---

## 📡 Socket Events Contract

### Socket.io Connection

**Client Setup:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('token')
  }
});
```

---

### 🔥 CLIENT → SERVER Events

#### 1. Join User Room
```javascript
socket.emit('join', userId);
```

**Purpose:** Join personal room to receive SOS alerts

**Parameters:**
- `userId` (string): The user's ID

---

#### 2. Start SOS Live Alert
```javascript
socket.emit('sos:start', {
  userId: '65abf82e901',
  lat: 19.112,
  lng: 72.882
});
```

**Purpose:** Broadcast live SOS alert to contacts and nearby users

**Parameters:**
- `userId` (string): User triggering SOS
- `lat` (number): Latitude
- `lng` (number): Longitude

---

### ⚡ SERVER → CLIENT Events

#### 1. SOS Alert Received
```javascript
socket.on('sos:alert', (data) => {
  console.log('SOS Alert:', data);
  // Show notification to user
});
```

**Data Format:**
```json
{
  "userId": "123",
  "userName": "Mishka",
  "lat": 19.112,
  "lng": 72.882,
  "message": "Someone nearby needs help!",
  "timestamp": "2025-01-09T10:30:00.000Z"
}
```

**Who Receives:**
- All emergency contacts of the user
- All users within 5km radius

---

#### 2. SOS Resolved
```javascript
socket.on('sos:resolve', (data) => {
  console.log('SOS Resolved:', data);
  // Hide alert
});
```

**Data Format:**
```json
{
  "userId": "123",
  "message": "SOS has been resolved"
}
```

---

## 🎨 Required Fields Reference

### Complete field requirements for all API calls:

#### Authentication
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | Min 2 chars |
| email | string | Yes | Valid email format |
| phone | string | Yes | Exactly 10 digits |
| password | string | Yes | Min 6 chars |

#### Emergency Contacts
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| name | string | Yes | Min 2 chars |
| phone | string | Yes | Exactly 10 digits |

#### SOS Alert
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| lat | number | Yes | -90 to 90 |
| lng | number | Yes | -180 to 180 |

#### Reports
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| title | string | Yes | Min 3 chars |
| description | string | Yes | Min 10 chars |
| location.lat | number | Yes | -90 to 90 |
| location.lng | number | Yes | -180 to 180 |

#### Safe Zones
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| zoneName | string | Yes | Min 2 chars |
| center.lat | number | Yes | -90 to 90 |
| center.lng | number | Yes | -180 to 180 |
| radius | number | Yes | 50 to 5000 meters |

#### Safe Routes
| Field | Type | Required | Format |
|-------|------|----------|--------|
| start | array | Yes | [lng, lat] |
| end | array | Yes | [lng, lat] |

---

## 📦 Mock Data for Development

Use these mock responses to build the frontend without connecting to backend:

### Mock Logged-in User
```json
{
  "_id": "user123",
  "name": "Khushi",
  "email": "khushi@example.com",
  "phone": "9999999999",
  "fcmToken": null,
  "createdAt": "2025-01-09T10:30:00.000Z"
}
```

### Mock Contacts
```json
[
  {
    "_id": "c1",
    "name": "Mom",
    "phone": "9999999999"
  },
  {
    "_id": "c2",
    "name": "Dad",
    "phone": "8888888888"
  },
  {
    "_id": "c3",
    "name": "Sister",
    "phone": "7777777777"
  }
]
```

### Mock Safe Zones
```json
[
  {
    "_id": "zone1",
    "zoneName": "Home",
    "center": { "lat": 19.112, "lng": 72.881 },
    "radius": 300
  },
  {
    "_id": "zone2",
    "zoneName": "Office",
    "center": { "lat": 19.120, "lng": 72.890 },
    "radius": 200
  },
  {
    "_id": "zone3",
    "zoneName": "College",
    "center": { "lat": 19.105, "lng": 72.875 },
    "radius": 250
  }
]
```

### Mock Unsafe Area Reports
```json
[
  {
    "_id": "r1",
    "title": "Dark Alley",
    "description": "Very dark area, no street lights",
    "location": { "lat": 19.119, "lng": 72.880 },
    "createdAt": "2025-01-09T10:30:00.000Z"
  },
  {
    "_id": "r2",
    "title": "Suspicious Activity",
    "description": "Reported suspicious people hanging around",
    "location": { "lat": 19.115, "lng": 72.885 },
    "createdAt": "2025-01-08T15:20:00.000Z"
  },
  {
    "_id": "r3",
    "title": "Poor Lighting",
    "description": "Street lights not working",
    "location": { "lat": 19.118, "lng": 72.879 },
    "createdAt": "2025-01-07T20:15:00.000Z"
  }
]
```

### Mock Safe Route Response
```json
{
  "route": {
    "coordinates": [
      [72.8711, 19.1142],
      [72.8732, 19.1151],
      [72.8753, 19.1168],
      [72.8775, 19.1180],
      [72.8790, 19.1190]
    ]
  }
}
```

### Mock SOS Alert (Socket Event)
```json
{
  "userId": "user456",
  "userName": "Mishka",
  "lat": 19.112,
  "lng": 72.882,
  "message": "Someone nearby needs help!",
  "timestamp": "2025-01-09T10:30:00.000Z"
}
```

---

## 🧪 Integration Checklist

### Phase 1: Backend Setup ✅
- [ ] Backend deployed to Render/Railway
- [ ] MongoDB Atlas connected
- [ ] Base URL accessible
- [ ] All routes tested via Postman
- [ ] CORS configured for frontend domain
- [ ] Environment variables set

### Phase 2: Frontend Setup ✅
- [ ] Update axios base URL to backend URL
```javascript
axios.defaults.baseURL = "https://your-backend.onrender.com";
```
- [ ] Add Authorization header interceptor
```javascript
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
- [ ] Socket.io client configured

### Phase 3: Authentication Testing ✅
- [ ] Register new user works
- [ ] Login works
- [ ] Token saved to localStorage
- [ ] Get profile works with token
- [ ] Update profile works
- [ ] Logout clears token

### Phase 4: Contacts Testing ✅
- [ ] Add contact works
- [ ] Get all contacts works
- [ ] Delete contact works
- [ ] Reload page → data persists

### Phase 5: SOS System Testing ✅
- [ ] SOS trigger API works
- [ ] SMS received by contacts (if configured)
- [ ] Socket alert received by contacts
- [ ] SOS resolve works
- [ ] UI shows alert notification

### Phase 6: Map Features Testing ✅
- [ ] Map loads correctly
- [ ] User current location shows
- [ ] Safe zones display on map
- [ ] Unsafe reports display on map
- [ ] Click on markers shows details

### Phase 7: Routes Testing ✅
- [ ] Select start point
- [ ] Select end point
- [ ] Route line displayed on map
- [ ] Route coordinates received

### Phase 8: Socket Events Testing ✅
- [ ] Socket connects successfully
- [ ] Join room works
- [ ] Emit `sos:start` works
- [ ] Receive `sos:alert` works
- [ ] Alert shows in UI

### Phase 9: Deployment ✅
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Backend deployed to Render/Railway
- [ ] HTTPS enabled on both
- [ ] CORS allows frontend domain
- [ ] Socket.io works over HTTPS
- [ ] Environment variables set correctly

### Phase 10: Final Testing ✅
- [ ] End-to-end user flow works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Error messages display correctly

---

## 🔧 Common Issues & Solutions

### Issue 1: CORS Error
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
```javascript
// Backend: Ensure CORS is configured
const cors = require('cors');
app.use(cors({
  origin: 'https://your-frontend-domain.vercel.app',
  credentials: true
}));
```

---

### Issue 2: 401 Unauthorized
**Error:** `Request failed with status code 401`

**Solution:**
- Check if token is saved in localStorage
- Verify token is being sent in Authorization header
- Check if token has expired (login again)

---

### Issue 3: Socket Not Connecting
**Error:** Socket connection fails

**Solution:**
```javascript
// Check socket URL
const socket = io('https://your-backend.onrender.com', {
  auth: { token: localStorage.getItem('token') },
  transports: ['websocket', 'polling']
});

socket.on('connect_error', (error) => {
  console.error('Connection Error:', error);
});
```

---

### Issue 4: Map Not Loading
**Error:** Map tiles not showing

**Solution:**
- Check Mapbox access token is correct
- Verify internet connection
- Check browser console for errors
- Ensure coordinates are valid

---

### Issue 5: Invalid Coordinates
**Error:** `400 Bad Request - Invalid coordinates`

**Solution:**
- Verify coordinate format: `[longitude, latitude]` for routes
- Verify coordinate format: `{ lat, lng }` for zones/reports
- Check latitude range: -90 to 90
- Check longitude range: -180 to 180

---

## 📞 Contact

**Backend Developer:** Mishka  
**Frontend Developer:** Khushi

**Backend Repository:** `https://github.com/mishhkaaa/Abhaya`

---

## 🎯 Quick Start Example

```javascript
// 1. Login
const loginResponse = await axios.post('/api/auth/login', {
  email: 'mishka@example.com',
  password: 'mishka123'
});

// Save token
localStorage.setItem('token', loginResponse.data.token);

// 2. Set up axios interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Get user profile
const profile = await axios.get('/api/auth/me');
console.log(profile.data);

// 4. Connect socket
const socket = io('http://localhost:5000', {
  auth: { token: localStorage.getItem('token') }
});

socket.emit('join', profile.data._id);

socket.on('sos:alert', (data) => {
  alert(`SOS Alert from ${data.userName}!`);
});

// 5. Trigger SOS
await axios.post('/api/sos/trigger', {
  lat: 19.1133,
  lng: 72.8691
});
```

---

**Good luck with integration! 🚀**
