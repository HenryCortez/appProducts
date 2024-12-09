import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.interface';
import { User } from 'src/app/models/user.interface';
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
  user = {} as User;
  constructor() { }

  ngOnInit() {
  this.user = this.utilsSvc.getFromLocalStorage('user');
   this.getProducts();
  }
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateComponent,
      cssClass: 'add-update-modal',
      componentProps: product ? { product } : {}
    });

    if (success) {
      this.getProducts(); // Refresca la lista de productos después de agregar o actualizar
    }
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

  toggleEditMode(product: { editMode: boolean; }) {
    product.editMode = !product.editMode;
  }

 
  async deleteProduct(product: any) {
    await this.utilsSvc.presentAlert({
      header: 'Eliminar Producto',
      message: '¿Estás seguro de eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelar');
          }
        }, {
          text: 'Eliminar',
          handler: async () => {
            let path = `users/${this.user.uid}/products/${product.id}`;
            await this.firebaseSvc.deleteDocument(path);
            this.getProducts();
          }
        }
      ]
    });
  }
}
