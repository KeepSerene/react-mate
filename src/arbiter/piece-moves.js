import arbiter from "./arbiter";

export function getRookMoves({ currentPosition, piece, rankIndex, fileIndex }) {
  const validMoves = [];
  const us = piece[0];
  const opponent = us === "w" ? "b" : "w";
  const directions = [
    [-1, 0], // Left
    [1, 0], // Right
    [0, -1], // Up
    [0, 1], // Down
  ];

  directions.forEach((direction) => {
    for (let i = 1; i < 8; i++) {
      const posX = rankIndex + i * direction[0];
      const posY = fileIndex + i * direction[1];

      if (currentPosition?.[posX]?.[posY] === undefined) break; // Out of bounds
      if (currentPosition[posX][posY].startsWith(us)) break; // Can't capture the same coloured piece
      if (currentPosition[posX][posY].startsWith(opponent)) {
        validMoves.push([posX, posY]); // Capture an enemy piece
        break;
      }

      validMoves.push([posX, posY]); // Move to an empty square
    }
  });

  return validMoves;
}

export function getKnightMoves({
  currentPosition,
  piece,
  rankIndex,
  fileIndex,
}) {
  const validMoves = [];
  const opponent = piece[0] === "w" ? "b" : "w";
  const directions = [
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1],
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
  ];

  directions.forEach((direction) => {
    const landingSquare =
      currentPosition?.[rankIndex + direction[0]]?.[fileIndex + direction[1]];

    if (
      landingSquare !== undefined &&
      (landingSquare.startsWith(opponent) || landingSquare === "")
    ) {
      validMoves.push([rankIndex + direction[0], fileIndex + direction[1]]);
    }
  });

  return validMoves;
}

export function getBishopMoves({
  currentPosition,
  piece,
  rankIndex,
  fileIndex,
}) {
  const validMoves = [];
  const us = piece[0];
  const opponent = us === "w" ? "b" : "w";
  const directions = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];

  directions.forEach((direction) => {
    for (let i = 1; i < 8; i++) {
      const posX = rankIndex + i * direction[0];
      const posY = fileIndex + i * direction[1];

      if (currentPosition?.[posX]?.[posY] === undefined) break; // Out of bounds
      if (currentPosition[posX][posY].startsWith(us)) break; // Can't capture the same coloured piece
      if (currentPosition[posX][posY].startsWith(opponent)) {
        validMoves.push([posX, posY]); // Capture an enemy piece
        break;
      }

      validMoves.push([posX, posY]); // Move to an empty square
    }
  });

  return validMoves;
}

export function getQueenMoves({
  currentPosition,
  piece,
  rankIndex,
  fileIndex,
}) {
  const validMoves = [
    ...getRookMoves({ currentPosition, piece, rankIndex, fileIndex }),
    ...getBishopMoves({ currentPosition, piece, rankIndex, fileIndex }),
  ];
  return validMoves;
}

export function getKingMoves({ currentPosition, piece, rankIndex, fileIndex }) {
  const validMoves = [];
  const us = piece[0];
  const directions = [
    [-1, -1],
    [-1, 0],
    [1, -1],
    [0, 1],
    [1, 1],
    [1, 0],
    [-1, 1],
    [0, -1],
  ];

  directions.forEach((direction) => {
    const posX = rankIndex + direction[0];
    const posY = fileIndex + direction[1];

    if (
      currentPosition?.[posX]?.[posY] !== undefined &&
      !currentPosition[posX][posY].startsWith(us)
    ) {
      validMoves.push([posX, posY]);
    }
  });

  return validMoves;
}

export function getPawnMoves({ currentPosition, piece, rankIndex, fileIndex }) {
  const validMoves = [];
  const rankDirection = piece === "wp" ? -1 : 1;

  // Advance one square
  if (currentPosition?.[rankIndex + rankDirection]?.[fileIndex] === "") {
    validMoves.push([rankIndex + rankDirection, fileIndex]);
  }

  // Advance two squares: check to see if the pawns are in their initial ranks
  if (rankIndex % 5 === 1) {
    if (
      currentPosition?.[rankIndex + rankDirection]?.[fileIndex] === "" &&
      currentPosition?.[rankIndex + 2 * rankDirection]?.[fileIndex] === ""
    ) {
      validMoves.push([rankIndex + 2 * rankDirection, fileIndex]);
    }
  }

  return validMoves;
}

export function getPawnCaptures({
  currentPosition,
  prevPosition,
  piece,
  rankIndex,
  fileIndex,
}) {
  const validCaptures = [];
  const opponent = piece[0] === "w" ? "b" : "w";
  const rankDirection = piece === "wp" ? -1 : 1;

  // Left capture
  if (
    currentPosition?.[rankIndex + rankDirection]?.[fileIndex - 1] &&
    currentPosition?.[rankIndex + rankDirection]?.[fileIndex - 1].startsWith(
      opponent
    )
  ) {
    validCaptures.push([rankIndex + rankDirection, fileIndex - 1]);
  }

  // Right capture
  if (
    currentPosition?.[rankIndex + rankDirection]?.[fileIndex + 1] &&
    currentPosition?.[rankIndex + rankDirection]?.[fileIndex + 1].startsWith(
      opponent
    )
  ) {
    validCaptures.push([rankIndex + rankDirection, fileIndex + 1]);
  }

  // The En Passant rule
  const enemyPawn = rankDirection === -1 ? "bp" : "wp";
  const adjacentFileIndices = [fileIndex - 1, fileIndex + 1];

  if (prevPosition) {
    if (
      (rankDirection === -1 && rankIndex === 3) ||
      (rankDirection === 1 && rankIndex === 4)
    ) {
      adjacentFileIndices.forEach((adjacentFileIndex) => {
        if (
          currentPosition?.[rankIndex]?.[adjacentFileIndex] === enemyPawn &&
          currentPosition?.[rankIndex + 2 * rankDirection]?.[
            adjacentFileIndex
          ] === "" &&
          prevPosition?.[rankIndex]?.[adjacentFileIndex] === "" &&
          prevPosition?.[rankIndex + 2 * rankDirection]?.[adjacentFileIndex] ===
            enemyPawn
        ) {
          validCaptures.push([rankIndex + rankDirection, adjacentFileIndex]);
        }
      });
    }
  }

  return validCaptures;
}

export function getKingCastlingMoves({
  currentPosition,
  castleDirection,
  piece,
  rankIndex,
  fileIndex,
}) {
  const kingMoves = [];

  // Early return if basic castling conditions aren't met
  if (rankIndex % 7 !== 0 || fileIndex !== 4 || castleDirection === "none")
    return kingMoves; // Empty moves

  if (piece.startsWith("w")) {
    // Early return when white king is in check
    if (
      arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: currentPosition,
        currentPlayer: "w",
      })
    )
      return kingMoves;

    if (
      ["long", "both"].includes(castleDirection) &&
      currentPosition[7][0] === "wr" &&
      currentPosition[7][1] === "" &&
      currentPosition[7][2] === "" &&
      currentPosition[7][3] === "" &&
      !arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: arbiter.getNewPosition({
          currentPosition,
          piece,
          currentRank: rankIndex,
          currentFile: fileIndex,
          landingRank: 7,
          landingFile: 2,
        }),
        currentPlayer: "w",
      }) &&
      !arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: arbiter.getNewPosition({
          currentPosition,
          piece,
          currentRank: rankIndex,
          currentFile: fileIndex,
          landingRank: 7,
          landingFile: 3,
        }),
        currentPlayer: "w",
      })
    ) {
      kingMoves.push([7, 2]);
    }

    if (
      ["short", "both"].includes(castleDirection) &&
      currentPosition[7][5] === "" &&
      currentPosition[7][6] === "" &&
      currentPosition[7][7] === "wr" &&
      !arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: arbiter.getNewPosition({
          currentPosition,
          piece,
          currentRank: rankIndex,
          currentFile: fileIndex,
          landingRank: 7,
          landingFile: 5,
        }),
        currentPlayer: "w",
      }) &&
      !arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: arbiter.getNewPosition({
          currentPosition,
          piece,
          currentRank: rankIndex,
          currentFile: fileIndex,
          landingRank: 7,
          landingFile: 6,
        }),
        currentPlayer: "w",
      })
    ) {
      kingMoves.push([7, 6]);
    }
  } else {
    // Early return when black king is in check
    if (
      arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: currentPosition,
        currentPlayer: "b",
      })
    )
      return kingMoves;

    if (
      ["long", "both"].includes(castleDirection) &&
      currentPosition[0][0] === "br" &&
      currentPosition[0][1] === "" &&
      currentPosition[0][2] === "" &&
      currentPosition[0][3] === "" &&
      !arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: arbiter.getNewPosition({
          currentPosition,
          piece,
          currentRank: rankIndex,
          currentFile: fileIndex,
          landingRank: 0,
          landingFile: 2,
        }),
        currentPlayer: "b",
      }) &&
      !arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: arbiter.getNewPosition({
          currentPosition,
          piece,
          currentRank: rankIndex,
          currentFile: fileIndex,
          landingRank: 0,
          landingFile: 3,
        }),
        currentPlayer: "b",
      })
    ) {
      kingMoves.push([0, 2]);
    }

    if (
      ["short", "both"].includes(castleDirection) &&
      currentPosition[0][5] === "" &&
      currentPosition[0][6] === "" &&
      currentPosition[0][7] === "br" &&
      !arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: arbiter.getNewPosition({
          currentPosition,
          piece,
          currentRank: rankIndex,
          currentFile: fileIndex,
          landingRank: 0,
          landingFile: 5,
        }),
        currentPlayer: "b",
      }) &&
      !arbiter.isInCheck({
        currentPosition: undefined,
        newPosition: arbiter.getNewPosition({
          currentPosition,
          piece,
          currentRank: rankIndex,
          currentFile: fileIndex,
          landingRank: 0,
          landingFile: 6,
        }),
        currentPlayer: "b",
      })
    ) {
      kingMoves.push([0, 6]);
    }
  }

  return kingMoves;
}

export function getCastlingDirection({
  castleDirection,
  piece,
  currentRank,
  currentFile,
}) {
  const direction = castleDirection[piece[0]];

  // If the latest moved piece is a king
  if (piece[1] === "k") return "none";

  // Target a1
  if (currentRank === 7 && currentFile === 0) {
    // If the white rook on a1 has just been moved
    if (direction === "both") return "short";

    // If long castling was possible, but the white rook on a1 has just been moved
    if (direction === "long") return "none";
  }

  // Target h1
  if (currentRank === 7 && currentFile === 7) {
    // If the white rook on the h1 has just been moved
    if (direction === "both") return "long";

    // If short castling was possible, but the white rook h1 has just been moved
    if (direction === "short") return "none";
  }

  // Target a8
  if (currentRank === 0 && currentFile === 0) {
    // If the black rook on the a8 has just been moved
    if (direction === "both") return "short";

    // If long castling was possible, but the black rook on a8 has just been moved
    if (direction === "long") return "none";
  }

  // Target h8
  if (currentRank === 0 && currentFile === 7) {
    // If the black rook on the h8 has just been moved
    if (direction === "both") return "long";

    // If short castling was possible, but the black rook on h8 has just been moved
    if (direction === "short") return "none";
  }
}

export function getKingPos(newPosition, currentPlayer) {
  let kingPos = null;

  newPosition.forEach((rank, rankIndex) => {
    rank.forEach((_, fileIndex) => {
      if (
        newPosition[rankIndex][fileIndex].startsWith(currentPlayer) &&
        newPosition[rankIndex][fileIndex].endsWith("k")
      ) {
        kingPos = [rankIndex, fileIndex];
      }
    });
  });

  return kingPos;
}

export function getOpponentPieces(newPosition, opponent) {
  const opponentPieces = [];

  newPosition.forEach((rank, rankIndex) => {
    rank.forEach((_, fileIndex) => {
      if (newPosition[rankIndex][fileIndex].startsWith(opponent)) {
        opponentPieces.push({
          piece: newPosition[rankIndex][fileIndex],
          rankIndex,
          fileIndex,
        });
      }
    });
  });

  return opponentPieces;
}
