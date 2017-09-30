/*公用常量的声明*/
var pconst = (function () {
    var constObj = {
        requestUrl: '/prequest',    //客户端所有请求地址，有session时会验证session的有效性，否则不验证
        requestNoValidUrl: '/requestNoValidUrl',       //获取数据，有session时也不验证session的有效性
        mapFileName: 'dataModelMap',        //数据映射文件名称
        emptyReplaceStr: '--',       //值为空时的替换字符
        attachments: 'attachments',     //附件的参数名称
        puser: 'puser',
        pticket: 'pticket',
        //以值作为属性名称追加到元素上，以此做元素鼠标悬浮、离开时的色彩变化。属性值为数组：偶数索引项为样式名称、奇数索引项为样式值
        targetHoverCssSourcePro: '_phoverCss',
        mapDataType: {
            boolean: { name: 'boolean', sqlType: 'tinyint(1)' },
            number: { name: 'number', sqlType: 'double(20,3)' },
            string: { name: 'string', sqlType: 'varchar(100)' },
            date: { name: 'date', sqlType: 'varchar(25)' },
            fileLink: { name: 'fileLink', sqlType: 'varchar(100)' },
            object: { name: 'object' },
            array: { name: 'array' },
            tree: { name: 'tree' },
            fileArray: { name: 'fileArray' }
        },
        requestType: {
            plogin: 'plogin',                    //登录
            ploginOut: 'ploginOut',                    //注销
            pquery: 'pquery',                     //获取数据
            pupdate: 'pupdate',                   //更新，包括：增删改
            pdownload: 'pfiledownload',               //普通下载
            pdownloadByParam: 'pdownloadByParam',  //根据参数下载，适用于动态生成文件
            pupload: 'pfileupload'                   //上传
        },
        //数据粒度
        dataGranularity: {
            yy: 'yy',   //数据以年为粒度
            y: 'y',     //数据以月为粒度
            M: 'M',     //数据以天为粒度
            d: 'd'      //数据以小时为粒度
        }
    };
    return typeof module != 'undefined' ? (module.exports = constObj) : constObj;
})();