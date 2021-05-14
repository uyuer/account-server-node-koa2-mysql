const path = require("path");
const { confirmPath } = require('./../lib/utils');

// uploads根目录
// __dirname 当前执行文件目录
// ./ 项目根目录
const baseUploadsPath = path.resolve(__dirname, "../uploads");
// const baseUploadsPath = path.resolve("./uploads"); // 与上等效
// 用户头像目录
const avatarPath = "/avatar";
// 用户头像目录完整路径
const avatarFullPath = baseUploadsPath + avatarPath;

const childrenDir = [
    {
        path: avatarPath,
        fullPath: avatarFullPath
    }
]

// 初始化uploads目录
const initUploads = () => {
    let creats = confirmPath(baseUploadsPath, true);
    if (creats) {
        for (var i = 0, len = childrenDir.length; i < len; i++) {
            if (childrenDir[i].fullPath) {
                confirmPath(childrenDir[i].fullPath, true);
            }
        }
    }
}


module.exports = {
    // 常量
    baseUploadsPath,
    avatarPath,
    avatarFullPath,
    // 方法
    initUploads,
};
