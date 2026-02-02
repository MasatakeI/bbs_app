// src/models/channels/ChannelsModel.js

import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { channelsCollectionRef, getChannelMessages } from "@/firebase/index";
import { ChannelsError } from "../errors/channels/ChannelsError";
import { CHANNELS_MODEL_ERROR_CODE } from "../errors/channels/channelsErrorCode";

import { createFirestoreModel } from "../utils/createFirestoreModel";
import { mapFirestoreErrorToChannelsError } from "./mapFirestoreErrorToChannelsError";

export const _createChannel = (id, data) => {
  if (!data || typeof data.name !== "string") {
    throw new ChannelsError({
      code: CHANNELS_MODEL_ERROR_CODE.INVALID_DATA,
      message: "無効な値です",
    });
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

export const addChannel = async ({ id, name }) => {
  try {
    if (!id.trim() || !name.trim()) {
      throw new ChannelsError({
        code: CHANNELS_MODEL_ERROR_CODE.VALIDATION,
        message: "IDとチャンネル名をどちらも入力してください",
      });
    }

    const alphanumericRegex = /^[a-zA-Z0-9_-]+$/;
    if (!alphanumericRegex.test(id)) {
      throw new ChannelsError({
        code: CHANNELS_MODEL_ERROR_CODE.VALIDATION,
        message:
          "チャンネルIDは半角英数字、ハイフン、アンダースコアのみ使用可能です",
      });
    }

    const docRef = doc(channelsCollectionRef, id);

    const snapShot = await getDoc(docRef);
    if (snapShot.exists()) {
      throw new ChannelsError({
        code: CHANNELS_MODEL_ERROR_CODE.ALREADY_EXISTS,
        message: "指定されたIDのチャンネルは既に存在します",
      });
    }

    const postData = { name };
    await setDoc(docRef, postData);

    return createChannel(id, postData);
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

    const messagesSnap = await getDocs(getChannelMessages(id));

    const batch = writeBatch(channelsCollectionRef.firestore);

    messagesSnap.forEach((messageDoc) => {
      batch.delete(messageDoc.ref);
    });

    batch.delete(docRef);
    await batch.commit();

    return model;
  } catch (error) {
    throw mapFirestoreErrorToChannelsError(error);
  }
};
