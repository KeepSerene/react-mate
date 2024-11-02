import "./positions.css";

// Nested component imports
import Piece from "./piece/Piece";

// React imports
import { useRef } from "react";

// Custom hook imports
import { useAppContext } from "../../contexts/Context";

// Helper function imports
import { getMoveNotation } from "../../utils";

// Other imports
import {
  clearCandidateMoves,
  highlightLastMove,
  makeNewMove,
} from "../../reducers/actions/move";
import { triggerPawnPromotion } from "../../reducers/actions/handle-modals";
import arbiter from "../../arbiter/arbiter";
import { getCastlingDirection } from "../../arbiter/piece-moves";
import {
  assertCheckmate,
  assertInsufficientMaterial,
  assertStalemate,
  updateCastlingRights,
} from "../../reducers/actions/game";

function Positions() {
  const { appState, dispatch } = useAppContext();

  // Get the latest position
  const currentPosition = appState.positions[appState.positions.length - 1];

  const positionsDivRef = useRef(null);

  // Allow drop
  const handleDragOver = (event) => event.preventDefault();

  const getLandingSquareCoords = (event) => {
    const { width, left, top } =
      positionsDivRef.current?.getBoundingClientRect();
    const squareSize = width / 8;
    const landingRank = Math.floor((event.clientY - top) / squareSize);
    const landingFile = Math.floor((event.clientX - left) / squareSize);

    return { landingRank, landingFile };
  };

  const triggerPawnPromotionModal = ({
    currentRank,
    currentFile,
    landingRank,
    landingFile,
  }) => {
    dispatch(
      triggerPawnPromotion({
        currentRank,
        currentFile,
        landingRank,
        landingFile,
      })
    );
  };

  const updateCastlingState = ({ piece, currentRank, currentFile }) => {
    const direction = getCastlingDirection({
      castleDirection: appState.castleDirections,
      piece,
      currentRank,
      currentFile,
    });

    if (direction) dispatch(updateCastlingRights(direction));
  };

  const performMove = (event) => {
    const { landingRank, landingFile } = getLandingSquareCoords(event);

    // Note that "rankIndex" & "fileIndex" are strings here
    const [piece, rankIndex, fileIndex] = event.dataTransfer
      .getData("text/plain")
      .split(", ");

    const lastMoveCoords = {
      from: [+rankIndex, +fileIndex],
      to: [landingRank, landingFile],
    };

    // From the list of candidate moves, make a move & register its coords
    if (
      appState.candidateMoves?.find(
        (pos) => pos[0] === landingRank && pos[1] === landingFile
      )
    ) {
      const opponent = piece[0] === "w" ? "b" : "w";
      const castleDirection = appState.castleDirections[appState.turn];

      if (
        (piece === "wp" && landingRank === 0) ||
        (piece === "bp" && landingRank === 7)
      ) {
        triggerPawnPromotionModal({
          currentRank: +rankIndex,
          currentFile: +fileIndex,
          landingRank,
          landingFile,
        });
        dispatch(highlightLastMove({ lastMoveCoords }));

        return;
      }

      if (piece[1] === "k" || piece[1] === "r") {
        updateCastlingState({
          piece,
          currentRank: +rankIndex,
          currentFile: +fileIndex,
        });
      }

      const newPosition = arbiter.getNewPosition({
        currentPosition,
        piece,
        currentRank: +rankIndex,
        currentFile: +fileIndex,
        landingRank,
        landingFile,
      });

      // Get the algebraic notation for the move to be made
      const moveNotation = getMoveNotation({
        currentPosition,
        piece,
        currentRank: +rankIndex,
        currentFile: +fileIndex,
        landingRank,
        landingFile,
      });

      dispatch(makeNewMove({ newPosition, moveNotation }));
      dispatch(highlightLastMove({ lastMoveCoords }));

      if (arbiter.isStalemate(newPosition, opponent, castleDirection)) {
        dispatch(assertStalemate());
      } else if (arbiter.hasInsufficientMaterial(newPosition)) {
        dispatch(assertInsufficientMaterial());
      } else if (arbiter.isCheckmate(newPosition, opponent, castleDirection)) {
        dispatch(assertCheckmate(appState.turn));
      }
    }

    dispatch(clearCandidateMoves());
  };

  const handleDrop = (event) => {
    event.preventDefault();

    performMove(event);
  };

  return (
    <div
      className="positions"
      ref={positionsDivRef}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {currentPosition.map((rank, rankIndex) =>
        rank.map((_, fileIndex) =>
          currentPosition[rankIndex][fileIndex] ? (
            <Piece
              key={`${rankIndex}${fileIndex}`}
              rankIndex={rankIndex}
              fileIndex={fileIndex}
              piece={currentPosition[rankIndex][fileIndex]}
            />
          ) : null
        )
      )}
    </div>
  );
}

export default Positions;
