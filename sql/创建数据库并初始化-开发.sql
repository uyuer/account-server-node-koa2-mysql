-- 删除用户
use mysql;
select User,Host from user WHERE User='accounts1Admin' and Host='%';
drop user accounts1Admin@'%';
flush privileges;
-- 删除数据库
DROP DATABASE accounts1;

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
  CREATE,
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
  `site` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网站名称',
  `website` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '网站地址',
  `introduction` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网站简介, 可以添加一些说明文字',
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '注册账户(在网站注册的时候使用的账户)',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '加密密码(使用AES加密, 需要密钥来解密)',
  `associates` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '绑定或关联的账户(注册账户关联或绑定的账户)可能有多个关联(字符串数组形式)',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网站上的昵称',
  `status` enum('0','1','2') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '状态(0:正常,1:停用,2:注销)',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签(对网站功能用途进行分类时使用,例如:娱乐,工作等)',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '本条数据创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '本条数据更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of accounts
-- ----------------------------
INSERT INTO `accounts` VALUES (3, 87, '百度', 'http://baidu.com', '搜索网址', '13777072927', '12345678', '1064926209@qq.com', '号码拖时间', '0', '百度账号, 这个账号在百度云知道等地方都有使用, 多个地方使用, 绑定了手机号, 多点字查看下超出部分', NULL, '2021-02-23 11:42:12', '2021-04-18 15:32:19');
INSERT INTO `accounts` VALUES (4, 87, '优酷', 'https://youku.com', '视频网址', '13777072927', '12345678', '1064926209@qq.com', '幽钥', '0', '视频网站', NULL, '2021-02-23 14:13:34', '2021-04-18 15:32:25');
INSERT INTO `accounts` VALUES (5, 87, '在线作图平台', 'https://www.processon.com', NULL, '13777072927', '12345678', '1064926209@qq.com', '用户_123123', '0', '在线作图平台, 有些缺点, 总体很方便', NULL, '2021-02-23 14:13:38', '2021-04-18 15:32:35');
INSERT INTO `accounts` VALUES (6, 87, '菜鸟教程', 'https://www.runoob.com', '一个学习', '1064926209@qq.com', '12345678', '1064926209@qq.com', '用户_12322', '0', '程序学习', '程序学习', '2021-02-23 14:12:12', '2021-04-18 15:42:17');
INSERT INTO `accounts` VALUES (7, 87, '知乎', 'https://www.zhihu.com', NULL, '13777072927', '12345678', NULL, NULL, '0', '逼乎', NULL, '2021-02-23 14:13:44', '2021-04-18 15:28:37');
INSERT INTO `accounts` VALUES (8, 87, '淘宝', 'https://www.taobao.com', NULL, '13777072927', '12345678', NULL, NULL, '0', '购物网站', NULL, '2021-02-23 14:13:47', '2021-04-18 15:28:37');
INSERT INTO `accounts` VALUES (15, 87, '百度', 'http://baidu.com', '互联网搜索引擎', '13777072927', '123456', '[\"1064926209@qq.com\"]', '号码拖时间', '0', '搜索入口', '[\"搜索\",\"工作\"]', '2021-04-22 22:20:49', '2021-04-22 22:20:49');
INSERT INTO `accounts` VALUES (16, 87, 'react', 'http://react.com', '前端框架', '13777072927', '123456', '[\"1064926209@qq.com\"]', 'uyuer', '0', '学习', '[\"程序\",\"工作\"]', '2021-04-22 22:27:12', '2021-04-22 22:27:12');
INSERT INTO `accounts` VALUES (17, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', '123456', '[\"1064926209@qq.com\"]', 'uyao', '0', '程序学习', '[\"程序\",\"工作\"]', '2021-04-22 22:27:12', '2021-04-22 22:27:12');
INSERT INTO `accounts` VALUES (18, 87, 'react', 'http://react.com', '前端框架', '13777072927', '123456', '[\"1064926209@qq.com\"]', 'uyuer', '0', '学习', '[\"程序\",\"工作\"]', '2021-04-23 18:50:08', '2021-04-23 20:57:38');
INSERT INTO `accounts` VALUES (19, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', '123456', '[\"1064926209@qq.com\"]', 'uyao', '0', '程序学习', '[\"程序\",\"工作\"]', '2021-04-23 18:50:08', '2021-04-23 20:57:38');
INSERT INTO `accounts` VALUES (25, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', '123456', '[\"1064926209@qq.com\"]', 'uyao', '0', '程序学习', '[\"程序\",\"工作\"]', '2021-04-24 15:32:38', '2021-04-24 15:32:38');
INSERT INTO `accounts` VALUES (26, 87, 'react', 'http://react.com', '前端框架', '13777072927', '123456', '[\"1064926209@qq.com\"]', 'uyuer', '0', '学习', '[\"程序\",\"工作\"]', '2021-04-24 15:32:40', '2021-04-24 15:32:40');
INSERT INTO `accounts` VALUES (27, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', '123456', '[\"1064926209@qq.com\"]', 'uyao', '0', '程序学习', '[\"程序\",\"工作\"]', '2021-04-24 15:32:40', '2021-04-24 15:32:40');
INSERT INTO `accounts` VALUES (28, 87, '在线作图', 'https://www.processon.com', '可以在线画流程图', '13777072927', 'U2FsdGVkX19OaCweyqlYV0pJC91ghyduDxx0whOzmys=', '1064926209@qq.com', '用户-122', '0', '学习工作', '[工作]', '2021-05-07 21:10:18', '2021-05-07 21:10:18');

-- ----------------------------
-- Table structure for avatars
-- ----------------------------
DROP TABLE IF EXISTS `avatars`;
CREATE TABLE `avatars`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '头像id',
  `fileName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片名',
  `isSystemCreate` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否是系统创建[1:true系统创建,0:false用户创建]; 默认为: 0',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
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
-- Table structure for labels
-- ----------------------------
DROP TABLE IF EXISTS `labels`;
CREATE TABLE `labels`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `label` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名(不能重复)',
  `creatorId` int(0) NOT NULL DEFAULT 1 COMMENT '创建者ID, 默认为系统管理员创建',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`, `label`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of labels
-- ----------------------------
INSERT INTO `labels` VALUES (1, '学习', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:37');
INSERT INTO `labels` VALUES (2, '视频', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:43');
INSERT INTO `labels` VALUES (3, '动漫', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:43');
INSERT INTO `labels` VALUES (4, '游戏', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:43');
INSERT INTO `labels` VALUES (5, '程序', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:43');
INSERT INTO `labels` VALUES (6, '工具', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:43');
INSERT INTO `labels` VALUES (7, '软件', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:43');
INSERT INTO `labels` VALUES (8, '生活', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:43');
INSERT INTO `labels` VALUES (9, '工作', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:43');
INSERT INTO `labels` VALUES (10, '博客', 1, '2021-05-12 22:30:17', '2021-05-12 22:31:43');
INSERT INTO `labels` VALUES (11, '电商', 1, '2021-05-12 22:30:17', '2021-05-12 22:32:40');
INSERT INTO `labels` VALUES (12, '测试编辑标签1', 1, '2021-05-12 23:22:24', '2021-05-12 23:25:46');

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '当用户注册的时候\r\n用户输入邮箱->获取验证码\r\n表中没有同样的邮箱->无处理\r\n表中有同样的邮箱->\r\n(例子: \r\n当一个用户用testa@qq.com获取了验证码后, 另一个用户也用testa@qq.com获取验证码, 这时数据库中存在两个相同邮箱\r\n解决办法:\r\n先到先得, 无论有几个邮箱, 当用户包含验证码的完整注册信息提交后即可)\r\n\r\n当同一个用户获取两次或多次验证码(这时候没有超时)\r\n解决办法就是, 直接让该邮箱其他验证码失效, 生成新的验证码' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 95 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '1064926209@qq.com', 'admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', NULL, 0, '1', '2021-02-03 15:59:59', '2021-05-12 22:13:41');
INSERT INTO `users` VALUES (77, '1064926204@qq.com', 'test4', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', NULL, 0, '0', '2021-02-04 16:09:14', '2021-04-25 22:26:50');
INSERT INTO `users` VALUES (79, '1064926202@qq.com', 'test2', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', NULL, 0, '1', '2021-02-05 11:46:53', '2021-04-25 22:26:50');
INSERT INTO `users` VALUES (81, '1064926203@qq.com', 'test3', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', NULL, 0, '1', '2021-02-05 15:01:21', '2021-04-25 22:26:50');
INSERT INTO `users` VALUES (82, '1064926205@qq.com', 'test5', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', NULL, 0, '1', '2021-02-05 15:26:27', '2021-04-25 22:26:50');
INSERT INTO `users` VALUES (87, '1064926206@qq.com', 'test6', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '8', 0, '1', '2021-02-05 15:43:52', '2021-04-25 22:26:46');
INSERT INTO `users` VALUES (88, 'uyao1@qq.com', 'uyao1', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '6', 0, '1', '2021-03-16 17:24:47', '2021-04-25 22:26:50');
INSERT INTO `users` VALUES (89, '1064926000@qq.com', 'test000', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '5', 0, '1', '2021-03-31 21:17:09', '2021-04-25 22:26:50');
INSERT INTO `users` VALUES (90, '1064926001@qq.com', 'test001', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '1', 0, '1', '2021-03-31 21:30:31', '2021-04-25 22:26:50');
INSERT INTO `users` VALUES (91, '1064926002@qq.com', 'test002', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '5', 0, '1', '2021-03-31 21:32:12', '2021-04-25 22:26:50');
INSERT INTO `users` VALUES (92, '1064926003@qq.com', 'test003', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '5', 0, '1', '2021-03-31 21:34:15', '2021-04-25 22:26:50');
INSERT INTO `users` VALUES (93, '1064926004@qq.com', 'test004', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '2', 0, '1', '2021-04-01 15:29:45', '2021-04-01 15:45:40');
INSERT INTO `users` VALUES (94, '271654537@qq.com', 'test005', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '5', 0, '1', '2021-04-09 23:23:26', '2021-04-09 23:23:26');

SET FOREIGN_KEY_CHECKS = 1;
