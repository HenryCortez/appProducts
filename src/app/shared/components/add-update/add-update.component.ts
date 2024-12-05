import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.interface';
import { User } from 'src/app/models/user.interface';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html',
  styleUrls: ['./add-update.component.scss'],
})
export class AddUpdateComponent implements OnInit {
  user = {} as User;
  isModal = true;
  @Input() product?: Product;
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  group = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl('', [Validators.required, Validators.min(0)]),
    image: new FormControl('', [Validators.required]),
  });
  constructor() {}

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) {
      this.group.setValue(this.product);
    }
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto'))
      .dataUrl;
    this.group.controls.image.setValue(dataUrl!);
  }
  submit() {
    if (this.group.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  // ======== Convierte valores de tipo string a number =======
  setNumberInputs() {
    let { soldUnits, price } = this.group.controls;
    if (soldUnits.value) soldUnits.setValue(soldUnits.value);
    if (price.value) price.setValue(price.value);
  }
  async createProduct() {
    let path = `users/${this.user.uid}/products`;
    const loading = await this.utilsSvc.presentLoading();
    await loading.present();
    // === Subir la imagen y obtener la url ===
    let dataUrl = this.group.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl!);
    this.group.controls.image.setValue(imageUrl);
    delete this.group.value.id;
    this.firebaseSvc
      .setDocument(path, this.group.value)
      .then(async (res) => {
        this.utilsSvc.dissmisModal({ success: true });
        this.utilsSvc.presentToast({
          message: 'Producto creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
  async updateProduct() {
    let path = `users/${this.user.uid}/products/${this.product!.id}`;
    const loading = await this.utilsSvc.presentLoading();
    await loading.present();
    // === Si cambió la imagen, subir la nueva y obtener la url ===
    if (this.group.value.image !== this.product!.image) {
      let dataUrl = this.group.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product!.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl!);
      this.group.controls.image.setValue(imageUrl);
    }
    delete this.group.value.id;
    this.firebaseSvc
      .updateDocument(path, this.group.value)
      .then(async (res) => {
        this.utilsSvc.dissmisModal({ success: true });
        this.utilsSvc.presentToast({
          message: 'Producto actualizado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
      })
      .catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
  }
}
