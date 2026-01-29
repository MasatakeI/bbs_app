import channelsReducer from "@/redux/features/channels/channelsSlice";
import messagesReducer from "@/redux/features/messages/messagesSlice";
import snackbarReducer from "@/redux/features/snackbar/snackbarSlice";

import { combineReducers } from "redux";

export const rootReducer = combineReducers({
  channels: channelsReducer,
  messages: messagesReducer,
  snackbar: snackbarReducer,
});
