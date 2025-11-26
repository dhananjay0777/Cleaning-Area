# CleanCity – Smart Municipal Reporting Portal

**CleanCity** is a modern web application that empowers citizens to report cleanliness issues directly to their municipality — quickly, visually, and transparently. With an elegant UI, smooth animations, image-based reporting, and an intuitive admin dashboard, CleanCity makes community cleanliness collaborative and efficient.

This project demonstrates a fully functional front-end reporting system using **LocalStorage** as a lightweight database. It includes a citizen panel, an admin panel, status verification, and real-time issue feeds.

---

## ✨ Key Features

### 👤 Dual User System
* **Citizen Login:** Register & submit public cleanliness reports.
* **Admin Mode:** Special login enables the official admin dashboard with verification tools.

### 📝 Smart Report Submission
Citizens can submit a new report with:
* Issue Title
* Exact Location
* Photo Evidence (image preview uploaded instantly)
* Auto-generated timestamps
* *All data is saved into LocalStorage and displayed immediately in the community feed.*

### 🖼️ Rich Community Feed
* Clean, card-based layout
* User identity tags & Location data
* **Live status badge:** 🔴 Pending / 🟢 Resolved
* Auto-sorted (newest first)

### 👮 Admin Verification Panel
Admins possess exclusive controls to:
* Mark a report as **Solved**
* Re-open a report as **Pending**
* View all community reports via an optimized interface (citizen-only features hidden)

### 🎛️ Intuitive UI / UX
* Smooth transitions & animations
* Sticky tab controls
* Mobile-friendly & responsive
* Modern color palette (Indigo & Slate theme)
* Toast notifications for all actions

### 💾 Offline-Ready Storage
The entire app works using **LocalStorage** (No server needed):
* Registered users
* User sessions
* Reports database
* Admin status updates

---

## 🧠 How It Works (User Flow)



1.  **Register / Login**
    * New citizens can register with email + password.
    * Returning users log in normally.
    * **Admin** logs in with special credentials (see below).

2.  **Citizen Dashboard**
    * Citizens can Submit new reports, Upload photos, and view “Community Reports” and “My Reports”.

3.  **Admin Dashboard**
    * Admins cannot submit reports (form hidden).
    * Can view all reports and toggle status between **Pending** and **Solved**.

4.  **Report Lifecycle**
    * Citizen submits a report -> Report appears instantly in the community feed -> Admin verifies & marks it “Solved” -> Status updates for all users.

---

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3 (Custom UI theme), Vanilla JavaScript
* **Database:** LocalStorage (acts as a mini NoSQL)
* **Key APIs:** FileReader API (for image uploads), Toast message system, Smooth CSS animations

---

