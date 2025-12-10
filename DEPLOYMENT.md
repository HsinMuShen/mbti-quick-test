# 部署指南 - GitHub & Vercel

本指南將幫助您將項目推送到 GitHub 並部署到 Vercel。

## 步驟 1: 初始化 Git 倉庫

如果還沒有初始化 Git，請執行：

```bash
git init
git add .
git commit -m "Initial commit: MBTI Quick Test"
```

## 步驟 2: 創建 GitHub 倉庫

1. 前往 [GitHub](https://github.com) 並登入
2. 點擊右上角的 "+" 按鈕，選擇 "New repository"
3. 填寫倉庫信息：
   - Repository name: `mbti-quick-test` (或您喜歡的名稱)
   - Description: "A fast MBTI personality test built with Next.js"
   - 選擇 Public 或 Private
   - **不要**勾選 "Initialize this repository with a README"（因為我們已經有文件了）
4. 點擊 "Create repository"

## 步驟 3: 連接本地倉庫到 GitHub

GitHub 會顯示連接指令，類似這樣：

```bash
git remote add origin https://github.com/YOUR_USERNAME/mbti-quick-test.git
git branch -M main
git push -u origin main
```

**注意**: 將 `YOUR_USERNAME` 替換為您的 GitHub 用戶名。

## 步驟 4: 推送到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

如果遇到認證問題，您可能需要：
- 使用 Personal Access Token（推薦）
- 或設置 SSH 密鑰

## 步驟 5: 在 Vercel 部署

### 5.1 創建 Vercel 帳號

1. 前往 [Vercel](https://vercel.com)
2. 點擊 "Sign Up"
3. 選擇 "Continue with GitHub" 使用 GitHub 帳號登入

### 5.2 導入項目

1. 登入 Vercel 後，點擊 "Add New..." → "Project"
2. 從列表中選擇您的 GitHub 倉庫 `mbti-quick-test`
3. 點擊 "Import"

### 5.3 配置項目

Vercel 會自動檢測 Next.js 項目，通常不需要修改設置。但請確認：

- **Framework Preset**: Next.js
- **Root Directory**: `./` (默認)
- **Build Command**: `npm run build` (默認)
- **Output Directory**: `.next` (默認)
- **Install Command**: `npm install` (默認)

### 5.4 設置環境變數

在 "Environment Variables" 部分，添加：

```
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXX
```

**重要**: 將 `ca-pub-XXXXXXXXXXXXXXX` 替換為您的實際 AdSense 客戶端 ID。

### 5.5 部署

1. 點擊 "Deploy"
2. 等待構建完成（通常 1-2 分鐘）
3. 部署完成後，Vercel 會提供一個 URL，例如：`https://mbti-quick-test.vercel.app`

## 步驟 6: 自定義域名（可選）

1. 在 Vercel 項目設置中，前往 "Domains"
2. 添加您的自定義域名
3. 按照指示更新 DNS 設置

## 步驟 7: 設置 AdSense

1. 在 Google AdSense 中，添加您的 Vercel 域名
2. 等待 AdSense 審核（通常需要幾天）
3. 審核通過後，創建廣告單元並獲取 slot ID
4. 更新代碼中的 `slot` prop 或通過環境變數配置

## 後續更新

當您更新代碼後：

```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel 會自動檢測 GitHub 的更新並重新部署。

## 故障排除

### 構建失敗

- 檢查 Vercel 構建日誌中的錯誤信息
- 確保所有依賴都在 `package.json` 中
- 運行 `npm run build` 本地測試構建

### 環境變數問題

- 確保在 Vercel 中設置了所有必要的環境變數
- 環境變數更改後需要重新部署

### AdSense 不顯示

- 確認域名已在 AdSense 中驗證
- 檢查 AdSense 審核狀態
- 確認 slot ID 正確

## 有用的鏈接

- [Vercel 文檔](https://vercel.com/docs)
- [Next.js 部署文檔](https://nextjs.org/docs/deployment)
- [GitHub 文檔](https://docs.github.com)

