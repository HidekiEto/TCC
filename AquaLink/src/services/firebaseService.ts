import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export async function registerUser(email: string, password: string, extraData: Record<string, any> = {}) {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    ...extraData,
    createdAt: serverTimestamp(),
  });
  return user;
}

export async function signInUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}
