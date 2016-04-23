/**
 * Created by kevingu on 4/22/16.
 */

var status = {};
status.ERROR = "error";
status.SUCCESS = "success";
status.FAIL = "fail";

var failMessages = {};
failMessages.INCORRECT_PASSWORD_USERNAME = "Incorrect email/password";
failMessages.USERNAME_TAKEN = "User already exists";
failMessages.TOKEN_EXPIRED = "Expired Token";
failMessages.NO_TOKEN = "No Token";

exports.status = status;
exports.failedMessages = failMessages;