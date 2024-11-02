import actionTypes from "../action-types";
import { gameState } from "../../game-state";

export const updateCastlingRights = (direction) => ({
  type: actionTypes.UPDATE_CASTLING_RIGHTS,
  payload: direction,
});

export const assertStalemate = () => {
  return {
    type: actionTypes.STALEMATE,
  };
};

export const assertInsufficientMaterial = () => {
  return {
    type: actionTypes.INSUFFICIENT_MATERIAL,
  };
};

export const assertCheckmate = (winner) => {
  return {
    type: actionTypes.CHECKMATE,
    payload: winner,
  };
};

export const setupNewGame = () => {
  return {
    type: actionTypes.START_NEW_GAME,
    payload: gameState,
  };
};
