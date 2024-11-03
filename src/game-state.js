import { getInitialPosition } from "./utils";

export const gameStatus = {
  ongoing: "Ongoing",
  promoting: "Promoting",
  whiteWins: "White Wins!",
  blackWins: "Black Wins!",
  stalemate: "Game drawn due to stalemate.",
  insufficientMaterial: "Game drawn due to insufficient material.",
};

export const gameState = {
  positions: [getInitialPosition()],
  turn: "w",
  status: gameStatus.ongoing,
  candidateMoves: [],
  promotionMoveCoords: null,
  castleDirections: {
    w: "both",
    b: "both",
  },
  lastMoveCoords: { from: [], to: [] },
  moveList: [],
};
