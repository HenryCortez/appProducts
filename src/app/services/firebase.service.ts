import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { User } from '../models/user.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
  CollectionReference,
} from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';

import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  constructor() {}
  //autentificacion

  getAuth() {
    return getAuth();
  }

  //login
  signIn(user: User) {
    return signInWithEmailAndPassword(
      this.getAuth(),
      user.email,
      user.password
    );
  }
  //create user
  singUp(user: User) {
    return createUserWithEmailAndPassword(
      this.getAuth(),
      user.email,
      user.password
    );
  }
  updateProfile(name: string) {
    return updateProfile(this.getAuth().currentUser!, {
      displayName: name,
    });
  }

  async getCollectionData(path: string) {
    const ref = collection(getFirestore(), path);
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  //setear doc
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //actualizar doc
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //eliminar doc
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  //enviar email de reseteo
  async sendResetEmail(email: string) {
    return sendPasswordResetEmail(this.getAuth(), email);
  }

  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
    return getDownloadURL(ref(getStorage(), path))
    })
    }
  //====== Obtener ruta de la imagen con su url =====
  async getFilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }
  //====== Eliminar archivo =====
  deleteFile(path: string) {
    return deleteObject(ref(getStorage(), path));
  }

  generateId() {
    return uuidv4();
  }
}
