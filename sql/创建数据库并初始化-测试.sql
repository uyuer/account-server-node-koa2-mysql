-- 删除用户
use mysql;
select User,Host from user WHERE User='accountsAdmin' and Host='%';
drop user accountsAdmin@'%';
flush privileges;
-- 删除数据库
DROP DATABASE accounts;

-- 创建数据库
create DATABASE accounts;
-- 创建用户
use mysql;
create user 'accountsAdmin'@'%' IDENTIFIED by 'adgjmptw123';
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
	ALTER on accounts.* to 'accountsAdmin'@'%';
FLUSH PRIVILEGES;
SHOW GRANTS for accountsAdmin;

-- 分隔线分隔线分割线分隔线分隔线分割线分隔线分隔线分割线分隔线分隔线分割线分隔线分隔线分割线
use accounts;
-- 创建用户表
/*
 Navicat Premium Data Transfer

 Source Server         : 本地用户root
 Source Server Type    : MySQL
 Source Server Version : 80023
 Source Host           : localhost:3306
 Source Schema         : accounts

 Target Server Type    : MySQL
 Target Server Version : 80023
 File Encoding         : 65001

 Date: 26/05/2021 18:02:48
*/

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
  `status` enum('0','1','2') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '状态[0:正常,1:停用,2:注销]',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '备注',
  `tags` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标签(对网站功能用途进行分类时使用,例如:娱乐,工作等)',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '本条数据创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '本条数据更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 73 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
-- Table structure for labels
-- ----------------------------
DROP TABLE IF EXISTS `labels`;
CREATE TABLE `labels`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `label` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名(不能重复)',
  `creatorId` int(0) NOT NULL DEFAULT 1 COMMENT '创建者ID, 默认为系统管理员创建',
  `isSystemCreate` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否是系统创建[1:true系统创建,0:false用户创建]; 默认为: 0',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of labels
-- ----------------------------
INSERT INTO `labels` VALUES (1, '学习', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (2, '视频', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (3, '动漫', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (4, '音乐', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (5, '游戏', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (6, '通讯', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (7, '程序', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (8, '论坛', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (9, '工具', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (10, '软件', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (11, '生活', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (12, '工作', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (13, '博客', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');
INSERT INTO `labels` VALUES (14, '电商', 1, 1, '2021-05-12 22:30:17', '2021-05-25 14:26:22');

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
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '当用户注册的时候\r\n用户输入邮箱->获取验证码\r\n表中没有同样的邮箱->无处理\r\n表中有同样的邮箱->\r\n(例子: \r\n当一个用户用testa@qq.com获取了验证码后, 另一个用户也用testa@qq.com获取验证码, 这时数据库中存在两个相同邮箱\r\n解决办法:\r\n先到先得, 无论有几个邮箱, 当用户包含验证码的完整注册信息提交后即可)\r\n\r\n当同一个用户获取两次或多次验证码(这时候没有超时)\r\n解决办法就是, 直接让该邮箱其他验证码失效, 生成新的验证码' ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB AUTO_INCREMENT = 97 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '1064926209@qq.com', 'admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '1', 1, '1', 1, '2021-02-03 15:59:59', '2021-05-24 16:06:24');

SET FOREIGN_KEY_CHECKS = 1;
