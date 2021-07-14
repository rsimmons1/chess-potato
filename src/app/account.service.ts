import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { randomName } from './name_generator'; 
@Injectable({
  providedIn: 'root'
})
export class AccountService {

  email: Observable<string | null>;
  constructor(public readonly auth: AngularFireAuth) {
    // this.email = null;
    let self = this;
    this.email = this.auth.user.pipe(
      map((val) => {
        if(val){
          return val.email;
        }
        return null;
      })
    );
   }

   setEmail(email: string){
     this.email = new Observable(subscriber => subscriber.next(email));
   }
  
   async loginWithGoogle() {
    const user = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.email = new Observable(subscriber => subscriber.next(user.user!.email));
    // TODO sign into offline app
  }

  async loginAsGuest() {
    let email = randomName();
    // this.auth.signInAnonymously
    this.email = new Observable(subscriber => subscriber.next(email));
  }

  logout() {
    this.auth.signOut();
    this.email = new Observable(subscriber => subscriber.next(null));
    // TODO sign out of offline app
  }

}
