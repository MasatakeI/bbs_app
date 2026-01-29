import { describe, expect, test } from "vitest";

import snackbarSlice, {
  snackbarInitialState,
  showSnackbar,
  hideSnackbar,
} from "@/redux/features/snackbar/snackbarSlice";

describe("snackbarSlice", () => {
  const message = "aaを追加しました";
  test("初期stateのテスト", () => {
    expect(snackbarInitialState).toEqual({
      snackbarOpen: false,
      snackbarMessage: "",
    });
  });

  test("showSnackbar:snackbarを開きmessageを設定する", () => {
    const action = showSnackbar(message);
    const state = snackbarSlice(snackbarInitialState, action);
    expect(state).toEqual({
      snackbarOpen: true,
      snackbarMessage: message,
    });
  });

  test("hideSnackbar:snackbarを閉じる(初期値に戻す)", () => {
    const prev = {
      snackbarOpen: true,
      snackbarMessage: message,
    };

    const action = hideSnackbar();
    const state = snackbarSlice(prev, action);

    expect(state).toEqual({
      snackbarOpen: false,
      snackbarMessage: "",
    });
  });

  // 単体セレクターのテストは省略.ロジックを持たないため
});
