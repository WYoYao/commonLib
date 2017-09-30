//浮点加数运算
Math.summation = function (arg1, arg2) {
    if (isNaN(parseFloat(arg1)) && isNaN(parseFloat(arg2))) return null;
    if (isNaN(parseFloat(arg1))) return arg2;
    if (isNaN(parseFloat(arg2))) return arg1;
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    var first = Math.multiplication(arg1, m);
    var second = Math.multiplication(arg2, m);
    return (first + second) / m;
};

//浮点数减法运算
Math.subtraction = function (arg1, arg2) {
    if (isNaN(parseFloat(arg1))) return null;
    if (isNaN(parseFloat(arg2))) return arg1;
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length
    } catch (e) {
        r1 = 0
    }
    try {
        r2 = arg2.toString().split(".")[1].length
    } catch (e) {
        r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2));
    var first = Math.multiplication(arg1, m);
    var second = Math.multiplication(arg2, m);
    return (first - second) / m;
};

//乘法
Math.multiplication = function (arg1, arg2) {
    if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) return null;
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
};

//浮点数相除求商
Math.quotient = function (arg1, arg2) {
    if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) return null;
    if (arg2 == 0) return null;
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    var first = Math.multiplication(arg1, m);
    var second = Math.multiplication(arg2, m);
    return parseInt(first / second);
};

//浮点数相除求余
Math.remainder = function (arg1, arg2) {
    if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) return null;
    if (arg2 == 0) return null;
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    var first = Math.multiplication(arg1, m);
    var second = Math.multiplication(arg2, m);
    var res = first % second;
    return res / m;
};

//浮点数相除求结果
Math.division = function (arg1, arg2) {
    if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) return null;
    if (arg2 == 0) return null;
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    var first = Math.multiplication(arg1, m);
    var second = Math.multiplication(arg2, m);
    return first / second;
};

/*小数点截取位数，包括0位。参数为object类型，包含属性如下：
*value 转换前的值
*fixedNum 小数位数，默认1位
*isByInt 是否根据整数位来转换，默认false，为true时（fixedNum参数无效）的转换规则为：整数位大于0，小数位保留1位有效数字；整数位等于0，小数位保留3位有效数字
*isToSpecial 当值是非数字时是否转为特殊字符，默认true，为false时返回null。特殊字符的定义见tool/pajax.js
*/
Math.toFixed = function (objParam) {
    objParam = objParam || {};
    var value = objParam.value;
    var fixedNum = objParam.fixedNum;
    var isByInt = objParam.isByInt;
    var isToSpecial = objParam.isToSpecial === false ? false : true;

    var numValue = parseFloat(value);
    var numValue2 = Number(value);
    if ((!numValue || !numValue2) && numValue !== 0) return isToSpecial ? pconst.emptyReplaceStr : null;

    var isNegative = numValue < 0 ? true : false;
    numValue = Math.abs(numValue);

    isByInt = isByInt !== true ? false : true;
    fixedNum = isByInt == true ? (numValue >= 1 ? 1 : 3) : fixedNum === 0 || fixedNum ? fixedNum : 1;

    var returnStr = numValue.toFixed(fixedNum);
    while (returnStr.indexOf('.') > -1 && returnStr.lastIndexOf('0') == returnStr.length - 1 && returnStr.lastIndexOf('0') > returnStr.indexOf('.')) {
        returnStr = returnStr.substring(0, returnStr.length - 1);
    }
    returnStr = isNegative ? '-' + returnStr : returnStr;
    return parseFloat(returnStr);
};