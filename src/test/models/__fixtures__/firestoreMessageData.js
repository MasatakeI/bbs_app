///src/test/models/__fixtures__/firestoreMessageData.js

import { buildMessage } from "./buildMessage";

export const mockMessages = [
  buildMessage({
    id: 1,
    body: "test body1",
    iso: "2020-01-01T12:00:00",
  }),
  buildMessage({
    id: 2,
    body: "test body2",
    iso: "2020-01-02T12:00:00",
  }),
  buildMessage({
    id: 3,
    body: "test body3",
    iso: "2020-01-03T12:00:00",
  }),
];

export const newMessage = buildMessage({
  id: 4,
  body: "test body4",
  iso: "2020-01-04T12:00:00",
});
