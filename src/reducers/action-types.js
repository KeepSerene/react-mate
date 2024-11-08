const actionTypes = {
  MAKE_NEW_MOVE: "MAKE_NEW_MOVE",
  GENERATE_CANDIDATE_MOVES: "GENERATE_CANDIDATE_MOVES",
  CLEAR_CANDIDATE_MOVES: "CLEAR_CANDIDATE_MOVES",
  TRIGGER_PAWN_PROMOTION: "TRIGGER_PAWN_PROMOTION",
  RESET_PAWN_PROMOTION_STATE: "RESET_PAWN_PROMOTION_STATE",
  UPDATE_CASTLING_RIGHTS: "UPDATE_CASTLING_RIGHTS",
  HIGHLIGHT_LAST_MOVE: "HIGHLIGHT_LAST_MOVE",
  TRIGGER_TAKE_BACK: "TRIGGER_TAKE_BACK",
  STALEMATE: "STALEMATE",
  INSUFFICIENT_MATERIAL: "INSUFFICIENT_MATERIAL",
  CHECKMATE: "CHECKMATE",
  START_NEW_GAME: "START_NEW_GAME",
};

export default actionTypes;
