import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isModal: boolean = false;
   group= new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
   });

  constructor() { }
   firebaseSvc = inject(FirebaseService);
   utilsSvc = inject(UtilsService);
  ngOnInit() {
  }
  async submit() {
    if(this.group.valid){
      const loading = await this.utilsSvc.presentLoading();
      loading.present();
      this.firebaseSvc.signIn(this.group.value as User)
      .then(async(res) => {
        await this.getUserInfo(res.user?.uid!);
      })
      .catch(async(err) => {
        this.utilsSvc.presentToast({
          message: err.message,
          color: 'danger',
          position: 'top',
          duration: 2000,
          icon: 'alert-circle-outline'
        }).then(toast => toast.present());
      })
      .finally(() => loading.dismiss());
    }
  }

  async getUserInfo(uid:string){
    if (this.group.valid) {
      const loading = await this.utilsSvc.presentLoading();
      loading.present()
      let path = `users/${uid}`
      this.firebaseSvc.getDocument(path)
        .then((data) => {
          const user = data as User;
          this.utilsSvc.saveInLocalStorage('user', user)
          this.utilsSvc.routerLink('main/home')
          this.group.reset();

        this.utilsSvc.presentToast({
          message: 'Welcome back!',
          color: 'success',
          position: 'top',
          duration: 2000,
          icon: 'checkmark-circle-outline'
        }).then(toast => toast.present());
      })
      .catch(async (err) => {
        this.utilsSvc.presentToast({
          message: err.message,
          color: 'danger',
          position: 'top',
          duration: 2000,
          icon: 'alert-circle-outline'
        }).then(toast => toast.present());
      })
      .finally(() => loading.dismiss());
    }
  }
}
