var ptool = (function () {
    function ptool() {
    };
    ptool.prototype = {
        //空字符转成特定字符串
        emptyStrToHline: function (str) {
            if (!str && str !== 0) return pconst.emptyReplaceStr;
            return str;
        },
        //获取url参数值
        getUrlParVal: function (parName) {
            var reg = new RegExp('(^|&)' + parName + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            return r != null ? unescape(r[2]) : null;
        },
        //对象深拷贝
        objectClone: function (sourceObj) {
            return Object.getPrototypeOf(Object.create(sourceObj));
        },
        /*色彩的变化规律 RGB各值减15 最小为零  纯白色的hover色值为f8f8f8  即rgb(233,233,233)*/
        colorChangeToHover: function (sourceColor) {
            var rcolor, gcolor, bcolor;
            if (sourceColor.indexOf('#') > -1) {
                sourceColor = sourceColor.substring(1);
                rcolor = parseInt(sourceColor.substr(0, 2), 16);
                gcolor = parseInt(sourceColor.substr(2, 2), 16);
                bcolor = parseInt(sourceColor.substr(4, 2), 16);
            }
            else if (sourceColor.indexOf('rgba') > -1) {
                var arr = sourceColor.split(',');
                rcolor = parseInt(arr[0].substring(5));
                gcolor = parseInt(arr[1].substring(0));
                bcolor = parseInt(arr[2].substring(0));
            } else if (sourceColor.indexOf('rgb') > -1) {
                var arr = sourceColor.split(',');
                rcolor = parseInt(arr[0].substring(4));
                gcolor = parseInt(arr[1].substring(0));
                bcolor = parseInt(arr[2].substring(0, arr[2].length - 1));
            }

            if (rcolor == 255 && gcolor == 255 && bcolor == 255) return 'rgb(233,233,233)';
            rcolor = Math.max(rcolor - 15, 0);
            gcolor = Math.max(gcolor - 15, 0);
            bcolor = Math.max(bcolor - 15, 0);
            return 'rgb(' + rcolor + ',' + gcolor + ',' + bcolor + ')';
        },
        /*产生id*/
        produceId: function () {
            var chartArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
            var time = Date.now();
            var random = Math.floor(Math.random() * (Math.pow(10, 6)));
            var indexStr = time + '' + random;
            var str = '';
            for (var i in indexStr) {
                if (indexStr.hasOwnProperty(i) === false) continue;
                str += chartArr[indexStr[i]];
            }
            return str;
        },
        /*根据传入element取得对应的jquery对象*/
        getJqElement: function (element) {
            var dom = this.getDomElement(element);
            return dom ? $(dom) : false;
        },

        /*根据传入element取得对应的dom对象*/
        getDomElement: function (element) {
            return !element ? false : typeof element === 'object' && element.selector != void 0 ? element[0] :
                   typeof element === 'object' && element.selector == void 0 ? element :
                   typeof element === 'string' ? document.getElementById(element) : null;
        },

        /**
         * @method constructorTree 构造树形菜单
         * @param {Array} sourceArr 源数组
         * @param {String} idPro 每一项的标识对应的属性名称
         * @param {String} parentIdPro 每一项的对应父级标识的属性名称
         * @param {String} childPro 构造出的树形结构的每一项的子级属性名称
         * @return {Array}
         */
        constructorTree: function (sourceArr, idPro, parentIdPro, childPro) {
            if (!sourceArr || sourceArr.length == 0) return [];
            var rootArr = [];
            var rootParentId;
            for (var i = 0; i < sourceArr.length; i++) {
                /*找寻第一级；第i项的父级不存在时，以第i项的父级标识值作为根级的父级标识值*/
                rootArr = sourceArr.filter(function (a) {
                    return a[idPro] == sourceArr[i][parentIdPro];
                });
                if (rootArr.length == 0) {
                    rootParentId = sourceArr[i][parentIdPro];
                    break;
                }
            }
            return find(rootParentId, sourceArr, 1);

            /*如果某项的父级id等于参数parentId的值，则找到了此项*/
            function find(parentId, arr, level) {
                var returnArr = [];
                for (var j = 0; j < arr.length; j++) {
                    var curr = arr[j];
                    var currParentId = curr[parentIdPro];
                    if (currParentId != parentId) continue;

                    curr.level = level;
                    curr[childPro] = arguments.callee(curr[idPro], arr, level + 1);
                    returnArr.push(curr);
                }
                return returnArr;
            };
        },

        /**
         * @method findItemById 根据标识从树形菜单或数组中匹配对应项
         * @param {Array} sourceArr 树形菜单或数组
         * @param {String} idValue 要匹配的值
         * @param {String} idPro 要匹配属性值的属性名称
         * @param {String} childPro 树形菜单时，每一项的子级属性名称
         * @return {Object | Boolean} 找到匹配项时，返回匹配项；否则返回false
        */
        findItemById: function (sourceArr, idValue, idPro, childPro) {
            for (var i = 0; i < sourceArr.length; i++) {
                var curr = sourceArr[i];
                if (curr[idPro] == idValue) return curr;
                if (childPro) {
                    var findResult = arguments.callee(curr[childPro] || [], idValue, idPro, childPro);
                    if (findResult) return findResult;
                }
            }
            return false;
        },

        /**
         * @method getDataGranularity 根据控件库的时间控件，判断图表的数据粒度
         * @param {Object} timeTarget 时间控件
         * @return {String} 返回值：yy 数据以年为粒度；y 数据以月为粒度；M 数据以日为粒度；d 数据以小时为粒度
        */
        getDataGranularity: function (timeTarget) {
            var timeObj = timeTarget.psel();
            var controlTimeType = timeObj.timeType;
            var differTime = timeObj.realEndTime - timeObj.startTime;
            var oneDayTime = 1000 * 60 * 60 * 24;
            switch (controlTimeType) {
                case pconst.dataGranularity.y:
                    return differTime <= 366 * oneDayTime ? pconst.dataGranularity.y : pconst.dataGranularity.yy;
                case pconst.dataGranularity.M:
                    return differTime <= 31 * oneDayTime ? pconst.dataGranularity.M : pconst.dataGranularity.y;
                case pconst.dataGranularity.w:
                case pconst.dataGranularity.d:
                    return differTime <= 7 * oneDayTime ? pconst.dataGranularity.d : pconst.dataGranularity.M;
            }
            return pconst.dataGranularity.d;
        },

        /**
         * @method formatGranularityToJava 根据数据粒度，格式化传给后台的值
         * @param {Object | string} param 参数为object类型时，则为时间控件对应的element；否则为粒度值，数据粒度的解释见pconst.dataGranularity
         * @return {Int} 返回值：5 以年为粒度；4 以月为粒度； 2 以天为粒度； 1 以小时为粒度
        */
        formatGranularityToJava: function (param) {
            var granularity = typeof param == 'object' ? this.getDataGranularity(param) : param;
            switch (granularity) {
                case pconst.dataGranularity.yy:
                    return 5;
                case pconst.dataGranularity.y:
                    return 4;
                case pconst.dataGranularity.M:
                    return 2;
                case pconst.dataGranularity.d:
                    return 1;
            }
            return -1;
        },
        /**
         * @method formatChartX 根据数据粒度，格式化x轴；注：仅限于x轴是时间的情况
         * @param {string} dataGranularity 数据粒度，解释见pconst.dataGranularity
        */
        formatChartX: function (dataGranularity) {
            return (function (_dataGranularity) {
                return function (value, index) {
                    value = (typeof echarts) != 'undefined' ? value : (typeof Highcharts) != 'undefined' ? this.value : '';
                    if (!value) return '';
                    var time = parseInt(value);
                    var date = new Date(time || value);
                    switch (granularity) {
                        case pconst.dataGranularity.yy: return date.format('y');
                        case pconst.dataGranularity.y: return date.format('y.M');
                        case pconst.dataGranularity.M: return date.format('M.d');
                        case pconst.dataGranularity.d: return date.format('h:m');
                    }
                };
            })(dataGranularity);
        },
        /**
         * @method formatChartTip 格式化chart的数据提示
        */
        formatChartTip: function () {
            return (function () {
                return function () { };
            })();
        }
    };
    var ptoolObj = new ptool();
    return typeof module != 'undefined' ? (module.exports = ptoolObj) : ptoolObj;
})();