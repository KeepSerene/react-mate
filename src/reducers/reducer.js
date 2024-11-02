import actionTypes from "./action-types";
import { gameStatus } from "../game-state";

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.MAKE_NEW_MOVE: {
      let { positions, turn, movesList } = state;
      turn = turn === "w" ? "b" : "w";
      positions = [...positions, action.payload.newPosition];
      movesList = [...movesList, action.payload.moveNotation];

      return {
        ...state,
        positions,
        turn,
        movesList,
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
      let { positions, turn, castleDirections, lastMoveCoords, movesList } =
        state;

      if (positions.length > 1) {
        positions = positions.slice(0, positions.length - 1);
        turn = turn === "w" ? "b" : "w";
        castleDirections = {
          w: "both",
          b: "both",
        };
        lastMoveCoords = { from: [], to: [] };
        movesList = movesList.slice(0, movesList.length - 1);
      }

      return {
        ...state,
        positions,
        turn,
        castleDirections,
        lastMoveCoords,
        movesList,
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
