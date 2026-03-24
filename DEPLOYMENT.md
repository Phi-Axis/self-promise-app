# Vercel デプロイガイド

このドキュメントは、「自分との約束手帳」アプリを Vercel で本番デプロイするための手順をまとめています。

## 概要

このアプリは以下の構成で動作します：

- **フロントエンド**: React Native Web（静的ファイル）→ Vercel でホスティング
- **バックエンド**: Express + tRPC（Node.js サーバー）→ 別途ホスティング
- **データベース**: MySQL → 別途ホスティング

## 前提条件

- Node.js 18.x 以上
- pnpm 9.x 以上
- Git アカウント（GitHub など）
- Vercel アカウント
- バックエンド用ホスティング（Heroku、Railway、Render など）
- MySQL データベース

## ステップ 1: ローカルビルドの確認

```bash
cd /home/ubuntu/self-promise-app

# 依存関係をインストール
pnpm install

# Web 版をビルド
pnpm run build:web

# ビルド出力を確認
ls -la dist/web/
```

ビルドが成功すると、`dist/web/` ディレクトリに静的ファイルが生成されます。

## ステップ 2: GitHub にプッシュ

```bash
# Git リポジトリを初期化（既に初期化されている場合はスキップ）
git init

# すべてのファイルをステージング
git add .

# コミット
git commit -m "Initial commit: Web app ready for Vercel deployment"

# GitHub にプッシュ
git push -u origin main
```

## ステップ 3: Vercel に接続

### 3.1 Vercel プロジェクトを作成

1. [Vercel Dashboard](https://vercel.com/dashboard) にログイン
2. 「Add New...」→「Project」をクリック
3. GitHub リポジトリを選択
4. 「Import」をクリック

### 3.2 ビルド設定を確認

Vercel が自動的に以下を検出します：

- **Build Command**: `pnpm run build:web`
- **Output Directory**: `dist/web`
- **Install Command**: `pnpm install --frozen-lockfile`

これらは `vercel.json` で定義されています。

### 3.3 環境変数を設定

Vercel プロジェクト設定で、以下の環境変数を追加します：

```
EXPO_PUBLIC_API_URL=https://your-domain.com
EXPO_PUBLIC_BACKEND_URL=https://api.your-domain.com
NODE_ENV=production
```

## ステップ 4: バックエンドをホスティング

このアプリは **Web 版のみ** を Vercel でホスティングします。バックエンドが必要な場合は、別途ホスティングしてください。

### オプション A: バックエンドなし（推奨）

このアプリは **ローカルストレージのみ** でデータを保存するため、バックエンドは不要です。

- ✅ 約束の入力・完了・感想入力
- ✅ 完了フォルダの表示
- ✅ 設定・通知管理
- ✅ データは各デバイスのローカルストレージに保存

この場合、Vercel のみでデプロイ完了です。

### オプション B: バックエンドあり（クロスデバイス同期が必要な場合）

バックエンドサーバーが必要な場合は、以下のいずれかでホスティングしてください：

#### Railway でホスティング

```bash
# Railway CLI をインストール
npm install -g @railway/cli

# Railway にログイン
railway login

# プロジェクトを初期化
railway init

# 環境変数を設定
railway variables set NODE_ENV=production
railway variables set DATABASE_URL=mysql://user:password@host/db

# デプロイ
railway up
```

#### Heroku でホスティング

```bash
# Heroku CLI をインストール
brew tap heroku/brew && brew install heroku

# Heroku にログイン
heroku login

# アプリを作成
heroku create your-app-name

# 環境変数を設定
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=mysql://user:password@host/db

# デプロイ
git push heroku main
```

#### Render でホスティング

1. [Render Dashboard](https://dashboard.render.com) にログイン
2. 「New+」→「Web Service」をクリック
3. GitHub リポジトリを接続
4. 以下を設定：
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `pnpm run start`
   - **Environment**: Node.js
5. 環境変数を追加：
   - `NODE_ENV=production`
   - `DATABASE_URL=mysql://...`

## ステップ 5: Vercel でデプロイ

### 5.1 自動デプロイ

GitHub にプッシュすると、Vercel が自動的にビルド・デプロイします。

```bash
# ローカルで変更
git add .
git commit -m "Update app"
git push origin main

# Vercel が自動的にデプロイ
```

### 5.2 手動デプロイ

```bash
# Vercel CLI をインストール
npm install -g vercel

# Vercel にログイン
vercel login

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

## ステップ 6: カスタムドメインを設定

### Vercel でドメインを設定

1. Vercel プロジェクト設定 →「Domains」
2. 「Add Domain」をクリック
3. ドメイン名を入力
4. DNS レコードを設定（Vercel が指示）

### DNS レコード例

```
Type: CNAME
Name: www
Value: cname.vercel.com
```

## トラブルシューティング

### ビルドが失敗する

```bash
# ローカルでビルドを試す
pnpm run build:web

# エラーメッセージを確認
# 一般的な原因：
# - TypeScript エラー
# - 依存関係の不足
# - 環境変数の不足
```

### デプロイ後に 404 エラーが表示される

`vercel.json` の `rewrites` が正しく設定されているか確認：

```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### ローカルストレージが動作しない

ブラウザの設定を確認：
- プライベートブラウジングモードを無効化
- Cookie を有効化
- ローカルストレージを有効化

## 環境変数リファレンス

### フロントエンド（Vercel）

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `EXPO_PUBLIC_API_URL` | アプリのベースURL | `https://your-domain.com` |
| `EXPO_PUBLIC_BACKEND_URL` | バックエンドサーバーのURL | `https://api.your-domain.com` |
| `NODE_ENV` | 環境 | `production` |

### バックエンド（Railway/Heroku/Render）

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `NODE_ENV` | 環境 | `production` |
| `PORT` | ポート番号 | `3000` |
| `DATABASE_URL` | MySQL 接続文字列 | `mysql://user:pass@host/db` |
| `MANUS_OAUTH_CLIENT_ID` | OAuth クライアントID | - |
| `MANUS_OAUTH_CLIENT_SECRET` | OAuth クライアントシークレット | - |

## ファイル構成

```
.
├── vercel.json              ← Vercel デプロイ設定
├── package.json             ← ビルドスクリプト追加
├── app/                     ← React Native Web アプリ
├── public/                  ← 静的ファイル（manifest.json など）
├── dist/web/                ← ビルド出力（Vercel でホスティング）
└── server/                  ← バックエンド（別途ホスティング）
```

## デプロイ後の確認

1. **Web アプリにアクセス**
   ```
   https://your-domain.com
   ```

2. **PWA として追加**
   - iOS Safari: 共有 → ホーム画面に追加
   - Android Chrome: メニュー → アプリをインストール

3. **機能を確認**
   - 約束の入力
   - 完了チェック
   - 感想入力
   - 完了フォルダ表示
   - 設定・通知管理

## さらに詳しく

- [Vercel Documentation](https://vercel.com/docs)
- [Expo Web Documentation](https://docs.expo.dev/guides/web/)
- [Railway Documentation](https://docs.railway.app/)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Render Documentation](https://render.com/docs)
