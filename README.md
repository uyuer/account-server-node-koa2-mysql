# account-server-node-koa2-mysql

# koa-body参考文档 https://github.com/dlau/koa-body/blob/master/examples/multipart.js

账户表字段列表

```
let accountsFieldsList = ['id', 'userId', 'site', 'website', 'introduction', 'account', 'password', 'associates', 'nickname', 'status', 'remark', 'tags', 'createTime', 'updateTime'];
```


账户表字段默认值

```
let accountsFields = {
	userId: '', // 所属用户id
	site: '', // 网站名称
	website: '', // 网站地址
	introduction: '', // 网站简介, 可以添加一些说明文字
	account: '', // 注册账户(在网站注册的时候使用的账户)
	password: '', // 加密密码(使用AES加密, 需要密钥来解密)
	associates: '', // 绑定或关联的账户(注册账户关联或绑定的账户)可能有多个关联(字符串数组形式)
	nickname: '', // 网站上的昵称
	status: '0', // 状态(0:正常,1:停用,2:注销)
	remark: '', // 备注
	tags: '', // 标签(对网站功能用途进行分类时使用,例如:娱乐,工作等)
};
```


```
// -------------------------------------------------------
let session = ctx.session || {};
if (!session.role) {
// 普通用户
    if (validParams.userId != session.userId) {
    	return ctx.throw(403, '没有操作权限')
    }
} else {
    // 管理员
    // 管理员userId可以和接口上传参数中的userId不同
    // 这也意味着管理员可以通过传入不同的userId来增删改查用户输入,这种能力为超级管理员所有
    // 当数据管理依赖多级管理员用户时, 例如二级三级管理员, 需要通过权限限制
}
// -------------------------------------------------------
```


```
// -------------------------------------------------------
let session = ctx.session || {};
if (!session.role) {
	// 普通用户
	let check = validParams.every(item => {
		return item.userId == session.userId
	})
	if (!check) {
		return ctx.throw(403, '没有操作权限')
	}
} else {
	// 管理员
	// 管理员userId可以和接口上传参数中的userId不同
	// 这也意味着管理员可以通过传入不同的userId来增删改查用户输入,这种能力为超级管理员所有
	// 当数据管理依赖多级管理员用户时, 例如二级三级管理员, 需要通过权限限制
}
// -------------------------------------------------------
```



```
// 文件系统不能跟踪, 废弃|待定
const fs = require("fs");

const middles = () => {
    let obj = {};
    fs.readdirSync(__dirname).forEach(file => {
        if (file === "index.js") {
            return;
        }
        const middle = require(`./${file}`);
        // TODO: 待优化
        let name = file.split('.')[0];
        obj[name] = middle;
    });
    return obj;
};

module.exports = middles()
```

