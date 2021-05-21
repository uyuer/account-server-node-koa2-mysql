const { getTable, verifyUserStatus } = require('./getTable');

async function allowedFind(userId, tableName, ids) {
    // 用户userId对表tableName下的ids是否具有操作权
    let user = await verifyUserStatus(userId);
    let {
        usersTable,
        registerEmailTable,
        avatarsTable,
        accountsTable,
        labelsTable
    } = await getTable();
    let table = {
        'users': usersTable,
        'registerEmail': registerEmailTable,
        'avatars': avatarsTable,
        'accounts': accountsTable,
        'labels': labelsTable,
    }[tableName];
    let result = await table().findAll(`userId=${userId}`, ['id']);
    let idsArr = result.map(i => i.id);

    return {

    }
}

module.exports = {
    allowedFind
}