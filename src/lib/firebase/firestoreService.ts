import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";

export async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  if (!isFirebaseConfigured || !db) return [];
  try {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    return [];
  }
}

export async function fetchDocument<T>(collectionName: string, id: string): Promise<T | null> {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const docRef = doc(db, collectionName, id);
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
  if (!isFirebaseConfigured || !db) {
    return data.id || `doc-${Date.now()}`;
  }
  try {
    const id = data.id || `doc-${Date.now()}`;
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    return id;
  } catch (error) {
    console.error(`Error saving document in ${collectionName}:`, error);
    throw error;
  }
}

export async function removeDocument(collectionName: string, id: string): Promise<boolean> {
  if (!isFirebaseConfigured || !db) return true;
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document ${id} in ${collectionName}:`, error);
    return false;
  }
}
