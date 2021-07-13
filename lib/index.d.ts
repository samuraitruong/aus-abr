import { ISearchItem, IBusinessName, IABNDetail } from "./intefaces";
/**
 * Get current details for giving abn
 * @param abn the particular abn/acn to get information
 */
export declare function lookupABN(abn: string): Promise<{
    details: IABNDetail;
    tradingNames: IBusinessName[];
    businessNames: IBusinessName[];
}>;
export declare function getHistory(abn: string): Promise<any>;
/**
 * Find list of all business name or entity name that match with the input keywork
 * @param keyword entity name or business name to search
 * @returns {ISearchItem[]} list of all business that match with condition search
 */
export declare function searchActive(keyword: string): Promise<ISearchItem[]>;
