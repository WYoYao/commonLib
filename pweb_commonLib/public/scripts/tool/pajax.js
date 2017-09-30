/*文件的上传流程：先上传到网站后台，网站后台到中间件，中间件到java端*/
var pajax = (function () {
    function pajax() {
    };

    //发送请求
    function send(objParam) {
        return $.ajax({
            type: objParam.type,
            url: objParam.url,
            data: JSON.stringify(objParam.data),
            contentType: 'application/json',
            dataType: 'json',
            success: objParam.success,
            error: function (err) {
                if (err.status == 302) return window.location.href = err.responseText;
                consoleErr(objParam.data.fn, err);
                typeof objParam.error == 'function' ? objParam.error(err) : null;
            },
            complete: objParam.complete
        });
    };

    //组装请求参数
    function createParam(type, objParam, url) {
        objParam = objParam || {};
        var realData = objParam.data || {};

        objParam.data = {
            data: realData,
            fn: objParam.url,
            _ptype: type
        };
        objParam.url = url || pconst.requestUrl;
        objParam.type = 'post';     //暂且写死，get请求怎么传整数？
        return objParam;
    };

    //输出错误信息
    function consoleErr(requestName, err) {
        console.error(requestName +
                        '执行错误：\nstatus:' + err.status +
                        '\nstatusText:' + err.statusText +
                        '\nresponseText:' + err.responseText +
                        '\readyState:' + err.readyState);
    };

    pajax.prototype = {
        /*
        *get请求获取数据，有session时验证session的有效性，参数为object，包含属性如下：
        *   url 和后台协商好的请求地址，即接口名称，必须不能以 / 开始
        *   data 请求参数
        *   success 请求成功后的回调
        *   error 请求失败后的回调，失败的同时会输出错误信息，回调函数的参数为object，包含属性如下：
        *      readyState http请求的状态    responseText 服务端返回信息内容，即错误原因
        *      status     服务器响应状态码     statusText 服务器响应状态吗释义
        *   complete 请求结束后的回调
        */
        get: function get(objParam) {
            var newParam = createParam(pconst.requestType.pquery, objParam);
            return send(newParam);
        },
        /*post请求获取数据，有session时验证session的有效性，参数释义同get请求*/
        post: function post(objParam) {
            var newParam = createParam(pconst.requestType.pquery, objParam);
            return send(newParam);
        },
        /*get请求获取数据，有session时也不验证session的有效性，参数释义同get请求*/
        novalidGet: function novalidGet(objParam) {
            var newParam = createParam(pconst.requestType.pquery, objParam, pconst.requestNoValidUrl);
            return send(newParam);
        },
        /*post请求获取数据，有session时也不验证session的有效性，参数释义同get请求*/
        novalidPost: function novalidPost(objParam) {
            var newParam = createParam(pconst.requestType.pquery, objParam, pconst.requestNoValidUrl);
            return send(newParam);
        },
        /*上传文件，只适用于临时上传，即文件不保存的情况
        *参数为object，包含属性如下：
        *   file 文件，为input file获取到的文件
        *   success 请求成功后的回调，回调函数的参数为object，包含属性如下：
        *      result: 1 代表上传成功  0 失败    showUrl 文件的下载地址    name 文件的名称
        *      suffix 文件的后缀
        *   error 请求失败后的回调，失败的同时会输出错误信息，回调函数的参数为object，包含属性如下：
        *      readyState http请求的状态    responseText 服务端返回信息内容，即错误原因
        *      status     服务器响应状态码     statusText 服务器响应状态吗释义
        *   complete 请求结束后的回调
        *   progress 上传进度回调，回调函数的参数为object，包含属性如下：
        *          probe 乘完100的百分比值    loadedSize 已上传的大小，单位为字节   totalSize 总大小，单位为字节
        */
        upload: function (objParam) {
            var successCall = typeof objParam.success == 'function' ? objParam.success : function () { };
            var errorCall = function (err) {
                consoleErr('upload', err);
                typeof objParam.error == 'function' ? objParam.error(err) : null;
            };
            var completeCall = typeof objParam.complete == 'function' ? objParam.complete : function () { };
            var progressCall = typeof objParam.progress == 'function' ? objParam.progress : function () { };


            var formData = new FormData();
            formData.append('file', objParam.file);

            var httpRequest = new XMLHttpRequest();
            httpRequest.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    var percentComplete = Math.division(event.loaded, event.total);
                    percentComplete = Math.multiplication(percentComplete, 100);
                    progressCall({
                        probe: percentComplete,
                        loadedSize: event.loaded,
                        totalSize: event.total
                    });
                }
            };
            httpRequest.open('post', '/' + pconst.requestType.pupload);
            httpRequest.send(formData);
            httpRequest.onreadystatechange = function () {
                switch (httpRequest.status) {
                    case 200:
                        switch (httpRequest.readyState) {
                            case 4:
                                var objResult = JSON.parse(httpRequest.responseText);
                                successCall(objResult);
                                completeCall();
                                break;
                        }
                        break;
                    default:
                        errorCall(httpRequest);
                        break;
                }
            };
            httpRequest.onabort = errorCall;
            httpRequest.ontimeout = errorCall;
            return httpRequest;
        },
        /*根据文件标识符下载文件
        *fileType  1 图片    2 非图片，默认1
        */
        download: function (id, fileType) {
            fileType = fileType || 1;
            var secretId = psecret.create(id);
            window.open('/' + pconst.requestType.pdownload + '/' + (secretId || '') + '?ft=' + fileType);
        },
        /*根据参数下载文件
        *parm  object类型
        *url   同普通get、post请求的url
        */
        downloadByParam: function (url, param) {
            if (!url) return console.error('缺少请求地址');
            param = param || {};
            param.url = url;
            var paramStr = JSON.stringify(param);
            var secretStr = psecret.create(paramStr);

            var turnForm = document.createElement("form");
            document.body.appendChild(turnForm);
            turnForm.method = 'post';
            turnForm.action = '/' + pconst.requestType.pdownloadByParam;
            turnForm.target = '_blank';
            var newElement = document.createElement("textarea");
            newElement.setAttribute("name", "data");
            newElement.setAttribute("type", "hidden");
            newElement.value = secretStr;
            turnForm.appendChild(newElement);
            turnForm.submit();
            document.body.removeChild(turnForm);
        },
        /*update请求更新数据，参数释义同get请求
        *只要请求成功返回，即更新成功
        */
        update: function update(objParam) {
            var newParam = createParam(pconst.requestType.pupdate, objParam);
            return send(newParam);
        },
        /*
        *带有附件的更新操作，且文件已上传到网站后台，比如保存个人信息时包含头像，此时data内必须包含attachments属性，其它属性同update请求
        *attachments为数组或object， 其内每项的属性如下：
        *   path 文件的下载地址，即网站后台(非java端)后台返回的下载地址。必须
        *   subdirectory 保存到服务器上的子目录，必须
        *   toPro   此文件对应的属性名称
        *   multiFile 是否是多附件，默认true
        *   fileName    文件真实名称
        *   fileSuffix  文件后缀,不带点
        *   isNewFile   是不是新文件，默认true，为false时将不进行文件上传
        *   fileType    文件类型，1 图片   2 非图片，暂时只有fm系统会用到；默认1
        */
        updateWithFile: function updateWithFile(objParam) {
            var data = objParam.data || {};
            data.pwithAttachments = true;
            this.update(objParam);
        },
        /*
        *带有附件的更新操作，文件尚未上传到网站后台，比如填完表单并且选文件后，点击保存按钮，保存的同时上传文件；
        *   此时data内的每项均可包含attachments属性，其它属性同update请求
        *attachments为数组或object， 其内每项的属性如下：
        *   file <input type="file"/>标签所选择的文件对象
        *   subdirectory 保存到服务器上的子目录，必须
        *   toPro   此文件对应的属性名称
        *   multiFile 是否是多附件，默认true
        *   fileName    文件真实名称
        *   fileSuffix  文件后缀,不带点
        *   fileType    文件类型，1 图片   2 非图片，暂时只有fm系统会用到；默认1
        */
        updateBeforeWithFile: function updateBeforeWithFile(objParam) {
            var dataParam = objParam.data;
            var fileCount = 0;
            var alreadyFileCount = 0;
            var isError = false;

            parseAttachment([dataParam]);

            function parseAttachment(dataParamArr) {
                for (var x = 0; x < dataParamArr.length; x++) {
                    var currDataParam = dataParamArr[x];
                    for (var proName in currDataParam) {
                        if (currDataParam.hasOwnProperty(proName) == false) continue;
                        var proValue = currDataParam[proName];
                        if (proName == pconst.attachments) {
                            var attachments = proValue instanceof Array == true ? proValue : [proValue];
                            fileCount += attachments.length;
                            for (var i = 0; i < attachments.length; i++) {
                                var currAttachment = attachments[i];
                                (function (attachment) {
                                    _pajax.upload({
                                        file: attachment.file,
                                        success: function (data) {
                                            if (isError == true) return;
                                            attachment.path = data.showUrl;
                                            if (!attachment.fileName) attachment.fileName = data.name;
                                            if (!attachment.fileSuffix) attachment.fileSuffix = data.suffix;
                                            delete attachment.file;
                                            attachment.isNewFile = true;
                                            ++alreadyFileCount;
                                            if (alreadyFileCount == fileCount)
                                                _pajax.updateWithFile(objParam);
                                        },
                                        error: function (err) {
                                            if (isError == true) return;
                                            isError = true;
                                            if (typeof objParam.error == 'function') {
                                                consoleErr(objParam.url, err);
                                                objParam.error();
                                            }
                                        }
                                    });
                                })(currAttachment);
                            }
                            continue;
                        }
                        if (proValue instanceof Object == true) {
                            arguments.callee([proValue]);
                            continue;
                        }
                        if (proValue instanceof Array == true) {
                            arguments.callee(proValue);
                            continue;
                        }
                    }
                }
            };
        },

        /*登出系统*/
        loginOut: function () {
            window.location.href = '/' + pconst.requestType.ploginOut;
        }
    };

    var _pajax = new pajax();
    return _pajax;
})();