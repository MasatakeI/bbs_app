import { describe, test, expect, vi, beforeEach } from "vitest";

import { screen } from "@testing-library/react";

import MainPage from "@/components/page/MainPage/MainPage";
import { renderWithStore } from "@/test/utils/remderWithStore";
import messagesReducer, {
  messagesInitialState,
} from "@/redux/features/messages/messagesSlice";
import channelsReducer from "@/redux/features/channels/channelsSlice";

import { channelsInitialState } from "@/redux/features/channels/channelsSlice";
import { MemoryRouter, Route, Routes } from "react-router";

vi.mock("@/components/widgets/TextBox/MessageTextBox", () => ({
  default: ({ channelId }) => (
    <div data-testid="message-textbox">MessageTextBox:{channelId}</div>
  ),
}));
vi.mock("@/components/widgets/MessagesList/MessagesList", () => ({
  default: ({ channelId }) => (
    <div data-testid="messages-list">MessagesList:{channelId}</div>
  ),
}));

describe("MainPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderMainPage = (
    initialPath = "/channels/general",
    isLoading = false,
  ) => {
    return renderWithStore(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/channels/:channelId" element={<MainPage />} />
        </Routes>
      </MemoryRouter>,
      {
        reducers: { messages: messagesReducer, channels: channelsReducer },
        preloadedState: {
          messages: { ...messagesInitialState, isLoading },
          channels: {
            ...channelsInitialState,
            isLoading,
            channels: [{ id: "general", name: "全体連絡" }],
          },
        },
      },
    );
  };

  test("URLパラメータからchannelIdを取得し,子コンポーネントに正しくわたる", () => {
    renderMainPage("/channels/general");

    expect(screen.getByTestId("message-textbox")).toHaveTextContent(
      "MessageTextBox:general",
    );
    expect(screen.getByTestId("messages-list")).toHaveTextContent(
      "MessagesList:general",
    );
  });

  // 異常系:存在しない/無効な channelIdの時,snackbarを表示しredirectされる はuseMainPage.test.jsxで実施済みのため省略

  test("MessageTextBox,MessagesList,dividerが描写される", () => {
    const { container } = renderMainPage("/channels/general");

    ["message-textbox", "messages-list"].forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });

    expect(container.querySelector(".divider")).toBeInTheDocument();
  });

  test("ロード中はコンポーネントを表示しない", () => {
    renderMainPage("/channels/general", true);

    expect(screen.queryByTestId("message-textbox")).not.toBeInTheDocument();
  });

  test("正常系のレイアウトが崩れていないこと", () => {
    const { asFragment } = renderMainPage("/channels/general");
    expect(asFragment()).toMatchSnapshot();
  });
});
