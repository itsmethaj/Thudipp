# 🩸 Thudipp

**Thudipp** is a blood donor management platform built to explore how technology can simplify donor discovery and emergency blood request coordination within an educational institution or community.

The project focuses on donor management, privacy-conscious communication, role-based access control, and efficient donor search workflows.

> ⚠️ **Disclaimer**
>
> Thudipp is currently a prototype/demo project. The donor records and information available in the system are intended for testing and demonstration purposes only and should not be considered an official or verified blood donor registry.

---

## ✨ Features

### Public Features

* Search donors by blood group
* Filter donors by course and year
* View donor availability status
* Privacy-focused donor information display
* Contact authorized coordinators instead of exposing donor details

### Admin Features

* Add donor records
* Edit donor information
* Archive donor records
* View and manage donor database
* Create volunteer accounts
* Assign volunteer permissions
* Monitor activity logs
* Export donor data as PDF

### Volunteer Features

* Permission-based dashboard
* View donor records
* Edit donor records (if authorized)
* Add donors (if authorized)
* Access only assigned features

---

## 🔒 Privacy First

Thudipp is designed with privacy in mind.

* Donor phone numbers are not publicly visible.
* Personal donor information can be restricted through permissions.
* Authorized coordinators act as intermediaries between donors and recipients.
* Role-based access control ensures limited access to sensitive information.

---

## 🛠 Tech Stack

### Frontend

* React
* React Router
* Tailwind CSS
* Recharts
* Lucide React

### Backend & Database

* Supabase
* PostgreSQL

### Deployment

* Netlify

---

## 📊 Modules

### Donor Management

Manage donor information including:

* Name
* Admission Number
* Blood Group
* Course
* Year Joined
* Availability Status

### Volunteer Management

Create volunteer accounts with custom permissions:

* View donor details
* Add donors
* Edit donors
* Archive donors
* View analytics
* Handle donor contact requests

### Activity Logging

Tracks important actions such as:

* Donor creation
* Donor updates
* Volunteer creation
* Volunteer blocking/unblocking
* PDF exports

---

## 🚀 Future Plans

* Real donor registration system
* Authentication with Supabase Auth
* Blood request management
* Emergency request notifications
* Email and SMS integration
* Advanced analytics dashboard
* Mobile application
* Multi-college support

---

## 📷 Screenshots

### Home Page

*Add screenshot here*

### Donor Search

*Add screenshot here*

### Admin Dashboard

*Add screenshot here*

### Volunteer Dashboard

*Add screenshot here*

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/itsmethaj/Thudipp.git
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## 👨‍💻 Developer

Developed as a learning and demonstration project to explore modern web development, donor management systems, and privacy-focused application design.

---

## ❤️ Thudipp

**Donate Blood. Save Lives.**
