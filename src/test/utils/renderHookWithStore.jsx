// practice/bbs_app/src/test/utils/remderHookWithStore.jsx

import React, { useLayoutEffect, useState } from "react";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Routes, Route, Router } from "react-router";
import { renderHook } from "@testing-library/react";
import { createMemoryHistory } from "history";

export const renderHookWithStore = ({
  hook,
  reducers,
  preloadedState,
  initialPath = "/channels/general",
  history = createMemoryHistory({
    initialEntries: [initialPath],
  }),
}) => {
  const store = configureStore({
    reducer: reducers,
    preloadedState,
  });

  const HistoryRouter = ({ history, children }) => {
    const [state, setState] = useState({
      action: history.action,
      location: history.location,
    });

    // historyの変更を購読（Listen）してStateを更新する
    useLayoutEffect(() => history.listen(setState), [history]);

    return (
      <Router
        location={state.location}
        navigationType={state.action}
        navigator={history}
      >
        {children}
      </Router>
    );
  };

  const wrapper = ({ children }) => (
    <Provider store={store}>
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/channels/:channelId" element={children} />
        </Routes>
      </HistoryRouter>
    </Provider>
  );

  return { ...renderHook(() => hook(), { wrapper }), store };
};
