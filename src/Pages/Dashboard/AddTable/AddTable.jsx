import style from "./AddTable.module.scss";
import { L10n, registerLicense } from "@syncfusion/ej2-base";
import {
  SpreadsheetComponent,
  SheetsDirective,
  SheetDirective,
  RangesDirective,
  RangeDirective,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-spreadsheet";

import { defaultData } from "./data";


L10n.load({
  "ar-AE": {
    spreadsheet: {
      File: "ملف",
      Home: "هم",
      Insert: "إدراج",
      Formulas: "الصيغ",
      View: "معاينة",
      Data: "البيانات",
      Cut: "قطع",
      Copy: "نسخ",
      Paste: "معجون",
      PasteSpecial: "لصق خاص",
      All: "جميع",
      Values: "القيم",
      Formats: "شكل",
      Font: "الخط",
      FontSize: "حجم الخط",
      Bold: "جريء",
      Italic: "مائل",
      Underline: "أكد",
      Strikethrough: "يتوسطه",
      TextColor: "لون الخط",
      FillColor: "لون التعبئة",
      HorizontalAlignment: "المحاذاة الأفقية",
      AlignLeft: "محاذاة إلى اليسار",
      AlignCenter: "مركز",
      AlignRight: "محاذاة إلى اليمين",
      VerticalAlignment: "محاذاة عمودية",
      AlignTop: "محاذاة أعلى",
      AlignMiddle: "محاذاة الأوسط",
      AlignBottom: "أسفل محاذاة",
      InsertFunction: "إدراج وظيفة",
      Delete: "حذف",
      Rename: "إعادة تسمية",
      Hide: "إخفاء",
      Unhide: "ظهار",
    },
  },
});



registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhOYVB3WmFZfVpgdl9FZ1ZSQ2Y/P1ZhSXxXdkJhXX5ac3NWQWJZVEc="
);

export default function AddTable() {
  return (
    <div dir="rtl" className={style.container}>
      <SpreadsheetComponent
        // locale="ar-AE"
        enableRtl={true}
        allowOpen={false}
        openUrl="https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open"
        allowSave={true}
        saveUrl="https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save"
      >
        <SheetsDirective>
          <SheetDirective>
            <RangesDirective>
              <RangeDirective dataSource={defaultData}></RangeDirective>
            </RangesDirective>
          </SheetDirective>
        </SheetsDirective>
      </SpreadsheetComponent>
    </div>
  );
}
