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
-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `male` enum('-1','0','1') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '-1' COMMENT '性别(-1:保密,0:女,1:男)',
  `avatarId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像(系统随机设定一个默认, 可更换)',
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱(不可以为空, 由用户自己添加邮箱并激活, 未激活邮箱不能使用邮箱登录)',
  `emailActive` tinyint(1) UNSIGNED ZEROFILL NOT NULL DEFAULT 0 COMMENT '邮箱是否激活(0:未激活,1:激活)',
  `status` enum('0','1') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '1' COMMENT '状态(0:冻结,1正常)',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`, `username`) USING BTREE,
  UNIQUE INDEX `id`(`id`) USING BTREE COMMENT 'id',
  UNIQUE INDEX `username`(`username`) USING BTREE COMMENT '用户名唯一',
  UNIQUE INDEX `email`(`email`) USING BTREE COMMENT '邮箱唯一'
) ENGINE = InnoDB AUTO_INCREMENT = 88 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;
-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (42, 'admin', 'U2FsdGVkX1/YEDIGp1HIZHmXMUDomIrYNzdT37OXQsU=', '-1', NULL, '1064926209@qq.com', 0, '1', '2021-02-03 15:59:59', '2021-02-07 11:27:46');
INSERT INTO `users` VALUES (77, 'test4', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '-1', NULL, '1064926204@qq.com', 0, '0', '2021-02-04 16:09:14', '2021-02-07 11:26:49');
INSERT INTO `users` VALUES (79, 'test2', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '-1', NULL, '1064926202@qq.com', 0, '1', '2021-02-05 11:46:53', '2021-02-07 11:26:51');
INSERT INTO `users` VALUES (81, 'test3', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '-1', NULL, '1064926203@qq.com', 0, '1', '2021-02-05 15:01:21', '2021-02-07 11:26:53');
INSERT INTO `users` VALUES (82, 'test5', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '-1', NULL, '1064926205@qq.com', 0, '1', '2021-02-05 15:26:27', '2021-02-07 11:26:54');
INSERT INTO `users` VALUES (87, 'test6', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '0', '1', '1064926206@qq.com', 0, '1', '2021-02-05 15:43:52', '2021-02-08 15:48:55');
SET FOREIGN_KEY_CHECKS = 1;
-- 创建账户表
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
SET FOREIGN_KEY_CHECKS = 1;
-- 创建头像表
-- ----------------------------
-- Table structure for avatars
-- ----------------------------
DROP TABLE IF EXISTS `avatars`;
CREATE TABLE `avatars`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '头像id',
  `userId` int(0) NOT NULL COMMENT '所属用户id',
  `fileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片名',
  `createTime` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;
-- ----------------------------
-- Records of avatars
-- ----------------------------
INSERT INTO `avatars` VALUES (1, 87, 'upload_f6ec56599a2f1ae9fd46a54931abf1de.png', '2021-02-22 14:59:06');
INSERT INTO `avatars` VALUES (2, 87, 'upload_2a43f3ced771a4d373f78ff806f6b55c.png', '2021-02-22 14:59:06');
INSERT INTO `avatars` VALUES (3, 87, 'upload_96769e6d4d367cf0badb5cb44596c9ef.png', '2021-02-22 14:59:06');
INSERT INTO `avatars` VALUES (4, 87, 'upload_1403e1d96199be04380bc9010db273db.png', '2021-02-22 14:59:06');
INSERT INTO `avatars` VALUES (5, 87, 'upload_87c1082cd0ec9d80d0c7bf1372aa1e52.png', '2021-02-22 14:59:21');
SET FOREIGN_KEY_CHECKS = 1;