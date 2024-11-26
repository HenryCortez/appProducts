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
  email: new FormControl('', [Validators.required, Validators.email]),
  name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)]),
 });

constructor() { }
 firebaseSvc = inject(FirebaseService);
 utilsSvc = inject(UtilsService);
ngOnInit() {
}
submit() {
  if(this.group.valid){
    this.firebaseSvc.singUp(this.group.value as User)
    .then((res) => {
      console.log(res);
      
    })
  }
}
}
