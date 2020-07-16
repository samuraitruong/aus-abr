import "cheerio";
const locationValue = (location: string) => {
  const [state, postcode] = location.split(" ").filter((x) => x != " ");
  return { state, postcode: parseInt(postcode) };
};

const removeText = (replace: string) => {
  return (input: string) => {
    const replaceText = input.replace(replace, "");
    return replaceText.trim();
  };
};
const locationValue1 = (location: string) => {
  const [postcode, state] = location.split(" ").filter((x) => x != "");
  return { state, postcode: parseInt(postcode) };
};

const statusValue = (statusText: string) => {
  const [status, from] = statusText.replace(" from ", "|").split("|");
  return {
    statusText,
    status: status === statusText ? "unregistered" : status,
    from,
  };
};
const fieldMapping = {
  entityName: [{ header: "Entity name" }],
  abnStatus: [{ header: "ABN status", transformValue: statusValue }],
  entityType: [{ header: "Entity type" }],
  gstStatus: [
    { header: "Goods & Services Tax (GST)", transformValue: statusValue },
  ],
  businessLocation: [
    { header: "Main business location", transformValue: locationValue },
    { header: "Location", transformValue: locationValue1 },
  ],
  tradingName: [{ header: "Trading name" }],
  businessName: [{ header: "Business name" }],
  from: [{ header: "From" }],
  name: [{ header: "Name" }],
  type: [{ header: "Type" }],
  abn: [{ header: "ABN", transformValue: removeText("Active") }],
};
export function getFieldName(header: string) {
  const replacedHader = header.replace(":", "");
  const entries = Object.entries(fieldMapping);
  const defaultValue = (v) => v;
  let output;
  for (const [key, value] of entries) {
    const filtered = value.find(
      (x) => x.header.toLocaleLowerCase() === replacedHader.toLocaleLowerCase()
    );
    if (filtered) {
      output = { key, value: (filtered as any).transformValue ?? defaultValue };
      break;
    }
  }
  return output || { key: header, value: defaultValue };
}

export function readTable($: CheerioStatic, table: CheerioElement) {
  const rows = $("tr", table).toArray();
  const text = (el) => $(el).text().trim();

  const result: any = {};
  rows.forEach((row) => {
    const tds = $("td, th", row);
    const mapping = getFieldName(text(tds[0]));
    result[mapping.key] = mapping.value(text(tds[1]));
  });
  return result;
}

export function readTableWithHeader(
  $: CheerioStatic,
  table: CheerioElement,
  headerIndex = 0 
) {
  if (!table) return [];

  const rows = $("tr", table).toArray();
  const headers = $("td,th", rows[headerIndex])
    .toArray()
    .map((td) => getFieldName($(td).text().trim()));
  return rows.slice(headerIndex + 1).map((row) => {
    const item: any = {};
    const tds = $("td", row)
      .toArray()
      .forEach((td, index) => {
        item[headers[index].key] = headers[index].value($(td).text().trim());
      });
    return item;
  });
}
