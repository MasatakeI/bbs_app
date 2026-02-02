import React from "react";
import "./SideMenu.css";
import { NavLink } from "react-router";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import ChannelForm from "@/components/widgets/Form/ChannelForm";
import Modal from "@/components/common/Modal/Modal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSideMenu } from "./useSideMenu";

const SideMenu = () => {
  const {
    channels,
    isLoading,
    textBoxOpen,
    setTextBoxOpen,
    toggleTextBox,
    isModalOpen,
    modalMessage,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useSideMenu();

  const channelsContent = () => {
    if (isLoading) {
      return (
        <div className="channel-spinner">
          <LoadingSpinner />
        </div>
      );
    }

    return (
      <div className="side-menu">
        <ul className="menu-list">
          {channels.map(({ id, name }) => {
            return (
              <li
                className="menu-item"
                key={id}
                // aria-label="channel-list"
              >
                <NavLink
                  to={`/channels/${id}`}
                  className={({ isActive }) =>
                    isActive ? "menu-item-link active" : "menu-item-link"
                  }
                >
                  {name}
                </NavLink>
                <button
                  onClick={() => openDeleteModal(id, name)}
                  className="channel-delete-button"
                  title="削除"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="action-button-container">
          <button
            onClick={toggleTextBox}
            className={`action-button ${!textBoxOpen ? "add" : "cancel"}`}
            title="トグルボタン"
          >
            <FontAwesomeIcon icon={!textBoxOpen ? faPlus : faXmark} />
          </button>
        </div>

        <div className="menu-form-container">
          <ChannelForm
            isOpen={textBoxOpen}
            onClose={() => setTextBoxOpen(false)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="side-menu">
      {channelsContent()}{" "}
      <Modal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        title={"このチャンネルを削除しますか?"}
        message={modalMessage}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SideMenu;
