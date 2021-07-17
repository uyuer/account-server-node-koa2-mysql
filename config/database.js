// require('dotenv').config('./env');

const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DB_INSECUREAUTH,
} = process.env;

module.exports = {
    HOST: DB_HOST, //服务器ip
    PORT: DB_PORT, //mysql端口号
    DATABASE: DB_NAME, //数据库名称
    USERNAME: DB_USERNAME, //mysql用户名
    PASSWORD: DB_PASSWORD, //mysql密码
    USERS_TABLE: 'users',
    REGISTEREMAIL_TABLE: 'registeremail',
    AVATARS_TABLE: 'avatars',
    ACCOUNTS_DETAILS_TABLE: 'accounts_details',
    ACCOUNTS_LABELS: 'accounts_labels',
    LEDGERS_BOOKS_TABLE: 'ledgers_books',
    LEDGERS_DETAILS_TABLE: 'ledgers_details',
    LEDGERS_LABELS_TABLE: 'ledgers_labels',
}