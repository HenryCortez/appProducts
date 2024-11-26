import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() isModal: boolean = false;
  @Input() title: string = '';
  dismiss() {
    throw new Error('Method not implemented.');
  }
  @Input() backButton: string ='';

  constructor(
    
  ) {}

  ngOnInit() {}
}
