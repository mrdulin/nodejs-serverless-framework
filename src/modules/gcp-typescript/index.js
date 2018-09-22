'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_1 = __importDefault(require("request-promise"));
var api = 'http://it-ebooks-api.info/v1';
function searchBook(req, res) {
    var _a = req.body, _b = _a.query, query = _b === void 0 ? '' : _b, _c = _a.page, page = _c === void 0 ? 1 : _c;
    var uri = api + "/search/" + query + "/page/" + page;
    console.log('uri: ', uri);
    var options = {
        uri: uri,
        json: true
    };
    request_promise_1.default(options)
        .then(function (data) {
        var error = data.Error, total = data.Total, books = data.Books;
        if (error !== '0') {
            return Promise.reject(error);
        }
        return Promise.resolve({ total: total, books: books });
    })
        .then(function (data) {
        console.log('Search Books Successfully');
        res.json(data);
    })
        .catch(function (err) {
        var msg;
        if (err instanceof Error) {
            console.error(err);
            msg = err.message;
        }
        else {
            console.error(new Error(err));
            msg = err;
        }
        res.status(500).send(msg);
    });
}
exports.searchBook = searchBook;
//# sourceMappingURL=index.js.map