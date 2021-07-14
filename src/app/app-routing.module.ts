import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { HomePageComponent } from './home-page/home-page.component'
// const routes: Routes = [];

const routes: Routes = [
  { path: 'chess/:id', component: ChessBoardComponent },
  { path: '**', component: HomePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
