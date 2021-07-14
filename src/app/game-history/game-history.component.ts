import { Component, OnInit } from '@angular/core';
import { GameProperties, ChessService } from '../chess.service';
import { ChessPiece } from '../chess.service';

@Component({
  selector: 'game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.less']
})
export class GameHistoryComponent implements OnInit {

  constructor(public readonly chessService: ChessService) { }

  positionToString(position: number[]): string {
      let alphabet: string[] = ["A", "B", "C", "D", "E", "F", "G", "h"]
      return `${alphabet[position[0]]}${position[1]}`;
  }

  getHistory(): any[] {
    let previous_moves: GameProperties[] = this.chessService.history.map(
      (val) => {return val.gameProperties}
    );
    previous_moves = previous_moves.filter((val) => {return val.previousMove});
    return previous_moves.map(
      (val) => {return val.previousMove}
    )
  }

  getColorSymbol(color: string): string {
    if(color == "white"){
      return "W";
    } else if(color == "black"){
      return "B";
    }
    return "";
  }

  ngOnInit(): void {
  }

}
