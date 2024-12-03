import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ModalController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  alertCtrl = inject(AlertController);
  toastCtrl = inject(ToastController);
  loadingCtrl = inject(LoadingController);
  modalCtrl = inject(ModalController);
  route = inject(Router);
  constructor() { }

  async presentAlert(opts:AlertOptions) {
    const alert = await this.alertCtrl.create(opts); 
    return alert;
  }

  async presentToast(opts:ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    return toast;
  }

  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });
    return loading;
  }

  routerLink(url:string) {
    this.route.navigateByUrl(url);
  }

  saveInLocalStorage(key:string, value:any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key:string) {
    return JSON.parse(localStorage.getItem(key)!);
  }
}
