import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccountPath = path.resolve(__dirname, '../../private/rentease-84004-firebase-adminsdk-3k5xr-54e82fa41a.json'); // Path to the service account key

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

export default admin;

