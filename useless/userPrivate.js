const { instanceTable } = require('../method/instanceTable');

async function userPrivate(userId) {
    let {
        usersTable,
        registerEmailTable,
        avatarsTable,
        accountsTable,
        labelsTable
    } = await instanceTable();
    return {
        
    }
}

module.exports = {
    userPrivate
}