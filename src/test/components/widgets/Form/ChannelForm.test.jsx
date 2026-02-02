// src/test/components/widgets/Form/ChannelForm.test.jsx

import { describe, test, expect, beforeEach, vi } from "vitest";
import { screen } from "@testing-library/react";

import ChannelForm from "@/components/widgets/Form/ChannelForm";
import channelsReducer from "@/redux/features/channels/channelsSlice";

import { renderWithStore } from "@/test/utils/remderWithStore";

import userEvent from "@testing-library/user-event";

describe("ChannelTextBox", () => {
  let onClose;

  beforeEach(() => {
    onClose = vi.fn();
    vi.clearAllMocks();
  });

  test("canPost=falseかつidフォームチャンネル名フォーム入力がない時,投稿ボタンがdisabledになる", async () => {
    renderWithStore(<ChannelForm isOpen={true} onClose={onClose} />, {
      reducers: { channels: channelsReducer },
      preloadedState: { channels: { canPost: false } },
    });

    const addButton = screen.getByRole("button", { name: "作成" });
    expect(addButton).toBeDisabled();
  });

  test("正しい入力がある時,追加処理がdispatchされる", async () => {
    const { dispatchSpy } = renderWithStore(
      <ChannelForm isOpen={true} onClose={onClose} />,
      {
        reducers: { channels: channelsReducer },
        preloadedState: { channels: { canPost: true } },
      },
    );

    const testData = { id: "new-id", name: "新チャンネル" };
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("ID(半角英数)"), testData.id);
    await user.type(screen.getByPlaceholderText("チャンネル名"), testData.name);

    const addButton = screen.getByRole("button", { name: "作成" });
    expect(addButton).not.toBeDisabled();

    await user.click(addButton);

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  test("キャンセルボタンを押した時にonCloseが呼ばれ,フォームもリセットされる", async () => {
    renderWithStore(<ChannelForm isOpen={true} onClose={onClose} />, {
      reducers: { channels: channelsReducer },
      preloadedState: { channels: { canPost: true } },
    });

    const testData = { id: "new-id", name: "新チャンネル" };
    const user = userEvent.setup();

    const idPlaceholder = screen.getByPlaceholderText("ID(半角英数)");
    const namePlaceholder = screen.getByPlaceholderText("チャンネル名");
    await user.type(idPlaceholder, testData.id);
    await user.type(namePlaceholder, testData.name);

    const cancelButton = screen.getByRole("button", { name: "キャンセル" });

    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);

    expect(idPlaceholder.value).toBe("");
    expect(namePlaceholder.value).toBe("");
  });
});
