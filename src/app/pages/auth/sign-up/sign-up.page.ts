import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.interface';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
isModal: boolean = false;
group= new FormGroup({
  uid: new FormControl(''),
  email: new FormControl('', [Validators.required, Validators.email]),
  name: new FormControl('', [Validators.required, Validators.minLength(4)]),
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
    this.firebaseSvc.singUp(this.group.value as User)
    .then(async(res) => {
     await this.firebaseSvc.updateProfile(this.group.value.name!)
      let uid = res.user?.uid;
      this.group.controls.uid.setValue(uid);
      this.setUserInfo(uid);
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

  async setUserInfo(uid: string) {
  if(this.group.valid){
    const loading = await this.utilsSvc.presentLoading();
    loading.present();
    let path = `users/${uid}`;
    delete this.group.value.password;
    this.firebaseSvc.setDocument(path, this.group.value)
    .then(async () => {
      await this.utilsSvc.saveInLocalStorage('user', this.group.value);
      this.utilsSvc.routerLink('main/home');
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
}
