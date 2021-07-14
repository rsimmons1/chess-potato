import { Component, OnInit} from '@angular/core';
import { ChessPiece, ChessService, PlayerStatus } from '../chess.service';
import { AccountService } from '../account.service';
import { PieceType } from '../chess-piece/chess-piece.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.less']
})

export class ChessBoardComponent implements OnInit {
  valid_moves: [number, number][] = [];
  selected: [number, number] | null = null;
  show_snackbar : boolean = false;
  game_id: string = '';
  player_list: PlayerStatus[] = [];
  email: string = '';
  

  constructor(public chessService: ChessService, private route: ActivatedRoute,
              public accountService: AccountService) { 
    this.route.params.subscribe((val) => {
      this.chessService.setGameId(val.id);
      this.chessService.loadGame(val.id);
      this.game_id = val.id;
      this.valid_moves = [];
      this.selected = null;
      accountService.email.subscribe(
        (email) => {
          if(email && this.game_id){
            this.email = email;
            // this.chessService.addToQueue(email, this.game_id);
          }
        }
      );
      this.chessService.getPlayerQueue(this.game_id).snapshotChanges().subscribe(
        (val) => {
          console.log("player queue");
          console.log(val.payload.data());
          let db_player_list_data: any = val.payload.data();
          this.player_list = db_player_list_data.queue;
        }
      );
    });


  }

  ngOnInit(): void {
    this.route.params.subscribe((val) => {;
      this.chessService.loadGame(val.id);
      this.valid_moves = [];
      this.selected = null; 
    })
    // if(this.chessService.getGameId() != ""){
     
    // }

    console.log("Route params");

  }

  move(i: number, j: number): void {
    if(this.chessService.gameProperties.turn != this.chessService.board[i][j]?.color && !this.selected){
      return;
    }
    if(!this.selected){
      if(this.chessService.board[i][j] && 
        this.chessService.board[i][j]!.color == this.chessService.gameProperties.turn){
        this.selected = [i, j];
      }
    } else if(this.selected){
      let s_i = this.selected[0];
      let s_j = this.selected[1];
      if(s_i == i && s_j == j){
        this.valid_moves = [];
        this.selected = null;
        // this.chessService.addToQueue()
        return;
      }
      // Castling!
      if(this.chessService.board[i][j] && this.chessService.board[s_i][s_j]!.type == PieceType.KING &&
         this.chessService.board[i][j]!.type == PieceType.ROOK &&
         this.chessService.board[s_i][s_j]!.color == this.chessService.board[i][j]!.color
        ){
          this.valid_moves = [];
          let was_valid = this.chessService.moveTo(s_i, s_j, i, j);
          if(was_valid == false){
            this.showSnackbar();
          }
          this.selected = null;
          return;
      }
      if(this.chessService.board[i][j] && 
        this.chessService.board[i][j]?.color == this.chessService.board[this.selected[0]][this.selected[1]]?.color){
        this.selected = [i, j];
      } else if(this.locationIsValid(i, j)){
        this.valid_moves = [];
        let was_valid = this.chessService.moveTo(this.selected[0], this.selected[1], i, j);
        if(was_valid == false){
          this.showSnackbar();
        }
        this.selected = null;
        return;
      } else {
        this.selected = null;
        this.valid_moves = [];
        return;
      }
    }
    let valid_moves = this.chessService.getValidMoves(i, j);
    this.valid_moves = valid_moves;
  }

  updatePlayerStatus(){
    let selecting_status = this.selected ? 'selecting' : '';
    this.chessService.addToQueue(this.email, this.game_id, selecting_status, false);
  }

  locationIsValid(i: number, j: number): boolean {
    for(var position of this.valid_moves){
      if(position[0] == i && position[1] == j){
        return true
      }
    }
    return false;
  }

  locationIsCheck(i: number, j: number): boolean {
    let king_location_status = this.chessService.findPieces(
      PieceType.KING, this.chessService.gameProperties.turn);
    if(king_location_status.length == 0){
      return false;
    }
    let king_location: [number, number] = king_location_status[0];
    let is_check = this.chessService.isCheck(this.chessService.gameProperties.turn);
    if(i == king_location[0] && j == king_location[1] && is_check){
      return true;
    }
    return false;
  }

  locationIsLastMove(i: number, j: number): boolean {
    if(!this.chessService.gameProperties.previousMove){
      return false;
    }
    let last_move_location = this.chessService.gameProperties.previousMove!.position;
    if(i == last_move_location[0] && j == last_move_location[1]){
      return true;
    }
    return false;
    // this.chessService.
  }

  showSnackbar() {
    this.show_snackbar = true;
    let self = this;
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ self.show_snackbar = false;}, 1500);
  }

  getXAxis(turn: string, flip: boolean = false){
    if(turn == "white" || flip){
      return [1, 2, 3, 4, 5, 6, 7, 8];
    } else {
      return [8, 7, 6, 5, 4, 3, 2, 1];
    }
  }

  getYAxis(turn: string, flip: boolean = false){
    if(turn == "white" || flip){
      return [1, 2, 3, 4, 5, 6, 7, 8];
    } else {
      return [8, 7, 6, 5, 4, 3, 2, 1];
    }
  }

  joinGame() {
    this.accountService.email.subscribe(
      (email) => {
        console.log("Player", email, "is joining", this.game_id);
        if (email){
          this.chessService.addToQueue(email, this.game_id);
        }
      }
    )
  }

  leaveGame() {
    this.accountService.email.subscribe(
      (email) => {
        console.log("Player", email, "is leaving", this.game_id);
        if (email){
          this.chessService.removeFromQueue(email, this.game_id);
        }
      }
    )
  }
}
