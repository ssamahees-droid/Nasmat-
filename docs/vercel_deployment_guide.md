# دليل النشر التلقائي على Vercel — مشروع «نسمة حياة»

يوفر هذا الدليل الخطوات اللازمة لربط مشروع **نسمة حياة** بمنصة **Vercel** ونشر أي تحديثات قادمة **تلقائيًا فور كل تعديل**.

---

## 1. بنية المشروع المتوافقة مع Vercel

المشروع مُهيأ بالفعل ومتوافق 100% مع معايير Vercel:
1. **ملف الإعدادات (`vercel.json`):**
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   *يتكفل بتوجيه كافة مسارات SPA و PWA إلى `index.html` لمنع خطأ 404 عند تحديث الصفحة.*

2. **أمر البناء ومجلد المخرجات:**
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

---

## 2. النشر التلقائي المستمر (CI/CD عبر GitHub / GitLab)

لجعل كل التحديثات تُنشر **تلقائيًا وبشكل فوري** دون أي تدخل يدوي:

### الخطوة الأولى: ربط الكود بمستودع Git
1. أنشئ مستودعاً جديداً على حسابك في GitHub (مثلاً: `nesma-hayat`).
2. ارفع كود المشروع إلى المستودع:
   ```bash
   git init
   git add .
   git commit -m "إطلاق التحديثات ومكتبة التثقيف النفسي"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```

### الخطوة الثانية: استيراد المشروع في Vercel
1. توجّه إلى [لوحة تحكم Vercel](https://vercel.com/dashboard) وسجّل الدخول.
2. اضغط على **Add New...** ثم اختر **Project**.
3. اختر مستودع Git الخاص بك (`nesma-hayat`) واضغط **Import**.
4. سيتعرف Vercel تلقائياً على أن المشروع مبني بـ **Vite**.

### الخطوة الثالثة: ضبط المتغيرات البيئية (Environment Variables) في Vercel
في صفحة الإعداد قبل الضغط على Deploy، افتح قسم **Environment Variables** وأضف المتغيرات العامة الخاصة بـ Firebase (من ملف `.env` أو لوحة تحكم Firebase):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

ثم اضغط **Deploy**.

---

## 3. كيف تعمل المزامنة التلقائية الآن؟
بمجرد ربط المستودع بـ Vercel:
- **أي `git push` لفرع `main`:** يقوم Vercel بتشغيل البناء ونشر التحديثات للإنتاج فوراً في غضون ثوانٍ قليلة.
- **أي Pull Request:** ينشئ Vercel رابط معاينة مخصص (Preview URL) لاختبار التعديلات قبل دمجها.

---

## 4. النشر الفوري المباشر عبر Vercel CLI (بديل سريع)
إذا كنت تفضل النشر المباشر عبر سطر الأوامر دون Git:
```bash
# تثبيت أداة Vercel
npm i -g vercel

# تسجيل الدخول
vercel login

# ربط المشروع ونشره
vercel --prod
```
