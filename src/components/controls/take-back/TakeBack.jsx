import "./take-back.css";

// Context imports
import { useAppContext } from "../../../contexts/Context";

// Other imports
import { triggerTakeBack } from "../../../reducers/actions/move";

function TakeBack() {
  const { dispatch } = useAppContext();

  return (
    <div className="take-back">
      <button
        type="button"
        onClick={() => dispatch(triggerTakeBack())}
        className="btn"
      >
        Take back
      </button>
    </div>
  );
}

export default TakeBack;
