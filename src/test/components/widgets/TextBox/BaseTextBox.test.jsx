// src/test/components/widgets/TextBox/TextBox.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";

import BaseTextBox from "@/components/widgets/TextBox/BaseTextBox";

import userEvent from "@testing-library/user-event";

describe("BaseTextBox", () => {
  const onChange = vi.fn();
  const onSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("textareaとButtonが表示される", () => {
    render(
      <BaseTextBox
        value={"Channel1"}
        onChange={onChange}
        onSubmit={onSubmit}
        placeholder={"ここに入力"}
        buttonLabel={"追加"}
        canSubmit={true}
      />,
    );

    const textbox = screen.getByRole("textbox");
    expect(textbox).toHaveValue("Channel1");
    expect(screen.getByPlaceholderText("ここに入力")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "追加" })).toBeInTheDocument();
  });

  describe("ボタンを押した時の挙動", () => {
    test.each([true, false])("canSubmit %s の時", async (canSubmit) => {
      render(
        <BaseTextBox
          value={"Channel1"}
          onChange={onChange}
          onSubmit={onSubmit}
          placeholder={"ここに入力"}
          buttonLabel={"追加"}
          canSubmit={canSubmit}
        />,
      );

      const user = userEvent.setup();
      const submitButton = screen.getByRole("button", { name: "追加" });
      await user.click(submitButton);

      if (canSubmit === true) {
        expect(onSubmit).toHaveBeenCalledTimes(1);
      } else {
        expect(onSubmit).not.toHaveBeenCalled();
      }
    });
  });
});
