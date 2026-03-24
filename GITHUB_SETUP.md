# GitHub リポジトリ作成手順

このドキュメントは、GitHub.com で新規リポジトリを作成し、ローカルコードをプッシュする手順をまとめています。

---

## ステップ 1: GitHub.com で新規リポジトリを作成

### 1.1 GitHub にログイン

1. https://github.com にアクセス
2. 右上の「Sign in」をクリック
3. ユーザー名とパスワードでログイン

### 1.2 新規リポジトリを作成

1. 右上の「+」アイコンをクリック
2. 「New repository」を選択

### 1.3 リポジトリ設定

以下の項目を入力：

| 項目 | 値 | 説明 |
|------|-----|------|
| **Repository name** | `self-promise-app` | リポジトリ名 |
| **Description** | `自分との約束手帳 - PWA アプリ` | 説明（オプション） |
| **Visibility** | Public / Private | 公開・非公開を選択 |
| **Initialize this repository with** | ✓ Add a README file | README を作成 |
| | ✓ Add .gitignore | .gitignore を作成 |
| | ✓ Choose a license | ライセンスを選択（MIT 推奨） |

### 1.4 「Create repository」をクリック

リポジトリが作成されます。

---

## ステップ 2: ローカルで Git を設定

### 2.1 Git ユーザーを設定（初回のみ）

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 2.2 プロジェクトディレクトリに移動

```bash
cd /home/ubuntu/self-promise-app
```

### 2.3 Git リポジトリを初期化（既に存在する場合はスキップ）

```bash
# 既に .git ディレクトリが存在するか確認
ls -la .git

# 存在しない場合のみ実行
git init
```

### 2.4 リモートリポジトリを追加

```bash
# GitHub リポジトリの URL を設定
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

## ステップ 3: コードを GitHub にプッシュ

### 3.1 ファイルをステージング

```bash
git add .
```

### 3.2 コミット

```bash
git commit -m "Initial commit: self-promise-app ready for Vercel deployment"
```

### 3.3 GitHub にプッシュ

```bash
# main ブランチにプッシュ
git branch -M main
git push -u origin main
```

**初回プッシュ時に認証を求められる場合：**

#### 方法 A: Personal Access Token（推奨）

1. GitHub の Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. スコープを選択：`repo`、`workflow`
4. トークンをコピー
5. ターミナルでパスワードを求められたら、トークンを入力

#### 方法 B: SSH キー

1. SSH キーを生成：
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```
2. SSH キーを GitHub に登録：
   - GitHub Settings → SSH and GPG keys → New SSH key
   - 公開鍵（`~/.ssh/id_ed25519.pub`）をコピー・ペースト
3. リモート URL を SSH に変更：
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/self-promise-app.git
   ```

### 3.4 プッシュ確認

GitHub リポジトリページをリロードして、ファイルが表示されていることを確認します。

---

## ステップ 4: Vercel に接続

### 4.1 Vercel Dashboard にアクセス

1. https://vercel.com/dashboard にアクセス
2. GitHub アカウントでログイン

### 4.2 新しいプロジェクトをインポート

1. 「Add New...」をクリック
2. 「Project」を選択
3. GitHub リポジトリを選択
4. 「Import」をクリック

### 4.3 ビルド設定を確認

Vercel が自動的に以下を検出します：

| 項目 | 値 |
|------|-----|
| **Build Command** | `pnpm run build:web` |
| **Output Directory** | `dist/web` |
| **Install Command** | `pnpm install --frozen-lockfile` |

### 4.4 「Deploy」をクリック

デプロイが開始されます。完了まで 2-5 分かかります。

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
1. Personal Access Token を使用（パスワードではなく）
2. または SSH キーを設定

### Q: `git commit` が失敗する

**エラー：** `fatal: not a git repository`

**解決方法：**
```bash
# Git リポジトリを初期化
git init

# リモートリポジトリを追加
git remote add origin https://github.com/YOUR_USERNAME/self-promise-app.git
```

### Q: GitHub にプッシュ後、ファイルが表示されない

**原因：** `.gitignore` でファイルが除外されている

**確認方法：**
```bash
# 除外されているファイルを確認
git status

# 強制的に追加
git add -f filename
git commit -m "Add file"
git push origin main
```

---

## 参考資料

| リソース | URL |
|---------|-----|
| GitHub Documentation | https://docs.github.com |
| Git Documentation | https://git-scm.com/doc |
| Vercel GitHub Integration | https://vercel.com/docs/git |

---

**最終更新：** 2026 年 3 月 24 日
