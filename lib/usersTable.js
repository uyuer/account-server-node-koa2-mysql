const { schema } = require('../lib/mysqlx');
const { formatFetch, formatFetchAll } = require('../lib/utils');

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
     * @param {string} [fields=[]] 查询字段, 默认查询全部
     * @return {Promise}
     */
    async find(where, fields = ['id']) {
        let table = this.table;
        let finder = await table
            .select(...fields)
            .where(where)
        return finder;
    }

    /**
     * 查询-一条数据
     * @param {string} where 条件
     * @param {array} [fields=['id']] 查询字段
     * @return {object} 查询字段的信息
     */
    async findOne(where, fields = ['id']) {
        let finder = await this.find(where, fields);
        let data = await finder
            .execute()
            .then(s => formatFetch(s));
        return data;
    }

    /**
     * 查询-多条数据
     * @param {string} where 条件
     * @param {array} [fields=[]] 查询字段, 默认查询全部
     * @param {number} [pageNum=1] 页码, 默认为1页
     * @param {number} [pageSize=10] 每页条数, 默认为10条, 最多为100条
     * @return {object} 包含列表和计数
     */
    async findMultiple(where, fields = [], pageNum = 1, pageSize = 10) {
        let finder = await this.find(where, fields);
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
     * @param {array} [fields=[]] 查询字段, 默认查询全部
     * @return {array} 列表
     */
    async findAll(where, fields = []) {
        let finder = await this.find(where, fields);
        let data = await finder.execute().then(s => formatFetchAll(s))
        return data;
    }

    async insert(keys, values) {
        let table = this.table;
        let inserter = await table.insert(keys);
        return inserter;
    }

    /**
     * 插入-插入单条数据
     * @param {array} [keys=[]] 数据库表对应的字段 ['a','b']
     * @param {object} params 参数 {a:'1',b:'2'}
     * @return {boolean} 操作执行结果
     */
    async addOne(keys = [], params) {
        // 组装数据
        let values = keys.map(key => params[key]);
        let inserter = await this.insert(keys);
        let result = await inserter.values(values).execute();
        let id = result.getAutoIncrementValue();
        if (id) {
            return id;
        }
        return false;
        // console.log('getWarnings', result.getWarnings()); // []
        // console.log('getWarningsCount', result.getWarningsCount()); // 0
        // console.log('getAffectedItemsCount', result.getAffectedItemsCount()); // 1
        // console.log('getAffectedRowsCount', result.getAffectedRowsCount()); // 1 (废弃)
        // console.log('getAutoIncrementValue', result.getAutoIncrementValue()); // 46 id
        // console.log('getGeneratedIds', result.getGeneratedIds()); // []
    }

    /**
     * 插入-批量添加
     * @param {array} [keys=[]] 数据库表对应的字段 ['a','b']
     * @param {array} params 参数 [{a:'1',b:'2'}]
     * @return {boolean} 操作执行结果
     */
    async addMultiple(keys = [], params) {
        let inserter = await this.insert(keys);
        let multipleInserter = params.reduce((total, currentValue) => {
            let values = Object.keys(currentValue).map(key => {
                return currentValue[key]
            })
            total.values(values);
            return total;
        }, inserter)
        let result = await multipleInserter.execute().then(s => {
            let warningsCount = s.getWarningsCount(); // 警告数
            let getAffectedItemsCount = s.getAffectedItemsCount(); // 插入行数
            if (warningsCount === 0 && getAffectedItemsCount === params.length) {
                return getAffectedItemsCount;
            }
            return false;
        })
        return result;
    }

    async updateOne(where, params) {
        let table = this.table;
        // 构建插入数据
        let updater = Object.keys(params).reduce((total, currentValue) => {
            total.set(currentValue, params[currentValue])
            return total;
        }, table.update().where(where))
        let result = await updater.execute().then(s => {
            console.log('getWarnings', s.getWarnings()); // []
            console.log('getWarningsCount', s.getWarningsCount()); // 0
            console.log('getAffectedItemsCount', s.getAffectedItemsCount()); // 1
            console.log('getAutoIncrementValue', s.getAutoIncrementValue()); // 46 id
            console.log('getGeneratedIds', s.getGeneratedIds()); // []
            let warningsCount = s.getWarningsCount();
            let affectCount = s.getAffectedItemsCount(); // 影响行数, 有变化时值为1, 无变化时值为0, 
            if (warningsCount === 0 && affectCount >= 0) {
                return true;
            }
            return false;
        })
        return result;
    }
    async updateMultiple(field = 'id', params) {
        let table = this.table;
        let obj = params.reduce((total, currentValue, index, arr) => {
            Object.keys(currentValue).forEach(key => {
                total[key] ? total[key].push(currentValue[key]) : total[key] = [currentValue[key]]
            })
            return total;
        }, {});
        let fields = obj[field];
        let snippet = Object.keys(obj).map((key) => {
            let arr = obj[key];
            let fieldsArr = arr.map((item, index) => {
                return `WHEN ${fields[index]} THEN '${item}'`
            })
            return `${key} = CASE ${field} ${fieldsArr.join(' ')} END`;
        })
        let sql = `
			UPDATE ${table.getSchema().getName()}.${table.getName()} SET ${snippet.join(',')} WHERE id IN (${fields.toString()})
		`;
        let result = await table.getSession().sql(sql).execute().then(s => {
            let warningsCount = s.getWarningsCount();
            let affectCount = s.getAffectedItemsCount();
            if (warningsCount === 0) {
                return true;
            }
            return false;
        })
        console.log(result);
        return result;
    }
}
module.exports = Table;