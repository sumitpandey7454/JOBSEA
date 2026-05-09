# JOBSEA 🚀 — Full Stack Job Portal Web Application

<div align="center">

<img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react" />
<img src="https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot" />
<img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql" />
<img src="https://img.shields.io/badge/Auth-Google%20OAuth2-EA4335?style=for-the-badge&logo=google" />
<img src="https://img.shields.io/badge/Deployment-Vercel%20%2B%20Railway-000000?style=for-the-badge&logo=vercel" />

<h3>🌟 Modern Full Stack Job Portal for Indian Job Seekers 🌟</h3>

<p>
JOBSEA is a modern full-stack job portal web application designed for job seekers across India.  
Users can explore and apply for jobs in multiple categories including IT, Education, Sales, and Government sectors.
</p>

🔗 <b>Live Demo:</b>  
👉 https://jobsea-seven.vercel.app/

</div>

---

# 📌 Features

## 🔐 Authentication
- Google OAuth2 Login
- Phone Number OTP Authentication
- JWT-based Authentication System
- Secure Login & User Session Management

---

## 💼 Job Portal Features
- Browse Jobs by Categories
- Search Jobs by Keywords
- Featured Jobs Section
- External Apply Links
- Job Details Page
- Dynamic Job Listings

---

## 🗂️ Job Categories
- 💻 IT Jobs
- 🎓 Education Jobs
- 📈 Sales Jobs
- 🏛️ Government Jobs

---

## 👨‍💼 Admin Features
- Add Job Listings
- Edit Existing Jobs
- Delete Jobs
- Manage User Messages
- Admin Dashboard Panel

---

## 📩 Contact System
- Contact Form Connected to Backend
- Messages Stored in MySQL Database
- Admin Can View Submitted Messages

---

## 🎨 UI/UX Features
- Fully Responsive Design
- Tailwind CSS Modern UI
- Animated Hero Section
- Smooth Transitions & Effects
- Mobile Friendly Layout
- 3D Styled Sections

---

# 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React + Vite | Frontend |
| Tailwind CSS | Styling |
| Java Spring Boot | Backend REST APIs |
| MySQL | Database |
| Google OAuth2 | Authentication |
| JWT | Security |
| Railway | Backend Deployment |
| Vercel | Frontend Deployment |

---

# 🏗️ Project Structure

## Backend Structure (Spring Boot)

```bash
src/main/java/com/jobportal
│
├── config
│   └── SecurityConfig.java
│
├── controller
│   ├── AuthController.java
│   ├── CategoryController.java
│   ├── ContactController.java
│   └── JobController.java
│
├── dto
│
├── entity
│   ├── ContactMessage.java
│   ├── Job.java
│   ├── JobCategory.java
│   ├── OtpStore.java
│   └── User.java
│
├── exception
│   └── GlobalExceptionHandler.java
│
├── repository
│
├── security
│   ├── JwtAuthenticationFilter.java
│   └── JwtUtil.java
│
├── service
│   ├── AuthService.java
│   ├── CategoryService.java
│   └── JobService.java
│
└── JobPortalBackendApplication.java
```

---

## Frontend Structure (React + Vite)

```bash
src
│
├── assets
│
├── components
│   ├── jobs
│   └── layout
│
├── context
│   └── AuthContext.jsx
│
├── pages
│   ├── AdminPage.jsx
│   ├── CategoryPage.jsx
│   ├── HomePage.jsx
│   ├── JobDetailPage.jsx
│   ├── LoginPage.jsx
│   └── SearchPage.jsx
│
├── services
│   └── api.js
│
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

---

# ⚙️ Backend Features (Spring Boot)

- REST API Development
- Layered Architecture
- JWT Authentication
- Google OAuth2 Integration
- MySQL Integration using JPA/Hibernate
- Exception Handling
- Secure API Endpoints
- CORS Configuration
- Environment Variable Support

---

# ⚛️ Frontend Features (React + Vite)

- Component-Based Architecture
- Dynamic Routing
- API Integration
- State Management using Context API
- Responsive UI Design
- Fast Development using Vite

---

# 🔐 Authentication Flow

## Google OAuth2 Login

1. User clicks on **Login with Google**
2. Google Authentication Popup Opens
3. User Selects Google Account
4. Google Verifies User
5. Backend Generates JWT Token
6. User Successfully Logged In

---

## Phone OTP Login

1. User Enters Phone Number
2. OTP Sent to User
3. User Verifies OTP
4. Authentication Successful

---

# 🚀 Deployment

## Frontend Deployment
- Hosted on **Vercel**
- Connected with GitHub for Auto Deployment

🔗 Live Frontend:  
https://jobsea-seven.vercel.app/

---

## Backend Deployment
- Hosted on **Railway**
- Spring Boot Backend + MySQL Database Deployed on Cloud

---

# 🗄️ Database Design

## User Table

| Field | Description |
|---|---|
| id | User ID |
| name | User Name |
| email | User Email |
| phone | User Phone Number |
| role | User Role |

---

## Job Table

| Field | Description |
|---|---|
| id | Job ID |
| title | Job Title |
| company | Company Name |
| category | Job Category |
| description | Job Description |
| apply_link | Apply URL |

---

## Contact Message Table

| Field | Description |
|---|---|
| id | Message ID |
| name | User Name |
| email | User Email |
| message | Contact Message |

---

# 🔍 Search Functionality

Users can:
- Search Jobs by Keywords
- Browse Category-wise Jobs
- Explore Featured Jobs
- Open External Apply Links

---

# 📱 Responsive Design

JOBSEA is optimized for:

- 💻 Desktop
- 📱 Mobile
- 📲 Tablets

---

# ⚡ Performance Optimizations

- Fast Build System using Vite
- Optimized React Rendering
- Efficient API Calls
- Lightweight Components
- Clean Backend Architecture

---

# 🧠 What I Learned From This Project

- Full Stack Development
- Spring Boot REST APIs
- React Frontend Development
- JWT Authentication
- Google OAuth2 Integration
- MySQL Database Design
- Frontend & Backend Integration
- Cloud Deployment
- Production Debugging
- Secure Authentication Systems

---

# 📸 Future Improvements

- Resume Upload Feature
- AI-based Job Recommendations
- Saved Jobs Feature
- Admin Analytics Dashboard
- Email Notifications
- User Profiles
- Company Profiles
- Job Application Tracking

---

# 🧪 How To Run Locally

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/JOBSEA.git
```

---

## 2️⃣ Setup Backend

### Create MySQL Database

```sql
CREATE DATABASE jobportal;
```

### Configure application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jobportal
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### Run Spring Boot Backend

```bash
cd backend
mvn spring-boot:run
```

Backend Runs On:

```bash
http://localhost:8080
```

---

## 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend Runs On:

```bash
http://localhost:5173
```

---

# 🌐 Live Project

🚀 Visit JOBSEA Live:

👉 https://jobsea-seven.vercel.app/

---

# 👨‍💻 Developer

## Sumit Pandey

📧 Email:  
sumitpandey7454@gmail.com

🌐 Live Website:  
https://jobsea-seven.vercel.app/

---

# ⭐ Support

If you like this project, please consider:

⭐ Starring the Repository  
🍴 Forking the Project  
📢 Sharing with Others

---

<div align="center">

<h3>✨ Thank You For Visiting JOBSEA ✨</h3>

<p>
Built with ❤️ using React, Spring Boot & MySQL
</p>

</div>
