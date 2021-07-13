"use strict";
exports.__esModule = true;
exports.readTableWithHeader = exports.readTable = exports.getFieldName = void 0;
var locationValue = function (location) {
    var _a = location.split(" ").filter(function (x) { return x != " "; }), state = _a[0], postcode = _a[1];
    return { state: state, postcode: parseInt(postcode) };
};
var removeText = function (replace) {
    return function (input) {
        var replaceText = input.replace(replace, "");
        return replaceText.trim();
    };
};
var locationValue1 = function (location) {
    var _a = location.split(" ").filter(function (x) { return x != ""; }), postcode = _a[0], state = _a[1];
    return { state: state, postcode: parseInt(postcode) };
};
var statusValue = function (statusText) {
    var _a = statusText.replace(" from ", "|").split("|"), status = _a[0], from = _a[1];
    return {
        statusText: statusText,
        status: status === statusText ? "unregistered" : status,
        from: from
    };
};
var fieldMapping = {
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
    abn: [{ header: "ABN", transformValue: removeText("Active") }]
};
function getFieldName(header) {
    var _a;
    var replacedHeader = header.replace(":", "");
    var entries = Object.entries(fieldMapping);
    var defaultValue = function (v) { return v; };
    var output;
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _b = entries_1[_i], key = _b[0], value = _b[1];
        var filtered = value.find(function (x) { return x.header.toLocaleLowerCase() === replacedHeader.toLocaleLowerCase(); });
        if (filtered) {
            output = { key: key, value: (_a = filtered.transformValue) !== null && _a !== void 0 ? _a : defaultValue };
            break;
        }
    }
    return output || { key: header, value: defaultValue };
}
exports.getFieldName = getFieldName;
function readTable($, table) {
    var rows = $("tr", table).toArray();
    var text = function (el) { return $(el).text().trim(); };
    var result = {};
    rows.forEach(function (row) {
        var tds = $("td, th", row);
        var mapping = getFieldName(text(tds[0]));
        result[mapping.key] = mapping.value(text(tds[1]));
    });
    return result;
}
exports.readTable = readTable;
function readTableWithHeader($, table, headerIndex) {
    if (headerIndex === void 0) { headerIndex = 0; }
    if (!table)
        return [];
    var rows = $("tr", table).toArray();
    var headers = $("td,th", rows[headerIndex])
        .toArray()
        .map(function (td) { return getFieldName($(td).text().trim()); });
    return rows.slice(headerIndex + 1).map(function (row) {
        var item = {};
        $("td", row)
            .toArray()
            .forEach(function (td, index) {
            item[headers[index].key] = headers[index].value($(td).text().trim());
        });
        return item;
    });
}
exports.readTableWithHeader = readTableWithHeader;
//# sourceMappingURL=helper.js.map