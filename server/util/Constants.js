/**
 * Created by kevingu on 4/22/16.
 */

var status = {};
status.ERROR = "error";
status.SUCCESS = "success";
status.FAIL = "fail";

var successMessages={};
successMessages.OK = "OK";

var failedMessages = {};
failedMessages.INCORRECT_PASSWORD_USERNAME = "Incorrect email/password";
failedMessages.USERNAME_TAKEN = "User already exists";
failedMessages.TOKEN_EXPIRED = "Expired Token";
failedMessages.NO_TOKEN = "No Token";
failedMessages.MISSING_FIELDS = "Missing Fields";
failedMessages.WRONG_ACCESS_TOKEN = "The provided access_token is invalid";
failedMessages.CAN_NOT_FIND_ID = "The provided id is invalid";

exports.status = status;
exports.failedMessages = failedMessages;
exports.successMessages = successMessages;