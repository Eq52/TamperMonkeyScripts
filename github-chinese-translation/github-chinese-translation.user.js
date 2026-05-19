// ==UserScript==
// @name         GitHub 汉化插件
// @namespace    https://github.com/Eq52/TamperMonkeyScripts/tree/main/github-chinese-translation
// @version      1.2.0
// @updateURL    https://raw.githubusercontent.com/Eq52/TamperMonkeyScripts/main/github-chinese-translation/github-chinese-translation.user.js
// @downloadURL  https://raw.githubusercontent.com/Eq52/TamperMonkeyScripts/main/github-chinese-translation/github-chinese-translation.user.js
// @description  将 GitHub 界面翻译为中文（Dashboard / 导航 / 搜索 / 筛选 / 仓库 / 创建仓库 / Compare / 议题 / 设置页 / 代码浏览 / 页脚）
// @icon         https://free.boltp.com/2026/05/19/6a0c02479cd6a.webp
// @license      GPL-3.0-only
// @author       Eq52
// @match        https://github.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // ========== 翻译词典 ==========
    //
    // 两种条目格式：
    //
    // 1) 简单文本替换（textContent 精确匹配）：
    //    { pattern: '原文', replacement: '译文' }
    //    { pattern: '原文', replacement: '译文', selector: 'CSS选择器' }  // 缩小范围
    //
    // 2) 自定义替换函数（含子标签 / 需保留内部结构的元素）：
    //    { selector: 'CSS选择器', replace: (el) => { ... return boolean } }
    //
    // 选择器稳定性说明：
    //   ✅ 稳定：HTML 标准属性 (placeholder / role / aria-*) / URL 结构 / data-view-component
    //   ⚠️ 中等：[class*="模块名"] 子串匹配（哈希后缀变化不影响）/ data-content
    //   ❌ 脆弱：精确哈希类名（如 prc-Button-Label-FWkx3）/ 完整 CSS Modules 类名
    //
    const dict = [

        // ================================================================
        //  搜索栏
        // ================================================================

        // 占位文本 "Type <kbd>/</kbd> to search"（含 kbd 子标签，保留结构）
        // 选择器说明：qbsearch-input 是 GitHub 搜索自定义元素名（稳定），kbd 是标准 HTML 元素
        {
            selector: 'qbsearch-input span:has(> kbd)',
            replace(el) {
                if (!/^Type\s+\/\s+to\s+search$/.test(el.textContent.trim())) return false;
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const t = node.textContent.trim();
                        if (t === 'Type') node.textContent = '按下 ';
                        else if (t === 'to search') node.textContent = ' 开始搜索';
                    }
                });
                return true;
            },
        },
        // 搜索弹窗 —— 文本
        { pattern: 'Search all of GitHub', replacement: '搜索整个 GitHub' },
        { pattern: 'Search in this repository', replacement: '在该仓内搜索' },
        { pattern: 'Search in this owner', replacement: '在此账号中搜索' },
        { pattern: 'Search syntax tips', replacement: '搜索语法提示' },
        { pattern: 'Give feedback', replacement: '反馈' },
        // 搜索弹窗 —— 分组标题
        {
            selector: 'h3[class*="QueryBuilder"]',
            replace(el) {
                const text = el.textContent.trim();
                const map = { 'Repositories': '仓库', 'Code': '代码' };
                if (map[text]) { el.textContent = map[text]; return true; }
                return false;
            },
        },

        // ================================================================
        //  顶部导航栏
        // ================================================================

        // 导航 tab（span[data-content] 系列）
        {
            selector: 'span[data-content]',
            replace(el) {
                const text = el.textContent.trim();
                const map = {
                    'Overview': '概述',
                    'Code': '代码',
                    'Issues': '议题',
                    'Pull requests': '拉取请求',
                    'Repositories': '仓库',
                    'Projects': '项目',
                    'Packages': '包',
                    'Stars': '星标',
                    'Discussions': '讨论',
                    'Actions': '操作',
                    'Agents': '代理',
                    'Security and quality': '安全和质量',
                    'Insights': '洞察',
                    'Settings': '设置',
                };
                if (map[text]) { el.textContent = map[text]; return true; }
                return false;
            },
        },
        // Dashboard 面包屑
        { pattern: 'Dashboard', replacement: '仪表盘' },

        // ================================================================
        //  Dashboard 主体
        // ================================================================

        { pattern: 'One moment please...', replacement: '请稍等...' },
        { pattern: 'Feed', replacement: '动态', selector: '[data-target="feed-container.feedTitle"]' },
        { pattern: 'Top repositories', replacement: '热门仓库' },

        // ================================================================
        //  筛选
        // ================================================================

        // 筛选按钮（summary 内含 SVG 图标 + hidden counter span）
        {
            selector: 'summary[aria-haspopup="menu"]',
            replace(el) {
                let done = false;
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Filter') {
                        node.textContent = '筛选';
                        done = true;
                    }
                });
                return done;
            },
        },
        // 筛选菜单标题
        { pattern: 'Filter', replacement: '筛选', selector: 'span.SelectMenu-title' },
        // 筛选菜单 —— 各选项
        { pattern: 'Events', replacement: '活动' },
        { pattern: 'Activity you want to see on your feed', replacement: '你希望在动态中看到的活动' },
        { pattern: 'Announcements', replacement: '公告' },
        { pattern: 'Releases', replacement: '发行版' },
        { pattern: 'Sponsors', replacement: '赞助' },
        { pattern: 'Stars', replacement: '星标' },
        { pattern: 'Repositories', replacement: '仓库' },
        { pattern: 'Repository activity', replacement: '仓库活动' },
        { pattern: 'Follows', replacement: '关注' },
        { pattern: 'Recommendations', replacement: '推荐' },
        { pattern: 'Include events from starred repositories', replacement: '包含来自已星标仓库的事件' },
        { pattern: 'By default, the feed shows events from repositories you sponsor or watch, and people you follow.', replacement: '默认情况下，动态信息流会显示来自您赞助或关注的仓库以及您关注的人的活动。' },
        { pattern: 'Reset to default', replacement: '重置' },
        { pattern: 'Save', replacement: '保存' },

        // ================================================================
        //  仓库侧边栏（含 Counter 数字标签，如 "Releases 8"）
        // ================================================================

        {
            selector: 'a.Link--primary',
            replace(el) {
                if (!el.querySelector(':scope > span.Counter')) return false;
                for (const node of el.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        const t = node.textContent.trim();
                        const map = { 'Releases': '发行版', 'Packages': '包', 'Contributors': '贡献者' };
                        if (map[t]) { node.textContent = map[t]; return true; }
                    }
                }
                return false;
            },
        },

        // ================================================================
        //  仓库页面
        // ================================================================

        { pattern: 'About', replacement: '关于' },
        { pattern: 'Languages', replacement: '代码语言' },
        { pattern: 'Suggested workflows', replacement: '推荐的工作流' },
        { pattern: 'Contribution activity', replacement: '贡献动态' },

        // ================================================================
        //  编辑仓库对话框
        // ================================================================

        { pattern: 'Edit repository details', replacement: '编辑仓库详情' },
        { pattern: 'Description', replacement: '描述' },
        { pattern: 'Website', replacement: '网站' },
        // "Use your GitHub Pages website"（label 内含 checkbox input）
        {
            selector: 'label',
            replace(el) {
                if (!el.querySelector('input.js-use-pages-url')) return false;
                for (const node of el.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().startsWith('Use your GitHub Pages website')) {
                        node.textContent = ' 使用 GitHub Pages 网站';
                        return true;
                    }
                }
                return false;
            },
        },
        { pattern: 'Cancel', replacement: '取消' },
        { pattern: 'Cancel changes', replacement: '取消更改' },
        // Include in the home page —— 用 id 定位（稳定）
        { pattern: 'Include in the home page', replacement: '在主页中显示', selector: 'div#hidden_sidebar_options' },
        // Deployments checkbox label
        { pattern: 'Deployments', replacement: '部署', selector: 'label' },
        { pattern: 'Save changes', replacement: '保存改动' },
        { pattern: 'Commit changes...', replacement: '提交更改...' },
        // Commit changes（不含省略号）—— 仅匹配 h1/span，跳过含 data-edit-text 的 button
        { pattern: 'Commit changes', replacement: '提交更改', selector: 'h1, span' },

        // ================================================================
        //  提交更改对话框
        // ================================================================

        { pattern: 'Commit message', replacement: '提交说明' },
        { pattern: 'Extended description', replacement: '详细描述' },
        // textarea placeholder
        {
            selector: 'textarea[placeholder*="extended description"]',
            replace(el) {
                if (el.placeholder.includes('Add an optional extended description')) {
                    el.placeholder = '添加详细描述(可选)...';
                    return true;
                }
                return false;
            },
        },
        // 提交按钮（含 data-edit-text / data-pull-text 属性，需同步更新）
        {
            selector: 'button[data-edit-text*="Commit changes"]',
            replace(el) {
                let done = false;
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Commit changes') {
                        node.textContent = node.textContent.replace('Commit changes', '提交更改');
                        done = true;
                    }
                });
                if (el.getAttribute('data-edit-text') === 'Commit changes') {
                    el.setAttribute('data-edit-text', '提交更改');
                }
                if (el.getAttribute('data-pull-text') === 'Propose changes') {
                    el.setAttribute('data-pull-text', '提议更改');
                }
                return done;
            },
        },

        // ================================================================
        //  文件编辑器
        // ================================================================

        // Edit / Preview 切换按钮（segmentedControl，词太常见需选择器约束）
        {
            selector: 'div.segmentedControl-text[data-text]',
            replace(el) {
                const map = { 'Edit': '编辑', 'Preview': '预览', 'Code': '代码', 'Blame': '追溯' };
                const text = el.textContent.trim();
                if (map[text]) { el.textContent = map[text]; el.setAttribute('data-text', map[text]); return true; }
                return false;
            },
        },
        // Loading preview（含 spinner 子元素 + 尾部文本节点）
        // 选择器说明：用 Spinner 子串匹配替代 EditorPreview 模块名（两者均为中等风险，
        // 但 Spinner 概念更通用，且 div:has(> span[class*="Spinner"] svg) 完全不依赖类名哈希）
        {
            selector: 'div[class*="EditorPreview"], div:has(> span[class*="Spinner"] svg)',
            replace(el) {
                let done = false;
                // 替换尾部文本节点 "Loading preview…" → "加载预览…"
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Loading preview\u2026') {
                        node.textContent = '加载预览\u2026';
                        done = true;
                    }
                });
                // 替换内部隐藏 span 的 "Loading" → "加载中"
                if (done) {
                    el.querySelectorAll('span[class*="VisuallyHidden"], span[class*="sr-only"]').forEach(s => {
                        if (s.textContent.trim() === 'Loading') s.textContent = '加载中';
                    });
                }
                return done;
            },
        },

        // ================================================================
        //  代码浏览
        // ================================================================

        { pattern: 'Show Diff', replacement: '显示差异' },
        // "Files" 标题 —— 通过 URL 限定代码浏览页（/tree/ 或 /blob/），无需依赖哈希类名
        {
            selector: 'h2',
            replace(el) {
                if (el.textContent.trim() !== 'Files') return false;
                if (!/\/(tree|blob)\//.test(location.pathname)) return false;
                el.textContent = '文件';
                return true;
            },
        },

        // ================================================================
        //  个人主页
        // ================================================================

        { pattern: 'Achievements', replacement: '成就' },
        // Pinned（h2 内含 spinner SVG + hidden span）
        {
            selector: 'h2.f4',
            replace(el) {
                if (!el.querySelector('.spinner, svg.anim-rotate')) return false;
                let done = false;
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Pinned') {
                        node.textContent = '置顶';
                        done = true;
                    }
                });
                return done;
            },
        },
        { pattern: 'Customize your pins', replacement: '自定义你的置顶项' },
        { pattern: 'Contribution settings', replacement: '贡献设置' },

        // ================================================================
        //  创建菜单（ActionList.Item.Label 系列）
        // ================================================================

        { pattern: 'New issue', replacement: '新建议题' },
        { pattern: 'New repository', replacement: '新建仓库' },
        { pattern: 'Import repository', replacement: '导入仓库' },
        { pattern: 'Create new file', replacement: '创建新文件' },
        { pattern: 'Upload files', replacement: '上传文件' },

        // ================================================================
        //  设置页 —— 分区标题（ActionList-sectionDivider-title）
        // ================================================================

        {
            selector: 'h2[class*="sectionDivider"]',
            replace(el) {
                const text = el.textContent.trim();
                const map = {
                    'Access': '访问',
                    'Code and automation': '代码与自动化',
                    'Security and quality': '安全与质量',
                    'Integrations': '集成',
                };
                if (map[text]) { el.textContent = map[text]; return true; }
                return false;
            },
        },

        // ================================================================
        //  设置页 —— 侧边栏导航（兼容新旧两套类名）
        // ================================================================

        // GitHub 正从 ActionListItem-label 迁移到 data-component="ActionList.Item.Label"
        // 统一用一个自定义函数匹配两者，避免维护两套独立条目
        {
            selector: 'span[class*="ActionListItem"], span[data-component="ActionList.Item.Label"]',
            replace(el) {
                const text = el.textContent.trim();
                const map = {
                    'General': '通用',
                    'Collaborators': '协作者',
                    'Moderation options': '审核选项',
                    'Interaction limits': '互动限制',
                    'Code review limits': '代码审查限制',
                    'Branches': '分支',
                    'Tags': '标签',
                    'Rules': '规则',
                    'Rulesets': '规则集',
                    'Projects': '项目',
                    'Discussions': '讨论',
                    'Copy path': '复制路径',
                    'Copy permalink': '复制永久路径',
                    'Center content': '居中内容',
                    'Download': '下载',
                    'Delete file': '删除文件',
                };
                if (map[text]) { el.textContent = map[text]; return true; }
                return false;
            },
        },

        // ================================================================
        //  设置页 —— 内容区标题（Subhead-heading--large）
        // ================================================================

        { pattern: 'Default branch', replacement: '默认分支', selector: 'h2.Subhead-heading--large' },
        { pattern: 'Social preview', replacement: '社交预览', selector: 'h2.Subhead-heading--large' },
        { pattern: 'Features', replacement: '功能', selector: 'h2.Subhead-heading--large' },
        { pattern: 'Pull Requests', replacement: '拉取请求', selector: 'h2.Subhead-heading--large' },
        { pattern: 'Commits', replacement: '提交', selector: 'h2.Subhead-heading--large' },
        { pattern: 'Archives', replacement: '归档', selector: 'h2.Subhead-heading--large' },
        { pattern: 'Pushes', replacement: '推送', selector: 'h2.Subhead-heading--large' },
        { pattern: 'Issues', replacement: '议题', selector: 'h2.Subhead-heading--large' },
        { pattern: 'Danger Zone', replacement: '危险区域', selector: 'h2.Subhead-heading--large' },

        // ================================================================
        //  页脚
        // ================================================================

        { pattern: 'Terms', replacement: '条款' },
        { pattern: 'Privacy', replacement: '隐私' },
        { pattern: 'Security', replacement: '安全' },
        { pattern: 'Status', replacement: '状态' },
        { pattern: 'Community', replacement: '社区' },
        { pattern: 'Docs', replacement: '文档' },
        { pattern: 'Contact', replacement: '联系' },
        { pattern: 'Manage cookies', replacement: '管理 cookies' },
        { pattern: 'Do not share my personal information', replacement: '不要分享我的个人信息' },

        // ================================================================
        //  输入框 placeholder（属性翻译，非文本内容）
        // ================================================================

        {
            selector: 'input[placeholder*="Find a repository"]',
            replace(el) {
                if (el.placeholder.includes('Find a repository')) {
                    el.placeholder = el.placeholder.replace('Find a repository', '查找仓库');
                    return true;
                }
                return false;
            },
        },
        {
            selector: 'input[placeholder*="Go to file"]',
            replace(el) {
                if (el.placeholder.includes('Go to file')) {
                    el.placeholder = el.placeholder.replace('Go to file', '转到文件');
                    if (el.getAttribute('aria-label') === 'Go to file') {
                        el.setAttribute('aria-label', '转到文件');
                    }
                    return true;
                }
                return false;
            },
        },

        // ================================================================
        //  侧边栏导航（第二层菜单）
        // ================================================================

        { pattern: 'Show more', replacement: '显示更多' },
        { pattern: 'All pull requests', replacement: '所有拉取请求' },
        { pattern: 'All issues', replacement: '所有议题' },
        { pattern: 'All repositories', replacement: '所有仓库' },
        { pattern: 'Codespaces', replacement: '代码空间' },
        { pattern: 'Explore', replacement: '探索' },
        { pattern: 'Marketplace', replacement: '市场' },
        // 侧边栏搜索框（属性翻译）
        {
            selector: 'input[placeholder*="Search for repositories"]',
            replace(el) {
                if (el.placeholder.includes('Search for repositories')) {
                    el.placeholder = el.placeholder.replace('Search for repositories', '查找仓库');
                    if (el.getAttribute('aria-label') && el.getAttribute('aria-label').includes('Search for repositories')) {
                        el.setAttribute('aria-label', el.getAttribute('aria-label').replace('Search for repositories', '查找仓库'));
                    }
                    return true;
                }
                return false;
            },
        },

        // ================================================================
        //  Explore 页面
        // ================================================================

        { pattern: "Here's what we found based on your interests...", replacement: '这些是我们基于您的喜好找到的...' },
        // "Trending repositories today"（含 span 子标签 "today"，保留结构）
        {
            selector: 'a[href="/trending"]',
            replace(el) {
                let done = false;
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Trending repositories')) {
                        node.textContent = node.textContent.replace('Trending repositories', '热门仓库');
                        done = true;
                    }
                });
                return done;
            },
        },
        { pattern: 'Trending developers', replacement: '热门开发者' },
        { pattern: "That's everything we found for you, for now.", replacement: '暂时就为您找到这些了。' },

        // ================================================================
        //  创建仓库页面
        // ================================================================

        { pattern: 'Create a new repository', replacement: '创建一个新仓库' },
        // 仓库描述 + 导入链接（含子标签 span > a，保留结构）
        {
            selector: 'div:has(> span > a[href="/new/import"])',
            replace(el) {
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Repositories contain')) {
                        node.textContent = '仓库包含项目的文件和版本历史。';
                    }
                });
                const span = el.querySelector('span');
                if (span) {
                    span.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Have a project elsewhere')) {
                            node.textContent = ' 在其他地方已有项目？ ';
                        }
                    });
                    const link = span.querySelector('a');
                    if (link && link.textContent.trim() === 'Import a repository') {
                        link.textContent = '导入一个仓库';
                    }
                }
                return true;
            },
        },
        { pattern: 'Required fields are marked with an asterisk (*).', replacement: '标有星号（*）的字段为必填项。' },
        // 创建仓库页 "General" 标题 —— 通过 URL 限定 /new 页面，不依赖哈希类名
        {
            selector: 'h2',
            replace(el) {
                if (el.textContent.trim() !== 'General') return false;
                if (!/\/new/.test(location.pathname)) return false;
                el.textContent = '常规';
                return true;
            },
        },
        // "Owner(required)"（含 sr-only 子标签，只翻译文本节点）
        {
            selector: 'span',
            replace(el) {
                if (!el.querySelector('.sr-only, [class*="VisuallyHidden"]')) return false;
                const text = normalize(el.textContent);
                if (text !== 'Owner(required)') return false;
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === 'Owner') {
                        node.textContent = '所有者';
                    }
                });
                return true;
            },
        },
        { pattern: 'Repository name', replacement: '仓库名' },
        { pattern: 'Configuration', replacement: '配置' },
        { pattern: 'Create repository', replacement: '创建仓库' },
        { pattern: 'Public', replacement: '公开', selector: 'span[data-component="ActionList.Item.Label"]' },
        { pattern: 'Anyone on the internet can see this repository. You choose who can commit.', replacement: '互联网上的任何人都可以看到这个仓库。您可以选择谁可以提交。', selector: 'span[data-component="ActionList.Description"]' },
        { pattern: 'Private', replacement: '私有', selector: 'span[data-component="ActionList.Item.Label"]' },
        { pattern: 'You choose who can see and commit to this repository.', replacement: '您可以选择谁可以查看和提交到这个仓库。', selector: 'span[data-component="ActionList.Description"]' },

        // ================================================================
        //  Compare 页面
        // ================================================================

        { pattern: 'New pull request', replacement: '新建拉取请求' },
        { pattern: 'Compare changes', replacement: '比较更改', selector: 'h1.Subhead-heading--large' },
        // 比较页面描述（含 button 子标签 "compare across forks"，保留结构）
        {
            selector: 'div[class*="Subhead-description"]:has(> button[class*="cross-repo"])',
            replace(el) {
                let done = false;
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (node.textContent.includes('Compare changes across')) {
                            node.textContent = node.textContent
                                .replace('Compare changes across branches, commits, tags, and more below.', '在下面对比不同分支、提交、标签等之间的改动。')
                                .replace('If you need to, you can also', '如有需要，也可以');
                            done = true;
                        }
                        // 将尾部 "." 替换为 "。"
                        if (node.textContent.trim() === '.') {
                            node.textContent = '。';
                        }
                    }
                });
                if (done) {
                    const btn = el.querySelector('button[class*="cross-repo"]');
                    if (btn) btn.textContent = '跨复刻仓库进行对比';
                }
                return done;
            },
        },
        { pattern: 'Create pull request', replacement: '创建拉取请求' },
        { pattern: 'Compare and review just about anything', replacement: '比较并审查几乎任何内容' },

        // ================================================================
        //  代码浏览页 —— ActionList.GroupHeading（分组标题）
        // ================================================================

        {
            selector: 'span[class*="ActionList.GroupHeading"]',
            replace(el) {
                const text = el.textContent.trim();
                const map = {
                    'View options': '查看选项',
                    'Raw file content': '原始文件内容',
                };
                if (map[text]) { el.textContent = map[text]; return true; }
                return false;
            },
        },

        // ================================================================
        //  代码浏览页 —— 危险操作（Delete directory）
        // ================================================================

        // Delete directory / Delete file — 用 color-fg-danger 限定危险操作
        { pattern: 'Delete directory', replacement: '删除目录', selector: 'span.color-fg-danger' },

        // ================================================================
        //  代码浏览页 —— Outline（大纲）
        // ================================================================

        { pattern: 'Outline', replacement: '大纲', selector: 'h3#outline-id' },

        // ================================================================
        //  议题 / PR 列表状态筛选
        // ================================================================

        // Open / Closed 筛选标签 —— 通过 URL 限定议题/PR 页面 + 列表结构定位
        // 选择器说明：ul > li > a > div 是筛选导航的标准结构，不依赖哈希类名
        {
            selector: 'nav ul li a > div, [class*="FilterLink"] div, div[class*="SectionFilterLink"]',
            replace(el) {
                const text = el.textContent.trim();
                if (text !== 'Open' && text !== 'Closed') return false;
                if (!/\/(issues|pulls)/.test(location.pathname)) return false;
                el.textContent = text === 'Open' ? '开启' : '关闭';
                return true;
            },
        },

        // ================================================================
        //  议题创建页面
        // ================================================================

        { pattern: 'Create new issue', replacement: '创建新议题' },
        { pattern: 'Add a title', replacement: '添加标题' },
        { pattern: 'Add a description', replacement: '添加描述' },
        { pattern: 'Write', replacement: '编写', selector: 'button[role="tab"]' },
        { pattern: '(separate with spaces)', replacement: '(用空格分隔)', selector: 'span.text-normal.color-fg-muted' },
        // 议题创建 "Create" 提交按钮 —— 通过 URL 限定议题创建页，不依赖哈希类名
        {
            selector: 'span[data-component="text"]',
            replace(el) {
                if (el.textContent.trim() !== 'Create') return false;
                if (!/\/issues\/new/.test(location.pathname)) return false;
                el.textContent = '创建';
                return true;
            },
        },
        { pattern: 'Preview', replacement: '预览', selector: 'button[role="tab"]' },
    ];

    // ========== 工具函数 ==========

    function normalize(str) {
        return str.replace(/\s+/g, ' ').trim();
    }

    function isTranslated(el) {
        return el.hasAttribute('data-gh-zh');
    }

    function markTranslated(el) {
        el.setAttribute('data-gh-zh', 'true');
    }

    /**
     * 安全设置文本内容：当元素有子元素时，只修改文本节点，保留子元素结构。
     * 例如 <label><input> Releases</label> → <label><input> 发行版</label>
     */
    function safeSetTextContent(el, newText) {
        // 叶子节点（无子元素）—— 直接设置
        if (el.children.length === 0) {
            el.textContent = newText;
            return;
        }
        // 有子元素 —— 只修改文本节点，保留所有子元素
        let replaced = false;
        for (const child of el.childNodes) {
            if (child.nodeType !== Node.TEXT_NODE) continue;
            if (replaced) {
                // 已替换完主体文本，清空后续文本节点
                if (child.textContent.trim() !== '') child.textContent = '';
                continue;
            }
            if (child.textContent.trim() !== '') {
                // 这是承载匹配文本的文本节点
                child.textContent = newText;
                replaced = true;
            }
        }
        if (!replaced) el.textContent = newText; // 兜底
    }

    function tryTranslate(el, entry) {
        // ---- 自定义函数模式 ----
        if (typeof entry.replace === 'function') {
            if (entry.selector && !el.matches(entry.selector)) return false;
            const ok = entry.replace(el);
            if (ok) {
                markTranslated(el);
            }
            return ok;
        }

        // ---- 标准 pattern 模式 ----
        if (entry.selector && !el.matches(entry.selector)) return false;

        const raw = normalize(el.textContent);
        const isReg = entry.pattern instanceof RegExp;

        if (isReg ? entry.pattern.test(raw) : raw === entry.pattern) {
            safeSetTextContent(el, entry.replacement);
            markTranslated(el);
            return true;
        }
        return false;
    }

    // ========== 翻译引擎 ==========

    function translateAll() {
        const skipTags = new Set([
            'SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'CODE', 'PRE', 'TEXTAREA', 'INPUT',
        ]);

        // ---------- 第一遍：简单文本匹配（遍历文本叶子节点）----------
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
                    if (isTranslated(parent)) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                },
            },
        );

        const processed = new Set();
        let textNode;
        while ((textNode = walker.nextNode())) {
            const el = textNode.parentElement;
            if (processed.has(el)) continue;
            processed.add(el);

            for (const entry of dict) {
                // 跳过自定义函数条目（由第二遍处理）
                if (typeof entry.replace === 'function') continue;
                if (tryTranslate(el, entry)) break;
            }
        }

        // ---------- 第二遍：自定义函数条目 ----------
        for (const entry of dict) {
            if (typeof entry.replace !== 'function') continue;

            const selector = entry.selector || 'span, a, h1, h2, h3, h4, h5, h6, p, div, button, li, label, summary';
            const candidates = document.querySelectorAll(selector);
            for (const el of candidates) {
                if (!isTranslated(el)) tryTranslate(el, entry);
            }
        }
    }

    // ========== 自检机制 ==========

    /**
     * 检测关键选择器是否仍然有效。
     * GitHub 前端更新后，如果某个关键结构元素找不到，
     * 对应页面的翻译会静默失效。此函数在控制台输出警告，
     * 帮助用户快速定位问题。
     */
    function selfCheck() {
        const path = location.pathname;

        // 所有页面共用的关键结构
        const checks = [
            { name: '搜索组件 (qbsearch-input)', selector: 'qbsearch-input' },
            { name: '导航标签 (data-content)', selector: 'span[data-content]' },
        ];

        // 设置页专用检查
        if (/\/settings/.test(path)) {
            checks.push(
                { name: '设置页分区标题 (sectionDivider)', selector: 'h2[class*="sectionDivider"]' },
                { name: '设置页侧边栏 (ActionListItem)', selector: 'span[class*="ActionListItem"], span[data-component="ActionList.Item.Label"]' },
                { name: '设置页内容标题 (Subhead-heading--large)', selector: 'h2.Subhead-heading--large' },
            );
        }

        // 议题/PR 页专用检查
        if (/\/(issues|pulls)/.test(path)) {
            checks.push(
                { name: '议题/PR 筛选器', selector: 'nav ul li a > div, [class*="FilterLink"] div, div[class*="SectionFilterLink"]' },
            );
        }

        // 代码浏览页专用检查
        if (/\/(tree|blob)\//.test(path)) {
            checks.push(
                { name: '代码浏览页 h2', selector: 'h2' },
            );
        }

        const failed = [];
        for (const { name, selector } of checks) {
            try {
                if (!document.querySelector(selector)) {
                    failed.push(name);
                }
            } catch (e) {
                failed.push(name + ' (选择器语法错误)');
            }
        }

        if (failed.length > 0) {
            console.warn(
                `%c[GitHub 汉化] ⚠️ 以下关键选择器未匹配到元素，GitHub 前端可能已更新：\n` +
                failed.map(f => `  - ${f}`).join('\n'),
                'color: #d29922; font-weight: bold',
            );
        }
    }

    // ========== DOM 变化监听 ==========

    let pending = false;
    const observer = new MutationObserver(() => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
            translateAll();
            pending = false;
        });
    });

    // ========== 初始化 ==========

    function init() {
        console.log(
            `%c
` +
            ` ________       ___    ___      _______    ________    ________     _______
` +
            ` |\\   __  \\     |\\  \\  /  /|    |\\  ___ \\  |\\   __  \\  |\\   ____\\   /  ___  \\
` +
            ` \\ \\  \\|\\ /_    \\ \\  \\/  / /    \\ \\   __/| \\ \\  \\|\\  \\ \\ \\  \\___|_ /__/|_/  /|
` +
            `  \\ \\   __  \\    \\ \\    / /      \\ \\  \\_|/__\\ \\  \\\\\\  \\ \\ \\_____  \\|__|//  / /
` +
            `   \\ \\  \\|\\  \\    \\/  /  /        \\ \\  \\_|\\ \\\\ \\  \\\\\\  \\ \\|____|\\  \\   /  /_/__
` +
            `    \\ \\_______\\ __/  / /           \\ \\_______\\\\ \\_____  \\  ____\\_\\  \\ |\\________\\
` +
            `     \\|_______||\\___/ /             \\|_______| \\|___| \\__\\|\\_________\\ \\|_______|
` +
            `               \\|___|/                               \\|__|\\|_________|
` +
            `%c  GitHub 汉化插件 v1.2.0  |  %d 条翻译规则已加载  |  DOM 监听已启动`,
            'color: #00ff41',
            'color: #1f883d; font-weight: bold',
            dict.length
        );
        translateAll();
        selfCheck();

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        // 监听 GitHub SPA 路由切换
        document.addEventListener('pjax:end', () => { translateAll(); selfCheck(); });
        document.addEventListener('turbolinks:load', () => { translateAll(); selfCheck(); });
        document.addEventListener('turbo:load', () => { translateAll(); selfCheck(); });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
