import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomLoadingService } from 'src/app/services/custom-loading.service';
import { CustomToastService } from 'src/app/services/custom-toast.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthUser } from 'src/app/interfaces/AuthUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public formRegister: FormGroup;
  private isActiveToggleTextPassword: Boolean = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private loading: CustomLoadingService, private toast: CustomToastService,
    private authService: AuthenticationService) {

  }

  ngOnInit() {
    this.formRegister = this.formBuilder.group({
      'name': ["", [Validators.required]],
      'email': ["", [Validators.required, Validators.email]],
      'password': ["", [Validators.required]]
    });
  }

  public toggleTextPassword(): void {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword == true) ? false : true;
  }
  public getTypePassword(): string {
    return this.isActiveToggleTextPassword ? 'password' : 'text';
  }

  public registerWithEmailAndPassword(): void{
    this.loading.present('Registrando...');
      let user: AuthUser = {
        name: this.formRegister.get('name').value,
        email : this.formRegister.get('email').value,
        password : this.formRegister.get('password').value
      }
      this.authService.signUp(user)
        .then((resolve)=>{
          this.formRegister.reset();
          this.toast.present('Cuenta creada correctamente',1,'checkmark',3000);
          this.router.navigateByUrl('/login');
        })
        .catch((reject)=>{
          this.toast.present('Error al registrar: '+reject,0,'alert');
        })
        .finally(()=>{
          this.loading.hide();
        });
  }

  loginWithGoogle(){
    this.loading.present('Iniciando...');
  
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
  loginWithFacebook(){
    this.loading.present('Iniciando...');
  
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
  loginWithTwitter(){
    this.loading.present('Iniciando...');
  
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

  public goLogin(): void{
    this.router.navigateByUrl('/login');
  }

}
