export declare function lookupABN(abn: string): Promise<{
    details: any;
    tradingNames: any[];
    businessNames: any[];
}>;
export declare function getHistory(abn: string): Promise<any>;
export declare function searchActive(keyword: string): Promise<any[]>;
