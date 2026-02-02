import { getFirestore, collection } from "firebase/firestore";

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDOvm3a5clfMdY51to3kQefCWq-6NT_BI0",
  authDomain: "bbsapp-746cc.firebaseapp.com",
  projectId: "bbsapp-746cc",
  storageBucket: "bbsapp-746cc.firebasestorage.app",
  messagingSenderId: "672850899728",
  appId: "1:672850899728:web:f77fb075dab6f221ff6b95",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const channelsCollectionRef = collection(db, "channels");
export const messagesCollectionRef = collection(db, "messages");
export const getChannelMessages = (channelId) => {
  return collection(db, `channels/${channelId}/messages`);
};
