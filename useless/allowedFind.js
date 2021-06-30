const { instanceTable, verifyUserStatus } = require('../lib/method');

async function allowedFind(userId, tableName, ids) {
    // 用户userId对表tableName下的ids是否具有操作权
    let user = await verifyUserStatus(userId);
    let {
        usersTable,
        registerEmailTable,
        avatarsTable,
        accountsDetailsTable,
        accountsLabelsTable
    } = await instanceTable();
    let table = {
        'users': usersTable,
        'registerEmail': registerEmailTable,
        'avatars': avatarsTable,
        'accountsDetails': accountsDetailsTable,
        'accountsLabels': accountsLabelsTable,
    }[tableName];
    let result = await table().findAll(`userId=${userId}`, ['id']);
    let idsArr = result.map(i => i.id);

    return {

    }
}

module.exports = {
    allowedFind
}