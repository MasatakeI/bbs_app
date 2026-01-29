① UI 用メッセージマップを作る

Model : Firestore / Error正規化
Thunk : async orchestration
Middleware : 横断的UI副作用（snackbar）
Slice : state遷移のみ
Selector : 表示用加工

# クイズアプリ 開発ログ / 設計メモ

本ドキュメントは README（仕様書）とは分離し、
**設計判断の背景・試行錯誤・学び** を記録するためのメモです。
将来のリファクタやレビュー時の判断根拠として残します。

---

## 設計の全体方針

### レイヤー分離の思想

本アプリでは以下のレイヤー分離を強く意識した。

- Fetcher：API 通信のみ
- Model：データ整形・ビジネスロジック
- Redux：事実データの保持
- Selector：派生データの生成
- Hook：画面ロジックの集約
- Component：描画専用

**UI は API 仕様・生データを直接知らない** ことを最重要ルールとした。

---

## Redux 設計メモ

### Slice 分割の判断

| Slice        | 理由                         |
| ------------ | ---------------------------- |
| quizContent  | 非同期取得 + キャッシュ責務  |
| quizProgress | 回答・進行という「状態遷移」 |
| quizSettings | 開始前のみ使われる設定情報   |

「1 Slice = 1 画面」ではなく、
**状態の寿命と責務** を基準に分割した。

---

### Slice 間連携について

- Slice 間で reducer を直接呼ばない
- 連携は `extraReducers` のみに限定
- fulfilled / rejected など **イベントベース連携** を採用

これにより循環依存を防止。

---

## Selector 設計メモ

### Selector に寄せた理由

- shuffle / translate などは「表示用ロジック」
- Component に置くと再レンダリング条件が複雑化
- Selector + createSelector による再計算制御が安全

**Redux = 事実、Selector = 表示用加工** という役割分担を徹底。

---

## Custom Hook 設計メモ

### Hook を作る基準

以下のいずれかに当てはまる場合、Hook を作成した。

- Redux selector / dispatch が 2 つ以上
- useEffect + 条件分岐が発生
- 画面遷移や副作用を含む

Hook は「画面の司令塔」、Component は「View」と割り切る。

---

## テスト設計ログ

### テストを書かないと決めたもの

- main.jsx
- Router / Provider のラップ部分
- MUI の見た目のみのコンポーネント

理由：

- ライブラリ責務
- テストしても壊れにくい
- コストに対するリターンが低い

---

### テストで意識した点

- 正常系と異常系を必ず分ける
- 空配列・undefined を必ず通す
- UI テストは最小限

「全部テスト」より「壊れやすい所をテスト」。

---

## 実装で詰まった点・学び

### MUI Select の value 問題

- value = undefined / null で warning 発生
- 初期値は必ず '' に統一

→ UI ライブラリの **制約は Model/Redux で吸収しない** と判断。

---

### 条件分岐が効かなかった原因

- 状態更新と参照の責務が混在
- Hook に寄せることで解消

**状態を持つ場所を 1 箇所に集約する重要性を再認識**。

---

## 今後の改善アイデア

- 結果画面を独立 Route に分離
- E2E テスト（Playwright）の検討
- README を「提出用」と「内部用」に分ける

---

## メモ

このドキュメントは「綺麗に書く」より
**判断理由を残す** ことを優先する。
