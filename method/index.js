const allowedFind = require('./allowedFind');
const apiFormatter = require('./apiFormatter');
const getTable = require('./getTable');
const userPrivate = require('./userPrivate');
const verify = require('./verify');
const verifyUserStatus = require('./verifyUserStatus');

module.exports = {
    ...allowedFind,
    ...apiFormatter,
    ...getTable,
    ...userPrivate,
    ...verify,
    ...verifyUserStatus,
}