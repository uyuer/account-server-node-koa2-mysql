-- 创建数据库
create DATABASE accounts1;
-- 创建用户
use mysql;
create user 'accounts1Admin'@'%' IDENTIFIED by 'adgjmptw123';
-- 授权用户
grant SELECT,
	INSERT,
	UPDATE,
	DELETE,
	CREATE VIEW,
	EXECUTE,
	DROP,
	INDEX,
	ALTER on accounts1.* to 'accounts1Admin'@'%';
FLUSH PRIVILEGES;
SHOW GRANTS for accounts1Admin;
-- 初始化表
use accounts1;
-- 创建用户表
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '账号id',
  `userId` int(0) NOT NULL COMMENT '所属用户id',
  `website` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网站名称',
  `websiteUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '网站地址',
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '账号',
  `accountName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '该网站下账号名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '加密密码(使用AES加密, 需要密钥来解密)',
  `status` enum('0','1','2') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '状态(0:正常,1:停用,2:注销)',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '本条数据创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '本条数据更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of accounts
-- ----------------------------
INSERT INTO `accounts` VALUES (3, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 11:42:12', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (4, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 14:13:34', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (5, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 14:13:38', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (6, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 14:13:41', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (7, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 14:13:44', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (8, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 14:13:47', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (9, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 15:17:44', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (10, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 15:18:38', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (11, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 15:43:28', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (12, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 15:44:36', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (13, 87, '百度5修改', 'http://baidu.xiugai.com', '13777072927', '号码拖时间修改', '12345678', '0', '', '2021-02-23 15:44:49', '2021-03-04 17:58:26');
INSERT INTO `accounts` VALUES (14, 87, '百度5修改2', 'http://baidu.xiugai2.com', '13777072927', '号码拖时间修改2', '1234567890', '0', '', '2021-03-04 17:19:58', '2021-03-04 18:00:45');

-- ----------------------------
-- Table structure for avatars
-- ----------------------------
DROP TABLE IF EXISTS `avatars`;
CREATE TABLE `avatars`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '头像id',
  `fileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片名',
  `isSystemCreate` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否是系统创建[1:true系统创建,0:false用户创建]; 默认为: 0',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of avatars
-- ----------------------------
INSERT INTO `avatars` VALUES (1, '1.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (2, '2.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (3, '3.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (4, '4.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (5, '5.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (6, '6.png', 1, '2021-03-16 17:25:30');
INSERT INTO `avatars` VALUES (7, 'upload_f1d823ae671a805b5fa5cacced648e79.jpg', 0, '2021-03-16 17:42:41');
INSERT INTO `avatars` VALUES (8, 'upload_0c924114e38a634aa68679687917ee21.jpg', 0, '2021-03-16 17:47:25');

-- ----------------------------
-- Table structure for registeremail
-- ----------------------------
DROP TABLE IF EXISTS `registeremail`;
CREATE TABLE `registeremail`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '注册邮箱',
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '发送至邮箱的验证码',
  `expires` bigint(0) NOT NULL COMMENT '过期时间',
  `expiresTime` timestamp(0) NOT NULL COMMENT '过期时间(直观版)',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '当用户注册的时候\r\n用户输入邮箱->获取验证码\r\n表中没有同样的邮箱->无处理\r\n表中有同样的邮箱->\r\n(例子: \r\n当一个用户用testa@qq.com获取了验证码后, 另一个用户也用testa@qq.com获取验证码, 这时数据库中存在两个相同邮箱\r\n解决办法:\r\n先到先得, 无论有几个邮箱, 当用户包含验证码的完整注册信息提交后即可)\r\n\r\n当同一个用户获取两次或多次验证码(这时候没有超时)\r\n解决办法就是, 直接让该邮箱其他验证码失效, 生成新的验证码' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of registeremail
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱(不可以为空, 由用户自己添加邮箱并激活, 未激活邮箱不能使用邮箱登录)',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `male` enum('0','1','2') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '性别(0:女,1:男,2:保密)',
  `avatarId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像(系统随机设定一个默认, 可更换)',
  `emailActive` tinyint(1) UNSIGNED ZEROFILL NOT NULL DEFAULT 0 COMMENT '邮箱是否激活(0:未激活,1:激活)',
  `status` enum('0','1') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '1' COMMENT '状态(0:冻结,1正常)',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`, `username`, `email`) USING BTREE,
  UNIQUE INDEX `id`(`id`) USING BTREE COMMENT 'id',
  UNIQUE INDEX `username`(`username`) USING BTREE COMMENT '用户名唯一',
  UNIQUE INDEX `email`(`email`) USING BTREE COMMENT '邮箱唯一'
) ENGINE = InnoDB AUTO_INCREMENT = 94 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (42, '1064926209@qq.com', 'admin', 'U2FsdGVkX1/YEDIGp1HIZHmXMUDomIrYNzdT37OXQsU=', '2', NULL, 0, '1', '2021-02-03 15:59:59', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (77, '1064926204@qq.com', 'test4', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '2', NULL, 0, '0', '2021-02-04 16:09:14', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (79, '1064926202@qq.com', 'test2', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '2', NULL, 0, '1', '2021-02-05 11:46:53', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (81, '1064926203@qq.com', 'test3', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '2', NULL, 0, '1', '2021-02-05 15:01:21', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (82, '1064926205@qq.com', 'test5', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '2', NULL, 0, '1', '2021-02-05 15:26:27', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (87, '1064926206@qq.com', 'test6', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '2', '8', 0, '1', '2021-02-05 15:43:52', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (88, 'uyao1@qq.com', 'uyao1', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '2', '6', 0, '1', '2021-03-16 17:24:47', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (89, '1064926000@qq.com', 'test000', '123456', '2', '5', 0, '1', '2021-03-31 21:17:09', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (90, '1064926001@qq.com', 'test001', '123456', '2', '1', 0, '1', '2021-03-31 21:30:31', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (91, '1064926002@qq.com', 'test002', '123456', '2', '5', 0, '1', '2021-03-31 21:32:12', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (92, '1064926003@qq.com', 'test003', '123456', '2', '5', 0, '1', '2021-03-31 21:34:15', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (93, '1064926004@qq.com', 'test004', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '2', 0, '1', '2021-04-01 15:29:45', '2021-04-01 15:45:40');

SET FOREIGN_KEY_CHECKS = 1;

