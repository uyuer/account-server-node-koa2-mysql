const Table = require('../lib/table.class');

async function getTable() {
    let usersTable = await Table.build('users');
    let avatarsTable = await Table.build('avatars');
    let registerEmailTable = await Table.build('registeremail');
    let accountsTable = await Table.build('accounts');
    return {
        usersTable, avatarsTable, registerEmailTable, accountsTable
    }
}

module.exports = {
    getTable
}