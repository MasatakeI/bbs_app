import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { channelsCollectionRef } from "../firebase";
import { ChannelsError } from "./errors/channels/ChannelsError";
import { CHANNELS_MODEL_ERROR_CODE } from "./errors/channels/channelsErrorCode";

export const createChannel = (id, data) => {
  if (!data || typeof data.name !== "string") {
    throw new ChannelsError({ code: CHANNELS_MODEL_ERROR_CODE.INVALID_DATA });
  }
  return {
    id,
    name: data.name,
  };
};

export const addChannel = async ({ name }) => {
  if (!name.trim()) {
    throw new ChannelsError({
      code: CHANNELS_MODEL_ERROR_CODE.VALIDATION,
      message: "チャンネル名は必須です",
    });
  }

  const postData = {
    name,
  };

  const docRef = await addDoc(channelsCollectionRef, postData);
  const snapShot = await getDoc(docRef);

  if (!snapShot.exists()) {
    throw new ChannelsError({
      code: CHANNELS_MODEL_ERROR_CODE.UNKNOWN,
    });
  }

  const data = snapShot.data();

  const model = createChannel(docRef.id, data);

  return model;
};

export const fetchChannels = async () => {
  const q = query(channelsCollectionRef, orderBy("name"));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.docs.length) {
    return [];
  }

  return querySnapshot.docs.map((doc) => createChannel(doc.id, doc.data()));
};

export const deleteChannel = async (id) => {
  const docRef = doc(channelsCollectionRef, id);

  const snapShot = await getDoc(docRef);

  if (!snapShot.exists()) {
    throw new ChannelsError({
      code: CHANNELS_MODEL_ERROR_CODE.NOT_FOUND,
      message: "削除対象のチャンネルが存在しません",
    });
  }

  const data = snapShot.data();

  const model = createChannel(docRef.id, data);

  await deleteDoc(docRef);

  return model;
};
