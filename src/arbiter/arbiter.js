import { handleNonPawnMoves, handlePawnMoves } from "./handle-moves";
import {
  getBishopMoves,
  getKingCastlingMoves,
  getKingMoves,
  getKingPos,
  getKnightMoves,
  getOpponentPieces,
  getPawnCaptures,
  getPawnMoves,
  getQueenMoves,
  getRookMoves,
} from "./piece-moves";

// Helper function imports
import { areSameColoredSquares, findPieceLocations } from "../utils";

const arbiter = {
  getRegularMoves({ currentPosition, piece, rankIndex, fileIndex }) {
    switch (piece[1]) {
      case "r":
        return getRookMoves({ currentPosition, piece, rankIndex, fileIndex });

      case "n":
        return getKnightMoves({ currentPosition, piece, rankIndex, fileIndex });

      case "b":
        return getBishopMoves({ currentPosition, piece, rankIndex, fileIndex });

      case "q":
        return getQueenMoves({ currentPosition, piece, rankIndex, fileIndex });

      case "k":
        return getKingMoves({ currentPosition, piece, rankIndex, fileIndex });

      case "p":
        return getPawnMoves({ currentPosition, piece, rankIndex, fileIndex });

      default:
        return;
    }
  },

  getValidMoves({
    currentPosition,
    prevPosition,
    piece,
    rankIndex,
    fileIndex,
    castleDirection,
  }) {
    let validMoves = this.getRegularMoves({
      currentPosition,
      piece,
      rankIndex,
      fileIndex,
    });

    const legalMoves = [];

    if (piece.endsWith("p")) {
      validMoves = [
        ...validMoves,
        ...getPawnCaptures({
          currentPosition,
          prevPosition,
          piece,
          rankIndex,
          fileIndex,
        }),
      ];
    }

    if (piece.endsWith("k")) {
      validMoves = [
        ...validMoves,
        ...getKingCastlingMoves({
          currentPosition,
          castleDirection,
          piece,
          rankIndex,
          fileIndex,
        }),
      ];
    }

    validMoves.forEach(([landingRank, landingFile]) => {
      const newPosition = this.getNewPosition({
        currentPosition,
        piece,
        currentRank: rankIndex,
        currentFile: fileIndex,
        landingRank,
        landingFile,
      });

      if (
        !this.isInCheck({
          currentPosition,
          newPosition,
          currentPlayer: piece[0],
        })
      ) {
        legalMoves.push([landingRank, landingFile]);
      }
    });

    return legalMoves;
  },

  getNewPosition({
    currentPosition,
    piece,
    currentRank,
    currentFile,
    landingRank,
    landingFile,
  }) {
    if (piece.endsWith("p")) {
      return handlePawnMoves({
        currentPosition,
        piece,
        currentRank,
        currentFile,
        landingRank,
        landingFile,
      });
    } else {
      return handleNonPawnMoves({
        currentPosition,
        piece,
        currentRank,
        currentFile,
        landingRank,
        landingFile,
      });
    }
  },

  isInCheck({ currentPosition, newPosition, currentPlayer }) {
    const opponent = currentPlayer.startsWith("w") ? "b" : "w";
    let kingPos = getKingPos(newPosition, currentPlayer);
    const enemyPieces = getOpponentPieces(newPosition, opponent);

    const opponentMoves = enemyPieces.reduce(
      (acc, enemyPiece) =>
        (acc = [
          ...acc,
          ...(enemyPiece.piece.endsWith("p")
            ? getPawnCaptures({
                currentPosition: newPosition,
                prevPosition: currentPosition,
                ...enemyPiece,
              })
            : this.getRegularMoves({
                currentPosition: newPosition,
                ...enemyPiece,
              })),
        ]),
      []
    );

    if (
      opponentMoves.some(
        ([rankIndex, fileIndex]) =>
          kingPos[0] === rankIndex && kingPos[1] === fileIndex
      )
    ) {
      return true;
    }

    return false;
  },

  isStalemate(newPosition, opponent, castleDirection) {
    const isInCheck = this.isInCheck({
      currentPosition: undefined,
      newPosition,
      currentPlayer: opponent,
    });

    if (isInCheck) return false;

    const enemyPieces = getOpponentPieces(newPosition, opponent);

    const opponentMoves = enemyPieces.reduce(
      (acc, enemyPiece) =>
        (acc = [
          ...acc,
          ...this.getValidMoves({
            currentPosition: newPosition,
            prevPosition: undefined,
            ...enemyPiece,
            castleDirection,
          }),
        ]),
      []
    );

    return !isInCheck && opponentMoves.length === 0;
  },

  hasInsufficientMaterial(currentPosition) {
    // Filter out empty strings from "currentPosition"
    const remainingPieces = currentPosition.reduce(
      (acc, rank) =>
        (acc = [
          ...acc,
          ...rank.filter((squareContent) => squareContent !== ""),
        ]),
      []
    );

    // If king vs king
    if (remainingPieces.length === 2) return true;
    else if (
      remainingPieces.length === 3 &&
      remainingPieces.some(
        (piece) => piece.endsWith("n") || piece.endsWith("b")
      )
    ) {
      return true;
      // If king & minor piece vs king
    } else if (
      remainingPieces.length === 4 &&
      remainingPieces.every(
        (piece) => piece.endsWith("k") || piece.endsWith("b")
      ) &&
      new Set(remainingPieces).size === 4 &&
      areSameColoredSquares(
        findPieceLocations(currentPosition, "wb")[0], // Get the first location
        findPieceLocations(currentPosition, "bb")[0] // Get the first location
      )
    ) {
      return true;
      // If king & bishop vs king & bishop (on the same colored square as the opponent)
    }

    return false;
  },

  isCheckmate(newPosition, opponent, castleDirection) {
    const isInCheck = this.isInCheck({
      currentPosition: undefined,
      newPosition,
      currentPlayer: opponent,
    });

    if (!isInCheck) return false;

    const enemyPieces = getOpponentPieces(newPosition, opponent);

    const opponentMoves = enemyPieces.reduce(
      (acc, enemyPiece) =>
        (acc = [
          ...acc,
          ...this.getValidMoves({
            currentPosition: newPosition,
            prevPosition: undefined,
            ...enemyPiece,
            castleDirection,
          }),
        ]),
      []
    );

    return isInCheck && opponentMoves.length === 0;
  },
};

export default arbiter;
