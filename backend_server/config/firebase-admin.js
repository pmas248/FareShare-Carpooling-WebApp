const admin = require('firebase-admin');

let serviceAccount;

if (process.env.NODE_ENV === 'test') {
  // 🔐 Don't initialize Firebase in test mode
  console.log('Skipping Firebase initialization in test mode');
} else {
  try {
    serviceAccount = require('../firebaseserviceaccount.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (err) {
    console.warn('Firebase service account not found. Skipping init.');
  }
}

module.exports = admin;
