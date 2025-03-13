/*
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

*/


import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Resolve the absolute path of the service account key
const serviceAccountPath = path.resolve(__dirname, '../../private/rentease-84004-firebase-adminsdk-3k5xr-54e82fa41a.json');

// Check if the file exists before initializing
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account key file not found:', serviceAccountPath);
  process.exit(1);
}

// Read and parse the JSON file
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

