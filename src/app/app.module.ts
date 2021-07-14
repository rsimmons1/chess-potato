import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { ChessPieceComponent } from './chess-piece/chess-piece.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { PERSISTENCE } from '@angular/fire/auth';
import { GameHistoryComponent } from './game-history/game-history.component'

@NgModule({
  declarations: [
    AppComponent,
    ChessBoardComponent,
    ChessPieceComponent,
    HomePageComponent,
    LoginComponent,
    GameHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [
    { provide: PERSISTENCE, useValue: 'local' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
