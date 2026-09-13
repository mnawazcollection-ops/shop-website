import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Load environment variables from .env.local
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

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Configure Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper to upload any image (local path, data URI, or remote URL) to Cloudinary
async function uploadToCloudinary(imageSource, publicId) {
  if (!imageSource) return null;
  // If already hosted on Cloudinary, keep it
  if (imageSource.includes('res.cloudinary.com')) {
    return imageSource;
  }

  try {
    let sourceToUpload = imageSource;
    if (imageSource.startsWith('/')) {
      const localFilePath = path.join(projectRoot, 'public', imageSource);
      if (fs.existsSync(localFilePath)) {
        sourceToUpload = localFilePath;
      }
    }

    console.log(`  -> Uploading to Cloudinary [${publicId}]: ${typeof sourceToUpload === 'string' ? sourceToUpload.slice(0, 60) : 'buffer'}...`);
    const uploadRes = await cloudinary.uploader.upload(sourceToUpload, {
      folder: 'sir-ihsan/products',
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });

    console.log(`  ✓ Cloudinary URL: ${uploadRes.secure_url}`);
    return uploadRes.secure_url;
  } catch (err) {
    console.error(`  ✗ Cloudinary upload error for ${publicId}:`, err.message || err);
    return imageSource; // fallback to original if upload fails
  }
}

// Clean undefined fields for Firestore
function cleanUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => cleanUndefined(item));
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        result[key] = cleanUndefined(value);
      }
    }
    return result;
  }
  return obj;
}

// All products to sync (standard catalog + tatheer gun)
const ALL_CATALOG_PRODUCTS = [
  {
    id: "1",
    name: "Golden Bloom Earrings",
    slug: "golden-bloom-earrings",
    sku: "SIJ-EAR-001",
    category: "Earrings",
    subCategory: "Drop Earrings",
    price: 68500,
    salePrice: 62000,
    costPrice: 38000,
    stock: 14,
    lowStockThreshold: 5,
    image: "/images/products/earrings-1.jpg",
    gallery: [
      "/images/products/earrings-1.jpg",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=800&fit=crop",
    ],
    shortDescription: "Delicately crafted 18K gold earrings inspired by nature's most exquisite blooms.",
    description: "The Golden Bloom Earrings are a testament to M. Nawaz Jewelry Collection's artisanal excellence. Hand-sculpted in solid 18K gold with light-catching filigree petals.",
    tags: ["Gold", "Earrings", "Floral", "Handcrafted"],
    badge: "new",
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    allowBackorders: true,
    rating: 5,
    reviewCount: 12,
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Filigree Gold Bracelet",
    slug: "filigree-gold-bracelet",
    sku: "SIJ-BRC-002",
    category: "Bracelets",
    subCategory: "Chain & Bangle",
    price: 108000,
    salePrice: 98000,
    costPrice: 65000,
    stock: 8,
    lowStockThreshold: 5,
    image: "/images/products/bracelet-1.jpg",
    gallery: [
      "/images/products/bracelet-1.jpg",
      "https://images.unsplash.com/photo-1611591475879-1144c29d0f4d?w=800&h=800&fit=crop",
    ],
    shortDescription: "Artisan woven lace filigree pattern cast in 18K solid yellow gold with safety box clasp.",
    description: "An exceptional statement piece that intertwines ancient Ottoman craftsmanship with modern luxury ergonomics.",
    tags: ["Bracelet", "Filigree", "18K Gold"],
    badge: "sale",
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    allowBackorders: false,
    rating: 4.8,
    reviewCount: 19,
    createdAt: "2024-01-20T08:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Diamond Solitaire Ring",
    slug: "diamond-solitaire-ring",
    sku: "SIJ-RNG-003",
    category: "Rings",
    subCategory: "Engagement & Solitaire",
    price: 345000,
    costPrice: 210000,
    stock: 3,
    lowStockThreshold: 5,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    ],
    shortDescription: "A breathtaking 1.2 carat certified brilliant diamond crowned upon an 18K white gold cathedral band.",
    description: "Handcrafted to perfection, this iconic engagement ring reflects the eternal brilliance of natural earth-mined diamonds.",
    tags: ["Diamond", "Ring", "Engagement", "Solitaire"],
    badge: "hot",
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    allowBackorders: false,
    rating: 5,
    reviewCount: 34,
    createdAt: "2024-01-05T14:20:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Royal Emerald Pendant Necklace",
    slug: "royal-emerald-pendant-necklace",
    sku: "SIJ-NCK-004",
    category: "Necklaces",
    subCategory: "Pendants",
    price: 249000,
    costPrice: 145000,
    stock: 2,
    lowStockThreshold: 4,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
    ],
    shortDescription: "Vivid Colombian emerald surrounded by a sparkling halo of pavé diamonds on a delicate 18K chain.",
    description: "Deep lush greens meeting resplendent white gold, delivering an aura of aristocratic elegance.",
    tags: ["Emerald", "Necklace", "Pendant", "Gemstone"],
    badge: "new",
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    allowBackorders: true,
    rating: 4.9,
    reviewCount: 8,
    createdAt: "2024-02-18T16:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Vintage Pearl Drop Earrings",
    slug: "vintage-pearl-drop-earrings",
    sku: "SIJ-EAR-005",
    category: "Earrings",
    subCategory: "Drop Earrings",
    price: 89000,
    salePrice: 79000,
    costPrice: 52000,
    stock: 0,
    lowStockThreshold: 3,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&h=800&fit=crop",
    ],
    shortDescription: "Luminous South Sea cultured pearls suspended from handcrafted yellow gold filigree vines.",
    description: "Timeless maritime pearls that whisper royal sophistication. Currently sold out due to high bridal demand.",
    tags: ["Pearl", "Earrings", "Vintage", "Bridal"],
    badge: "hot",
    status: "active",
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    allowBackorders: true,
    rating: 4.7,
    reviewCount: 16,
    createdAt: "2024-01-12T11:15:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Classic Tennis Bracelet",
    slug: "classic-tennis-bracelet",
    sku: "SIJ-BRC-006",
    category: "Bracelets",
    subCategory: "Tennis Bracelets",
    price: 515000,
    costPrice: 320000,
    stock: 6,
    lowStockThreshold: 3,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop",
    ],
    shortDescription: "A continuous river of hand-selected round brilliant cut diamonds totaling 3.5 carats in 18K platinum.",
    description: "The quintessential diamond bracelet that moves with liquid fluidity on the wrist.",
    tags: ["Diamond", "Tennis Bracelet", "Luxury", "High Jewelry"],
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    allowBackorders: false,
    rating: 5,
    reviewCount: 27,
    createdAt: "2024-01-08T09:30:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Sapphire Harmony Band",
    slug: "sapphire-harmony-band",
    sku: "SIJ-RNG-007",
    category: "Rings",
    subCategory: "Eternity Bands",
    price: 190000,
    costPrice: 110000,
    stock: 12,
    lowStockThreshold: 4,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    ],
    shortDescription: "Alternating French-cut Ceylon blue sapphires and brilliant diamonds set in micro-claw platinum.",
    description: "Deep oceanic blue elegance designed to stack harmoniously with engagement solitaires or shine alone.",
    tags: ["Sapphire", "Ring", "Eternity Band", "Blue"],
    status: "active",
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    allowBackorders: true,
    rating: 4.8,
    reviewCount: 9,
    createdAt: "2024-02-05T13:40:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Rose Gold Chain Necklace",
    slug: "rose-gold-chain-necklace",
    sku: "SIJ-NCK-008",
    category: "Necklaces",
    subCategory: "Chains",
    price: 138000,
    salePrice: 125000,
    costPrice: 78000,
    stock: 18,
    lowStockThreshold: 5,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
    ],
    shortDescription: "Silk-spun interlocking 18K rose gold links that drape seamlessly along the collarbone.",
    description: "Warm romantic hues that reflect the evening glow. Suitable for pendants or solo layering.",
    tags: ["Rose Gold", "Chain", "Necklace"],
    badge: "sale",
    status: "active",
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    allowBackorders: true,
    rating: 4.6,
    reviewCount: 14,
    createdAt: "2024-01-28T15:20:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-tatheer-gun-direct-sync",
    name: "tatheer gun",
    slug: "tatheer-gun",
    sku: "SIJ-TATHEER-001",
    category: "Rings",
    subCategory: "Special Edition",
    price: 250000,
    costPrice: 150000,
    stock: 5,
    lowStockThreshold: 2,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
    ],
    shortDescription: "Exquisite jewelry piece crafted in solid gold with certified gemstones.",
    description: "tatheer gun - Handcrafted jewelry piece with pure gold and precious diamonds.",
    tags: ["Gold", "Rings", "Custom"],
    badge: "new",
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    allowBackorders: true,
    rating: 5,
    reviewCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const CATEGORIES = [
  {
    id: "cat-1",
    name: "Rings",
    slug: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
    description: "Handcrafted solitaires, eternity bands, and gemstone rings in ethical precious metals.",
    parentId: null,
    displayOrder: 1,
    isActive: true,
    productCount: 18,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Necklaces",
    slug: "necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
    description: "Chokers, collar chains, and statement diamond pendants forged by master goldsmiths.",
    parentId: null,
    displayOrder: 2,
    isActive: true,
    productCount: 14,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Earrings",
    slug: "earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
    description: "Studs, huggies, chandelier drops, and diamond solitaires.",
    parentId: null,
    displayOrder: 3,
    isActive: true,
    productCount: 16,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "Bracelets",
    slug: "bracelets",
    image: "https://images.unsplash.com/photo-1611591475879-1144c29d0f4d?w=800&h=800&fit=crop",
    description: "Tennis bracelets, rigid bangles, and delicate link chains.",
    parentId: null,
    displayOrder: 4,
    isActive: true,
    productCount: 11,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "High Jewelry",
    slug: "high-jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop",
    description: "Rare colored diamonds and precious untreated gemstones.",
    parentId: null,
    displayOrder: 5,
    isActive: true,
    productCount: 8,
    createdAt: "2024-01-01T00:00:00Z",
  }
];

async function syncAll() {
  console.log('\n======================================================');
  console.log('🚀 STARTING FULL CLOUDINARY & FIRESTORE CATALOG SYNC');
  console.log('======================================================\n');

  const updatedProducts = [];

  for (const prod of ALL_CATALOG_PRODUCTS) {
    console.log(`\n📦 Processing Product: "${prod.name}" (ID: ${prod.id})`);

    // 1. Upload Cover Image to Cloudinary
    const cloudCoverUrl = await uploadToCloudinary(prod.image, `prod_${prod.slug}_cover`);
    prod.image = cloudCoverUrl || prod.image;

    // 2. Upload Gallery Images to Cloudinary
    if (prod.gallery && Array.isArray(prod.gallery)) {
      const updatedGallery = [];
      for (let g = 0; g < prod.gallery.length; g++) {
        const cloudGalleryUrl = await uploadToCloudinary(prod.gallery[g], `prod_${prod.slug}_gallery_${g + 1}`);
        updatedGallery.push(cloudGalleryUrl || prod.gallery[g]);
      }
      prod.gallery = updatedGallery;
    }

    // 3. Save to Firebase Firestore
    console.log(`  🔥 Saving to Firestore (collection: "products", doc: "${prod.id}")...`);
    const docRef = doc(db, 'products', prod.id);
    const cleanPayload = cleanUndefined({
      ...prod,
      updatedAt: new Date().toISOString()
    });
    await setDoc(docRef, cleanPayload, { merge: true });
    console.log(`  ✓ Saved to Firestore!`);

    updatedProducts.push(prod);
  }

  // Sync Categories to Cloudinary & Firestore
  console.log('\n------------------------------------------------------');
  console.log('📁 Processing Categories...');
  for (const cat of CATEGORIES) {
    console.log(`\nCategory: "${cat.name}"`);
    const cloudCatUrl = await uploadToCloudinary(cat.image, `cat_${cat.slug}`);
    cat.image = cloudCatUrl || cat.image;

    console.log(`  🔥 Saving to Firestore (collection: "categories", doc: "${cat.id}")...`);
    const docRef = doc(db, 'categories', cat.id);
    await setDoc(docRef, cleanUndefined(cat), { merge: true });
    console.log(`  ✓ Category saved to Firestore!`);
  }

  // Save the updated products to a local JSON file so we can update the source code
  const jsonExportPath = path.join(projectRoot, 'src', 'data', 'cloudSyncedProducts.json');
  fs.writeFileSync(jsonExportPath, JSON.stringify(updatedProducts, null, 2), 'utf8');
  console.log(`\n💾 Exported Cloud-synced product data to: ${jsonExportPath}`);

  // Verification step
  console.log('\n======================================================');
  console.log('🔍 VERIFYING FINAL FIRESTORE STATE');
  console.log('======================================================');
  const prodSnap = await getDocs(collection(db, 'products'));
  console.log(`Total Products in Firestore: ${prodSnap.docs.length}`);
  prodSnap.docs.forEach((d) => {
    const data = d.data();
    console.log(`• [${d.id}] ${data.name} => ${data.image}`);
  });

  const catSnap = await getDocs(collection(db, 'categories'));
  console.log(`\nTotal Categories in Firestore: ${catSnap.docs.length}`);
  catSnap.docs.forEach((d) => {
    const data = d.data();
    console.log(`• [${d.id}] ${data.name} => ${data.image}`);
  });

  console.log('\n🎉 FULL SYNC COMPLETE! ALL PRODUCTS ARE IN FIRESTORE AND CLOUDINARY!');
  process.exit(0);
}

syncAll().catch((err) => {
  console.error('FATAL SYNC ERROR:', err);
  process.exit(1);
});
