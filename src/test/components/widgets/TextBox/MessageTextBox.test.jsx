// src/test/components/widgets/TextBox/TextBox.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";

import MessageTextBox from "@/components/widgets/TextBox/MessageTextBox";
import messagesReducer from "@/redux/features/messages/messagesSlice";

import { renderWithStore } from "@/test/utils/remderWithStore";

import userEvent from "@testing-library/user-event";

const channelId = "Channel1";

describe("MessageTextBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("canPost=falseの時,投稿ボタンがdisabledになる", async () => {
    renderWithStore(<MessageTextBox channelId={channelId} />, {
      reducers: { messages: messagesReducer },
      preloadedState: { messages: { canPost: false } },
    });

    const addButton = screen.getByRole("button", { name: "投稿" });
    expect(addButton).toBeDisabled();
  });

  test("canPost=trueかつ入力がある時,投稿処理がdispatchされる", async () => {
    const { dispatchSpy } = renderWithStore(
      <MessageTextBox channelId={channelId} />,
      {
        reducers: { messages: messagesReducer },
        preloadedState: { messages: { canPost: true } },
      },
    );

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("ここに入力"), "test message");
    await user.click(screen.getByText("投稿"));

    // expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
