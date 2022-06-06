import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'chess-piece',
  templateUrl: './chess-piece.component.html',
  styleUrls: ['./chess-piece.component.less']
})

export class ChessPieceComponent implements OnInit, OnChanges {
  moves: any;
  PieceType = PieceType;
  pieceIcon: string = "\u00A0";

  @Input() color: string | undefined = "white";
  @Input() type: PieceType | undefined = PieceType.PAWN;
  @Input() dontShow: boolean = false;

  constructor() { 
  }

  ngOnInit(): void {
    // if(this.type == PieceType.NONE){
    //   this.pieceIcon = ' ';
    // };
    if(this.dontShow){
      this.pieceIcon = "\u00A0";
      return;
    }
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
    if(this.dontShow){
      this.pieceIcon = "\u00A0";
      return;
    }
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
  QUEEN = "QUEEN",
  // NONE = "NONE"
}