import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function inspectFirestore() {
  const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('\n--- FETCHING PRODUCTS FROM FIRESTORE ---');
  try {
    const snap = await getDocs(collection(db, 'products'));
    console.log(`Found ${snap.docs.length} products in Firestore:`);
    snap.docs.forEach((d) => {
      const data = d.data();
      console.log(`- ID: ${d.id} | Name: ${data.name} | Image: ${data.image?.slice(0, 60)}...`);
    });
  } catch (e) {
    console.error('Failed to get products:', e.message || e);
  }

  console.log('\n--- FETCHING CATEGORIES FROM FIRESTORE ---');
  try {
    const snap = await getDocs(collection(db, 'categories'));
    console.log(`Found ${snap.docs.length} categories in Firestore:`);
    snap.docs.forEach((d) => {
      const data = d.data();
      console.log(`- ID: ${d.id} | Name: ${data.name}`);
    });
  } catch (e) {
    console.error('Failed to get categories:', e.message || e);
  }

  process.exit(0);
}

inspectFirestore();
