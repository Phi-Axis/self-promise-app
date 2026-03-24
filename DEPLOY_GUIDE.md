# 「自分との約束手帳」Vercel デプロイ完全ガイド

このドキュメントは、「自分との約束手帳」アプリを Vercel で本番デプロイするための完全な手順をまとめています。

## 📋 目次

1. [概要](#概要)
2. [前提条件](#前提条件)
3. [ステップ 1: ローカルビルド確認](#ステップ-1-ローカルビルド確認)
4. [ステップ 2: GitHub にプッシュ](#ステップ-2-github-にプッシュ)
5. [ステップ 3: Vercel に接続](#ステップ-3-vercel-に接続)
6. [ステップ 4: 環境変数を設定](#ステップ-4-環境変数を設定)
7. [ステップ 5: デプロイ確認](#ステップ-5-デプロイ確認)
8. [ステップ 6: カスタムドメイン設定](#ステップ-6-カスタムドメイン設定)
9. [トラブルシューティング](#トラブルシューティング)

---

## 概要

**アプリの特徴：**
- ✅ ローカルストレージのみでデータ保存（バックエンド不要）
- ✅ PWA 対応（ホーム画面から起動可能）
- ✅ iOS・Android・Web で動作
- ✅ 完全にスタティック（静的ファイル）でホスティング可能

**デプロイ構成：**
```
Vercel（フロントエンド）
  ↓
dist/web/（静的ファイル）
  ├── index.html
  ├── settings.html
  ├── archived-folder.html
  └── _expo/（CSS・JavaScript）
```

**ビルド済みファイルサイズ：** 3.6 MB

---

## 前提条件

以下をインストール・準備してください：

| 項目 | 確認方法 |
|------|---------|
| Node.js 18.x 以上 | `node --version` |
| pnpm 9.x 以上 | `pnpm --version` |
| Git | `git --version` |
| GitHub アカウント | https://github.com |
| Vercel アカウント | https://vercel.com（GitHub で登録可能） |

---

## ステップ 1: ローカルビルド確認

### 1.1 プロジェクトディレクトリに移動

```bash
cd /home/ubuntu/self-promise-app
```

### 1.2 依存関係をインストール

```bash
pnpm install
```

### 1.3 Web 版をビルド

```bash
pnpm run build:web
```

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

### 1.4 ビルド出力を確認

```bash
ls -la dist/web/
```

**確認項目：**
- ✅ `index.html` が存在
- ✅ `manifest.json` が存在
- ✅ `_expo/` ディレクトリが存在
- ✅ `apple-touch-icon.png` が存在

---

## ステップ 2: GitHub にプッシュ

### 2.1 Git リポジトリを初期化（初回のみ）

```bash
git init
```

### 2.2 リモートリポジトリを追加

```bash
# GitHub で新しいリポジトリを作成後、以下を実行
git remote add origin https://github.com/YOUR_USERNAME/self-promise-app.git
```

### 2.3 ファイルをステージング

```bash
git add .
```

### 2.4 コミット

```bash
git commit -m "Initial commit: Web app ready for Vercel deployment"
```

### 2.5 GitHub にプッシュ

```bash
git branch -M main
git push -u origin main
```

**確認：** GitHub のリポジトリページでファイルが表示されていることを確認

---

## ステップ 3: Vercel に接続

### 3.1 Vercel Dashboard にアクセス

1. https://vercel.com/dashboard にアクセス
2. GitHub アカウントでログイン

### 3.2 新しいプロジェクトを作成

1. 「Add New...」をクリック
2. 「Project」を選択
3. GitHub リポジトリを選択
4. 「Import」をクリック

### 3.3 ビルド設定を確認

Vercel が自動的に以下を検出します：

| 項目 | 値 |
|------|-----|
| **Build Command** | `pnpm run build:web` |
| **Output Directory** | `dist/web` |
| **Install Command** | `pnpm install --frozen-lockfile` |

これらは `vercel.json` で定義されています。

### 3.4 「Deploy」をクリック

デプロイが開始されます。完了まで 2-5 分かかります。

---

## ステップ 4: 環境変数を設定

### 4.1 Vercel プロジェクト設定を開く

1. Vercel Dashboard でプロジェクトを選択
2. 「Settings」をクリック
3. 左メニューから「Environment Variables」を選択

### 4.2 環境変数を追加

以下の環境変数を追加します：

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 本番環境 |
| `EXPO_PUBLIC_API_URL` | `https://your-domain.com` | アプリのベースURL（後で設定） |

**追加方法：**
1. 「Add New...」をクリック
2. 変数名と値を入力
3. 「Save」をクリック

### 4.3 デプロイを再実行

環境変数を追加後、デプロイを再実行します：

1. 「Deployments」タブをクリック
2. 最新のデプロイを選択
3. 「Redeploy」をクリック

---

## ステップ 5: デプロイ確認

### 5.1 デプロイ URL を確認

Vercel Dashboard でプロジェクトを選択すると、デプロイ URL が表示されます。

**例：** `https://self-promise-app.vercel.app`

### 5.2 アプリにアクセス

デプロイ URL にアクセスして、アプリが正常に表示されることを確認します。

### 5.3 機能を確認

以下の機能が正常に動作することを確認：

- ✅ 約束の入力
- ✅ 完了チェック
- ✅ 感想入力
- ✅ 完了フォルダ表示
- ✅ 設定・通知管理
- ✅ データはローカルストレージに保存

### 5.4 PWA として追加

**iOS（Safari）:**
1. 下部の共有ボタンをタップ
2. 「ホーム画面に追加」をタップ
3. 「追加」をタップ

**Android（Chrome）:**
1. 右上のメニュー（⋮）をタップ
2. 「アプリをインストール」をタップ
3. 「インストール」をタップ

---

## ステップ 6: カスタムドメイン設定

### 6.1 ドメインを購入

以下のいずれかでドメインを購入：
- Google Domains
- Namecheap
- GoDaddy
- その他のドメインレジストラ

### 6.2 Vercel にドメインを追加

1. Vercel プロジェクト設定を開く
2. 「Domains」をクリック
3. 「Add Domain」をクリック
4. ドメイン名を入力
5. 「Add」をクリック

### 6.3 DNS レコードを設定

Vercel が指示する DNS レコードをドメインレジストラで設定します。

**一般的な例：**

| Type | Name | Value |
|------|------|-------|
| CNAME | www | cname.vercel.com |
| A | @ | 76.76.19.21 |

### 6.4 DNS が反映されるまで待機

DNS の反映には 24 時間かかる場合があります。

**確認方法：**
```bash
nslookup your-domain.com
```

---

## トラブルシューティング

### Q1: ビルドが失敗する

**原因：** TypeScript エラーまたは依存関係の問題

**解決方法：**
```bash
# ローカルでビルドを試す
pnpm run build:web

# エラーメッセージを確認
# 一般的な原因：
# - TypeScript エラー → tsc --noEmit で確認
# - 依存関係の不足 → pnpm install で再インストール
```

### Q2: デプロイ後に 404 エラーが表示される

**原因：** SPA（Single Page Application）のルーティングが正しく設定されていない

**解決方法：** `vercel.json` の `rewrites` が正しく設定されているか確認

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### Q3: ローカルストレージが動作しない

**原因：** ブラウザの設定またはプライベートブラウジングモード

**解決方法：**
- プライベートブラウジングモードを無効化
- Cookie を有効化
- ブラウザのキャッシュをクリア

### Q4: PWA がホーム画面に追加できない

**原因：** manifest.json が正しく読み込まれていない

**解決方法：**
1. ブラウザの開発者ツールを開く
2. コンソールでエラーを確認
3. `manifest.json` が正しく配信されているか確認

```bash
curl https://your-domain.com/manifest.json
```

### Q5: カスタムドメインが反映されない

**原因：** DNS キャッシュまたは DNS 設定の誤り

**解決方法：**
```bash
# DNS が正しく設定されているか確認
nslookup your-domain.com

# DNS キャッシュをクリア（macOS）
dscacheutil -flushcache

# DNS キャッシュをクリア（Windows）
ipconfig /flushdns
```

---

## 参考資料

| リソース | URL |
|---------|-----|
| Vercel Documentation | https://vercel.com/docs |
| Expo Web Documentation | https://docs.expo.dev/guides/web/ |
| PWA Documentation | https://web.dev/progressive-web-apps/ |
| Manifest.json Reference | https://web.dev/add-manifest/ |

---

## よくある質問（FAQ）

**Q: バックエンドサーバーは必要ですか？**

A: いいえ。このアプリはローカルストレージのみでデータを保存するため、バックエンドは不要です。ただし、クロスデバイス同期が必要な場合は、別途バックエンドをホスティングしてください。

**Q: データはどこに保存されますか？**

A: すべてのデータはユーザーのブラウザのローカルストレージに保存されます。サーバーには保存されません。

**Q: 複数のデバイスでデータを同期できますか？**

A: デフォルトではできません。各デバイスのローカルストレージは独立しています。同期が必要な場合は、バックエンドとデータベースを別途構築してください。

**Q: 無料で Vercel を使用できますか？**

A: はい。Vercel の無料プランで十分です。月間トラフィックが多い場合は、有料プランへのアップグレードを検討してください。

**Q: デプロイ後に変更を反映させるにはどうしますか？**

A: GitHub にプッシュすると、Vercel が自動的にビルド・デプロイします。

```bash
git add .
git commit -m "Update app"
git push origin main
```

---

## サポート

デプロイに問題が発生した場合：

1. **Vercel Documentation** を確認：https://vercel.com/docs
2. **Expo Documentation** を確認：https://docs.expo.dev
3. **GitHub Issues** で同様の問題を検索
4. **Vercel Support** に問い合わせ：https://vercel.com/support

---

**最終更新：** 2026 年 3 月 24 日
