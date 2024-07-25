import style from "./AddTable.module.scss";
import { HotTable, HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { registerLanguageDictionary, arAR } from "handsontable/i18n";
import { data } from "./constants.js";
import { addClassesToRows, alignHeaders } from "./hooksCallbacks.js";

registerLanguageDictionary(arAR);

export default function AddTable() {
  return (
    <div dir="rtl" className={style.container}>
      <HotTable
        language={arAR.languageCode}
        data={data}
        colHeaders={[
          "Company name",
          "Country",
          "Name",
          "Sell date",
          "Order ID",
          "In stock",
          "Qty",
        ]}
        multiColumnSorting={false}
        autoWrapCol={true}
        autoWrapRow={true}
        afterGetColHeader={alignHeaders}
        beforeRenderer={addClassesToRows}
        className="cell-font"
        dropdownMenu={[
          "col_right",
          "---------",
          "col_left",
          "---------",
          "remove_col",
        ]}
        contextMenu={[
          "row_above",
          "---------",
          "row_below",
          "---------",
          "remove_row",
        ]}
        manualColumnMove={true}
        manualRowMove={true}
        height="auto"
        // contextMenu={true}
        // dropdownMenu={true}
        rowHeaders={true}
        filters={false}
        maxCols={30}
        maxRows={100}
        mergeCells={false}
        mergeRows={false}
        licenseKey="non-commercial-and-evaluation"
      >
        <HotColumn data={1} />
        <HotColumn data={2} />
        <HotColumn data={3} />
        <HotColumn data={4} type="date" allowInvalid={false} />
        <HotColumn data={5} />
        <HotColumn data={6} type="checkbox" className="htCenter" />
        <HotColumn data={7} type="numeric" />
      </HotTable>
    </div>
  );
}
