const fs = require('fs');

// 根据需求,读取相应的页面,并返回
function render(page) {
    return new Promise((resolve, reject) => {
        let pageUrl = `./back/pages/${page}`;
        //生成二进制流
        fs.readFile(pageUrl, "binary", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

// 识别url,判断所请求的页面
async function backRoute(url) {
    let page = '404.html';
    switch (url) {
        case '/':
            page = 'index.html';
            break;
        case '/index':
            page = 'index.html';
            break;
        case '/home':
            page = 'home.html';
            break;
        default:
            break;
    }
    let html = await render(page);
    return html;
}
module.exports = backRoute;