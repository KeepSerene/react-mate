// React imports
import { createContext, useContext } from "react";

// Other imports
import { gameState } from "../game-state";

const AppContext = createContext(gameState);

export const useAppContext = () => useContext(AppContext);

export default AppContext;
