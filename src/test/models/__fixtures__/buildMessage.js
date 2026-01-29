import { format } from "date-fns";

export const buildMessage = ({ id, channelId, body, iso }) => {
  return {
    id,

    body,
    date: {
      toDate: () => new Date(iso),
    },
    formattedDate: format(new Date(iso), "yyyy/MM/dd HH:mm"),
  };
};
