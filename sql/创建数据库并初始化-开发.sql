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

-- 分隔线分隔线分割线分隔线分隔线分割线分隔线分隔线分割线分隔线分隔线分割线分隔线分隔线分割线
use accounts1;
-- 创建用户表
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

 Date: 30/06/2021 17:53:04
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
) ENGINE = InnoDB AUTO_INCREMENT = 709 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of accounts_details
-- ----------------------------
INSERT INTO `accounts_details` VALUES (3, 87, '百度', 'http://baidu.com', '搜索网址', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', '号码拖时间', '0', '百度账号, 这个账号在百度云知道等地方都有使用, 多个地方使用, 绑定了手机号, 多点字查看下超出部分', '[1,5]', '2021-02-23 11:42:12', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (4, 87, '优酷', 'https://youku.com', '视频网址', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', '幽钥', '0', '视频网站', '[1,5]', '2021-02-23 14:13:34', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (5, 87, '在线作图平台', 'https://www.processon.com', NULL, '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', '用户_123123', '0', '在线作图平台, 有些缺点, 总体很方便', '[1,5]', '2021-02-23 14:13:38', '2021-05-21 14:18:34');
INSERT INTO `accounts_details` VALUES (6, 87, '菜鸟教程', 'https://www.runoob.com', '一个学习', '1064926209@qq.com', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', '用户_12322', '0', '程序学习', '[1,5]', '2021-02-23 14:12:12', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (7, 87, '知乎', 'https://www.zhihu.com', NULL, '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', NULL, NULL, '0', '逼乎', '[1,5]', '2021-02-23 14:13:44', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (8, 87, '淘宝', 'https://www.taobao.com', NULL, '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', NULL, NULL, '0', '购物网站', '[1,5]', '2021-02-23 14:13:47', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (15, 87, '百度5修改4', 'http://jenkins.uyue.club', '简介', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '182738237@qq.com', '号码拖时间修改4', '0', '修改测试', '[1,3]', '2021-04-22 22:20:49', '2021-05-29 03:08:56');
INSERT INTO `accounts_details` VALUES (16, 87, 'v5-472-g jenkins', 'http://jenkins.uyue.club', '前端自动化构建工具', 'admin', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'admin', '0', '笔记本上安装的jenkins', '[1,7]', '2021-04-22 22:27:12', '2021-05-19 16:30:42');
INSERT INTO `accounts_details` VALUES (17, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyao', '0', '程序学习', '[1,5]', '2021-04-22 22:27:12', '2021-05-19 16:30:42');
INSERT INTO `accounts_details` VALUES (18, 87, 'react', 'http://react.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyuer', '0', '学习', '[1,5]', '2021-04-23 18:50:08', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (19, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyao', '0', '程序学习', '[1,5]', '2021-04-23 18:50:08', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (25, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyao', '0', '程序学习', '[1,5]', '2021-04-24 15:32:38', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (26, 87, 'react', 'http://react.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyuer', '0', '学习', '[1,5]', '2021-04-24 15:32:40', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (27, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyao', '0', '程序学习', '[1,5]', '2021-04-24 15:32:40', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (28, 87, '在线作图', 'https://www.processon.com', '可以在线画流程图', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', '用户-122', '0', '学习工作', '[1,5]', '2021-05-07 21:10:18', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (29, 87, 'v5-472-g jenkins', 'http://jenkins.uyue.club', '前端自动化构建工具', 'admin', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'admin', '0', '笔记本上安装的jenkins', '[1,7]', '2021-05-13 11:08:37', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (30, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyao', '0', '程序学习', '[1,5]', '2021-05-13 11:08:37', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (33, 87, '微信', 'https://www.baidu.com', '12322', '123', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064626209@qq.com', '幽钥', '0', '123', '[1, 4, 8]', '2021-05-13 14:23:39', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (34, 87, '百度', 'https://www.baidu.com', '2', '123', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '271654537@qq.com,1064626209@qq.com', '用户_212312', '0', '321', '[6, 4]', '2021-05-13 14:23:39', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (35, 87, '微信', 'https://www.baidu.com', '12322', '123', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064626209@qq.com', '幽钥', '0', '123', '[1, 4, 8]', '2021-05-13 14:25:53', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (36, 87, '百度', 'https://www.baidu.com', '2', '123', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '271654537@qq.com,1064626209@qq.com', '用户_212312', '0', '321', '[6, 4]', '2021-05-13 14:25:53', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (37, 87, '微信', 'https://www.baidu.com', '12322', '123', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064626209@qq.com', '幽钥', '0', '123', '[1, 4, 8]', '2021-05-13 14:29:25', '2021-05-13 14:29:25');
INSERT INTO `accounts_details` VALUES (38, 87, '百度', 'https://www.baidu.com', '2', '123', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '271654537@qq.com,1064626209@qq.com', '用户_212312', '0', '321', '[6, 4]', '2021-05-13 14:29:25', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (39, 87, 'test', 'https://www.test.com', '123', '123', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '123', '123', '0', '123', '[1]', '2021-05-13 15:36:07', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (40, 87, 'v5-472-g jenkins', 'http://jenkins.uyue.club', '前端自动化构建工具', 'admin', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'admin', '0', '笔记本上安装的jenkins', '[1,7]', '2021-05-17 11:46:27', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (41, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyao', '0', '程序学习', '[1,5]', '2021-05-17 11:46:27', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (42, 87, 'v5-472-g jenkins', 'http://jenkins.uyue.club', '前端自动化构建工具', 'admin', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'admin', '0', '笔记本上安装的jenkins', '[1,7]', '2021-05-17 11:47:17', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (43, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyao', '0', '程序学习', '[1,5]', '2021-05-17 11:47:17', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (44, 87, '百度', 'http://baidu.com', '互联网搜索引擎', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', '号码拖时间', '0', '搜索入口', '[6,7]', '2021-05-18 14:43:22', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (45, 87, '百度', 'http://baidu.com', '互联网搜索引擎', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com,271654537@qq.com', '号码拖时间', '0', '搜索入口', '[6,7]', '2021-05-18 14:44:52', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (46, 87, '百度', 'http://baidu.com', '互联网搜索引擎', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com,271654537@qq.com', '号码拖时间', '0', '搜索入口', '[6,7]', '2021-05-18 14:50:05', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (47, 87, 'v5-472-g jenkins', 'http://jenkins.uyue.club', '前端自动化构建工具', 'admin', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'admin', '0', '笔记本上安装的jenkins', '[1,7]', '2021-05-18 14:55:53', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (48, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyao', '0', '程序学习', '[1,5]', '2021-05-18 14:55:53', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (49, 87, '百度', 'http://baidu.com', '互联网搜索引擎', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com,271654537@qq.com', '号码拖时间', '0', '搜索入口', '[6,7]', '2021-05-19 16:05:21', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (50, 87, 'v5-472-g jenkins', 'http://jenkins.uyue.club', '前端自动化构建工具', 'admin', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'admin', '0', '笔记本上安装的jenkins', '[1,7]', '2021-05-19 16:05:59', '2021-05-19 16:30:53');
INSERT INTO `accounts_details` VALUES (702, 87, 'v5-472-g jenkins', 'http://jenkins.uyue.club', '前端自动化构建工具', 'admin', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'admin', '0', '笔记本上安装的jenkins', '[1,7]', '2021-06-05 01:13:49', '2021-06-05 01:13:49');
INSERT INTO `accounts_details` VALUES (703, 87, 'AngularJS', 'http://angularjs.com', '前端框架', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'uyao', '0', '程序学习', '[1,5]', '2021-06-05 01:13:49', '2021-06-05 01:13:49');
INSERT INTO `accounts_details` VALUES (704, 87, '菜鸟教程', 'https://runoob.com', '学习文档', 'admin', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com', 'admin', '0', '学习', '[1,7]', '2021-06-05 01:13:49', '2021-06-05 01:13:49');
INSERT INTO `accounts_details` VALUES (708, 87, '百度', 'http://baidu.com', '互联网搜索引擎', '13777072927', 'U2FsdGVkX1+Sl1pX2qX9PCw5zWKFUlE+LmbRxi4iQzs=', '1064926209@qq.com,271654537@qq.com', '号码拖时间', '0', '搜索入口', '[6,7]', '2021-06-30 17:04:40', '2021-06-30 17:04:40');

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
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
INSERT INTO `accounts_labels` VALUES (12, '新增标签', 80, 0, '2021-05-25 15:22:51', '2021-05-25 15:26:10');
INSERT INTO `accounts_labels` VALUES (13, '测试编辑标签', 87, 0, '2021-05-25 15:22:51', '2021-05-25 15:26:10');

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
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
INSERT INTO `avatars` VALUES (9, 'upload_9307e3e0738c6805833f8f3a10cfde00.jpg', 0, '2021-05-24 18:11:29');
INSERT INTO `avatars` VALUES (10, 'upload_ca91f4a7d0ad255d44631eb62345cafd.jpg', 0, '2021-05-24 18:11:38');
INSERT INTO `avatars` VALUES (11, 'upload_3a029b73c757817320ae8e957cb69cf9.jpg', 0, '2021-05-24 18:12:59');
INSERT INTO `avatars` VALUES (12, 'upload_2cd60a2c1caf45cef1e901f3387697d4.jpg', 0, '2021-05-24 18:13:14');
INSERT INTO `avatars` VALUES (13, 'upload_6dcbf2d2919326599711ca810b88aab9.jpg', 0, '2021-05-24 18:13:40');
INSERT INTO `avatars` VALUES (14, 'upload_d19f081d7c648d3a5ac97d1a98a942bd.jpg', 0, '2021-05-24 18:14:08');
INSERT INTO `avatars` VALUES (15, 'upload_79def8e2bfdc7fcc993f782186d1ae40.jpg', 0, '2021-05-24 18:15:30');

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
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ledgers_books
-- ----------------------------
INSERT INTO `ledgers_books` VALUES (1, 87, '个人账本', '用于个人支出记录', '2021-06-27 09:38:56', '2021-06-27 09:38:56');
INSERT INTO `ledgers_books` VALUES (2, 87, '个人账本删除测试2', '用于个人支出记录2', '2021-06-27 09:41:30', '2021-06-28 16:26:59');
INSERT INTO `ledgers_books` VALUES (5, 87, '个人账本删除测试', '用于个人支出记录', '2021-06-28 16:25:20', '2021-06-28 16:25:20');

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
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ledgers_details
-- ----------------------------
INSERT INTO `ledgers_details` VALUES (1, 1, 87, '0', '2021-06-01', 00034.50, 1, '早餐', '2021-06-27 16:53:34', '2021-06-30 14:47:58');
INSERT INTO `ledgers_details` VALUES (2, 1, 87, '0', '2021-06-21', 00005.50, 1, '早餐', '2021-06-28 11:41:00', '2021-06-30 14:49:19');
INSERT INTO `ledgers_details` VALUES (3, 1, 87, '0', '2021-05-22', 00064.50, 1, '早餐修改', '2021-06-28 16:02:35', '2021-06-30 14:49:20');
INSERT INTO `ledgers_details` VALUES (5, 1, 89, '0', '2021-05-21', 00032.30, 1, '早餐', '2021-06-28 16:23:48', '2021-06-30 14:49:20');
INSERT INTO `ledgers_details` VALUES (6, 1, 87, '0', '2021-05-21', 00024.50, 1, '早餐', '2021-06-29 17:57:47', '2021-06-30 14:49:20');
INSERT INTO `ledgers_details` VALUES (7, 1, 87, '1', '2021-05-21', 00008.00, 1, '早餐', '2021-06-29 17:58:39', '2021-06-30 14:49:20');
INSERT INTO `ledgers_details` VALUES (8, 1, 87, '1', '2021-05-21', 00034.50, 1, '早餐', '2021-06-29 17:58:50', '2021-06-30 14:49:21');
INSERT INTO `ledgers_details` VALUES (9, 1, 87, '0', '2021-06-21', 00034.50, 2, '早餐备注批量修改', '2021-06-29 18:10:15', '2021-06-30 14:49:21');
INSERT INTO `ledgers_details` VALUES (10, 2, 87, '0', '2021-06-21', 00034.50, 2, '午餐备注批量修改', '2021-06-29 18:10:15', '2021-06-30 14:49:21');

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
INSERT INTO `ledgers_labels` VALUES (19, '其他支出', 1, 1, '2021-06-19 00:24:38', '2021-06-19 00:27:26');
INSERT INTO `ledgers_labels` VALUES (20, '测试编辑标签', 87, 0, '2021-06-29 09:24:14', '2021-06-29 09:32:08');

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
) ENGINE = InnoDB AUTO_INCREMENT = 98 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '1064926209@qq.com', 'admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '1', 1, '1', 1, '2021-02-03 15:59:59', '2021-05-24 16:06:24');
INSERT INTO `users` VALUES (77, '1064926204@qq.com', 'test4', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '2', 1, '0', 0, '2021-02-04 16:09:14', '2021-05-24 16:06:24');
INSERT INTO `users` VALUES (79, '1064926202@qq.com', 'test2', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '3', 1, '1', 0, '2021-02-05 11:46:53', '2021-05-24 16:06:25');
INSERT INTO `users` VALUES (81, '1064926203@qq.com', 'test3', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '4', 1, '1', 0, '2021-02-05 15:01:21', '2021-05-24 16:06:26');
INSERT INTO `users` VALUES (82, '1064926205@qq.com', 'test5', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '5', 1, '1', 0, '2021-02-05 15:26:27', '2021-05-24 16:06:27');
INSERT INTO `users` VALUES (87, '1064926206@qq.com', 'test6', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '1', 1, '1', 1, '2021-02-05 15:43:52', '2021-05-26 22:53:52');
INSERT INTO `users` VALUES (88, 'uyao1@qq.com', 'uyao1', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '6', 1, '1', 0, '2021-03-16 17:24:47', '2021-05-20 13:39:52');
INSERT INTO `users` VALUES (89, '1064926000@qq.com', 'test000', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '5', 1, '1', 0, '2021-03-31 21:17:09', '2021-05-20 13:39:52');
INSERT INTO `users` VALUES (90, '1064926001@qq.com', 'test001', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '1', 1, '1', 0, '2021-03-31 21:30:31', '2021-05-20 13:39:52');
INSERT INTO `users` VALUES (91, '1064926002@qq.com', 'test002', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '5', 1, '1', 0, '2021-03-31 21:32:12', '2021-05-20 13:39:52');
INSERT INTO `users` VALUES (92, '1064926003@qq.com', 'test003', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '5', 1, '1', 0, '2021-03-31 21:34:15', '2021-05-20 13:39:52');
INSERT INTO `users` VALUES (93, '1064926004@qq.com', 'test004', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '2', 1, '1', 0, '2021-04-01 15:29:45', '2021-05-20 13:39:52');
INSERT INTO `users` VALUES (94, '271654537@qq.com', 'test005', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '5', 1, '1', 0, '2021-04-09 23:23:26', '2021-05-20 13:39:52');
INSERT INTO `users` VALUES (97, '1064926207@qq.com', 'test7', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2', '4', 1, '1', 0, '2021-05-25 10:55:22', '2021-05-25 10:55:22');

-- ----------------------------
-- View structure for ledgers_view
-- ----------------------------
DROP VIEW IF EXISTS `ledgers_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `ledgers_view` AS select `ledgers_details`.`id` AS `id`,`ledgers_details`.`bookId` AS `bookId`,`ledgers_details`.`userId` AS `userId`,`ledgers_details`.`type` AS `type`,`ledgers_details`.`date` AS `date`,`ledgers_details`.`amount` AS `amount`,`ledgers_details`.`labelId` AS `labelId`,`ledgers_details`.`remark` AS `remark`,`ledgers_details`.`createTime` AS `createTime`,`ledgers_details`.`updateTime` AS `updateTime`,`ledgers_books`.`name` AS `bookName`,`ledgers_labels`.`id` AS `labelsId`,`ledgers_labels`.`label` AS `label`,`ledgers_labels`.`isSystemCreate` AS `labelsIsSystemCreate` from ((`ledgers_books` join `ledgers_details` on((`ledgers_books`.`id` = `ledgers_details`.`bookId`))) join `ledgers_labels` on((`ledgers_details`.`labelId` = `ledgers_labels`.`id`)));

SET FOREIGN_KEY_CHECKS = 1;
