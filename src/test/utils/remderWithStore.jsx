// practice/bbs_app/src/test/utils/remderWithStore.jsx

import React from "react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";

/**
 * @param {ReactElement} ui
 * @param {Object} options
 * @param {Object} options.reducers
 * @param {Object} options.preloadedState
 */

export const renderWithStore = (ui, { reducers, preloadedState } = {}) => {
  const store = configureStore({
    reducer: reducers,
    preloadedState,
  });

  const Wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  const dispatchSpy = vi.spyOn(store, "dispatch");

  const result = render(<Provider store={store}>{ui}</Provider>);

  return {
    result,
    dispatchSpy,
    ...result,
  };
};
