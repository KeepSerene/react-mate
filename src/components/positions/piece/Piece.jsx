import "./piece.css";

// Context imports
import { useAppContext } from "../../../contexts/Context";

// Other imports
import arbiter from "../../../arbiter/arbiter";
import { generateCandidateMoves } from "../../../reducers/actions/move";

function Piece({ rankIndex, fileIndex, piece }) {
  const pieceMap = {
    wk: "white king",
    wq: "white queen",
    wb: "white bishop",
    wn: "white knight",
    wr: "white rook",
    wp: "white pawn",
    bk: "black king",
    bq: "black queen",
    bb: "black bishop",
    bn: "black knight",
    br: "black rook",
    bp: "black pawn",
  };

  const { appState, dispatch } = useAppContext();
  const { positions, turn, castleDirections } = appState;
  const currentPosition = positions[positions.length - 1];
  const prevPosition = positions[positions.length - 2];

  const handleDragStart = (event) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      `${piece}, ${rankIndex}, ${fileIndex}`
    );

    setTimeout(() => (event.target.style.display = "none"), 1);

    if (turn === piece[0]) {
      // Get the candidate moves from "arbiter"
      const candidateMoves = arbiter.getValidMoves({
        currentPosition,
        prevPosition,
        piece,
        rankIndex,
        fileIndex,
        castleDirection: castleDirections[turn],
      });

      // Supply the candidate moves to the game-state
      dispatch(generateCandidateMoves({ candidateMoves }));
    }
  };

  const handleDragEnd = (event) => (event.target.style.display = "block");

  return (
    <div
      className={`piece ${piece} p-${rankIndex}${fileIndex}`}
      role="img"
      aria-label={pieceMap[piece]}
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    ></div>
  );
}

export default Piece;
