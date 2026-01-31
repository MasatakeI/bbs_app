import { describe, test, expect, vi, beforeEach } from "vitest";

import App, { AppContent } from "@/App";

import { screen } from "@testing-library/react";

import { renderWithStore } from "./utils/remderWithStore";
import channelsReducer, {
  channelsInitialState,
} from "@/redux/features/channels/channelsSlice";
import messagesReducer, {
  messagesInitialState,
} from "@/redux/features/messages/messagesSlice";
import snackbarReducer, {
  snackbarInitialState,
} from "@/redux/features/snackbar/snackbarSlice";
import { MemoryRouter } from "react-router";

vi.mock("@/components/layout/Header/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));
vi.mock("@/components/layout/Footer/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));
vi.mock("@/components/layout/SideMenu/SideMenu", () => ({
  default: () => <div data-testid="side-menu">SideMenu</div>,
}));
vi.mock("@/components/page/MainPage/MainPage", () => ({
  default: () => <div data-testid="main-page">MainPage</div>,
}));
vi.mock("@/components/common/SimpleSnackbar/SimpleSnackbar", () => ({
  default: () => <div data-testid="simple-snackbar">SimpleSnackbar</div>,
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOptions = {
    reducers: {
      channels: channelsReducer,
      messages: messagesReducer,
      snackbar: snackbarReducer,
    },
    preloadedState: {
      channels: { ...channelsInitialState },
      messages: { ...messagesInitialState },
      snackbar: { ...snackbarInitialState },
    },
  };

  test(`初期パス '/' の時, '/channels/general'にリダイレクトされる `, () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/"]}>
        <AppContent />
      </MemoryRouter>,

      commonOptions,
    );

    expect(screen.getByTestId("main-page")).toBeInTheDocument();
  });
  describe("レイアウトの基本コンポーネントが描画される", () => {
    test.each(["header", "side-menu", "simple-snackbar", "footer"])(
      "%s",
      (id) => {
        renderWithStore(<App />, commonOptions);

        expect(screen.getByTestId(id)).toBeInTheDocument();
      },
    );
  });

  test("MainPageをchannelIdによってルートとして表示できる", () => {
    window.location.pathname = "/channels/:channelId";
    renderWithStore(<App />, commonOptions);

    expect(screen.getByTestId("main-page")).toBeInTheDocument();
  });

  test("snackbarが開いているとき,メッセージが正しく表示される", () => {
    renderWithStore(<App />, {
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        snackbar: {
          snackbarOpen: true,
          snackbarMessage: "エラー",
        },
      },
    });

    expect(screen.getByTestId("simple-snackbar")).toBeInTheDocument();
  });

  test("存在しないパス（例: /invalid-path）にアクセスした時、'/channels/general' にリダイレクトされる", () => {
    renderWithStore(
      <MemoryRouter initialEntries={["/invalid-path"]}>
        <AppContent />
      </MemoryRouter>,
      commonOptions,
    );

    // リダイレクト先で MainPage が表示されることを確認
    expect(screen.getByTestId("main-page")).toBeInTheDocument();
  });
});
