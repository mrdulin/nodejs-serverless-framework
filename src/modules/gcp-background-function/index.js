'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function bk(event, callback) {
    var pubsubMessage = event.data;
    var name = pubsubMessage.data ? Buffer.from(pubsubMessage.data, 'base64').toString() : 'World';
    console.log("Hello, " + name + "!");
    callback();
}
exports.bk = bk;
//# sourceMappingURL=index.js.map