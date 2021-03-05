/*
 Navicat Premium Data Transfer

 Source Server         : 本地用户accounts1Admin
 Source Server Type    : MySQL
 Source Server Version : 80023
 Source Host           : localhost:3306
 Source Schema         : accounts1

 Target Server Type    : MySQL
 Target Server Version : 80023
 File Encoding         : 65001

 Date: 05/03/2021 09:50:04
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
