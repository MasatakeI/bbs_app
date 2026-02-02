import { describe, test, expect, vi, beforeEach } from "vitest";

import { render, screen } from "@testing-library/react";
import { renderWithStore } from "@/test/utils/remderWithStore";
import channelsReducer from "@/redux/features/channels/channelsSlice";
import SideMenu from "@/components/layout/SideMenu/SideMenu";

import { MemoryRouter } from "react-router";

import * as channelsThunks from "@/redux/features/channels/channelsThunks";
import userEvent from "@testing-library/user-event";
import { mockChannelViewData } from "../../__fixtures__/channelViewData";

vi.mock("@/components/widgets/Form/ChannelForm", () => ({
  default: () => <div data-testid="channel-form">ChannelForm</div>,
}));
vi.mock("@/components/common/Modal/Modal", () => ({
  default: () => <div data-testid="delete-modal">DeleteModal</div>,
}));

vi.mock("@/redux/features/channels/channelsThunks", async () => {
  const mockThunk = (base) =>
    Object.assign(
      vi.fn(() => () => {}),
      {
        pending: `${base}/pending`,
        fulfilled: `${base}/fulfilled`,
        rejected: `${base}/rejected`,
      },
    );
  const actual = await vi.importActual(
    "@/redux/features/channels/channelsThunks",
  );

  return {
    ...actual,
    fetchChannelsAsync: mockThunk("channels/fetchChannels"),
    addChannelAsync: mockThunk("channels/addChannel"),
  };
});

describe("SideMenu", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("isLoading=trueの時,スピナーを表示", () => {
    renderWithStore(
      <MemoryRouter>
        <SideMenu />
      </MemoryRouter>,
      {
        reducers: { channels: channelsReducer },
        preloadedState: {
          channels: {
            channels: [],
            isLoading: true,
            error: null,
          },
        },
      },
    );

    expect(
      screen.getByRole("progressbar", { name: "loading" }),
    ).toBeInTheDocument();
  });

  test("channelsとChannelFormが表示される", () => {
    renderWithStore(
      <MemoryRouter>
        <SideMenu />
      </MemoryRouter>,
      {
        reducers: { channels: channelsReducer },
        preloadedState: {
          channels: {
            channels: mockChannelViewData,
            isLoading: false,
            error: null,
          },
        },
      },
    );

    mockChannelViewData.forEach((ch) => {
      expect(screen.getByText(ch.name)).toBeInTheDocument();
    });

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(mockChannelViewData.length);

    const deleteButton = screen.getAllByTitle("削除");
    expect(deleteButton).toHaveLength(mockChannelViewData.length);

    const actionButton = screen.getByTitle("トグルボタン");
    expect(actionButton).toBeInTheDocument();
  });

  test("追加ボタン（＋）をクリックした時に ChannelFormが出現する", async () => {
    const user = userEvent.setup();
    renderWithStore(
      <MemoryRouter>
        <SideMenu />
      </MemoryRouter>,
      {
        reducers: { channels: channelsReducer },
        preloadedState: {
          channels: {
            channels: mockChannelViewData,
            isLoading: false,
            error: null,
          },
        },
      },
    );
    const actionButton = screen.getByTitle("トグルボタン");

    await user.click(actionButton);

    expect(screen.getByTestId("channel-form")).toBeInTheDocument();
  });

  test("削除ボタン（ゴミ箱）をクリックした時に、削除確認モーダルが表示される", async () => {
    const user = userEvent.setup();
    renderWithStore(
      <MemoryRouter>
        <SideMenu />
      </MemoryRouter>,
      {
        reducers: { channels: channelsReducer },
        preloadedState: {
          channels: {
            channels: mockChannelViewData,
            isLoading: false,
            error: null,
          },
        },
      },
    );
    const deleteButtons = screen.getAllByTitle("削除");

    await user.click(deleteButtons[0]);

    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
  });
});
