void function () {
    function appendZero(val) {
        return val < 10 ? '0' + val : val.toString();
    };

    var oneDayMillseconds = 1000 * 60 * 60 * 24;

    /*默认格式y/M/d    y 完整年份    M 带零的月份   d 带零的日    h 带零的小时    m 带零的分钟   s 带零的秒*/
    Date.prototype.format = function (formatter) {
        if (!formatter || formatter == "") {
            formatter = "y/M/d";
        }
        var year = '', month = '', day = '', hour = '', minute = '', second = '';

        var yearMarker = formatter.replace(/[^y]/g, '');
        if (yearMarker) year = this.getFullYear().toString();

        var monthMarker = formatter.replace(/[^M]/g, '');
        if (monthMarker) month = appendZero(this.getMonth() + 1);

        var dayMarker = formatter.replace(/[^d]/g, '');
        if (dayMarker) day = appendZero(this.getDate());

        var hourMarker = formatter.replace(/[^h]/g, '');
        if (hourMarker) hour = appendZero(this.getHours());

        var minuteMarker = formatter.replace(/[^m]/g, '');
        if (minuteMarker) minute = appendZero(this.getMinutes());

        var secondMarker = formatter.replace(/[^s]/g, '');
        if (secondMarker) second = appendZero(this.getSeconds());

        return formatter.replace(yearMarker, year).replace(monthMarker, month).replace(dayMarker, day)
            .replace(hourMarker, hour).replace(minuteMarker, minute).replace(secondMarker, second);
    };

    Date.prototype.getChineseWeek = function () {
        var currDay = this.getDay();
        switch (currDay) {
            case 0:
                return '周日';
            case 1:
                return '周一';
            case 2:
                return '周二';
            case 3:
                return '周三';
            case 4:
                return '周四';
            case 5:
                return '周五';
            case 6:
                return '周六';
        }
    };

    /*
    *取得当前所处周的第一天和最后一天及周的从1开始的索引，从周日到周六
    *返回{startTime:开始毫秒数,endTime:结束毫秒数,week:周的从1开始的索引}
    */
    Date.prototype.getWeekStartAndEnd = function () {
        var newDate = new Date(this.getTime());
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);

        var currDate = newDate.getDate();
        var currDay = newDate.getDay();

        newDate.setDate(currDate - currDay);
        var time1 = newDate.getTime();
        var firstWeekStartTime = newDate.getWeekArr()[0].startTime;

        newDate.setDate(newDate.getDate() + 6);
        var time2 = newDate.getTime();

        var week = (time1 - firstWeekStartTime) / oneDayMillseconds / 7 + 1;

        return { startTime: time1, endTime: time2, week: week };
    };

    /*
    *取得当前所处周的第一天和最后一天及周的从1开始的索引，从周一到周日
    *返回{startTime:开始毫秒数,endTime:结束毫秒数,week:周的从1开始的索引}
    */
    Date.prototype.getChineseWeekStartAndEnd = function () {
        var newDate = new Date(this.getTime());
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);

        var currDate = newDate.getDate();
        var currDay = newDate.getDay();
        currDay = currDay == 0 ? 7 : currDay;

        newDate.setDate(currDate - currDay + 1);
        var time1 = newDate.getTime();
        var firstWeekStartTime = newDate.getWeekArr()[0].startTime;

        newDate.setDate(newDate.getDate() + 6);
        var time2 = newDate.getTime();

        var week = (time1 - firstWeekStartTime) / oneDayMillseconds / 7 + 1;

        return { startTime: time1, endTime: time2, week: week };
    };

    //取得当前月的天数
    Date.prototype.getMonthLength = function () {
        var month = this.getMonth() + 1;
        var year = this.getFullYear();
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                if (year % 100 == 0 && year % 400 == 0) return 29;
                if (year % 100 != 0 && year % 4 == 0) return 29;
                return 28;
        }
    };

    //取得当前年的天数
    Date.prototype.getYearLength = function () {
        var year = this.getFullYear();
        if (year % 100 == 0 && year % 400 == 0) return 366;
        if (year % 100 != 0 && year % 4 == 0) return 366;
        return 365;
    };

    /*获取某月的周数组，数组内每项包含：startTime 开始日期的毫秒数     endTime  结束日期的毫秒数
    *每周均是从周日到周六
    *每月的周从第一个周日的那天(这天必须在当月内)开始算
    *  到最后一周的周六的那天(这天可以是下月的天)结束
    */
    Date.prototype.getWeekArr = function () {
        var year = this.getFullYear();
        var month = this.getMonth();

        var firstDay = 1;
        var lastDay = this.getMonthLength();

        var firstDate = new Date(year, month, 1, 0, 0, 0);
        var firstDayOfWeek = firstDate.getDay();
        if (firstDayOfWeek != 0) {
            firstDay = firstDay + (7 - firstDayOfWeek);
            firstDate.setDate(firstDay);
        }
        var firstTime = firstDate.getTime();

        var lastDate = new Date(year, month, lastDay, 0, 0, 0);
        var lastDayOfWeek = lastDate.getDay();
        var middleDay = 6 - lastDayOfWeek;
        var oneDayTime = 24 * 60 * 60 * 1000;;
        var middleTime = middleDay * oneDayTime;
        lastDate.setTime(lastDate.getTime() + middleTime);
        var lastTime = lastDate.getTime();

        var middleDay = ((lastTime - firstTime) / oneDayTime + 1) / 7;
        var returnArr = [];
        for (var i = 0; i < middleDay; i++) {
            var currTime1 = firstTime + i * 7 * oneDayTime;
            var currTime2 = currTime1 + 6 * oneDayTime;

            var date1 = new Date(currTime1);
            var date2 = new Date(currTime2);
            returnArr.push({
                startTime: currTime1,
                endTime: currTime2
            });
        }
        return returnArr;
    };
}();