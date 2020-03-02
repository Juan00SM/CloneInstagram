import { Component, NgZone } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { StorageFirebaseService } from '../services/storage-firebase.service';
import { Post } from '../interfaces/Post';
import { ProfileService } from '../services/profile.service';
import { CustomLoadingService } from '../services/custom-loading.service';
import { CustomToastService } from '../services/custom-toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public img: string;
  public valueDescriptionPost: string;
  options: CameraOptions = {
    quality: 5,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }
  post: Post;

  constructor(private camera: Camera, private storageService: StorageFirebaseService, private zone: NgZone,
    private profileService: ProfileService, private loading: CustomLoadingService, private toast:CustomToastService,
    private router: Router) {
    this.profileService.loadProfileUser()
      .then(user => {
        this.post = {
          uidUser: this.profileService.getUserUID(),
          nameUser: user.displayName,
          srcPhotoUser: user.photoUrl,
          featuredComment: null,
          likes: 0,
          srcPhotoPost: '',
          uidComments: null,
          description: '',
        }
      })
      .catch(err => {
        console.log(err)
      });
  }
  ionViewWillEnter(){
    this.openCamera();
  }

  openCamera() {
    this.camera.getPicture(this.options).then(imageData => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(base64Image)
      this.storageService.uploadImage(base64Image).then(data => {
        console.log(data);
        this.zone.run(() => {
          this.img = data
        })
      }).catch(err => { console.log(err) });
    })
      .catch(err => {
        console.log(err)
        this.router.navigateByUrl('tabs/tab/t1')
      });
  }

  async uploadPost() {
    await this.loading.present('Subiendo Post...');

    this.post.description = this.valueDescriptionPost!=undefined?this.valueDescriptionPost:'';
    this.post.srcPhotoPost = this.img!=undefined?this.img:'';
    this.storageService.uploadPost(this.post)
      .then(result => {
        this.toast.present('Subido Correctamente', 1, 'checkmark', 3000);
        this.router.navigateByUrl('/tabs/tab/t1');
      })
      .catch(err=>{
        this.toast.present('Error al iniciar: '+err,0,'alert');
        console.log(err)
      })
      .finally(() => {
        this.loading.hide();
      });
  }
}
