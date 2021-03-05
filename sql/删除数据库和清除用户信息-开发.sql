-- 删除用户
use mysql;
select User,Host from user WHERE User='accounts2Admin' and Host='%';
drop user accounts2Admin@'%';
flush privileges;
-- 删除数据库
DROP DATABASE accounts2;