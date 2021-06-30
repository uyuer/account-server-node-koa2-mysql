# 项目名称

幽钥的个人网站

描述: 



## 项目依赖: 

```
node:			v14
koa2:			v2
log4js:			v6
nodemailer:		v6
crypto-js:		v4
jsonwebtoken:	v8
nodemon:		v1
mocha:			v8
supertest:		v6
```



## 目录结构

```

```



## 笔记


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

加密方式

```
var AES = require("crypto-js/aes");

// AES加密 加密用户网站密码
let ciphertext = CryptoJS.AES.encrypt('123456', '123456').toString();
let plaintext = CryptoJS.AES.decrypt(ciphertext, '123456').toString(CryptoJS.enc.Utf8);
console.log(ciphertext, plaintext)

// sha256加密 加密用户登录密码, 用户密码为密钥key
CryptoJS.SHA256('123456', '123456').toString()
let ins = await schema;
```
