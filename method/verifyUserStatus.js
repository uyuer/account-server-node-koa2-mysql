const { getTable } = require('./method');

/**
 * 校验用户状态
 * @param {*} userId
 * @return {*} 
 * @description 需要判断用户是否拥有对该数据的操作权,因为有可能是管理员来操作数据
 * @description 当用户选择注销后, 将用户基础信息保存到注销用户表中用于统计信息, 删除用户表中的信息及用户其他数据信息
 */
const verifyUserStatus = async (userId) => {
    let { usersTable } = await getTable();
    let user = await usersTable.findOne(`id=${userId}`, ['id', 'email', 'username', 'male', 'avatarId', 'active', 'status', 'role', 'createTime', 'updateTime']);
    // 检查用户是否存在
    if (!user) {
        return ctx.throw(403, '未知用户')
    }
    // 检查用户是否激活 (可能情况:添加了管理员, 但管理员未认证激活邮箱)
    if (!user.active) {
        return ctx.throw(403, '账户未激活, 请认证邮箱后再操作')
    }
    // 检查用户状态是否是冻结
    if ([0].includes(user.status)) {
        let status = ['账户已冻结, 请前往个人中心激活'];
        return ctx.throw(403, status[user.status])
    }
    return user;
}
module.exports = {
    verifyUserStatus
};