import { Component, OnInit, Input, Inject, Output, EventEmitter} from '@angular/core';
import { AccountService } from '../account.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

export interface DialogData {
  loginCallback: (a: string) => void
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  game_id: string | null = null;
  @Output() login: EventEmitter<any> = new EventEmitter();
  @Output() logoutEvent: EventEmitter<any> = new EventEmitter();
  @Input() autoOpen: boolean = false;

  constructor(public dialog: MatDialog, public auth: AccountService, 
    private route: ActivatedRoute) {
      this.route.params.subscribe((val) => {
        this.game_id = val.id;
      });
  }
  
  ngOnInit(): void {
    if(this.autoOpen){
      this.auth.email.subscribe(
        (email) => {
          if(!email){
            this.openDialog(true);
          } else {
            this.login.emit("");
          }
        }
      )
    }
  }

  openDialog(disableClose: boolean = false) {
    const dialogRef = this.dialog.open(LoginDialogContent, {disableClose: disableClose });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.login.emit(result);
    });
  }

  logout(){
    this.logoutEvent.emit(this.auth.email);
    this.auth.logout();
  }
}

@Component({
  selector: 'login-dialog-content',
  templateUrl: 'login-dialog-content.html',
  styleUrls: ['./login.component.less']
})
export class LoginDialogContent {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogContent>,
    public auth: AccountService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  async loginWithGoogle() {
    await this.auth.loginWithGoogle();
    this.dialogRef.close('login');
  }

  loginAsGuest(){
    this.auth.loginAsGuest();
    this.dialogRef.close('login');
  }

  logout(){
    this.auth.logout();
    this.dialogRef.close('login');
  }
}