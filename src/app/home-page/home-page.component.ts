import { Component, OnInit } from '@angular/core';
import { ChessService } from '../chess.service';
import {Router} from '@angular/router';
import { AccountService } from '../account.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less']
})
export class HomePageComponent implements OnInit {

  gameData: any[];
  constructor(public chessService: ChessService, public auth: AccountService, 
    private router: Router) { 
    var games_observable = this.chessService.getGames();
    this.gameData = [];
    games_observable.subscribe(
      (val) => {
        console.log("Got games");
        console.log(val);
        this.gameData = val;
      }
    )
  }

  goToGame(id: string){
    this.router.navigate(['./chess/'+id]);
  }

  ngOnInit(): void {
  }

  onSubmit(value: string): void {
    console.log("Printing val", value);
    value = value.split(" ").join("-");
    value = value.replace(/[^a-zA-Z0-9-_]/g, '');
    this.chessService.newGame(value);
    this.goToGame(value);
  }

  // sleep time expects milliseconds
  sleep (time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  deleteGame(gamd_id: string){
    this.chessService.removeGame(gamd_id);
    this.sleep(300).then(
      (val) => {
        location.reload();
      }
    );
  }
}
