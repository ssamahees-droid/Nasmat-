# وثيقة معمارية الربط السحابي — الخطوة 1 (محدثة)
## مشروع «نسمة الحياة» (Web PWA + Android Native)

---

### 1. المخطط المعتمد لقاعدة بيانات Firestore (`firebase-blueprint.json`)

تم اعتماد هيكل بيانات موحد يلبي احتياجات نسخة Android (Room SQLite) ونسخة Web (localStorage / IndexedDB) دون إحداث أي خلل في العمل المستقل دون إنترنت:

#### المجموعات الرئيسية (Collections):
1. **`/users/{userId}`**:
   * يحتوي على ملف المستخدم: `uid`, `displayName`, `email`, `role` (`user` | `admin` | `therapist` | `anonymous`), `themePreference`, `createdAt`.
2. **`/users/{userId}/favorites/{favoriteId}`**:
   * المفضلة الخاصة بكل مستخدم (قصص، مقالات، ورش عمل، تمارين).
3. **`/users/{userId}/assessments/{assessmentId}`**:
   * نتائج الاختبارات النفسية (PHQ-9، GAD-7، استكشاف الذات)، والدرجة الكلية والتوصية وتاريخ الإجراء.
4. **`/users/{userId}/journey/{journeyId}`**:
   * تقدم رحلة التعافي والمراحل المكتملة وملاحظات المستخدم الخاصة.
5. **`/users/{userId}/thoughts/{thoughtId}`**:
   * بطاقات تفكيك الأفكار وتعديل التشوهات الإدراكية (من وحدة «فكّر» / العلاج المعرفي السلوكي CBT).
6. **`/support_requests/{requestId}`**:
   * طلبات الدعم النفسي والاستغاثة، مربوطة بـ `userId` وصاحب الطلب فقط هو من يرى طلبه، مع صلاحيات كاملة لفريق الدعم (Admins/Therapists).
7. **`/content/{contentId}`**:
   * المحتوى المركزي المشترك (ورش، قصص، تحديات، تمارين) متاح للقراءة العامة، والتعديل للمشرفين فقط.
8. **`/users/{userId}/sync_journal/{syncId}`**:
   * سجل التغييرات المتزايدة (Sync Journal) لحل تعارض البيانات بين Room في أندرويد و PWA في الويب.

---

### 2. معمارية الأمان والصلاحيات الموثوقة (Zero-Trust Server-Authoritative RBAC)

#### المعايير الأمنية الصارمة:
1. **انعدام أي بريد إلكتروني في كود الواجهة:**
   * تم حذف أي مقارنة بريد إلكتروني في Frontend نهائياً. لا توجد أي مصفوفة أو متغير للمشرفين في كود العميل.
2. **منح الصلاحيات حصراً عبر Firebase Custom Claims (Server-Side):**
   * تُمنح صلاحيات `admin` أو `therapist/specialist` من طرف الخادم الموثوق (عبر Firebase Admin SDK أو Cloud Function مخصصة) من خلال الدالة:
     ```typescript
     admin.auth().setCustomUserClaims(targetUid, { role: 'admin' });
     ```
   * يتم التحقق منها تشفيرياً داخل `firestore.rules` بواسطة:
     ```
     request.auth.token.role == 'admin' || request.auth.token.admin == true
     ```
3. **منع تصعيد الصلاحيات (Privilege Escalation Protection):**
   * القواعد تمنع العميل (سواء كان زائراً أو مستخدماً عادياً) من إنشاء أي مستند بدور أعلى من `user` أو `anonymous`.
   * في عمليات التحديث (`update`)، تمنع القواعد تعديل الحقول الحساسة:
     ```
     !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isAdmin', 'admin', 'permissions'])
     ```

---

### 3. تصور نظام المصادقة وربط الحسابات (Anonymous-First & Account Linking)

* **المرحلة التمهيدية (Guest / Anonymous First):**
  * يدخل المستخدم فوراً دون إجباره على تسجيل الدخول، ويحصل على جلسة `signInAnonymously()` لربط بياناته محلياً وسحابياً دون كشف هويته، مما يحافظ على خصوصية الدعم النفسي.
* **الترقية إلى حساب دائم (Account Linking):**
  * عندما يرغب المستخدم في مزامنة بياناته بين هاتفه (أندرويد) ومتصفحه (الويب)، يمكنه اختيار "ربط الحساب" عبر Google (`linkWithPopup`) أو البريد الإلكتروني (`linkWithCredential`).
  * **الضمان الأمني والبيانات:** يحتفظ المستخدم بنفس الـ `UID` الأصلي، مما يضمن بقاء جميع سجلاته ومفضلته وتقييماته دون فقدان أي بيانات سابقة.

---

### 4. استراتيجية العمل دون إنترنت (Offline-First Strategy)

1. **في نسخة الويب (Web / PWA):**
   * الاستمرار في الاعتماد على `localStorage` و `initialData.ts` للعمل الفوري بدون أي تأخير.
   * تفعيل `persistentLocalCache` مع `persistentMultipleTabManager` في Firestore Web SDK عبر IndexedDB.
2. **في نسخة Android Native:**
   * تبقى قاعدة بيانات **Room SQLite** هي الـ Single Source of Truth للواجهات المحلية.
   * تُبنى طبقة `SyncManager` باستخدام `WorkManager` لرفع وتنزيل التحديثات في الخلفية عند توفر الاتصال.
