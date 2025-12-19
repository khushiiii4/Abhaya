# 🚀 Abhaya - Quick Start Guide

Get the Abhaya women's safety application running in 5 minutes!

---

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- Git

---

## ⚡ Quick Setup

### **1. Clone & Install**

```bash
# Navigate to project
cd Abhaya

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### **2. Configure Environment**

**Backend (.env):**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Required variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/abhaya
JWT_SECRET=your_secret_key_here
```

Optional (for SMS):
```env
TWILIO_SID=your_twilio_sid
TWILIO_AUTH=your_twilio_auth_token
TWILIO_NUMBER=your_twilio_phone_number
```

**Frontend (.env):**
```bash
cd ../frontend
cp .env.example .env
```

Content:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### **3. Start MongoDB**

```bash
# If using local MongoDB
mongod

# Or ensure your MongoDB service is running
```

### **4. Run the Application**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
➜ Local: http://localhost:5173
```

### **5. Open Application**

Visit: `http://localhost:5173`

---

## ✅ Quick Test

1. **Register** a new user
2. **Add** an emergency contact
3. **Create** a safe zone on the map
4. **Add** a danger report
5. Check browser console for Socket.IO connection: `✅ Socket connected`

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
ps aux | grep mongod

# Check port 5000 is free
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### Frontend can't connect
```bash
# Verify backend is running
curl http://localhost:5000

# Check .env file exists
ls -la .env  # macOS/Linux
dir .env  # Windows
```

### Database errors
```bash
# Check MongoDB connection
mongosh
> use abhaya
> db.users.find()
```

---

## 📚 Full Documentation

- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - Complete integration details
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Full project documentation
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - API documentation

---

## 🎯 Features Ready to Test

- ✅ User authentication (register/login)
- ✅ Emergency contacts management
- ✅ Safe zones creation & visualization
- ✅ Danger reports (community safety)
- ✅ Real-time SOS alerts (Socket.IO)
- ✅ SMS notifications (if Twilio configured)
- ✅ Interactive maps with Leaflet
- ✅ Beautiful glassmorphic UI

---

## 🚨 SOS Testing

To test SOS functionality:

1. **Add contacts** first (at least one)
2. Navigate to **SOS page** or use the button in navigation
3. **Click SOS** and confirm
4. Check:
   - Browser receives Socket.IO alert
   - SMS sent (if Twilio configured)
   - Log created in database

---

## 💡 Tips

- Use Redux DevTools to inspect state
- Check Network tab for API calls
- Monitor backend logs for errors
- Use MongoDB Compass to view data

---

## 🎉 You're Ready!

The application is fully integrated and ready to use. Start by registering a user and exploring the features!

**Need help?** Check [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) for detailed troubleshooting.
