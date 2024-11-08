import actionTypes from "./action-types";
import { gameStatus } from "../game-state";

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.MAKE_NEW_MOVE: {
      let { positions, turn, moveList } = state;
      turn = turn === "w" ? "b" : "w";
      positions = [...positions, action.payload.newPosition];
      moveList = [...moveList, action.payload.moveNotation];

      return {
        ...state,
        positions,
        turn,
        moveList,
      };
    }

    case actionTypes.GENERATE_CANDIDATE_MOVES: {
      return {
        ...state,
        candidateMoves: action.payload.candidateMoves,
      };
    }

    case actionTypes.CLEAR_CANDIDATE_MOVES: {
      return {
        ...state,
        candidateMoves: [],
      };
    }

    case actionTypes.TRIGGER_PAWN_PROMOTION: {
      return {
        ...state,
        status: gameStatus.promoting,
        promotionMoveCoords: { ...action.payload },
      };
    }

    case actionTypes.RESET_PAWN_PROMOTION_STATE: {
      return {
        ...state,
        status: gameStatus.ongoing,
        promotionMoveCoords: null,
      };
    }

    case actionTypes.UPDATE_CASTLING_RIGHTS: {
      let { turn, castleDirections } = state;
      castleDirections[turn] = action.payload;

      return {
        ...state,
        castleDirections,
      };
    }

    case actionTypes.HIGHLIGHT_LAST_MOVE: {
      return {
        ...state,
        lastMoveCoords: action.payload.lastMoveCoords,
      };
    }

    case actionTypes.TRIGGER_TAKE_BACK: {
      let {
        positions,
        turn,
        status,
        castleDirections,
        lastMoveCoords,
        moveList,
      } = state;

      if (positions.length > 1) {
        positions = positions.slice(0, positions.length - 1);
        turn = turn === "w" ? "b" : "w";
        status = gameStatus.ongoing;
        castleDirections = {
          w: "both",
          b: "both",
        };
        lastMoveCoords = { from: [], to: [] };
        moveList = moveList.slice(0, moveList.length - 1);
      }

      return {
        ...state,
        positions,
        turn,
        status,
        castleDirections,
        lastMoveCoords,
        moveList,
      };
    }

    case actionTypes.STALEMATE: {
      return {
        ...state,
        status: gameStatus.stalemate,
      };
    }

    case actionTypes.INSUFFICIENT_MATERIAL: {
      return {
        ...state,
        status: gameStatus.insufficientMaterial,
      };
    }

    case actionTypes.CHECKMATE: {
      return {
        ...state,
        status:
          action.payload === "w" ? gameStatus.whiteWins : gameStatus.blackWins,
      };
    }

    case actionTypes.START_NEW_GAME: {
      return {
        ...state,
        ...action.payload,
      };
    }

    default: {
      return state;
    }
  }
};
