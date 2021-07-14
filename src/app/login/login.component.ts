import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AccountService) {
  }

  ngOnInit(): void {
  }
}
