const fs = require("fs");
const { isObject, isFunction } = require("../lib/utils");

// 获取index.js所处的这个目录下所有文件的所有方法, 汇集到一个对象中 
const methods = () => {
    let obj = {};
    fs.readdirSync(__dirname).forEach(file => {
        if (file === "index.js") {
            return;
        }
        const method = require(`./${file}`);
        if (isFunction(method)) {
            // name待优化
            let name = file.split('.')[0];
            obj[name] = method;
        }
        if (isObject(method)) {
            obj = { ...obj, ...method };
        }
    });
    return obj;
};
module.exports = methods()