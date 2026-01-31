// src/test/components/widgets/TextBox/ChannelTextBox.test.jsx

import { describe, test, expect } from "vitest";
import { screen } from "@testing-library/react";

import ChannelTextBox from "@/components/widgets/TextBox/ChannelTextBox";
import channelsReducer from "@/redux/features/channels/channelsSlice";

import { renderWithStore } from "@/test/utils/remderWithStore";

import userEvent from "@testing-library/user-event";

describe("ChannelTextBox", () => {
  test("canPost=falseの時,投稿ボタンがdisabledになる", async () => {
    renderWithStore(<ChannelTextBox />, {
      reducers: { channels: channelsReducer },
      preloadedState: { channels: { canPost: false } },
    });

    const addButton = screen.getByRole("button", { name: "追加" });
    expect(addButton).toBeDisabled();
  });

  test("canPost=trueかつ入力がある時,追加処理がdispatchされる", async () => {
    const { dispatchSpy } = renderWithStore(<ChannelTextBox />, {
      reducers: { channels: channelsReducer },
      preloadedState: { channels: { canPost: true } },
    });

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("ここに入力"), "test message");
    await user.click(screen.getByText("追加"));

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });
});
