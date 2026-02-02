// src/test/components/widgets/MessagesList/MessagesList.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MessagesList from "@/components/widgets/MessagesList/MessagesList";
import { renderWithStore } from "@/test/utils/remderWithStore";
import { mockViewMessages } from "../../__fixtures__/messageViewData";
import messagesReducer, {
  messagesInitialState,
} from "@/redux/features/messages/messagesSlice";

describe("MessagesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const channelId = "Channel1";

  test("messagesが表示される", () => {
    renderWithStore(<MessagesList channelId={channelId} />, {
      reducers: { messages: messagesReducer },
      preloadedState: { messages: { messages: mockViewMessages } },
    });

    mockViewMessages.forEach((m) => {
      expect(screen.getByText(m.body)).toBeInTheDocument();
      expect(screen.getByText(m.date)).toBeInTheDocument();
    });
  });

  test("messagesが0件の時,メッセージを表示する", () => {
    renderWithStore(<MessagesList channelId={channelId} />, {
      reducers: { messages: messagesReducer },
      preloadedState: { messages: { messages: [] } },
    });

    expect(
      screen.getByText("該当する メッセージ がありません"),
    ).toBeInTheDocument();
  });

  test("isLoading=trueの時スピナーを表示", () => {
    renderWithStore(<MessagesList channelId={channelId} />, {
      reducers: { messages: messagesReducer },
      preloadedState: { messages: { isLoading: true } },
    });

    expect(
      screen.getByRole("progressbar", { name: "loading" }),
    ).toBeInTheDocument();
  });

  test("削除操作でdeleteMessageAsyncがdispatchされる", async () => {
    const user = userEvent.setup();

    const { dispatchSpy } = renderWithStore(
      <MessagesList channelId={channelId} />,
      {
        reducers: { messages: messagesReducer },
        preloadedState: {
          messages: { ...messagesInitialState, messages: mockViewMessages },
        },
      },
    );

    const deleteButton = screen.getAllByRole("button", {
      name: "メッセージを削除",
    })[0];
    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", { name: "削除" });
    await user.click(confirmButton);

    // expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  test("削除キャンセル時はdeleteMessageAsyncがdispatchされない", async () => {
    const user = userEvent.setup();

    const { dispatchSpy } = renderWithStore(
      <MessagesList channelId={channelId} />,
      {
        reducers: { messages: messagesReducer },
        preloadedState: {
          messages: { ...messagesInitialState, messages: mockViewMessages },
        },
      },
    );

    await user.click(
      screen.getAllByRole("button", { name: "メッセージを削除" })[0],
    );
    await user.click(screen.getByRole("button", { name: "キャンセル" }));

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
