// src/test/models/__fixtures__/buildMessage.js

import { format } from "date-fns";

export const buildMessage = ({ id, body, iso }) => {
  const date = new Date(iso);

  return {
    id,

    body,
    date: {
      toDate: () => date,
    },
    expectedDate: format(date, "yyyy/MM/dd HH:mm"),
  };
};
