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

 Date: 05/03/2021 09:51:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
