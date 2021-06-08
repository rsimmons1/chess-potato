import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'chess-piece',
  templateUrl: './chess-piece.component.html',
  styleUrls: ['./chess-piece.component.less']
})

export class ChessPieceComponent implements OnInit, OnChanges {
  moves: any;
  PieceType = PieceType;
  pieceIcon: string = "";

  @Input() color: string = "white";
  @Input() type: PieceType = PieceType.PAWN;

  constructor() { 
  }

  ngOnInit(): void {
    if(this.type == PieceType.PAWN && this.color == "white"){
      this.pieceIcon = '♙';
    };
    if(this.type == PieceType.ROOK && this.color == "white"){
      this.pieceIcon = '♖';
    };
    if(this.type == PieceType.KNIGHT && this.color == "white"){
      this.pieceIcon = '♘';
    };
    if(this.type == PieceType.BISHOP && this.color == "white"){
      this.pieceIcon = '♗';
    };
    if(this.type == PieceType.KING && this.color == "white"){
      this.pieceIcon = '♔';
    };
    if(this.type == PieceType.QUEEN && this.color == "white"){
      this.pieceIcon = '♕';
    };
    if(this.type == PieceType.PAWN && this.color == "black"){
        this.pieceIcon = '♟︎'; 
    };
    if(this.type == PieceType.ROOK && this.color == "black"){
      this.pieceIcon = '♜';
    };
    if(this.type == PieceType.KNIGHT && this.color == "black"){
      this.pieceIcon = '♞';
    };
    if(this.type == PieceType.BISHOP && this.color == "black"){
      this.pieceIcon = '♝';
    };
    if(this.type == PieceType.KING && this.color == "black"){
      this.pieceIcon = '♚';
    };
    if(this.type == PieceType.QUEEN && this.color == "black"){
      this.pieceIcon = '♛';
    };
  }

  ngOnChanges(): void{
    if(this.type == PieceType.PAWN && this.color == "white"){
      this.pieceIcon = '♙';
    };
    if(this.type == PieceType.ROOK && this.color == "white"){
      this.pieceIcon = '♖';
    };
    if(this.type == PieceType.KNIGHT && this.color == "white"){
      this.pieceIcon = '♘';
    };
    if(this.type == PieceType.BISHOP && this.color == "white"){
      this.pieceIcon = '♗';
    };
    if(this.type == PieceType.KING && this.color == "white"){
      this.pieceIcon = '♔';
    };
    if(this.type == PieceType.QUEEN && this.color == "white"){
      this.pieceIcon = '♕';
    };
    if(this.type == PieceType.PAWN && this.color == "black"){
        this.pieceIcon = '♟︎';
    };
    if(this.type == PieceType.ROOK && this.color == "black"){
      this.pieceIcon = '♜';
    };
    if(this.type == PieceType.KNIGHT && this.color == "black"){
      this.pieceIcon = '♞';
    };
    if(this.type == PieceType.BISHOP && this.color == "black"){
      this.pieceIcon = '♝';
    };
    if(this.type == PieceType.KING && this.color == "black"){
      this.pieceIcon = '♚';
    };
    if(this.type == PieceType.QUEEN && this.color == "black"){
      this.pieceIcon = '♛';
    };
  }
}


export enum PieceType {
  PAWN = "PAWN",
  ROOK = "ROOK",
  KNIGHT = "KNIGHT",
  BISHOP = "BISHOP",
  KING = "KING",
  QUEEN = "QUEEN"
}