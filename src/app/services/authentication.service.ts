import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AuthUser } from '../interfaces/AuthUser';
import { ProfileUser } from '../interfaces/ProfileUser';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private COLLECTION_USERS: string = 'users';
  private user: firebase.User;

  constructor(private google: GooglePlus, private facebook: Facebook, private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore, private platform: Platform, private router: Router) {
    this.checkSesion();
  }

  getUserUID(): string{
    return this.user.uid;
  }

  checkSesion() {
    this.fireAuth.auth.onAuthStateChanged(u => {
      if (u) {
        this.user = u;
        this.router.navigateByUrl('/tabs/tab/t1');
      } else {
        this.user = null;
        this.router.navigateByUrl('/login');
      }
    });
  }

  saveAuthUser(authUser: AuthUser) {

  }

  signUp(authUser: AuthUser): Promise<firebase.auth.UserCredential> {
    return new Promise((resolve, reject) => {
      this.fireAuth
        .auth
        .createUserWithEmailAndPassword(authUser.email, authUser.password)
        .then(user => {
          user.user.updateProfile({
            displayName: authUser.name
          }).then(()=>{
            if(user.additionalUserInfo.isNewUser){
              this.createNewUser(user);
            }
          });
          resolve(user);
        })
        .catch(error => {
          reject(error);
        });
    })
  }

  logIn(authUser: AuthUser): Promise<firebase.auth.UserCredential> {
    return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        this.fireAuth
          .auth
          .signInWithEmailAndPassword(authUser.email, authUser.password)
          .then(user => {
            if(user.additionalUserInfo.isNewUser){
              this.createNewUser(user);
            }
            resolve(user);
          })
          .catch(error => {
            reject(error);
          });
      })
        .catch(err => {
          reject(err);
        });
    })
  }

  resetPassword(email: string): Promise<void> {
    return this.fireAuth.auth.sendPasswordResetEmail(email);
  }

  logInWithGoogle(): Promise<firebase.auth.UserCredential> {
    let params: any = {};
    if (this.platform.is('android')) {
      params = {
        'webClientId': '1036696967861-4p4lbv65v609d3cdj3lpsv4da7hal7eb.apps.googleusercontent.com',
        'offline': true
      }
    }
    return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        this.google.getSigningCertificateFingerprint().then(data=>{
          console.log(data);
        });
        this.google.login(params)
          .then(response => {
            const { idToken, accessToken } = response;
            const credential = accessToken ? firebase.auth.GoogleAuthProvider.credential(idToken, accessToken)
              : firebase.auth.GoogleAuthProvider.credential(idToken);
            this.fireAuth.auth.signInWithCredential(credential)
              .then(resp => {
                if(resp.additionalUserInfo.isNewUser){
                  this.createNewUser(resp);
                }
                console.log(resp);
                resolve(resp);
              })
              .catch(err => {
                console.log(err);
                reject(err);
              });
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });

  }

  logInWithFacebook(): Promise<firebase.auth.UserCredential> {
    return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        this.facebook.login(['email'])
          .then(response => {
            console.log(response.authResponse.accessToken);
            const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
            this.fireAuth.auth.signInWithCredential(credential)
              .then(resp => {
                console.log(resp);
                if(resp.additionalUserInfo.isNewUser){
                  this.createNewUser(resp);
                }
                resolve(resp);
              })
              .catch(err => {
                console.log(err);
                reject(err);
              });
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }
  logInWithTwitter(): Promise<firebase.auth.UserCredential> {
    return new Promise((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        this.fireAuth.auth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
          .then(user => {
            if(user.additionalUserInfo.isNewUser){
              this.createNewUser(user);
            }
            resolve(user);
          })
          .catch(error => {
            reject(error);
          });
      })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  }

  logout(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fireAuth.auth.signOut().then(() => {
        this.router.navigateByUrl('/login');
        resolve(true);
      });
    });
  }

  isAuthenticated() {
    if (this.user) {
      return true;
    } else {
      return false;
    }
  }

  private createNewUser(user: firebase.auth.UserCredential){
    let u: firebase.User = user.user;
    let uidNewUser: string = u.uid;
    let newUser: ProfileUser = {
      email: u.email,
      emailVerified: u.emailVerified,
      displayName: u.displayName,
      phoneNumber: u.phoneNumber,
      userName: u.displayName,
      photoUrl: u.photoURL,
      webSite: null,
      description: null,
      gender: null
    }
    this.fireStore.collection(this.COLLECTION_USERS).doc(uidNewUser).set(newUser);
  }
}
