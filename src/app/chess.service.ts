import { Injectable } from '@angular/core';
import {PieceType} from './chess-piece/chess-piece.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from "@angular/router";
import { nanoid } from 'nanoid'
import firestore from 'firebase/app';

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

  static fromJson(json_data: any): ChessPiece {
    return new this(json_data.type, json_data.color, json_data.hasMoved);
  }
  
}

interface GameProperties {
  turn: string,
  whiteTurnNumber: number,
  blackTurnNumber: number
  check: boolean,
  checkMate: boolean,
  previousMove: {
    piece: ChessPiece, 
    position: [number, number],
    pieceAtPosition: ChessPiece | null,
    madeBy: string,
    lastPosition: [number, number] | null
  } | null
}
// export default GameProperties, PlayerStatus;

interface PlayerStatus {
  name: string,
  status: string
}
export {GameProperties, PlayerStatus};


@Injectable({
  providedIn: 'root'
})
export class ChessService {
  board: (ChessPiece | null)[][];
  gameProperties: GameProperties = {
    turn:"white", 
    whiteTurnNumber:0, blackTurnNumber:0,
    check: false, checkMate: false,
    previousMove: null
  };
  gameId: string = "";
  dbName: string = "chess-board";
  dbQueueName: string = "chess-board-queue";
  history: {board: [], gameProperties: GameProperties}[];

  constructor(private firestore: AngularFirestore, private route: ActivatedRoute) {
    this.board = [];
    this.history = [];
    if(this.gameId){
      this.loadGame(this.gameId);
    } else{
      this.resetBoard(false);
    }
  }

  getGameId(): string{
    return this.gameId;
  }

  loadGame(game_id: string){
    this.resetBoard(true);
    console.log("Loading Game:", game_id);

    this.firestore.collection(this.dbName).doc(game_id).get().toPromise().then(
      (value) => {
        console.log("Specified Doc", value.data());
        let db_board_data: any = value.data();
        let game_history = db_board_data.history;
        this.history = game_history;
        if(game_history.length > 0){
          this.fromStateJson(game_history[game_history.length - 1]);
        }
      }
    );

    this.firestore.collection(this.dbName).snapshotChanges().subscribe(
      (val) => {
        let modified_doc = val.find((i) => {return i.type == "modified"});
        if(modified_doc) {
          if(modified_doc?.payload.doc.id == this.gameId){
            let json_payload: any = modified_doc!.payload.doc.data();
            let game_history = json_payload.history;
            this.history = game_history;
            console.log("Game History", this.history);
            this.resetBoard(true);
            this.fromStateJson(game_history[game_history.length - 1]);
          }
        }
        console.log("Values Changed");
        console.log(val.find((i) => {return i.type == "modified"})?.payload.doc.data());
        
        console.log(val);}
    );
  }

  resetBoard(empty_board: boolean = false): (ChessPiece | null)[][]{
    this.gameProperties = {
      turn:"white", 
      whiteTurnNumber:0, 
      blackTurnNumber:0,
      check: false,
      checkMate: false,
      previousMove: null
    };
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

      let direction_one_forward = [0, 1];
      let i_new_one_forward = i + sign*direction_one_forward[0];
      let j_new_one_forward = j + sign*direction_one_forward[1];

      if(this.inBoard(i_new_two_forward, j_new_two_forward) && 
        !this.board[i_new_two_forward][j_new_two_forward]?.type &&
        !this.board[i_new_one_forward][j_new_one_forward]?.type
        ){
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

      if (piece_type == PieceType.KING && !this.board[i][j]!.hasMoved){
        let rooks_positions: [number, number][] = this.findPieces(PieceType.ROOK, piece_color);
        let kingside_rook_position = null;
        let queenside_rook_position = null;

        for(var position of rooks_positions){
          let spaces_between = [];
          let delta = i - position[0];
          let positions_empty = true;
          for(var d = Math.min(i, position[0]) + 1; 
              d < Math.max(i, position[0]); d++){
                if(this.board[d][j]){
                  positions_empty = false;
                  break;
                }
          }
          if(!positions_empty){
            continue;
          }

          if(Math.abs(position[0] - i) == 3 
            && !this.board[position[0]][position[1]]!.hasMoved){
              kingside_rook_position = position;
              valid_moves.push([position[0], position[1]]);
          } else if(Math.abs(position[0] - i) == 4 
            && !this.board[position[0]][position[1]]!.hasMoved){
              queenside_rook_position = position;
              valid_moves.push([position[0], position[1]]);
          }
        }

        
      }
    }
    return valid_moves;
  }

  setGameId(game_id: string){
    this.gameId = game_id;
  }

  moveTo(i: number, j:number, k: number, l: number, 
        reset: boolean=false, player_id: string = ""): boolean {
    let piece_at_move_spot = this.board[k][l];
    let moving_piece = this.board[i][j];

    // Castling!
    if(moving_piece?.type == PieceType.KING &&
      piece_at_move_spot?.type == PieceType.ROOK &&
      piece_at_move_spot.color == moving_piece.color){
        let swap_direction = k - i;
        swap_direction = swap_direction / Math.abs(swap_direction);
        let new_king_position = [i + 2*swap_direction, j];
        let new_rook_position = [new_king_position[0] - swap_direction, j];

        this.board[new_king_position[0]][new_king_position[1]] = this.board[i][j];
        this.board[i][j] = null;
        this.board[new_rook_position[0]][new_rook_position[1]] = this.board[k][l];
        this.board[k][l] = null;

        if(this.isCheck(this.board[new_king_position[0]][new_king_position[1]]!.color)){
          this.board[i][j] = this.board[new_king_position[0]][new_king_position[1]];
          this.board[new_king_position[0]][new_king_position[1]] = null;
          this.board[k][l] = this.board[new_rook_position[0]][new_rook_position[1]];
          this.board[new_rook_position[0]][new_rook_position[1]] = null; 
          return false;
        }
        this.board[new_king_position[0]][new_king_position[1]]!.hasMoved = true;
        this.board[new_rook_position[0]][new_rook_position[1]]!.hasMoved = true;
        // piece_at_move_spot = null;
        k = new_king_position[0];
        l = new_king_position[1];
    } else {
      [this.board[k][l], this.board[i][j]] = [this.board[i][j], null];
      if(this.board[k][l]){
        if(this.isCheck(this.board[k][l]!.color)){
          [this.board[i][j], this.board[k][l]] = [this.board[k][l], piece_at_move_spot];
          return false;
        } else if (reset){
          [this.board[i][j], this.board[k][l]] = [this.board[k][l], piece_at_move_spot];
          return true;
        }
        else if(this.board[k][l]!.color == "white" && l == 0 
          && this.board[k][l]!.type == PieceType.PAWN){
          this.board[k][l]!.type = PieceType.QUEEN;
        } else if(this.board[k][l]!.color == "black" && l == this.board.length - 1
          && this.board[k][l]!.type == PieceType.PAWN){
          this.board[k][l]!.type = PieceType.QUEEN;
        }
      }
      this.board[k][l]!.hasMoved = true;
    }


    console.log("Game properties", this.gameProperties);
    if(this.gameProperties.turn == "white"){
      this.gameProperties.turn = "black";
      this.gameProperties.whiteTurnNumber += 1;
    } else if(this.gameProperties.turn == "black"){
      this.gameProperties.turn = "white";
      this.gameProperties.blackTurnNumber += 1;
    }

    if(this.isCheck(this.gameProperties.turn)){
      this.gameProperties.check = true;
      this.gameProperties.checkMate = this.isCheckMate(
        this.gameProperties.turn);
    } else {
      this.gameProperties.check = false;
      this.gameProperties.checkMate = false;
    }
    this.gameProperties.previousMove = {
      piece: this.board[k][l] as ChessPiece,
      position: [k, l],
      madeBy: player_id,
      pieceAtPosition: piece_at_move_spot,
      lastPosition: [i, j]
    };
    this.updateDB(this.getGameId());
    return true;
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
    let team_king_position_status = this.findPieces(PieceType.KING, team_color)
    if (team_king_position_status.length == 0){
      return false;
    }
    let team_king_position = team_king_position_status[0];

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

  isCheckMate(team_color: string): boolean{
    let all_possible_moves: [number, number][] = [];
    let count_valid_moves = 0;
    for(var j = 0; j < this.board.length; j++){
      for(var i = 0; i < this.board[0].length; i++){
        if(this.board[i][j]){
          if(this.board[i][j]!.color == team_color){
            let moves = this.getValidMoves(i, j);
            for(var move of moves){
              let move_status = this.moveTo(i, j, move[0], move[1], true);
              if(move_status){
                count_valid_moves += 1;
              }
            }
          } 
        }
      }
    }
    return (count_valid_moves > 0) ? false : true;
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
    state_json.gameProperties = JSON.parse(JSON.stringify(this.gameProperties));
    // console.log("Writing Properties", JSON.parse(JSON.stringify(this.gameProperties)));
    // state_json.gameProperties.turn = this.gameProperties.turn;
    // state_json.gameProperties.blackTurnNumber = this.gameProperties.blackTurnNumber;
    // state_json.gameProperties.whiteTurnNumber = this.gameProperties.whiteTurnNumber;
    // state_json.gameProperties.check = this.gameProperties.check;
    // state_json.gameProperties.checkMate = this.gameProperties.checkMate;

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

  newGame(game_id: string = ""){
    this.resetBoard();
    if(game_id == ""){
      this.gameId =  nanoid();
    } else {
      this.gameId = game_id;
    }

    console.log("Generating Game", this.gameId);
    if(this.gameId != ""){
      this.firestore.collection(this.dbQueueName).doc(game_id).set(
        {
          players: {},
          queue: []
        }
      )
      this.firestore.collection(this.dbName).doc(game_id).set({
        history: []
      });
      this.updateDB(this.gameId);
    }
  }

  getGames(): Observable<any[]>{
    return this.firestore.collection(this.dbName).get().pipe(
      map((val) => {
        var games = [];
        for(var doc of val.docs){
          let db_board_data: any = doc.data();
          console.log("Getting data", db_board_data);
          if(db_board_data.hasOwnProperty("history")){
            let game_history = db_board_data.history;
            db_board_data = game_history[game_history.length - 1];
          }
          games.push([doc.id, db_board_data]);
        }
        return games;
      })
    )
  }

  fromStateJson(state_json: any){
    this.gameProperties = {...state_json.gameProperties} as GameProperties;
    for(var board_piece of state_json.board){
      this.board[board_piece.i][board_piece.j] = new ChessPiece(
        board_piece.type, board_piece.color, board_piece.hasMoved);
    }
  }

  updateDB(game_id: string){
    let game_ref = this.firestore.collection(this.dbName).doc(game_id);
    game_ref.update({
      history: firestore.firestore.FieldValue.arrayUnion(this.stateToJson())
    });
  }

  // If not in Queue -> add to Queue
  // If in Queue -> do nothing
  // If front of Queue, your turn
  addToQueue(player_name: string, game_id: string, 
    status: string = '', exists_ok: boolean = true){
    let queue_ref = this.firestore.collection(this.dbQueueName).doc(game_id);
    let player: PlayerStatus = {
      "name": player_name,
      "status": status
    };

    queue_ref.get().subscribe(
      (queue_list) => {
        let player_queue: any = queue_list.data();
        let player_queue_list: PlayerStatus[] = player_queue.queue;
        let player_index = player_queue_list
          .findIndex((obj => obj.name == player.name));
        if(player_index < 0 && exists_ok){
          player_queue_list.push(player);
        } else {
          player_queue_list[player_index] = player;
        }
        player_queue.queue = player_queue_list;
        queue_ref.update(player_queue);
      }
    )
  }

  removeFromQueue(player_name: string, game_id: string){
    let queue_ref = this.firestore.collection(this.dbQueueName).doc(game_id);
    let player: PlayerStatus = {
      "name": player_name,
      "status": ''
    };

    queue_ref.get().subscribe(
      (queue_list) => {
        let player_queue: any = queue_list.data();
        let player_queue_list: PlayerStatus[] = player_queue.queue;
        let player_index = player_queue_list
          .findIndex((obj => obj.name == player.name));
        if(player_index >= 0){
          player_queue_list.splice(player_index, 1);
          player_queue.queue = player_queue_list;
          queue_ref.update(player_queue);
        }

      }
    )
  }

  getPlayerQueue(game_id: string){
    let queue_ref = this.firestore.collection(this.dbQueueName).doc(game_id);
    return queue_ref;
  }

  removeGame(game_id: string){
    this.firestore.collection(this.dbName).doc(game_id).delete();
    this.firestore.collection(this.dbQueueName).doc(game_id).delete();
  }
}
