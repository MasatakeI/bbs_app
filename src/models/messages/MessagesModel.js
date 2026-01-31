import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { getChannelMessages } from "@/firebase";

import { MessagesError } from "../errors/messages/MessagesError";
import { MESSAGES_MODEL_ERROR_CODE } from "../errors/messages/messagesErrorCode";

import { createFirestoreModel } from "../utils/createFirestoreModel";

import { mapFirestoreErrorToMessagesError } from "./mapFirestoreErrorToMessagesError";

import { format } from "date-fns";

export const _createMessage = (id, data) => {
  if (
    !data ||
    typeof data.body !== "string" ||
    typeof data.date?.toDate !== "function"
  ) {
    throw new MessagesError({
      code: MESSAGES_MODEL_ERROR_CODE.INVALID_DATA,
    });
  }

  const dateObj = format(data.date.toDate(), "yyyy/MM/dd HH:mm");

  return {
    id,
    body: data.body,
    // date: data.date.toDate().toLocaleString(),
    date: dateObj,
  };
};

export const createMessage = createFirestoreModel({
  createModel: _createMessage,
  ErrorClass: MessagesError,
  invalidDataCode: MESSAGES_MODEL_ERROR_CODE.INVALID_DATA,
});

export const addMessage = async ({ body, channelId }) => {
  try {
    if (!body.trim()) {
      throw new MessagesError({
        code: MESSAGES_MODEL_ERROR_CODE.VALIDATION,
        message: "1文字以上のメッセージを入力してください",
      });
    }

    const postData = {
      body,
      date: serverTimestamp(),
    };
    const docRef = await addDoc(getChannelMessages(channelId), postData);
    const snapShot = await getDoc(docRef);

    if (!snapShot.exists()) {
      throw new MessagesError({
        code: MESSAGES_MODEL_ERROR_CODE.UNKNOWN,
        message: "メッセージの追加に失敗しました",
      });
    }

    const data = snapShot.data();

    const model = createMessage(docRef.id, data);
    return model;
  } catch (error) {
    throw mapFirestoreErrorToMessagesError(error);
  }
};

export const fetchMessages = async (channelId) => {
  try {
    const q = query(getChannelMessages(channelId), orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.docs.length) {
      return [];
    }

    return querySnapshot.docs.map((doc) => createMessage(doc.id, doc.data()));
  } catch (error) {
    throw mapFirestoreErrorToMessagesError(error);
  }
};

export const deleteMessage = async (id, channelId) => {
  try {
    const docRef = doc(getChannelMessages(channelId), id);

    const snapShot = await getDoc(docRef);

    if (!snapShot.exists()) {
      throw new MessagesError({
        code: MESSAGES_MODEL_ERROR_CODE.NOT_FOUND,
      });
    }

    const data = snapShot.data();

    const model = createMessage(docRef.id, data);
    await deleteDoc(docRef);
    return model;
  } catch (error) {
    throw mapFirestoreErrorToMessagesError(error);
  }
};
