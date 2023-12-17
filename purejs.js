const sendHttpRequest = require('sendHttpRequest');
const getAllEventData = require('getAllEventData');
const makeInteger = require('makeInteger');
const makeTableMap = require('makeTableMap');
const JSON = require('JSON');
const logToConsole = require('logToConsole');
const getContainerVersion = require('getContainerVersion');
const containerVersion = getContainerVersion();
const isDebug = containerVersion.debugMode;
const logging = loggingEnabled();
const getRequestHeader = require('getRequestHeader');
const setResponseBody = require("setResponseBody");
const postHeaders = { 'Content-Type': 'application/json' };
const getRemoteAddress = require('getRemoteAddress');
let postBodyData = {};

const eventData = getAllEventData();
let events = eventData.events;
let amplitudeBody = eventData;

let requestOptions = { headers: postHeaders, method: data.requestMethod };
let ip = "";

//Options//

//Timeout
logToConsole("Amplitude Tag: Timeout");
if (data.timeout) {
    requestOptions.timeout = makeInteger(data.timeout);
} else {
    logToConsole("No timeout set");
}

//Headers
logToConsole("Amplitude Tag: Headers");
const headers = data.headers;
if (headers) {
    headers.forEach(header => {
        logToConsole("Setting custom headers: " + JSON.stringify(header.key) + " : " + JSON.stringify(header.value));
        requestOptions.headers[header.key] = header.value;
    });
} else {
    logToConsole("No custom headers found");
}


// Set client Ip-address
logToConsole("Amplitude tag: IP");
if (!data.overrideIp) {

    ip = getRemoteAddress();
    logToConsole("Setting client Ip-address: " + ip);
    events.forEach(event => {
        event.ip = ip;
    });
}

// Set custom Ip-address
if (data.ipOverride) {
    events.forEach(event => {
        event.ip = ip;
    });
    logToConsole("Setting custom Ip-address: " + data.ipOverride);
}
// Else use the default Ip-address

if (logging) {
    logToConsole("Amplitude Request Body: " + amplitudeBody);
}

// Event data
logToConsole("Amplitude Tag: Event data");
const eventProperties = data.eventProperties;
if (eventProperties) {
    events.forEach(event => {
        eventProperties.forEach(property => {
            logToConsole("Setting event property: " + JSON.stringify(property.key) + " : " + JSON.stringify(property.value));
            event.event_properties[property.key] = property.value;
        });

    });
} else {
    logToConsole("No event properties found");
}

amplitudeBody.events = events;
sendHttpRequest(data.url, (statusCode, headers, body) => {


    if (statusCode >= 200 && statusCode < 300) {
        setResponseBody(body);
        data.gtmOnSuccess();
    } else {
        data.gtmOnFailure();
    }
}, requestOptions, JSON.stringify(amplitudeBody));

function loggingEnabled() {
    if (!data.logType) {
        return isDebug;
    }

    if (data.logType === 'no') {
        return false;
    }

    if (data.logType === 'debug') {
        return isDebug;
    }

    return data.logType === 'always';
}