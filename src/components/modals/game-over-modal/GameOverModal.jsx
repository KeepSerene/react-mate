import "./game-over-modal.css";

// Context imports
import { useAppContext } from "../../../contexts/Context";

// Other imports
import { gameStatus } from "../../../game-state";
import { setupNewGame } from "../../../reducers/actions/game";

function GameOverModal() {
  const { appState, dispatch } = useAppContext();

  if (
    appState.status === gameStatus.ongoing ||
    appState.status === gameStatus.promoting
  ) {
    return null;
  }

  const hasWon = appState.status.endsWith("Wins!");
  const isStalemate = appState.status.endsWith("stalemate.");

  const statusClassName = Object.keys(gameStatus).find(
    (key) => gameStatus[key] === appState.status
  );

  return (
    <div className="modal game-over">
      <h2>{hasWon ? appState.status : isStalemate ? "Stalemate!" : "Draw!"}</h2>

      <p>{!hasWon && appState.status}</p>

      <div className={`status-img ${statusClassName}`}></div>

      <button
        type="button"
        onClick={() => dispatch(setupNewGame())}
        className="btn"
      >
        New game
      </button>
    </div>
  );
}

export default GameOverModal;
