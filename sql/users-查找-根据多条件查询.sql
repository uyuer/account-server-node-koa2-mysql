SELECT
	*
FROM
	users
	WHERE
-- 	username = 'test' AND
-- 	password = '123456' AND
	createTime > '2020-08-27' AND
	FORMAT(createTime, 'yyyy-mm-dd') <= '2020-08-28'
ORDER BY
	users.id
LIMIT 0, 10;