/**
 * log4js 配置文件
 *
 * 日志等级由低到高
 * ALL TRACE DEBUG INFO WARN ERROR FATAL OFF.
 *
 * 关于log4js的appenders的配置说明
 * https://github.com/nomiddlename/log4js-node/wiki/Appenders
 */

const path = require("path");
const { confirmPath } = require('./../lib/utils');

//日志根目录
const baseLogPath = path.resolve(__dirname, "../logs");

//错误日志目录
const errorPath = "/error";
// 错误日志目录完整路径
const errorFullPath = baseLogPath + errorPath;
//错误日志文件名
const errorFileName = "error";
//错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// const errorLogPath = path.resolve(__dirname, "../logs/error/error");

//响应日志目录
const responsePath = "/response";
// 响应日志完整目录
const responseFullPath = baseLogPath + responsePath;
//响应日志文件名
const responseFileName = "response";
//响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// const responseLogPath = path.resolve(__dirname, "../logs/response/response");

const log4jsConfig = {
	appenders: {
		errorLogger: {
			type: "dateFile",
			filename: errorLogPath,
			pattern: "yyyy-MM-dd-hh.log",
			alwaysIncludePattern: true,
			path: errorPath,
		},
		resLogger: {
			type: "dateFile",
			filename: responseLogPath,
			pattern: "yyyy-MM-dd-hh.log",
			alwaysIncludePattern: true,
			path: responsePath,
		},
	},
	categories: {
		default: { appenders: ["errorLogger", "resLogger"], level: "debug" },
	},
}

const childrenDir = [
	{
		path: errorPath,
		fullPath: errorFullPath
	},
	{
		path: responsePath,
		fullPath: responseFullPath
	}
]

// 初始化uploads目录
const initLogs = () => {
	let creats = confirmPath(baseLogPath, true);
	if (creats) {
		for (var i = 0, len = childrenDir.length; i < len; i++) {
			if (childrenDir[i].fullPath) {
				confirmPath(childrenDir[i].fullPath, true);
			}
		}
	}
}

module.exports = {
	// 常量
	baseLogPath,
	errorPath,
	errorLogPath,
	responsePath,
	responseLogPath,
	log4jsConfig,
	// 方法
	initLogs,
};

// /**
//  * log4js 配置文件
//  *
//  * 日志等级由低到高
//  * ALL TRACE DEBUG INFO WARN ERROR FATAL OFF.
//  *
//  * 关于log4js的appenders的配置说明
//  * https://github.com/nomiddlename/log4js-node/wiki/Appenders
//  */

// const path = require("path");

// //日志根目录
// const baseLogPath = path.resolve(__dirname, "../logs");

// //错误日志目录
// const errorPath = "/error";
// //错误日志文件名
// const errorFileName = "error";
// //错误日志输出完整路径
// const errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// // const errorLogPath = path.resolve(__dirname, "../logs/error/error");

// //响应日志目录
// const responsePath = "/response";
// //响应日志文件名
// const responseFileName = "response";
// //响应日志输出完整路径
// const responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// // const responseLogPath = path.resolve(__dirname, "../logs/response/response");

// module.exports = {
// 	appenders: {
// 		errorLogger: {
// 			type: "dateFile",
// 			filename: errorLogPath,
// 			pattern: "yyyy-MM-dd-hh.log",
// 			alwaysIncludePattern: true,
// 			path: errorPath,
// 		},
// 		resLogger: {
// 			type: "dateFile",
// 			filename: responseLogPath,
// 			pattern: "yyyy-MM-dd-hh.log",
// 			alwaysIncludePattern: true,
// 			path: responsePath,
// 		},
// 	},
// 	categories: {
// 		default: { appenders: ["errorLogger", "resLogger"], level: "debug" },
// 	},
// };
