import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  selectAllChannels,
  selectChannelsIsLoading,
} from "@/redux/features/channels/channelsSelector";

import {
  deleteChannelAsync,
  fetchChannelsAsync,
} from "@/redux/features/channels/channelsThunks";

export const useSideMenu = () => {
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

  const openDeleteModal = (id, name) => {
    setIsModalOpen(true);
    setModalMessage(name);
    setTargetId(id);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setTargetId("");
  };
  const confirmDelete = async () => {
    await dispatch(deleteChannelAsync({ id: targetId })).unwrap();
    closeDeleteModal();
  };

  const toggleTextBox = () => {
    setTextBoxOpen((prev) => !prev);
  };

  return {
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
  };
};
