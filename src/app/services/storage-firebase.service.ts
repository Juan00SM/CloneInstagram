import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireStorage } from '@angular/fire/storage';
import { Post } from '../interfaces/Post';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { r3JitTypeSourceSpan } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class StorageFirebaseService {

  private COLLECTION_POST: string = 'posts';

  constructor(private storage: AngularFireStorage, private fireStore: AngularFirestore) { }

  uploadImage(image64: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let storageRef = this.storage.storage.ref();
      let imageRef = storageRef.child('image').child('imageName');
      imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          console.log(snapshot)
          snapshot.ref.getDownloadURL().then(url=>{
            console.log(url)
            resolve(url)
          })
        }, err => {
          reject(err);
        })
    })
  }

  uploadPost(post: Post){
    return new Promise<void>((resolve,reject)=>{
      this.fireStore.collection(this.COLLECTION_POST).add(post).then(()=>{
        resolve();
      }).catch(err=>{
        reject(err);
      });
    });
  }

  readPosts(uid?: string, timer: number = 10000){
    return new Observable<any[]>((observer) => {
      let subscription: Subscription;
      let tempo = setTimeout(() => {
        subscription.unsubscribe();
        observer.error("Timeout");
      }, timer);
      subscription = this.fireStore.collection(this.COLLECTION_POST).get().subscribe(listPosts => {
        clearTimeout(tempo);

        let list: any[] = [];

        listPosts.docs.forEach((post) => {
          list.push({...post.data()});
        });
        observer.next(list);
        observer.complete();
      },
        error => {
          clearTimeout(tempo);
          observer.error("Error en lectura");
        });
    });
  }
}
