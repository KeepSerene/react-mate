import "./modals.css";

// React imports
import React from "react";

// Context imports
import { useAppContext } from "../../contexts/Context";

// Other imports
import { gameStatus } from "../../game-state";
import { resetPawnPromotionState } from "../../reducers/actions/handle-modals";

function Modals({ children }) {
  const { appState, dispatch } = useAppContext();

  const dismissModal = () => {
    dispatch(resetPawnPromotionState());
  };

  if (appState.status === gameStatus.ongoing) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Game action required"
      className="modals"
    >
      {React.Children.toArray(children).map((child) =>
        React.cloneElement(child, { onClose: dismissModal })
      )}
    </div>
  );
}

export default Modals;
