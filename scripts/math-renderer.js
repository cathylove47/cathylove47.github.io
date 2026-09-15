/**
 * 在 hexo-renderer-markdown-it 的 markdown-it 实例上挂载公式解析。
 *
 * 覆盖两类场景：
 * 1. `delimiters: 'dollars'` — 处理 $...$ 行内公式与 $$...$$ 显示公式
 *    （hexo-renderer-marked 会把多行 $$ 块拆散成多个段落、吃掉 \{ \}，
 *     这是此前公式渲染失败的根因；texmath 在解析期直接产出 KaTeX HTML，无此问题）。
 * 2. `delimiters: ['dollars', 'beg_end']` — 额外支持 \begin{equation}...\end{equation}
 *    等原生 LaTeX 环境写法。
 *
 * KaTeX 在生成期（Node 侧）渲染，产物自带 MathML + katex-html 双份输出，
 * 浏览器无需加载任何公式脚本；无客户端 FOUC。
 * Fluid 的 math.engine 配置仅对 marked 渲染链生效，保留不动不会冲突。
 */
const texmath = require('markdown-it-texmath');
const katex = require('katex');

hexo.extend.filter.register('markdown-it:renderer', function (parser) {
  // 幂等：同一 parser 实例可能多次进入过滤器
  if (parser.__texmathAttached) return;
  parser.__texmathAttached = true;
  parser.use(texmath, {
    engine: katex,
    delimiters: ['dollars', 'beg_end'],
    katexOptions: { throwOnError: false, strict: false },
  });
});
