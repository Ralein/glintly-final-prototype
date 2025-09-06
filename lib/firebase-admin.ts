import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Method 1: Individual environment variables (easier to manage)
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (projectId && privateKey && clientEmail) {
      // Initialize with individual variables
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
      });
      console.log('✅ Firebase Admin initialized with individual variables');
    } else {
      // Method 2: Fall back to JSON string method
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      
      if (!serviceAccountKey) {
        console.error('❌ Firebase Admin initialization failed');
        console.error('Missing environment variables. You need either:');
        console.error('Option 1: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL');
        console.error('Option 2: FIREBASE_SERVICE_ACCOUNT_KEY (JSON string)');
        console.error('');
        console.error('Current environment variables:');
        console.error('- FIREBASE_PROJECT_ID:', !!process.env.FIREBASE_PROJECT_ID);
        console.error('- NEXT_PUBLIC_FIREBASE_PROJECT_ID:', !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
        console.error('- FIREBASE_PRIVATE_KEY:', !!process.env.FIREBASE_PRIVATE_KEY);
        console.error('- FIREBASE_CLIENT_EMAIL:', !!process.env.FIREBASE_CLIENT_EMAIL);
        console.error('- FIREBASE_SERVICE_ACCOUNT_KEY:', !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        
        throw new Error('Firebase Admin credentials not configured');
      }

      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin initialized with JSON service account');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

export const auth = admin.auth();
export { admin };