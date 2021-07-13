import * as cheerio from "cheerio";
export declare function getFieldName(header: string): any;
export declare function readTable<T>($: cheerio.CheerioAPI, table: cheerio.Element): T;
export declare function readTableWithHeader<T>($: cheerio.CheerioAPI, table: cheerio.Element, headerIndex?: number): T[];
