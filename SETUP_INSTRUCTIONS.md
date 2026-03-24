# 「自分との約束手帳」外部ホスティング移行ガイド

このドキュメントは、Manus 開発環境から Vercel への移行手順をまとめています。

---

## 📌 概要

このアプリは、以下の特徴があります：

- **完全にスタティック**：バックエンド不要、ローカルストレージのみ
- **PWA 対応**：ホーム画面から起動可能
- **マルチプラットフォーム**：iOS・Android・Web で動作
- **ビルドサイズ**：3.6 MB（軽量）

**デプロイ先：** Vercel（無料プランで十分）

---

## 🚀 クイックスタート（5 分）

### 1. ローカルビルド確認

```bash
cd /home/ubuntu/self-promise-app
pnpm install
pnpm run build:web
```

**確認：** `dist/web/` ディレクトリに静的ファイルが生成されたことを確認

### 2. GitHub にプッシュ

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 3. Vercel に接続

1. https://vercel.com/dashboard にアクセス
2. GitHub リポジトリを選択
3. 「Import」をクリック
4. デプロイ完了

**デプロイ URL：** `https://your-project.vercel.app`

---

## 📚 詳細ドキュメント

このプロジェクトには、以下の詳細ドキュメントが含まれています：

| ドキュメント | 内容 | 対象者 |
|------------|------|-------|
| **DEPLOY_GUIDE.md** | Vercel デプロイの完全ガイド | 初心者向け |
| **PRODUCTION_CONFIG.md** | 本番環境設定・セキュリティ | 開発者向け |
| **DEPLOYMENT.md** | 従来のデプロイガイド | 参考用 |

---

## 📋 ステップバイステップ手順

### ステップ 1: 準備（5 分）

**必要なもの：**
- Node.js 18.x 以上
- pnpm 9.x 以上
- Git
- GitHub アカウント
- Vercel アカウント（GitHub で登録可能）

**確認方法：**
```bash
node --version      # v18.x 以上
pnpm --version      # 9.x 以上
git --version       # 2.x 以上
```

### ステップ 2: ローカルビルド（3 分）

```bash
# プロジェクトディレクトリに移動
cd /home/ubuntu/self-promise-app

# 依存関係をインストール
pnpm install

# Web 版をビルド
pnpm run build:web

# ビルド出力を確認
ls -la dist/web/
du -sh dist/web/
```

**期待される出力：**
- `dist/web/` ディレクトリが存在
- ファイルサイズ：3.6 MB
- `index.html`、`manifest.json`、`_expo/` が存在

### ステップ 3: GitHub にプッシュ（2 分）

```bash
# リモートリポジトリを確認
git remote -v

# ファイルをステージング
git add .

# コミット
git commit -m "Vercel deployment ready"

# GitHub にプッシュ
git push origin main
```

### ステップ 4: Vercel に接続（5 分）

**手順：**

1. https://vercel.com/dashboard にアクセス
2. 「Add New...」→「Project」をクリック
3. GitHub リポジトリを選択
4. 「Import」をクリック
5. ビルド設定を確認：
   - Build Command: `pnpm run build:web`
   - Output Directory: `dist/web`
   - Install Command: `pnpm install --frozen-lockfile`
6. 「Deploy」をクリック

**デプロイ時間：** 2-5 分

### ステップ 5: デプロイ確認（2 分）

1. Vercel Dashboard でプロジェクトを選択
2. デプロイ URL にアクセス
3. アプリが正常に表示されることを確認
4. 機能をテスト：
   - 約束の入力
   - 完了チェック
   - 感想入力
   - 完了フォルダ表示

### ステップ 6: PWA として追加（1 分）

**iOS（Safari）:**
1. 下部の共有ボタンをタップ
2. 「ホーム画面に追加」をタップ
3. 「追加」をタップ

**Android（Chrome）:**
1. 右上のメニュー（⋮）をタップ
2. 「アプリをインストール」をタップ
3. 「インストール」をタップ

### ステップ 7: カスタムドメイン設定（オプション、10 分）

1. ドメインを購入（Google Domains、Namecheap など）
2. Vercel プロジェクト設定 → 「Domains」
3. 「Add Domain」をクリック
4. ドメイン名を入力
5. DNS レコードを設定（Vercel が指示）
6. DNS が反映されるまで待機（24 時間以内）

---

## 🔧 トラブルシューティング

### Q: ビルドが失敗する

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

### Q: デプロイ後に 404 エラーが表示される

**原因：** SPA ルーティングが正しく設定されていない

**確認方法：**
```bash
# vercel.json の rewrites を確認
cat vercel.json | grep -A 5 rewrites
```

**期待される内容：**
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### Q: ローカルストレージが動作しない

**原因：** ブラウザの設定またはプライベートブラウジングモード

**解決方法：**
- プライベートブラウジングモードを無効化
- Cookie を有効化
- ブラウザのキャッシュをクリア

### Q: PWA がインストールできない

**原因：** manifest.json が正しく読み込まれていない

**確認方法：**
```bash
# manifest.json を確認
curl https://your-domain.com/manifest.json

# ブラウザ開発者ツールでエラーを確認
# Console タブでエラーメッセージを確認
```

---

## 📊 デプロイ後の確認チェックリスト

デプロイ後、以下を確認してください：

- [ ] アプリが正常に表示される
- [ ] 約束の入力が動作する
- [ ] 完了チェックが動作する
- [ ] 感想入力が動作する
- [ ] 完了フォルダが表示される
- [ ] 設定画面が表示される
- [ ] 通知設定が動作する
- [ ] データがローカルストレージに保存される
- [ ] PWA としてホーム画面に追加できる
- [ ] ホーム画面から起動できる
- [ ] オフラインで動作する（キャッシュ）

---

## 🔐 セキュリティ確認

デプロイ後、以下のセキュリティ設定を確認してください：

- [ ] HTTPS が有効化されている
- [ ] セキュリティヘッダーが設定されている
- [ ] ローカルストレージのみでデータ保存（サーバー保存なし）
- [ ] Cookie が安全に設定されている

**確認方法：**
```bash
# HTTPS を確認
curl -I https://your-domain.com
# HTTP/2 200 が返されることを確認

# セキュリティヘッダーを確認
curl -I https://your-domain.com | grep -i "x-content-type-options"
```

---

## 📈 パフォーマンス確認

デプロイ後、以下のパフォーマンスを確認してください：

**Lighthouse スコア：**
- Performance: 90 以上
- Accessibility: 90 以上
- Best Practices: 90 以上
- SEO: 90 以上

**測定方法：**
1. Chrome DevTools を開く
2. Lighthouse タブをクリック
3. 「Analyze page load」をクリック

**または PageSpeed Insights で測定：**
https://pagespeed.web.dev

---

## 🔄 継続的なデプロイ

### 自動デプロイ（推奨）

GitHub にプッシュすると、Vercel が自動的にビルド・デプロイします。

```bash
# 変更をコミット
git add .
git commit -m "Update app"

# GitHub にプッシュ
git push origin main

# Vercel が自動的にデプロイ
```

### 手動デプロイ

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

---

## 📞 サポート

### ドキュメント

- **Vercel Documentation**: https://vercel.com/docs
- **Expo Web Documentation**: https://docs.expo.dev/guides/web/
- **PWA Documentation**: https://web.dev/progressive-web-apps/

### トラブルシューティング

1. **Vercel Logs** を確認：Vercel Dashboard → Deployments → 最新デプロイ → Logs
2. **ブラウザ DevTools** を確認：F12 → Console タブ
3. **GitHub Issues** で同様の問題を検索

---

## 📝 ファイル構成

デプロイに関連するファイル：

```
.
├── vercel.json              ← Vercel デプロイ設定
├── netlify.toml             ← Netlify デプロイ設定（代替）
├── .vercelignore            ← Vercel ビルド時に除外するファイル
├── package.json             ← ビルドスクリプト
├── DEPLOY_GUIDE.md          ← Vercel デプロイ完全ガイド
├── PRODUCTION_CONFIG.md     ← 本番環境設定
├── DEPLOYMENT.md            ← 従来のデプロイガイド
└── dist/web/                ← ビルド出力（Vercel でホスティング）
```

---

## ✅ 完了チェックリスト

デプロイ完了時に確認：

- [ ] GitHub にプッシュ完了
- [ ] Vercel デプロイ完了
- [ ] デプロイ URL でアプリが表示される
- [ ] すべての機能が動作する
- [ ] PWA としてインストール可能
- [ ] セキュリティ設定確認済み
- [ ] パフォーマンス確認済み

---

**🎉 デプロイ完了！**

これで、「自分との約束手帳」は Vercel で本番運用可能な状態になりました。

Wake up 不要で、固定 URL で安定して使用できます。

---

**最終更新：** 2026 年 3 月 24 日
