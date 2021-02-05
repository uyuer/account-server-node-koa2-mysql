const config = {
	// 启动端口
	port: 3000,
	// 数据库配置
	database: {
		HOST: 'localhost', //服务器ip
		PORT: '3306', //mysql端口号
		USERNAME: 'accounts1Admin', //mysql用户名
		PASSWORD: 'adgjmptw123', //mysql密码
		DATABASE: 'accounts1', //数据库名称
		INSECUREAUTH: false,
	}
}

module.exports = config