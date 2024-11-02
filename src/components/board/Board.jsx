import "./board.css";

// Helper function imports
import { getCharFromCode } from "../../utils";

// Nested component imports
import Square from "./square/Square";

// Component imports
import Positions from "../positions/Positions";
import Modals from "../modals/Modals";
import PawnPromotionModal from "../modals/pawn-promotion-modal/PawnPromotionModal";
import GameOverModal from "../modals/game-over-modal/GameOverModal";

// Context imports
import { useAppContext } from "../../contexts/Context";

// Other imports
import arbiter from "../../arbiter/arbiter";
import { getKingPos } from "../../arbiter/piece-moves";

function Board() {
  // Rows
  const rankCoords = Array(8)
    .fill()
    .map((_, index) => 8 - index);

  // Columns
  const fileCoords = Array(8)
    .fill()
    .map((_, index) => index + 1);

  const { appState } = useAppContext();
  const currentPosition = appState.positions[appState.positions.length - 1];

  // IIFE - calling it once per render
  const kingPosInCheck = (() => {
    const isInCheck = arbiter.isInCheck({
      currentPosition: undefined,
      newPosition: currentPosition,
      currentPlayer: appState.turn,
    });

    if (isInCheck) return getKingPos(currentPosition, appState.turn);

    return null;
  })();

  const getSquareColorClassName = (rowIndex, colIndex) => {
    let colorClassName = (rowIndex + colIndex) % 2 === 0 ? "light" : "dark";

    // Highlight candidate moves
    if (
      appState.candidateMoves?.find(
        (pos) => pos[0] === rowIndex && pos[1] === colIndex
      )
    ) {
      // Check to see if the legal square contains an enemy piece
      if (currentPosition[rowIndex][colIndex]) colorClassName += " attacked";
      else colorClassName += " highlighted";
    }

    // Highlight the king square when in check
    if (
      kingPosInCheck &&
      kingPosInCheck[0] === rowIndex &&
      kingPosInCheck[1] === colIndex
    ) {
      colorClassName += " in-check";
    }

    // Highlight the last move
    if (
      (appState.lastMoveCoords.from?.[0] === rowIndex &&
        appState.lastMoveCoords.from?.[1] === colIndex) ||
      (appState.lastMoveCoords.to?.[0] === rowIndex &&
        appState.lastMoveCoords.to?.[1] === colIndex)
    ) {
      colorClassName += " last-move";
    }

    return colorClassName;
  };

  return (
    <div className="board">
      <div className="squares">
        {rankCoords.map((rank, rankIndex) =>
          fileCoords.map((file, fileIndex) => (
            <Square
              key={`${file}${rank}`}
              rank={rank}
              file={getCharFromCode(file)}
              color={getSquareColorClassName(rankIndex, fileIndex)}
            />
          ))
        )}
      </div>

      <Positions />

      <Modals>
        <PawnPromotionModal />

        <GameOverModal />
      </Modals>
    </div>
  );
}

export default Board;
