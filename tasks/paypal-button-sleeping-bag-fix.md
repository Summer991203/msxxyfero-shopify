# 任务：睡袋商品页补上金色 PayPal 按钮

## ⚠️ 更新 2026-11-06 20:35（Muse）：先验证，别急着改模板

**新证据：金色按钮在睡袋页其实出现过。** Muse 20:22–20:25 的桌面整页截图里，睡袋页 "Add to cart" 正下方就是金色 "Pay with PayPal" 按钮，其下还有 "More payment options"——和球页、钥匙扣页一样。

**所以之前"睡袋页没有按钮"的结论很可能是看早了，不是模板 bug。** PayPal 的按钮是外部 SDK（zoid iframe）加载后才渲染的，加载很慢：
- 浏览器任务 19:56 两次观察（刚打开、5 秒后）都只看到标准 "Buy it now"；
- Muse 多次无头探查证实 SDK 是"有时加载、有时不加载"：有的轮次 zoid 容器在但 iframe 一直是 0，有时等 25 秒也没有，有时等够久就出金色按钮；
- 手机端无头环境里一次也没渲染出金色按钮（只见 "Buy it now" 或空白），但那很可能是无头环境的假象，真实手机浏览器未验证。

**改做事的顺序（重要）：**
1. **先用真实浏览器验证，不改代码。** 打开睡袋页，等 30 秒以上，把购买区滚到视野中央，再等 10 秒，看金色 "Pay with PayPal" 是否出现。球页、钥匙扣页同样复核。
2. **如果等够久后三页都有金色按钮 → 不用改任何代码。** 直接在 `status.md` 写：验证通过，是 SDK 加载慢的问题，无需模板改动，并注明你等了多久、用什么浏览器验的。
3. **只有在真实浏览器里等足 30 秒以上、多次刷新都始终不出金色按钮时**，才按下面原任务去排查模板。

**手机端：** 如果你手头有真实手机，顺手打开睡袋页看一眼金色按钮有没有；无头手机模拟的结果不可信，别以它为准。

---


来源：Muse（2026-11-06 晚）。用户原话：PayPal 金色按钮三个商品页都要有，只做一个不行；做不了就交给你。

## 背景（已完成的部分，不用重做）

- 店：Msxxyfero（msxxyfero.com），主题 live："Msxxyfero — SEO & Product Discovery v14 · Nov 5"（ID 190108860495）。不要切换主题，不要动备份草稿 "Backup 2026-11-06 landing-page fix"。
- 三个商品共用套餐组件 `blocks/msx-quantity-offers.liquid`。Muse 已在该组件的 "Add to cart" 表单之后加了 PayPal 表单（含变体 id 与 quantity 隐藏输入 + 标准的 `{{ form | payment_button }}`，即 Shopify 动态结账按钮）、样式 `.msx-offers__paypal{margin-top:12px}`、以及内联同步脚本（按组件当前所选变体与套餐件数更新 PayPal 表单）。`assets/msx-quantity-offers.js` 未改动。
- PayPal Express Checkout 已确认可用：后台 Settings → Payments 已激活，关联账户 1661242412@qq.com，购物车页金色按钮可点、能到 PayPal 登录页。
- 已上线、已验证：
  - Pop-Up Cat Ball（/products/rolling-cat-playpen-pop-up-mesh-enclosure）：金色 "Pay with PayPal" 在深绿 "Add to cart" 正下方；选 2 件同色、总价 $54.00 后点击，到达 PayPal 登录页（显示 "Let's check out with Msxxyfero"）。
  - Cat Hair Keepsake Keychain（/products/cat-hair-keepsake-keychain）：金色按钮在 "Add to cart" 正下方，其下有 "More payment options"。

## 剩下的唯一问题：睡袋页没有金色按钮

- Plush Cat Sleeping Bag Bed（/products/plush-cat-sleeping-bag-bed）："Add to cart" 正下方是一枚深绿色标准 "Buy it now" 按钮，没有 PayPal iframe、没有 "More payment options"。两次观察（刚打开、等待 5 秒后）都一样。
- 套餐组件本身工作正常（点 "2 items $36.00" 后出现 Item 2、总价更新为 $36.00）。
- 模板比对：`product.sleeping-bag.json` 同样包含 msx_quantity（msx-quantity-offers）与 buy_buttons 区块、顺序与球页一致，所以不是缺少区块。
- 初步判断：该模板下组件的 PayPal payment_button 未初始化，且本应被组件 CSS 隐藏的标准 "Buy it now" 仍在显示。属于模板层面的特定问题，需要针对性排查修复。

## 要你做的事

1. 查清睡袋模板下 payment_button 不初始化、以及隐藏标准购买按钮的 CSS 不生效的原因。
2. 修好它，让睡袋页像球页一样：金色 "Pay with PayPal" 按钮在 "Add to cart" 正下方，点击后按组件当前所选变体与套餐件数走 PayPal 快捷结账。
3. 已知局限（不要弄得更差，能顺手修好更好）：混色套餐时 PayPal 表单目前只买首件商品 1 件；同色套餐按套餐件数购买是对的。
4. 不要改：价格、商品、折扣、像素、广告活动；不要切换主题；不要动备份草稿主题。

## 验证（做完必须自己验）

- 重新加载睡袋页，确认金色 "Pay with PayPal" 在 "Add to cart" 正下方可见；点它，到达 PayPal 登录页即可——不要登录、不要付款、不要下单。
- 顺手复核球页和钥匙扣页的金色按钮还在、能点。
- 做完把结果写进仓库根目录 `status.md`（说明修了什么、在哪页验过、点击结果），`git push`。

## 店里真实数字（对照用）

- Pop-Up Cat Ball $29.99，was $39.99，free shipping，Black Friday 截止 Dec 1；30-day guarantee — full refund, no need to send it back；supervised use only。
- 评价：Pop-Up Cat Ball 0 reviews；Keychain 4.92/5（252），Sleeping Bag 4.67/5（39）。
- 产品形态：fully closed black spherical mesh ball，cross straps + zipper，cat completely inside。
