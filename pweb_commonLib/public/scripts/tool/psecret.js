var psecret = (function () {
    function psecret() {
    };
    psecret.prototype = {
        create: function (val) {
            if (!val && val != 0) return null;
            var strVal = val.toString();
            var codeArr = [];
            for (var i = 0; i < strVal.length; i++) {
                codeArr.push(strVal[i].charCodeAt().toString(16));
            }
            return encodeURIComponent(codeArr.join(','));
        },
        parser: function (val) {
            if (!val && val !== 0) return null;
            var strVal = decodeURIComponent(val.toString());
            var codeArr = strVal.split(',');
            var str = '';
            for (var i = 0; i < codeArr.length; i++) {
                str += String.fromCharCode(parseInt(codeArr[i], 16));
            }
            return str;
        },
        getUrlParam: function (parName, req) {
            if (!parName) return null;
            if (req) return this.parser(req.query[parName]);

            var reg = new RegExp('(^|&)' + parName + '=([^&]*)(&|$)', 'i');
            var referer = (req ? req.headers.referer : null) || '';
            var r = window.location.search.substr(1).match(reg);
            var val = r != null ? unescape(r[2]) : null;
            if (!val) return null;
            return this.parser(val);
        }
    };

    var secretObj = new psecret();
    return typeof module != 'undefined' ? (module.exports = secretObj) : secretObj;
})();