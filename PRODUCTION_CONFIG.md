# 本番環境設定ガイド

このドキュメントは、「自分との約束手帳」アプリを本番環境で実行するための設定をまとめています。

## 📋 目次

1. [環境変数リファレンス](#環境変数リファレンス)
2. [Vercel での設定](#vercel-での設定)
3. [本番ビルド](#本番ビルド)
4. [セキュリティ設定](#セキュリティ設定)
5. [パフォーマンス最適化](#パフォーマンス最適化)

---

## 環境変数リファレンス

### 必須環境変数

このアプリはローカルストレージのみでデータを保存するため、**環境変数は必須ではありません**。

ただし、以下の環境変数を設定することで、アプリの動作をカスタマイズできます。

| 変数名 | 型 | デフォルト | 説明 |
|--------|-----|----------|------|
| `NODE_ENV` | string | `production` | 実行環境（開発時は `development`） |
| `EXPO_PUBLIC_API_BASE_URL` | string | 自動検出 | バックエンド API のベース URL（オプション） |

### オプション環境変数

バックエンドを使用する場合のみ設定します。

| 変数名 | 型 | 説明 | 例 |
|--------|-----|------|-----|
| `EXPO_PUBLIC_OAUTH_PORTAL_URL` | string | OAuth ポータル URL | `https://auth.manus.im` |
| `EXPO_PUBLIC_OAUTH_SERVER_URL` | string | OAuth サーバー URL | `https://oauth.manus.im` |
| `EXPO_PUBLIC_APP_ID` | string | アプリ ID | - |
| `EXPO_PUBLIC_OWNER_OPEN_ID` | string | オーナー ID | - |
| `EXPO_PUBLIC_OWNER_NAME` | string | オーナー名 | - |

---

## Vercel での設定

### ステップ 1: Vercel プロジェクト設定を開く

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. 「Settings」をクリック

### ステップ 2: 環境変数を設定

1. 左メニューから「Environment Variables」を選択
2. 「Add New...」をクリック
3. 以下の環境変数を追加：

```
NODE_ENV = production
```

### ステップ 3: デプロイ設定を確認

1. 「General」をクリック
2. 以下を確認：

| 項目 | 値 |
|------|-----|
| **Build Command** | `pnpm run build:web` |
| **Output Directory** | `dist/web` |
| **Install Command** | `pnpm install --frozen-lockfile` |
| **Node.js Version** | 18.x 以上 |

### ステップ 4: デプロイ

```bash
# GitHub にプッシュすると自動デプロイ
git push origin main
```

---

## 本番ビルド

### ローカルで本番ビルドをテスト

```bash
# 本番環境変数を設定
export NODE_ENV=production

# Web 版をビルド
pnpm run build:web

# ビルド出力を確認
ls -la dist/web/
du -sh dist/web/
```

### ビルド出力の確認

**期待される出力：**

```
› web bundles (2):
_expo/static/css/web-*.css (11.5 kB)
_expo/static/js/web/entry-*.js (2.63 MB)

› Static routes (12):
/ (index) (23 kB)
/settings (26.9 kB)
/archived-folder (24.2 kB)
...

Exported: dist/web
```

**ファイルサイズ：** 3.6 MB

### ビルド出力の構成

```
dist/web/
├── index.html                    # メインページ
├── settings.html                 # 設定ページ
├── archived-folder.html          # 完了フォルダ
├── promise-input.html            # 約束入力ページ
├── reflection-input.html         # 感想入力ページ
├── mark-checked.html             # 完了チェックページ
├── completion-screen.html        # 完了画面
├── manifest.json                 # PWA マニフェスト
├── apple-touch-icon.png          # iOS アイコン
├── favicon.ico                   # ファビコン
├── _expo/
│   ├── static/
│   │   ├── css/                  # CSS ファイル
│   │   └── js/                   # JavaScript ファイル
│   └── .routes.json              # ルート情報
└── assets/                       # 画像・フォントなど
```

---

## セキュリティ設定

### 1. HTTPS の強制

Vercel は自動的に HTTPS を有効化します。

**確認方法：**
```bash
curl -I https://your-domain.com
# HTTP/2 200 が返されることを確認
```

### 2. セキュリティヘッダー

`vercel.json` で以下のセキュリティヘッダーを設定：

```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "X-Content-Type-Options",
        "value": "nosniff"
      },
      {
        "key": "X-Frame-Options",
        "value": "DENY"
      },
      {
        "key": "X-XSS-Protection",
        "value": "1; mode=block"
      }
    ]
  }
]
```

### 3. ローカルストレージのセキュリティ

**ユーザーデータは各ブラウザのローカルストレージに保存されます。**

- ✅ サーバーには保存されない
- ✅ ユーザーが完全に制御
- ✅ 他のユーザーからは見えない

**ユーザーができる操作：**
- ローカルストレージをエクスポート：ブラウザ開発者ツール → Application → Local Storage
- ローカルストレージをクリア：ブラウザ設定 → キャッシュ・Cookies をクリア
- ローカルストレージをインポート：手動でデータを復元

### 4. Cookie のセキュリティ

Web 版では HTTP-only Cookie を使用します（バックエンド使用時）。

- ✅ JavaScript からアクセス不可
- ✅ HTTPS でのみ送信
- ✅ CSRF 攻撃から保護

---

## パフォーマンス最適化

### 1. キャッシング戦略

`vercel.json` で以下のキャッシング戦略を設定：

```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=3600, s-maxage=3600"
      }
    ]
  },
  {
    "source": "/assets/(.*)",
    "headers": [
      {
        "key": "Cache-Control",
        "value": "public, max-age=31536000, immutable"
      }
    ]
  }
]
```

| キャッシュ対象 | TTL | 説明 |
|--------|-----|------|
| HTML ファイル | 1 時間 | 更新頻度が高いため短め |
| CSS・JavaScript | 1 年 | ハッシュ付きなので長め |
| 画像・フォント | 1 年 | 変更されないため長め |

### 2. ビルドサイズの最適化

**現在のビルドサイズ：** 3.6 MB

**最適化済み項目：**
- ✅ React Compiler 有効化
- ✅ Tree-shaking 有効化
- ✅ 不要な依存関係を削除
- ✅ CSS・JavaScript を圧縮

### 3. ネットワークパフォーマンス

**推奨設定：**
- ✅ Gzip 圧縮（Vercel が自動）
- ✅ Brotli 圧縮（Vercel が自動）
- ✅ HTTP/2（Vercel が自動）
- ✅ CDN キャッシング（Vercel が自動）

### 4. ページ読み込み時間の測定

```bash
# Lighthouse で計測
# https://developers.google.com/web/tools/lighthouse

# または PageSpeed Insights で計測
# https://pagespeed.web.dev
```

---

## 環境別設定

### 開発環境（localhost:8081）

```bash
# 開発サーバーを起動
pnpm run dev

# 環境変数
NODE_ENV=development
EXPO_USE_METRO_WORKSPACE_ROOT=1
```

### ステージング環境（テスト用 Vercel デプロイ）

```bash
# ステージング用ブランチを作成
git checkout -b staging

# 変更をコミット
git commit -m "Staging build"

# GitHub にプッシュ
git push origin staging

# Vercel で自動デプロイ
```

### 本番環境（Vercel）

```bash
# main ブランチに変更をマージ
git checkout main
git merge staging

# GitHub にプッシュ
git push origin main

# Vercel で自動デプロイ
```

---

## トラブルシューティング

### Q: 本番環境でローカルストレージが動作しない

**原因：** ブラウザの設定またはプライベートブラウジングモード

**解決方法：**
1. プライベートブラウジングモードを無効化
2. Cookie を有効化
3. ブラウザのキャッシュをクリア

### Q: ビルドサイズが大きすぎる

**原因：** 不要な依存関係が含まれている

**解決方法：**
```bash
# バンドルサイズを分析
npm install -g webpack-bundle-analyzer

# ビルド分析
pnpm run build:web -- --analyze
```

### Q: デプロイ後にスタイルが適用されない

**原因：** CSS ファイルのパスが誤っている

**解決方法：**
1. ブラウザ開発者ツールで CSS ファイルのパスを確認
2. `vercel.json` の `outputDirectory` が正しいか確認
3. Vercel のビルドログを確認

### Q: PWA がインストールできない

**原因：** manifest.json が正しく読み込まれていない

**解決方法：**
```bash
# manifest.json を確認
curl https://your-domain.com/manifest.json

# ブラウザ開発者ツールでエラーを確認
# Console タブでエラーメッセージを確認
```

---

## 参考資料

| リソース | URL |
|---------|-----|
| Vercel Environment Variables | https://vercel.com/docs/environment-variables |
| Vercel Deployment Settings | https://vercel.com/docs/deployments/configure-a-build |
| Expo Web Deployment | https://docs.expo.dev/guides/web/ |
| Web Performance | https://web.dev/performance/ |

---

**最終更新：** 2026 年 3 月 24 日
