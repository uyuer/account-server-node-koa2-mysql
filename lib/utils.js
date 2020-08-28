exports.checkParams = async (rules, params) => {
    return new Promise((resolve, reject) => {
        let result = rules.every(currentValue => {
            if (params[currentValue]) {
                return true;
            }
            return false;
        })
        resolve(result);
    })
}