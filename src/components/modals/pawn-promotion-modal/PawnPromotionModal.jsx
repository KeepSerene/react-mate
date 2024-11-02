import "./pawn-promotion-modal.css";

// Context imports
import { useAppContext } from "../../../contexts/Context";

// Helper function imports
import { copyPosition, getMoveNotation } from "../../../utils";

// Other imports
import {
  clearCandidateMoves,
  makeNewMove,
} from "../../../reducers/actions/move";

function PawnPromotionModal({ onClose }) {
  const { appState, dispatch } = useAppContext();

  const options = ["q", "r", "b", "n"];

  const optionMap = {
    wq: "white queen",
    bq: "black queen",
    wr: "white rook",
    br: "black rook",
    wb: "white bishop",
    bb: "white bishop",
    wn: "white knight",
    bn: "white knight",
  };

  const { promotionMoveCoords } = appState;

  if (!promotionMoveCoords) return null;

  const color = promotionMoveCoords.landingRank === 0 ? "w" : "b";

  const getPawnPromotionModalPos = () => {
    const style = {};

    if (promotionMoveCoords.landingRank === 0) style.top = "0";
    else style.top = "calc(4 * var(--square-size))";

    style.left = `calc(${promotionMoveCoords.landingFile} * var(--square-size))`;

    return style;
  };

  const handleClick = (option) => {
    const newPosition = copyPosition(
      appState.positions[appState.positions.length - 1]
    );

    newPosition[promotionMoveCoords.currentRank][
      promotionMoveCoords.currentFile
    ] = "";
    newPosition[promotionMoveCoords.landingRank][
      promotionMoveCoords.landingFile
    ] = color + option;

    const promotionMoveNotation = getMoveNotation({
      currentPosition: newPosition,
      ...promotionMoveCoords,
      piece: color + "p",
      promotionType: option,
    });

    dispatch(clearCandidateMoves());
    dispatch(makeNewMove({ newPosition, moveNotation: promotionMoveNotation }));

    // At last, close the modal window
    onClose();
  };

  return (
    <ul
      role="list"
      className="modal pawn-promotion"
      style={getPawnPromotionModalPos()}
    >
      {options.map((option, index) => (
        <li
          key={index}
          onClick={() => handleClick(option)}
          role="img"
          aria-label={`Click to choose a ${optionMap[`${color}${option}`]}`}
          tabIndex={0}
          className={`piece ${color}${option}`}
        ></li>
      ))}
    </ul>
  );
}

export default PawnPromotionModal;
