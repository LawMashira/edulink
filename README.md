# ZimEduLink - Zimbabwean School Management System

A modern, responsive school management system built with React, TypeScript, and Tailwind CSS. Designed specifically for high schools in Zimbabwe with role-based access for Admins, Teachers, Parents, and Students.

## 🚀 Features

### User Roles & Dashboards
- **Super Admin**: System-wide management, analytics, and support
- **School Admin**: School setup, class management, teacher assignments, fee structures
- **Teacher**: Class management, attendance marking, grade entry, homework assignment
- **Parent**: Child monitoring, results viewing, fee tracking, attendance monitoring
- **Student**: Personal results, attendance tracking, homework access, notices

### Core Modules
- **Authentication System**: Role-based login with secure session management
- **School Setup**: Complete school configuration and management
- **Attendance Management**: Daily attendance tracking with automated alerts
- **Fee Management**: Comprehensive fee tracking, payment recording, and reporting
- **Results Management**: Grade entry, report card generation, performance analytics
- **Communication**: Notice board, announcements, and school-wide messaging

### Design Features
- **Mobile-First**: Responsive design optimized for mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS
- **WhatsApp Integration**: Ready for WhatsApp notifications and communication
- **Accessibility**: WCAG compliant design for inclusive access

## 🛠️ Technology Stack

- **Frontend**: React 19.2.0 with TypeScript
- **Styling**: Tailwind CSS 4.1.16
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Accounts

The system includes pre-configured demo accounts for testing different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| Super Admin | admin@zimeedulink.com | password | System-wide management |
| School Admin | headmaster@school1.co.zw | password | School management |
| Teacher | teacher1@school1.co.zw | password | Class and student management |
| Parent | parent1@email.com | password | Child monitoring |
| Student | student1@school1.co.zw | password | Personal dashboard |

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Auth/                 # Authentication components
│   ├── Dashboard/            # Role-specific dashboards
│   ├── Layout/               # Layout components (Header, Sidebar)
│   ├── Attendance/           # Attendance management
│   ├── Fees/                 # Fee management
│   └── Results/              # Results and grading
├── context/                  # React Context providers
├── data/                     # Mock data and types
├── types/                    # TypeScript type definitions
└── App.tsx                   # Main application component
```

## 🎯 Key Features Implemented

### ✅ Completed Features
- [x] Role-based authentication system
- [x] Responsive dashboard layouts for all user roles
- [x] Attendance management with status tracking
- [x] Fee management with payment recording
- [x] Results management with grade calculation
- [x] Notice board and communication system
- [x] Mobile-responsive design
- [x] Modern UI with Tailwind CSS

### 🔄 Future Enhancements (Commented for Development)
- [ ] AI Learning Modules
  - AI Tutor Chat interface
  - Personalized learning recommendations
  - Weak subject identification
- [ ] Marketplace Integration
  - School materials marketplace
  - Digital learning content store
  - Resource sharing platform
- [ ] Advanced Analytics
  - Performance trend analysis
  - Predictive attendance modeling
  - Financial forecasting

## 📱 Mobile Optimization

The system is designed with mobile-first principles:
- Responsive grid layouts
- Touch-friendly interface elements
- Optimized navigation for small screens
- WhatsApp integration ready
- Offline capability considerations

## 🌍 Zimbabwe-Specific Features

- Local currency support (ZWL)
- Zimbabwean school term structure
- Local contact number formats
- Cultural considerations in UI/UX
- Mobile money integration ready

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Testing
```bash
npm test
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Email: support@zimeedulink.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

## 🔮 Roadmap

- [ ] Backend API integration
- [ ] Database implementation
- [ ] Real-time notifications
- [ ] Advanced reporting
- [ ] Multi-language support
- [ ] Integration with Zimbabwean education systems

---

**ZimEduLink** - Empowering Zimbabwean Education through Technology 🇿🇼
# edulink
