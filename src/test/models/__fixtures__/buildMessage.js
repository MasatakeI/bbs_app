import { format, toDate } from "date-fns";

export const buildMessage = ({ id, body, iso }) => {
  return {
    id,
    body,
    date: {
      toDate: () => new Date(iso),
    },
    formattedDate: format(new Date(iso), "yyyy/MM/dd HH:mm"),
  };
};
