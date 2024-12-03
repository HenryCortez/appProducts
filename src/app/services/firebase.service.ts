import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { User } from '../models/user.interface';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  addDoc,
  collection,
  collectionData,
  query,
  updateDoc,
  deleteDoc,
  CollectionReference
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  constructor() { }
  //autentificacion

  getAuth() {
    return getAuth();
  }

  //login
  signIn(user:User) {
    return signInWithEmailAndPassword(this.getAuth(), user.email, user.password);
  }
  //create user
  singUp(user:User) {
    return createUserWithEmailAndPassword(this.getAuth(), user.email, user.password);
  }
   updateProfile(name:string) {
    return updateProfile(this.getAuth().currentUser!, {
      displayName: name,
    });
  }

  getCollectionData(path:string, collectionQuery?:any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuery), {idField: 'id'});
  }

  //setear doc
  setDocument(path:string, data:any) {
    return setDoc(doc(getFirestore(), path), data);
  } 

  //actualizar doc
  updateDocument(path:string, data:any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //eliminar doc
  deleteDocument(path:string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  async getDocument(path:string) {
    const docSnap = await getDoc(doc(getFirestore(), path));
    return docSnap.data();
  }
}
