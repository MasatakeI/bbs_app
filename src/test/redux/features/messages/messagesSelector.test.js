// src/test/redux/features/messages/messagesSelector.test.js

import { selectReversedMessages } from "@/redux/features/messages/messagesSelector";
import { messagesInitialState } from "@/redux/features/messages/messagesSlice";
import { mockMessages } from "@/test/models/__fixtures__/firestoreMessageData";
import { describe, test, expect } from "vitest";

describe("messagesSelector", () => {
  // 複合セレクターのみテストする

  test.skip("selectReversedMessages:messagesを日付降順でソートする", () => {
    const prev = {
      messages: { ...messagesInitialState, messages: mockMessages },
    };

    const result = selectReversedMessages(prev);

    expect(result.map((m) => m.id)).toEqual([3, 2, 1]);
  });
});
