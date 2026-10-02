# EOS GUIDE

ETC Eos Familyの操作を目的別に確認する、日本語のReact / TypeScript / Vite製PWAです。対応確認は資料記載のEos v3.2.7です。

## 起動

Node.js 22.12以上（作業環境: 24.21）を使用します。Windows PowerShellでスクリプト実行が制限されている場合は `npm.cmd` を使ってください。

```powershell
npm.cmd install
npm.cmd run dev
```

表示されたローカルURLを開きます。本番相当のPWA確認は以下です。

```powershell
npm.cmd run build
npm.cmd run preview
```

PWAはlocalhostまたはHTTPSで動作します。初回オンラインアクセスでキャッシュ完了後にオフライン利用できます。PDF本体はキャッシュ対象に含めません。iPhoneではSafariの共有メニューから「ホーム画面に追加」でインストールできます。実機でのインストール確認は別途必要です。

## 機能

- 12個の目的別ボタン、カテゴリー別一覧、52記事の詳細
- ひとことで・利用場面・手順・コマンド・警告・小項目・参照ページ（空欄は非表示）
- キー風の折り返し表示、11キーの役割と関連記事
- LocalStorageによるお気に入り、複数タブ同期、保存不可時の案内
- タイトル・概要・キーワード・コマンド・小項目の補助検索（英字大小・全角半角を正規化）
- ダークテーマ、スマホ2列／タブレット3列／PC4列、キーボード操作
- Service Workerによる本体・データのプリキャッシュ、更新通知
- 存在しないURL・不正なURLの案内

## データと資料

`CODEX_PROMPT.md`、`EOS_GUIDE_v0.4_Effect_timeline_update/eos-guide-data-v0.4.json`、`操作マニュアル 1.1.0 w.pdf`を確認して実装しました。元資料は変更していません。`eos-guide-data(1).json`は使用しません。

- 元JSONを `src/data.ts` から直接importしています。別ファイルへの手作業の複製は行っていません。JSONは本番のJavaScriptに含まれ、アプリと一緒にキャッシュされます。
- テーマカラーはホーム項目に無い場合、`chapters`の同じ`category_id`から取得します。
- v0.4 JSONを唯一の本文データソースとして使用します。旧 `src/procedures.json` は履歴として残していますが、読み込みません。新JSONにない手順は追加表示しません。
- `source.extracted_text`は画面へ表示しません。空の利用場面・コマンド・注意点を推測で補っていません。
- キーボード索引の16キーのうち、公開記事を参照する11キーを表示します。非表示記事へのリンクは出しません。PCショートカットは公開記事の `keyboard_shortcuts` から自動集約します。
- Effect、Magic Sheet、キー配置記事には画像用の領域を用意しています。画像の転載は行っていません。

### 画像と手順を追加する場合

`src/types.ts`の`Article`に`steps?: string[]`と`diagrams?: Diagram[]`があります。記事JSONへ以下の任意フィールドを追加できます。画像ファイルは`public/diagrams/`などに配置してください。

```json
{
  "diagrams": [{ "src": "/diagrams/example.png", "alt": "図の内容を説明する代替テキスト", "caption": "任意の説明" }]
}
```

`src`のない図は「画面図は準備中」と表示します。追加画像はPWAのビルド時にキャッシュされます。

## 主な構成

- `src/App.tsx`: ハッシュURLによる画面切替、ホーム、一覧、検索、お気に入り
- `src/components/`: 記事カード・記事詳細・コマンド・キーボード・アイコン
- `src/data.ts`, `src/types.ts`: 資料データとの接続、型定義
- `src/components/ShortcutKeys.tsx`: PCショートカットの共通キー表示（記事詳細・キーボード一覧）
- `src/styles.css`: ダークテーマとレスポンシブ表示
- `vite.config.ts`, `public/icon-*.png`: PWA設定と仮アイコン
- `tests/app.spec.mjs`: 実ブラウザでの回帰テスト

## 検証

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npx.cmd playwright install chromium
npm.cmd test
```

テストはproduction previewを起動して確認します。390×844のスマホ相当、320px幅、1440pxのPC表示、全記事へのアクセス、データ件数、お気に入りの保持と解除、検索、404、コンソールエラー、オフライン再読み込みを対象にしています。画面画像は`test-results/`に出力します。

## 次の拡張

PDFとの照合を続けた全記事の手順整備、自作画面図、物理配置に沿ったキーボード、実機iPhoneでのインストール・オフライン検証。

### v0.1時点の確認結果（更新前の記録）

- 型チェック、lint、production build: 成功
- Playwright: 4テスト成功（Chromium、production preview）
- 12ホームボタン、72記事、16キー: 全件アクセス成功
- お気に入り: リロード後保持・解除・壊れた保存値からの復帰を確認
- 検索、存在しない記事URL、空カード非表示、キーボードでの本文移動: 成功
- 390×844・320px幅・1440px幅: 横はみ出しなし。スマホ／PC画像で日本語表示を確認
- オフライン再読み込み: ホーム・カテゴリー・記事・キーボード・検索・お気に入りで成功
- ブラウザのページエラー・console.error: なし
- 実機iPhoneでのインストール操作は未実施


## v0.2 更新

`CODEX_UPDATE_v0.2.md`に沿って更新。公開52記事・非表示17記事。Patchは`5_1`「Patchとは・Patch画面の見方」、Submasterは`12_1`「Submasterの使い方」に統合されています。統合情報はJSONの`editorial_review.merge_groups`から読み込み、旧URLとお気に入りIDを移行します。非表示ID・不明IDのお気に入りは安全に除外し、統合による重複も取り除きます。

記事詳細の「PCキーボード」と、Eosキーボード画面の「PCキーボードショートカット」に、確認済みのGo To Cue（Ctrl + Q → Cue番号 → Enter）を表示します。JSONへ追加したショートカットも自動表示されます。元の卓上コマンドとは別に表示し、空カードは出しません。

### v0.2の確認結果

型チェック・lint・production build成功。Playwrightの6テスト成功。公開52記事、非表示17記事、12カテゴリー、公開記事を参照する11キー、統合元URLの転送、お気に入りのID移行・重複除去・再読み込み後の保持、PCショートカットの表示と記事リンク、空カード非表示、320px幅の折り返し、オフライン動作を確認しました。ブラウザのconsole.error・ページエラーはありません。


## v0.4 Effect記事・時間軸

同梱の `CODEX_UPDATE_v0.4.md` と参考図を確認して更新しました。現在は同梱フォルダのv0.4 JSONを直接読み込みます。公開52記事・非表示17記事、統合URL・お気に入り移行・PCショートカットは維持しています。

- `src/components/ContentSections.tsx`: paragraphs / bullets / steps / table / note / image / step_timelineをJSONの配列順に描画する汎用レンダラー。
- `src/components/StepTimeline.tsx`: 設定項目表の直後に置くReact＋SVG時間軸。defaultsで初期化し、editableに含まれる項目のみ編集可能。開始は0始まりのStep順序×Step Time、終了は開始＋In＋Dwell＋Decayで計算します。
- `public/assets/effects/`: 同梱の画像4点を配置。PWAのプリキャッシュ対象でオフラインでも表示可能です。参考手書き図は掲載しません。
- 各チャンネルは共通の時間軸・0〜100%の高さスケールで描画。領域・ラベル・実線／破線で各フェーズを区別します。SVGのタイトルと動的説明、スクロール領域のキーボード操作に対応。
- 操作確認用の入力範囲は時間0〜60秒、値0〜100%。LocalStorageへ保存せず、再表示・リロードで初期値に戻ります。
- スマホでは図を横スクロールでき、320px幅では操作欄を1列表示。図中に収まらないフェーズ名も凡例で確認できます。
- Linear／ColorはJSONの「使用経験がないため、公式仕様のみ」の注意と「公式情報による補足」を表示します。

指示文の「Effect4種類の比較」と同梱JSONの3種類（Step Based / Absolute / Relative）には相違があります。アプリではJSONを改変せず、3種類とRelativeの内訳を表示しています。
