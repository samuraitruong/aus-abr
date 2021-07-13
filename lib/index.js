"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.searchActive = exports.getHistory = exports.lookupABN = void 0;
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
var helper_1 = require("./helper");
var enum_1 = require("./enum");
function fetch(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, $, tables, parseTable;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(url)];
                case 1:
                    response = _a.sent();
                    $ = cheerio_1["default"].load(response.data);
                    tables = $("table").toArray();
                    parseTable = tables.reduce(function (current, table) {
                        var caption = $("caption", table).text().trim();
                        current[caption.replace(" help", "")] = table;
                        return current;
                    }, {});
                    return [2 /*return*/, { $: $, tables: tables, parseTable: parseTable }];
            }
        });
    });
}
/**
 * Get current details for giving abn
 * @param abn the particular abn/acn to get information
 */
function lookupABN(abn) {
    return __awaiter(this, void 0, void 0, function () {
        var stripped, url, _a, $, parseTable;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    stripped = abn.replace(/\s/gi, "");
                    url = "https://abr.business.gov.au/ABN/View?id=" + stripped;
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    _a = _b.sent(), $ = _a.$, parseTable = _a.parseTable;
                    if (!parseTable[enum_1.TableNames.ABN_DETAILS]) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, {
                            details: helper_1.readTable($, parseTable[enum_1.TableNames.ABN_DETAILS]),
                            tradingNames: helper_1.readTableWithHeader($, parseTable[enum_1.TableNames.TRADING_NAME], 1),
                            businessNames: helper_1.readTableWithHeader($, parseTable[enum_1.TableNames.BUSINESS_NAME])
                        }];
            }
        });
    });
}
exports.lookupABN = lookupABN;
function getHistory(abn) {
    return __awaiter(this, void 0, void 0, function () {
        var stripped, url, _a, parseTable, $, result, trs, keyName;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    stripped = abn.replace(/\s/gi, "");
                    url = "https://abr.business.gov.au/AbnHistory/View?id=" + stripped;
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    _a = _b.sent(), parseTable = _a.parseTable, $ = _a.$;
                    if (!parseTable[enum_1.TableNames.ABN_DETAILS]) {
                        return [2 /*return*/, null];
                    }
                    result = {};
                    trs = $("tr").toArray();
                    keyName = "";
                    trs.forEach(function (tr) {
                        var th = $("th", tr).toArray();
                        if (th.length > 0) {
                            keyName = helper_1.getFieldName($(th[0]).text().trim()).key;
                            result[keyName] = result[keyName] || [];
                        }
                        var td = $("td", tr).toArray();
                        if (td.length > 0) {
                            result[keyName].push({
                                value: $(td[0]).text().trim(),
                                from: $(td[1]).text().trim(),
                                to: $(td[2]).text().trim()
                            });
                        }
                    });
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.getHistory = getHistory;
/**
 * Find list of all business name or entity name that match with the input keywork
 * @param keyword entity name or business name to search
 * @returns {ISearchItem[]} list of all business that match with condition search
 */
function searchActive(keyword) {
    return __awaiter(this, void 0, void 0, function () {
        var url, _a, $, parseTable;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    url = "https://abr.business.gov.au/Search/ResultsActive?SearchText=" + decodeURIComponent(keyword);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    _a = _b.sent(), $ = _a.$, parseTable = _a.parseTable;
                    return [2 /*return*/, helper_1.readTableWithHeader($, parseTable["Matching names"])];
            }
        });
    });
}
exports.searchActive = searchActive;
//# sourceMappingURL=index.js.map