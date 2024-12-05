import { Component, inject, Input, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isModal: boolean = false;
  @Input() title: string = '';
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  dismiss() {
    if (this.isModal) {
       this.utilsSvc.dissmisModal();
    } else {
      // this.utilsSvc.routerLink('/home');
    }
  }
  @Input() backButton: string ='';

  constructor(
    
  ) {}

  ngOnInit() {}
}
