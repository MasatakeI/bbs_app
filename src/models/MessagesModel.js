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

import { messagesCollectionRef } from "../firebase";

import { MessagesError } from "./errors/messages/MessagesError";
import { MESSAGES_MODEL_ERROR_CODE } from "./errors/messages/messagesErrorCode";

import { createFirestoreModel } from "./utils/createFirestoreModel";

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
    date: dateObj,
  };
};

export const createMessage = createFirestoreModel({
  createModel: _createMessage,
  ErrorClass: MessagesError,
  invalidDataCode: MESSAGES_MODEL_ERROR_CODE.INVALID_DATA,
});

export const addMessage = async ({ body }) => {
  if (!body.trim()) {
    throw new MessagesError({
      code: MESSAGES_MODEL_ERROR_CODE.VALIDATION,
    });
  }

  const postData = {
    body,
    date: serverTimestamp(),
  };
  const docRef = await addDoc(messagesCollectionRef, postData);
  const snapShot = await getDoc(docRef);

  if (!snapShot.exists()) {
    throw new MessagesError({
      code: MESSAGES_MODEL_ERROR_CODE.UNKNOWN,
    });
  }

  const data = snapShot.data();

  const model = createMessage(docRef.id, data);
  return model;
};

export const fetchMessages = async () => {
  const q = query(messagesCollectionRef, orderBy("date"));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.docs.length) {
    return [];
  }

  return querySnapshot.docs.map((doc) => createMessage(doc.id, doc.data()));
};

export const deleteMessage = async (id) => {
  const docRef = doc(messagesCollectionRef, id);

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
};
