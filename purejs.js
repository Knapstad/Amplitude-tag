const sendHttpRequest = require('sendHttpRequest');
const getAllEventData = require('getAllEventData');
const makeInteger = require('makeInteger');
const makeTableMap = require('makeTableMap');
const JSON = require('JSON');
const getRequestHeader = require('getRequestHeader');
const logToConsole = require('logToConsole');
const getContainerVersion = require('getContainerVersion');
const containerVersion = getContainerVersion();
const isDebug = containerVersion.debugMode;
const logging = loggingEnabled();
const setResponseBody = require("setResponseBody");
const postHeaders = { 'Content-Type': 'application/json' };
const getRemoteAddress = require('getRemoteAddress');
let postBodyData = {};

const eventData = getAllEventData();
const amplitudeBody = JSON.stringify(eventData);

let requestOptions = { headers: postHeaders, method: data.requestMethod };

if (data.timeout) {
    requestOptions.timeout = makeInteger(data.timeout);
}
if (!data.overrideIp) {
    const ip = getRemoteAddress();
    eventData.ip = ip;
}

if (data.ipOverride) {
    eventData.ip = data.ipOverride;
}

if (logging) {
    logToConsole("Amplitude Request Body: " + amplitudeBody);
}
//dette er en endring

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