import "./move-list.css";

// Context imports
import { useAppContext } from "../../../contexts/Context";

function MoveList() {
  const { appState } = useAppContext();

  return (
    <ul role="list" className="move-list">
      {appState.moveList.map((move, index) => (
        <li
          key={index}
          data-number={`${Math.floor(index / 2 + 1)}.`}
          className="move"
        >
          {move}
        </li>
      ))}
    </ul>
  );
}

export default MoveList;
