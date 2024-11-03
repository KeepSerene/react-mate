/**
 * Converts a given code (1-based index) to a corresponding lowercase letter.
 * The code is assumed to represent an index starting from 'a' (1 -> 'a', 2 -> 'b', etc.).
 *
 * @param {number} code - The 1-based index to convert to a character.
 * @returns {string} The corresponding lowercase letter from 'a' to 'z'.
 */

export const getCharFromCode = (code) => String.fromCharCode(code + 96);

export const getInitialPosition = () => {
  const position = Array(8)
    .fill()
    .map((_) => Array(8).fill(""));

  for (let i = 0; i < 8; i++) {
    position[1][i] = "bp";
    position[6][i] = "wp";
  }

  position[0][0] = "br";
  position[0][1] = "bn";
  position[0][2] = "bb";
  position[0][3] = "bq";
  position[0][4] = "bk";
  position[0][5] = "bb";
  position[0][6] = "bn";
  position[0][7] = "br";

  position[7][0] = "wr";
  position[7][1] = "wn";
  position[7][2] = "wb";
  position[7][3] = "wq";
  position[7][4] = "wk";
  position[7][5] = "wb";
  position[7][6] = "wn";
  position[7][7] = "wr";

  return position;
};

export const copyPosition = (position) => {
  const newPosition = Array(8)
    .fill()
    .map((_) => Array(8).fill(""));

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      newPosition[i][j] = position[i][j];
    }
  }

  return newPosition;
};

export const areSameColoredSquares = (loc1, loc2) =>
  (loc1.rankIndex + loc1.fileIndex) % 2 ===
  (loc2.rankIndex + loc2.fileIndex) % 2;

export const findPieceLocations = (currentPosition, piece) => {
  const locations = [];

  currentPosition.forEach((rank, rankIndex) => {
    rank.forEach((fileContent, fileIndex) => {
      if (piece === fileContent) {
        locations.push({ rankIndex, fileIndex });
      }
    });
  });

  return locations;
};

// Get the algebraic notation for the move to be made
export const getMoveNotation = ({
  currentPosition,
  piece,
  currentRank,
  currentFile,
  landingRank,
  landingFile,
  promotionType,
  isCheck,
  isCheckmate,
}) => {
  let moveNotation = "";

  // Handle castling
  if (piece[1] === "k" && Math.abs(currentFile - landingFile) === 2) {
    return currentFile > landingFile ? "0-0-0" : "0-0";
  }

  if (piece[1] !== "p") {
    // Add piece letters for non-pawns
    moveNotation += piece[1].toUpperCase();

    // Add disambiguation
    const pieceLocations = findPieceLocations(currentPosition, piece);

    if (pieceLocations.length > 1) {
      // Add file to disambiguate
      moveNotation += getCharFromCode(currentFile + 1);
    }

    // Handle non-pawn captures
    if (currentPosition[landingRank][landingFile]) {
      moveNotation += "x";
    }
  } else if (currentRank !== landingRank && currentFile !== landingFile) {
    // Handle pawn captures
    moveNotation += `${getCharFromCode(currentFile + 1)}x`;
  }

  // Add the landing square
  moveNotation += `${getCharFromCode(landingFile + 1)}${8 - landingRank}`;

  // Add promotion if applicable
  if (promotionType) {
    moveNotation += `=${promotionType.toUpperCase()}`;
  }

  // Add check/checkmate
  if (isCheck && !isCheckmate) moveNotation += "+";
  else if (isCheckmate) moveNotation += "#";

  return moveNotation;
};
