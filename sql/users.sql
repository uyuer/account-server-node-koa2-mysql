/*
 Navicat Premium Data Transfer

 Source Server         : 本地用户root
 Source Server Type    : MySQL
 Source Server Version : 80023
 Source Host           : localhost:3306
 Source Schema         : accounts1

 Target Server Type    : MySQL
 Target Server Version : 80023
 File Encoding         : 65001

 Date: 16/03/2021 17:49:43
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
INSERT INTO `users` VALUES (87, 'test6', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '0', '8', '1064926206@qq.com', 0, '1', '2021-02-05 15:43:52', '2021-03-16 17:47:25');
INSERT INTO `users` VALUES (88, 'uyao1', 'U2FsdGVkX1+D0BX1odsEbzsRnanKZ1zjh42gycUC+30=', '-1', '6', 'uyao1@qq.com', 0, '1', '2021-03-16 17:24:47', '2021-03-16 17:24:47');

SET FOREIGN_KEY_CHECKS = 1;
