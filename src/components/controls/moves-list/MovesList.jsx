import "./moves-list.css";

// Context imports
import { useAppContext } from "../../../contexts/Context";

function MovesList() {
  const { appState } = useAppContext();

  return (
    <ul role="list" className="moves-list">
      {appState.movesList.map((move, index) => (
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

export default MovesList;
