/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = "unknowError";
ApiErrorNames.NOT_FOUND = "notFound";
ApiErrorNames.NOT_LOGIN = "notLogin";
ApiErrorNames.ERROR_PARAMS = "errorParams";

/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, { code: -1, message: '未知错误' });
error_map.set(ApiErrorNames.NOT_FOUND, { code: 404, message: '路径不存在' });
error_map.set(ApiErrorNames.NOT_LOGIN, { code: 401, message: '未登录' });
error_map.set(ApiErrorNames.ERROR_PARAMS, { code: 400, message: '参数错误' });

//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name = ApiErrorNames.UNKNOW_ERROR) => {

    var error_info;

    if (error_name) {
        error_info = error_map.get(error_name);
    }

    //如果没有对应的错误信息，默认'未知错误'
    if (!error_info) {
        error_name = UNKNOW_ERROR;
        error_info = error_map.get(error_name);
    }

    return error_info;
}

module.exports = ApiErrorNames;