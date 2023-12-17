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
const amplitudeBody = JSON.stringify(eventData);

let requestOptions = { headers: postHeaders, method: data.requestMethod };
let ip = "";

//Options
logToConsole("Amplitude Tag: Timeout");
if (data.timeout) {
    requestOptions.timeout = makeInteger(data.timeout);
}
logToConsole("Amplitude Tag: Headers");
const headers = data.headers;
if (headers) {
    headers.forEach(header => {
        logToConsole("Setting custom headers: " + JSON.stringify(header.key) + " : " + JSON.stringify(header.value));
        requestOptions.headers[header.key] = header.value;
    });
}


// set client Ip-address
logToConsole("Amplitude tag: IP");

if (!data.overrideIp) {

    ip = getRemoteAddress();
    logToConsole("Setting client Ip-address: " + ip);
    events.forEach(event => {
        event.ip = ip;
    });
}

// set custom Ip-address
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

sendHttpRequest(data.url, (statusCode, headers, body) => {


    if (statusCode >= 200 && statusCode < 300) {
        setResponseBody(body);
        data.gtmOnSuccess();
    } else {
        data.gtmOnFailure();
    }
}, requestOptions, amplitudeBody);

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