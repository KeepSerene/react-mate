import actionTypes from "../action-types";

export const triggerPawnPromotion = ({
  currentRank,
  currentFile,
  landingRank,
  landingFile,
}) => ({
  type: actionTypes.TRIGGER_PAWN_PROMOTION,
  payload: { currentRank, currentFile, landingRank, landingFile },
});

export const resetPawnPromotionState = () => ({
  type: actionTypes.RESET_PAWN_PROMOTION_STATE,
});
