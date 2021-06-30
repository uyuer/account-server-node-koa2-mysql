const { instanceTable } = require('../method/instanceTable');

async function userPrivate(userId) {
    let {
        usersTable,
        registerEmailTable,
        avatarsTable,
        accountsDetailsTable,
        accountsLabelsTable
    } = await instanceTable();
    return {
        
    }
}

module.exports = {
    userPrivate
}