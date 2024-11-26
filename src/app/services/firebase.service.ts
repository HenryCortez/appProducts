import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { User } from '../models/user.interface';

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
}
