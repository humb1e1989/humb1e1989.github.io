/* ============================================================
   config.js — 站点模板配置(你之后只需改这个文件)
   ------------------------------------------------------------
   每个页面想用哪个模板,把值改成 "v1" 或 "v2" 即可。
   改完保存、刷新页面就生效,不用动其它代码。
   ============================================================ */
// window.SITE_CONFIG = {
//   home:     "v1",   // 首页:      v1 = hero + 板块入口(以后可加 v2)
//   blog:     "v1",   // 博客列表:  v1 = 终端流   / v2 = 霓虹网格
//   post:     "v1",   // 博客文章:  v1 = HUD阅读器 / v2 = 数据流
//   about:    "v1",   // 关于:      v1 = 角色档案 / v2 = 时间线
//   projects: "v1",   // 作品:      v1 = 卡片解密 / v2 = 全息列表
//   contact:  "v1"    // 联系:      v1 = 传输终端 / v2 = 通讯卡
// };

window.SITE_CONFIG = {
  home:     "v1",   // 首页:      v1 = hero + 板块入口(以后可加 v2)
  blog:     "v2",   // 博客列表:  v1 = 终端流   / v2 = 霓虹网格
  post:     "v2",   // 博客文章:  v1 = HUD阅读器 / v2 = 数据流
  about:    "v2",   // 关于:      v1 = 角色档案 / v2 = 时间线
  projects: "v2",   // 作品:      v1 = 卡片解密 / v2 = 全息列表
  contact:  "v2"    // 联系:      v1 = 传输终端 / v2 = 通讯卡
};

/* ---------- 以下为路由逻辑,正常情况下无需修改 ---------- */
(function () {
  var cfg = window.SITE_CONFIG || {};
  var file = (location.pathname.split('/').pop() || 'index.html');
  var key = file.replace('.html', '');

  // 首页 → 跳到所选首页模板
  if (key === '' || key === 'index') {
    location.replace('home-' + (cfg.home || 'v1') + '.html');
    return;
  }
  // 其它入口(blog/post/about/projects/contact)→ 跳到所选变体
  if (cfg[key]) {
    location.replace(key + '-' + cfg[key] + '.html');
  }
})();
