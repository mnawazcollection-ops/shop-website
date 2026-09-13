import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const envPath = path.join(projectRoot, '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const k = trimmed.slice(0, eqIdx).trim();
      const v = trimmed.slice(eqIdx + 1).trim();
      process.env[k] = v;
    }
  });
}

console.log('--- ENV CHECK ---');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

async function testCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  try {
    console.log('\nTesting Cloudinary upload...');
    const res = await cloudinary.uploader.upload('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200', {
      folder: 'sir-ihsan/products',
      public_id: 'test_' + Date.now()
    });
    console.log('✓ Cloudinary upload SUCCESS! Secure URL:', res.secure_url);
    return true;
  } catch (err) {
    console.error('✗ Cloudinary upload FAILED:', err.message || err);
    return false;
  }
}

async function testFirebase() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

  try {
    console.log('\nTesting Firebase Firestore...');
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const testDoc = doc(db, 'system_health', 'test_' + Date.now());
    await setDoc(testDoc, {
      status: 'active',
      timestamp: new Date().toISOString()
    });
    console.log('✓ Firebase Firestore setDoc SUCCESS!');
    const snap = await getDoc(testDoc);
    console.log('✓ Firebase Firestore getDoc SUCCESS:', snap.data());
    return true;
  } catch (err) {
    console.error('✗ Firebase Firestore FAILED:', err.message || err);
    return false;
  }
}

async function run() {
  await testCloudinary();
  await testFirebase();
  process.exit(0);
}

run();
