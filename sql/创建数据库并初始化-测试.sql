-- 初始化sql
-- 需要创建系统管理员:
-- INSERT INTO `users` VALUES (1, 'xxxxx@email.com(用户邮箱)', 'admin(用户名)', 'xxxxxxx(用户密码,使用sha256加密)', '2(性别)', '1(头像)', 1(邮箱是否激活), '1(账户状态)', 1(角色), 'YYYY-MM-DD HH:mm:ss(当前时间)', 'YYYY-MM-DD HH:mm:ss(当前时间)');

-- 删除用户
use mysql;
select User,Host from user WHERE User='uyueclubAdmin' and Host='%';
drop user uyueclubAdmin@'%';
flush privileges;
-- 删除数据库
DROP DATABASE uyueclub;

-- 创建用户
use mysql;
create user 'uyueclubAdmin'@'%' IDENTIFIED by 'xxxxxxxxxx';
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
	ALTER on uyueclub.* to 'uyueclubAdmin'@'%';
FLUSH PRIVILEGES;
SHOW GRANTS for uyueclubAdmin;

-- 创建数据库
create DATABASE uyueclub;
-- 创建表
use uyueclub;
/*
 Navicat Premium Data Transfer

 Source Server         : 腾讯云-我的数据库
 Source Server Type    : MySQL
 Source Server Version : 80024
 Source Host           : 129.28.75.7:3306
 Source Schema         : uyueclub

 Target Server Type    : MySQL
 Target Server Version : 80024
 File Encoding         : 65001

 Date: 14/07/2021 16:07:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for accounts_details
-- ----------------------------
DROP TABLE IF EXISTS `accounts_details`;
CREATE TABLE `accounts_details`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '账号id',
  `userId` int(0) NOT NULL COMMENT '所属用户id',
  `site` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网站名称',
  `website` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '网站地址',
  `introduction` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网站简介, 可以添加一些说明文字',
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '注册账户(在网站注册的时候使用的账户)',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '加密密码(使用AES加密, 需要密钥来解密)',
  `associates` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '绑定或关联的账户(注册账户关联或绑定的账户)可能有多个关联(字符串数组形式)',
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '网站上的昵称',
  `status` enum('0','1','2') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '状态[0:正常,1:停用,2:注销]',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签(对网站功能用途进行分类时使用,例如:娱乐,工作等)',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '本条数据创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '本条数据更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for accounts_labels
-- ----------------------------
DROP TABLE IF EXISTS `accounts_labels`;
CREATE TABLE `accounts_labels`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `label` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名(不能重复)',
  `creatorId` int(0) NOT NULL DEFAULT 1 COMMENT '创建者ID, 默认为系统管理员创建',
  `isSystemCreate` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否是系统创建[1:true系统创建,0:false用户创建]; 默认为: 0',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of accounts_labels
-- ----------------------------
INSERT INTO `accounts_labels` VALUES (1, '学习', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (2, '视频', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (3, '动漫', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (4, '游戏', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (5, '程序', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (6, '工具', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (7, '软件', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (8, '生活', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (9, '工作', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (10, '博客', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `accounts_labels` VALUES (11, '电商', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');

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
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of avatars
-- ----------------------------
INSERT INTO `avatars` VALUES (1, '1.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (2, '2.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (3, '3.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (4, '4.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (5, '5.png', 1, '2021-03-16 17:14:02');
INSERT INTO `avatars` VALUES (6, '6.png', 1, '2021-03-16 17:25:30');

-- ----------------------------
-- Table structure for ledgers_books
-- ----------------------------
DROP TABLE IF EXISTS `ledgers_books`;
CREATE TABLE `ledgers_books`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `userId` int(0) NOT NULL COMMENT '所属用户id',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账簿名',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '备注',
  `createTime` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ledgers_details
-- ----------------------------
DROP TABLE IF EXISTS `ledgers_details`;
CREATE TABLE `ledgers_details`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '账号id',
  `bookId` int(0) NOT NULL COMMENT '所属账簿id',
  `userId` int(0) NOT NULL COMMENT '所属用户id',
  `type` enum('0','1') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '支出/收入',
  `date` date NOT NULL COMMENT '账单日期',
  `amount` double(8, 2) UNSIGNED ZEROFILL NOT NULL COMMENT '金额',
  `labelId` int(0) NOT NULL COMMENT '类别ID',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '本条数据创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '本条数据更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ledgers_labels
-- ----------------------------
DROP TABLE IF EXISTS `ledgers_labels`;
CREATE TABLE `ledgers_labels`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `label` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名(不能重复)',
  `creatorId` int(0) NOT NULL DEFAULT 1 COMMENT '创建者ID, 默认为系统管理员创建',
  `isSystemCreate` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否是系统创建[1:true系统创建,0:false用户创建]; 默认为: 0',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ledgers_labels
-- ----------------------------
INSERT INTO `ledgers_labels` VALUES (1, '餐饮', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:10:08');
INSERT INTO `ledgers_labels` VALUES (2, '交通', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:10:12');
INSERT INTO `ledgers_labels` VALUES (3, '住房', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:10:28');
INSERT INTO `ledgers_labels` VALUES (4, '美容', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:10:35');
INSERT INTO `ledgers_labels` VALUES (5, '服饰', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:10:43');
INSERT INTO `ledgers_labels` VALUES (6, '运动', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:10:54');
INSERT INTO `ledgers_labels` VALUES (7, '旅行', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:11:01');
INSERT INTO `ledgers_labels` VALUES (8, '娱乐', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:11:08');
INSERT INTO `ledgers_labels` VALUES (9, '生活', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:11:16');
INSERT INTO `ledgers_labels` VALUES (10, '医疗', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:11:20');
INSERT INTO `ledgers_labels` VALUES (11, '通讯', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:11:27');
INSERT INTO `ledgers_labels` VALUES (12, '学习', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:11:33');
INSERT INTO `ledgers_labels` VALUES (13, '礼物', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:11:37');
INSERT INTO `ledgers_labels` VALUES (14, '母婴', 1, 1, '2021-05-12 22:30:17', '2021-06-19 00:11:44');
INSERT INTO `ledgers_labels` VALUES (15, '数码', 1, 1, '2021-06-19 00:12:59', '2021-06-19 00:25:37');
INSERT INTO `ledgers_labels` VALUES (16, '零食', 1, 1, '2021-06-19 00:13:26', '2021-06-19 00:25:37');
INSERT INTO `ledgers_labels` VALUES (17, '购物', 1, 1, '2021-06-19 00:13:52', '2021-06-19 00:25:37');
INSERT INTO `ledgers_labels` VALUES (18, '水果', 1, 1, '2021-06-19 00:14:01', '2021-06-19 00:25:37');
INSERT INTO `ledgers_labels` VALUES (19, '其他', 1, 1, '2021-06-19 00:24:38', '2021-07-01 17:02:32');
INSERT INTO `ledgers_labels` VALUES (20, '工资', 1, 1, '2021-06-29 09:24:14', '2021-07-01 17:02:45');

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
  `male` enum('0','1','2') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '性别[0:女,1:男,2:保密]',
  `avatarId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像(系统随机设定一个默认, 可更换)',
  `active` tinyint(0) NOT NULL DEFAULT 1 COMMENT '邮箱是否激活[0:未激活,1:激活]',
  `status` enum('0','1') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '1' COMMENT '状态[0:冻结,1:正常,2:注销,3:管理员操作冻结,4:管理员操作注销,5:账户异常时系统判断冻结]',
  `role` int(0) NOT NULL DEFAULT 0 COMMENT '角色[0:普通用户,1:系统管理员,2:二级管理员,3:...]',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`, `username`, `email`) USING BTREE,
  UNIQUE INDEX `id`(`id`) USING BTREE COMMENT 'id',
  UNIQUE INDEX `username`(`username`) USING BTREE COMMENT '用户名唯一',
  UNIQUE INDEX `email`(`email`) USING BTREE COMMENT '邮箱唯一'
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'xxxxx@email.com', 'admin', 'xxxxxxx', '2', '1', 1, '1', 1, '2021-02-03 15:59:59', '2021-07-10 15:55:43');

-- ----------------------------
-- View structure for ledgers_view
-- ----------------------------
DROP VIEW IF EXISTS `ledgers_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `ledgers_view` AS select `ledgers_details`.`id` AS `id`,`ledgers_details`.`bookId` AS `bookId`,`ledgers_details`.`userId` AS `userId`,`ledgers_details`.`type` AS `type`,`ledgers_details`.`date` AS `date`,`ledgers_details`.`amount` AS `amount`,`ledgers_details`.`remark` AS `remark`,`ledgers_details`.`createTime` AS `createTime`,`ledgers_details`.`updateTime` AS `updateTime`,`ledgers_books`.`name` AS `bookName`,`ledgers_labels`.`id` AS `labelId`,`ledgers_labels`.`label` AS `label`,`ledgers_labels`.`isSystemCreate` AS `labelsIsSystemCreate` from ((`ledgers_books` join `ledgers_details` on((`ledgers_books`.`id` = `ledgers_details`.`bookId`))) join `ledgers_labels` on((`ledgers_details`.`labelId` = `ledgers_labels`.`id`)));

SET FOREIGN_KEY_CHECKS = 1;
