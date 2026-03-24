# GitHub プッシュ手順（ステップバイステップ）

このドキュメントは、ローカルコードを GitHub にプッシュするための具体的な手順をまとめています。

---

## 📋 事前準備

以下を確認してください：

- [ ] GitHub.com でリポジトリを作成済み
- [ ] リポジトリ URL を控えている
- [ ] Personal Access Token または SSH キーを準備している

---

## ステップ 1: GitHub.com でリポジトリを作成

### 1.1 GitHub にログイン

1. https://github.com にアクセス
2. 右上の「Sign in」をクリック
3. ユーザー名とパスワードでログイン

### 1.2 新規リポジトリを作成

1. 右上の「+」アイコンをクリック
2. 「New repository」を選択

### 1.3 リポジトリ設定

| 項目 | 値 |
|------|-----|
| **Repository name** | `self-promise-app` |
| **Description** | `自分との約束手帳 - PWA アプリ` |
| **Visibility** | Public（推奨） |
| **Initialize this repository with** | ✓ Add a README file |
| | ✓ Add .gitignore |
| | ✓ Choose a license (MIT) |

### 1.4 「Create repository」をクリック

リポジトリが作成されます。

**リポジトリ URL の例：**
```
https://github.com/YOUR_USERNAME/self-promise-app.git
```

---

## ステップ 2: ローカルで Git を設定

### 2.1 ターミナルを開く

```bash
# プロジェクトディレクトリに移動
cd /home/ubuntu/self-promise-app
```

### 2.2 リモートリポジトリを追加

```bash
# リポジトリ URL を設定
git remote add origin https://github.com/YOUR_USERNAME/self-promise-app.git

# 確認
git remote -v
```

**出力例：**
```
origin  https://github.com/YOUR_USERNAME/self-promise-app.git (fetch)
origin  https://github.com/YOUR_USERNAME/self-promise-app.git (push)
```

---

## ステップ 3: GitHub にプッシュ

### 3.1 ファイルをステージング

```bash
git add .
```

### 3.2 コミット

```bash
git commit -m "Initial commit: self-promise-app ready for Vercel deployment"
```

### 3.3 main ブランチに切り替え

```bash
git branch -M main
```

### 3.4 GitHub にプッシュ

```bash
git push -u origin main
```

**初回プッシュ時に認証を求められる場合：**

#### 方法 A: Personal Access Token（推奨）

1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. スコープを選択：`repo`、`workflow`
4. トークンをコピー
5. ターミナルでパスワードを求められたら、トークンを入力

#### 方法 B: SSH キー

1. SSH キーを生成：
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```
2. SSH キーを GitHub に登録
3. リモート URL を SSH に変更：
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/self-promise-app.git
   ```

---

## ステップ 4: GitHub で確認

### 4.1 GitHub リポジトリページをリロード

https://github.com/YOUR_USERNAME/self-promise-app

### 4.2 ファイルが表示されていることを確認

以下のファイルが見えることを確認：

- [ ] `GITHUB_SETUP.md`
- [ ] `SETUP_INSTRUCTIONS.md`
- [ ] `DEPLOY_GUIDE.md`
- [ ] `PRODUCTION_CONFIG.md`
- [ ] `vercel.json`
- [ ] `package.json`
- [ ] `app/` ディレクトリ
- [ ] `components/` ディレクトリ
- [ ] `lib/` ディレクトリ

---

## ステップ 5: Vercel に接続

### 5.1 Vercel Dashboard にアクセス

1. https://vercel.com/dashboard にアクセス
2. GitHub アカウントでログイン

### 5.2 新しいプロジェクトをインポート

1. 「Add New...」をクリック
2. 「Project」を選択
3. GitHub リポジトリを選択
4. 「Import」をクリック

### 5.3 ビルド設定を確認

以下が自動的に検出されることを確認：

| 項目 | 値 |
|------|-----|
| **Build Command** | `pnpm run build:web` |
| **Output Directory** | `dist/web` |
| **Install Command** | `pnpm install --frozen-lockfile` |

### 5.4 「Deploy」をクリック

デプロイが開始されます。完了まで 2-5 分かかります。

---

## ステップ 6: デプロイ確認

### 6.1 Vercel Dashboard でデプロイ状況を確認

1. Vercel Dashboard でプロジェクトを選択
2. 「Deployments」タブを確認
3. デプロイが完了するまで待機

### 6.2 デプロイ URL にアクセス

Vercel が提供するデプロイ URL にアクセス：

**例：** `https://self-promise-app.vercel.app`

### 6.3 アプリが正常に表示されることを確認

- [ ] ホーム画面が表示される
- [ ] 約束の入力ができる
- [ ] 完了チェックができる
- [ ] 感想入力ができる
- [ ] 完了フォルダが表示される

---

## 🎉 完了！

これで、アプリは GitHub で管理され、Vercel で本番デプロイされています。

### 今後の更新方法

コードを更新したい場合：

```bash
# 変更をコミット
git add .
git commit -m "Update app"

# GitHub にプッシュ
git push origin main

# Vercel が自動的にビルド・デプロイ
```

---

## トラブルシューティング

### Q: `git push` が失敗する

**エラー：** `fatal: 'origin' does not appear to be a 'git' repository`

**解決方法：**
```bash
# リモートリポジトリを確認
git remote -v

# 設定されていない場合は追加
git remote add origin https://github.com/YOUR_USERNAME/self-promise-app.git
```

### Q: 認証エラーが表示される

**エラー：** `fatal: Authentication failed`

**解決方法：**
- Personal Access Token を使用（パスワードではなく）
- または SSH キーを設定

### Q: Vercel デプロイが失敗する

**確認方法：**
1. Vercel Dashboard → Deployments → 最新デプロイ
2. 「Logs」タブを確認
3. エラーメッセージを確認

**一般的な原因：**
- `pnpm install` が失敗 → `pnpm-lock.yaml` が正しいか確認
- ビルドコマンドが失敗 → `pnpm run build:web` をローカルで試す
- 出力ディレクトリが誤っている → `vercel.json` を確認

---

**最終更新：** 2026 年 3 月 24 日
