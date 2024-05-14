import React, { createContext, useContext, useReducer, useState } from "react";

type Action = { type: "increment" } | { type: "decrement" };
type Dispatch = (action: Action) => void;
type State = {
  count: number;
  tabId: string;
};
type ProviderProps = { children: React.ReactNode };

/**
 * Context API를 사용한 상태관리
 */
const Context = createContext<{ state: State; dispatch: Dispatch } | undefined>(
  undefined
);

export const TimeSeriesProvider = (props: ProviderProps) => {
  const { children } = props;

  const [state, dispatch] = useReducer(reducer, {
    count: 0,
    tabId: "2",
  });

  const value = { state, dispatch };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useTimeSeries = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useTimeSeries must be used within a TimeSeriesProvider");
  }
  return context;
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "increment": {
      return { ...state, tabId: "2" };
    }
    case "decrement": {
      return { ...state, count: state.count - 1 };
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as Action).type}`);
    }
  }
}
