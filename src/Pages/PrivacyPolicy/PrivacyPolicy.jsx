import style from "./PrivacyPolicy.module.scss";
import { Link } from "react-router-dom";
import Copyright from "../../Components/Copyright";

export default function PrivacyPolicy() {
  return (
    <div className={style.container} dir="rtl">
      <div className={style.box}>
        <h1>سياسة الخصوصية</h1>

        <h6>
          سياسة الخصوصية لـ <Link to="/">Noter</Link>
        </h6>
        <h6>تاريخ السريان: 1/8/2024</h6>
        <br />
        <h3>المقدمة:</h3>
        <h6>
          تلتزم Noter ("نحن" أو "لنا" أو "خاصتنا") بحماية خصوصيتك. تشرح سياسة
          الخصوصية هذه كيفية جمع معلوماتك واستخدامها والكشف عنها وحمايتها عند
          استخدامك لتطبيقنا الذي يتكامل مع واجهة برمجة تطبيقات جوجل شيتس (Google
          Sheets API).
        </h6>
        <br />
        <h3>المعلومات التي نجمعها:</h3>
        <h6>عند استخدامك لتطبيقنا، قد نجمع الأنواع التالية من المعلومات:</h6>
        <ul>
          <li>
            <b>المعلومات الشخصية:</b> قد نطلب الوصول إلى حساب جوجل الخاص بك
            لإنشاء وإدارة جداول بيانات جوجل نيابةً عنك. قد تشمل هذه المعلومات
            اسمك، عنوان بريدك الإلكتروني، وأي معلومات أخرى تقدمها خلال عملية
            المصادقة.
          </li>

          <li>
            <b>بيانات الاستخدام:</b> قد نجمع معلومات حول كيفية استخدامك
            لتطبيقنا، بما في ذلك روابط جداول البيانات التي تنشئها والميزات التي
            تصل إليها ومدة الوقت التي تقضيها في التطبيق.
          </li>
        </ul>

        <br />

        <h3>كيفية استخدام معلوماتك:</h3>
        <h6>نستخدم المعلومات التي نجمعها للأغراض التالية:</h6>

        <ul>
          <li>لإنشاء وإدارة جداول بيانات جوجل في حسابك.</li>
          <li>
            لمشاركة جداول بيانات جوجل مع مستخدمين آخرين، فقط بعد أن تقدم
            موافقتك.
          </li>
          <li>لتحسين تطبيقنا وتعزيز تجربة المستخدم.</li>
        </ul>
        <br />

        <h3>مشاركة معلوماتك:</h3>
        <h6>
          لا نقوم ببيع أو تبادل أو نقل معلوماتك الشخصية إلى أطراف خارجية دون
          موافقتك، باستثناء ما يقتضيه القانون أو لحماية حقوقنا. قد نشارك
          معلوماتك مع:
        </h6>

        <h6>
          نستخدم واجهة برمجة تطبيقات جوجل شيتس لإنشاء وإدارة الجداول في حسابك.
          قد تتم معالجة بياناتك بواسطة جوجل وفقًا لسياسة الخصوصية الخاصة بهم.
        </h6>
        <br />
        <h3>أمان البيانات:</h3>
        <h6>
          نقوم بتنفيذ مجموعة متنوعة من تدابير الأمان للحفاظ على سلامة معلوماتك
          الشخصية. ومع ذلك، لا توجد طريقة لنقل المعلومات عبر الإنترنت أو طريقة
          للتخزين الإلكتروني آمنة بنسبة 100%. لذلك، بينما نسعى جاهدين لاستخدام
          وسائل مقبولة تجاريًا لحماية معلوماتك الشخصية، لا يمكننا ضمان أمانها
          المطلق.
        </h6>
        <br />

        <h3>حقوقك:</h3>
        <h6>لديك الحق في:</h6>
        <ul>
          <li>الوصول إلى المعلومات الشخصية التي نحتفظ بها عنك.</li>
          <li>طلب تصحيح أي معلومات شخصية غير دقيقة.</li>
          <li>طلب حذف معلوماتك الشخصية، مع مراعاة بعض الاستثناءات.</li>
        </ul>
        <br />

        <h3>التغييرات على سياسة الخصوصية هذه:</h3>
        <h6>
          قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنقوم بإخطارك
          بأي تغييرات من خلال نشر سياسة الخصوصية الجديدة على هذه الصفحة. يُنصح
          بمراجعة سياسة الخصوصية هذه بشكل دوري لأي تغييرات.
        </h6>
        <br />

        <h3>الموافقة:</h3>
        <h6>
          من خلال استخدامك لتطبيقنا، فإنك توافق على سياسة الخصوصية هذه وبنود
          الخدمة الخاصة بنا. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام
          التطبيق.
        </h6>
        <br />

        <h3>سياسة الأطفال:</h3>
        <h6>
          نحن لا نجمع عمدًا معلومات شخصية من الأطفال دون سن 13 عامًا. إذا كنت
          والدًا أو وصيًا وكنت تعتقد أن طفلك قد قدم لنا معلومات شخصية، يرجى
          الاتصال بنا. سنقوم بإزالة هذه المعلومات من سجلاتنا في أقرب وقت ممكن.
        </h6>
        <br />

        <h3>اتصل بنا:</h3>
        <h6>
          إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى{" "}
          <a href="mailto:arabsservices@gmail.com">الاتصال بنا</a>
        </h6>

        <div
          style={{
            marginTop: "24px",
            width: "100%",
          }}
        >
          <Copyright />
        </div>
      </div>
    </div>
  );
}
