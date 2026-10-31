# تقرير جرد وفحص الأنماط المضمنة (Inline Styles) للألوان والخلفيات في تطبيق «نسمة حياة»

**تاريخ التوليد:** 2026-10-31T15:25:18.709Z
**إجمالي الملفات المفحوصة:** 187 ملفاً في مجلد `src/`
**إجمالي مواضع الأنماط المضمنة المكتشفة:** 16 موضعاً
**الملفات التي تحتوي على أنماط مضمنة للألوان والخلفيات:** 3 ملفات

## 1. جدول المواضع المكتشفة لاستهدافها وتصحيحها

| # | الملف والسطر | الخاصية | التصنيف | القيمة الحالية | كود المعاينة | التوصية والإصلاح المقترح |
|---|---|---|---|---|---|---|
| 1 | `src/components/ConsistencyHeatmapSection.tsx:432` | `backgroundColor` | Background Color | `day.color` | `style={{ backgroundColor: day.color, borderColor: day.level > 0 ? 'rgba(23,79,63,0.3)' ...` | استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب. |
| 2 | `src/components/ConsistencyHeatmapSection.tsx:432` | `borderColor` | Border Color | `day.level > 0 ? 'rgba(23` | `style={{ backgroundColor: day.color, borderColor: day.level > 0 ? 'rgba(23,79,63,0.3)' ...` | استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة. |
| 3 | `src/components/NesmatLuckyWheel.tsx:554` | `backgroundColor` | Background Color | `selectedSection.bgHex` | `style={{ backgroundColor: selectedSection.bgHex }}` | استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب. |
| 4 | `src/components/NesmatLuckyWheel.tsx:634` | `backgroundColor` | Background Color | `sec.bgHex` | `style={{ backgroundColor: sec.bgHex }}` | استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب. |
| 5 | `src/components/puzzles/LogicPuzzlesView.tsx:436` | `borderColor` | Border Color | `item.color` | `style={{ borderColor: item.color }}` | استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة. |
| 6 | `src/components/puzzles/LogicPuzzlesView.tsx:438` | `backgroundColor` | Background Color | `item.color` | `style={{ backgroundColor: item.color }}` | استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب. |
| 7 | `src/components/puzzles/LogicPuzzlesView.tsx:443` | `borderColor` | Border Color | `item.color` | `style={{ borderColor: item.color }}` | استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة. |
| 8 | `src/components/puzzles/LogicPuzzlesView.tsx:445` | `backgroundColor` | Background Color | `item.color` | `style={{ backgroundColor: item.color }}` | استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب. |
| 9 | `src/components/puzzles/LogicPuzzlesView.tsx:450` | `borderColor` | Border Color | `item.color` | `style={{ borderColor: item.color }}` | استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة. |
| 10 | `src/components/puzzles/LogicPuzzlesView.tsx:452` | `backgroundColor` | Background Color | `item.color` | `style={{ backgroundColor: item.color }}` | استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب. |
| 11 | `src/components/puzzles/LogicPuzzlesView.tsx:508` | `borderColor` | Border Color | `opt.color` | `style={{ borderColor: opt.color }}` | استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة. |
| 12 | `src/components/puzzles/LogicPuzzlesView.tsx:510` | `backgroundColor` | Background Color | `opt.color` | `style={{ backgroundColor: opt.color }}` | استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب. |
| 13 | `src/components/puzzles/LogicPuzzlesView.tsx:514` | `borderColor` | Border Color | `opt.color` | `style={{ borderColor: opt.color }}` | استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة. |
| 14 | `src/components/puzzles/LogicPuzzlesView.tsx:516` | `backgroundColor` | Background Color | `opt.color` | `style={{ backgroundColor: opt.color }}` | استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب. |
| 15 | `src/components/puzzles/LogicPuzzlesView.tsx:520` | `borderColor` | Border Color | `opt.color` | `style={{ borderColor: opt.color }}` | استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة. |
| 16 | `src/components/puzzles/LogicPuzzlesView.tsx:522` | `backgroundColor` | Background Color | `opt.color` | `style={{ backgroundColor: opt.color }}` | استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب. |

## 2. تفصيل الملفات المتأثرة وخطة الاستهداف

### الملف: `src/components/ConsistencyHeatmapSection.tsx` (2 موضع)
- **السطر 432:** الخاصية `backgroundColor` بقيمة `day.color`
  - *الكود:* `style={{ backgroundColor: day.color, borderColor: day.level > 0 ? 'rgba(23,79,63,0.3)' ...`
  - *التوصية:* استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.
- **السطر 432:** الخاصية `borderColor` بقيمة `day.level > 0 ? 'rgba(23`
  - *الكود:* `style={{ backgroundColor: day.color, borderColor: day.level > 0 ? 'rgba(23,79,63,0.3)' ...`
  - *التوصية:* استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة.

### الملف: `src/components/NesmatLuckyWheel.tsx` (2 موضع)
- **السطر 554:** الخاصية `backgroundColor` بقيمة `selectedSection.bgHex`
  - *الكود:* `style={{ backgroundColor: selectedSection.bgHex }}`
  - *التوصية:* استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.
- **السطر 634:** الخاصية `backgroundColor` بقيمة `sec.bgHex`
  - *الكود:* `style={{ backgroundColor: sec.bgHex }}`
  - *التوصية:* استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.

### الملف: `src/components/puzzles/LogicPuzzlesView.tsx` (12 موضع)
- **السطر 436:** الخاصية `borderColor` بقيمة `item.color`
  - *الكود:* `style={{ borderColor: item.color }}`
  - *التوصية:* استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة.
- **السطر 438:** الخاصية `backgroundColor` بقيمة `item.color`
  - *الكود:* `style={{ backgroundColor: item.color }}`
  - *التوصية:* استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.
- **السطر 443:** الخاصية `borderColor` بقيمة `item.color`
  - *الكود:* `style={{ borderColor: item.color }}`
  - *التوصية:* استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة.
- **السطر 445:** الخاصية `backgroundColor` بقيمة `item.color`
  - *الكود:* `style={{ backgroundColor: item.color }}`
  - *التوصية:* استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.
- **السطر 450:** الخاصية `borderColor` بقيمة `item.color`
  - *الكود:* `style={{ borderColor: item.color }}`
  - *التوصية:* استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة.
- **السطر 452:** الخاصية `backgroundColor` بقيمة `item.color`
  - *الكود:* `style={{ backgroundColor: item.color }}`
  - *التوصية:* استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.
- **السطر 508:** الخاصية `borderColor` بقيمة `opt.color`
  - *الكود:* `style={{ borderColor: opt.color }}`
  - *التوصية:* استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة.
- **السطر 510:** الخاصية `backgroundColor` بقيمة `opt.color`
  - *الكود:* `style={{ backgroundColor: opt.color }}`
  - *التوصية:* استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.
- **السطر 514:** الخاصية `borderColor` بقيمة `opt.color`
  - *الكود:* `style={{ borderColor: opt.color }}`
  - *التوصية:* استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة.
- **السطر 516:** الخاصية `backgroundColor` بقيمة `opt.color`
  - *الكود:* `style={{ backgroundColor: opt.color }}`
  - *التوصية:* استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.
- **السطر 520:** الخاصية `borderColor` بقيمة `opt.color`
  - *الكود:* `style={{ borderColor: opt.color }}`
  - *التوصية:* استبدال لون الإطار المضمن بفئة border-nesma-border أو متغيرات CSS المعتمدة.
- **السطر 522:** الخاصية `backgroundColor` بقيمة `opt.color`
  - *الكود:* `style={{ backgroundColor: opt.color }}`
  - *التوصية:* استبدال الخلفية المضمنة بفئة Tailwind (مثل bg-nesma-cream أو bg-nesma-lightgreen) أو توكن تصميم مسبق الحساب.

## 3. إرشادات معايير WCAG AA والهوية البصرية الموحدة

- **نصوص التطبيق الأساسية:** يجب أن تستخدم اللون `#292F2D` على الخلفية `#F7F5EF` لضمان تباين 12.60:1 (أعلى بكثير من الحد الأدنى 4.5:1).
- **أخضر الغابة الأساسي:** `#174F3F` بنسبة تباين 8.69:1.
- **الأخضر الثانوي:** `#205746` بنسبة تباين 7.69:1.
- **العناصر المتغيرة في الألعاب:** يوصى بتحديد ألوانها مسبقاً ضمن لوحة ألوان التطبيق الرسمية أو حقن درجات لونية تضمن وضوح التباين على الدوام.
