const query = require('./index');

let users = `
    CREATE TABLE IF NOT EXISTS users  (
    id int(0) NOT NULL AUTO_INCREMENT COMMENT '用户id',
    username varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
    password varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
    male enum('-1','0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '-1' COMMENT '性别(-1:保密,0:女,1:男)',
    avatar varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像(系统随机设定一个默认, 可更换)',
    email varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
    status enum('-1','0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0' COMMENT '状态(-1:删除,0:冻结,1正常)',
    createTime varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '创建时间',
    updateTime varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '更新时间',
    PRIMARY KEY (id, username, email) USING BTREE
    ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;
`

let accounts = `
    CREATE TABLE IF NOT EXISTS accounts  (
        id int(0) NOT NULL AUTO_INCREMENT COMMENT '账号id',
        website varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '网站名称',
        websiteUrl varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '网站地址',
        account varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账号',
        accountName varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '该网站下账号名',
        password varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '密码(全部替换为星星)',
        passwordOriginal varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '加密原密码',
        status enum('0','1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0' COMMENT '状态(0:正常,1:停用,2:注销)',
        createTime timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '本条数据创建时间',
        updateTime timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '本条数据更新时间',
        PRIMARY KEY (id) USING BTREE
      ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;
`

let tables = [
    users,
    accounts,
]

let createTable = (sql) => {
    return query(sql, [])
}

// 建表
function initTables() {

    createTable(users)
    createTable(accounts)
    // createTable(comment)
}
exports.initialize = async (ctx, next) => {
    let arr = tables.map(sql => {
        return query(sql, [])
    })
    Promise.all(arr).then(res => {
        ctx.body = '初始化完成'
    });
    ctx.body = '初始化中'
};