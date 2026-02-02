// src/test/components/widgets/MessageCard/MessageCard.test.jsx

import { describe, test, expect, vi, beforeEach } from "vitest";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import MessageCard from "@/components/widgets/MessageCard/MessageCard";

describe("MessageCard", () => {
  const onDelete = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("MessageCardが描写される", () => {
    render(
      <MessageCard
        body={"test message"}
        date={"2020/01/01 12:00"}
        id={1}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText("test message")).toBeInTheDocument();
    expect(screen.getByText("2020/01/01 12:00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "メッセージを削除" }),
    ).toBeInTheDocument();
  });

  test("削除ボタンを押すとonDeleteハンドラが呼ばれる", async () => {
    render(
      <MessageCard
        body={"test message"}
        date={"2020/01/01 12:00"}
        id={99}
        onDelete={onDelete}
      />,
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole("button", {
      name: "メッセージを削除",
    });

    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(99);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
