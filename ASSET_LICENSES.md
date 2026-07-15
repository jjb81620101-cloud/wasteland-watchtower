# v8 資產與授權

## Quaternius — Zombie Apocalypse Kit

- 官方頁：https://quaternius.com/packs/zombieapocalypsekit.html
- 作者：Quaternius
- 授權：CC0 1.0（可商用、修改與再散布）
- 授權原文：[`assets/3d/LICENSE-Quaternius.txt`](assets/3d/LICENSE-Quaternius.txt)
- 官方授權連結：https://creativecommons.org/publicdomain/zero/1.0/
- 下載來源：官方頁連結的公開 Google Drive 資料夾；2026-07-15 重新查證。

只採用同一包內的必要 glTF，未提交整包：

| 檔案 | 用途 | 大小 |
|---|---|---:|
| `lis.gltf` | 狙擊角色 | 1,885,469 B |
| `matt.gltf` | 重裝角色 | 1,788,924 B |
| `sam.gltf` | 工程角色 | 1,815,561 B |
| `shaun.gltf` | 醫療角色 | 2,008,409 B |
| `zombie.gltf` | 一般／快速敵人 | 1,703,033 B |
| `zombie_chubby.gltf` | 重裝敵人 | 1,671,276 B |

角色名稱、玩法、數值、介面、場景配置與文案皆為《廢土守夜站》原創；只使用 CC0 模型與其動畫，不沿用任何參考影片的角色或 UI。

## Three.js 0.185.1

- 官方專案：https://github.com/mrdoob/three.js
- 套件：https://www.npmjs.com/package/three/v/0.185.1
- 授權：MIT
- 授權原文：[`vendor/three/LICENSE`](vendor/three/LICENSE)
- 本地檔案：`three.module.min.js`、`three.core.min.js`、`GLTFLoader.js`、`SkeletonUtils.js`、`BufferGeometryUtils.js`
- 合計大小：916,134 B

執行時只讀取 repo 內的檔案，不使用 CDN 或模型 hotlink。
