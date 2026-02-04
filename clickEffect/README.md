# ClickEffect - 鼠标点击特效

![Version](https://img.shields.io/badge/version-0.1.1-blue.svg)
![License](https://img.shields.io/badge/license-GPL--3.0--only-green.svg)
![Author](https://img.shields.io/badge/author-EricQ-red.svg)

一个简单而美观的 Tampermonkey 脚本，为你的每一次鼠标点击添加炫酷的粒子爆炸特效。该脚本适用于所有网页，让浏览体验更加生动有趣。

> 支持我的其他脚本：[GitHub](https://github.com/Eq52/TamperMonkeyScripts/) or [ScriptCat](https://scriptcat.org/zh-CN/users/196629)

## ✨ 功能特性

- 🎨 **全局特效**：在所有网页上生效（`@match *`）。
- ⚡ **高性能动画**：使用 `Anime.js` 库，确保动画流畅丝滑。
- 🛠 **高度可配置**：可以通过简单修改代码来调整粒子数量、颜色、大小和扩散范围。
- 🧹 **自动清理**：动画结束后自动移除 DOM 元素，不占用内存。
- 🚫 **无干扰**：粒子不阻挡鼠标点击事件（`pointer-events: none`）。


## 🚀 安装方法

1. **安装脚本管理器**：
   如果你还没有安装，请先安装[ScriptCat](https://docs.scriptcat.org/) 或 [Tampermonkey](https://www.tampermonkey.net/) (推荐) 或 [Violentmonkey](https://violentmonkey.github.io/) 浏览器扩展。

2. **安装脚本**：
   - 点击 GitHub 仓库中的 `clickEffect.user.js` 文件。
   - 点击右上角的 **Raw** 按钮。
   - Tampermonkey 会自动弹窗询问是否安装，点击 **安装**。

3. **启用脚本**：
   确保你的 Tampermonkey 图标处于激活状态，且该脚本已开启。

## ⚙️ 自定义配置

由于这是一个轻量级脚本，目前配置选项位于代码内部。你可以按照以下步骤修改特效参数：

1. 点击 Tampermonkey 图标 -> **管理面板**。
2. 找到 `clickEffect-鼠标点击特效` 脚本。
3. 点击 **编辑** 按钮。
4. 在代码中找到 `CONFIG` 对象（通常在开头），修改你想要的参数：

```javascript
const CONFIG = {
    particleCount: 10,     // 每次点击产生的粒子数量 (默认: 10)
    particleColor: 'red',  // 粒子颜色 (支持英文 'red', 'blue' 或 hex '#00ff00')
    particleSize: 10,      // 粒子大小，单位像素 (默认: 10)
    spread: 100            // 粒子扩散范围，单位像素 (默认: 100)
};
```
5. 修改完成后，点击 **文件** -> **保存** (Ctrl+S)，刷新网页即可生效。

## 🔧 技术栈

- **Vanilla JavaScript**: 原生 JS 逻辑处理。
- **Anime.js**: 用于处理高性能的动画过渡 (`@require`)。

## 📝 依赖项

脚本会自动从 CDN 加载依赖：
- `anime.min.js` (v3.2.1)

## 📄 开源协议

本项目采用 [GPL-3.0-only](/LICENSE) 许可证开源。

## 👨‍💻 作者


EricQ





