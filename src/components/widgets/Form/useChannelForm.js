import { selectChannelsCanPost } from "@/redux/features/channels/channelsSelector";
import { addChannelAsync } from "@/redux/features/channels/channelsThunks";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useChannelForm = (onClose) => {
  const dispatch = useDispatch();
  const canPost = useSelector(selectChannelsCanPost);

  const [form, setForm] = useState({ id: "", name: "" });

  // const handleChange = (e) => {
  //   const value = e.target.value;
  //   const sanitizedValue = value.replace(/[^a-zA-Z0-9]/g, "");
  //   setChannelId(sanitizedValue);
  // };

  const reset = () => setForm({ id: "", name: "" });

  const handleSubmit = async () => {
    await dispatch(addChannelAsync({ id: form.id, name: form.name })).unwrap();
    reset();
    onClose();
  };

  return {
    form,
    setForm,
    handleSubmit,
    canPost,
  };
};
