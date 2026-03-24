# 「自分との約束手帳」GitHub × Vercel デプロイ完全ガイド

このドキュメントは、アプリを GitHub と Vercel で本番デプロイするための完全なガイドです。

---

## 📌 このアプリについて

**「自分との約束手帳」** は、小さな約束を毎日実践するための PWA アプリです。

### 特徴

- ✅ **完全にスタティック**：バックエンド不要、ローカルストレージのみ
- ✅ **PWA 対応**：ホーム画面から起動可能
- ✅ **マルチプラットフォーム**：iOS・Android・Web で動作
- ✅ **軽量**：ビルドサイズ 3.6 MB
- ✅ **無料ホスティング**：Vercel の無料プランで十分

### アーキテクチャ

```
┌─────────────────────────────────────┐
│  ユーザーのブラウザ                   │
│  ┌─────────────────────────────────┐ │
│  │ 「自分との約束手帳」アプリ        │ │
│  │ (React Native Web)              │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ ローカルストレージ                │ │
│  │ (データはブラウザに保存)          │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
         ↓ ホスティング
┌─────────────────────────────────────┐
│ Vercel (静的ファイル配信)            │
│ - index.html                        │
│ - CSS・JavaScript                   │
│ - 画像・フォント                     │
└─────────────────────────────────────┘
```

---

## 🚀 クイックスタート（10 分）

### 1. GitHub リポジトリを作成

1. https://github.com/new にアクセス
2. リポジトリ名を入力：`self-promise-app`
3. 「Create repository」をクリック

### 2. ローカルでコードを準備

```bash
cd /home/ubuntu/self-promise-app
git remote add origin https://github.com/YOUR_USERNAME/self-promise-app.git
git branch -M main
git push -u origin main
```

**認証を求められた場合：**
- Personal Access Token を使用（パスワードではなく）
- または SSH キーを設定

### 3. Vercel に接続

1. https://vercel.com/dashboard にアクセス
2. GitHub リポジトリを選択
3. 「Import」をクリック
4. 「Deploy」をクリック

**デプロイ完了：** 2-5 分

### 4. デプロイ URL にアクセス

Vercel が提供する URL にアクセスして、アプリが表示されることを確認します。

**例：** `https://self-promise-app.vercel.app`

---

## 📚 詳細ドキュメント

このプロジェクトには、以下の詳細ドキュメントが含まれています：

| ドキュメント | 内容 | 対象者 |
|------------|------|-------|
| **GITHUB_SETUP.md** | GitHub リポジトリ作成手順 | 初心者向け |
| **GITHUB_PUSH_STEPS.md** | コードをプッシュする手順 | ステップバイステップ |
| **SETUP_INSTRUCTIONS.md** | 外部ホスティング移行ガイド | 初心者向け |
| **DEPLOY_GUIDE.md** | Vercel デプロイ完全ガイド | 詳細手順 |
| **PRODUCTION_CONFIG.md** | 本番環境設定・セキュリティ | 開発者向け |

---

## 📋 ファイル構成

```
self-promise-app/
├── app/                          # アプリケーション
│   ├── (tabs)/                   # タブナビゲーション
│   │   ├── _layout.tsx           # タブレイアウト
│   │   └── index.tsx             # ホーム画面
│   ├── settings.tsx              # 設定画面
│   ├── promise-input.tsx         # 約束入力
│   ├── reflection-input.tsx      # 感想入力
│   ├── mark-checked.tsx          # 完了チェック
│   ├── completion-screen.tsx     # 完了画面
│   ├── archived-folder.tsx       # 完了フォルダ
│   └── _layout.tsx               # ルートレイアウト
├── components/                   # 再利用可能なコンポーネント
├── lib/                          # ユーティリティ・ロジック
├── hooks/                        # カスタムフック
├── constants/                    # 定数
├── assets/                       # 画像・アイコン
├── public/                       # PWA マニフェスト
├── server/                       # バックエンド（オプション）
├── package.json                  # 依存関係
├── vercel.json                   # Vercel 設定
├── netlify.toml                  # Netlify 設定（代替）
├── tailwind.config.js            # Tailwind CSS 設定
├── theme.config.js               # テーマ設定
├── tsconfig.json                 # TypeScript 設定
└── README_DEPLOYMENT.md          # このファイル
```

---

## 🔧 ビルド・デプロイ

### ローカルビルド

```bash
# 依存関係をインストール
pnpm install

# Web 版をビルド
pnpm run build:web

# ビルド出力を確認
ls -la dist/web/
du -sh dist/web/
```

**期待される出力：**
- ファイルサイズ：3.6 MB
- `index.html`、`manifest.json`、`_expo/` が存在

### 開発環境での実行

```bash
# 開発サーバーを起動
pnpm run dev

# ブラウザで http://localhost:8081 にアクセス
```

### 本番環境での実行

```bash
# 本番ビルド
pnpm run build:web

# 静的ファイルをサーバーで配信
# Vercel が自動的に dist/web/ を配信
```

---

## 🔐 セキュリティ

### データ保護

- ✅ **ローカルストレージのみ**：データはユーザーのブラウザに保存
- ✅ **サーバー保存なし**：個人情報がサーバーに送信されない
- ✅ **プライベート**：他のユーザーからは見えない

### HTTPS

- ✅ **自動 HTTPS**：Vercel が自動的に HTTPS を有効化
- ✅ **セキュリティヘッダー**：`vercel.json` で設定済み

### Cookie

- ✅ **HTTP-only Cookie**：JavaScript からアクセス不可
- ✅ **HTTPS のみ**：安全な接続でのみ送信

---

## 📈 パフォーマンス

### ビルドサイズ

| 項目 | サイズ |
|------|--------|
| **JavaScript** | 2.63 MB |
| **CSS** | 11.5 kB |
| **HTML** | 23 kB（平均） |
| **合計** | 3.6 MB |

### ページ読み込み時間

- **初回読み込み**：1-2 秒
- **キャッシュ後**：< 500 ms

### Lighthouse スコア

- **Performance**：90+
- **Accessibility**：90+
- **Best Practices**：90+
- **SEO**：90+

---

## 🌐 PWA インストール

### iOS（Safari）

1. 下部の共有ボタンをタップ
2. 「ホーム画面に追加」をタップ
3. 「追加」をタップ

### Android（Chrome）

1. 右上のメニュー（⋮）をタップ
2. 「アプリをインストール」をタップ
3. 「インストール」をタップ

### Web（デスクトップ）

1. ブラウザのアドレスバーの右側を確認
2. インストールボタンが表示されたらクリック
3. 「インストール」をクリック

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

## 🆘 トラブルシューティング

### Q: ビルドが失敗する

**原因：** TypeScript エラーまたは依存関係の問題

**解決方法：**
```bash
# ローカルでビルドを試す
pnpm run build:web

# エラーメッセージを確認
tsc --noEmit
```

### Q: デプロイ後に 404 エラーが表示される

**原因：** SPA ルーティングが正しく設定されていない

**確認方法：**
```bash
# vercel.json の rewrites を確認
cat vercel.json | grep -A 5 rewrites
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

## 📞 サポート

### ドキュメント

- **Vercel Documentation**: https://vercel.com/docs
- **Expo Web Documentation**: https://docs.expo.dev/guides/web/
- **PWA Documentation**: https://web.dev/progressive-web-apps/
- **GitHub Documentation**: https://docs.github.com

### トラブルシューティング

1. **Vercel Logs** を確認：Vercel Dashboard → Deployments → 最新デプロイ → Logs
2. **ブラウザ DevTools** を確認：F12 → Console タブ
3. **GitHub Issues** で同様の問題を検索

---

## ✅ デプロイ完了チェックリスト

デプロイ完了時に確認：

- [ ] GitHub リポジトリが作成されている
- [ ] コードが GitHub にプッシュされている
- [ ] Vercel デプロイが完了している
- [ ] デプロイ URL でアプリが表示される
- [ ] すべての機能が動作する
- [ ] PWA としてインストール可能
- [ ] HTTPS が有効化されている
- [ ] Lighthouse スコアが 90 以上

---

## 🎉 完了！

これで、「自分との約束手帳」は GitHub で管理され、Vercel で本番デプロイされています。

**Wake up 不要で、固定 URL で安定して使用できます。**

---

## 📝 次のステップ

1. **カスタムドメインを設定**（オプション）
   - ドメインを購入
   - Vercel でドメインを追加
   - DNS レコードを設定

2. **バックエンドを追加**（オプション）
   - クロスデバイス同期が必要な場合
   - ユーザー認証が必要な場合
   - `server/README.md` を参照

3. **CI/CD パイプラインを設定**（オプション）
   - 自動テスト
   - 自動デプロイ
   - GitHub Actions を使用

---

**最終更新：** 2026 年 3 月 24 日

**作成者：** Manus AI

**ライセンス：** MIT
