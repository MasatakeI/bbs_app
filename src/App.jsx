// src/App.jsx

import React from "react";
import "./App.css";

import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer/Footer";
import MainPage from "./components/page/MainPage/MainPage";
import SideMenu from "./components/layout/SideMenu/SideMenu";
import SimpleSnackbar from "./components/common/SimpleSnackbar/SimpleSnackbar";

import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  hideSnackbar,
  selectSnackbarMessage,
  selectSnackbarOpen,
} from "./redux/features/snackbar/snackbarSlice";

export const AppContent = () => {
  return (
    <div className="App">
      <Header />

      <div className="app-container">
        <SideMenu />
        <Routes>
          <Route
            path="*"
            element={<Navigate to="/channels/general" replace />}
          />
          <Route
            path="/"
            element={<Navigate to="/channels/general" replace />}
          />
          <Route path="/channels/:channelId" element={<MainPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const snackbarOpen = useSelector(selectSnackbarOpen);
  const snackbarMessage = useSelector(selectSnackbarMessage);

  return (
    <BrowserRouter>
      <AppContent />
      <SimpleSnackbar
        isOpen={snackbarOpen}
        onClose={() => dispatch(hideSnackbar())}
        message={snackbarMessage}
      />
    </BrowserRouter>
  );
};

export default App;
