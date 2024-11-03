import "./app.css";

// Component imports
import Board from "./components/board/Board";
import Controls from "./components/controls/Controls";
import MoveList from "./components/controls/move-list/MoveList";
import TakeBack from "./components/controls/take-back/TakeBack";

// Context imports
import AppContext from "./contexts/Context";

// React imports
import { useReducer } from "react";

// Reducer imports
import { reducer } from "./reducers/reducer";

// Other imports
import { gameState } from "./game-state";

function App() {
  const [appState, dispatch] = useReducer(reducer, gameState);

  return (
    <AppContext.Provider value={{ appState, dispatch }}>
      <main className="app-wrapper">
        <h1 className="sr-only">Chess: White goes first!</h1>

        <Board />

        <Controls>
          <MoveList />

          <TakeBack />
        </Controls>
      </main>
    </AppContext.Provider>
  );
}

export default App;
