import { createContext, useReducer, useContext } from "react";

type Action =
  | { type: "setToListMonitoring"; payload: string[] }
  | { type: "removeFromListMonitoring"; payload: string[] }
  | { type: "updateCosts"; payload: Tcosts };

type Tcosts = {
  USD?: number;
  EUR?: number;
  JPY?: number;
};

type Dispatch = (action: Action) => void;

type State = {
  listCurrencies: string[];
  listMonitoring: string[];
  costs: Tcosts;
};
type CurrenciesListProviderProps = { children: React.ReactNode };

const CurrenciesListContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

function currenciesListReducer(state: State, action: Action) {
  switch (action.type) {
    case "updateCosts": {
      return { ...state, costs: action.payload };
    }
    case "setToListMonitoring": {
      const leftArray = state.listCurrencies.concat(action.payload);
      const filtered = state.listMonitoring.filter((item: string) => {
        if (!leftArray.includes(item)) {
          return item;
        }
      });
      return { ...state, listCurrencies: leftArray, listMonitoring: filtered };
    }
    case "removeFromListMonitoring": {
      const rightArray = state.listMonitoring.concat(action.payload);
      const filtered = state.listCurrencies.filter((item: string) => {
        if (!rightArray.includes(item)) {
          return item;
        }
      });
      return { ...state, listCurrencies: filtered, listMonitoring: rightArray };
    }
    default: {
      throw new Error(`Unhandled action type:`);
    }
  }
}

function CurrenciesListProvider({ children }: CurrenciesListProviderProps) {
  const [state, dispatch] = useReducer(currenciesListReducer, {
    listCurrencies: ["JPY", "EUR"],
    listMonitoring: ["USD"],
    costs: { USD: 1000 },
  });
  const value = { state, dispatch };

  return (
    <CurrenciesListContext.Provider value={value}>
      {children}
    </CurrenciesListContext.Provider>
  );
}

function useCurrenciesList() {
  const context = useContext(CurrenciesListContext);
  if (context === undefined) {
    throw new Error(
      "useCurrenciesList must be used within a CurrenciesListProvider"
    );
  }
  return context;
}

export { CurrenciesListProvider, useCurrenciesList };
