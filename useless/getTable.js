const Table = require('../lib/table.class');

async function getTable() {
    let usersTable = await Table.build('users');
    let registerEmailTable = await Table.build('registeremail');
    let avatarsTable = await Table.build('avatars');
    let accountsTable = await Table.build('accounts');
    let labelsTable = await Table.build('labels');
    return {
        usersTable,
        registerEmailTable,
        avatarsTable,
        accountsTable,
        labelsTable
    }
}

module.exports = {
    getTable
}