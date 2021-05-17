const { schema } = require('../lib/mysqlx');
const { formatFetch, formatFetchAll } = require('../lib/utils');

class Table {
    constructor(table) {
        this.table = table;
    }
    static async build(tableName) {
        let ins = await schema;
        let table = ins.getTable('users');
        return new Table(table)
    }

    /**
     * 查询一条数据
     * @param {*} where 字符串 条件
     * @param {string} [fields=['id']] 数组 查询字段
     * @return {*} 返回 对象 用户信息
     * @memberof Table
     */
    async findOne(where, fields=['id']) {
        let table = this.table;
        let info = await table
            .select(...fields)
            .where(where)
            .execute()
            .then((s) => formatFetch(s));
        return info;
    }
}
module.exports = Table;