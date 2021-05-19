const { schema } = require('./mysqlx');
const { formatFetch, formatFetchAll } = require('./utils');

class Table {
    constructor(table) {
        this.table = table;
    }

    /**
     * 静态方法, 根据输入的表名称, 创建实例
     * @static
     * @param string tableName 表名称
     * @return {instance} 实例
     */
    static async build(tableName) {
        let ins = await schema;
        let table = ins.getTable(tableName);
        return new Table(table)
    }

    /**
     * 查询-公共操作
     * @param {string} where 条件
     * @param {string} [selects=[]] 查询字段, 默认查询全部
     * @return {Promise}
     */
    async find(where, selects = ['id']) {
        let table = this.table;
        let finder = await table
            .select(...selects)
            .where(where)
        return finder;
    }

    /**
     * 查询-一条数据
     * @param {string} where 条件
     * @param {array} [selects=['id']] 查询字段
     * @return {object} 查询字段的信息
     */
    async findOne(where, selects = ['id']) {
        let finder = await this.find(where, selects);
        let data = await finder
            .execute()
            .then(s => formatFetch(s));
        return data;
    }

    /**
     * 查询-多条数据
     * @param {string} where 条件
     * @param {array} [selects=[]] 查询字段, 默认查询全部
     * @param {number} [pageNum=1] 页码, 默认为1页
     * @param {number} [pageSize=10] 每页条数, 默认为10条, 最多为100条
     * @return {object} 包含列表和计数
     */
    async findMultiple(where, selects = [], pageNum = 1, pageSize = 10) {
        let finder = await this.find(where, selects);
        let totalCount = await finder
            .execute()
            .then((res => {
                let all = res.fetchAll();
                let arr = Array(...all)
                return arr.length || 0;
            })) || 0
        let data = await finder
            .limit(pageSize)
            .offset((pageNum - 1) * pageSize)
            .execute()
            .then(s => formatFetchAll(s))
        return { data, totalCount, pageNum: Number(pageNum), pageSize: Number(pageSize) };
    }

    /**
     * 查询-全部
     * @param {string} where 条件
     * @param {array} [selects=[]] 查询字段, 默认查询全部
     * @return {array} 列表
     */
    async findAll(where, selects = []) {
        let finder = await this.find(where, selects);
        let data = await finder.execute().then(s => formatFetchAll(s))
        return data;
    }

    async insert(keys) {
        let table = this.table;
        let inserter = await table.insert(keys);
        return inserter;
    }

    /**
     * 插入-插入单条数据
     * @param {array} [keys=[]] 数据库表对应的字段 ['a','b']
     * @param {object} values 参数 {a:'1',b:'2'}
     * @return {boolean} 操作执行结果
     * 注意: keys,values字段顺序保持一致
     */
    async addOne(keys = [], values) {
        // 组装数据
        let params = keys.map(key => values[key]);
        let inserter = await this.insert(keys);
        let result = await inserter.values(params).execute();
        let id = result.getAutoIncrementValue();
        if (id) {
            return id;
        }
        return false;
    }

    /**
     * 插入-批量添加
     * @param {array} [keys=[]] 数据库表对应的字段 ['a','b']
     * @param {array} values 参数 [{a:'1',b:'2'}]
     * @return {boolean} 操作执行结果
     * 注意: keys,values字段顺序保持一致
     */
    async addMultiple(keys = [], values) {
        let inserter = await this.insert(keys);
        let multipleInserter = values.reduce((total, currentValue) => {
            let params = keys.map(key => {
                return currentValue[key]
            })
            total.values(params);
            return total;
        }, inserter)
        let result = await multipleInserter.execute().then(s => {
            let warningsCount = s.getWarningsCount(); // 警告数
            let getAffectedItemsCount = s.getAffectedItemsCount(); // 插入行数
            if (warningsCount === 0 && getAffectedItemsCount === values.length) {
                // return getAffectedItemsCount;
                return true;
            }
            return false;
        })
        return result;
    }


    /**
     * 更新-更新条件指定的数据
     * @param {string} where 条件
     * @param {object} values 数据
     * @return {boolean} 返回更新结果 
     */
    async updateOne(where, values) {
        let table = this.table;
        // 构建插入数据
        let updater = Object.keys(values).reduce((total, currentValue) => {
            total.set(currentValue, values[currentValue])
            return total;
        }, table.update().where(where))
        let result = await updater.execute().then(s => {
            let warningsCount = s.getWarningsCount();
            let affectCount = s.getAffectedItemsCount(); // 影响行数, 有变化时值为1, 无变化时值为0, 
            if (warningsCount === 0 && affectCount >= 0) {
                return true;
            }
            return false;
        })
        return result;
    }

    /**
     * 更新-更新多条数据
     * @param {string} [field='id'] 条件字段
     * @param {array} [values=[]] 数据
     * @return {boolean} 返回更新结果 
     */
    async updateMultiple(field = 'id', where = '', values = []) {
        let table = this.table;
        let obj = values.reduce((total, currentValue, index, arr) => {
            Object.keys(currentValue).forEach(key => {
                total[key] ? total[key].push(currentValue[key]) : total[key] = [currentValue[key]]
            })
            return total;
        }, {});
        let selects = obj[field];
        let snippet = Object.keys(obj).map((key) => {
            let arr = obj[key];
            let selectsArr = arr.map((item, index) => {
                return `WHEN ${selects[index]} THEN '${item}'`
            })
            return `${key} = CASE ${field} ${selectsArr.join(' ')} END`;
        })
        let sql = `UPDATE ${table.getSchema().getName()}.${table.getName()} SET ${snippet.join(',')} WHERE ${where} id IN (${selects.toString()})`;
        let result = await table.getSession().sql(sql).execute().then(s => {
            let warningsCount = s.getWarningsCount();
            let affectCount = s.getAffectedItemsCount();
            if (warningsCount === 0) {
                return true;
            }
            return false;
        })
        return result;
    }

    /**
     * 删除-一条数据
     * @param {string} where 条件
     * @return {boolean} 返回更新结果 
     */
    async deleteOne(where) {
        let table = this.table;
        let result = await table.delete().where(where).execute().then(s => {
            let count = s.getAffectedItemsCount();
            return count ? true : false
        })
        return result;
    }

    /**
    * 删除-多条数据
    * @param {string} where 条件字段
    * @return {boolean} 返回更新结果 
    */
    async deleteMultiple(where) {
        let table = this.table;
        // DELETE FROM accounts WHERE id IN (17,18) and userId = 87;
        let sql = `DELETE FROM ${table.getSchema().getName()}.${table.getName()} WHERE ${where};`;
        let result = await table.getSession().sql(sql).execute().then(s => {
            let warningsCount = s.getWarningsCount();
            let affectCount = s.getAffectedItemsCount();
            if (affectCount > 0) {
                return true;
            }
            return false;
        })
        return result;
    }
    // async deleteMultiple(field = 'id', values) {
    //     let table = this.table;
    //     // DELETE FROM accounts WHERE id IN (17,18) and userId = 87;
    //     let sql = `DELETE FROM ${table.getSchema().getName()}.${table.getName()} WHERE ${field} IN (${values});`;
    //     let result = await table.getSession().sql(sql).execute().then(s => {
    //         let warningsCount = s.getWarningsCount();
    //         let affectCount = s.getAffectedItemsCount();
    //         if (affectCount > 0) {
    //             return true;
    //         }
    //         return false;
    //     })
    //     return result;
    // }
}
module.exports = Table;

// console.log('getWarnings', result.getWarnings()); // []
// console.log('getWarningsCount', result.getWarningsCount()); // 0
// console.log('getAffectedItemsCount', result.getAffectedItemsCount()); // 1
// console.log('getAffectedRowsCount', result.getAffectedRowsCount()); // 1 (废弃)
// console.log('getAutoIncrementValue', result.getAutoIncrementValue()); // 46 id
// console.log('getGeneratedIds', result.getGeneratedIds()); // []