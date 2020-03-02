import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { VibrationService } from './vibration.service';

@Injectable({
  providedIn: 'root'
})
export class CustomToastService {

  constructor(private toastController: ToastController, private vibration: VibrationService) { }

  async present(message: string, option: number, icon?: string, time: number=3000) {
    const toast = await this.toastController.create({
      message: icon?'<ion-icon name="'+icon+'"></ion-icon>  '+message:message,
      duration: time,
      color:(option==0?'danger':(option==1?'success':'medium')),
      keyboardClose: true,
      mode: 'md'
    });
    toast.present().then(()=>{this.vibration.vibrate(600)});
  }
}