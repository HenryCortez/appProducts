import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() required!: boolean;

  @Input() icon!: string;
  @Input() type!: string;
  hide: boolean = true;
  isPassword!: boolean;

  constructor() {}

  ngOnInit() {
    if(this.type == 'password') this.isPassword = true;
  }
  hideOrShowPassword() {
    this.hide = !this.hide;
    if(this.hide) this.type = 'password';
    else this.type = 'text';
  }
}
