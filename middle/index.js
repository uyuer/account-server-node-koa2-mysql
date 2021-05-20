// const fs = require("fs");

// const middles = app => {
//     fs.readdirSync(__dirname).forEach(file => {
//         if (file === "index.js") {
//             return;
//         }
//         const middle = require(`./${file}`);
//         console.log(file, file.split('.')[0])
//         app.use(async (ctx, next) => {
//             ctx[file.split('.')[0]] = middle;
//             await next();
//         });
//     });
// };

// module.exports = middles

// const fs = require("fs");

// const middles = () => {
//     let obj = {};
//     fs.readdirSync(__dirname).forEach(file => {
//         if (file === "index.js") {
//             return;
//         }
//         const middle = require(`./${file}`);
//         // TODO: 待优化
//         let name = file.split('.')[0];
//         obj[name] = middle;
//     });
//     return obj;
// };

// module.exports = middles()

const arguments = require('./arguments');
const formatter = require('./formatter');
const logger = require('./logger');
const session = require('./session');
const token = require('./token');
const userinfo = require('./userinfo');
const valid = require('./valid');
const verifyUserStatus = require('./verifyUserStatus');

module.exports = {
    arguments,
    formatter,
    logger,
    session,
    token,
    userinfo,
    valid,
    verifyUserStatus,
}