void function () {
    var objFn = {
        /*格式化日期
        *formatStr 格式字符串： 默认格式y/M/d    y 完整年份    M 带零的月份   d 带零的日    h 带零的小时    m 带零的分钟   s 带零的秒
        */
        formatDate: function formatDate(formatStr) {
            var date = new Date(this);
            if (date == 'Invalid Date') return '';
            return date.format(formatStr);
        },
        /*去掉换行*/
        ptrimLine: function ptrimLine() {
            return this.replace(/[\r\n]/g, '');
        },
        /*去掉首尾空格*/
        ptrimHeadTail: function ptrimHeadTail() {
            return this.replace(/(^\s*)|(\s*$)/g, '');
        },
        /*去掉所有空格*/
        ptrimAll: function ptrimAll() {
            return this.replace(/\s+/g, '');
        },
        /*验证手机号 只支持现有的17个号段*/
        pisMobile: function pisMobile() {
            return (/^1(30|31|32|33|34|35|36|37|38|39|45|47|50|51|52|53|55|56|57|58|59|70|76|77|78|80|81|82|83|84|85|86|87|88|89)\d{8}$/.test(this.ptrimHeadTail()));
        },
        /*验证电话 区号(3到4位)-电话号码(7到8位)-分机号(3到4位)*/
        pisTel: function pisTel() {
            return (/^((0\d{2,3})-)?(\d{7,8})(-(\d{3,4}))?$/.test(this.ptrimHeadTail()));
        },
        /*验证是否为数字，正整数、负整数、正小数、负小数都将返回true*/
        pisNumber: function pisNumber() {
            if (this.pisPositiveNumber()) return true;
            if (this.pisNegativeNumber()) return true;
            return false;
        },
        /*验证是否为正数，正整数、正小数都将返回true*/
        pisPositiveNumber: function pisPositiveNumber() {
            if (this.pisPositiveInt()) return true;
            return /^[0-9]+\.[0-9]+$/.test(this.ptrimHeadTail());
        },
        /*验证是否为负数，负整数、负小数都将返回true*/
        pisNegativeNumber: function pisNegativeNumber() {
            if (this.pisNegativeInt()) return true;
            return /^-[0-9]+\.[0-9]+$/.test(this.ptrimHeadTail());
        },
        /*验证整数，正整数、负整数都返回true*/
        pisInt: function pisInt() {
            if (this.pisPositiveInt()) return true;
            if (this.pisNegativeInt()) return true;
            return false;
        },
        /*验证是否是正整数*/
        pisPositiveInt: function pisPositiveInt() {
            return /^[0-9]+$/.test(this.ptrimHeadTail());
        },
        /*验证是否是负整数*/
        pisNegativeInt: function pisNegativeInt() {
            return /^-[1-9][0-9]*$/.test(this.ptrimHeadTail());
        },
        /*验证身份证合法性 纯数字15位  纯18位数字 17位数字+ X|x*/
        pisCard: function pisCard() {
            return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(this.ptrimHeadTail());
        },
        /*验证email*/
        pisEmail: function pisEmail() {
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.ptrimHeadTail());
        },
        /*验证是否为汉字*/
        pisChinese: function pisChinese() {
            return /^[\u4e00-\u9fa5]{0,}$/.test(this.ptrimHeadTail());
        },
        /*验证是否为空格*/
        pisSpace: function pisSpace() {
            return this.ptrimHeadTail() === '';
        },
        /*验证长度*/
        pvalidLength: function pvalidLength(length) {
            return this.ptrimHeadTail().length <= length;
        }
    };
    for (var fn in objFn) {
        if (objFn.hasOwnProperty(fn) === false) continue;
        String.prototype[fn] = objFn[fn];
        String.prototype[fn].fnName = fn;
    }
}();