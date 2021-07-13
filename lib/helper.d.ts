import "cheerio";
export declare function getFieldName(header: string): any;
export declare function readTable($: cheerio.Selector, table: cheerio.Element): any;
export declare function readTableWithHeader($: cheerio.Selector, table: cheerio.Element, headerIndex?: number): any[];
