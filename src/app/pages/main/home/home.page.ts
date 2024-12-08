import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateComponent } from 'src/app/shared/components/add-update/add-update.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  productsToUse?: any[];
  totalEarnings: number = 0;
  constructor() { }

  ngOnInit() {
   this.getProducts();
  }
  async addUpdateProduct() {
    let sucess = await this.utilsSvc.presentModal({
      component: AddUpdateComponent,
      cssClass: 'add-update-modal',
      
    })
  }

  async getProducts() {
    let loading = await this.utilsSvc.presentLoading();
    await loading.present();
    let user = this.utilsSvc.getFromLocalStorage('user');
    let path = `users/${user.uid}/products`;
    let products = await this.firebaseSvc.getCollectionData(path);
    console.log(products);
    loading.dismiss();
    this.productsToUse = products;
    this.calculateTotalEarnings();
  }
  calculateTotalEarnings() {
    this.totalEarnings = this.productsToUse?.reduce((acc: number, product: { price: number; soldUnits: number; }) => acc + (product.price * product.soldUnits), 0);
  }
}
