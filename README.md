# 🛡️ Abhaya - Women Safety Platform

A comprehensive MERN stack web application designed to enhance women's safety through real-time alerts, emergency contacts, safe zone mapping, and community danger reporting.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Integration](https://img.shields.io/badge/Integration-Complete-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Features

### 🚨 **Emergency SOS System**
- One-tap SOS activation
- Automatic SMS alerts to emergency contacts
- Real-time location sharing via Google Maps
- Socket.IO for instant notifications

### 👥 **Emergency Contacts Management**
- Add/remove trusted contacts
- Phone number validation
- Quick access during emergencies

### 🗺️ **Safe Zones Mapping**
- Create personalized safe zones
- Adjustable radius (500m - 5000m)
- Visual zone representation on interactive map
- Real-time user location tracking

### ⚠️ **Community Danger Reporting**
- Report unsafe locations
- Multiple categories (harassment, theft, poor lighting, etc.)
- Severity levels
- Community-wide visibility
- Interactive danger map

### 🔔 **Real-Time Alerts**
- Live SOS notifications
- Socket.IO integration
- Multi-device synchronization
- Instant emergency response

---

## 🛠️ Tech Stack

### **Backend**
- **Node.js** + **Express** - REST API
- **MongoDB** + **Mongoose** - Database
- **Socket.IO** - Real-time communication
- **Twilio** - SMS notifications
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Winston** - Logging

### **Frontend**
- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router v6** - Navigation
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time features
- **Tailwind CSS** - Styling
- **Leaflet** - Interactive maps
- **Vite** - Build tool

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js v18+
- MongoDB
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone <repository-url>
cd Abhaya
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

4. **Access Application**
```
Frontend: http://localhost:5173
Backend: http://localhost:5000
```

📖 **Detailed Setup:** See [QUICKSTART.md](QUICKSTART.md)

---

## 📁 Project Structure

```
Abhaya/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   └── logs/              # Application logs
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   ├── redux/         # Redux store & slices
│   │   ├── services/      # Frontend services
│   │   └── styles/        # CSS styles
│   └── public/            # Static assets
│
└── docs/                  # Documentation
```

---

## 🔌 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### **Contacts**
- `GET /api/contacts` - Get all contacts
- `POST /api/contacts` - Add contact
- `DELETE /api/contacts/:id` - Delete contact

### **SOS**
- `POST /api/sos/trigger` - Trigger SOS alert
- `POST /api/sos/resolve` - Resolve SOS
- `GET /api/sos/logs` - Get SOS history

### **Safe Zones**
- `GET /api/zones` - Get all zones
- `POST /api/zones` - Create zone
- `DELETE /api/zones/:id` - Delete zone

### **Reports**
- `GET /api/reports` - Get user reports
- `GET /api/reports/nearby` - Get nearby reports
- `POST /api/reports` - Create report
- `DELETE /api/reports/:id` - Delete report

📖 **Full API Docs:** See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

---

## 🎨 UI Screenshots

The application features a modern **glassmorphic** design with:
- Purple-pink gradient theme (#C471ED to #F64F59)
- Smooth animations and transitions
- Responsive mobile-first design
- Neumorphic shadows
- Interactive maps with custom markers

---

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration
- Helmet.js security headers
- Rate limiting ready

---

## 📱 Key Pages

- **Login/Register** - User authentication
- **Dashboard** - Overview with live map
- **SOS** - Emergency alert system
- **Contacts** - Emergency contacts management
- **Safe Zones** - Create and manage safe areas
- **Reports** - Community danger reports
- **Profile** - User account management

---

## 🧪 Testing

### **Run Backend Tests**
```bash
cd backend
npm test
```

### **Run Frontend Tests**
```bash
cd frontend
npm test
```

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] Add/delete emergency contacts
- [ ] Create/delete safe zones
- [ ] Add/delete danger reports
- [ ] Trigger SOS alert
- [ ] Verify SMS notifications
- [ ] Test real-time Socket.IO alerts

---

## 🚀 Deployment

### **Backend Deployment** (Render/Railway)
1. Create account on hosting platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy backend service

### **Frontend Deployment** (Vercel/Netlify)
1. Create account on hosting platform
2. Import project from GitHub
3. Set build command: `npm run build`
4. Set environment variables
5. Deploy frontend

📖 **Deployment Guide:** See [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Environment Variables

### **Backend**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TWILIO_SID=your_twilio_sid
TWILIO_AUTH=your_twilio_auth_token
TWILIO_NUMBER=your_twilio_phone_number
```

### **Frontend**
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
- [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) - Integration details
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Complete project overview
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - API documentation

---

## 🐛 Known Issues

- SMS functionality requires valid Twilio credentials
- Geo-spatial queries for nearby reports to be optimized
- Push notifications (FCM) integration pending

---

## 🎯 Roadmap

- [ ] Mobile application (React Native)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Google OAuth integration
- [ ] Advanced analytics dashboard
- [ ] AI-powered threat detection
- [ ] Multi-language support
- [ ] Voice-activated SOS

---

## 👥 Authors

- **Backend Developer** - Complete REST API, Database, Socket.IO, SMS Integration
- **Frontend Developer** - Complete UI/UX, React Components, State Management

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet for map library
- Twilio for SMS service
- MongoDB Atlas for database hosting
- All contributors and supporters

---

## 📞 Support

For issues, questions, or suggestions:
- Create an issue in GitHub repository
- Email: support@abhaya.com (if available)

---

## ⚡ Status

**Current Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** December 18, 2025  
**Integration:** 100% Complete

---

**Built with ❤️ for Women's Safety**

*Making the world a safer place, one alert at a time.*
