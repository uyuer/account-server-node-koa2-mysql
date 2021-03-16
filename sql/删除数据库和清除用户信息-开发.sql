-- 删除用户
use mysql;
select User,Host from user WHERE User='accounts1Admin' and Host='%';
drop user accounts1Admin@'%';
flush privileges;
-- 删除数据库
DROP DATABASE accounts1;