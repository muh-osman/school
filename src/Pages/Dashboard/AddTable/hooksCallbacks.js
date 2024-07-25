import Handsontable from "handsontable";
import { ODD_ROW_CLASS } from "./constants";

const headerAlignments = new Map([
  ["9", "htCenter"],
  ["10", "htRight"],
  ["12", "htCenter"]
]);

const addClassesToRows = (TD, row, column, prop, value, cellProperties) => {
  if (column !== 0) {
    return;
  }

  const parentElement = TD.parentElement;

  if (parentElement === null) {
    return;
  }

  if (row % 2 === 0) {
    Handsontable.dom.addClass(parentElement, ODD_ROW_CLASS);
  } else {
    Handsontable.dom.removeClass(parentElement, ODD_ROW_CLASS);
  }
};

const drawCheckboxInRowHeaders = function(row, TH) {
  const input = document.createElement("input");
  input.type = "checkbox";

  if (row >= 0 && this.getDataAtRowProp(row, "0")) {
    input.checked = true;
  }

  Handsontable.dom.empty(TH);
  TH.appendChild(input);
};

function alignHeaders(column, TH) {
  if (column < 0) {
    return;
  }

  if (TH.firstChild) {
    const alignmentClass = this.isRtl() ? "htRight" : "htLeft";

    if (headerAlignments.has(column.toString())) {
      Handsontable.dom.removeClass(TH.firstChild, alignmentClass);
      Handsontable.dom.addClass(
        TH.firstChild,
        headerAlignments.get(column.toString())
      );
    } else {
      Handsontable.dom.addClass(TH.firstChild, alignmentClass);
    }
  }
}

const changeCheckboxCell = function(event, coords) {
  const target = event.target;

  if (coords.col === -1 && event.target && target.nodeName === "INPUT") {
    event.preventDefault();
    this.setDataAtRowProp(coords.row, "0", !target.checked);
  }
};

export {
  addClassesToRows,
  drawCheckboxInRowHeaders,
  alignHeaders,
  changeCheckboxCell
};
