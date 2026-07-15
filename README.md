# 廢土守夜站 v8

手機優先的 3D 末日守城遊戲。v8 加入本地 Three.js 戰場、四角色 3D 檔案室、三路敵潮、攻擊／受擊動畫與手動技能落點；既有主城、抽卡、角色成長、建築、離線收益與 v7 存檔維持相容。

## 本機啟動

ES modules 與 glTF 必須透過 HTTP：

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

開啟 `http://127.0.0.1:4173/`。不需 npm、建置工具、框架或 CDN。

若裝置沒有 WebGL，遊戲會保留可操作的戰術 HUD；可用 `?no3d=1` 強制驗證降級模式。

## 資產

模型來自 Quaternius Zombie Apocalypse Kit（CC0）；3D runtime 為本地 Three.js 0.185.1（MIT）。完整來源、授權與使用清單見 [ASSET_LICENSES.md](ASSET_LICENSES.md)。
