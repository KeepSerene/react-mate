import actionTypes from "../action-types";

export const makeNewMove = ({ newPosition, moveNotation }) => ({
  type: actionTypes.MAKE_NEW_MOVE,
  payload: { newPosition, moveNotation },
});

export const generateCandidateMoves = ({ candidateMoves }) => ({
  type: actionTypes.GENERATE_CANDIDATE_MOVES,
  payload: { candidateMoves },
});

export const clearCandidateMoves = () => ({
  type: actionTypes.CLEAR_CANDIDATE_MOVES,
});

export const highlightLastMove = ({ lastMoveCoords }) => ({
  type: actionTypes.HIGHLIGHT_LAST_MOVE,
  payload: { lastMoveCoords },
});

export const triggerTakeBack = () => ({
  type: actionTypes.TRIGGER_TAKE_BACK,
});
