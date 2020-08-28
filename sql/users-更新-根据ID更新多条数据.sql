UPDATE users SET
    password = CASE id
        WHEN 3 THEN 'm3'
        WHEN 4 THEN 'm4'
        WHEN 5 THEN 'm5'
		END,
		email = CASE id
        WHEN 3 THEN '1064@qq.com'
        WHEN 4 THEN '2064@qq.com'
        WHEN 5 THEN '3064@qq.com'
    END
WHERE id IN (3,4,5)