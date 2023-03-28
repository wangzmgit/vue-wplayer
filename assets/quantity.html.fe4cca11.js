import{_ as n,o as s,c as a,e}from"./app.60d75c29.js";const p={},t=e(`<h1 id="\u6E05\u6670\u5EA6\u5207\u6362" tabindex="-1"><a class="header-anchor" href="#\u6E05\u6670\u5EA6\u5207\u6362" aria-hidden="true">#</a> \u6E05\u6670\u5EA6\u5207\u6362</h1><p>\u5982\u679C\u4E00\u4E2A\u89C6\u9891\u6709\u591A\u4E2A\u4E0D\u540C\u6E05\u6670\u5EA6\u7684\u94FE\u63A5\uFF0C<code>options.resource</code> \u53EF\u4EE5\u4F20\u4E00\u4E2A\u89C6\u9891\u94FE\u63A5\u7684\u5BF9\u8C61\uFF0C\u5177\u4F53\u683C\u5F0F\u5982\u4E0B\uFF1A</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">interface</span> <span class="token class-name">QualityType</span> <span class="token punctuation">{</span>
    <span class="token punctuation">[</span>key<span class="token operator">:</span> number<span class="token punctuation">]</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        name<span class="token operator">?</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        <span class="token literal-property property">url</span><span class="token operator">:</span> string<span class="token punctuation">,</span>
        type<span class="token operator">?</span><span class="token operator">:</span> string
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token comment">//\u6BCF\u4E2A\u89C6\u9891\u53EF\u4EE5\u5355\u72EC\u6307\u5B9A\u89C6\u9891\u7C7B\u578B\uFF0C\u5982\u679C\u672A\u6307\u5B9A\u7C7B\u578B\u5219\u4F7F\u7528 \`options.type\` \u7684\u7C7B\u578B\u3002</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>\u793A\u4F8B\uFF1A</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
    <span class="token literal-property property">resource</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token number">360</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;\u6807\u6E05&#39;</span><span class="token punctuation">,</span>
          <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;mp4&quot;</span><span class="token punctuation">,</span>
          <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">&#39;&#39;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token number">720</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&#39;\u8D85\u6E05&#39;</span><span class="token punctuation">,</span>
          <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;mp4&quot;</span><span class="token punctuation">,</span>
          <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">&#39;&#39;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token operator">...</span>
    <span class="token comment">// \u81EA\u5B9A\u4E49\u6E05\u6670\u5EA6\u5207\u6362</span>
    <span class="token function-variable function">customQualityChange</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">quality</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5),o=[t];function l(r,i){return s(),a("div",null,o)}const u=n(p,[["render",l],["__file","quantity.html.vue"]]);export{u as default};
