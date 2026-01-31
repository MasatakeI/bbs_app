// src/models/channels/ChannelsModel.js

import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { channelsCollectionRef } from "@/firebase/index";
import { ChannelsError } from "../errors/channels/ChannelsError";
import { CHANNELS_MODEL_ERROR_CODE } from "../errors/channels/channelsErrorCode";

import { createFirestoreModel } from "../utils/createFirestoreModel";
import { mapFirestoreErrorToChannelsError } from "./mapFirestoreErrorToChannelsError";

export const _createChannel = (id, data) => {
  if (!data || typeof data.name !== "string") {
    throw new ChannelsError({ code: CHANNELS_MODEL_ERROR_CODE.INVALID_DATA });
  }
  return {
    id,
    name: data.name,
  };
};

export const createChannel = createFirestoreModel({
  createModel: _createChannel,
  ErrorClass: ChannelsError,
  invalidDataCode: CHANNELS_MODEL_ERROR_CODE.INVALID_DATA,
});

export const addChannel = async ({ name }) => {
  try {
    if (!name.trim()) {
      throw new ChannelsError({
        code: CHANNELS_MODEL_ERROR_CODE.VALIDATION,
        message: "1文字以上のチャンネル名を入力してください",
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
        message: "チャンネルがありません",
      });
    }

    const data = snapShot.data();

    const model = createChannel(docRef.id, data);

    return model;
  } catch (error) {
    throw mapFirestoreErrorToChannelsError(error);
  }
};

export const fetchChannels = async () => {
  try {
    const q = query(channelsCollectionRef, orderBy("name"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.docs.length) {
      return [];
    }

    return querySnapshot.docs.map((doc) => createChannel(doc.id, doc.data()));
  } catch (error) {
    console.error(error);
    throw mapFirestoreErrorToChannelsError(error);
  }
};

export const deleteChannel = async (id) => {
  try {
    const docRef = doc(channelsCollectionRef, id);

    const snapShot = await getDoc(docRef);

    if (!snapShot.exists()) {
      throw new ChannelsError({
        code: CHANNELS_MODEL_ERROR_CODE.NOT_FOUND,
      });
    }

    const data = snapShot.data();

    const model = createChannel(docRef.id, data);

    await deleteDoc(docRef);

    return model;
  } catch (error) {
    throw mapFirestoreErrorToChannelsError(error);
  }
};
