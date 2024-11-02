import { copyPosition } from "../utils";

export function handleNonPawnMoves({
  currentPosition,
  piece,
  currentRank,
  currentFile,
  landingRank,
  landingFile,
}) {
  const newPosition = copyPosition(currentPosition);

  // Check for castling
  if (piece[1] === "k" && Math.abs(currentFile - landingFile) === 2) {
    // Check for long castling
    if (landingFile === 2) {
      newPosition[currentRank][0] = "";
      newPosition[currentRank][3] = piece[0] === "w" ? "wr" : "br";
    } else if (landingFile === 6) {
      newPosition[currentRank][7] = "";
      newPosition[currentRank][5] = piece[0] === "w" ? "wr" : "br";
    }
  }

  newPosition[currentRank][currentFile] = "";
  newPosition[landingRank][landingFile] = piece;

  return newPosition;
}

export function handlePawnMoves({
  currentPosition,
  piece,
  currentRank,
  currentFile,
  landingRank,
  landingFile,
}) {
  const newPosition = copyPosition(currentPosition);

  if (
    newPosition[landingRank][landingFile] === "" &&
    landingRank !== currentRank &&
    landingFile !== currentFile
  ) {
    newPosition[currentRank][landingFile] = "";
  }

  newPosition[currentRank][currentFile] = "";
  newPosition[landingRank][landingFile] = piece;

  return newPosition;
}
