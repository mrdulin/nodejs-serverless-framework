"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function helloGCSGeneric(event, callback) {
    var file = event.data;
    var context = event.context;
    console.log("Event " + context.eventId);
    console.log("  Event Type: " + context.eventType);
    console.log("  Bucket: " + file.bucket);
    console.log("  File: " + file.name);
    console.log("  Metageneration: " + file.metageneration);
    console.log("  Created: " + file.timeCreated);
    console.log("  Updated: " + file.updated);
    callback();
}
exports.helloGCSGeneric = helloGCSGeneric;
//# sourceMappingURL=index.js.map