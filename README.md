# AI-Driven Bus Fare Management System
## Code Rush 2025 - AIML Department

### Problem Statement
College bus transportation fees have become a significant financial burden for students. This system aims to:
- Develop an AI-driven Bus Fare Management System
- Calculate fair and optimized bus fees based on real operational data
- Maintain digital logs for vehicle maintenance, fuel consumption, and driver performance
- Provide transparency for students and administrators regarding cost breakdowns
- Reduce manual workload and human bias in fare determination

### Features

#### Student Authentication
- **Login System**: Secure student login with roll number and password
- **Registration**: New student registration with department and year details
- **Session Management**: Persistent login sessions using localStorage

#### Dashboard
- **Overview**: Quick stats showing pass status, current fare, route, and semester
- **Announcements**: Important updates and notifications
- **User Profile**: Complete student information display

#### Bus Pass Management
- **Active Pass Display**: View current bus pass details
- **Pass Information**: Semester, route, fee, and status
- **Application**: Apply for new bus pass

#### Bus Routes
- **Route A - Main Campus**: 15 km, 8 stops, ₹2,500/semester
- **Route B - East Side**: 12 km, 6 stops, ₹2,200/semester
- **Route C - West Side**: 18 km, 10 stops, ₹2,800/semester
- **Route D - North Campus**: 10 km, 5 stops, ₹2,000/semester

#### Fare Calculator
- **AI-Based Calculation**: Calculate optimized fares based on:
  - Route distance
  - Fuel prices (dynamic)
  - Working days per semester
  - Maintenance costs (15% of fuel)
  - Driver salary allocation
  - Administrative costs
- **Transparent Breakdown**: Detailed cost distribution

#### Maintenance Logs
- **Digital Records**: Complete maintenance history
- **Transparency**: View all vehicle service records
- **Cost Tracking**: Monitor maintenance expenses

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Storage**: LocalStorage for data persistence
- **Design**: Responsive, modern UI with gradient themes
- **Animation**: Smooth transitions and hover effects

### Setup Instructions

1. **Extract Files**: Ensure all files are in the same directory
   - index.html (Login page)
   - dashboard.html (Dashboard page)
   - styles.css (Login styles)
   - dashboard.css (Dashboard styles)
   - script.js (Login logic)
   - dashboard.js (Dashboard logic)

2. **Open Application**: Open `index.html` in a web browser

3. **Demo Account**:
   - Roll Number: `21A91A6701`
   - Password: `demo123`

### File Structure
```
bus/
├── index.html           # Login and registration page
├── dashboard.html       # Main dashboard page
├── styles.css          # Login page styles
├── dashboard.css       # Dashboard page styles
├── script.js           # Login functionality
├── dashboard.js        # Dashboard functionality
└── README.md          # This file
```

### Usage Guide

#### For New Students:
1. Click on "Register" tab
2. Fill in all required details
3. Create a password (minimum 6 characters)
4. Submit registration
5. Login with your credentials

#### For Existing Students:
1. Enter roll number and password
2. Click "Login"
3. Access your dashboard

#### Dashboard Navigation:
- **Overview**: View quick statistics and announcements
- **My Bus Pass**: Check active bus pass details
- **Bus Routes**: Browse available routes and details
- **Fare Calculator**: Calculate semester fees with custom parameters
- **Maintenance Logs**: View vehicle maintenance records
- **My Profile**: See personal information

### Key Features Implementation

#### 1. Authentication System
- Secure login with validation
- Password strength checking (minimum 6 characters)
- Duplicate registration prevention
- Session persistence

#### 2. AI-Based Fare Calculation
```javascript
Formula: Total Fare = Fuel Cost + Maintenance + Driver Salary + Admin Cost
- Fuel Cost = (Distance * 2 * Days * Fuel Price) / Fuel Efficiency
- Maintenance = 15% of Fuel Cost
- Driver Salary = ₹300 per student
- Admin Cost = ₹200 per student
```

#### 3. Data Storage
- All data stored in browser's localStorage
- Persistent across sessions
- No backend required for demo

### Future Enhancements
- Real-time GPS tracking
- Mobile app integration
- Payment gateway integration
- Advanced AI algorithms for dynamic pricing
- Predictive maintenance alerts
- Student attendance tracking
- Route optimization algorithms

### Event Details
- **Date**: November 1, 2025
- **Time**: 10:55 AM - 4:15 PM
- **Venue**: 2nd & 3rd Year AIML Classrooms
- **Department**: CSE (AIML)

### Evaluation Criteria
- ✅ Relevance to the theme/problem
- ✅ Creativity & innovation
- ✅ Feasibility of the idea
- ✅ Prototype development
- ✅ Cost transparency
- ✅ User-friendly interface

### Team Information
This solution demonstrates:
- Problem understanding
- Technical implementation
- User experience design
- Scalability considerations
- Real-world applicability

### Support
For any issues or questions during the hackathon, please contact the event coordinators.

---
**Code Rush 2025** | Department of CSE (AIML) | Autonomous Institution
