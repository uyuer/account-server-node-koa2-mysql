const query = require('./index');
const R = require('./../lib/responseBeautifier');
const { checkParams } = require('./../lib/utils');

// 新增用户
exports.insertUser = async ctx => {
    let params = ctx.request.body;
    let checkResult = await checkParams(['password', 'username', 'email'], params)
    if (!checkResult) {
        return ctx.response.body = R.set(false, '200', '参数缺失');
    }

    let _sql = "insert into users set ?;"
    let result = await query(_sql, params);
    if (result) {
        ctx.response.body = R.set(true, '200', '新增用户成功');
    } else {
        ctx.response.body = R.set(false, '200', '新增用户失败');
    }
}
// 删除用户
exports.deleteOneUser = async ctx => {
    let params = ctx.request.body;
    let checkResult = await checkParams(['id'], params);
    if (!checkResult) {
        return ctx.response.body = R.set(false, '200', '参数缺失');
    }

    let _sql = `delete from users where id="${params.id}";`
    let result = await query(_sql);
    if (result) {
        ctx.response.body = R.set(true, '200', '删除成功');
    } else {
        ctx.response.body = R.set(false, '200', '删除失败');
    }
}
// 查找-指定ID查找用户信息
exports.findOneUser = async ctx => {
    let params = ctx.request.query;
    console.log(params)
    let checkResult = await checkParams(['id'], params);
    if (!checkResult) {
        return ctx.response.body = R.set(false, '200', '参数缺失');
    }

    let _sql = `select * from users where id="${params.id}";`
    let result = await query(_sql);
    console.log(result);
    if (result) {
        ctx.response.body = R.set(result[0], '200');
    } else {
        ctx.response.body = R.set(null, '200');
    }

}

// 查找-多条件查找用户(暂时不多条件)
exports.findMultipleUser = async ctx => {
    let params = ctx.request.query;
    let { pageNum, pageSize } = params;
    let checkResult = await checkParams(['pageNum', 'pageSize'], params);
    if (!checkResult) {
        return ctx.response.body = R.set(null, '200', '参数缺失');
    }
    // let queryStr = '';
    // Object.keys(params).forEach(key => {
    //     if (params[key]) {
    //         queryStr += `${key}=${params[key]} `
    //     }
    // })

    let _sql = `select * from users order by id limit ${(pageNum - 1) * pageSize}, ${pageSize};`
    let result = await query(_sql);
    console.log(_sql, result);
    if (result) {
        ctx.response.body = R.set(result, '200');
    } else {
        ctx.response.body = R.set(null, '200');
    }
}