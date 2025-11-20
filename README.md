
# CS732 project - Team Think Tank

Welcome to the CS732 project. We look forward to seeing the amazing things you create this semester! This is your team's repository.

Your team members are:
- Ketan Ketan _(kket819@aucklanduni.ac.nz)_
- Rohit Kandan _(rkan980@aucklanduni.ac.nz)_
- Trupti Vijay Ahire _(tahi709@aucklanduni.ac.nz)_
- Purvesh Masurkar _(pmas248@aucklanduni.ac.nz)_
- Carol Richa D souza Carol Richa D souza _(ccar875@aucklanduni.ac.nz)_
- Gautham Basker Anand Maharajan _(gana081@aucklanduni.ac.nz)_

You have complete control over how you run this repo. All your members will have admin access. The only thing setup by default is branch protections on `main`, requiring a PR with at least one code reviewer to modify `main` rather than direct pushes.

Please use good version control practices, such as feature branching, both to make it easier for markers to see your group's history and to lower the chances of you tripping over each other during development

![](./Think%20Tank.png)
=======
# FareShare
## A community-driven carpooling app

A webapp application built with the MERNN (MongoDB, Express, React, Node.js, React Native) stack. It enables users to share rides, either as drivers offering seats or as passengers booking a seat in an existing ride. FareShare integrates Firebase Authentication for secure user sign-in and OTP-based ride verification to ensure passenger safety.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)

   * [Cloning the repository to local](#cloning-the-repository-to-local)
   * [Backend](#backend)
   * [Frontend](#frontend)
6. [Folder Structure](#folder-structure)
7. [Usage](#usage)
8. [Web Application](#web-application)
9. [License](#license)

---

## Features

* **User Authentication**: Sign up and log in with email/password via Firebase Auth
* **Driver Registration**: Submit driver details (license number, car name, available seats)
* **Ride Hosting**: Drivers create rides with origin, destination, date/time, cost, and seat count
* **Ride Search & Booking**: Passengers search available rides, book seats, and receive a unique OTP
* **OTP Verification**: Drivers start rides by validating each passenger’s OTP via a modal
* **Ride Status & Mapping**: View ongoing rides on a map (Mapbox integration) with real-time status
* **Profile Management**: Update personal and driver information in-app
* **Group Rides**: Create and join carpool groups to share recurring journeys

---

## Tech Stack

* **Backend**: Node.js, Express.js, Mongoose (MongoDB)
* **Authentication**: Firebase Authentication
* **Mobile Frontend**: React Native (Expo), Expo Router
* **Mapping**: Mapbox GL JS for React Native web view
* **Database**: MongoDB Atlas or local MongoDB

---

## Prerequisites

* **Node.js** (v14+)
* **npm** (v6+)
* **MongoDB** instance or MongoDB Atlas cluster
* **Firebase** project with Web configuration and service account JSON

---

## Installation

### Cloning the repository to local

1. Clone the repository from VScode or any terminal and navigate inside the directory.

   ```bash
   git clone https://github.com/UOA-CS732-S1-2025/group-project-think-tank.git
   cd group-project-think-tank
   git checkout localhost-deployment
   ```
   
### Backend

1. Navigate to the backend folder:

   ```bash
   cd backend_server
   ```
2. Create the .env file using the Private API keys (folder submitted for private API keys), and copy the firebaseserviceaccount.json file into the backend_server root directory. These files are required for the backend to run properly.
   
   ```bash
   touch .env
   # Open and edit .env to set environment variables like PORT, MONGO_URI, etc. (Copy the contents from Private API keys/backend_server/.env)
   cp path/to/firebaseserviceaccount.json . (Copy the entire firebaseserviceaccount.json from Private API keys/backend_server/firebaseserviceaccount.json)
   
   ```   
3. Install dependencies:

   ```bash
   npm install
   ```
4. Start the server:

   ```bash
   npm start
   ```

### Frontend

1. Navigate to the frontend folder:

   ```bash
   cd ../frontend_reactNative
   ```
   
2. Create the `.env` file from the Private API keys (for frontend):

   ```bash
   touch .env
   # Open and edit .env to set environment variables like PORT, MONGO_URI, etc. (Copy the contents from Private API keys/frontend_reactNative/.env)
   ```
   
3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the Expo app:

   ```bash
   npm start
   ```

5. Open the URL or open the App in the emulator (Scan the QR code after installing Expo Go for mobile app).

   ```bash
   http://localhost:8081
   ```

---

## Folder Structure

```
├── README.md                      # Project documentation
├── Think Tank.png                 # Project logo/image
├── docker-compose.yml            # Docker configuration for fullstack setup
├── package.json                  # Root-level metadata (unused, can be removed if not needed)
├── package-lock.json
├── backend_server/               # Backend Express server
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js                 # Entry point
│   ├── config/                   # Configuration (DB, Firebase, etc.)
│   ├── controllers/             # Route logic handlers
│   ├── middlewares/            # Auth middleware, etc.
│   ├── models/                  # Mongoose models
│   └── routes/                  # Express route definitions
│
├── frontend_reactNative/        # Expo + React Native frontend
│   ├── Dockerfile
│   ├── app.json                 # Expo project config
│   ├── babel.config.js
│   ├── tsconfig.json
│   ├── package.json
│   ├── app/                     # expo-router screens
│   │   ├── _layout.jsx
│   │   ├── index.jsx
│   │   ├── (tabs)/             # Main app screens after login
│   │   │   ├── index.jsx
│   │   │   ├── ride.jsx
│   │   │   └── profile.jsx
│   │   ├── (no_tabs)/          # Screens without bottom tabs
│   │   │   ├── login.jsx
│   │   │   ├── register.jsx
│   │   │   ├── host.jsx
│   │   │   ├── mapview.jsx
│   │   │   ├── past_ride.jsx
│   │   │   ├── ride_status.jsx
│   │   │   ├── groups/[groupID].jsx
│   │   │   └── rides/[rideID].jsx
│   │   └── +not-found.jsx
│   │
│   ├── assets/                  # Images, fonts
│   │   └── images/fareshare/
│   │       └── [logo, backgrounds, icons]
│   │
│   ├── components/              # Reusable UI components
│   ├── constants/               # Static constants (like CDN_URL)
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API calls, firebaseConfig.js
│   ├── styles/                 # Tailwind-style CSS/JS styles
│   └── utils/                   # Location services, helpers
│
└── android/                     # Native Android files (generated by Expo)

```
## FareShare PPT:
https://docs.google.com/presentation/d/14kh_Y-OsH950C8boempDGVfEctJHbpGlFCFZLlChFqs/edit?usp=sharing

## FareShare Walkthrough Video:
https://drive.google.com/file/d/1_Nau5MsH6Q5-XqVfo9MJNOYw85OYfrDq/view?usp=drive_link

---



---

## Usage

1. **Sign Up / Sign In**: Create an account or log in.
2. **Driver Setup**: In your profile, enable `licenseValidated` and enter license/car details.
3. **Host a Ride**: Go to "Host" tab, fill out ride info and submit.
4. **Search Rides**: On the home screen, filter by origin, destination, seats, date.
5. **Book Seat**: Tap a ride, confirm booking to receive your OTP.
6. **Start Ride**: As a driver, tap "Start Ride", validate each passenger OTP.
7. **Ongoing Ride**: Switch to map view to track route and status.
8. **Manage Groups**: Notify people of a new ride.
9. **Rate your driver**: Make host accountable and promotes friendly behaviour. 

---
## Web Application

Our FareShare web application is hosted entirely using AWS Free Tier services. Both the frontend and backend are containerized with Docker and deployed on a t2.micro EC2 instance. The application is served via AWS CloudFront CDN and secured (HTTPS) using its default SSL certificate.

Check out the live site here: [FareShare Website](https://d2aq4tfj8omjdo.cloudfront.net/)

---
## License

This project was done for the COMPSCI 732 course taught by Andrew Meads at the University of Auckland. This project was completed as a group assignment for the course, and as such all assets and code created in this project are under the universities licensing.

