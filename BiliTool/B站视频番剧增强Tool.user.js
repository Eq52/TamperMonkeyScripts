// ==UserScript==
// @name         B站视频番剧增强Tool
// @namespace    https://github.com/Eq52/TamperMonkeyScripts/tree/main/BiliTool
// @version      5.0.2
// @description  B站PC手机双端适配解析，番剧解析(第三方API)，视频下载(第三方API)，强力去广告，使用第三方API在未登录情况下体验高清画质。
// @license      GPL-3.0-only
// @icon         data:image/png;base64,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zHcE4HyXHXh/rQbeGvhw36WMAo4334l9m3zzndg33ibgE3yXMgY43nxP8F3KIOB4853YN94Ph57vHXybnfA9w3cpY4DzbYKS2DfefM/wXcoQ4Hjzndi3n7fmO5HvgnfTwed7Ld41vunme1vfhW8TlGN84833HN9lhG+8+Z7ju5QRwPHmO7Fv7ZvvOb7LLN9g872574J3uxLwvRNvvvke4Lt0jvZtgjLRdxniG2++k/o+/PfG2laB7018I/2oCHzjndl3/pEreJ/MO/3g8Z0a7/HDW/DGm2+8z+W99RDzzTffxp5vvg0933l9G3q+E/s28nzzbeCN8pa+Dbzj33wb+R0Hmm/zwsS+g2+++ebbyO841ME333mBB9945/UdfPPNt/mJsd8SON98J/YdfE/zHQG4IR7jO+jOCJxvR2UT+w6+rwb9eUmqyhkBON9jfbcpSd1zA3C8d/QdfK/iO/huX5K6pwbffPMN+PF78GWxkvC9CPDgm2+++W7g2+7leOB8850YePA9zDfew30H33wnBs4333zz3cK3s0+GAw+++c7rO/juVo2aZ4HdFzjf43zjPdx38N2xGGYns4HzzXdi38E334mB880333w38Y33aN/BN9+JgfM90Dfeo4EH33zzzTffO/oOvjtXgu+ZwPnmOzHw4HvoBIXvob6Db7755vtVHfjm+1TfMHcEHnxP9o1yR+DB9+gJON988y188w34ebz5Bjz10PLNN9988813qyrwPQF48M0333zzvSPw4JvvxMD55jux7+Cbb775blEDvkcDD77nNHC+hwDne2wFrh5OcBffwTfffPPdfILC9wDgwfck36bfA4AH37MmKHjzndJ30b6HAed7yvj7bYgxwIPvBXbxAe80wME333zzzfeWwPleCDi8rUc4+OY7r+/g2wQlMXC+NfDEvoNvvhMD55vvxMCDb77z+g6+VwNOLt98SxjLeb6D7wXGOPjmm2++TVB2BB58O4KSF3jwrYHzzTffWwLn2x5mYuDBN995fQfffCcGzrcJeGbgfGvgiX0H3xp4Xt/BtwbON998bwmcb7755ptvvvkGfDHgwTffeX0H34v7BvzNOPOtgfPNN99b+g6+lwcO7fNx5pvvxL6DbxOUvMCDb77z+g6+AU8r/MgNjy2BEyt8C998C9/LTcAJl/V96+DCN9/Ct8h6vgGX1L6Db+Gb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
// @author       EricQ
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://m.bilibili.com/video/*
// @match        *://m.bilibili.com/bangumi/play/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 配置与存储
    // ==========================================
    const UserConfig = {
        // 通用接口 (仅番剧页使用)
        baseApis: [
            { n: "m1907", u: "https://z1.m1907.top/?jx=" },
            { n: "HLS解析", u: "https://jx.hls.one/?url=" },
            { n: "极速线路", u: "https://jx.2s0.cn/player/?url=" },
            { n: "云端接口", u: "https://yparse.ik9.cc/index.php?url=" },
            { n: "虾米线路", u: "https://jx.xmflv.cc/?url=" }
        ],
        // PC端与移动端选择器配置
        sites: {
            'bilibili_pc': { t: 'B站(PC)', s: true, sel: ['#bilibili-player', '.bpx-player-container', '#player_module'] },
            'bilibili_mb': { t: 'B站(手机)', s: true, sel: ['.mplayer', '.player-container', '#player_placeholder', '.m-video-player'] }
        },
        ads: true,
        autoParse: false
    };

    const Store = {
        get(k, d) { return GM_getValue(k) !== undefined ? GM_getValue(k) : d; },
        set(k, v) { GM_setValue(k, v); },
        loadApis() { return this.get('xj_custom_apis', UserConfig.baseApis); },
        loadSites() { return this.get('xj_sites', UserConfig.sites); },
        loadAds() { return this.get('xj_ads', UserConfig.ads); },
        loadAutoParse() { return this.get('xj_auto_parse', UserConfig.autoParse); },
        saveApis(v) { this.set('xj_custom_apis', v); },
        saveSites(v) { this.set('xj_sites', v); },
        saveAds(v) { this.set('xj_ads', v); },
        saveAutoParse(v) { this.set('xj_auto_parse', v); }
    };

    // ==========================================
    // 2. 扫描器 (环境与ID识别)
    // ==========================================
    const Scanner = {
        isMobile: function() {
            return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
        },

        // 获取页面类型
        getPageType: function() {
            const path = window.location.pathname;
            if (path.includes('/bangumi/play/')) return 'bangumi';
            if (path.includes('/video/')) return 'video';
            return 'unknown';
        },

        getSiteKey: function() {
            const h = window.location.host;
            const mb = this.isMobile();
            // 移动端通常域名是 m.bilibili.com，PC是 www.bilibili.com
            // 这里的isMobile主要用来决定找哪个DOM结构
            if (h.includes('bilibili.com')) return mb ? 'bilibili_mb' : 'bilibili_pc';
            return null;
        },

        // 识别 BV 或 AV 号
        getVideoInfo: function() {
            const url = window.location.href;
            // 匹配 BV
            const bvMatch = url.match(/\/video\/(BV[a-zA-Z0-9]{10})/);
            if (bvMatch) return { type: 'BV', id: bvMatch[1] };

            // 匹配 AV
            const avMatch = url.match(/\/video\/(av(\d+))/);
            if (avMatch) return { type: 'AV', id: avMatch[1] };

            return null;
        },

        waitForNode: function(sel, t = 10000) {
            return new Promise((res, rej) => {
                const el = document.querySelector(sel);
                if (el) return res(el);
                const tm = setInterval(() => {
                    const e = document.querySelector(sel);
                    if (e) { clearInterval(tm); res(e); }
                }, 200);
                setTimeout(() => { clearInterval(tm); rej(new Error('Timeout')); }, t);
            });
        },

        findNode: function(selList) {
            for (let s of selList) {
                const el = document.querySelector(s);
                if (el) return el;
            }
            return null;
        },

        findMobileBili: function() {
            // 移动端统一尝试查找常见的播放器容器
            const selList = ['.mplayer', '.player-container', '#player_placeholder', '.m-video-player'];
            return this.findNode(selList);
        }
    };

    // ==========================================
    // 3. 广告清理器
    // ==========================================
    const AdCleaner = {
        rules: {
            bilibili: ['.bili-ad', '.ad-report', '.video-page-game-card', '.bb-comment', '.float-nav', '.rec-footer', '.bili-feedback']
        },
        init: function() {
            if (!Store.loadAds()) return;
            this.inject();
            this.watch();
        },
        inject: function() {
            let css = '';
            if (this.rules.bilibili) {
                this.rules.bilibili.forEach(r => css += `${r}{display:none!important;opacity:0!important;} `);
            }
            css += `div[style*="z-index"][style*="background"][style*="rgba(0,0,0"]{display:none!important;}`;
            GM_addStyle(css);
        },
        watch: function() {
            const obs = new MutationObserver((ms) => {
                ms.forEach((m) => {
                    m.addedNodes.forEach((n) => {
                        if (n.nodeType === 1) {
                            if (this.rules.bilibili) {
                                this.rules.bilibili.forEach(r => {
                                    if (n.matches && n.matches(r)) n.remove();
                                });
                            }
                        }
                    });
                });
            });
            if(document.body) obs.observe(document.body, { childList: true, subtree: true });
        }
    };

    // ==========================================
    // 4. 界面渲染器 (优化防重叠)
    // ==========================================
    const Interface = {
        toastTimer: null,

        css: `
            #xj-btn {
                position:fixed;bottom:50px;right:20px;width:45px;height:45px;
                background:linear-gradient(135deg,#FB7299,#FF85A2);border-radius:50%;
                box-shadow:0 4px 15px rgba(251,114,153,0.4);cursor:pointer;
                z-index:2147483647;display:flex;align-items:center;justify-content:center;
                font-size:20px;color:#fff;border:none;transition:0.2s;
                -webkit-tap-highlight-color: transparent;
            }
            #xj-btn:hover{transform:scale(1.1);}
            #xj-btn:active{transform:scale(0.95);}
            #xj-menu{
                position:fixed;bottom:105px;right:20px;width:180px;
                background:rgba(40,40,40,0.95);backdrop-filter:blur(10px);
                border-radius:12px;padding:8px;display:none;flex-direction:column;
                gap:5px;z-index:2147483646;border:1px solid rgba(255,255,255,0.1);
                box-shadow:0 5px 20px rgba(0,0,0,0.5);
            }
            .xj-item{padding:12px;color:#eee;border-radius:6px;cursor:pointer;font-size:14px;text-align:center;transition:0.2s;display:flex;align-items:center;justify-content:center;}
            .xj-item:hover{background:rgba(251,114,153,0.8);color:#fff;}
            .xj-split{height:1px;background:rgba(255,255,255,0.1);margin:5px 0;}
            #xj-set-modal{
                display:none;position:fixed;top:0;left:0;width:100%;height:100%;
                background:rgba(0,0,0,0.7);z-index:2147483648;
                justify-content:center;align-items:center;
            }
            #xj-set-box{
                background:#252525;width:320px;border-radius:12px;padding:20px;color:#ddd;
                box-shadow:0 10px 30px rgba(0,0,0,0.5);max-width:90%;
            }
            .xj-toggle{position:relative;width:40px;height:20px;background:#444;border-radius:20px;cursor:pointer;transition:0.3s;}
            .xj-toggle.on{background:#FB7299;}
            .xj-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:0.3s;}
            .xj-toggle.on .xj-knob{transform:translateX(20px);}
            .xj-input{width:100%;height:120px;background:#2a2a2a;border:1px solid #444;color:#ddd;padding:8px;border-radius:4px;resize:vertical;font-size:12px;}
            .xj-btm{margin-top:20px;text-align:right;}
            .xj-btn-xj{padding:8px 16px;background:#FB7299;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-left:5px;}
            .xj-tag{font-size:10px;background:#FB7299;padding:2px 4px;border-radius:4px;margin-left:5px;}
        `,

        init: function() {
            GM_addStyle(this.css);
            this.buildBtn();
            this.buildMenu();
            this.buildSet();
            this.bind();
        },

        buildBtn: function() {
            const b = document.createElement('button');
            b.id = 'xj-btn'; b.innerHTML = '📺'; b.title = 'XJ解析助手';
            document.body.appendChild(b);
        },

        buildMenu: function() {
            const m = document.createElement('div');
            m.id = 'xj-menu';
            
            const pageType = Scanner.getPageType();
            let h = '';

            if (pageType === 'video') {
                h += `<div class="xj-item" id="xj-parse-nx">🚀 极速解析 (NX)<span class="xj-tag">专享</span></div>`;
                h += `<div class="xj-item" id="xj-dl-nx">⬇️ 下载视频 (MP4)<span class="xj-tag">仅BV</span></div>`;
                h += `<div class="xj-split"></div>`;
            } else if (pageType === 'bangumi') {
                const list = Store.loadApis();
                list.forEach(i => h += `<div class="xj-item" data-u="${i.u}">${i.n}</div>`);
                h += `<div class="xj-split"></div>`;
            } else {
                h += `<div style="padding:10px;text-align:center;color:#888;font-size:12px;">当前页面不支持</div>`;
            }

            h += `<div class="xj-item" id="xj-rst">🔄 刷新还原</div>`;
            h += `<div class="xj-item" id="xj-op-set">⚙️ 设置</div>`;
            
            m.innerHTML = h;
            document.body.appendChild(m);
        },

        buildSet: function() {
            const d = document.createElement('div');
            d.id = 'xj-set-modal';
            const ad = Store.loadAds();
            const auto = Store.loadAutoParse();
            const apiTxt = Store.loadApis().map(i => `${i.n},${i.u}`).join('\n');

            d.innerHTML = `
                <div id="xj-set-box">
                    <h3 style="margin-top:0;color:#FB7299;">XJ 解析设置</h3>
                    <div style="margin-bottom:15px;">
                        <div style="margin-bottom:10px;display:flex;justify-content:space-between;">
                            <span>启用去广告</span>
                            <div class="xj-toggle ${ad?'on':''}" id="xj-ad-tog"><div class="xj-knob"></div></div>
                        </div>
                        <div style="margin-bottom:10px;display:flex;justify-content:space-between;">
                            <span>进入页面自动解析</span>
                            <div class="xj-toggle ${auto?'on':''}" id="xj-auto-tog"><div class="xj-knob"></div></div>
                        </div>
                    </div>
                    <div class="xj-split"></div>
                    <h4>通用接口管理 (仅番剧)</h4>
                    <p style="font-size:12px;color:#888;margin-bottom:5px;">视频页锁定专用接口，此处仅配置番剧页备用接口</p>
                    <textarea class="xj-input" id="xj-api-txt">${apiTxt}</textarea>
                    <div class="xj-btm">
                        <button class="xj-btn-xj" style="background:#555;" id="xj-cancel">取消</button>
                        <button class="xj-btn-xj" id="xj-save">保存配置</button>
                    </div>
                </div>`;
            document.body.appendChild(d);
        },

        bind: function() {
            const btn = document.getElementById('xj-btn');
            const menu = document.getElementById('xj-menu');
            const modal = document.getElementById('xj-set-modal');

            btn.onclick = e => {
                e.stopPropagation();
                menu.style.display = menu.style.display==='flex'?'none':'flex';
            };
            document.onclick = e => {
                if(!menu.contains(e.target) && e.target!==btn) menu.style.display='none';
            };

            document.getElementById('xj-parse-nx')?.addEventListener('click', () => {
                Driver.startNxvav();
                menu.style.display='none';
            });

            document.getElementById('xj-dl-nx')?.addEventListener('click', () => {
                Driver.downloadNxvav();
                menu.style.display='none';
            });

            menu.querySelectorAll('.xj-item[data-u]').forEach(i => {
                i.onclick = () => {
                    Driver.startGeneric(i.dataset.u, i.innerText);
                    menu.style.display='none';
                };
            });

            document.getElementById('xj-rst').onclick = () => {
                if(confirm('确定刷新页面还原吗？')) location.reload();
            };
            document.getElementById('xj-op-set').onclick = () => {
                menu.style.display='none';
                modal.style.display='flex';
            };

            document.getElementById('xj-cancel').onclick = () => modal.style.display='none';
            document.getElementById('xj-save').onclick = () => {
                Store.saveAds(modal.querySelector('#xj-ad-tog').classList.contains('on'));
                Store.saveAutoParse(modal.querySelector('#xj-auto-tog').classList.contains('on'));
                
                const lines = document.getElementById('xj-api-txt').value.split('\n');
                const newApis = [];
                lines.forEach(l => {
                    const p = l.split(',');
                    if(p.length>=2) newApis.push({n:p[0].trim(),u:p[1].trim()});
                });
                Store.saveApis(newApis);
                this.msg('✅ 配置已保存');
                modal.style.display='none';
            };

            modal.querySelectorAll('.xj-toggle').forEach(t => t.onclick = () => t.classList.toggle('on'));
        },

        // === 优化：防重叠消息提示 ===
        msg: function(t) {
            let el = document.getElementById('xj-toast');
            if (!el) {
                el = document.createElement('div');
                el.id = 'xj-toast';
                el.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:rgba(251,114,153,0.95);color:#fff;padding:10px 20px;border-radius:20px;z-index:999999;font-size:14px;box-shadow:0 2px 10px rgba(0,0,0,0.3);pointer-events:none;opacity:0;transition:opacity 0.3s;`;
                document.body.appendChild(el);
            }
            el.innerText = t;
            
            // 显示
            el.style.opacity = '1';
            
            // 重置计时器
            if (this.toastTimer) clearTimeout(this.toastTimer);
            this.toastTimer = setTimeout(() => {
                el.style.opacity = '0';
            }, 2500);
        }
    };

    // ==========================================
    // 5. 核心驱动 (解析/下载逻辑)
    // ==========================================
    const Driver = {
        getContainer: function() {
            const env = Scanner.getSiteKey();
            if(!env) throw new Error('未知设备环境');
            
            if (env === 'bilibili_pc') {
                const siteData = Store.loadSites()['bilibili_pc'];
                const box = Scanner.findNode(siteData.sel);
                if (!box) throw new Error('PC端：未找到播放器');
                return box;
            } else {
                const box = Scanner.findMobileBili();
                if (!box) throw new Error('移动端：未找到播放器');
                return box;
            }
        },

        // === 核心逻辑 A: NXVAV 专用解析 (强制BV) ===
        startNxvav: async function() {
            try {
                const vInfo = Scanner.getVideoInfo();
                if (!vInfo) return Interface.msg('❌ 无法识别视频ID');

                // === 核心要求：确保AV号视频不参与解析 ===
                if (vInfo.type === 'AV') {
                    console.log('[XJ] 拒绝解析AV号视频');
                    return Interface.msg('❌ 仅支持BV号视频，暂不支持AV号');
                }

                // === 核心要求：API URL 格式 ===
                // 使用 otype=dplayer 用于 iframe 替换
                const apiUrl = `https://api.nxvav.cn/api/bilivideo/?bv=${vInfo.id}&q=80&otype=dplayer`;
                
                const box = this.getContainer();
                this.injectIframe(box, apiUrl);
                Interface.msg('✅ NXVAV 解析中...');
            } catch(e) {
                console.error(e);
                Interface.msg('❌ 解析失败: '+e.message);
            }
        },

        // === 核心逻辑 B: NXVAV 下载 ===
        downloadNxvav: async function() {
            try {
                const vInfo = Scanner.getVideoInfo();
                if (!vInfo) return Interface.msg('❌ 无法识别视频ID');

                if (vInfo.type === 'AV') {
                    return Interface.msg('❌ 仅支持BV号视频下载');
                }

                Interface.msg('⏳ 正在获取下载地址...');
                const apiUrl = `https://api.nxvav.cn/api/bilivideo/?bv=${vInfo.id}&q=64&format=mp4&otype=json`;

                const resp = await fetch(apiUrl);
                const json = await resp.json();

                if (json.code === 0 && json.url) {
                    Interface.msg('🎉 开始下载');
                    window.open(json.url, '_blank');
                } else {
                    throw new Error('获取链接失败');
                }
            } catch(e) {
                console.error(e);
                Interface.msg('❌ 下载失败');
            }
        },

        // === 核心逻辑 C: 番剧页通用解析 ===
        startGeneric: async function(apiBase, name) {
            try {
                const target = apiBase + window.location.href;
                const box = this.getContainer();
                this.injectIframe(box, target);
                Interface.msg('✅ 切换线路: '+name);
            } catch(e) {
                console.error(e);
                Interface.msg('❌ 解析失败');
            }
        },

        injectIframe: function(box, src) {
            document.querySelectorAll('video').forEach(v => v.pause());
            box.innerHTML = '';
            const i = document.createElement('iframe');
            i.src = src;
            i.style.cssText = "width:100%;height:100%;border:none;position:absolute;top:0;left:0;z-index:99999;background:#000;";
            i.setAttribute('allowfullscreen', 'true');
            box.appendChild(i);
        }
    };

    // ==========================================
    // 6. 启动流程
    // ==========================================
    (function boot() {
        if(!Scanner.getSiteKey()) return;
        AdCleaner.init();
        
        // 稍微延迟初始化UI，确保页面元素加载
        setTimeout(()=>Interface.init(), 800);

        GM_registerMenuCommand("⚙️ XJ解析设置", ()=>{
            const modal = document.getElementById('xj-set-modal');
            if(modal) modal.style.display='flex'; 
        });

        // 自动解析逻辑
        setTimeout(() => {
            if (Store.loadAutoParse()) {
                const pageType = Scanner.getPageType();
                
                if (pageType === 'video') {
                    const vInfo = Scanner.getVideoInfo();
                    // 自动解析也需要检查AV号
                    if (vInfo && vInfo.type === 'BV') {
                        console.log('[XJ-Bili] 自动触发BV解析');
                        Driver.startNxvav();
                    } else {
                        console.log('[XJ-Bili] 自动解析跳过：非BV号');
                    }
                } else if (pageType === 'bangumi') {
                    const apis = Store.loadApis();
                    if (apis.length > 0) {
                        console.log('[XJ-Bili] 自动触发番剧解析');
                        Driver.startGeneric(apis[0].u, apis[0].n);
                    }
                }
            }
        }, 1500);
    })();


})();


