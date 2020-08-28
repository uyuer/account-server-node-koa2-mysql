/*
 Navicat Premium Data Transfer

 Source Server         : 本地用户accountsAdmin
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : localhost:3306
 Source Schema         : accounts

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 28/08/2020 18:09:42
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '账号id',
  `website` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '网站名称',
  `websiteUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '网站地址',
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '账号',
  `accountName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '该网站下账号名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '密码(全部替换为星星)',
  `passwordOriginal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '加密原密码',
  `status` enum('0','1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0' COMMENT '状态(0:正常,1:停用,2:注销)',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '本条数据创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '本条数据更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of accounts
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `male` enum('-1','0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '-1' COMMENT '性别(-1:保密,0:女,1:男)',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像(系统随机设定一个默认, 可更换)',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱',
  `status` enum('-1','0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0' COMMENT '状态(-1:删除,0:冻结,1正常)',
  `createTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updateTime` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '更新时间',
  PRIMARY KEY (`id`, `username`, `email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (4, 'test_update', 'm4', '-1', NULL, '2064@qq.com', '0', '2020-08-27 18:09:27', '2020-08-28 14:17:00');
INSERT INTO `users` VALUES (5, 'test4', 'm5', '-1', NULL, '3064@qq.com', '0', '2020-08-27 18:10:20', '2020-08-28 14:17:00');
INSERT INTO `users` VALUES (6, 'test3', '123456', '1', NULL, '1064926205@qq.com', '0', '2020-08-28 18:10:39', '2020-08-28 17:51:18');
INSERT INTO `users` VALUES (7, 'test5', '123456', '-1', NULL, '1064926205@qq.com', '0', '2020-08-28 10:15:37', '2020-08-28 10:15:37');
INSERT INTO `users` VALUES (8, 'test_m1', '123456', '0', NULL, '1064926201@qq.com', '0', '2020-08-28 14:08:46', '2020-08-28 17:50:52');
INSERT INTO `users` VALUES (9, 'test_m2', '123456', '-1', NULL, '1064926202@qq.com', '0', '2020-08-28 14:08:46', '2020-08-28 14:08:46');
INSERT INTO `users` VALUES (10, 'test8', '123456', '1', NULL, '1064926205@qq.com', '0', '2020-08-28 14:42:19', '2020-08-28 17:51:13');
INSERT INTO `users` VALUES (11, 'test7', '123456', '-1', NULL, '', '0', '2020-08-28 15:06:25', '2020-08-28 17:51:10');
INSERT INTO `users` VALUES (12, 'test6', '123456', '0', NULL, '', '0', '2020-08-28 15:15:27', '2020-08-28 17:51:07');

SET FOREIGN_KEY_CHECKS = 1;
