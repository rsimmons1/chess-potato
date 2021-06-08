import { Injectable } from '@angular/core';
import {PieceType} from './chess-piece/chess-piece.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from "@angular/router";

export class ChessPiece {
  type: PieceType;
  color: string;
  hasMoved: boolean = false;

  constructor(type: PieceType, color:string, hasMoved: boolean = false){
    this.type = type;
    this.color = color;
    this.hasMoved = hasMoved;
  }

  toJson():{[k: string]: any}{
    let json_data: {[k: string]: any} = {};
    json_data.type = this.type;
    json_data.color = this.color;
    json_data.hasMoved = this.hasMoved;
    return json_data;
  }

  static fromJson(json_data: {[k: string]: any}): ChessPiece {
    return new this(json_data.type, json_data.color, json_data.hasMoved);
  }
}

interface GameProperties {
  turn: string,
  whiteTurnNumber: number,
  blackTurnNumber: number
}
export default GameProperties;


@Injectable({
  providedIn: 'root'
})
export class ChessService {
  board: (ChessPiece | null)[][];
  gameProperties: GameProperties = {turn:"white", whiteTurnNumber:0, blackTurnNumber:0};
  gameId: string = "";
  dbName: string = "chess-board"
  constructor(private firestore: AngularFirestore, private route: ActivatedRoute) {
    console.log(window.location.pathname);
    if(window.location.pathname.split("/").length >= 2){
      this.gameId = window.location.pathname.split("/")[2];
    }


    this.board = [];

    // firestore.collection("chess-boards").doc("test").get().toPromise().then(
    //   (value) => {
    //     console.log("Specified Doc", value.data());
    //   }
    // )
    if(this.gameId){
      this.resetBoard(true);

      firestore.collection(this.dbName).doc(this.gameId).get().toPromise().then(
        (value) => {
          console.log("Specified Doc", value.data());
          let db_board_data: { [k: string]: any; } = value.data() as { [k: string]: any; } ;
          if(db_board_data){
            this.fromStateJson(db_board_data);
          }
        }
      )
    } else{
      this.resetBoard(false);
    }

  }

  resetBoard(empty_board: boolean = false): (ChessPiece | null)[][]{
    this.gameProperties = {
      turn:"white", 
      whiteTurnNumber:0, 
      blackTurnNumber:0};
    let piece_order: PieceType[] = [
      PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP, 
      PieceType.KING, PieceType.QUEEN, PieceType.BISHOP,
      PieceType.KNIGHT, PieceType.ROOK
    ];
    this.board = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];
    if(!empty_board){
      for(var j: number = 0; j < 8; j++){
        for(var i: number = 0; i < 8; i++){
          if(j == 0){
            this.board[i][j] = new ChessPiece(piece_order[i], "black");
          }
          if(j == 1){
            this.board[i][j] = new ChessPiece(PieceType.PAWN, "black");
          }
          if(j == 6){
            this.board[i][j] = new ChessPiece(PieceType.PAWN, "white");
          }
          if(j == 7){
            this.board[i][j] = new ChessPiece(piece_order[7-i], "white");
          }
        }
      }
    }
    return [];
  }

  // function returns the directions and amount that a piece can move
  // it encodes this as an array of [(direction, amount), ..,] where
  // direction = [x, y] (signed)
  // amount = 1 or (-1 if no limit)
  getMoves(pieceType: PieceType): [number[],number][]{
    switch(pieceType as PieceType){
      case PieceType.PAWN:
        return [
          [[0, 1], 1]
        ];
      case PieceType.ROOK:
        return [
          [[0, 1], -1],
          [[0, -1], -1],
          [[-1, 0], -1],
          [[1, 0], -1],
        ]; 
      case PieceType.KNIGHT:
        return [
          [[1, 2], 1],
          [[-1, 2], 1],
          [[-2, 1], 1],
          [[-2, -1], 1],
          [[1, -2], 1],
          [[-1, -2], 1],
          [[2, 1], 1],
          [[2, -1], 1],
        ];
      case PieceType.BISHOP:
        return [
          [[1, 1], -1],
          [[-1, 1], -1],
          [[1, -1], -1],
          [[-1, -1], -1]
        ];
      case PieceType.KING:
        return [
          [[0, 1], 1],
          [[-1, 1], 1],
          [[-1, 0], 1],
          [[-1, -1], 1],
          [[0, -1], 1],
          [[1, -1], 1],
          [[1, 0], 1],
          [[1, 1], 1]
        ]; 
      case PieceType.QUEEN:
        return [
          [[0, 1], -1],
          [[-1, 1], -1],
          [[-1, 0], -1],
          [[-1, -1], -1],
          [[0, -1], -1],
          [[1, -1], -1],
          [[1, 0], -1],
          [[1, 1], -1]
        ]; 
    }
  }

  inBoard(i: number, j: number): boolean{
    if (i < 0 || j < 0){
      return false;
    }
    if (i >= this.board[0].length || j >= this.board.length){
      return false;
    }
    return true;
  }

  getPawnMoves(i: number, j: number): [number, number][]{
    let valid_moves: [number, number][] = [];
    let piece_type: PieceType = this.board[i][j]!.type;
    let piece_color: string = this.board[i][j]!.color;
    let moves_list = this.getMoves(piece_type);
    let sign = (piece_color == "white") ? -1 : 1;

    let direction = [0, 1];
    let i_new = i + sign*direction[0];
    let j_new = j + sign*direction[1];
    if(this.inBoard(i_new, j_new) && 
      !this.board[i_new][j_new]?.type){
      valid_moves.push([i_new, j_new]);
    }

    let direction_right = [1, 1];
    let i_new_right = i + sign*direction_right[0];
    let j_new_right = j + sign*direction_right[1];
    if(this.inBoard(i_new_right, j_new_right) && 
      this.board[i_new_right][j_new_right]?.type){
      if(this.board[i_new_right][j_new_right]?.color != piece_color){
        valid_moves.push([i_new_right, j_new_right])
      }
    }

    let direction_left = [-1, 1];
    let i_new_left = i + sign*direction_left[0];
    let j_new_left = j + sign*direction_left[1];
    if(this.inBoard(i_new_left, j_new_left) && 
      this.board[i_new_left][j_new_left]?.type){
      if(this.board[i_new_left][j_new_left]?.color != piece_color){
        valid_moves.push([i_new_left, j_new_left])
      }
    }

    if(this.board[i][j]!.hasMoved == false){
      let direction_two_forward = [0, 2];
      let i_new_two_forward = i + sign*direction_two_forward[0];
      let j_new_two_forward = j + sign*direction_two_forward[1];

      if(this.inBoard(i_new_two_forward, j_new_two_forward) && 
        !this.board[i_new_two_forward][j_new_two_forward]?.type){
        valid_moves.push([i_new_two_forward, j_new_two_forward]);
      }
    }
    return valid_moves;
  }

  getValidMoves(i: number, j:number): [number, number][]{
    let valid_moves: [number, number][] = [];
    if(this.board[i][j]){
      let piece_type: PieceType = this.board[i][j]!.type;
      let piece_color: string = this.board[i][j]!.color;
      let moves_list = this.getMoves(piece_type);
      let sign = (piece_color == "white") ? -1 : 1;

      if(piece_type == PieceType.PAWN){
        return this.getPawnMoves(i, j);
      }
      for (var move_info of moves_list) {
        let direction: number[] = move_info[0];
        let limit: number = move_info[1];
        limit = (limit < 0) ? Infinity : limit;
        let count = 0;
        let i_new = i + sign*direction[0];
        let j_new = j + sign*direction[1];

        while(this.inBoard(i_new, j_new) && count < limit){
          if(this.board[i_new][j_new] && this.board[i_new][j_new]!.color == piece_color){
              break;
          }
          if(this.board[i_new][j_new] && this.board[i_new][j_new]!.color != piece_color){
            valid_moves.push([i_new, j_new]);
            break;
          }
          else{
            valid_moves.push([i_new, j_new]);
          }
          i_new = i_new + sign*direction[0];
          j_new = j_new + sign*direction[1];
          count += 1;
        }
      }
    }
    return valid_moves;
  }

  moveTo(i: number, j:number, k: number, l: number) {
    let piece_at_move_spot = null;
    if(this.board[k][l]){
      piece_at_move_spot = {...this.board[k][l]} as ChessPiece;
    }
    [this.board[k][l], this.board[i][j]] = [this.board[i][j], null];
    if(this.board[k][l]){
      if(this.isCheck(this.board[k][l]!.color)){
        [this.board[i][j], this.board[k][l]] = [this.board[k][l], piece_at_move_spot];
        return;
      }
    }

    this.board[k][l]!.hasMoved = true;
    console.log("Game properties", this.gameProperties);
    if(this.gameProperties.turn == "white"){
      this.gameProperties.turn = "black";
      this.gameProperties.whiteTurnNumber += 1;
    } else if(this.gameProperties.turn == "black"){
      this.gameProperties.turn = "white";
      this.gameProperties.blackTurnNumber += 1;
    }
    if(this.gameId != ""){
      this.updateDB(this.gameId);
    }
  }

  findPieces(type: PieceType, color:string): [number, number][]{
    let found_positions: [number, number][] = [];
    for(var j = 0; j < this.board.length; j++){
      for(var i = 0; i < this.board[0].length; i++){
        if(this.board[i][j]){
          if(this.board[i][j]!.color == color &&
            this.board[i][j]!.type == type){
              found_positions.push([i, j]);
            }
        }
      }
    }
    return found_positions;
  }

  isCheck(team_color: string): boolean{
    let enemy_color: string = (team_color == "white") ? "black" : "white";
    let all_possible_moves: [number, number][] = [];
    let team_king_position = this.findPieces(PieceType.KING, team_color)[0];
    for(var j = 0; j < this.board.length; j++){
      for(var i = 0; i < this.board[0].length; i++){
        if(this.board[i][j]){
          if(this.board[i][j]!.color == enemy_color){
            all_possible_moves = [...all_possible_moves, ...this.getValidMoves(i, j)];
          } 
        }
      }
    }

    return this.positionInArray(
      team_king_position[0], team_king_position[1], 
      all_possible_moves) ? true : false;
  }

  positionInArray(i: number, j: number, 
                  position_array: [number, number][]): boolean {
    for(var position of position_array){
      if(position[0] == i && position[1] == j){
        return true
      }
    }
    return false;
  }

  stateToJson(): {[k: string]: any}{
    let state_json: {[k: string]: any} = {};
    state_json.board = [];
    state_json.gameProperties = {};
    state_json.gameProperties.turn = this.gameProperties.turn;
    state_json.gameProperties.blackTurnNumber = this.gameProperties.blackTurnNumber;
    state_json.gameProperties.whiteTurnNumber = this.gameProperties.whiteTurnNumber;
    for(var j = 0; j < this.board.length; j++){
      for(var i = 0; i < this.board[0].length; i++){
        if(this.board[i][j]){
          let piece_info = this.board[i][j]!.toJson();
          piece_info.i = i;
          piece_info.j = j;
          state_json.board.push(piece_info);
        }
      }
    }
    return state_json;
  }

  newGame(){
    this.resetBoard();
    if(this.gameId != ""){
      this.updateDB(this.gameId);
    }
  }

  fromStateJson(state_json: {[k: string]: any}){
    this.gameProperties = {...state_json.gameProperties} as GameProperties;
    for(var board_piece of state_json.board){
      this.board[board_piece.i][board_piece.j] = ChessPiece.fromJson(board_piece);
    }
  }

  updateDB(game_id: string){
    // this.firestore.createId
    console.log("Updating Chess Game Id", this.gameId);
    this.firestore.collection(this.dbName).doc(this.gameId).set(
      this.stateToJson());
  }

  testBoard(){
    return {
      "board":
      [{"type":"ROOK","color":"black","hasMoved":false,"i":0,"j":0},
      {"type":"KNIGHT","color":"black","hasMoved":false,"i":1,"j":0},
      {"type":"BISHOP","color":"black","hasMoved":false,"i":2,"j":0},
      {"type":"KING","color":"black","hasMoved":false,"i":3,"j":0},
      {"type":"QUEEN","color":"black","hasMoved":false,"i":4,"j":0},
      {"type":"BISHOP","color":"black","hasMoved":false,"i":5,"j":0},
      {"type":"KNIGHT","color":"black","hasMoved":false,"i":6,"j":0},
      {"type":"ROOK","color":"black","hasMoved":false,"i":7,"j":0}, 
      {"type":"PAWN","color":"black","hasMoved":false,"i":1,"j":1},
      {"type":"PAWN","color":"black","hasMoved":false,"i":2,"j":1},
      {"type":"PAWN","color":"black","hasMoved":false,"i":3,"j":1},
      {"type":"PAWN","color":"black","hasMoved":false,"i":4,"j":1},
      {"type":"PAWN","color":"black","hasMoved":false,"i":5,"j":1},
      {"type":"PAWN","color":"black","hasMoved":false,"i":6,"j":1},
      {"type":"PAWN","color":"black","hasMoved":false,"i":7,"j":1},
      {"type":"PAWN","color":"black","hasMoved":true,"i":0,"j":3},
      {"type":"PAWN","color":"white","hasMoved":true,"i":7,"j":4},
      {"type":"PAWN","color":"white","hasMoved":false,"i":0,"j":6},
      {"type":"PAWN","color":"white","hasMoved":false,"i":1,"j":6},
      {"type":"PAWN","color":"white","hasMoved":false,"i":2,"j":6},
      {"type":"PAWN","color":"white","hasMoved":false,"i":3,"j":6},{"type":"PAWN","color":"white","hasMoved":false,"i":4,"j":6},{"type":"PAWN","color":"white","hasMoved":false,"i":5,"j":6},{"type":"PAWN","color":"white","hasMoved":false,"i":6,"j":6},{"type":"ROOK","color":"white","hasMoved":false,"i":0,"j":7},{"type":"KNIGHT","color":"white","hasMoved":false,"i":1,"j":7},{"type":"BISHOP","color":"white","hasMoved":false,"i":2,"j":7},{"type":"QUEEN","color":"white","hasMoved":false,"i":3,"j":7},{"type":"KING","color":"white","hasMoved":false,"i":4,"j":7},{"type":"BISHOP","color":"white","hasMoved":false,"i":5,"j":7},{"type":"KNIGHT","color":"white","hasMoved":false,"i":6,"j":7},{"type":"ROOK","color":"white","hasMoved":false,"i":7,"j":7}],"gameProperties":{"turn":"white","blackTurnNumber":0,"whiteTurnNumber":2}};
  }
}
