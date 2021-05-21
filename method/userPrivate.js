const { getTable } = require('./getTable');

async function userPrivate(userId) {
    let {
        usersTable,
        registerEmailTable,
        avatarsTable,
        accountsTable,
        labelsTable
    } = await getTable();
    return {
        
    }
}

module.exports = {
    userPrivate
}