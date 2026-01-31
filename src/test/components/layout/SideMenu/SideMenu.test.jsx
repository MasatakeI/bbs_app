import { describe, test, expect, vi, beforeEach } from "vitest";

import { render, screen } from "@testing-library/react";
import { renderWithStore } from "@/test/utils/remderWithStore";
import channelsReducer from "@/redux/features/channels/channelsSlice";
import SideMenu from "@/components/layout/SideMenu/SideMenu";

import { mockChannels } from "@/test/models/__fixtures__/firestoreChannelData";
import { MemoryRouter } from "react-router";

import * as channelsThunks from "@/redux/features/channels/channelsThunks";
import userEvent from "@testing-library/user-event";

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

  test("マウント時fetchChannelsAsyncがdispatchされる", () => {
    const { dispatchSpy } = renderWithStore(<SideMenu />, {
      reducers: { channels: channelsReducer },
      preloadedState: {
        channels: {
          channels: [],
          isLoading: false,
          error: null,
        },
      },
    });

    // expect(dispatchSpy).toHaveBeenCalledWith({
    //   type: "channels/fetchChannels",
    // });

    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Function));
  });

  test("channelsとChannelTextBoxが表示される", () => {
    renderWithStore(
      <MemoryRouter>
        <SideMenu />
      </MemoryRouter>,
      {
        reducers: { channels: channelsReducer },
        preloadedState: {
          channels: {
            channels: mockChannels,
            isLoading: false,
            error: null,
          },
        },
      },
    );

    const links = screen.getAllByRole("link", { name: "channel-name" });
    expect(links).toHaveLength(mockChannels.length);

    mockChannels.forEach(({ name }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("ここに入力")).toBeInTheDocument();
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

  // test("error時,再読み込みボタンが表示され,クリックで再dispatchされる", async () => {
  //   const user = userEvent.setup();

  //   const { dispatchSpy } = renderWithStore(
  //     <MemoryRouter>
  //       <SideMenu />
  //     </MemoryRouter>,
  //     {
  //       reducers: { channels: channelsReducer },
  //       preloadedState: {
  //         channels: {
  //           channels: [],
  //           isLoading: false,
  //           error: "error",
  //         },
  //       },
  //     },
  //   );

  //   const fetchButton = screen.getByRole("button", { name: "再読み込み" });

  //   expect(fetchButton).toBeInTheDocument();

  //   await user.click(fetchButton);
  //   expect(dispatchSpy).toHaveBeenNthCalledWith(1, expect.any(Function));
  //   expect(dispatchSpy).toHaveBeenNthCalledWith(2, expect.any(Function));
  // });
});
