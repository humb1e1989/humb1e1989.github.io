# 部署说明 · Jordan Lee 赛博朋克个人站

## 一、这个网站是什么
纯**静态**站点 —— 只有 HTML / CSS / JS + 一张背景图,**没有后端、没有构建步骤、没有数据库**。
任何能托管静态文件的地方都能跑(Netlify / Vercel / GitHub Pages / Cloudflare Pages / 你自己的虚拟主机)。

字体通过 Google Fonts CDN 在线加载,联网即可,无需额外文件。

## 二、文件清单(要上线的部分)
全部在 `cyber/` 文件夹里:

```
cyber/
├── config.js          ← ★ 模板配置(改这个文件来切换每页用哪个模板)
├── cyber.css          ← 共享样式(配色、霓虹、背景系统)
├── cyber.js           ← 共享交互(故障、扫描线、鼠标光标、音效…)
├── bg-subway.png      ← 地铁隧道背景图
│
│   ── 干净入口(对外的网址,导航都指向这些) ──
├── index.html         ← 首页(按 config 跳转)
├── blog.html  post.html  about.html  projects.html  contact.html
│
│   ── 模板变体(实际内容,全部保留) ──
├── home-v1.html       首页 · hero + 板块入口
├── blog-v1.html       博客列表 · A(终端流)      blog-v2.html     B(霓虹网格)
├── post-v1.html       博客文章 · A(HUD阅读器)   post-v2.html     B(数据流)
├── about-v1.html      关于 · A(角色档案)        about-v2.html    B(时间线)
├── projects-v1.html   作品 · A(卡片解密)        projects-v2.html B(全息列表)
└── contact-v1.html    联系 · A(传输终端)        contact-v2.html  B(通讯卡)
```

> `Cyberpunk Pages.html` / `design-canvas.jsx` 只是给你对比预览用的画布,**不要上线**。
> `Saved/` 和 `options/` 是早期的 A 方案,也不属于这个站。

## 三、★ 怎么切换每个页面用哪个模板(配置接口)
所有变体**都已保留**。你不用删文件、也不用改导航 —— 只改一个文件:

打开 **`config.js`**,把对应页面的值改成 `"v1"` 或 `"v2"`:

```js
window.SITE_CONFIG = {
  home:     "v1",   // 首页
  blog:     "v1",   // 博客列表:  v1=终端流    / v2=霓虹网格
  post:     "v1",   // 博客文章:  v1=HUD阅读器 / v2=数据流
  about:    "v1",   // 关于:      v1=角色档案  / v2=时间线
  projects: "v1",   // 作品:      v1=卡片解密  / v2=全息列表
  contact:  "v1"    // 联系:      v1=传输终端  / v2=通讯卡
};
```

**原理:** 对外网址永远是干净的 `index.html` / `blog.html` / `about.html` …;打开时 `config.js` 会自动把你送到当前选中的变体(如 `blog-v1.html`)。导航、文章链接也都走这些入口,所以**改一次配置,全站同步生效**,改完刷新即可。

> 首页已就绪(`home-v1.html`):hero + 状态 + 四个板块入口 + 最新文章。想要第二种首页风格告诉我即可。

## 四、部署方式(任选其一)

### 方式 A · Netlify 拖拽上传(最快,零配置)
1. 打开 https://app.netlify.com/drop
2. 把 `cyber/` 文件夹直接拖进去
3. 几秒后得到一个 `xxx.netlify.app` 网址,完成。
4. 想用自己的域名:Site settings → Domain management → 添加你的域名,按提示改 DNS。

### 方式 B · Vercel
1. 安装:`npm i -g vercel`
2. 进入 `cyber/` 目录,运行 `vercel`,按提示登录并确认即可。

### 方式 C · GitHub Pages(免费,适合长期维护)
1. 新建一个 GitHub 仓库,把 `cyber/` 里的文件推上去(建议把它们放到仓库根目录)。
2. 仓库 Settings → Pages → Source 选 `main` 分支 → Save。
3. 等一两分钟,访问 `https://你的用户名.github.io/仓库名/`。

### 方式 D · Cloudflare Pages
1. https://pages.cloudflare.com → Create a project → 连接仓库或直接上传文件夹。
2. 构建命令留空,输出目录填 `/`(纯静态)。

### 方式 E · 传统虚拟主机 / 自己的服务器
用 FTP/SFTP 把 `cyber/` 里的文件上传到网站根目录(通常是 `public_html` 或 `www`)。
把 `index.html` 放在根目录即可作为首页。

## 五、上线后的小优化(可选但推荐)
- **压缩背景图**:`bg-subway.png` 约 1MB。转成 `.webp` 或质量 80 的 `.jpg` 通常能压到 ~150KB,首屏更快。转好后把 `cyber.css` 里 `.bgimg` 的 `url('bg-subway.png')` 改成新文件名。
- **自定义域名 + HTTPS**:上面每个平台都免费送 HTTPS,绑定域名后自动启用。
- **想离线 / 不依赖 Google**:可把 Chakra Petch、Orbitron、Share Tech Mono 三款字体下载到本地并改用 `@font-face` 引入(目前是 CDN,联网即可,一般不需要改)。

## 六、本地预览
直接双击 `cyber/index.html`(或任意入口 / 变体文件)用浏览器打开就能看,背景图和样式都是相对路径。
> 注意:`config.js` 的跳转在 `file://` 直接双击时也能工作;若个别浏览器拦截跳转,改用下面的本地服务器最稳妥。
如想用本地服务器:在 `cyber/` 目录运行 `python3 -m http.server 8000`,浏览器开 `http://localhost:8000/`(会自动进首页)。
