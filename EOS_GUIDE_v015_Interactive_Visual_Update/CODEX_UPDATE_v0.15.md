# EOS GUIDE v0.15 インタラクティブ図解更新

現在のEOS GUIDE v0.14.1へ、6種類の図解・操作UIを追加してください。

この更新では、キーボードのインタラクティブ試作品とPalette／Preset比較試作品は実装しません。既存のキーボード記事、Palette／Preset記事はそのまま維持してください。

## 更新パックのファイル

- `eos-guide-data-v0.15.json`
- `reference/eos-guide-v015-prototype.html`
- `reference/eos-guide-v015-layout-reference.svg`
- `reference/eos-guide-v015-layout-reference.png`
- `CODEX_UPDATE_v0.15.md`

HTMLは動きと操作の見本、SVGはレイアウトと色のベクター見本、PNGは全体をすぐ確認するための見本画像です。完成アプリへHTMLをそのままiframe表示したり、SVGやPNGを記事画像として貼ったりせず、既存のEOS GUIDEデザインに合わせたReactコンポーネントとして実装してください。

## 1. 最初に現在の実装を確認する

変更前に次を確認してください。

1. 現在読み込んでいるJSONの場所
2. `ContentSections.tsx`のsection type分岐
3. `types.ts`のcontent section型
4. 既存の`StepTimeline.tsx`、Cue図解コンポーネントの構造
5. `styles.css`の色、余白、スマホ向け指定
6. Playwrightテストの起動方法

既存コードを推測だけで置き換えず、現在の構造へ追加してください。

## 2. JSONをv0.15へ更新する

現在アプリが直接読み込んでいるJSONを、`eos-guide-data-v0.15.json`へ変更してください。

`src/data.ts`などでファイル名を直接importしている場合は、参照先も更新してください。

更新後の件数：

- 表示記事：36件
- 非表示記事：34件
- 新規記事：`1_5 最初に知っておきたい用語`
- 新規section type：6種類

```text
cue_workflow
glossary
live_blind_comparison
offset_fan_visualizer
submaster_visualizer
effect_type_flow
```

## 3. 作成するコンポーネント

次のような構成を基本にしてください。既存構成に合う場合はファイル名を調整して構いません。

```text
src/components/CueWorkflow.tsx
src/components/Glossary.tsx
src/components/LiveBlindComparison.tsx
src/components/OffsetFanVisualizer.tsx
src/components/SubmasterVisualizer.tsx
src/components/EffectTypeFlow.tsx
```

状態やイベントを使用するコンポーネントには、ファイル先頭へ必ず次を付けてください。

```tsx
"use client";
```

以前HooksをServer Componentとして読み込み、記事を開くと黒画面になる問題がありました。同じ問題を再発させないでください。

## 4. CueWorkflow

### 掲載場所

```text
11_2 Cueの作り方
```

記事本文の最初に表示してください。

### 表示内容

横長のフローとして次の8工程を表示します。

```text
Show File → Patch → Channel → Look → Record → GO → Update → Save
```

日本語の補助表示：

```text
開く／新規
灯体を登録
灯体を選択
明かりを作る
Cueを記録
再生・確認
修正を反映
Shift＋U
```

### 操作

- 最初はShow Fileを選択
- 工程をタップすると、その工程のdetailを下へ表示
- `article_id`がある工程は、詳細欄から対応記事へ移動できるようにする
- 選択中の工程を色だけでなく、背景・太さ・`aria-pressed`でも示す
- PCでは1列の横長フロー
- 狭い画面では2列または1列へ折り返し、横方向へ画面全体がはみ出さない
- 工程間の矢印はPC表示で使用し、折り返し時に不自然なら非表示にする

完成イメージは`reference/eos-guide-v015-prototype.html`のCueタブを参照してください。

## 5. Glossary

### 掲載場所

新規記事を最初のセットアップカテゴリへ追加します。

```text
1_5 最初に知っておきたい用語
category_id: start
route: /guide/1_5
```

### 操作

- 用語を2〜4列のボタン状グリッドで表示
- 最初はChannelを選択
- 用語をタップすると短い説明を下へ表示
- 320px幅では2列
- ボタン内には用語だけを表示し、説明文を詰め込まない
- `aria-pressed`と`aria-live="polite"`を付ける

JSONにある12用語をすべて使用してください。

```text
Channel / Address / Universe / Parameter / Target / Manual Data
Background / Tracking / Cue Only / Palette / Preset / Part
```

用語の説明を勝手に長文化しないでください。

## 6. LiveBlindComparison

### 掲載場所

```text
7_1 画面の見方
```

既存の「LiveとBlind」表の直後付近へ表示してください。

### デザイン

- Liveはオレンジ／金色
- Blindは青色
- Live側はCue作成と実出力を表すChannel画面風
- Blind側はPatchや記録データ編集を表すPatch画面風
- これは概念図であり、実画面の完全な再現ではないと分かる構成にする
- 実際のEosスクリーンショットを捏造しない

### 表示文

Live：

- Cue作成・実出力
- 変更が実際の出力へすぐ反映される
- オレンジ／金色で表示

Blind：

- Patch・記録データ編集
- 変更を実際の出力へすぐ反映しない
- 青色で表示

色だけに依存せず、LIVE／BLINDの文字と説明を常に表示してください。

## 7. OffsetFanVisualizer

### 掲載場所

```text
8_11 Offset・Fan
```

既存の「OffsetとFanの違い」直後へ表示してください。

### Offset

- BeforeとしてChannel 1〜9を丸で表示
- 選択できる種類はReverse、Odd、Even、Random
- AfterへJSONの`result`順で丸を表示
- 初期値はReverse
- RandomはJSONに記録された固定順を使う
- 初回レンダーで`Math.random()`を使用しない。SSRとクライアントのhydration差を防ぐ

### Fan

- 横軸：Channel 1〜9
- 縦軸：Value 0〜100%
- 広がりを0〜50のスライダーで変更
- 中央Channelの値は50%
- スライダー変更時に折れ線と点をリアルタイム更新
- SVGへ`role="img"`と説明を付ける
- Channel番号と0／50／100%を読み取れるようにする
- SVG内の文字は11px未満にしない

Fan値は次の考え方で計算できます。

```ts
value = center + normalizedPosition * spread
```

Channel 5を中央、Channel 1を-1、Channel 9を+1として扱います。

## 8. SubmasterVisualizer

### 掲載場所

```text
12_1 Submasterの使い方
```

既存のHTP／LTP説明の直後へ表示してください。

### 操作

- 入力Aと入力Bを0〜100%のスライダーで変更
- 初期値はA＝70%、B＝40%
- HTPは`Math.max(A, B)`
- LTPは最後に動かした入力値
- A、B、HTP、LTPを同じ長さ基準のバーで比較
- 数値をバーの外にも表示
- LTPは「最後に動かしたA／B」も表示
- `aria-live="polite"`で結果を通知

### 3モード

図の下へ簡潔に表示します。

```text
Additive：現在の出力へ加える
Inhibitive：対象Channelの出力へ上限を設ける
Effect：Effectをフェーダーで実行
```

HTPとLTPの図と、3モードの説明を混同しないでください。

## 9. EffectTypeFlow

### 掲載場所

```text
13_1 Effectとは
```

記事本文の最初に表示してください。

### レイアウト

PCでは次の横長構成にします。

```text
何を作りたい？ → 目的を選ぶ → おすすめEffect
```

目的：

```text
灯体を順番に動かす            → Step Based
決めた値を順番に変える        → Absolute
MVのPan／Tiltを動かす         → Focus
Parameterを波形で変化         → Linear
色相・彩度を変化              → Color
```

- 初期値はStep Based
- 目的を選ぶとresultとdescriptionを切り替える
- `article_id`から該当記事へ移動できるようにする
- PCでは横長
- 画面が狭い場合だけ縦へ積む
- 横長表示を維持するために文字を極端に小さくしない

## 10. 型定義とレンダラー

`types.ts`へ、6種類のsectionを判別可能なunionとして追加してください。

最低限、次の構造を型へ含めます。

```ts
type CueWorkflowSection = {
  type: "cue_workflow";
  title: string;
  layout: "horizontal";
  steps: Array<{
    id: string;
    number: number;
    title: string;
    short: string;
    detail: string;
    command?: string;
    article_id?: string;
  }>;
};
```

同様に次も、JSONの構造へ合わせて型を作成してください。

```text
GlossarySection
LiveBlindComparisonSection
OffsetFanVisualizerSection
SubmasterVisualizerSection
EffectTypeFlowSection
```

`ContentSections.tsx`では、既存の汎用処理より前で新しいtypeを判定してください。

未知のtypeや不足データが来ても、`undefined.map`などで記事全体を黒画面にしないようにします。

```tsx
if (!Array.isArray(section.steps)) return null;
```

のような安全確認を各コンポーネントとレンダラーへ入れてください。

## 11. デザイン

- 既存EOS GUIDEの背景、角丸、色、文字サイズを使用
- 見本HTMLのCSSをアプリへ丸ごとコピーしない
- Liveのアクセントはオレンジ
- BlindとFanの線は青
- 選択状態は色だけでなく背景、文字、`aria-pressed`で示す
- 重要でない装飾アニメーションを追加しない
- `prefers-reduced-motion`へ対応
- 320px幅で本文全体が横にはみ出さない
- スライダーの操作領域はスマホでも十分な大きさにする
- 表やグラフのラベルは11px未満にしない
- 横長フローはPCで横長、スマホでは折り返す

## 12. 今回実装しないもの

次は今回の更新へ追加しないでください。

- キーが順番に光るインタラクティブキーボード
- Palette／Preset比較マトリクス
- Color Paletteの4工程プログレス表示
- 新しいMagic Sheet機能
- Magic SheetのOffset
- 別のMagic Sheetへ移動する説明
- Magic Sheet最後のwarning

既存の静的キーボード画像、Palette／Preset記事は削除しません。

## 13. 既存機能を維持する

- v0.14.1のPCコマンド表
- Step Based Effectのインタラクティブ時間軸
- Cue Time図
- Follow／Hang図
- Cue記事の黒画面対策
- Patch、Magic Sheet、Palette／Preset画像
- 記事統合URL
- 既存のお気に入り移行
- PWA／オフライン表示

既存画像を削除・移動しないでください。

## 14. テスト

PowerShellで次を実行してください。

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Playwrightテストを追加し、少なくとも次を確認してください。

### CueWorkflow

- `11_2`で8工程が表示される
- 工程を押すとdetailが変わる
- PC幅で横長、320px幅で画面全体が横にはみ出さない

### Glossary

- `1_5`がセットアップカテゴリに表示される
- 12用語が表示される
- 選択した用語の説明へ切り替わる

### Live／Blind

- `7_1`にLiveとBlindが両方表示される
- Liveがオレンジ、Blindが青
- LIVE／BLINDの文字が表示される

### Offset／Fan

- Reverse、Odd、Even、RandomでAfterが変わる
- FanスライダーでSVGの点と折れ線が変わる
- 0と50でもエラーにならない

### Submaster

- A／Bを動かすとHTPが高い値になる
- LTPが最後に動かした入力になる
- 0%、100%でも表示が壊れない

### Effect

- 5種類を切り替えられる
- resultとdescriptionが更新される
- 対応記事へのリンクが正しい

### 回帰確認

- 表示36記事をすべて開いて黒画面にならない
- ブラウザConsoleに未処理エラーがない
- v0.14.1以前の画像と図が表示される
- インタラクティブキーボードが追加されていない
- Palette／Preset比較マトリクスが追加されていない
- Magic Sheetで削除済みの内容が復元されていない
- 古い統合URLとお気に入りが正しく移行する

## 15. 完了報告

最後に次を報告してください。

- 変更したファイル
- 新規コンポーネント6件
- 表示／非表示記事数
- 新規記事`1_5`の表示位置
- typecheck結果
- lint結果
- build結果
- Playwright結果
- 320px幅の確認結果
- 全36記事の巡回結果
- Consoleエラーの有無

ビルド成功だけで完了とせず、実際の記事を開いて操作してください。
