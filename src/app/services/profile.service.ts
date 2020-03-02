import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ProfileUser } from '../interfaces/ProfileUser';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private COLLECTION_USERS: string = 'users';
  private profileUser: ProfileUser;
  private uidUser: string;

  constructor(private authService: AuthenticationService, private fireStore: AngularFirestore) {
  }

  getUserUID(): string{
    return this.uidUser;
  }
  loadProfileUser(): Promise<ProfileUser>{
    this.uidUser = this.authService.getUserUID();
    return new Promise<ProfileUser>((resolve, reject)=>{
      this.fireStore.collection(this.COLLECTION_USERS).doc(this.uidUser).ref.get()
      .then(data=>{
        let da = data.data();
        this.profileUser = {
          displayName: da.displayName,
          email: da.email,
          emailVerified: da.emailVerified,
          userName: da.userName,
          phoneNumber: da.phoneNumber,
          description: da.description,
          gender: da.gender,
          photoUrl: da.photoUrl,
          webSite: da.webSite,
        }
        console.log("this.profileUser: ");
        console.log(this.profileUser);
        resolve(this.profileUser);
      })
      .catch(err=>{
        console.log(err);
        reject(err);
      });
    });
  }
}
