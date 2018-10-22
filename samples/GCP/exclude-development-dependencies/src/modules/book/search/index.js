"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var services_1 = require("../../../services");
var IT_EBOOKS_API = process.env.IT_EBOOKS_API;
var itebookService = new services_1.ItEbookService(IT_EBOOKS_API);
function search(req, res) {
    console.log('process.env', process.env);
    if (!IT_EBOOKS_API) {
        var errMsg = 'process.env.IT_EBOOKS_API is required';
        console.error(errMsg);
        return res.status(500).send(errMsg);
    }
    var _a = req.body, _b = _a.query, query = _b === void 0 ? '' : _b, _c = _a.page, page = _c === void 0 ? 1 : _c;
    itebookService
        .search(query, page)
        .then(function (data) {
        res.json(data);
    })
        .catch(function (msg) {
        res.status(500).send(msg);
    });
}
exports.search = search;
//# sourceMappingURL=index.js.map