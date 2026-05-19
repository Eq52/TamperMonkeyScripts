// ==UserScript==
// @name         GitHub 汉化插件
// @namespace    https://github.com/Eq52/TamperMonkeyScripts/tree/main/github-chinese-translation
// @version      2.0.0
// @description  将 GitHub 界面翻译为中文（Dashboard / 导航 / 搜索 / 筛选 / 仓库 / 创建仓库 / Compare / 议题 / 设置页 / 代码浏览 / 议题详情 / Markdown 工具栏 / 通用动词 / 页脚）
// @icon         https://free.boltp.com/2026/05/19/6a0c02479cd6a.webp
// @license      GPL-3.0-only
// @author       Eq52
// @match        https://github.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
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
        // 选择器说明：GitHub 前端多次改版，搜索按钮不再被 qbsearch-input 包裹。
        // 用 span:has(> kbd) + 精确文本匹配兜底，极低误判风险。
        {
            selector: 'span:has(> kbd)',
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
        // 贡献时间线汇总："Created 65 commits in 5 repositories"（含换行/空格分隔的文本节点）
        {
            selector: 'summary span.color-fg-default',
            replace(el) {
                const text = normalize(el.textContent);
                const m = text.match(/^Created\s+(\d+)\s+commits?\s+in\s+(\d+)\s+repositories?$/);
                if (!m) return false;
                // 只替换文本节点，保留可能的子元素
                el.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = '';
                    }
                });
                el.childNodes[0].textContent = `在 ${m[2]} 个仓库中创建了 ${m[1]} 个提交`;
                return true;
            },
        },

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

        // ================================================================
        //  通用动词和 UI 文本（无选择器约束，全局匹配）
        //  来源：maboloshi/github-chinese locals.js public section
        // ================================================================

        { pattern: 'Search', replacement: '搜索' },
        { pattern: 'Sign in', replacement: '登录' },
        { pattern: 'Sign up', replacement: '注册' },
        { pattern: 'Sign out', replacement: '退出' },
        { pattern: 'Error', replacement: '错误' },
        { pattern: 'Close', replacement: '关闭' },
        { pattern: 'Open', replacement: '打开' },
        { pattern: 'Closed', replacement: '已关闭' },
        { pattern: 'Reopen', replacement: '重新打开' },
        { pattern: 'Delete', replacement: '删除' },
        { pattern: 'Copy', replacement: '复制' },
        { pattern: 'View', replacement: '查看' },
        { pattern: 'Create', replacement: '创建' },
        { pattern: 'Add', replacement: '添加' },
        { pattern: 'Update', replacement: '更新' },
        { pattern: 'Save', replacement: '保存' },
        { pattern: 'Loading', replacement: '加载中' },
        { pattern: 'Enable', replacement: '启用' },
        { pattern: 'Enabled', replacement: '启用' },
        { pattern: 'Disable', replacement: '禁用' },
        { pattern: 'Disabled', replacement: '禁用' },
        { pattern: 'Install', replacement: '安装' },
        { pattern: 'Remove', replacement: '移除' },
        { pattern: 'Back', replacement: '返回' },
        { pattern: 'Send', replacement: '发送' },
        { pattern: 'Retry', replacement: '重试' },
        { pattern: 'Upload', replacement: '上传' },
        { pattern: 'Download', replacement: '下载' },
        { pattern: 'Copy link', replacement: '复制链接' },
        { pattern: 'Copied!', replacement: '复制成功！' },
        { pattern: 'Copy to clipboard', replacement: '复制到剪切板' },
        { pattern: 'No results found.', replacement: '未找到结果。' },
        { pattern: 'Try again', replacement: '重试' },
        { pattern: 'Next', replacement: '下一页' },
        { pattern: 'Previous', replacement: '上一页' },
        { pattern: 'Prev', replacement: '上一页' },
        { pattern: 'More', replacement: '更多' },
        { pattern: 'Less', replacement: '更少' },
        { pattern: 'Show less', replacement: '显示更少' },
        { pattern: 'Load more…', replacement: '载入更多…' },
        { pattern: 'Load more...', replacement: '载入更多…' },
        { pattern: 'Show more', replacement: '显示更多' },
        { pattern: 'Follow', replacement: '关注' },
        { pattern: 'Unfollow', replacement: '取消关注' },
        { pattern: 'Star', replacement: '星标' },
        { pattern: 'Unstar', replacement: '取消星标' },
        { pattern: 'Starred', replacement: '已加星标' },
        { pattern: 'Fork', replacement: '复刻' },
        { pattern: 'Learn more', replacement: '了解更多' },
        { pattern: 'Learn More', replacement: '了解更多' },
        { pattern: 'Learn more.', replacement: '了解更多。' },
        { pattern: 'New', replacement: '新建' },
        { pattern: 'Title', replacement: '标题' },
        { pattern: 'Label', replacement: '标签' },
        { pattern: 'Labels', replacement: '标签' },
        { pattern: 'Milestones', replacement: '里程碑' },
        { pattern: 'Comment', replacement: '评论' },
        { pattern: 'Reply', replacement: '回复' },
        { pattern: 'Answer', replacement: '答复' },
        { pattern: 'Assignee', replacement: '受理人' },
        { pattern: 'Organization', replacement: '组织' },
        { pattern: 'Organizations', replacement: '组织' },
        { pattern: 'People', replacement: '成员' },
        { pattern: 'Teams', replacement: '团队' },
        { pattern: 'Team', replacement: '团队' },
        { pattern: 'Followers', replacement: '关注者' },
        { pattern: 'Notifications', replacement: '通知' },
        { pattern: 'Actions', replacement: '操作' },
        { pattern: 'Insights', replacement: '洞察' },
        { pattern: 'Settings', replacement: '设置' },
        { pattern: 'Security', replacement: '安全' },
        { pattern: 'Verified', replacement: '已验证' },
        { pattern: 'Expired', replacement: '已过期' },
        { pattern: 'Unverified', replacement: '未验证' },
        { pattern: 'Approved', replacement: '已批准' },
        { pattern: 'Dismiss', replacement: '拒绝' },
        { pattern: 'Allow', replacement: '允许' },
        { pattern: 'Reject', replacement: '拒绝' },
        { pattern: 'Accept', replacement: '接受' },
        { pattern: 'Free', replacement: '免费' },
        { pattern: 'Upgrade', replacement: '升级' },
        { pattern: 'Profile', replacement: '个人资料' },
        { pattern: 'Members', replacement: '成员' },
        { pattern: 'conversations', replacement: '对话' },
        { pattern: 'Templates', replacement: '模板' },
        { pattern: 'Files', replacement: '文件' },
        { pattern: 'conversations', replacement: '对话' },
        { pattern: 'Filters', replacement: '筛选' },
        { pattern: 'New issue', replacement: '创建议题' },
        { pattern: 'Sort', replacement: '排序' },
        { pattern: 'List', replacement: '列表' },
        { pattern: 'Board', replacement: '看板' },
        { pattern: 'None yet', replacement: '暂无' },
        { pattern: 'No description', replacement: '暂无描述' },
        { pattern: 'Loading…', replacement: '加载中…' },
        { pattern: 'Loading...', replacement: '加载中…' },
        { pattern: 'Saving…', replacement: '保存中…' },
        { pattern: 'Saving...', replacement: '保存中…' },
        { pattern: 'Updating…', replacement: '更新中…' },
        { pattern: 'Updating...', replacement: '更新中…' },
        { pattern: 'Creating...', replacement: '创建中…' },
        { pattern: 'just now', replacement: '刚刚' },
        { pattern: 'now', replacement: '当前' },
        { pattern: 'yesterday', replacement: '昨天' },
        { pattern: 'last month', replacement: '上个月' },
        { pattern: 'committed', replacement: '提交于' },
        { pattern: 'authored', replacement: '撰写于' },
        { pattern: 'contributors', replacement: '贡献者' },
        { pattern: 'Updated on', replacement: '更新于' },
        { pattern: 'added on', replacement: '添加于' },
        { pattern: 'Sponsoring', replacement: '赞助者' },
        { pattern: 'Public', replacement: '公开' },
        { pattern: 'Private', replacement: '私有' },
        { pattern: 'Visibility', replacement: '可见性' },
        { pattern: 'Source', replacement: '源码' },
        { pattern: 'Default', replacement: '默认' },
        { pattern: 'Active', replacement: '活跃' },
        { pattern: 'Merged', replacement: '已合并' },
        { pattern: 'Draft', replacement: '草稿' },
        { pattern: 'Ready for review', replacement: '等待审查' },
        { pattern: 'Changes requested', replacement: '请求更改' },
        { pattern: 'Review required', replacement: '请求审查' },
        { pattern: 'Conversation', replacement: '对话' },
        { pattern: 'Commits', replacement: '提交' },
        { pattern: 'Checks', replacement: '检查' },
        { pattern: 'Files changed', replacement: '更改的文件' },
        { pattern: 'Show more commits', replacement: '显示更多提交' },
        { pattern: 'Conversation', replacement: '对话' },
        { pattern: 'Checks', replacement: '检查' },
        { pattern: 'Are you sure?', replacement: '您确定吗？' },
        { pattern: 'Are you sure? This can\u0027t be undone.', replacement: '您确定吗？此操作无法撤销。' },
        { pattern: 'This repository has been archived.', replacement: '此仓库已存档。' },
        { pattern: 'This repository has been archived by the owner. It is now read-only.', replacement: '此仓库已被所有者存档。它现在是只读的。' },
        { pattern: 'No results matched your search', replacement: '没有与您的搜索相符的结果' },
        { pattern: 'Jump to bottom', replacement: '跳到底部' },
        { pattern: 'Forked from', replacement: '复刻自' },
        { pattern: 'Copy code', replacement: '复制代码' },
        { pattern: 'Copy head branch name to clipboard', replacement: '复制头分支名称到剪贴板' },
        { pattern: 'Copy permalink', replacement: '复制永久链接' },
        { pattern: 'Select a branch', replacement: '选择分支' },
        { pattern: 'Find a branch...', replacement: '查找分支…' },
        { pattern: 'Switch branches', replacement: '切换分支' },
        { pattern: 'Filter branches', replacement: '查找分支' },
        { pattern: 'View all branches', replacement: '查看所有分支' },
        { pattern: 'Go to file', replacement: '转到文件' },
        { pattern: 'Go to line', replacement: '转到行' },
        { pattern: 'Blame', replacement: '追溯' },
        { pattern: 'Raw', replacement: '源码' },
        { pattern: 'View raw', replacement: '查看源码' },
        { pattern: 'Delete file', replacement: '删除文件' },
        { pattern: 'File mode', replacement: '文件模式' },
        { pattern: 'Blame mode', replacement: '追溯模式' },
        { pattern: 'Last commit date', replacement: '最近提交日期' },
        { pattern: 'Commit history', replacement: '提交历史' },
        { pattern: 'Create a new file', replacement: '创建新文件' },
        { pattern: 'Upload files', replacement: '上传文件' },
        { pattern: 'Find file', replacement: '查找文件' },
        { pattern: 'Clone', replacement: '克隆' },
        { pattern: 'Use Git or checkout with SVN using the web URL.', replacement: '使用 Git 或 SVN 克隆。' },
        { pattern: 'HTTPS', replacement: 'HTTPS' },
        { pattern: 'SSH', replacement: 'SSH' },
        { pattern: 'GitHub CLI', replacement: 'GitHub CLI' },
        { pattern: 'Use this QR code to open this page on your mobile device.', replacement: '使用此二维码在移动设备上打开此页面。' },
        { pattern: 'Open with Desktop', replacement: '在桌面端打开' },
        { pattern: 'Download ZIP', replacement: '下载 ZIP' },

        // ================================================================
        //  议题 / PR 详情页通用文本
        // ================================================================

        { pattern: 'Leave a comment', replacement: '发表评论' },
        { pattern: 'Write a reply', replacement: '发表回复' },
        { pattern: 'Write a comment', replacement: '发表评论' },
        { pattern: 'Add a comment', replacement: '添加评论' },
        { pattern: 'Add review comment', replacement: '添加审查意见' },
        { pattern: 'Start a review', replacement: '开始审查' },
        { pattern: 'Close issue', replacement: '关闭议题' },
        { pattern: 'Close pull request', replacement: '关闭拉取请求' },
        { pattern: 'Reopen issue', replacement: '重新打开议题' },
        { pattern: 'Reopen pull request', replacement: '重新打开拉取请求' },
        { pattern: 'Close with comment', replacement: '评论并关闭' },
        { pattern: 'Reopen with comment', replacement: '重新打开评论' },
        { pattern: 'Submit new issue', replacement: '提交新议题' },
        { pattern: 'Close as completed', replacement: '完成后关闭' },
        { pattern: 'Close as not planned', replacement: '非计划中关闭' },
        { pattern: 'Close as resolved', replacement: '因解决而关闭' },
        { pattern: 'Close as outdated', replacement: '因过时而关闭' },
        { pattern: 'Close as duplicate', replacement: '因重复而关闭' },
        { pattern: 'Duplicate of another issue', replacement: '重复议题' },
        { pattern: 'Apply Suggestion', replacement: '采纳建议' },
        { pattern: 'Add a suggestion', replacement: '添加建议' },
        { pattern: 'Show description', replacement: '显示描述' },
        { pattern: 'Hide description', replacement: '隐藏描述' },
        { pattern: 'Conversation', replacement: '对话' },
        { pattern: 'Checks', replacement: '检查' },
        { pattern: 'Files changed', replacement: '更改的文件' },
        { pattern: 'Show more commits', replacement: '显示更多提交' },
        { pattern: 'Merged by', replacement: '合并者' },
        { pattern: 'requested review from', replacement: '请求审查来自' },
        { pattern: 'approved these changes', replacement: '批准了这些更改' },
        { pattern: 'requested changes', replacement: '请求更改' },
        { pattern: 'left review comments', replacement: '留下审查意见' },
        { pattern: 'Self-merge', replacement: '自我合并' },
        { pattern: 'Some checks haven\u0027t completed yet', replacement: '部分检查还未完成' },
        { pattern: 'All checks have passed', replacement: '所有检查已通过' },
        { pattern: 'Merge pull request', replacement: '合并拉取请求' },
        { pattern: 'Merge branch', replacement: '合并分支' },
        { pattern: 'Confirm merge', replacement: '确认合并' },
        { pattern: 'Close and comment', replacement: '评论并关闭' },
        { pattern: 'Reopen and comment', replacement: '提交并重新打开' },
        { pattern: 'Edited', replacement: '已编辑' },
        { pattern: 'Assigned to', replacement: '分配给' },
        { pattern: 'Mentioned', replacement: '提及' },
        { pattern: 'Review requested', replacement: '请求审查' },
        { pattern: 'Reviewed', replacement: '已审查' },
        { pattern: 'Authored', replacement: '由您创建' },
        { pattern: 'linked a pull request', replacement: '关联了拉取请求' },
        { pattern: 'marked this pull request as ready for review', replacement: '将此拉取请求标记为等待审查' },
        { pattern: 'Review status', replacement: '审查状态' },
        { pattern: 'No reviews', replacement: '暂无审查' },
        { pattern: 'Waiting for review', replacement: '等待审查' },
        { pattern: 'Approved by', replacement: '批准者' },
        { pattern: 'Changes requested by', replacement: '请求更改者' },
        { pattern: 'Reviewed by', replacement: '审查者' },
        { pattern: 'Commented by', replacement: '评论者' },
        { pattern: 'Merged by', replacement: '合并者' },

        // ================================================================
        //  正则翻译规则（从 maboloshi 词库精选）
        // ================================================================

        // 议题/PR 列表计数
        { pattern: /^([\d,]+)\s+Open$/, replacement: '$1 打开' },
        { pattern: /^([\d,]+)\s+Closed$/, replacement: '$1 已关闭' },
        { pattern: /^([\d,]+)\s+total$/, replacement: '共 $1' },
        // PR/Issue 详情页计数
        { pattern: /^(\d+)\s+Comments?$/, replacement: '$1 条评论' },
        { pattern: /^(\d+)\s+commits?$/, replacement: '$1 个提交' },
        { pattern: /^(\d+)\s+contributors?$/, replacement: '$1 位贡献者' },
        { pattern: /^(\d+)\s+Reviewers?$/, replacement: '$1 位审查者' },
        // 文件浏览页
        { pattern: /^(\d+)\s+lines?\s+\((\d+)\s+loc\)/, replacement: '$1 行（$2 非空行）' },
        // 仓库页
        { pattern: /^(\d+)\s+Stars?$/, replacement: '$1 个星标' },
        { pattern: /^(\d+)\s+Forks?$/, replacement: '$1 个复刻' },
        { pattern: /^(\d+)\s+Watching$/, replacement: '$1 个关注' },
        { pattern: /^(\d+)\s+Issues?$/, replacement: '$1 个议题' },
        // 时间日期
        { pattern: /^on\s+(\w+\s+\d+,\s+\d+)$/, replacement: '于 $1' },
        // PR 合并信息
        { pattern: /^Merged\s+#(\d+)\s+into\s+(.+)\s+from\s+(.+)$/, replacement: '合并 #$1 从 $3 到 $2' },
        // Review 状态
        { pattern: /^(\d+)\s+of\s+(\d+)\s+checks?\s+passed$/, replacement: '$2 个检查中 $1 个通过' },
        // Issue 关联
        { pattern: /^(\d+)\s+linked\s+issues?$/, replacement: '关联 $1 个议题' },
        { pattern: /^(\d+)\s+linked\s+pull\s+requests?$/, replacement: '关联 $1 个拉取请求' },
        // 任务列表
        { pattern: /^(\d+)\s+of\s+(\d+)\s+tasks?$/, replacement: '$1 / $2 个任务' },
        { pattern: /^(\d+)\s+tasks?\s+done$/, replacement: '$1 个任务完成' },
        // 贡献者活动
        { pattern: /^Committed to this repository in the past (\w+)$/, replacement: '最近 $1 内提交过此仓库' },
        { pattern: /^Opened this pull request \(their first ever\)$/, replacement: '打开了此拉取请求（首次）' },

        // ================================================================
        //  Markdown 工具栏（编辑器内的工具提示）
        // ================================================================

        { pattern: 'Bold', replacement: '粗体' },
        { pattern: 'Italic', replacement: '斜体' },
        { pattern: 'Quote', replacement: '摘引' },
        { pattern: 'Code block', replacement: '代码块' },
        { pattern: 'Link', replacement: '链接' },
        { pattern: 'Image', replacement: '图片' },
        { pattern: 'Table', replacement: '表格' },
        { pattern: 'Details', replacement: '详细信息' },
        { pattern: 'Task list', replacement: '任务列表' },
        { pattern: 'Heading', replacement: '标题' },
        { pattern: 'Numbered list', replacement: '有序列表' },
        { pattern: 'Unordered list', replacement: '无序列表' },
        { pattern: 'Attach files', replacement: '附件' },
        { pattern: 'Mention', replacement: '提及' },
        { pattern: 'Reference', replacement: '引用' },
        { pattern: 'Saved replies', replacement: '快速回复' },
        { pattern: 'Slash commands', replacement: '斜杠命令' },
        { pattern: 'Alerts', replacement: '警示' },
        { pattern: 'Markdown is supported', replacement: '支持 Markdown 语法' },
        { pattern: 'Styling with Markdown is supported.', replacement: '支持 Markdown 语法。' },
        { pattern: 'Add your comment here...', replacement: '在此添加您的评论…' },
        { pattern: 'Add your answer here...', replacement: '在此添加您的答复…' },
        { pattern: 'Add your description here…', replacement: '在此输入描述…' },
        { pattern: 'Type your description here…', replacement: '在此输入描述…' },
        { pattern: 'Text field is empty', replacement: '文本框为空' },
        { pattern: 'Nothing to preview', replacement: '没有什么可预览' },
        { pattern: 'Paste, drop, or click to add files', replacement: '粘贴、拖放或点击添加文件' },
        { pattern: 'Write with Copilot', replacement: '使用 Copilot 撰写' },
        { pattern: 'Attach files by', replacement: '通过' },
        { pattern: 'dragging & dropping,', replacement: '拖放，' },
        { pattern: 'selecting or pasting them.', replacement: '选择或粘贴来附加文件。' },

        // ================================================================
        //  仓库页通用（Actions / Insights / Wiki / Releases 等 tab）
        // ================================================================

        { pattern: 'Workflows', replacement: '工作流' },
        { pattern: 'Workflow runs', replacement: '工作流运行' },
        { pattern: 'Run workflow', replacement: '运行工作流' },
        { pattern: 'Enable workflows', replacement: '启用工作流' },
        { pattern: 'Recent runs', replacement: '最近运行' },
        { pattern: 'All workflows', replacement: '所有工作流' },
        { pattern: 'On:', replacement: '触发条件：' },
        { pattern: 'Push', replacement: '推送' },
        { pattern: 'Pull request', replacement: '拉取请求' },
        { pattern: 'Schedule', replacement: '定时' },
        { pattern: 'This workflow has a workflow_dispatch event trigger.', replacement: '此工作流支持手动触发。' },
        { pattern: 'Run name', replacement: '运行名称' },
        { pattern: 'Head branch', replacement: '头分支' },
        { pattern: 'Event', replacement: '事件' },
        { pattern: 'Workflow', replacement: '工作流' },
        { pattern: 'Run number', replacement: '运行编号' },
        { pattern: 'Started', replacement: '开始于' },
        { pattern: 'Duration', replacement: '持续时间' },
        { pattern: 'Completed', replacement: '已完成' },
        { pattern: 'Failed', replacement: '失败' },
        { pattern: 'Cancelled', replacement: '已取消' },
        { pattern: 'Skipped', replacement: '已跳过' },
        { pattern: 'In progress', replacement: '进行中' },
        { pattern: 'Queued', replacement: '排队中' },
        { pattern: 'Running', replacement: '运行中' },
        { pattern: 'Waiting', replacement: '等待中' },
        { pattern: 'Approve', replacement: '批准' },
        { pattern: 'Reject', replacement: '拒绝' },
        { pattern: 'Re-run all jobs', replacement: '重新运行所有任务' },
        { pattern: 'Re-run failed jobs', replacement: '重新运行失败的任务' },
        { pattern: 'Cancel workflow run', replacement: '取消工作流运行' },
        { pattern: 'Enable workflow', replacement: '启用工作流' },
        { pattern: 'Delete workflow run logs', replacement: '删除工作流运行日志' },
        { pattern: 'Delete all workflow runs', replacement: '删除所有工作流运行' },
        { pattern: 'Are you sure you want to delete the logs for this workflow run?', replacement: '您确定要删除此工作流运行的日志吗？' },
        { pattern: 'Are you sure you want to delete all workflow runs?', replacement: '您确定要删除所有工作流运行吗？' },
        { pattern: 'Use workflow artifacts', replacement: '使用工作流产物' },
        { pattern: 'Artifacts', replacement: '产物' },
        { pattern: 'No workflow run artifacts yet', replacement: '暂无工作流运行产物' },
        { pattern: 'Overview', replacement: '概况' },
        { pattern: 'Code frequency', replacement: '代码频率' },
        { pattern: 'Commit activity', replacement: '提交活动' },
        { pattern: 'Punch card', replacement: '打卡卡' },
        { pattern: 'Network', replacement: '网络' },
        { pattern: 'Members', replacement: '成员' },
        { pattern: 'Forks', replacement: '复刻' },
        { pattern: 'Languages', replacement: '语言' },
        { pattern: 'Latest release', replacement: '最新发行版' },
        { pattern: 'Releases', replacement: '发行版' },
        { pattern: 'Tags', replacement: '标签' },
        { pattern: 'Draft a new release', replacement: '草拟新发行版' },
        { pattern: 'Releases · ', replacement: '发行版 · ' },
        { pattern: 'Latest', replacement: '最新' },
        { pattern: 'Upcoming', replacement: '即将发布' },
        { pattern: 'No releases published', replacement: '暂无发行版' },
        { pattern: 'Compare', replacement: '比较' },
        { pattern: 'Wiki', replacement: 'Wiki' },
        { pattern: 'Pages', replacement: 'GitHub Pages' },
        { pattern: 'Security', replacement: '安全' },
        { pattern: 'Environments', replacement: '环境' },
        { pattern: 'Deployments', replacement: '部署' },
        { pattern: 'Packages', replacement: '软件包' },
        { pattern: 'Activity', replacement: '动态' },
        { pattern: 'Pulse', replacement: '脉搏' },
        { pattern: 'Community', replacement: '社区' },
        { pattern: 'Traffic', replacement: '流量' },
        { pattern: 'Clones', replacement: '克隆' },
        { pattern: 'Popular content', replacement: '热门内容' },
        { pattern: 'Referers', replacement: '来源' },
        { pattern: 'Views', replacement: '访问' },
        { pattern: 'Top paths', replacement: '热门路径' },

        // ================================================================
        //  仓库设置页扩展
        // ================================================================

        { pattern: 'Secrets', replacement: '密钥' },
        { pattern: 'Variables', replacement: '变量' },
        { pattern: 'Environments', replacement: '环境' },
        { pattern: 'Webhooks', replacement: '网络钩子' },
        { pattern: 'Add webhook', replacement: '添加网络钩子' },
        { pattern: 'GitHub Apps', replacement: 'GitHub 应用' },
        { pattern: 'Hooks', replacement: '钩子' },
        { pattern: 'Danger Zone', replacement: '危险区域' },

        // ================================================================
        //  用户菜单 / 个人资料
        // ================================================================

        { pattern: 'Your profile', replacement: '您的个人资料' },
        { pattern: 'Your repositories', replacement: '您的仓库' },
        { pattern: 'Your projects', replacement: '您的项目' },
        { pattern: 'Your stars', replacement: '您的星标' },
        { pattern: 'Your gists', replacement: '您的代码片段' },
        { pattern: 'Your organizations', replacement: '您的组织' },
        { pattern: 'Your enterprises', replacement: '您的企业' },
        { pattern: 'Your sponsorship', replacement: '您的赞助' },
        { pattern: 'Feature preview', replacement: '功能预览' },
        { pattern: 'Settings', replacement: '设置' },
        { pattern: 'GitHub Docs', replacement: 'GitHub 文档' },
        { pattern: 'GitHub Support', replacement: 'GitHub 支持' },
        { pattern: 'GitHub Community', replacement: 'GitHub 社区' },
        { pattern: 'Status', replacement: '状态' },
        { pattern: 'Log out', replacement: '退出登录' },
        { pattern: 'Sign out...', replacement: '登出…' },
        { pattern: 'Switch account', replacement: '切换账户' },
        { pattern: 'Your billing settings', replacement: '您的账单设置' },
        { pattern: 'Pinned', replacement: '置顶' },
        { pattern: 'Contributions', replacement: '贡献' },
        { pattern: 'Contribution activity', replacement: '贡献动态' },
        { pattern: 'Achievements', replacement: '成就' },
        { pattern: 'Organizations', replacement: '组织' },
        { pattern: 'Sponsors', replacement: '赞助者' },
        { pattern: 'Starred', replacement: '已加星标' },

        // ================================================================
        //  搜索弹窗 / 命令面板
        // ================================================================

        { pattern: 'Command palette', replacement: '命令面板' },
        { pattern: 'All of GitHub', replacement: '整个 GitHub' },
        { pattern: 'Autocomplete', replacement: '自动完成' },
        { pattern: 'Search in this directory', replacement: '在文件夹中搜索' },
        { pattern: 'Search in this organization', replacement: '在该组织中搜索' },
        { pattern: 'Jump to', replacement: '跳转到' },
        { pattern: 'Ask Copilot', replacement: '询问 Copilot' },
        { pattern: 'Saved queries', replacement: '已保存的搜索' },
        { pattern: 'Search results', replacement: '搜索结果' },
        { pattern: 'Search or jump to a repository', replacement: '搜索或跳转到仓库' },
        { pattern: 'Search or jump to a user, organization, or repository', replacement: '搜索或跳转到用户、组织或仓库' },
        { pattern: 'Search files', replacement: '搜索文件' },
        { pattern: 'Search issues and pull requests', replacement: '搜索议题和拉取请求' },
        { pattern: 'Search projects', replacement: '搜索项目' },
        { pattern: 'Top result', replacement: '最佳结果' },
        { pattern: 'Owners', replacement: '所有者' },
        { pattern: 'Run a command', replacement: '运行命令' },
        { pattern: 'Run command', replacement: '运行命令' },
        { pattern: 'Commands', replacement: '命令' },
        { pattern: 'Clear Command Palette', replacement: '清除命令面板' },
        { pattern: 'Filter to pull requests', replacement: '筛选拉取请求' },
        { pattern: 'Filter to issues', replacement: '筛选议题' },
        { pattern: 'Filter to discussions', replacement: '筛选讨论' },
        { pattern: 'Filter to projects', replacement: '筛选项目' },

        // ================================================================
        //  页面标题翻译（document.title）
        // ================================================================

        {
            selector: 'title',
            replace(el) {
                const t = el.textContent;
                const rules = [
                    [/^Issues\b/, '议题'],
                    [/^Pull requests?\b/, '拉取请求'],
                    [/^Discussions?\b/, '讨论'],
                    [/^Actions\b/, '操作'],
                    [/^Settings\b/, '设置'],
                    [/^Security\b/, '安全'],
                    [/^Insights\b/, '洞察'],
                    [/^Wikis?\b/, 'Wiki'],
                    [/^Releases\b/, '发行版'],
                    [/^Tags\b/, '标签'],
                    [/^Branches\b/, '分支'],
                    [/^Network\b/, '网络'],
                    [/^Pulse\b/, '脉搏'],
                    [/^Community\b/, '社区'],
                    [/^Traffic\b/, '流量'],
                    [/^Forks\b/, '复刻'],
                    [/^Stargazers?\b/, '星标者'],
                    [/^Watchers?\b/, '关注者'],
                    [/^Activity\b/, '动态'],
                    [/^Milestones?\b/, '里程碑'],
                    [/^Labels\b/, '标签'],
                ];
                for (const [pat, rep] of rules) {
                    if (pat.test(t)) { el.textContent = t.replace(pat, rep); return true; }
                }
                return false;
            },
        },
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
            // 正则模式：用 replace() 插值捕获组（$1, $2...），否则直接使用译文
            const text = isReg ? raw.replace(entry.pattern, entry.replacement) : entry.replacement;
            safeSetTextContent(el, text);
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
        const checks = [];

        // 仓库/组织/个人页面才有的导航标签
        if (/^\/(?:[^/]+\/[^/]+)?\/?$/.test(path) && !/^(?:$|\/dashboard|\/orgs|\/users|\/settings|\/new|\/notifications|\/explore|\/trending|\/topics|\/collections|\/events|\/sponsors|\/search)/.test(path)) {
            checks.push(
                { name: '导航标签 (data-content)', selector: 'span[data-content]' },
            );
        }

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

    // ========== 油猴菜单开关 ==========

    // 读取开关状态（优先 GM API，回退 localStorage）
    function loadEnabled() {
        try {
            const v = GM_getValue('enabled', true);
            // 类型强制：GM_getValue 在部分环境下可能返回字符串 "false"（truthy）
            return v !== false && v !== 'false';
        } catch (e) { /* GM API 不可用时回退 localStorage */ }
        try { return localStorage.getItem('gh-zh-enabled') !== 'false'; } catch (e) {}
        return true;
    }

    // 保存开关状态（GM API + localStorage 双写，确保持久化）
    function saveEnabled(val) {
        try { GM_setValue('enabled', val); } catch (e) { /* 静默失败 */ }
        try { localStorage.setItem('gh-zh-enabled', String(val)); } catch (e) {}
    }

    let enabled = loadEnabled();

    function registerMenu() {
        try {
            if (typeof GM_registerMenuCommand !== 'function') return;
            GM_registerMenuCommand(
                enabled ? '✅ 汉化已开启（点击关闭）' : '❌ 汉化已关闭（点击开启）',
                () => {
                    enabled = !enabled;
                    saveEnabled(enabled);
                    console.log(`[GitHub 汉化] 翻译已${enabled ? '开启' : '关闭'}`);
                    // 立即生效：重新加载页面
                    location.reload();
                },
            );
        } catch (e) {
            console.warn('[GitHub 汉化] 菜单注册失败:', e);
        }
    }

    // ========== DOM 变化监听 ==========

    let pending = false;
    const observer = new MutationObserver(() => {
        if (!enabled) return;
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
            `%c  GitHub 汉化插件 v2.0.0  |  %d 条翻译规则已加载  |  汉化${enabled ? '已开启' : '已关闭'}`,
            'color: #00ff41',
            'color: #1f883d; font-weight: bold',
            dict.length
        );
        registerMenu();
        if (enabled) {
            translateAll();
            selfCheck();
        }

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        // 监听 GitHub SPA 路由切换
        document.addEventListener('pjax:end', () => { if (enabled) { translateAll(); selfCheck(); } });
        document.addEventListener('turbolinks:load', () => { if (enabled) { translateAll(); selfCheck(); } });
        document.addEventListener('turbo:load', () => { if (enabled) { translateAll(); selfCheck(); } });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
