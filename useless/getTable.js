const Table = require('../lib/table.class');

async function getTable() {
    let usersTable = await Table.build('users');
    let registerEmailTable = await Table.build('registeremail');
    let avatarsTable = await Table.build('avatars');
    let accountsDetailsTable = await Table.build('accounts_details');
    let accountsLabelsTable = await Table.build('accounts_labels');
    return {
        usersTable,
        registerEmailTable,
        avatarsTable,
        accountsDetailsTable,
        accountsLabelsTable
    }
}

module.exports = {
    getTable
}