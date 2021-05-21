const path = require("path");
const { confirmPath } = require('./../lib/utils');

// 临时存放文件夹
const tempName = 'temp';
const tempFullPath = path.resolve(".", tempName);

// 初始化temp目录
const initTemp = () => {
    confirmPath(tempFullPath, true);
}


// 上传文件存放位置
const uploadsName = 'uploads';
const uploadsFullPath = path.resolve(".", uploadsName);
const defaultAvatarName = 'defaultAvatar';
const defaultAvatarPath = path.resolve(uploadsFullPath, defaultAvatarName);
const avatarName = 'avatar';
const avatarPath = path.resolve(uploadsFullPath, avatarName);

const childrenDir = [
    { path: '/' + defaultAvatarName, fullPath: defaultAvatarPath },
    { path: '/' + avatarName, fullPath: avatarPath },
]
// 初始化uploads目录
const initUploads = () => {
    let creats = confirmPath(uploadsFullPath, true);
    if (creats) {
        for (var i = 0, len = childrenDir.length; i < len; i++) {
            if (childrenDir[i].fullPath) {
                confirmPath(childrenDir[i].fullPath, true);
            }
        }
    }
}

module.exports = {
    tempName,
    tempFullPath,
    initTemp,

    uploadsName,
    uploadsFullPath,
    defaultAvatarName,
    defaultAvatarPath,
    avatarName,
    avatarPath,
    initUploads,
};
