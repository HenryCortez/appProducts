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
  submit() {
    if(this.group.valid){
      this.firebaseSvc.signIn(this.group.value as User)
      .then((res) => {
        console.log(res);
      })
    }
  }
}
