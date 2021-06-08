import { Component, OnInit } from '@angular/core';
import { ChessService } from '../chess.service';
import GameProperties from '../chess.service';

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.less']
})

export class ChessBoardComponent implements OnInit {
  board_width;
  board_height;
  board;
  valid_moves: [number, number][];
  selected: [number, number] | null;
  gameProperties: GameProperties;

  constructor(public chessService: ChessService) { 
    this.board = chessService.board;
    this.board_width = chessService.board.length;
    this.board_height = chessService.board[0].length;
    this.valid_moves = [];
    this.selected = null;
    this.gameProperties = chessService.gameProperties;
  }

  ngOnInit(): void {
  }

  move(i: number, j: number): void {
    this.gameProperties = this.chessService.gameProperties;
    if(this.gameProperties.turn != this.board[i][j]?.color && !this.selected){
      return;
    }
    if(!this.selected){
      if(this.board[i][j]){
        this.selected = [i, j];
      }
    } else if(this.selected){
      console.log("Selected", this.selected);
      if(this.board[i][j] && 
        this.board[i][j]?.color == this.board[this.selected[0]][this.selected[1]]?.color){
        this.selected = [i, j];
      } else if(this.locationIsValid(i, j)){
        console.log("Moving To", i, j);
        this.valid_moves = [];
        console.log("Current Turn", this.gameProperties);
        this.chessService.moveTo(this.selected[0], this.selected[1], i, j);
        this.selected = null;

        return;
      } else {
        this.selected = null;
      }
    }
    console.log(i, j);
    let valid_moves = this.chessService.getValidMoves(i, j);
    this.valid_moves = valid_moves;
  }

  locationIsValid(i: number, j: number): boolean {
    for(var position of this.valid_moves){
      if(position[0] == i && position[1] == j){
        return true
      }
    }
    return false;
  }
}
