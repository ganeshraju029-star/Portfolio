/**
 * Firebase Configuration and Admin SDK Setup
 * Enterprise-grade Firebase initialization
 */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// Initialize Firebase Admin SDK
const serviceAccount = require('../../service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().firebase?.databaseURL || 'https://portfolio-default-rtdb.firebaseio.com'
});

// Export Firestore and Auth instances
export const db = admin.firestore();
export const auth = admin.auth();

// Configure Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
  timestampsInSnapshots: true
});

// Export Firebase Admin for use in other modules
export default admin;
