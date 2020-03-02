import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CustomAlertDialogService {

  constructor(private alertController: AlertController) { }

  async present(title: string = 'Confirmación', subtitle: string = '¿Estás seguro?', message: string = 'Se procedera a realizar la accion', ) {
    let option: boolean = false;
    const alert = await this.alertController.create({
      header: title,
      subHeader: subtitle,
      message: message,
      buttons: [{text: 'Cancelar', cssClass: 'secondary'}, {text: 'Aceptar', handler: ()=>{option = true}}]
    })

    await alert.present();

    return new Promise<boolean>((resolve, reject)=>{
        alert.onDidDismiss().then(()=>{resolve(option);}).catch(error=>{reject(error);});
    });
  }
}

