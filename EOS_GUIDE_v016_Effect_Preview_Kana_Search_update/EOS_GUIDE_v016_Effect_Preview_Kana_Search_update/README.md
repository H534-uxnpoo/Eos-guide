# EOS GUIDE v0.16 更新パック

## 内容

- `CODEX_UPDATE_v0.16.md`：Codexへ渡す更新指示
- `eos-guide-data-v0.15.json`：利用者が編集した最新版JSON（正本）
- `effect_fixture_animation_mockup.svg`：Effect灯体プレビューの参考図

## 使い方

1. このフォルダまたはZIPをEOS GUIDEプロジェクト直下へ置く。
2. Codexへ次のように依頼する。

```text
EOS_GUIDE_v016_Effect_Preview_Kana_Search_update/CODEX_UPDATE_v0.16.mdを読み、
同梱のeos-guide-data-v0.15.jsonを唯一の基準データとして、記載内容を実装してください。
既存のStepTimelineは削除・置換せず、回帰テストまで実行してください。
```

3. 実装完了後、画面確認を行ってから更新パックはバックアップ先へ移動してよい。

## 注意

過去版のJSONへ戻さないこと。特に、現在のプロジェクト内のJSONよりもこのパック内のv0.15を優先する。
