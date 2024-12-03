import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  isModal: boolean = false;
  group= new FormGroup({
    
    email: new FormControl('', [Validators.required, Validators.email]),
    
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
      this.firebaseSvc.sendResetEmail(this.group.value.email!)
      .then(async(res) => {
        this.utilsSvc.routerLink('/auth');
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
