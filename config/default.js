const config = {
	// 启动端口
	port: 3000,
	// 数据库配置
	database: {
		HOST: 'localhost', //服务器ip
		PORT: '3306', //mysql端口号
		USERNAME: 'accountsAdmin', //mysql用户名
		PASSWORD: 'adgjmptw123', //mysql密码
		DATABASE: 'accounts', //数据库名称
		INSECUREAUTH: true,
	}
}

module.exports = config