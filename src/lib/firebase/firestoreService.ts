import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, getDb, isFirebaseConfigured } from "./config";

/**
 * Recursively removes all undefined keys from an object or array.
 * Firestore strictly rejects documents with undefined fields.
 */
export function cleanUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => cleanUndefined(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        result[key] = cleanUndefined(value);
      }
    }
    return result as T;
  }
  return obj;
}

export async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  const activeDb = db || getDb();
  if (!isFirebaseConfigured || !activeDb) return [];
  try {
    const q = query(collection(activeDb, collectionName), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
}

export async function fetchDocument<T>(collectionName: string, id: string): Promise<T | null> {
  const activeDb = db || getDb();
  if (!isFirebaseConfigured || !activeDb) return null;
  try {
    const docRef = doc(activeDb, collectionName, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as T;
  } catch (error) {
    console.error(`Error fetching document ${id} from ${collectionName}:`, error);
    return null;
  }
}

export async function saveDocument<T extends { id?: string }>(
  collectionName: string,
  data: T
): Promise<string> {
  const activeDb = db || getDb();
  if (!isFirebaseConfigured || !activeDb) {
    console.warn(`[Firestore] Skipping cloud save (${collectionName}): Firebase not configured or db offline.`);
    return data.id || `doc-${Date.now()}`;
  }
  try {
    const id = data.id || `doc-${Date.now()}`;
    const docRef = doc(activeDb, collectionName, id);
    const payload = cleanUndefined({
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, payload, { merge: true });
    console.log(`[Firestore] Successfully saved document ${id} to ${collectionName}`);
    return id;
  } catch (error) {
    console.error(`[Firestore] Error saving document in ${collectionName}:`, error);
    throw error;
  }
}

export async function removeDocument(collectionName: string, id: string): Promise<boolean> {
  const activeDb = db || getDb();
  if (!isFirebaseConfigured || !activeDb) return true;
  try {
    const docRef = doc(activeDb, collectionName, id);
    await deleteDoc(docRef);
    console.log(`[Firestore] Successfully deleted document ${id} from ${collectionName}`);
    return true;
  } catch (error) {
    console.error(`Error deleting document ${id} in ${collectionName}:`, error);
    return false;
  }
}

