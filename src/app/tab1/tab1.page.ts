import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { StoryPost } from '../interfaces/StoryPost';
import { Post } from '../interfaces/Post';
import { StorageFirebaseService } from '../services/storage-firebase.service';
import { CustomLoadingService } from '../services/custom-loading.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  textPullingRefresh: string = 'Arrastra para Refrescar';
  textRefreshingRefresh: string = 'Recargando...';
  valueNewComment: string = "";
  public textLoadingInfiniteScroll: string = 'Cargando mas publicaciones...';

  userProfileImage: string;
  stories: StoryPost[] = [];
  posts: Post[] = [];

  slideOptsStory = {
    initialSlide: 1,
    speed: 400,
    direction: 'horizontal',
    slidesPerView: 5,
    centeredSlides: false,
    spaceBetween: 10,

  };
  slideOptsPost = {
    initialSlide: 1,
    speed: 400,
    direction: 'horizontal',
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 3,

  };

  constructor(private authService: AuthenticationService, private storage: StorageFirebaseService,
    private loading: CustomLoadingService, private profileService: ProfileService) {
      this.profileService.loadProfileUser().then(user=>{
        this.userProfileImage = user.photoUrl;
      });
    this.stories.push({
      nameUser: '',
      srcPhotoUser: ''
    });
    this.stories.push({
      nameUser: '',
      srcPhotoUser: ''
    });
  }
  ionViewWillEnter(){
    this.loadPosts();
  }
  async loadPosts(uid?: string){
    await this.loading.present('Cargando Posts');
    this.posts = [];
    console.log("Cargando posts...");
    this.storage.readPosts(uid).subscribe(list => {
      this.posts = list;
      console.log("Listado Cargado");
      this.loading.hide();
    },
      error => {
        console.log(error);
        this.loading.hide();
      });
    console.log("Lista de Notas Solicitada");
  }

  public doRefresh($event: any) {
    this.posts = [];
    console.log("Cargando posts...");
    this.storage.readPosts().subscribe(list => {
      this.posts = list;
      console.log("Listado Cargado");
      $event.target.complete();
    },
      error => {
        console.log(error);
        $event.target.complete();
      });
    
  }

  searchDinamic(value: string) {

    this.posts = [];
    console.log("Cargando listado");
    /*this.todoService.readTODObyTitle(value).subscribe(listado => {
      this.listadoPanel = listado;
      console.log("Listado Cargado");
      console.log(listado);
    },
      error => {
        console.log(error);
      });*/
    console.log("Lista de Notas Solicitada");
  }

  doInfinite($event: any) {
    console.log('Begin async operation');
    $event.target.complete();
  }

}
