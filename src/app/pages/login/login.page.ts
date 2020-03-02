import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CustomLoadingService } from 'src/app/services/custom-loading.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthUser } from 'src/app/interfaces/AuthUser';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public formLogin: FormGroup;
  private isActiveToggleTextPassword: Boolean = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthenticationService,
    private loading: CustomLoadingService, private toast: CustomToastService, private alertController: AlertController) {

  }

  ngOnInit() {
    this.formLogin = this.formBuilder.group({
      'email': ["", [Validators.required, Validators.email]],
      'password': ["", [Validators.required]],
      'remember': [false]
    });
  }

  public toggleTextPassword(): void {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
  }
  public getTypePassword(): string {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }

  public async loginWithEmailAndPassword(){
    await this.loading.present('Iniciando...');
    let userCredentials: AuthUser = {
      email : this.formLogin.get('email').value,
      password : this.formLogin.get('password').value,
      remember: this.formLogin.get('remember').value,
    }
    this.authService.logIn(userCredentials)
      .then((resolve)=>{
        this.formLogin.reset();
        this.toast.present('Cuenta correcta',1,'checkmark',3000);
        this.router.navigateByUrl('/tabs/tab/t1');
      })
      .catch((reject)=>{
        this.toast.present('Error al iniciar: '+reject,0,'alert');
      })
      .finally(()=>{
        this.loading.hide();
      });
  }

  public async loginWithGoogle(){
    await this.loading.present('Iniciando...');
  
    this.authService.logInWithGoogle()
      .then((resolve)=>{
        this.toast.present('Cuenta correcta',1,'checkmark',3000);
        this.router.navigateByUrl('/tabs/tab/t1');
      })
      .catch((reject)=>{
        console.log(reject)
        this.toast.present('Error al iniciar: '+reject,0,'alert');
      })
      .finally(()=>{
        this.loading.hide();
      });
  }
  public async loginWithFacebook(){
    await this.loading.present('Iniciando...');
  
    this.authService.logInWithFacebook()
      .then((resolve)=>{
        this.toast.present('Cuenta correcta',1,'checkmark',3000);
        this.router.navigateByUrl('/tabs/tab/t1');
      })
      .catch((reject)=>{
        this.toast.present('Error al iniciar: '+reject,0,'alert');
      })
      .finally(()=>{
        this.loading.hide();
      });
  }
  public async loginWithTwitter(){
    await this.loading.present('Iniciando...');
  
    this.authService.logInWithTwitter()
      .then((resolve)=>{
        this.toast.present('Cuenta correcta',1,'checkmark',3000);
        this.router.navigateByUrl('/tabs/tab/t1');
      })
      .catch((reject)=>{
        this.toast.present('Error al iniciar: '+reject,0,'alert');
      })
      .finally(()=>{
        this.loading.hide();
      });
  }

  public async recoverPassword(){

    const alert = await this.alertController.create({
      header: '¿Contraseña olvidada?',
      message: 'Introduce la direccion de Email para enviarte un link de recuperación',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Confirmar',
          handler: async data => {
            await this.loading.present('Enviando link de restauración...');
            this.authService.resetPassword(data.email)
            .then(()=>{
              this.toast.present('Link enviado',1,'checkmark',3000);
            })
            .catch(()=>{
              this.toast.present('Ha habido un error, ¿seguro que dispone de una cuenta con ese Email?',0,'alert');
            })
            .finally(()=>{
              this.loading.hide();
            });
          }
        }
      ]
    });

    await alert.present();
  }
  
  public goRegister(): void{
    this.router.navigateByUrl('/register');
  }
}
