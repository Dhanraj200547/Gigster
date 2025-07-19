
# Gigster - Student-Employer Job Portal

Gigster is a **full-stack job portal** built using **React + Firebase** that connects students with employers offering part-time gigs, internships, or short-term jobs. The platform supports two user roles: **Students** and **Employers**, with complete real-time functionality, application management, and intuitive dashboards for each.

---

##  Demo

> Screenshots, GIFs, or demo link (coming soon)

---

##  Tech Stack

| Frontend       | Backend / DB      | Auth            | Styling        |
|----------------|-------------------|------------------|----------------|
| React          | Firebase Firestore | Firebase Auth    | Tailwind CSS   |
| React Router   | Firestore Security Rules |               | Toastify (for alerts) |

---

##  Features

### 👥 Authentication
- Firebase Authentication (Email/Password)
- Role-based login: **Student** / **Employer**
- Persistent login (user stays logged in until logout)

###  Student Dashboard
- View all available jobs
- Search by title or location
- Real-time application status updates
- Bookmark favorite jobs
- Apply once per job
- Withdraw application
- View **My Applications** separately
- Job detail view

###  Employer Dashboard
- Post new jobs with details
- Edit or delete posted jobs
- View list of applicants per job
- Accept / Reject applications
- Real-time application status updates to students

###  Notifications
- Toast alerts for all major actions (apply, withdraw, bookmark, errors)

---

##  Firestore Data Structure

```

users/
└── userId
└── { name, email, role }

jobs/
└── jobId
└── { title, description, salary, location, postedBy }

applications/
└── applicationId
└── { jobId, studentId, status, appliedAt }

````

---

##  Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/gigster.git
cd gigster
````

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Firebase

* Create a Firebase project
* Enable **Authentication** (Email/Password)
* Create **Firestore** database
* Copy your Firebase config to `src/firebase.js`

```js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 4. Run the app

```bash
npm run dev
```

> App will run at `http://localhost:5173` (if using Vite)

---

##  Folder Structure

```
/src
  /pages
    - Login.jsx
    - Signup.jsx
    - DashboardStudent.jsx
    - DashboardEmployer.jsx
  /components
    - Navbar.jsx
    - ProtectedRoute.jsx
  firebase.js
  App.jsx
  main.jsx
```

---

##  TODO / Future Upgrades

* [x] Persistent login
* [x] Withdraw application feature
* [x] My Applications page
* [x] Real-time Firestore updates
* [x] Edit/Delete job posts
* [x] Toastify alerts
* [ ] Resume upload for students
* [ ] Email notifications
* [ ] Admin panel
* [ ] Chat system between employers & selected students

---

##  Author

Made with [Odeti Dhanraj](https://github.com/Dhanraj200547/Gigster)

Feel free to ⭐ this repo if it helped you or inspired your own project!

---

