# 🧹 Railway 项目清理指南

**任务**: 保留两个调查系统，删除其他项目

---

## 📋 项目清单

### ✅ 需要保留的项目

1. **survey-system** (问卷系统)
   - GitHub: `ruoan724996/survey-system`
   - 状态：✅ 保留

2. **deep-survey-backend** (深度问卷后端)
   - GitHub: `ruoan724996/deep-survey-backend`
   - 状态：✅ 保留

### ❌ 需要删除的项目

1. **wechat-checkin-system** (签到管理系统) - 刚刚创建
   - GitHub: `ruoan724996/wechat-checkin-system`
   - 状态：⏳ **待删除**（如果不需要部署）

2. **markdown-viewer** (Markdown 查看器)
   - GitHub: `ruoan724996/markdown-viewer`
   - 状态：❌ **待删除**

3. **public-docs** (公开文档仓库)
   - GitHub: `ruoan724996/public-docs`
   - 状态：⏳ 仅文档，无需部署

---

## 🔧 操作步骤

### 方法一：通过 Railway 网页删除（推荐）

1. **访问 Railway 控制台**
   - 打开：https://railway.app
   - 登录账号

2. **查看项目列表**
   - 点击左侧项目列表
   - 查看所有部署的项目

3. **删除不用的项目**
   
   对于每个要删除的项目：
   - 点击进入项目
   - 点击右上角 "Settings"（设置）
   - 滚动到底部 "Danger Zone"（危险区域）
   - 点击 "Delete Project"（删除项目）
   - 确认删除

4. **保留的项目**
   - ✅ `survey-system`
   - ✅ `deep-survey-backend`

---

### 方法二：使用 Railway CLI

```bash
# 1. 登录 Railway
railway login

# 2. 查看当前项目
railway list

# 3. 链接到要删除的项目
railway link [project-id]

# 4. 删除项目
railway delete --confirm
```

---

## ✅ 检查清单

删除后，应该只剩下：

- [ ] ✅ survey-system (问卷系统)
- [ ] ✅ deep-survey-backend (深度问卷后端)

已删除：

- [ ] ✅ markdown-viewer
- [ ] ✅ public-docs (如果部署了)
- [ ] ✅ 其他旧项目

---

## 🎯 下一步

### 如果你想部署签到系统：

**选项 1**: 删除旧项目后，重新部署 `wechat-checkin-system`

**选项 2**: 使用其他平台部署
- 腾讯云云开发（推荐）
- Vercel + PlanetScale
- Render

### 如果暂时不部署：

本地测试即可：

```bash
cd wechat-checkin-system/server
npm install
node scripts/init-database.js
npm start
```

小程序连接本地地址测试。

---

## 📸 删除后检查

删除完成后，访问 Railway 控制台应该只看到：

```
Projects
├── survey-system ✅
└── deep-survey-backend ✅
```

---

**田老板，请按以下步骤操作：**

1. 访问 https://railway.app
2. 检查项目列表
3. 删除不用的项目（保留两个调查系统）
4. 删除完成后告诉我
5. 我再帮你部署签到系统

**需要我帮你做什么？** 🚀
