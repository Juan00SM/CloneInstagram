import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CustomLoadingService {

  constructor(private loadingController: LoadingController) { }

  async present(message: string = 'Cargando') {
    const loading = await this.loadingController.create({
      message: message,
      cssClass: 'custom-class custom-loading',
      mode: 'md',
      spinner: 'bubbles'
    });
    await loading.present();
  }

  hide() {
    this.loadingController.dismiss();
  }
}

