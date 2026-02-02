import React, { useEffect, useState } from "react";
import "./SideMenu.css";

import { useDispatch, useSelector } from "react-redux";
import {
  selectAllChannels,
  selectChannelsIsLoading,
} from "@/redux/features/channels/channelsSelector";

import { NavLink } from "react-router";
import {
  deleteChannelAsync,
  fetchChannelsAsync,
} from "@/redux/features/channels/channelsThunks";

import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import ChannelForm from "@/components/widgets/Form/ChannelForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/common/Modal/Modal";

const SideMenu = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectAllChannels);
  const isLoading = useSelector(selectChannelsIsLoading);

  const [textBoxOpen, setTextBoxOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [targetId, setTargetId] = useState("");

  useEffect(() => {
    dispatch(fetchChannelsAsync());
  }, [dispatch]);

  const confirmDelete = async () => {
    await dispatch(deleteChannelAsync({ id: targetId })).unwrap();
    setIsModalOpen(false);
  };

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
              <li className="menu-item" key={id}>
                <NavLink
                  to={`/channels/${id}`}
                  className={({ isActive }) =>
                    isActive ? "menu-item-link active" : "menu-item-link"
                  }
                >
                  {name}
                </NavLink>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalMessage(name);
                    setTargetId(id);
                  }}
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
            onClick={
              textBoxOpen
                ? () => setTextBoxOpen(false)
                : () => setTextBoxOpen(true)
            }
            className={`action-button ${!textBoxOpen ? "add" : "cancel"}`}
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
        onClose={() => setIsModalOpen(false)}
        title={"このチャンネルを削除しますか?"}
        message={modalMessage}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SideMenu;
