import axios from "axios";
import cheerio from "cheerio";
import { readTable, readTableWithHeader, getFieldName } from "./helper";
import { TableNames } from "./enum";
import { ISearchItem, IBusinessName, IABNDetail } from "./intefaces";

async function fetch(url) {
  const resposne = await axios.get(url);
  const $ = cheerio.load(resposne.data);
  const tables = $("table").toArray();
  const parseTable = tables.reduce((current, table) => {
    const caption = $("caption", table).text().trim();
    current[caption.replace(" help", "")] = table;
    return current;
  }, {});

  return { $, tables, parseTable };
}

/**
 * Get current details for giving abn
 * @param abn the particular abn/acn to get information
 */
export async function lookupABN(abn: string) {
  const stripped = abn.replace(/\s/gi, "");
  const url = `https://abr.business.gov.au/ABN/View?id=${stripped}`;
  // https://connectonline.asic.gov.au/RegistrySearch/faces/landing/panelSearch.jspx?searchText=006912563&searchType=OrgAndBusNm&_adf.ctrl-state=10fzl38u1j_40
  const { $, parseTable } = await fetch(url);
  if (!parseTable[TableNames.ABN_DETAILS]) {
    return null;
  }
  return {
    details: readTable<IABNDetail>($, parseTable[TableNames.ABN_DETAILS]),
    tradingNames: readTableWithHeader<IBusinessName>(
      $,
      parseTable[TableNames.TRADING_NAME],
      1
    ),
    businessNames: readTableWithHeader<IBusinessName>(
      $,
      parseTable[TableNames.BUSINESS_NAME]
    ),
  };
}

export async function getHistory(abn: string) {
  const stripped = abn.replace(/\s/gi, "");
  const url = `https://abr.business.gov.au/AbnHistory/View?id=${stripped}`;

  const { parseTable, $ } = await fetch(url);
  if (!parseTable[TableNames.ABN_DETAILS]) {
    return null;
  }

  const result: any = {};
  const trs = $("tr").toArray();
  let keyName = "";
  trs.forEach((tr) => {
    const th = $("th", tr).toArray();
    if (th.length > 0) {
      keyName = getFieldName($(th[0]).text().trim()).key;
      result[keyName] = result[keyName] || [];
    }
    const td = $("td", tr).toArray();
    if (td.length > 0) {
      result[keyName].push({
        value: $(td[0]).text().trim(),
        from: $(td[1]).text().trim(),
        to: $(td[2]).text().trim(),
      });
    }
  });
  return result;
}

/**
 * Find list of all business name or entity name that match with the input keywork
 * @param keyword entty name or business name to search
 * @returns {ISearchItem[]} list of all business that match with condition search
 */
export async function searchActive(keyword: string) {
  const url = `https://abr.business.gov.au/Search/ResultsActive?SearchText=${decodeURIComponent(
    keyword
  )}`;
  const { $, parseTable } = await fetch(url);

  return readTableWithHeader<ISearchItem>($, parseTable["Matching names"]);
}
