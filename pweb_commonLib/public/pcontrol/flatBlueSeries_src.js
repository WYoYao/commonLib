var p_control=(function () {;function persagy_tool() {
    this.extendFnName = 'pinit';
    this.construPrefix = 'persagy_';
    this.fnPrefix = 'create_';
    this.instanceSuffix = '_instance';
    this.enterName = 'controlInit';
};

/*动态创建控件实例*/
persagy_tool.prototype.constructorCon = function (controlType) {
    var fnName = this.joinConstruName(controlType);
    return persagy_tool.instanceFactory(fnName);
};

/*创建控件*/
persagy_tool.prototype.createControl = function (controlType, childType, parent, obj) {
    var constructorInstance = this.constructorCon(controlType);
    return constructorInstance[this.enterName] ? constructorInstance[this.enterName](childType, parent, obj) : '';
};

/*拼接控件类名称*/
persagy_tool.prototype.joinConstruName = function (suffix) {
    return this.construPrefix + suffix;
};

/*拼接控件类创建控件的方法名称*/
persagy_tool.prototype.joinFnName = function (suffix) {
    return this.fnPrefix + suffix;
};

/*拼接实例名称*/
persagy_tool.prototype.joinInstanceName = function (fnName) {
    return fnName + this.instanceSuffix;
};

persagy_tool.getInstance = function () {
    return persagy_tool.instanceFactory('persagy_tool');
};

/*实例工厂*/
persagy_tool.instanceFactory = function (name) {
    var fn = eval(name);
    return fn._instance || (fn._instance = new fn()) || fn._instance;
}
;/*博锐尚格控件库  公共js*/
function persagy_public() {
    /*默认所有控件都具有自定义text属性*/
    this.customAttr = {
        'id': 'id'
        , 'text': 'text'
        , 'value': 'value'
        , 'visible': 'visible'
        , 'icon': 'icon'
    };
    this.persagyCreateBind = 'p-bind';
    this.persagyTypeAttr = 'p-type';
    this.persagyCreateType = 'p-create';
    this.persagyRely = 'p-rely';
    this.persagyEleObjAttr = 'pattr';
    /*在循环绑定内创建控件时，请给此标记赋上循环内容的父级元素ID值，现阶段仅支持一层的循环绑定*/
    this.persagyEachId = 'p-eachid';
    this.animateTime = 300;             /*动画执行时间 毫秒*/
    this.typeSeparator = '-';
    this.specialChart = '*';
    this.specialChartRegExp = new RegExp(/\*/g);
};

persagy_public.prototype.joinPtype = function (controlType, childType) {
    return controlType + this.typeSeparator + childType;
};

/*根据传入parent取得对应的jquery对象*/
persagy_public.prototype.getDomElement = function (parent) {
    return !parent ? null : typeof parent === 'object' && parent.selector != void 0 ? parent[0] :
           typeof parent === 'object' && parent.selector == void 0 ? parent :
           typeof parent === 'string' ? document.getElementById(parent) : null;
};

/*根据p-create取得控件类型*/
persagy_public.prototype.initPtype = function (target) {
    target = this.getDomElement(target);
    var typeValue = target.getAttribute(this.persagyCreateType) || '';
    var types = typeValue.split(this.typeSeparator);
    var controlType = types[0];
    var childType = types[1];
    return {
        controlType: controlType, childType: childType
    };
};

/*分解p-type*/
persagy_public.prototype.parsePtype = function (target) {
    target = this.getDomElement(target);
    var typeValue = target.getAttribute(this.persagyTypeAttr) || '';
    var types = typeValue.split(this.typeSeparator);
    var controlType = types[0];
    var childType = types[1];
    return {
        controlType: controlType, childType: childType
    };
};

/*根据传入parent取得要创建的控件类型、控件子类型、绑定的属性、绑定的事件*/
persagy_public.prototype.parseParent = function (parent) {
    parent = this.getDomElement(parent);
    var strBind = parent.getAttribute(this.persagyCreateBind) || '';
    if (strBind.indexOf('{') !== 0)
        strBind = '{' + strBind + '}';
    var objBind = eval('(' + strBind + ')');
    return this.parsePbind(objBind);
};

/*解析绑定的属性和事件 以便取得字符串的属性、事件*/
persagy_public.prototype.parsePbind = function (pind) {
    if (!pind) return {};
    var objAttr = pind['attr'] || {};
    var objEvent = pind["event"] || {};
    if (objAttr instanceof Array === true) {
        var arr = [];
        var arrEvent = objEvent instanceof Array ? objEvent : [];
        var ooEvent = objEvent instanceof Object ? objEvent : null;

        for (var index = 0; index < objAttr.length; index++) {
            var curr = objAttr[index];
            var currEvent = arrEvent[index] || this.objectCopy(ooEvent || {});

            var oo = arguments.callee({ attr: curr, event: currEvent });

            arr.push(oo);
        }
        return arr;
    }

    return {
        attr: objAttr, event: objEvent
    };
};

persagy_public.prototype.getBind = function (parent) {
    if (!parent) return {};
    parent = this.getDomElement(parent);
    var isRely = parent.getAttribute(this.persagyRely) == 'true' ? true : false;
    var obj = isRely == true ? persagy_toBind.getInstance().parseParent(parent) : this.parseParent(parent);
    obj.isRely = isRely;
    obj.eachId = parent.getAttribute(this.persagyEachId);
    return obj;
};

/*追加html*/
persagy_public.prototype.appendHtml = function (parent, html) {
    if (!html) return;
    parent = this.getDomElement(parent);
    if (parent == void 0) return;
    parent.innerHTML = '';
    parent.innerHTML = html;
    if (parent.removeAttribute) {
        parent.removeAttribute(this.persagyCreateBind);
        parent.removeAttribute(this.persagyCreateType);
        parent.removeAttribute(this.persagyRely);
        parent.removeAttribute(this.persagyEachId);
    }
};

/*产生id*/
persagy_public.prototype.produceId = function () {
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
};

/*
*父元素追加节点并监控父元素内节点变化 新加节点在页面上呈现后 给新节点注册事件
*parent 父元素  html字符串形式的子元素 objEvents object类型,格式如下：
*{
*  id:{
*       eventName:eventFn,
*       eventName:eventFn
*     }
*}属性释义如下：
*   id的值为元素id,即把id的值做完属性名称
*   eventName  事件名称   eventFn 事件回调函数
*/
persagy_public.prototype.monitorHtmlAppEvent = function (parent, html, objEvents, initCall) {
    objEvents = objEvents || {};
    parent = this.getDomElement(parent);
    var _this = this;
    if (!html) return nodeInserted();
    function nodeInserted() {
        for (var currId in objEvents) {
            if (objEvents.hasOwnProperty(currId) === false) continue;
            var element = document.getElementById(currId);
            _this.domRegEvent(element, objEvents[currId]);
        };
        parent.removeEventListener ? parent.removeEventListener('DOMNodeInserted', arguments.callee) : '';
        if (typeof initCall === 'function') initCall();
    }

    if (parent.removeEventListener) {
        this.domRegEvent(parent, {
            'DOMNodeInserted': nodeInserted
        });
    } else {
        var htmlInterval = setInterval(function () {
            if (parent.childNodes.length === 0) return;
            clearInterval(htmlInterval);
            nodeInserted();
        }, 10);
    }
    this.appendHtml(parent, html);
};

/*根据样式类生成样式字符串*/
persagy_public.prototype.createStyleByClass = function (classStr) {
    if (!classStr) return '';
    var classArr = classStr.split(/\s{1,}/g).filter(function (curr) { return curr != ''; });
    var styleSheets = document.styleSheets;
    var styleStr = '';
    classArr.forEach(function (curr) {
        for (var i = 0; i < styleSheets.length; i++) {
            var currRules = styleSheets[i].cssRules;
            if (!currRules) continue;
            var isFind = false;
            for (var j = 0; j < currRules.length; j++) {
                var currRule = currRules[j];
                if (currRule.selectorText == null || currRule.cssText == null) continue;
                var ruleSelctor = currRule.selectorText.substr(1, currRule.selectorText.length);
                if (ruleSelctor === curr) {
                    var cssText = currRule.cssText;
                    cssText = cssText.substring(cssText.indexOf('{') + 1, cssText.indexOf('}'));
                    styleStr += cssText;
                    isFind = true;
                    break;
                }
            }
            if (isFind === true) break;
        }
    });
    return styleStr;
};

/*生成自定义特性*/
persagy_public.prototype.appendAttribute = function (objAttr) {
    var attrStr = '';
    objAttr = objAttr || {};
    for (var attr in objAttr) {
        if (objAttr.hasOwnProperty(attr) === false) continue;
        if (this.customAttr[attr]) continue;
        attrStr += ' ' + attr + '="' + objAttr[attr] + '"';
    }
    return attrStr;
};

/*根据objAttr创建style*/
persagy_public.prototype.createStyle = function (objAttr) {
    objAttr = objAttr || {};
    var oldStyle = objAttr.style || '';
    var newStyle = this.createStyleByClass(objAttr[this.customAttr.class]);
    return oldStyle + newStyle;
};

/*
*复制object返回新对象 只复制对象本身的成员
*之所以不扩展到object上,是因为会对jquery带来影响
*/
persagy_public.prototype.objectCopy = function (obj) {
    var newObj = {};
    for (var pro in obj) {
        if (obj.hasOwnProperty(pro) === false) continue;
        newObj[pro] = obj[pro];
    }
    return newObj;
};

/*
*把objAttr上(不包括原型上)不属于defaultAttr的属性转为字符串并返回
*/
persagy_public.prototype.attrToStr = function (objAttr, defaultAttr) {
    for (var pro in objAttr) {
        if (objAttr.hasOwnProperty(pro) === false) continue;
        if (pro in defaultAttr) delete objAttr[pro];
    }
    var strAttr = JSON.stringify(objAttr) || '';
    strAttr = strAttr.replace(/({"|}|{})/g, '').replace(/,"/g, ' ').replace(/":/g, '=').replace(/\\"/g, '\'');
    return strAttr;
};

/*追加全局遮罩*/
persagy_public.prototype.createMask = function (element) {
    if (!element) element = document.body;
    var mask = this.globalMask();
    if ($(mask.selector).length === 0)
        $(element).append(mask.html);
};

/*全局遮罩*/
persagy_public.prototype.globalMask = function () {
    return {
        html: '<div class="pcoverBody" pc="true"></div>',
        selector: 'div[class="pcoverBody"][pc="true"]'
    };
};

/*显示遮罩*/
persagy_public.prototype.maskShow = function () {
    $(this.globalMask().selector).fadeIn();
};

/*隐藏遮罩*/
persagy_public.prototype.maskHide = function () {
    $(this.globalMask().selector).fadeOut(600);
};

/*控件初始化*/
persagy_public.prototype.controlInit = function (type, parent, obj) {
    var objBind = obj || this.getBind(parent);
    /*所有的属性*/
    var objAttr = objBind.attr || {};
    /*所有的事件*/
    var objEvent = objBind.event || {};

    var watchEle = objBind.eachId != null ? (document.getElementById(objBind.eachId) || $(parent).parent()[0]) : parent;
    return this.createHtml(objAttr, objEvent, type, objBind.isRely, parent, watchEle);
};

/*构造某一控件的选择器*/
persagy_public.prototype.joinSelector = function (control) {
    var selectorStr = '';
    var cbTypes = control.childType;
    for (var t in cbTypes) {
        if (cbTypes.hasOwnProperty(t) == false) continue;
        selectorStr += ',[' + this.persagyTypeAttr + '="' + this.joinPtype(control.name, t) + '"]';
    }
    return selectorStr.substr(1);
};

/*解析模板 以便模板中可创造控件*/
persagy_public.prototype.parseTemplate = function (template) {
    var templateHtml = $(template).html();
    var _this = this;
    var templateJquery = $(templateHtml.replace(/\s+|\n/g, " ").replace(/>\s</g, "><").ptrimHeadTail());

    var tempArr = [];
    var temp = $('<div></div>');
    templateJquery.appendTo(temp);
    templateJquery = temp;

    templateJquery.find('[' + _this.persagyCreateType + ']').each(function () {
        var objBind = _this.initPtype(this);
        persagy_control.init(objBind.controlType, objBind.childType, this, null);
        return;

        var typeObj = _this.initPtype(this);
        var objBind = _this.getBind(this);
        objBind.attr = objBind.attr || {};
        objBind.event = objBind.event || {};
        var id = _this.produceId();
        $(this).attr(id, id);
        var tempHtml = persagy_control.init(typeObj.controlType, typeObj.childType, null, objBind);
        var currHtml = '';
        var otherEvent = [];
        typeof tempHtml == 'string' ? currHtml = tempHtml : currHtml = tempHtml.html, otherEvent = tempHtml.otherEvent;
        /*_this.appendHtml(this, currHtml);*/
        objBind.otherEvent = otherEvent;
        var currPtInstance = persagy_tool.getInstance().constructorCon(typeObj.controlType);
        tempArr.push([currPtInstance.registerEvent(objBind), id]);
    });
    return $(template).html(templateJquery.html());
    return {
        templateHtml: templateJquery[0].innerHTML,
        eventArr: tempArr
    };
};

/*注册模板内的控件的事件*/
persagy_public.prototype.regiTempConEvent = function (objBind, container) {
    var otherEvent = objBind.otherEvent || [];
    for (var i = 0; i < otherEvent.length; i++) {
        var currOe = otherEvent[i];
        var currTargets = $(container).find('[' + currOe[1] + ']');
        currTargets.each(function () {
            currOe[0].call(this, { srcElement: this });
        });
    }
};

persagy_public.prototype.createControlByCreateType = function (parent) {
    var _this = this;
    $(parent).find('[' + this.persagyCreateType + ']').each(function () {
        var objBind = _this.initPtype(this);
        persagy_control.init(objBind.controlType, objBind.childType, this, null);
    });
};

persagy_public.prototype.getInsertedSrcJqEle = function (event, id) {
    var srcTarget = $(event.srcElement || event.target);
    if (srcTarget.attr(this.persagyTypeAttr)) return srcTarget.attr('id') == id ? srcTarget : null;
    var src = srcTarget.find('[' + this.persagyTypeAttr + ']').filter('[id="' + id + '"]');
    return src.length > 0 ? src : null;
};

persagy_public.getInstance = function () {
    return persagy_tool.instanceFactory('persagy_public');
};
;/*一些事件说明：
    DOMActivate ie不支持  chrome可以 激活事件 晚于click 不知道有什么用
    DOMCharacterDataModified chrome、ie都支持  对于内容是纯文本的元素文本改变时会触发此事件
    DOMFocusIn  DOMFocusOut  ie不支持 貌似和focus、blur没区别
    DOMNodeInserted DOMNodeInsertedIntoDocument DOMNodeRemoved DOMNodeRemovedFromDocument
        ie支持  元素内进行节点添加、删除会激发的事件 注：添加时 是页面改变后触发  移除时 是触发后页面才改变
        DOMNodeInserted 给元素追加的为一个大节点时会激发一次   多个并行节点时触发多次
    DOMSubtreeModified ie支持 元素内节点添加、删除时激发此事件  不论什么操作 都是页面改变后才触发此事件  
*/
/*自定义事件*/
function persagy_event() {
    this.isRegEvent = 'p_event';    /*把此属性的值追加上元素 以便判断元素是否注册过自定义事件*/
    this.eventOthAttribute = 'pEventAttr';    /*此属性值作为属性追加到event上，以暴漏给使用者*/
    this.insertedEvent = 'DOMNodeInserted';
    this.textModified = 'DOMCharacterDataModified';
    this.constructor = arguments.callee;
};
persagy_event.prototype = new persagy_public();

/*
*创建事件 自定义事件
*eventType 事件类型,其值为type内的属性值  eventName 事件名称
*/
persagy_event.prototype.createEvent = function (eventType, eventName) {
    if (!document.pevents) document.pevents = {};
    if (document.pevents[eventName] != null) return;
    var eve = document.createEvent(eventType);
    eve.initEvent(eventName, false, true);
    document.pevents[eventName] = eve;
};

/*
*元素上增加事件监听 自定义事件
*eventName 事件名称  element html元素  eventCall 事件执行函数
*/
persagy_event.prototype.elementRegEvent = function (eventName, element, eventCall) {
    element.addEventListener(eventName, function (event) {
        if (typeof eventCall === 'function') {
            eventCall(event);
        }
    }, false);
};

/*元素触发事件  自定义事件*/
persagy_event.prototype.triggerEvent = function (eventName, element, eventData) {
    if (document.pevents[eventName] == null) throw 'eventName not exist';
    var eve = document.pevents[eventName];
    eve[this.eventOthAttribute] = eventData;
    element.dispatchEvent(document.pevents[eventName]);
};

/*元素增加事件  dom事件 注册事件前会把之前的同类型事件注销掉
* element 元素 eventObj 事件,object类型，格式如：'click':function(){}
*/
persagy_event.prototype.domRegEvent = function (element, eventObj, isDelOld) {
    element = this.getDomElement(element);
    if (typeof eventObj !== 'object') return;
    for (var eventName in eventObj) {
        if (eventObj.hasOwnProperty(eventName) === false) continue;
        var eventFn = eventObj[eventName];
        var fnType = typeof eventFn;

        eventName = eventName.replace(/on/g, '');
        var eventNameO = '_' + eventName;
        switch (fnType) {
            case 'string':
                eventFn = eventFn.replace(/\(\)/g, '');
                eventFn = this.findFn(eventFn);
            case 'function':
                if (element[eventNameO] != null && isDelOld != false)
                    element.addEventListener ? element.removeEventListener(eventName, element[eventNameO]) :
                        element.detachEvent('on' + eventName, element[eventNameO]);

                element.addEventListener ? element.addEventListener(eventName, eventFn, false) :
                element.attachEvent('on' + eventName, eventFn);
                element[eventNameO] = eventFn;
                break;
        }
    }
};

persagy_event.prototype.removeEvent = function (ele, eventName) {
    ele = this.getDomElement(ele);
    var eventNameO = '_' + eventName;
    ele.removeEventListener(eventName, ele[eventNameO]);
};

/*寻找function*/
persagy_event.prototype.findFn = function (fnName) {
    var typeOf = typeof fnName;
    switch (typeOf) {
        case 'function':
            return fnName;
        case 'string':
            fnName = fnName.replace(/\(\)/g,'');
            return this[fnName] != void 0 ? this[fnName] :
                window[fnName] != void 0 ? window[fnName] :
                new Function('event', '');
        default:
            return new Function('event', '');
    }
};

/*注册控件父级的DOMNodeInserted事件  以便监视控件的改变*/
persagy_event.prototype.regInserted = function (ele, call, isDelOld) {
    var event = {};
    event[this.insertedEvent] = call;
    this.domRegEvent(ele, event, isDelOld);
};

/*控件的DOMNodeInserted事件  控件内容改变时阻止冒泡*/
persagy_event.prototype.regConInserted = function (ele) {
    var event = {};
    event[this.insertedEvent] = anonymity();
    this.domRegEvent(ele, event);

    function anonymity() {
        return (function () {
            return function (event) {
                event.stopBubbling();
                event.stopDefault();
            };
        })();
    }
};

persagy_event.getInstance = function () {
    return persagy_tool.instanceFactory('persagy_event');
};
;/*此方法的实例返回给调用者
*HTMLElement Element貌似没法访问
*/
function persagyElement(id) {
    this.constructor = arguments.callee;
    this.id = id;
};

/*persagyElement.prototype = document.createElement('div');*/

persagyElement.prototype.click = function () {
    document.getElementById(this.id).click();
};
persagyElement.prototype.mousedown = function () {
    document.getElementById(this.id).mousedown();
};
persagyElement.prototype.mouseup = function () {
    document.getElementById(this.id).mouseup();
};
persagyElement.prototype.mouseover = function () {
    document.getElementById(this.id).mouseover();
};
persagyElement.prototype.mouseout = function () {
    document.getElementById(this.id).mouseout();
};
persagyElement.prototype.mouseenter = function () {
    document.getElementById(this.id).mouseenter();
};
persagyElement.prototype.mousewheel = function () {
    document.getElementById(this.id).mousewheel();
};
persagyElement.prototype.change = function () {
    document.getElementById(this.id).change();
};
persagyElement.prototype.focus = function () {
    document.getElementById(this.id).focus();
};
persagyElement.prototype.blur = function () {
    document.getElementById(this.id).blur();
};
;/*转换成绑定 支持knockout、angular、Vue*/
function persagy_toBind() {
    /*支持的框架*/
    this.frameTypes = {
        ko: { name: 'ko', templatePrefix: '' },
        angular: { name: 'angular', templatePrefix: 'ng-' },
        vue: { name: 'Vue', templatePrefix: 'x-' }
    };
    this.getFrameName();
};

persagy_toBind.getInstance = function () {
    return persagy_tool.instanceFactory('persagy_toBind');
};

/*判断所用框架*/
persagy_toBind.prototype.getFrameName = function () {
    for (var frame in this.frameTypes) {
        if (this.frameTypes.hasOwnProperty(frame) == false) continue;
        try {
            var currFrame = eval(this.frameTypes[frame].name);
            return this.currFrameType = frame;
        } catch (exception) { }
    }
};

/*根据传入parent取得要创建的控件类型、控件子类型、绑定的属性、绑定的事件*/
persagy_toBind.prototype.parseParent = function (parent) {
    var reg = /(\?|\:|==)/g;
    var _pub = new persagy_public();
    var strBind = parent.getAttribute(_pub.persagyCreateBind) || '';
    if (!strBind) return { pbind: {} };
    if (strBind.indexOf('{') !== 0)
        strBind = '{' + strBind + '}';
    return createBindStr(strBind).val;

    function createBindStr(str) {
        var ooArr = [];
        var oo = {};
        while (str.length > 0) {
            var curr = str.substring(0, 1);
            switch (curr) {
                case '[':
                    if (str.substring(1, 2) != '{') {
                        var val = str.substring(0, str.indexOf(']') + 1);
                        str = str.substring(str.indexOf(']') + 1);
                        return { val: val, str: str };
                    }
                    str = str.substring(1);
                    while (str.length > 0) {
                        var vobj = arguments.callee(str);
                        ooArr.push(vobj.val);
                        str = vobj.str.substring(1);
                        if (vobj.str.substring(0, 1) == ']') break;
                    }
                    return { val: ooArr, str: str };
                case '{':
                case ',':
                    str = str.substring(1);
                    curr = str.substring(0, 1);
                    if (curr == '}') return arguments.callee(str);
                    var pro = '';
                    if (curr == "'" || curr == '"') {
                        str = str.substring(1);
                        pro = str.substring(0, str.indexOf(curr));
                    } else pro = str.substring(0, str.indexOf(':'));

                    str = str.substring(str.indexOf(':') + 1);
                    var vObj = arguments.callee(str);
                    str = vObj.str;
                    var value = vObj.val;
                    oo[pro] = value;
                    break;
                case '}':
                case ']':
                    str = str.substring(1);
                    return { val: oo, str: str };
                default:
                    var douIndex = str.indexOf(',');
                    var youKuoIndex = str.indexOf('}');
                    var xiaoIndex = -1;
                    xiaoIndex = douIndex > youKuoIndex || douIndex == -1 ? youKuoIndex : douIndex;
                    var val = str.substring(0, xiaoIndex);
                    var newVal = parseFloat(val);
                    if (!newVal && newVal != 0) {
                        newVal = val == 'true' ? true : val == 'false' ? false : val;
                        if (newVal != true && newVal != false) {
                            if (val.indexOf('"') == -1 && val.indexOf("'") == -1)
                                newVal = '*' + val;
                            else {
                                var dian = val.lastIndexOf('"') > -1 ? '"' : "'";
                                var tempStr = '';
                                var middleStr = val.substring(val.indexOf(dian) + 1);
                                var ttt = 0;
                                while (middleStr.indexOf(dian) > -1) {
                                    if (ttt % 2 == 0)
                                        tempStr += middleStr.substring(0, middleStr.indexOf(dian));
                                    middleStr = middleStr.substring(middleStr.indexOf(dian) + 1);
                                    ++ttt;
                                }
                                if (tempStr.length + 2 == val.length) newVal = val.substring(1, val.length - 1);
                                else newVal = '*' + val;

                                /*var dianIndex = Math.max(val.lastIndexOf('"'), val.lastIndexOf("'"));
                                var wenIndex = val.lastIndexOf('?');
                                var maoIndex = val.lastIndexOf(':');
                                var dengIndex = Math.max(val.lastIndexOf('= ='), val.lastIndexOf('=='));

                                var middleIndex = Math.max(wenIndex, maoIndex, dengIndex);
                                if ((wenIndex > -1 && maoIndex > -1) || (wenIndex > -1 && dengIndex > -1) ||
                                    (maoIndex > -1 && dengIndex > -1)) newVal = '*' + val;
                                else if (dianIndex < middleIndex) newVal = '*' + val;
                                else newVal = val.substring(1, val.length - 1);*/
                            }
                        }
                    }
                    str = str.substring(xiaoIndex);
                    return { val: newVal, str: str };
            }
        }
        return { val: oo, str: str };
    };
};

/*生成text、value、visible以及事件绑定字符串
isValue 默认false   true 绑定value    否则绑定text    isFor 是否是for循环绑定
customAttr 每个控件需创建的自定义绑定属性
*/
persagy_toBind.prototype.createBind = function (objAttr, objEvent, isValue, isFor, customAttr, style) {
    objAttr = objAttr || {};
    objEvent = objEvent || {};
    isValue = isValue == true ? true : false;
    var bn = eval('persagy_' + this.currFrameType);
    var bnObj = new bn();
    if (isFor == true)
        return bnObj.createForBind(objAttr, objEvent, isValue, customAttr, style);
    return bnObj.createBind(objAttr, objEvent, isValue, customAttr, style);
};

/*创建for循环绑定*/
persagy_toBind.prototype.toRepeat = function (source, htmlContent) {
    var bn = eval('persagy_' + this.currFrameType);
    return new bn().toRepeat(source, htmlContent);
};

/*创建for循环绑定模板*/
persagy_toBind.prototype.toRepeatTemplate = function (source, htmlContent, templateId, isInFor, objEvent) {
    var bn = eval('persagy_' + this.currFrameType);
    return new bn().toRepeatTemplate(source, htmlContent, templateId, isInFor, objEvent);
};

/*创建模板*/
persagy_toBind.prototype.createScriptTemplate = function (id, content) {
    return '<script type="text/' + this.frameTypes[this.currFrameType].templatePrefix +
        'template" id="' + id + '">' + content + '<\/script>';
};


function persagy_bind() {
    this.customAttr = persagy_public.getInstance().customAttr;
    /*现阶段支持的绑定属性*/
    this.attrObj = {
        visible: {
            ko: 'visible'
            , angular: 'show'
            , vue: 'show'
        }
    };
};
/*判断val是变量还是值*/
persagy_bind.prototype.parseVal = function (val, call) {
    if (!val) return '';
    if (typeof val == 'string') {
        var _pub = persagy_public.getInstance();
        val = val.indexOf(_pub.specialChart) > -1 ? val : '\'' + val + '\'';
        val = val.ppriperDel();
    }
    if (typeof call == 'function')
        return call.call(this, val);
    return val;
};
persagy_bind.getInstance = function () {
    return persagy_tool.instanceFactory('persagy_bind');
};




/*-------------Ko绑定相关------------------------------*/
function persagy_ko() {
    this.constructor = arguments.callee;
    this.bindName = 'data-bind';
    this.koAttrName = 'attr';
    this.koEventName = 'event';
};
persagy_ko.prototype = new persagy_bind();

/*生成绑定绑定字符串*/
persagy_ko.prototype.createBind = function (objAttr, objEvent, isValue, customAttr, style) {
    var bindStr = '';
    if (isValue == true) bindStr += this.toValue(objAttr[this.customAttr.value]);
    else bindStr += this.toText(objAttr[this.customAttr.text]);
    bindStr += this.toVisible(objAttr[this.customAttr.visible]);
    bindStr += this.toEvent(objEvent);
    bindStr += this.toAttr(customAttr);
    bindStr += this.toStyle(style);
    bindStr = bindStr.substr(1);
    return bindStr ? ' ' + this.bindName + '="' + bindStr + '"' : '';
};
persagy_ko.prototype.createForBind = function (objAttr, objEvent, isValue, customAttr, style) {
    return this.createBind(objAttr, objEvent, isValue, customAttr, style);
};

persagy_ko.prototype.toText = function (val) {
    return this.parseVal(val, function (v) {
        return ',html:' + v;
    });
};
persagy_ko.prototype.toValue = function (val) {
    return this.parseVal(val, function (v) {
        return ',value:' + v;
    });
};
persagy_ko.prototype.toVisible = function (val) {
    return this.parseVal(val, function (v) {
        return ',' + this.attrObj.visible.ko + ':' + v;
    });
};
persagy_ko.prototype.toEvent = function (objEvent) {
    var eventStr = '';
    for (var eventName in objEvent) {
        if (objEvent.hasOwnProperty(eventName) == false) continue;
        var eventFn = this.parseVal(objEvent[eventName]);
        if (!eventFn) continue;
        eventStr += ',' + eventName + ':' + eventFn;
    }
    eventStr = eventStr.substr(1);
    return eventStr ? ',' + this.koEventName + ':{' + eventStr + '}' : '';
};
persagy_ko.prototype.toAttr = function (objAttr) {
    var attrStr = '';
    for (var attrName in objAttr) {
        if (objAttr.hasOwnProperty(attrName) == false) continue;
        var attrVal = this.parseVal(objAttr[attrName]);
        if (!attrVal) continue;
        attrStr += ',' + attrName + ':' + attrVal;
    }
    attrStr = attrStr.substr(1);
    return attrStr ? ',' + this.koAttrName + ':{' + attrStr + '}' : '';
};
persagy_ko.prototype.toStyle = function (style) {
    if (typeof style == 'string')
        return ',style:{' + (style || '') + '}';
    var styleStr = '';
    for (var os in style) {
        if (style.hasOwnProperty(os) == false) continue;
        var osVal = this.parseVal(style[os]);
        if (!osVal) continue;
        styleStr += os + ':' + osVal + ',';
    }
    return ',style:{' + styleStr.substr(0, styleStr.length - 1) + '}';
};
persagy_ko.prototype.toRepeat = function (source, htmlContent) {
    return this.parseVal(source, function (v) {
        return '<!--ko foreach:' + v + '-->' + htmlContent + '<!--/ko-->';
    });
};
persagy_ko.prototype.toRepeatTemplate = function (source, htmlContent, templateId) {
    return this.parseVal(source, function (v) {
        return '<!--ko template:{ name:"' + templateId + '",foreach:' + v + '}--><!--/ko-->';
    });
};


/*-------------------------angular绑定相关-----------------------*/
function persagy_angular() {
    this.constructor = arguments.callee;
    this.bindName = 'ng-';
    this.attrBindName = 'ng-attr-';
};
persagy_angular.prototype = new persagy_bind();
/*生成绑定绑定字符串*/
persagy_angular.prototype.createBind = function (objAttr, objEvent, isValue, customAttr, style) {
    var bindStr = '';
    if (isValue == true) bindStr += this.toValue(objAttr[this.customAttr.value]);
    else bindStr += this.toText(objAttr[this.customAttr.text]);
    bindStr += this.toVisible(objAttr[this.customAttr.visible]);
    bindStr += this.toEvent(objEvent);
    bindStr += this.toAttr(customAttr);
    bindStr += this.toStyle(style);
    return bindStr;
};
persagy_angular.prototype.createForBind = function (objAttr, objEvent, isValue, customAttr, style) {
    var bindStr = '';
    if (isValue == true) bindStr += this.toForValue(objAttr[this.customAttr.value]);
    else bindStr += this.toForText(objAttr[this.customAttr.text]);
    bindStr += this.toForVisible(objAttr[this.customAttr.visible]);
    bindStr += this.toEvent(objEvent);
    bindStr += this.toAttr(customAttr);
    bindStr += this.toStyle(style);
    return bindStr;
};
persagy_angular.prototype.toText = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.bindName + 'bind="' + v + '"';
    });
};
persagy_angular.prototype.toForText = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.bindName + 'bind="' + (v.indexOf("'") > -1 ? v : 'item.' + v) + '"';
    });
};
persagy_angular.prototype.toValue = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.bindName + 'value="' + v + '"';
    });
};
persagy_angular.prototype.toForValue = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.bindName + 'value="' + (v.indexOf("'") > -1 ? v : 'item.' + v) + '"';
    });
};
persagy_angular.prototype.toVisible = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.bindName + this.attrObj.visible.angular + '=' + v;
    });
};
persagy_angular.prototype.toForVisible = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.bindName + this.attrObj.visible.angular + '=' + (v.indexOf("'") > -1 ? v : 'item.' + v);
    });
};
persagy_angular.prototype.toEvent = function (objEvent) {
    var eventStr = '';
    for (var eventName in objEvent) {
        if (objEvent.hasOwnProperty(eventName) == false) continue;
        var eventFn = this.parseVal(objEvent[eventName]);
        if (!eventFn) continue;
        eventStr += ' ' + this.bindName + eventName + '="' + eventFn + '(this,$event)"';
    }
    return eventStr;
};
persagy_angular.prototype.toAttr = function (objAttr) {
    var attrStr = '';
    for (var attrName in objAttr) {
        if (objAttr.hasOwnProperty(attrName) == false) continue;
        var attrVal = this.parseVal(objAttr[attrName]);
        if (!attrVal) continue;
        attrStr += ' ' + this.attrBindName + attrName + '="{{' + attrVal + '}}"';
    }
    return attrStr;
};
persagy_angular.prototype.toStyle = function (style) {
    if (typeof style == 'string')
        return ' ' + this.bindName + 'style="{' + (style || '') + '}"';
    var styleStr = '';
    for (var os in style) {
        if (style.hasOwnProperty(os) == false) continue;
        var osVal = this.parseVal(style[os]);
        if (!osVal) continue;
        styleStr += os + ':' + osVal + ',';
    }
    return ' ' + this.bindName + 'style="{' + styleStr.substr(0, styleStr.length - 1) + '}"';
};
persagy_angular.prototype.toRepeat = function (source, htmlContent) {
    return this.parseVal(source, function (v) {
        var bindStr = ' ' + this.bindName + 'repeat="item in ' + v + '"';
        var index = htmlContent.indexOf('>');
        var first = htmlContent.substr(0, index);
        var last = htmlContent.substr(index);
        return first + bindStr + last;
    });
};
persagy_angular.prototype.toRepeatTemplate = function (source, htmlContent, templateId, isInFor) {
    return this.parseVal(source, function (v) {
        var bindStr = ' ' + this.bindName + 'repeat="item in ' + (isInFor == true ? 'item.' + v : v) + '"';
        var index = htmlContent.indexOf('>');
        var first = htmlContent.substr(0, index);
        var last = htmlContent.substr(index);
        return first + bindStr + ' ' + this.bindName + 'include="\'' + templateId + '\'"' + last;
    });
};


/*-------------------------vue绑定相关-----------------------*/
function persagy_vue() {
    var prefix = 'v-bind:';
    this.constructor = arguments.callee;
    this.textBindPrefix = 'v-text=';
    this.visibleBindPrefix = 'v-show=';
    this.valueBindPrefix = 'v-model=';
    this.attrBindPrefix = prefix;
    this.eventBindPrefix = 'v-on:';
    this.styleBindPrefix = prefix + 'style=';
    this.forBindPrefix = 'v-for=';
    this.forBindProPrefix = 'model';
};
persagy_vue.prototype = new persagy_bind();
/*生成绑定绑定字符串*/
persagy_vue.prototype.createBind = function (objAttr, objEvent, isValue, customAttr, style) {
    var bindStr = '';
    if (isValue == true) bindStr += this.toValue(objAttr[this.customAttr.value]);
    else bindStr += this.toText(objAttr[this.customAttr.text]);
    bindStr += this.toVisible(objAttr[this.customAttr.visible]);
    bindStr += this.toEvent(objEvent);
    bindStr += this.toAttr(customAttr);
    bindStr += this.toStyle(style);
    return bindStr;
};
persagy_vue.prototype.createForBind = function (objAttr, objEvent, isValue, customAttr, style) {
    var bindStr = '';
    if (isValue == true) bindStr += this.toForValue(objAttr[this.customAttr.value]);
    else bindStr += this.toForText(objAttr[this.customAttr.text]);
    bindStr += this.toForVisible(objAttr[this.customAttr.visible]);
    bindStr += this.toEvent(objEvent, true);
    bindStr += this.toAttr(customAttr, true);
    bindStr += this.toStyle(style);
    return bindStr;
};
persagy_vue.prototype.toText = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.textBindPrefix + '"' + v + '"';
    });
};
persagy_vue.prototype.toForText = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.textBindPrefix + '"' + (v.indexOf("'") > -1 ? v : this.forBindProPrefix + '.' + v) + '"';
    });
};
persagy_vue.prototype.toValue = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.valueBindPrefix + '"' + v + '"';
    });
};
persagy_vue.prototype.toForValue = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.valueBindPrefix + '"' + (v.indexOf("'") > -1 ? v : this.forBindProPrefix + '.' + v) + '"';
    });
};
persagy_vue.prototype.toVisible = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.visibleBindPrefix + '"' + v + '"';
    });
};
persagy_vue.prototype.toForVisible = function (val) {
    return this.parseVal(val, function (v) {
        return ' ' + this.visibleBindPrefix + '"' + (v.indexOf("'") > -1 ? v : this.forBindProPrefix + '.' + v) + '"';
    });
};
persagy_vue.prototype.toEvent = function (objEvent, isFor) {
    var eventStr = '';
    for (var eventName in objEvent) {
        if (objEvent.hasOwnProperty(eventName) == false) continue;
        var eventFn = this.parseVal(objEvent[eventName]);
        if (!eventFn) continue;
        eventStr += ' ' + this.eventBindPrefix + eventName + '="' + eventFn + '(this,$event)"';
    }
    return eventStr;
};
persagy_vue.prototype.toAttr = function (objAttr, isFor) {
    var attrStr = '';
    for (var attrName in objAttr) {
        if (objAttr.hasOwnProperty(attrName) == false) continue;
        var attrVal = this.parseVal(objAttr[attrName]);
        if (!attrVal) continue;
        attrStr += ' ' + this.attrBindPrefix + attrName + '="' + (isFor == true ? this.forBindProPrefix + '.' : '') + attrVal + '"';
    }
    return attrStr;
};
persagy_vue.prototype.toStyle = function (style) {
    if (typeof style == 'string')
        return ' ' + this.styleBindPrefix + '"{' + style + '}"';
    var styleStr = '';
    for (var os in style) {
        if (style.hasOwnProperty(os) == false) continue;
        var osVal = this.parseVal(style[os]);
        if (!osVal) continue;
        styleStr += os + ':' + osVal + ',';
    }
    return ' ' + this.styleBindPrefix + '"{' + styleStr.substr(0, styleStr.length - 1) + '}"';
};
persagy_vue.prototype.toRepeat = function (source, htmlContent) {
    return this.parseVal(source, function (v) {
        var bindStr = ' ' + this.forBindPrefix + '"' + this.forBindProPrefix + ' in ' + v + '"';
        var index = htmlContent.indexOf('>');
        var first = htmlContent.substr(0, index);
        var last = htmlContent.substr(index);
        return first + bindStr + last;
    });
};

persagy_vue.prototype.toRepeatTemplate = function (source, htmlContent, templateId, isInFor, objEvent) {
    return this.parseVal(source, function (v) {
        var bindStr = ' ' + this.forBindPrefix + '"' + this.forBindProPrefix + ' in ' + (isInFor == true ? this.forBindProPrefix + '.' + v : v) + '"';
        var index = htmlContent.indexOf('>');
        var first = htmlContent.substr(0, index);
        var rightJianhao = htmlContent.substr(index, 1);
        var last = htmlContent.substr(index + 1);

        var tagName = 'customtag' + templateId;
        if (isInFor != true)
            createVueComponent(tagName, templateId);
        return first + bindStr + rightJianhao + '<' + tagName + ' :' + this.forBindProPrefix + '="' + this.forBindProPrefix
            + '"></' + tagName + '>' + last;
    });

    function createVueComponent(tagName, templateId) {
        var componentMethods = {};
        objEvent = objEvent || {};
        for (var oe in objEvent) {
            if (objEvent.hasOwnProperty(oe) == false) continue;
            var methodName = (objEvent[oe] || '').ppriperDel();
            (function (mn) {
                componentMethods[mn] = function (item, event) {
                    eval(mn)(item, event);
                };
            })(methodName);
        }

        Vue.component(tagName, {
            template: '#' + templateId,
            props: {
                model: Object
            }, methods: componentMethods
        });
    };
};
;/*按钮*/
var p_button = {
    name: 'button'
     , childType: {
         /*灰色基本button带边框*/
         'grayBorder': 'grayBorder'
         /*图标灰色带边框*/
         , 'grayIconBorder': 'grayIconBorder'
         /*灰色按钮无边框*/
         , 'grayNoBorder': 'grayNoBorder'
         /*灰色图标无边框*/
         , 'grayIconNoBorder': 'grayIconNoBorder'
         /*背景蓝色按钮带边框*/
         , 'backBlueBorder': 'backBlueBorder'
         /*背景蓝色图标带边框*/
         , 'backBlueIconBorder': 'backBlueIconBorder'
         /*蓝色按钮无边框*/
         , 'blueNoBorder': 'blueNoBorder'
         /*蓝色图标无边框*/
         , 'blueIconNoBorder': 'blueIconNoBorder'
         /*红色带边框*/
         , 'redBorder': 'redBorder'
         /*红色图标带边框*/
         , 'redIconBorder': 'redIconBorder'
         /*红色按钮无边框*/
         , 'redNoBorder': 'redNoBorder'
         /*红色图标无边框*/
         , 'redIconNoBorder': 'redIconNoBorder'
         /*背景红色带边框*/
         , 'backRedBorder': 'backRedBorder'
         /*背景红色图标带边框*/
         , 'backRedIconBorder': 'backRedIconBorder'
         /*菜单按钮*/
        , 'menu': 'menu'
     }
};
/*文本框*/
var p_text = {
    name: 'text'
     , childType: {
         /*普通*/
         'text': 'text'
         /*密码*/
         , password: 'password'
         /*文本域*/
         , textarea: 'textarea'
         /*格式文本框*/
         , unit: 'unit'
     }
};
/*下拉列表*/
var p_combobox = {
    name: 'combobox'
    , childType: {
        /*表单*/
        'form': 'form'
        /*区域控制*/
        , 'region': 'region'
        /*无边框*/
        , 'noborder': 'noborder'
        /*特殊的菜单按钮*/
        , 'menu': 'menu'
    }
};
/*选项卡*/
var p_tab = {
    name: 'tab'
    , childType: {
        /*按钮选项卡*/
        'button': 'button'
        /*导航选项卡*/
        , 'navigation': 'navigation'
    }
};
/*开关*/
var p_switch = {
    name: 'switch'
    , childType: {
        /*单选框*/
        'radio': 'radio'
        /*复选框*/
        , 'checkbox': 'checkbox'
        /*滑动开关*/
        , 'slide': 'slide'
    }
};
/*搜索*/
var p_searchbox = {
    name: 'searchbox'
    , childType: {
        /*点击搜索*/
        'delay': 'delay'
        /*即时搜索*/
        , 'promptly': 'promptly'
    }
};
/*提示信息*/
var p_prompt = {
    name: 'prompt'
    , childType: {
        /*渐隐式通知*/
        'notice': 'notice'
        /*异常信息提示*/
        , 'abnormalmess': 'abnormalmess'
    }
    , noticeType: {
        succeess: 'succeess'
        , failure: 'failure'
    }
};
/*时间控件*/
var p_time = {
    name: 'time'
    , childType: {
        /*表单时间控件*/
        'form': 'form'
        /*图表时间控件*/
        , 'chart': 'chart'
        /*能组合的禁用状态的图表时间控件*/
        , 'dchart': 'dchart'
    }
};
/*表格*/
var p_grid = {
    name: 'grid'
    , childType: {
        /*基础表格*/
        'normal': 'normal'
        /*动态表格*/
        , 'dynamic': 'dynamic'
    }
};
/*模态层*/
var p_modal = {
    name: 'modal'
    , childType: {
        /*用于确认信息*/
        'common': 'common'
        /*用于警示信息*/
        , 'warning': 'warning'
        /*用于普通提示信息*/
        , 'tip': 'tip'
        /*警示性提示信息*/
        , 'warntip': 'warntip'
        /*用于普通自定义内容*/
        , 'custom': 'custom'
        /*警示性自定义内容*/
        , 'warncustom': 'warncustom'
    }
};

/*分页*/
var p_paging = {
    name: 'paging'
    , childType: {
        'common': 'common'
    }
};

/*浮动层*/
var p_float = {
    name: 'float'
    , childType: {
        normal: 'normal'
    }
};

/*进度指示器*/
var p_progress = {
    name: 'progress'
    , childType: {
        /*只转圈的loading*/
        'common': 'common'
        /*带文字的和转圈的loading*/
        , 'waiting': 'waiting'
        /*带图片的loading*/
        , 'loading': 'loading'
    }
};

/*树形菜单*/
var p_tree = {
    name: 'tree'
    , childType: {
        /*不带复选框的*/
        'normal': 'normal'
        /*带复选框的*/
        , 'combobox': 'combobox'
    }
};

var persagy_control = {
    /*控件类型*/
    controls: {
        'button': p_button
        , 'text': p_text
        , 'combobox': p_combobox
        , 'tab': p_tab
        , 'switch': p_switch
        , 'searchbox': p_searchbox
        , 'prompt': p_prompt
        , 'time': p_time
        , 'grid': p_grid
        , 'modal': p_modal
        , 'paging': p_paging
        , 'float': p_float
        , 'progress': p_progress
        , 'tree': p_tree
    }
    /*方向*/
    , orienObj: {
        /*向上*/
        up: 'up'
        /*向下*/
        , down: 'down'
        /*向左*/
        , left: 'left'
        /*向右*/
        , right: 'right'
    }
    /*选中状态*/
    , selState: {
        /*选中*/
        on: 'on',
        /*未选中*/
        off: 'off'
    }
    /*排序类型*/
    , order: {
        /*升序*/
        asc: 'asc',
        /*降序*/
        desc: 'desc'
    }
};

void function () {
    var pt = persagy_tool.getInstance();
    var pb = persagy_public.getInstance();

    /*
    *使用者请调用此方法,来动态创建控件
    *第一个参数 控件类型 值为persagy_controlType内的属性
    *第二个参数   控件子类型,值为各控件类的childType内的属性
    *第三个参数      可以为元素id或通过jquery取得的元素或通过document取得的元素
    *第四个参数         object类型,包括两个属性:attr 控件支持的原生及自定义属性  event控件支持的原生及自定义事件
    */
    persagy_control.init = function () {
        var controlType = arguments[0];
        var childType = arguments[1];
        var parent = arguments[2];
        var obj = arguments[3];
        parent = persagy_public.getInstance().getDomElement(parent);
        return pt.createControl(controlType, childType, parent, obj);
    };
    /*根据页面上的p-create特性来创建控件*/
    function render() {
        $(function () {
            pb.createControlByCreateType(document.body);
        });
    };

    render();
    Object.freeze(persagy_control);
}();
;(function () {
    /*扩展persagyElement、HTMLElement、jQuery及创建自定义event*/
    (function () {
        var pevent = persagy_event.getInstance();
        var _pub = persagy_public.getInstance();

        /*取得控件类对应的element类的实例*/
        function instanceElement(controlType) {
            controlType += 'Element';
            return new persagy_tool().constructorCon(controlType);
        };
        /*取得控件的的最顶级元素*/
        function controlOut(target) {
            var target = $(target);
            var targetNew;
            var pType = target.attr(_pub.persagyTypeAttr);
            if (pType !== void 0) return target;

            targetNew = target.find('[' + _pub.persagyTypeAttr + ']:first');
            pType = targetNew.attr(_pub.persagyTypeAttr);
            var index = 1;
            while (pType === void 0 && index < 100) {
                targetNew = null;
                target = target.parent();
                pType = target.attr(_pub.persagyTypeAttr);
                index++;
            }
            return targetNew || target;
        };

        var eventType = {
            /*ui事件*/
            'uiEvent': 'UIEvents'
            /*鼠标事件*/
            , 'mouseEvent': 'MouseEvents'
            /*html事件*/
            , 'htmlEvent': 'HTMLEvents'
            /*自定义事件*/
            , 'customEvent': 'CustomEvent'
            /*突发事件*/
            , 'mutationEvent': 'MutationEvents'
            /*非事件 以方法的形式执行   事件以触发事件的形式执行方法*/
            , 'notEvent': 'notEvent'
        };
        var objFn = {
            /*初始化控件*/
            pinit: function () {
                var controlType = arguments[0];
                var childType = typeof arguments[1] === 'string' ? arguments[1] :
                                typeof arguments[2] === 'string' ? arguments[2] : null;
                var obj = arguments[1] != null && typeof arguments[1] === 'object' ? arguments[1] :
                          arguments[2] != null && typeof arguments[2] === 'object' ? arguments[2] : null;

                return persagy_control.init(controlType, childType, this[0] ? this[0] : this, obj);
            },
            /*根据p-create特性渲染控件*/
            prender: function () {
                _pub.createControlByCreateType(this);
            },
            parseTemplate: function () {
                _pub.parseTemplate(this);
            },
            /*验证空格*/
            pvalidSpace: eventType.notEvent,
            /*验证手机号*/
            pvalidMobile: eventType.notEvent,
            /*验证固定电话*/
            pvalidTel: eventType.notEvent,
            /*验证数字*/
            pvalidNumber: eventType.notEvent,
            /*验证正数*/
            pvalidPositiveNumber: eventType.notEvent,
            /*验证负数*/
            pvalidNegativeNumber: eventType.notEvent,
            /*验证整数*/
            pvalidInt: eventType.notEvent,
            /*验证正整数*/
            pvalidPositiveInt: eventType.notEvent,
            /*验证负整数*/
            pvalidNegativeInt: eventType.notEvent,
            /*验证身份证号*/
            pvalidCard: eventType.notEvent,
            /*验证邮箱*/
            pvalidEmail: eventType.notEvent,
            /*验证汉字*/
            pvalidChinese: eventType.notEvent,
            /*验证长度*/
            pvalidLength: eventType.notEvent,
            /*下拉框、选项卡选中  分页控件设置页码*/
            psel: eventType.notEvent,
            /*开关按钮打开 单复选框选中*/
            pon: eventType.notEvent,
            /*开关按钮关闭 单复选框取消选中*/
            poff: eventType.notEvent,
            /*开关按钮打开 单复选框选中  不会触发事件*/
            ponState: eventType.notEvent,
            /*开关按钮关闭 单复选框取消选中  不会触发事件*/
            poffState: eventType.notEvent,
            /*启用或禁用按钮 disabled true禁用 false启用   index不存在时禁用元素内的所有子元素*/
            pdisable: function (disabled) {
                var target = $(this)[0];
                if (!target) return;
                target.setAttribute('disabled', disabled);
            },
            /*显示控件*/
            pshow: eventType.notEvent,
            /*隐藏控件*/
            phide: eventType.notEvent,
            /*获取或设置总页数*/
            pcount: eventType.notEvent,
            /*下一页*/
            pnextPage: eventType.notEvent,
            /*上一页*/
            pprevPage: eventType.notEvent,
            /*设置方向*/
            porien: eventType.notEvent,
            /*控件更新*/
            pupdate: eventType.notEvent
            /*时间控件专用 设置时间*/
            , psetTime: eventType.notEvent
            /*时间控件专用 获取时间*/
            , pgetTime: eventType.notEvent
            /*时间控件展开或收起*/
            , pslideToggle: eventType.notEvent
            /*时间控件展开*/
            , pslideDown: eventType.notEvent
            /*时间控件收起*/
            , pslideUp: eventType.notEvent
            /*锁定或解锁时间控件*/
            , plockToggle: eventType.notEvent
            /*解锁时间控件*/
            , plockDown: eventType.notEvent
            /*锁定时间控件*/
            , plockUp: eventType.notEvent
            /*设置时间控件的时间类型*/
            , psetType: eventType.notEvent
            /*隐藏某区域内文本框或某一文本框的警告及输入提示*/
            , phideTextTip: function () {
                var target = $(this);
                target.find('.reminder-tip,.error-tip').hide();
                target.find('input,textarea').removeClass('input-error');
            }
            /*显示某文本框的错误提示*/
            , pshowTextTip: eventType.notEvent
            /*某一区域内的所有文本框是否验证通过 返回true验证通过   false未通过*/
            , pverifi: function () {
                var target = $(this);
                var texts = target.find('input,textarea').filter(':visible');
                if (texts.filter('.input-error').length > 0) {
                    location.hash = '#' + texts.filter('.input-error').eq(0).parent().parent().attr('id');
                    location.href = location.href;
                    return false;
                }
                for (var i = 0; i < texts.length; i++) {
                    var inputDiv = texts.eq(i).parent().parent();
                    var pst = new persagy_text();
                    var objAttr = inputDiv[0][_pub.persagyEleObjAttr];
                    if (!objAttr) continue;
                    pst.createBlurEvent(null, objAttr).call(texts[i]);
                }
                var errTxts = texts.filter('.input-error');
                if (errTxts.length > 0) {
                    location.hash = '#' + errTxts.eq(0).parent().parent().attr('id');
                    location.href = location.href;
                    return false;
                }
                return true;
            }
            /*某一区域内的控件恢复初始状态*/
            , pctlsRecover: function () {
                this.phideTextTip();
                var controls = $(this).find('[' + _pub.persagyTypeAttr + ']');
                controls.each(function () {
                    this.pctlRecover();
                });
            }
            /*某一控件恢复初始状态*/
            , pctlRecover: eventType.notEvent
            /*获取或设置value值*/
            , pval: eventType.notEvent
            /*获取或设置title值*/
            , ptitle: eventType.notEvent
            /*获取或设置icon值*/
            , picon: eventType.notEvent
            /*轮换*/
            , ptoggle: eventType.notEvent
            /*选中个数*/
            , pselCount: eventType.notEvent
            /*表格头部某列进行排序*/
            , psort: eventType.notEvent
            /*表格头部某列选中某选项*/
            , pheaderSel: eventType.notEvent
            /*选中所有行*/
            , ponAll: eventType.notEvent
            /*表格头部某列禁用*/
            , pheaderDisabled: eventType.notEvent
            /*取消选中所有行*/
            , poffAll: eventType.notEvent
            /*选中或取消选中所有行*/
            , ptoggleAll: eventType.notEvent
            /*设置文本域长度提示的当前长度和总长度*/
            , ptipCount: eventType.notEvent
            , getJqEle: function () {
                var target = this[0] || this;
                return target.tagName ? $(target) : $('#' + this.id);
            }
            , getEle: function () {
                var target = this[0] || this;
                return target.tagName ? target : document.getElementById(this.id);
            }
        };

        /*扩展objFn 以便加上以各控件子类型为名字的属性*/
        for (var pcN in persagy_control.controls) {
            if (persagy_control.controls.hasOwnProperty(pcN) == false) continue;
            var childType = persagy_control.controls[pcN].childType;
            for (var childPcn in childType) {
                if (childType.hasOwnProperty(childPcn) == false) continue;
                var dproName = 'p' + pcN.slice(0, 1).toUpperCase() + pcN.slice(1, pcN.length) +
                    childPcn.slice(0, 1).toUpperCase() + childPcn.slice(1, childPcn.length);
                objFn[dproName] = (function (ct, childCt) {
                    return function () {
                        var obj = arguments[0];

                        return persagy_control.init(ct, childCt, this[0] ? this[0] : this, obj);
                    };
                })(pcN, childPcn);
            }
        }

        /*persagyElement的扩展所调用的方法*/
        function peExFn(funName) {
            return (function (fna) {
                return function () {
                    return 'peExFn';
                };
            })(funName);
        };

        /*HTMLElement、jQuery的扩展所调用的方法*/
        function ceExFn(funName) {
            return (function (fna) {
                return function () {
                    var target = _pub.getDomElement(controlOut(this));
                    var controlType = _pub.parsePtype(target).controlType;
                    var inElement = instanceElement(controlType);
                    return inElement[fna].apply(target, arguments);
                };
            })(funName);
        };

        for (var fn in objFn) {
            if (objFn.hasOwnProperty(fn) === false) continue;
            var fnV = objFn[fn];
            var cnv = fnV;
            if (typeof fnV !== 'function') {
                fnV = ceExFn(fn);
                cnv = peExFn(fn);
            }
            HTMLElement.prototype[fn] = fnV;
            if (jQuery) jQuery.fn[fn] = fnV;
            persagyElement.prototype[fn] = cnv;
        }
    })();

    /*扩展event*/
    (function eventExtend() {
        /*扩展event阻止冒泡*/
        Event.prototype.stopBubbling = function () {
            this.cancelBubble ? this.cancelBubble = true : this.stopPropagation();
        };

        /*扩展event阻止默认行为*/
        Event.prototype.stopDefault = function () {
            this.preventDefault ? this.preventDefault() : this.returnValue = false;
        };
    })();

    /*扩展字符串*/
    (function stringExtend() {
        var objFn = {
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
            /*去掉* */
            , ppriperDel: function () {
                var pb = persagy_public.getInstance();
                return this.replace(pb.specialChartRegExp, '');
            }
        };
        for (var fn in objFn) {
            if (objFn.hasOwnProperty(fn) === false) continue;
            String.prototype[fn] = objFn[fn];
            String.prototype[fn].fnName = fn;
        }
    })();

})();
;/*
*博锐尚格按钮库 默认创建普通按钮
*支持各种html原生事件
*自定义属性：icon  按钮上的图标名字    
            text 按钮上的文本。菜单按钮时，为空时，则代表每项文本来源于数据源内的每项，否则每项文本来源于数据源内每项的此属性
            title 按钮title
            placeholder 菜单按钮默认的文本
            items 数据源
*自定义事件：sel 每项的选择事件，即单击事件
*/
function persagy_button() {
    this.constructor = arguments.callee;
    this.customBtAttr = {
        title: 'title'
    };
};
persagy_button.prototype = new persagy_event();

/*构造html*/
persagy_button.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    type = type || p_button.childType.grayBorder;
    var id = objAttr[this.customAttr.id] ? objAttr[this.customAttr.id] : this.produceId();
    var text = type.toLowerCase().indexOf('icon') > -1 ? '' : (objAttr[this.customAttr.text] || '');
    var icon = objAttr[this.customAttr.icon] || '';
    var typeStr = this.joinPtype(p_button.name, type);
    var title = objAttr[this.customBtAttr.title] || '';
    objAttr.id = id;

    var html = '';
    switch (type) {
        case p_button.childType.menu:
            return new persagy_combobox().createHtml(objAttr, objEvent, p_combobox.childType.menu, isRely, parent, watchEle);
        default:
            if (isRely != true) {
                var iconStr = type.toLowerCase().indexOf('icon') > -1 ? icon :
                    icon ? '<span>' + icon + '</span>' : '';
                var attrStr = this.appendAttribute(attrStr);
                html = '<div id="' + id + '" ' + this.persagyTypeAttr + '="' + typeStr + '"' + attrStr +
                        ' title="' + title + '">' + iconStr + text + '</div>';
                if (!parent) return html;
                this.regInserted(watchEle, this.registerEvent({ event: objEvent, attr: objAttr }), false);
                this.appendHtml(parent, html);
            }
            else {
                delete objAttr[this.customAttr.text];
                var pb = persagy_toBind.getInstance();
                var bindAttr = { title: title };
                if (type.toLowerCase().indexOf('icon') > -1) {
                    objAttr[this.customAttr.text] = icon;
                }
                var divBindStr = pb.createBind(objAttr, objEvent, false, false, bindAttr);
                var emStr = type.toLowerCase().indexOf('icon') > -1 ? '' :
                    !text ? '' : '<em' + pb.createBind({ text: text }) + '></em> ';
                var iconStr = type.toLowerCase().indexOf('icon') > -1 ? '' :
                     !icon ? '' : '<span' + pb.createBind({ text: icon }) + '></span>';
                html = '<div id="' + id + '" ' + this.persagyTypeAttr + '="' + typeStr + '" ' + divBindStr
                        + '>' + iconStr + emStr + '</div>';
                if (!parent) return html;
                this.appendHtml(parent, html);
            }
            break;
    }
    return new persagy_buttonElement(id);
};

persagy_button.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function (event) {
            if (event) {
                event.stopBubbling();
                event.stopDefault();
            }
            var pb = persagy_public.getInstance();
            var srcTarget = pb.getInsertedSrcJqEle(event, ob.attr.id);
            if (!srcTarget) return;
            var eventRe = ob.isRely == true ? null : ob.event;
            var pe = persagy_event.getInstance();
            srcTarget.each(function () {
                pe.domRegEvent(this, eventRe);
                pe.regConInserted(this);
            });
        };
    })(objBind);
};
;/*js创建时 返回此实例对象*/
function persagy_buttonElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_buttonElement.prototype = new persagyElement();
;/*
*博锐尚格文本框库 默认创建普通文本框
*支持各种文本框原生事件
*自定义属性：value  值     unit 带单位的文本框的单位
            placeholder      contenttip  内容提示
            spaceerrtext                验证空格时请给此属性赋空值或提示文本值
            mobileerrtext            验证手机号时请给此属性赋空值或提示文本值
            telerrtext                  验证固定电话时请给此属性赋空值或提示文本值
            numbererrtext            验证数字时请给此属性赋空值或提示文本值
            positivenumerrtext        验证正数时请给此属性赋空值或提示文本值
            negativenumerrtext        验证负数时请给此属性赋空值或提示文本值
            interrtext               验证整数时请给此属性赋空值或提示文本值
            positiveinterrtext        验证正整数时请给此属性赋空值或提示文本值
            negativeinterrtext        验证负整数时请给此属性赋空值或提示文本值
            carderrtext                验证身份证号时请给此属性赋空值或提示文本值
            emailerrtext              验证邮箱时请给此属性赋空值或提示文本值
            chineseerrtext          验证汉字时请给此属性赋空值或提示文本值
            length                  可输入的最大长度
            lengtherrtext           超过最大长度时的提示文本
            islentip                针对文本域控件，是否需要字数即时提示，默认false
*/
function persagy_text() {
    this.constructor = arguments.callee;
    this.customTxtAttr = {
        unit: 'unit'
        , placeholder: 'placeholder'
        , contenttip: 'contenttip'
        , spaceerrtext: 'spaceerrtext'
        , mobileerrtext: 'mobileerrtext'
        , telerrtext: 'telerrtext'
        , numbererrtext: 'numbererrtext'
        , positivenumerrtext: 'positivenumerrtext'
        , negativenumerrtext: 'negativenumerrtext'
        , interrtext: 'interrtext'
        , positiveinterrtext: 'positiveinterrtext'
        , negativeinterrtext: 'negativeinterrtext'
        , carderrtext: 'carderrtext'
        , emailerrtext: 'emailerrtext'
        , chineseerrtext: 'chineseerrtext'
        , length: 'length'
        , lengtherrtext: 'lengtherrtext'
        , islentip: 'islentip'
    };
};
persagy_text.prototype = new persagy_event();

/*构造html*/
persagy_text.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    objEvent = objEvent || {};
    type = type || p_text.childType.text;
    var id = objAttr[this.customAttr.id] ? objAttr[this.customAttr.id] : this.produceId();
    var inputId = this.produceId();
    var value = objAttr[this.customAttr.value] || '';
    var unit = objAttr[this.customTxtAttr.unit] || '';
    var placeholder = objAttr[this.customTxtAttr.placeholder] || '';
    var contenttip = objAttr[this.customTxtAttr.contenttip] || '';
    var typeStr = this.joinPtype(p_text.name, type);
    var isLenTip = objAttr[this.customTxtAttr.islentip] || false;
    var length = objAttr[this.customTxtAttr.length] || 0;

    var inputStr = '', html = '';

    var html1 = '<div id="' + id + '" ';
    var html1_ = this.persagyTypeAttr + '="' + typeStr + '"><div class="input-box ' +
        (isLenTip ? '' : ' no-length') + '">';
    var html2 = '</div><div class="reminder-tip"><span><i>*</i>';
    var conTipStr = '<em>' + contenttip + '</em>';
    var html3 = '</span></div><div class="error-tip"><span><i>!</i><em></em></span></div></div>';
    if (isRely != true) {
        var attrErrObj = this.createErrStr(objAttr);
        var attrErrStr = attrErrObj.space ? ' sp="' + attrErrObj.space + '"' : '';
        attrErrStr = attrErrObj.err ? attrErrStr + ' err="' + attrErrObj.err + '"' : attrErrStr;
        html1 += ' ' + attrErrStr;
        switch (type) {
            case p_text.childType.unit:
                inputStr = '<input type="text" placeholder="'
                            + placeholder + '" value="' + value + '"/><span>' + unit + '</span>';
                break;
            case p_text.childType.textarea:
                inputStr = '<textarea placeholder="' + placeholder + '">' + value + '</textarea>' +
                    (isLenTip ? '<div class="text-clone"></div><div tle class="text-length" lenpro><b>0</b>/<b>' +
                    length + '</b></div>' : '<div class="text-clone"></div>');
                break;
            default:
                inputStr = '<input type="' + type + '" placeholder="'
                            + placeholder + '" value="' + value + '"/>';
                break;
        }
    }
    else {
        var pb = persagy_toBind.getInstance();
        attrErrObj = this.createErrStr(objAttr);
        var customAttr = { placeholder: placeholder };

        var inputBindStr = pb.createBind({ value: value }, objEvent, true, false, customAttr);
        var unitBindStr = pb.createBind({ text: unit });

        var lenTipBindStr = pb.createBind({ text: length });

        switch (type) {
            case p_text.childType.unit:
                inputStr = '<input type="text" ' + inputBindStr + ' /><span ' + unitBindStr + '></span>';
                break;
            case p_text.childType.textarea:
                inputStr = '<textarea ' + inputBindStr + '></textarea>' +
                    (isLenTip ? '<div class="text-clone"></div><div tle class="text-length" lenpro><b>0</b>/<b '
                    + lenTipBindStr + '></b></div>' : '<div class="text-clone"></div>');
                break;
            default:
                inputStr = '<input type="' + type + '" ' + inputBindStr + '/>';
                break;
        }
        var emBindStr = pb.createBind({ text: contenttip });
        conTipStr = '<em ' + emBindStr + '></em>';
    }

    html = html1 + html1_ + inputStr + html2 + conTipStr + html3;
    if (!parent) return html;
    objAttr.id = id;
    objAttr.type = type;
    this.regInserted(watchEle, this.registerEvent({ attr: objAttr, event: objEvent }), false);
    this.appendHtml(parent, html);

    return new persagy_textElement(id);
};

/*创建默认错误提示信息*/
persagy_text.prototype.createErrStr = function (objAttr) {
    var space = objAttr[this.customTxtAttr.spaceerrtext] != void 0 ?
        objAttr[this.customTxtAttr.spaceerrtext] || '请输入内容！' : void 0;

    var err = objAttr[this.customTxtAttr.mobileerrtext] != void 0 ?
        objAttr[this.customTxtAttr.mobileerrtext] || '请输入正确的手机号码！' :
        objAttr[this.customTxtAttr.telerrtext] != void 0 ?
        objAttr[this.customTxtAttr.telerrtext] || '请输入正确的电话号码！' :
        objAttr[this.customTxtAttr.numbererrtext] != void 0 ?
        objAttr[this.customTxtAttr.numbererrtext] || '只能输入数字！' :
        objAttr[this.customTxtAttr.carderrtext] != void 0 ?
        objAttr[this.customTxtAttr.carderrtext] || '请输入正确的身份证号码！' :
        objAttr[this.customTxtAttr.emailerrtext] != void 0 ?
        objAttr[this.customTxtAttr.emailerrtext] || '请输入正确的邮箱！' :
        objAttr[this.customTxtAttr.chineseerrtext] != void 0 ?
        objAttr[this.customTxtAttr.chineseerrtext] || '只能输入汉字！' : void 0;
    return {
        space: space, err: err
    };
};

/*文本框失去焦点事件 验证文本框内容的合法性*/
persagy_text.prototype.createBlurEvent = function (blurEvent, objAttr) {
    return (function (be, st, mt, tt, nt, ct, et, cet, leth, lett, oattr) {
        return function (event) {
            if (event) {
                event.stopBubbling();
                event.stopDefault();
            }
            var target = $(this);
            target.parent().next().hide();
            var space = false;
            if (st != void 0) space = target.pvalidSpace(st, true);
            else space = target.pvalidSpace(st, false);
            if (!space) return call();
            if (leth) {
                if (!target.pvalidLength(leth, lett, true)) return call();
            }
            if (mt != void 0)
                target.pvalidMobile(mt);
            if (tt != void 0)
                target.pvalidTel(tt);
            if (nt != void 0)
                target.pvalidNumber(nt);

            var pnet = oattr.positivenumerrtext;
            var nnet = oattr.negativenumerrtext;
            var iet = oattr.interrtext;
            var piet = oattr.positiveinterrtext;
            var niet = oattr.negativeinterrtext;
            if (pnet != void 0)
                target.pvalidPositiveNumber(pnet);
            if (nnet != void 0)
                target.pvalidNegativeNumber(nnet);
            if (iet != void 0)
                target.pvalidInt(iet);
            if (piet != void 0)
                target.pvalidPositiveInt(piet);
            if (niet != void 0)
                target.pvalidNegativeInt(niet);

            if (ct != void 0)
                target.pvalidCard(ct);
            if (et != void 0)
                target.pvalidEmail(et);
            if (cet != void 0)
                target.pvalidChinese(cet);
            call();
            function call() {
                if (typeof be === 'function') be(event);
            }
        };
    })(blurEvent, objAttr[this.customTxtAttr.spaceerrtext], objAttr[this.customTxtAttr.mobileerrtext],
    objAttr[this.customTxtAttr.telerrtext], objAttr[this.customTxtAttr.numbererrtext],
    objAttr[this.customTxtAttr.carderrtext], objAttr[this.customTxtAttr.emailerrtext],
    objAttr[this.customTxtAttr.chineseerrtext], objAttr[this.customTxtAttr.length],
    objAttr[this.customTxtAttr.lengtherrtext], objAttr);
};

/*文本框获取焦点事件 显示文本框格式提示*/
persagy_text.prototype.createFocusEvent = function (focusEvent) {
    return (function (fe) {
        return function (event) {
            var target = $(this)
            target.removeClass('input-error');
            target = target.parent();
            var tipHtml = target.next();
            tipHtml.next().hide();
            var contentTip = tipHtml.find('em').text();
            if (contentTip) tipHtml.show();
            else tipHtml.hide();
            if (typeof fe == 'function') fe(event);
        };
    })(focusEvent);
};

/*文本域的即时字数提示*/
persagy_text.prototype.createInputEvent = function (input) {
    return (function (inputCall) {
        return function (event) {
            var target = $(this)
            var strLength = target.val().length;
            target.next().next().find('b:first').text(strLength);
            if (typeof inputCall == 'function') inputCall(event);
        };
    })(input);
};

persagy_text.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function (event) {
            if (event) {
                event.stopBubbling();
                event.stopDefault();
            }
            var pe = persagy_event.getInstance();
            var pb = persagy_public.getInstance();
            var pt = new persagy_text();
            var srcTarget = pb.getInsertedSrcJqEle(event, ob.attr.id);
            if (!srcTarget) return;

            ob = ob || {};
            var objAttr = ob.attr || {};
            var objEvent = ob.event || {};

            srcTarget[0][pb.persagyEleObjAttr] = objAttr;

            var oldFocusEvent = objEvent.focus;
            var oldBlurEvent = objEvent.blur;
            var oldInput = objEvent.input;

            objEvent.focus = pt.createFocusEvent(ob.isRely != true ? oldFocusEvent : null);
            objEvent.blur = pt.createBlurEvent(ob.isRely != true ? oldBlurEvent : null, objAttr);
            objEvent.input = pt.createInputEvent(ob.isRely != true && objAttr.islentip == true &&
                        objAttr.type == p_text.childType.textarea ? oldBlurEvent : null);

            srcTarget.each(function () {
                pe.regConInserted(this);
                pe.domRegEvent($(this).find('input,textarea')[0], objEvent);
            });

            objEvent.focus = oldFocusEvent;
            objEvent.blur = oldBlurEvent;
            objEvent.input = oldInput;
        };
    })(objBind);
};
;/*js创建时 返回此实例对象*/
function persagy_textElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_textElement.prototype = new persagyElement();

(function () {
    var attrSp = 'sp', attrErr = 'err';
    /*找寻input或textarea*/
    function getInput(target) {
        var target = target.getJqEle()
        return target[0].tagName === 'INPUT' ? target : target.find('input,textarea');
    };

    /*验证的执行代码  isPrompt 为false时则不显示默认样式的提示信息*/
    function validOper(target, fnName, isPrompt, errText) {
        target = getInput(target)[0];
        var value = target.value;
        var extrenal = [].slice.call(arguments, 4);
        var result = value[fnName].apply(value, extrenal);
        if (fnName === String.prototype.pisSpace.name) result = !result;
        if (isPrompt != false)
            pvalidCustom(result, errText, isPrompt, target);
        return result;
    };

    /*自定义验证 用户可以调用此方法以便以默认的样式显示提示信息*/
    function pvalidCustom(result, errText, isPrompt, target) {
        var target = $(target).parent().parent();
        var errHtml = target.find('.error-tip');
        var inputs = target.find('input,textarea');
        var oldText = errHtml.find('em').text();

        var errClass = 'input-error';
        switch (result) {
            case true:
                inputs.removeClass(errClass);
                errHtml.hide();
                break;
            case false:
                switch (isPrompt) {
                    case false:
                        inputs.removeClass(errClass);
                        errHtml.hide();
                        break;
                    default:
                        inputs.addClass(errClass);
                        errHtml.find('em').text(errText);
                        if (errText)
                            errHtml.show();
                        break;
                }
                break;
        }
    };

    /*第一个参数为错误文本 第二个为是否显示错误提示*/
    persagy_textElement.prototype.pvalidSpace = function pvalidSpace(errText, isPrompt) {
        errText = errText || this.getJqEle().attr(attrSp) || '请输入数据！';
        return validOper(this, String.prototype.pisSpace.name, isPrompt, errText);
    };
    /*验证手机号*/
    persagy_textElement.prototype.pvalidMobile = function pvalidMobile(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisMobile.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '请输入正确的手机号！');
    };

    /*验证固定电话*/
    persagy_textElement.prototype.pvalidTel = function pvalidTel(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisTel.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '请输入正确的电话号！');
    };

    /*验证数字*/
    persagy_textElement.prototype.pvalidNumber = function pvalidNumber(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisNumber.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '只能输入数字！');
    };

    /*验证正数*/
    persagy_textElement.prototype.pvalidPositiveNumber = function pvalidPositiveNumber(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisPositiveNumber.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '只能输入大于等于零的数字！');
    };

    /*验证负数*/
    persagy_textElement.prototype.pvalidNegativeNumber = function pvalidNegativeNumber(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisNegativeNumber.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '只能输入小于零的数字！');
    };

    /*验证整数*/
    persagy_textElement.prototype.pvalidInt = function pvalidInt(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisInt.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '只能输入整数型数字！');
    };

    /*验证正整数*/
    persagy_textElement.prototype.pvalidPositiveInt = function pvalidPositiveInt(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisPositiveInt.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '只能输入正整数！');
    };

    /*验证负整数*/
    persagy_textElement.prototype.pvalidNegativeInt = function pvalidNegativeInt(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisNegativeInt.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '只能输入负整数！');
    };

    /*验证身份证号*/
    persagy_textElement.prototype.pvalidCard = function pvalidCard(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisCard.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '请输入正确的身份证号！');
    };

    /*验证邮箱*/
    persagy_textElement.prototype.pvalidEmail = function pvalidEmail(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisEmail.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '请输入正确的邮箱！');
    };

    /*验证汉字*/
    persagy_textElement.prototype.pvalidChinese = function pvalidChinese(errText, isPrompt, spaceErrText) {
        return validOper(this, String.prototype.pisChinese.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '只能输入汉字！');
    };

    /*验证长度*/
    persagy_textElement.prototype.pvalidLength = function pvalidLength(length, errText, isPrompt) {
        return validOper(this, String.prototype.pvalidLength.name, isPrompt,
            errText || this.getJqEle().attr(attrErr) || '只能输入' + length + '个字符！', length);
    };

    /*显示某文本框的错误提示*/
    persagy_textElement.prototype.pshowTextTip = function (text) {
        var target = this.getJqEle();
        var textTarget = target.find('input,textarea')[0];
        if (document.activeElement == textTarget) return;
        pvalidCustom(false, text, true, textTarget);
    };

    /*控件恢复初始状态*/
    persagy_textElement.prototype.pctlRecover = function () {
        var target = this.getJqEle();
        target.phideTextTip();
        target.find('input,textarea').val('');
        if (target.find('textarea').length > 0) {
            target.find('[tle] b').eq(0).text(0);
        }
    };
    /*设置文本域长度提示的当前长度和总长度*/
    persagy_textElement.prototype.ptipCount = function (currLength, totalLength) {
        var target = this.getJqEle();
        var bLens = target.find('[tle] b');
        if (bLens.length > 0) {
            if (currLength || currLength == 0)
                bLens.eq(0).text(currLength);
            if (totalLength) bLens.eq(1).text(totalLength);
        }
    };
})();

/*获取或设置value值*/
persagy_textElement.prototype.pval = function (value) {
    var jqText = this.getJqEle().find('input,textarea');
    if (value == null) return jqText.val();
    jqText.val(value);
    jqText.ptipCount(value.length);
};
;/*
*博锐尚格下拉框库 默认创建区域控制下拉框
*自定义属性：icon  下拉框上的图标名字，默认为倒写的v图标   
            placeholder 下拉框默认的文本    hsource 头部数据源，用于绑定
            index  默认选项的索引      items 数据源
            text 为空时，则代表每项文本来源于数据源内的每项，否则每项文本来源于数据源内每项的此属性
*自定义事件：sel 每项的选择事件
*/
function persagy_combobox() {
    this.constructor = arguments.callee;
    this.customCbAttr = {
        placeholder: 'placeholder'
        , index: 'index'
        , items: 'items'
        , 'orien': 'orien'      /*展开的方向 默认向下   down 向下   up 向上*/
        , hsource: 'hsource'      /*头部数据源，用于绑定*/
        , headerprefix: ''      /*头部文本的前缀*/
    };
    this.customCbEvent = {
        sel: 'sel'
        , hclick: 'hclick'      /*头部点击事件*/
    };
    this.orienClass = {
        down: 'combobox-menu-bottom',
        up: 'combobox-menu-top'
    };
    this.animateTime = 300;             /*项展开、收起的时间 毫秒*/
};
persagy_combobox.prototype = new persagy_event();

/*构造html*/
persagy_combobox.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    type = type || p_combobox.childType.region;
    var id = objAttr[this.customAttr.id] ? objAttr[this.customAttr.id] : this.produceId();
    var ulId = this.produceId();
    var headId = this.produceId();
    var icon = objAttr[this.customAttr.icon] || 'v';
    var placeHolder = objAttr[this.customCbAttr.placeholder] || '';
    var index = parseInt(objAttr[this.customCbAttr.index]);
    var items = objAttr[this.customCbAttr.items] || [];
    var text = objAttr[this.customAttr.text] || '';
    var hsource = objAttr[this.customCbAttr.hsource] || '';
    var orien = objAttr[this.customCbAttr.orien] || persagy_control.orienObj.down;
    var orienClass = this.orienClass[orien];

    var typeStr = this.joinPtype(p_combobox.name, type);
    this.upAllCombox();

    var html1 = '<div ';
    var html2 = ' ' + this.persagyTypeAttr + '="' + typeStr + '">' +
                '<div class="combobox-title" header><span>' + icon + '</span>';
    var htmlEm = '<em>';
    var htmlThree = '</em></div><div class="combobox-con ' + orienClass + '"><ul id="' + ulId + '">';
    /*if (type == p_combobox.childType.form)
        htmlThree += this.createLi();
        */

    if (isRely != true) {
        html1 += ' id="' + id + '" ';
        var liStr = '';
        for (var i = 0; i < items.length; i++) {
            var currItem = items[i];
            var currText = (text ? (currItem || {})[text] : currItem) || '';
            if (currText)
                liStr += this.createLi(currText);
        }
        htmlEm += placeHolder;
    }
    else {
        var pb = persagy_toBind.getInstance();
        html1 += pb.createBind(null, null, false, false, null) + ' id="' + id + '" ';
        var bBindStr = pb.createBind({ text: text }, null, false, true);
        delete objAttr[this.customAttr.text];
        objEvent.click = objEvent[this.customCbEvent.sel];
        delete objEvent[this.customCbEvent.sel];
        var liBindStr = pb.createBind(objAttr, objEvent, false, true, { title: text });

        var emBindStr = pb.createBind({ text: hsource }, null);
        htmlEm = '<em ' + emBindStr + '>' + placeHolder;

        liStr = '<li ' + liBindStr + '><b ' + bBindStr + '></b></li>';
        liStr = pb.toRepeat(items, liStr);
    }

    var html = joinHtml();
    if (!parent) return joinHtml();
    objAttr.id = id;
    this.regInserted(watchEle, this.registerEvent({ attr: objAttr, event: objEvent, isRely: isRely }), false);
    this.appendHtml(parent, html);

    return new persagy_comboboxElement(id);

    function joinHtml() {
        return html1 + html2 + htmlEm + htmlThree + liStr + '</ul></div></div>';
    }
};

/*创建选项li*/
persagy_combobox.prototype.createLi = function (text) {
    return '<li title="' + (text || '') + '"><b>' + (text || '') + '</b></li>';
};

/*注册document事件以便收起所有下拉框*/
persagy_combobox.prototype.upAllCombox = function () {
    var isRegUp = document.regUp;
    if (isRegUp === true) return;
    document.regUp = true;
    var selector = this.joinSelector(p_combobox);
    this.domRegEvent(document, {
        click: (function (selector, animateTime) {
            return function () {
                $(selector).find('ul').parent().slideUp(animateTime);
            };
        })(selector, this.animateTime)
    }, false);
};

/*下拉表头部点击事件*/
persagy_combobox.prototype.pheaderClick = function (ul, headerEvent) {
    var selectorStr = this.joinSelector(p_combobox);
    return (function (u, selector, animateTime, he) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();
                var currUl = $(this).next().find('ul');
                $(selector).find('ul').not(currUl).parent().slideUp(animateTime);
                currUl.parent().slideToggle(animateTime);
                if (typeof he == 'string') he = eval(he.ppriperDel());
                if (typeof he == 'function') he(event);
            }
        };
    })(ul, selectorStr, this.animateTime, headerEvent);
};

/*每项选择事件*/
persagy_combobox.prototype.cbItemSel = function (selEvent, type, placeholder, headerPreFix) {
    return (function (selEvent, otherAttr, t, plh, hpf) {
        return {
            click: function (event) {
                if (event) {
                    event.stopBubbling();
                    event.stopDefault();
                }
                var target = event.target || event.srcElement;
                var li = $(target.tagName !== 'LI' ? target.parentNode : target);
                var index = li.index();
                var text = li.text();
                text = (hpf || '') + text;
                if (index == 0 && type == p_combobox.childType.form)
                    text = plh;
                var divHead = li.parent().parent().prev();
                if (t != p_combobox.childType.menu) {
                    var hedEm = divHead.find('em');
                    hedEm.text(text);
                    hedEm.attr('title', text);
                }
                event[otherAttr] = { index: index, target: li[0] };
                if (typeof selEvent === 'function') selEvent(event);
                $(event.currentTarget).parent().slideUp();
            }
        };
    })(selEvent, this.eventOthAttribute, type, placeholder, headerPreFix);
};

/*控件生成后 注册事件*/
persagy_combobox.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function (event) {
            if (event) {
                event.stopBubbling();
                event.stopDefault();
            }
            ob = ob || {};
            var objAttr = ob.attr || {};
            var objEvent = ob.event || {};
            var pb = persagy_public.getInstance();
            var srcTarget = pb.getInsertedSrcJqEle(event, objAttr.id);
            if (!srcTarget) return;

            var pe = persagy_event.getInstance();
            var pcm = new persagy_combobox();

            var plh = objAttr[pcm.customCbAttr.placeholder] || '';
            var index = parseInt(objAttr[pcm.customCbAttr.index]);
            var items = objAttr[pcm.customCbAttr.items] || [];
            var se = ob.isRely == true ? null : objEvent[pcm.customCbEvent.sel];

            srcTarget.each(function () {
                var htmlCurrTomboboxTarget = this;
                var jqCurrComboboxTarget = $(this);

                htmlCurrTomboboxTarget[pb.persagyEleObjAttr] = objAttr;
                pe.regConInserted(htmlCurrTomboboxTarget);

                var headerEle = jqCurrComboboxTarget.find('[header]');
                var currUl = jqCurrComboboxTarget.find('ul');
                var currChildType = pb.parsePtype(this).childType;

                /*头部点击打开下拉表*/
                if (headerEle[0]) {
                    pe.domRegEvent(headerEle[0], pcm.pheaderClick(currUl, objEvent[pcm.customCbEvent.hclick]));
                }
                /*头部文本改变事件*/
                var headerEventChange = {};
                headerEventChange[pe.insertedEvent] = pcm.headerTextChange(objAttr.headerprefix);
                pe.domRegEvent(headerEle.find('em')[0], headerEventChange);

                /*下拉表每项选择事件*/
                if (currUl[0]) {
                    var ulEvent = pcm.cbItemSel(se, currChildType, plh, objAttr.headerprefix);
                    pe.domRegEvent(currUl[0], ulEvent);
                }

                /*非绑定，且有默认选项时，设置默认选项*/
                if (index >= 0 && ob.isRely != true) {
                    htmlCurrTomboboxTarget.psel(index, false);
                    /*currUl.find('li').eq(index).click();*/
                }
            });
        };
    })(objBind);
};

persagy_combobox.prototype.headerTextChange = function (headerPreFix) {
    return (function (hpf) {
        return function (event) {
            hpf = hpf || '';
            var target = $(this);
            var currText = target.text();
            var lis = target.parent().next().find('li');
            lis.removeClass('pitch');
            for (var i = 0; i < lis.length; i++) {
                var curr = lis.eq(i);
                var currLiText = curr.find('b').text();
                if (!currLiText && !currText) continue;
                if (hpf + currLiText == currText) {
                    curr.addClass('pitch');
                    break;
                }
            }
        };
    })(headerPreFix);
};
;/*js创建时 返回此实例对象*/
function persagy_comboboxElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_comboboxElement.prototype = new persagyElement();
/*
*index 可以是索引、可以是选项值
        根据index来设置选中项
*index 没有值时返回当前选中项的索引
*isEvent 默认true，为true时设置选中项的同时激发该项的click事件
*/
persagy_comboboxElement.prototype.psel = function (index, isEvent) {
    isEvent = isEvent == false ? false : true;
    var pb = persagy_public.getInstance();
    var target = this.getJqEle();
    var headerPriFix = target[0][pb.persagyEleObjAttr].headerprefix || '';
    if (index == null) {
        var lis = target.find('li');
        var currLi = lis.filter('.pitch');
        var returnIndex = currLi.index();
        if (returnIndex > -1) return returnIndex;
        var headerText = target.find('[header] em').text();
        for (var i = 0; i < lis.length; i++) {
            if (headerPriFix + lis.eq(i).find('b').text() == headerText) {
                returnIndex = i;
            }
        }
        return returnIndex;
    }
    var lis = target.find('li');
    for (var i = 0; i < lis.length; i++) {
        if (lis.eq(i).find('b').text() === index)
            return isEvent ? lis[i].click() : target.find('[header] em').text(headerPriFix + index);
    }
    if (index.toString().pisInt()) {
        index = parseInt(index);
        if (index >= lis.length) return;
        return isEvent ? lis[index].click() :
            target.find('[header] em').text(headerPriFix + lis.eq(index).find('b').text());
    }
};

/*控件恢复初始状态*/
persagy_comboboxElement.prototype.pctlRecover = function () {
    var pb = persagy_public.getInstance();
    var target = this.getJqEle();
    var objAttr = target[0][pb.persagyEleObjAttr] || {};

    target.find('li').removeClass('pitch');
    var headerText = objAttr.placeholder || '';
    if (headerText.indexOf(pb.specialChart) > -1) return;
    target.find('[header] em').text(headerText);
};
;/*
*博锐尚格选项卡库 默认创建按钮选项卡
*自定义属性：
    icon 导航选项卡每项的图标，为空时，没有图标；否则每项图标来源于items中每项的此属性
    其它属性见customTabsAttr
*可使用target、$(target)或js创建的返回对象的psel(此方法接受一个参数,即选择的选项卡选项的索引)方法来选中某选项
*/
function persagy_tab() {
    this.customTabsAttr = {
        items: 'items'                /*array型 项数组*/
        , text: 'text'                /*每项的来源 为空时，每项来源于items中的每项；否则每项来源于items中每项的此属性*/
        , index: 'index'              /*int型 默认选中项的索引,从0开始  默认值0*/
        , template: 'template'        /*导航选项卡的内容区域的模板id*/
        , width: 'width'              /*每个选项卡的宽*/
    };
    this.customTabsEvent = {
        /*每项的选择事件 回调函数只有一个参数event 会追加上pEventAttr:{target:element,index:0,text:''}*/
        sel: 'sel'
    };
    this.selClass = 'cur';
    this.constructor = arguments.callee;
};

persagy_tab.prototype = new persagy_event();

persagy_tab.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_tab.childType.button;
    var ptypeStr = _this.joinPtype(p_tab.name, type);
    var id = objAttr.id ? objAttr.id : _this.produceId();
    var items = objAttr[_this.customTabsAttr.items] || [];
    var text = objAttr[_this.customTabsAttr.text] || '';
    var icon = objAttr[_this.customAttr.icon] || '';
    var template = objAttr[_this.customTabsAttr.template] || '';
    var width = objAttr[_this.customTabsAttr.width] || '';

    var templateHtml = (document.getElementById(template) || {}).innerHTML || '';
    var selEvent = objEvent[this.customTabsEvent.sel];

    var tabContentHtml = '<div class="tab-content">' + templateHtml + '</div>';
    var otherEventArr = [];
    /*if (type == p_tab.childType.navigation) {
        if (templateHtml) {
            var tmeplateObj = this.parseTemplate(templateHtml);
            templateHtml = tmeplateObj.templateHtml;
            otherEventArr = tmeplateObj.eventArr;
            tabContentHtml = '<div class="tab-content">' + templateHtml + '</div>';
        }
    }*/

    var iconStr = '';
    var html1 = '<div ';
    var html1_ = this.persagyTypeAttr + '="' + ptypeStr + '"><div class="tab-tit"><ul>';
    var liStr = '';
    var html2 = '</ul>' + (type == p_tab.childType.navigation ? tabContentHtml : '') + '</div></div>';
    if (isRely != true) {
        html1 += 'id="' + id + '" ';
        for (var i = 0; i < items.length; i++) {
            var currItem = items[i];
            var currText = text ? (currItem || {})[text] : currItem;
            if (!currText) continue;
            iconStr = currItem.icon ? '<span>' + currItem.icon + '</span>' : '';
            var spanStr = type == p_tab.childType.button ? currText : iconStr + '<em>' + currText + '</em>';
            liStr += '<li style="' + (width ? 'width:' + width + ';' : '') + '">' + spanStr + '</li>';
        }
    }
    else {
        selEvent = null;
        var pb = persagy_toBind.getInstance();
        html1 += pb.createBind(null, null, false, false, { id: id }) + ' ';

        if (type == p_tab.childType.navigation)
            iconStr = '<span ' + pb.createBind({ text: icon }, null, false, true) + '></span>';
        var emBindStr = pb.createBind({ text: text || '*$data' }, null, false, true);

        var liBindStr = pb.createBind(null, { click: objEvent[this.customTabsEvent.sel] }, false,
            false, null, type == p_tab.childType.button ? { width: width } : null);

        liStr = '<li ' + liBindStr + '>' + iconStr + '<em ' + emBindStr + '></em></li>';
        liStr = pb.toRepeat(items, liStr);
    }

    var html = html1 + html1_ + liStr + html2;
    if (!parent) {
        return type == p_tab.childType.navigation && templateHtml ? { html: html, otherEvent: otherEventArr } : html;
    }
    this.regInserted(watchEle, this.registerEvent({
        attr: objAttr, event: objEvent, isRely: isRely,
        oe: otherEventArr
    }));
    this.appendHtml(parent, html);
    return new persagy_tabElement(id);
};

/*每项选择事件*/
persagy_tab.prototype.itemSel = function (selEvent, type) {
    return (function (se, otherAttr, selClass, t) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();

                var target = $(event.target || event.srcElement);
                if (target[0].tagName !== 'LI') target = target.parent();
                if (target[0].tagName !== 'LI') return;
                new persagy_tab().setLiSelState(target);

                var li = target;
                var index = li.index();
                event[otherAttr] = { index: index, target: target[0] };
                if (typeof se === 'function') se(event);
            }
        };
    })(selEvent, this.eventOthAttribute, this.selClass, type);
};

/*此处不考虑选项卡创建在循环内的情况*/
persagy_tab.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function (event) {
            if (event) {
                event.stopBubbling();
                event.stopBubbling();
            }
            var pe = persagy_event.getInstance();
            var pb = persagy_public.getInstance();
            var ptn = new persagy_tab();
            pe.removeEvent(this, pe.insertedEvent);

            ob = ob || {};
            var objEvent = ob.event || {};
            var objAttr = ob.attr || {};

            var eventRe = ob.isRely != true ? objEvent[ptn.customTabsEvent.sel] : null;
            var tabTarget = $(this).find(pb.joinSelector(p_tab));
            var type = pb.parsePtype(tabTarget[0]).childType;
            var index = parseInt((objAttr[ptn.customTabsAttr.index] || '0').toString().ppriperDel()) || 0;

            var reTarget = $(this).find('ul:first');
            var eventObj = ptn.itemSel(eventRe, type);
            eventObj[pe.insertedEvent] = ptn.ulConChange(index);

            pe.domRegEvent(reTarget[0], eventObj);

            if (ob.isRely != true)
                this.psel(index, false);

            /*if(type== p_tab.childType.navigation)
                pb.regiTempConEvent({ otherEvent: ob.oe }, this);*/
            pb.createControlByCreateType(this);
        };
    })(objBind);
};

persagy_tab.prototype.ulConChange = function (defaultIndex) {
    return (function (index) {
        return function (event) {
            var currUl = $(this);
            var lis = currUl.find('li');
            if (lis.length == index + 1)
                new persagy_tab().setLiSelState(lis[index]);
        };
    })(defaultIndex);
};

persagy_tab.prototype.setLiSelState = function (li) {
    li = $(li);
    if (li.hasClass(this.selClass) == true) return false;
    li.siblings().removeClass(this.selClass);
    li.addClass(this.selClass);
    return true;
};
;/*js创建时 返回此实例对象*/
function persagy_tabElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_tabElement.prototype = new persagyElement();
/*选中某项*/
persagy_tabElement.prototype.psel = function (index, isEvent) {
    if (!index.toString().pisInt()) return;
    var target = this.getJqEle();
    var lis = target.find('li');
    var htmlLi = lis[index];
    if (!htmlLi) return false;
    if (isEvent == false) {
        return new persagy_tab().setLiSelState(htmlLi);
    }
    htmlLi.click();
};
;/*
*博锐尚格开关库 包括单选框、复选框、滑动开关，默认创建滑动开关
*自定义属性：
    text 单选框、复选框的提示文字
    其它属性见customSwAttr
*/
function persagy_switch() {
    this.customSwAttr = {
        state: 'state'      /*状态 可能的值为on|off   默认为off*/
        , name: 'name'      /*用于单选按钮分组*/
    };
    this.customSwEvent = {
        /*选择改变事件 回调函数只有一个参数event 会追加上pEventAttr:{target:element,state:'on off'} 
        *on 代表，滑动开关处于打开状态或单复选框被选中    off代表滑动开关处于关闭状态或单复选框没有被选中
        */
        change: 'change'
    };
    this.onClass = persagy_control.selState.on;
    this.offClass = persagy_control.selState.off;
    this.constructor = arguments.callee;
};

persagy_switch.prototype = new persagy_event();

persagy_switch.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_switch.childType.slide;
    var ptypeStr = _this.joinPtype(p_switch.name, type);
    var id = objAttr.id ? objAttr.id : _this.produceId();
    var text = objAttr[_this.customAttr.text] || '';
    var state = objAttr[_this.customSwAttr.state] || _this.offClass;
    var name = objAttr[_this.customSwAttr.name];
    var changeEvent = objEvent[this.customSwEvent.change];
    objAttr.id = id;

    var html1 = '<div ' + this.persagyTypeAttr + '="' + ptypeStr + '" id="' + id + '" ';
    var classStr = '';
    var html2 = '>';
    var textStr = '';
    var html3 = '</div>';

    if (isRely != true) {
        html1 += ' state="' + state + '" ' + (name ? 'name="' + name + '"' : '');
        classStr = ' class="' + state + '"';
        textStr = type == p_switch.childType.slide ? '' : text;
    }
    else {
        var pb = persagy_toBind.getInstance();
        var bindAttr = type == p_switch.childType.slide ? {} : { text: text };
        var bindCusAttr = { 'class': state, state: state };
        name ? bindCusAttr.name = name : '';
        html1 += pb.createBind(bindAttr, { click: changeEvent }, false, false,
            bindCusAttr) + ' ';
        changeEvent = null;
    }

    var html = html1 + classStr + html2 + textStr + html3;
    if (!parent) return html;
    this.regInserted(watchEle, this.registerEvent({ event: objEvent, isRely: isRely, attr: objAttr }), false);
    this.appendHtml(parent, html);
    return new persagy_tabElement(id);
};

/*点击事件*/
persagy_switch.prototype.changeSel = function (changeEvent) {
    return (function (ce, onClass, offClass, eventOthAttribute) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();

                var target = $(event.target || event.srcElement);
                if (target.attr('state') == null || target.attr('state') == offClass) {
                    target.ponState();
                }
                else {
                    var type = persagy_public.getInstance().parsePtype(this).childType;
                    if (type == p_switch.childType.radio) return;
                    target.poffState();
                }
                if (typeof ce == 'function') {
                    event[eventOthAttribute] = { state: target.attr('state') };
                    ce(event);
                }
            }
        };
    })(changeEvent, this.onClass, this.offClass, this.eventOthAttribute);
};

persagy_switch.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function (event) {
            ob = ob || {};
            var pb = persagy_public.getInstance();
            var srcTarget = pb.getInsertedSrcJqEle(event, (ob.attr || {}).id);
            if (!srcTarget) return;

            var pe = persagy_event.getInstance();
            var ps = new persagy_switch();

            var objEvent = ob.event || {};
            var ce = null;
            if (ob.isRely != true) ce = objEvent[ps.customSwEvent.change];

            srcTarget.each(function () {
                pe.regConInserted(this);
                pe.domRegEvent(this, ps.changeSel(ce));
            });
        };
    })(objBind);
};
;/*js创建时 返回此实例对象*/
function persagy_switchElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_switchElement.prototype = new persagyElement();

/*选中单复选框或打开开关*/
persagy_switchElement.prototype.pon = function () {
    var target = this.getJqEle();
    var psw = new persagy_switch();
    if (target.hasClass(psw.onClass)) return;
    target[0].click();
};

/*取消选中单复选框或关闭开关*/
persagy_switchElement.prototype.poff = function () {
    var target = this.getJqEle();
    var psw = new persagy_switch();
    if (target.hasClass(psw.offClass)) return;
    target[0].click();
};

/*选中单复选框或打开开关 不会触发事件*/
persagy_switchElement.prototype.ponState = function () {
    var target = this.getJqEle();
    var psw = new persagy_switch();
    if (target.hasClass(psw.onClass)) return;
    target.removeClass(psw.offClass);
    target.addClass(psw.onClass);
    target.attr('state', psw.onClass);

    var ppb = persagy_public.getInstance();
    if (ppb.parsePtype(target).childType == p_switch.childType.radio) {
        var name = target.attr('name');
        var ptype = target.attr(ppb.persagyTypeAttr);
        var radios = $('[' + ppb.persagyTypeAttr + '="' + ptype + '"][name="' + name + '"]').not(target);
        for (var i = 0; i < radios.length; i++) {
            radios[i].poffState();
        }
    }
};

/*取消选中单复选框或关闭开关 不会触发事件*/
persagy_switchElement.prototype.poffState = function () {
    var target = this.getJqEle();
    var psw = new persagy_switch();
    if (target.hasClass(psw.offClass)) return;
    target.removeClass(psw.onClass);
    target.addClass(psw.offClass);
    target.attr('state', psw.offClass);
};

/*获取或设置状态*/
persagy_switchElement.prototype.psel = function (state, isEvent) {
    var jqTarget = this.getJqEle();
    if (state == null)
        return jqTarget.attr('state');
    var fnName = 'p' + state + (isEvent == true ? '' : 'State');
    if (typeof jqTarget[fnName] == 'function') jqTarget[fnName]();
};

/*轮换选中、取消选中*/
persagy_switchElement.prototype.ptoggle = function (isEvent) {
    var jqTarget = this.getJqEle();
    var state = jqTarget.attr('state') == persagy_control.selState.off ? persagy_control.selState.on : 
        persagy_control.selState.off;
    var fnName = 'p' + state + (isEvent == true ? '' : 'State');
    if (typeof jqTarget[fnName] == 'function') jqTarget[fnName]();
};
;/*
*博锐尚格搜索框  包括即时搜索promptly  点击搜索delay   默认创建promptly
*/
function persagy_searchbox() {
    this.customSbAttr = {
        placeholder: 'placeholder'          /*搜索框的提示信息 默认:请输入搜索条件*/
        , ritems: 'ritems'                  /*即时搜索结果数据源，值必须为字符串*/
        , rtext: 'rtext'                    /*为空时，则代表即时搜索结果的每项来源于结果数据源内的每项，否则来源于结果数据                                                源内每项的此属性*/
        , childProName: 'childProName'      /*要找寻子级时，请传入子级属性的名称*/
        , combobox: 'combobox'              /*此值为true时 创建带下拉列表的搜索框*/
        , combind: 'combind'                /*object类型，具有的属性同下拉列表*/
        , protype: 'protype'                       /*根据类型筛选时，每项根据此属性的值进行匹配类型*/
        , isresult: 'isresult'              /*对于即时搜索，是否需要创建搜索结果，默认true*/
    };
    this.customSbEvent = {
        click: 'click'                    /*即时搜索结果的每行单击事件*/
        , filter: 'filter'                  /*点击搜索时，搜索按钮的点击事件；
                                            即时搜索不需创建搜索结果时的输入改变事件。
                                        回调参数event:{pEventAttr:{value:'输入值',typeIndex:'选择的类型索引'}}*/
    };
    this.constructor = arguments.callee;
};

persagy_searchbox.prototype = new persagy_event();

persagy_searchbox.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_searchbox.childType.promptly;
    var ptypeStr = _this.joinPtype(p_searchbox.name, type);

    var id = objAttr.id ? objAttr.id : _this.produceId();
    var comboboxId = _this.produceId();
    var txtId = _this.produceId();
    var searchIconId = _this.produceId();
    var ulId = _this.produceId();
    var resultDivId = _this.produceId();

    var placeholder = objAttr[_this.customSbAttr.placeholder] || '';

    var combobox = (objAttr[_this.customSbAttr.combobox] || '').toString().ppriperDel();
    var comboxBind = objAttr[_this.customSbAttr.combind] || {};

    var comboboxHtml = '';
    var pcmb = new persagy_combobox();
    if (combobox == 'true') {
        comboxBind.isRely = isRely;
        comboboxHtml = '<div class="dropdown" scombox p-create="combobox-noborder" p-bind="' +
            (JSON.stringify(comboxBind).replace(/\"/g, "'")) + '" p-rely="' + isRely + '"></div>';
    }
    var resultHtml = '';
    if (type === p_searchbox.childType.promptly) {
        resultHtml = '<div class="dropdown-con" dvresult id="' + resultDivId + '"><div class="soso-result">' +
                    '共<em class="cur">0</em>个搜索结果：</div><ul sresult id="' + ulId + '"></ul></div>';
    }

    var html = '<div id="' + id + '"' + _this.persagyTypeAttr + '="' + ptypeStr + '">' + comboboxHtml +
            '<div class="searchbox"><div class="titwrap"><input id="' + txtId +
            '" type="text" placeholder="' + placeholder + '"><b id="' +
            searchIconId + '" sicon>f</b></div>' + resultHtml + '</div></div>';

    if (!parent) return html;
    this.regInserted(watchEle, this.registerEvent({ attr: objAttr, event: objEvent }));
    this.appendHtml(parent, html);
    return new persagy_searchboxElement(id);
};

/*点击事件*/
persagy_searchbox.prototype.changeSel = function (changeEvent) {
    return (function (ce, onClass, offClass, eventOthAttribute) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();

                var target = $(event.target || event.srcElement);
                if (target[0].state == null || target[0].state == onClass) {
                    target.attr('class', offClass);
                    target[0].state = offClass;
                }
                else {
                    target.attr('class', onClass);
                    target[0].state = onClass;
                }
                if (typeof ce == 'function') {
                    event[eventOthAttribute] = { state: target[0].state };
                    ce(event);
                }
            }
        };
    })(changeEvent, this.onClass, this.offClass, this.eventOthAttribute);
};

persagy_searchbox.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function (event) {
            var target = $(this);
            var pe = persagy_event.getInstance();
            var pcb = new persagy_combobox();
            var psb = new persagy_searchbox();
            var pb = persagy_public.getInstance();

            pe.removeEvent(this, pe.insertedEvent);

            ob = ob || {};
            var objAttr = ob.attr || {};
            var objEvent = ob.event || {};

            var rc = objEvent[psb.customSbEvent.click];
            var sid = (target.find('[sicon]')[0] || {}).id;
            var txtTarget = target.find('input')[0];
            var t = pb.parsePtype(target.find(pb.joinSelector(p_searchbox))[0]).childType;
            var ls = objAttr[psb.customSbAttr.ritems] || '';
            var pron = objAttr[psb.customSbAttr.rtext] || '';
            var uid = (target.find('ul[sresult]')[0] || {}).id;
            var fter = objEvent[psb.customSbEvent.filter];
            var pt = objAttr[psb.customSbAttr.protype] || '';
            var rdid = (target.find('div[dvresult]')[0] || {}).id;

            /*即时搜索时 注册搜索框输入事件、获取焦点事件、失去焦点事件  注册结果ul的点击事件*/
            if (t == p_searchbox.childType.promptly) {
                pe.domRegEvent(txtTarget, {
                    input: psb.inputCall(ls, pron, uid, pt, sid, objAttr.isresult, objEvent.filter, rc, objAttr),
                    click: psb.clickCall()
                });
                /*pe.domRegEvent(document.getElementById(uid), { click: psb.resultCall(rc) });*/
                pe.domRegEvent(document, { click: psb.slideUpResult(rdid) }, false);
            }

            /*点击搜索时 注册搜索按钮的点击事件*/
            if (t == p_searchbox.childType.delay) {
                pe.domRegEvent(document.getElementById(sid), { click: psb.searchIconCall(fter) });
            }
            /*注册文本框激活事件*/
            pe.domRegEvent(txtTarget, {
                focus: psb.focusCall(ls, pron, uid, pt, t, sid, objAttr.isresult, objEvent.filter, rc, objAttr),
                blur: psb.blurCall()
            });
            pb.createControlByCreateType(this);
        };
    })(objBind);
};

/*即时搜索文本框输入事件的回调*/
persagy_searchbox.prototype.inputCall = function (listSource, proName, ulId, proType, searchIconId, isResult, filterEvent, resultClickEvent, objAttr) {
    var options = {
        list: listSource,
        proName: proName,
        eleId: ulId,
        proType: proType,
        registerResultSel: true,
        itemSel: this.resultCall(resultClickEvent),
        childProName: objAttr.childProName
    };
    return (function (opn, ir, fe, eoa) {
        return function (event) {
            var target = $(this);
            var comboxTarget = target.parent().parent().prev();
            if (ir != false) {
                var typeName = comboxTarget.find('em').text();
                var autocompleteObj = new autocomplete(opn);
                autocompleteObj.keyup(event, typeName);
                return;
            }
            if (typeof fe == 'string') {
                fe = fe.ppriperDel();
                fe = eval(fe);
            }

            if (typeof fe == 'function') {
                var val = target.val();
                var typeIndex = comboxTarget.length > 0 ? comboxTarget.psel() : -1;
                event[eoa] = { value: val, typeIndex: typeIndex };
                fe(event);
            }
        };
    })(options, isResult, filterEvent, this.eventOthAttribute);
};

/*即时搜索文本框获取焦点事件的回调*/
persagy_searchbox.prototype.focusCall = function (listSource, proName, ulId, proType, type, searchIconId, isResult, filterEvent, resultClickEvent, objAttr) {
    return (function (ls, pron, uid, prt, t, sid, rce, oattr) {
        return function (event) {
            event.stopBubbling();
            event.stopDefault();
            $(this).parent().parent().parent().addClass('active');
            if (t == p_searchbox.childType.promptly)
                new persagy_searchbox().inputCall(ls, pron, uid, prt, sid, isResult, filterEvent, rce, oattr)
                    .call(this, event);
        };
    })(listSource, proName, ulId, proType, type, searchIconId, resultClickEvent, objAttr);
};

/*即时搜索文本框单击事件的回调*/
persagy_searchbox.prototype.clickCall = function () {
    return (function () {
        return function (event) {
            event.stopBubbling();
            event.stopDefault();
        };
    })();
};

/*即时搜索文本框失去焦点事件的回调*/
persagy_searchbox.prototype.blurCall = function () {
    return (function () {
        return function (event) {
            $(this).parent().parent().parent().removeClass('active');
        };
    })();
};

/*即时搜索结果的点击事件*/
persagy_searchbox.prototype.resultCall = function (resultCall) {
    return (function (rc, eoa) {
        return function (event, index, resultArr) {
            $(this).parent().hide();
            var target = event.target;
            target = target.tagName !== 'LI' ? target.parentNode : target;
            if (target.tagName !== 'LI') return;
            var li = $(target);
            var index = li.index();
            event[eoa] = { index: index, target: li[0], arr: resultArr || [] };
            if (typeof rc == 'string') rc = eval(rc.ppriperDel());
            if (typeof rc === 'function') rc(event);
        };
    })(resultCall, this.eventOthAttribute);
};

/*点击搜索时  搜索按钮的点击事件*/
persagy_searchbox.prototype.searchIconCall = function (filterCall) {
    return (function (fc, eoa) {
        return function (event) {
            var target = $(this);
            var value = target.prev().val();
            var comboxTarget = target.parent().parent().prev();
            var typeIndex = comboxTarget.length > 0 ? comboxTarget.psel() : -1;
            event[eoa] = { value: value, typeIndex: typeIndex };
            if (typeof fc == 'string') fc = eval(fc.ppriperDel());
            if (typeof fc === 'function') fc(event);
        };
    })(filterCall, this.eventOthAttribute);
};

/*document click事件 收起即时搜索的结果*/
persagy_searchbox.prototype.slideUpResult = function (rdid) {
    return (function (id) {
        return function () {
            $('#' + id).hide();
        };
    })(rdid);
};
;/*js创建时 返回此实例对象*/
function persagy_searchboxElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_searchboxElement.prototype = new persagyElement();

/*
*清空搜索框并恢复下拉框的初始状态
*isCombobox 为true时恢复下拉框的初始状态
*/
persagy_searchboxElement.prototype.pctlRecover = function (isCombobox) {
    var target = this.getJqEle();
    var childs = target.children();
    var textDiv = childs.eq(childs.length - 1);
    if (textDiv.length == 0) return;
    textDiv.find('input').val('');
    target.find('div[dvresult]').hide();

    if (isCombobox != true || childs.length == 1) return;
    childs.eq(0).pctlRecover();
};
;/*
*博锐尚格进度指示器控件 包括common、waiting、loading  默认创建common
*自定义属性：text 提示上显示的文字
*/
function persagy_progress() {
    this.constructor = arguments.callee;
};

persagy_progress.prototype = new persagy_event();

persagy_progress.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_progress.childType.common;
    var ptypeStr = _this.joinPtype(p_progress.name, type);
    var id = objAttr.id ? objAttr.id : _this.produceId();
    var text = objAttr[_this.customAttr.text] || '加载中，请稍候...';
    if (type != p_progress.childType.waiting) text = '';

    var html = '<div id="' + id + '" ' + _this.persagyTypeAttr + '="' + ptypeStr +
               '"><div>' + text + '</div></div>';
    /*加全局遮罩*/
    this.createMask();
    if (!parent) return html;
    _this.appendHtml(parent, html);
    return new persagy_progressElement(id);
};
;/*js创建时 返回此实例对象*/
function persagy_progressElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_progressElement.prototype = new persagyElement();

persagy_progressElement.prototype.pshow = function () {
    var target = this.getJqEle();
    target.show();
    persagy_public.getInstance().maskHide();
    target.parent().show();
};

persagy_progressElement.prototype.phide = function () {
    var target = this.getJqEle();
    target.hide();
    persagy_public.getInstance().maskHide();
    target.parent().hide();
};
;/*
*博锐尚格树形菜单窗体 包括normal   combobox  默认创建normal，使用vue的时候，需要把树上的事件方法写成全局的
*自定义属性：
*   text 创建combobox类型时，按钮上的文本
*/
function persagy_tree() {
    this.customTeAttr = {
        nodeid: 'nodeid',                   /*每一个节点的节点ID*/
        placeholder: 'placeholder'          /*窗体内文本框的默认文本*/
        , orien: 'orien'                    /*三角的位置，可能的值为left或right*/
        , items: 'items'                    /*树菜单数据源*/
        , ritems: 'ritems'                  /*即时搜索结果数据源，值必须为字符串*/
        , protext: 'protext'                /*每级菜单显示此属性的值*/
        , prochild: 'prochild'              /*存放每级菜单的子级菜单的属性名称*/
    };
    this.customTeEvent = {
        click: 'click'                      /*每级菜单的单击事件*/
        , bclick: 'bclick'                  /*combobox类型上的按钮的点击事件*/
        , sel: 'sel'                        /*搜索结果单击事件*/
    };
    this.constructor = arguments.callee;
};

persagy_tree.prototype = new persagy_event();

persagy_tree.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_tree.childType.normal;
    var ptypeStr = _this.joinPtype(p_tree.name, type);
    var id = objAttr.id ? objAttr.id : _this.produceId();
    var ulId = _this.produceId();
    var btnId = _this.produceId();
    var templateId = _this.produceId();
    var placeholder = objAttr[_this.customTeAttr.placeholder] || '';
    var orien = objAttr[_this.customTeAttr.orien] || '';
    var items = objAttr[_this.customTeAttr.items] || [];
    var proText = objAttr[_this.customTeAttr.protext] || '';
    var nodeId = objAttr[_this.customTeAttr.nodeid] || '';
    var proChild = objAttr[_this.customTeAttr.prochild] || '';
    var btext = objAttr[_this.customAttr.text] || '确定';

    var click = objEvent[_this.customTeEvent.click];

    var html = '<div ' + _this.persagyTypeAttr + '="' + ptypeStr + '" id="' + id +
                '"><div class="float-arrow left"></div><div class="float-title">' +
                '<div p-type="searchbox-promptly" search><div class="searchbox"><div class="titwrap">' +
                '<input type="text" placeholder="' + placeholder +
                '"><b>f</b></div></div></div></div><div class="float-con"><div tcond>';
    var pbtn = new persagy_button();
    var btnHtml = pbtn.createHtml({ icon: 'r' }, {}, 'blueIconNoBorder');

    var psw = new persagy_switch();
    var checkBoxHtml = psw.createHtml({}, {}, 'checkbox');

    var btnHtml2 = type == p_tree.childType.normal ? '' :
        '<div class="float-button" tfbtnd>' + pbtn.createHtml({ text: btext, id: btnId }, {}, 'backBlueBorder') +
        '</div>';

    var conHtml = '';
    if (isRely != true) {
        conHtml = createConHtml(items, 0);
    } else {
        conHtml = createConBindHtml();
    }

    html += conHtml + '</div><div class="search-result" dvresult style="display: none;">' +
           '<ul trtul id="' + ulId + '"></ul></div></div>' + btnHtml2 + '</div>';
    if (!parent) return html;

    this.regInserted(watchEle, this.registerEvent({ attr: objAttr, event: objEvent, isRely: isRely }));
    this.appendHtml(parent, html);
    return new persagy_treeElement(id);

    function createConHtml(citems, level) {
        var pleft = level * 10 + 'px';
        var tempHtml = '';
        for (var i = 0; i < citems.length; i++) {
            var currItem = citems[i];
            var currText = proText ? currItem[proText] || '' : currItem;
            var currNodeId = nodeId ? currItem[nodeId] || '' : '';
            var child = !proChild || !currItem[proChild] ? [] : currItem[proChild];

            var currHtml = '<div class="tree-temp"><div class="temp-title" line style="padding-left:' +
                pleft + ';" nid="' + currNodeId + '" lv="' + level + '"><div class="arrows" slide style="visibility:' +
                (child.length > 0 ? 'visible' : 'hidden') + ';">'
                + btnHtml + '</div>' + ''
                /*(type != p_tree.childType.combobox ? '' :
                '<div class="checkbox" check style="visibility:' + (child.length > 0 ? 'visible' : 'hidden') +
                ';">' + checkBoxHtml + '</div>')*/
                + '<b title="' + currText + '">' + currText + '</b><em tag>z</em></div>';
            if (child.length > 0) {
                currHtml += '<div class="temp-con">' + arguments.callee(child, level + 1) + '</div>';
            }
            currHtml = '<div>' + currHtml + '</div></div>';
            tempHtml += currHtml;
        }
        return tempHtml;
    };

    function createConBindHtml() {
        var pb = persagy_toBind.getInstance();
        var prefixB = pb.currFrameType == pb.frameTypes.vue.name.toLowerCase() ? 'model.' : '';

        var tttHtml = '<div class="temp-con"></div>';
        var bBindHtml = '<b ' + pb.createBind({ text: proText }, null, false, true, { title: proText }) + '></b>';
        var titleBindHtml = pb.createBind(null, { click: click }, false, true, { nid: nodeId, lv: '*level' },
                            '\'padding-left\':' + prefixB + 'level*10+\'px\'');
        var childTemplateHtml = pb.toRepeatTemplate(proChild, '<div></div>', templateId, true);
        var childConHtml = '<div class="temp-con">' + childTemplateHtml + '</div>';
        var iconVisibleB = prefixB + proChild.ppriperDel();
        var iconVisibleHtml = pb.createBind(null, null, false, true, null, 'visibility: ' + iconVisibleB + '&&' +
            iconVisibleB + '.length>0?\'visible\':\'hidden\'');
        var cccc = '';
        /*type != p_tree.childType.combobox ? '' :
            '<div class="checkbox" check ' + iconVisibleHtml + '>' + checkBoxHtml + '</div>';*/

        var forHtml = '<div class="tree-temp"><div class="temp-title" line ' + titleBindHtml + '>' +
                      '<div class="arrows" slide ' + iconVisibleHtml + '>' + btnHtml + '</div>' +
                      cccc +
                      bBindHtml + '<em tag>Z</em></div>' + childConHtml + '</div>';
        forHtml = pb.currFrameType == pb.frameTypes.ko.name ? '<div>' + forHtml + '</div>' : forHtml;
        var templateHtml = pb.createScriptTemplate(templateId, forHtml);

        var maxBind = pb.toRepeatTemplate(items, '<div></div>', templateId, false, { click: click });
        return templateHtml + maxBind;
    };
};

persagy_tree.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function () {
            event.stopBubbling();
            event.stopDefault();
            var pb = persagy_public.getInstance();
            var pe = persagy_event.getInstance();
            var pt = new persagy_tree();

            pe.removeEvent(this, pe.insertedEvent);
            var target = $(this);

            ob = ob || {};
            var objAttr = ob.attr || {};
            var objEvent = ob.event || {};

            var lc = ob.isRely == true ? null : objEvent[pt.customTeEvent.click];
            var t = pb.parsePtype(target.find(pb.joinSelector(p_tree))).childType;
            var bid = (target.find('[tfbtnd]').children()[0] || {}).id;
            var ce = objEvent[pt.customTeEvent.bclick];
            var uid = (target.find('[trtul]')[0] || {}).id;
            var sel = objEvent[pt.customTeEvent.sel];
            sel = typeof sel == 'string' ? eval(sel.ppriperDel()) : sel;

            /*注册确定按钮点击事件*/
            if (t == p_tree.childType.combobox)
                pe.domRegEvent(document.getElementById(bid), pt.btnClickEvent(ce));

            /*注册搜索框键盘事件*/
            var input = target.find('input')[0];
            pe.domRegEvent(input, pt.inputCall(objAttr.ritems, objAttr.protext, objAttr.prochild, uid, sel));
            pe.domRegEvent(input, pt.focusCall(objAttr.ritems, objAttr.protext, objAttr.prochild, uid, sel));
            pe.domRegEvent(input, pt.blurCall());

            var conDiv = target.find('[tcond]')[0];
            if (objBind.isRely != true) {
                pt.conChange(lc, t).call(conDiv, event);
                return;
            }
            /*注册内容区内容改变事件*/
            var conCh = {};
            conCh[pe.insertedEvent] = pt.conChange(lc, t);
            pe.domRegEvent(conDiv, conCh);
        };
    })(objBind);
};

persagy_tree.prototype.conChange = function (lineClick, type) {
    return (function (lc, t) {
        return function (event) {
            event.stopBubbling();
            event.stopDefault();

            var pe = persagy_event.getInstance();
            var pt = new persagy_tree();
            var psw = new persagy_switch();

            var target = $(this);
            var slideIcon = target.find('[slide]');
            var line = target.find('[line]');
            var checkBoxs = target.find('[check]');

            /*注册行单击事件*/
            for (var i = 0; i < line.length; i++) {
                pe.domRegEvent(line[i], pt.lineEvent(lc, t));
            }

            /*注册展开按钮点击事件*/
            for (i = 0; i < slideIcon.length; i++) {
                pe.domRegEvent(slideIcon[i], pt.slideIconEvent());
            }

            /*注册复选框点击事件*/
            for (i = 0; i < checkBoxs.length; i++) {
                psw.registerEvent({ event: { change: pt.checkEvent() } })({});
            }
        };
    })(lineClick, type);
};

/*行单击事件*/
persagy_tree.prototype.lineEvent = function (lineCall, type) {
    return (function (lc, t, eoa) {
        return {
            click: function (event) {
                var target = $(this);
                if (t == p_tree.childType.normal) {
                    var maxDiv = target.parents('[' + persagy_public.getInstance().persagyTypeAttr + ']');
                    maxDiv.find('[line]').not(target).removeClass('pitch');
                }
                var state = target.hasClass('pitch') ? persagy_control.selState.off : persagy_control.selState.on;
                target.toggleClass('pitch');

                persagy_tree.expandParent(target);

                /*if (target.parent().parent().parent().hasClass('temp-con') == true) {
                    var parentCheck = target.parent().parent().parent().prev().find('[check]').children();
                    if (state == persagy_control.selState.off) parentCheck.poffState();
                    else {
                        if (target.parent().parent().siblings().children().children().filter('.temp-title')
                            .not('.pitch').length == 0)
                            parentCheck.ponState();
                    }
                }*/

                if (typeof lc == 'function') {
                    event[eoa] = { text: target.find('b').text(), state: state };
                    lc(event);
                }
            }
        };
    })(lineCall, type, this.eventOthAttribute);
};

/*注册展开按钮点击事件*/
persagy_tree.prototype.slideIconEvent = function () {
    return (function () {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();
                var target = $(this).parent().next().slideToggle();
                var iconText = {
                    r: 'b', b: 'r'
                };
                var oldText = $(this).children().text();
                $(this).children().text(iconText[oldText]);
            }
        };
    })();
};

/*注册复选框点击事件*/
persagy_tree.prototype.checkEvent = function (type) {
    return (function (t, eoa) {
        return function (event) {
            var currLineTarget = $(event.srcElement || event.target).parent().parent();

            var pt = new persagy_tree();
            var psw = new persagy_switch();
            var conTarget = currLineTarget.next();
            var state = event[eoa].state;
            var lines = [];
            switch (state) {
                case psw.offClass:
                    currLineTarget.hasClass('pitch') ? pt.lineEvent(null, t).click.call(currLineTarget) : '';
                    lines = conTarget.children().children().children().filter('.temp-title').filter('.pitch');
                    break;
                case psw.onClass:
                    currLineTarget.hasClass('pitch') ? '' : pt.lineEvent(null, t).click.call(currLineTarget);
                    lines = conTarget.children().children().children().filter('.temp-title').not('.pitch');
                    break;
            }
            for (var i = 0; i < lines.length; i++) {
                pt.lineEvent(null, t).click.call(lines[i]);
            }
        };
    })(type, this.eventOthAttribute);
};

/*注册按钮点击事件*/
persagy_tree.prototype.btnClickEvent = function (cevent) {
    return (function (ce, eoa) {
        return {
            click: function (event) {
                var psw = new persagy_switch();
                var treeDiv = $(this).parent().parent();
                var sellines = treeDiv.find('.pitch');
                var sels = [];
                for (var i = 0; i < sellines.length; i++) {
                    sels.push(sellines.eq(i).find('b').text());
                }
                event[eoa] = { sels: sels };
                if (typeof ce == 'string') {
                    ce = eval(ce.ppriperDel());
                }
                if (typeof ce == 'function') ce(event);
                treeDiv.hide();
            }
        };
    })(cevent, this.eventOthAttribute);
};

/*搜索结果 单击事件的回调*/
persagy_tree.prototype.resultSel = function (sel) {
    return (function (rsel, eoa) {
        return function (event, index, resultArr) {
            if (typeof rsel != 'function') return;
            var li = event.currentTarget;
            var text = li.innerText;
            event[eoa] = { index: index, target: li, arr: resultArr || [] };
            rsel(event);
        };
    })(sel, this.eventOthAttribute);
};

/*注册搜索框的键盘事件*/
persagy_tree.prototype.inputCall = function (ritems, rtext, rchild, ulId, sel) {
    return (function (items, text, child, uid, rsel) {
        return {
            input: function (event) {
                var target = $(this);
                var conDiv = target.parent().parent().parent().parent().next();
                var childrens = conDiv.children();
                if (target.val() == '') {
                    childrens.eq(0).show();
                    childrens.eq(1).hide();
                } else {
                    childrens.eq(0).hide();
                    childrens.eq(1).show();

                    var options = {
                        list: items,
                        eleId: uid,
                        proName: (text || '').ppriperDel(),
                        childProName: (child || '').ppriperDel(),
                        registerResultSel: true,
                        itemSel: new persagy_tree().resultSel(rsel)
                    };
                    var autocompleteObj = new autocomplete(options);
                    var resultArr = autocompleteObj.keyup(event);
                }
            }
        };
    })(ritems, rtext, rchild, ulId, sel);
};

/*即时搜索文本框获取焦点事件的回调*/
persagy_tree.prototype.focusCall = function (ritems, rtext, rchild, ulId, sel) {
    return (function (items, text, child, uid, rsel) {
        return {
            focus: function (event) {
                event.stopBubbling();
                event.stopDefault();
                $(this).parent().parent().parent().addClass('active');
                var pt = new persagy_tree();
                pt.inputCall(items, text, child, uid, rsel).input.call(this, event);
            }
        };
    })(ritems, rtext, rchild, ulId, sel);
};

/*即时搜索文本框失去焦点事件的回调*/
persagy_tree.prototype.blurCall = function () {
    return (function () {
        return {
            blur: function (event) {
                $(this).parent().parent().parent().removeClass('active');
            }
        };
    })();
};

/*选中某节点时展开父级*/
persagy_tree.expandParent = function (target) {
    var level = $(target).attr('lv');
    if (level == '0') return;
    var parentTitleTarget = target.parent().parent().parent().prev();
    var iconTarget = parentTitleTarget.children().eq(0);
    var iconText = iconTarget.find('div').text();
    if (iconText == 'r') iconTarget[0].click();
    arguments.callee(parentTitleTarget);
};
;/*js创建时 返回此实例对象*/
function persagy_treeElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_treeElement.prototype = new persagyElement();

persagy_treeElement.prototype.pshow = function () {
    var target = this.getJqEle();
    var left = target.css('left');
    var right = target.css('right');
    left ? target.css('left', '0') : target.css('right', '0');
};

persagy_treeElement.prototype.phide = function () {
    var target = this.getJqEle();
    var left = target.css('left');
    var right = target.css('right');
    left ? target.css('left', '-100%') : target.css('right', '-100%');
};

/*
*清空搜索框和已选择的项
*isClearSel 为true时，会把所有已选择的项清除，默认true
*/
persagy_treeElement.prototype.pctlRecover = function (isClearSel) {
    var target = this.getJqEle();
    var searchDiv = target.find('div[search]');
    target.find('div[dvresult]').hide();
    target.find('div[tcond]').show();
    if (searchDiv.length > 0) searchDiv.pctlRecover();
    if (isClearSel !== false) {
        target.find('[line]').removeClass('pitch');
    }
};

/*
*nodeId 节点ID
*isEvent 默认true，为true时设置选中项的同时激发该项的click事件
*seledToHandle 节点ID对应的项已被选中时的处理操作，默认0；0 什么也不做；1 取消选中；2 在选中和未选中之间切换
*/
persagy_treeElement.prototype.psel = function (nodeId, isEvent, seledToHandle) {
    isEvent = isEvent == false ? false : true;
    seledToHandle = seledToHandle === 1 ? 1 : seledToHandle === 2 ? 2 : 0;

    var pb = persagy_public.getInstance();
    var target = this.getJqEle();
    var currNodeTarget = target.find('[line][nid="' + nodeId + '"]');
    if (currNodeTarget.length == 0) return;
    persagy_tree.expandParent(currNodeTarget);
    var className = 'pitch';
    var hasClass = currNodeTarget.hasClass(className);
    if (isEvent) {
        if (!hasClass) return currNodeTarget[0].click();
        switch (seledToHandle) {
            case 0: return;
            case 1: 
            case 2:
                return currNodeTarget[0].click();
        }
    }
    else {
        if (!hasClass) return currNodeTarget.addClass(className);
        switch (seledToHandle) {
            case 0: return;
            case 1:
            case 2:
                return currNodeTarget.toggleClass(className);
        }
    }
};
;/*
*博锐尚格提示信息库  包括渐隐式通知notice  异常信息提示abnormalMess  默认创建渐隐式通知
*自定义属性：
    text 渐隐式通知的文本
    其它属性见customPtAttr
*可使用target、$(target)或js创建的返回对象的pshow方法来显示渐隐式通知
*/
function persagy_prompt() {
    this.customPtAttr = {
        title: 'title'              /*异常信息提示的标题*/
        , subtitle: 'subtitle'      /*异常信息提示的副标题*/
    };
    this.constructor = arguments.callee;
};

persagy_prompt.prototype = new persagy_event();

persagy_prompt.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_prompt.childType.notice;
    var ptypeStr = _this.joinPtype(p_prompt.name, type);
    var id = objAttr.id ? objAttr.id : _this.produceId();
    var text = objAttr[_this.customAttr.text] || '';
    var title = objAttr[_this.customPtAttr.title] || '';
    var subTitle = objAttr[_this.customPtAttr.subtitle] || '';

    var html = '';
    if (type == p_prompt.childType.notice)
        html = '<div id="' + id + '" ' + this.persagyTypeAttr + '="' + ptypeStr + '" class="succeed">' +
            text + '</div>';
    else {
        html = '<div id="' + id + '" ' + this.persagyTypeAttr + '="' + ptypeStr +
            '"><div class="img-view"></div><b>' + title + '</b><span>' + subTitle + '</span></div>';
    }
    if (!parent) return html;
    this.appendHtml(parent, html);
    return new persagy_promptElement(id);
};
;/*js创建时 返回此实例对象*/
function persagy_promptElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_promptElement.prototype = new persagyElement();

/*显示渐隐式通知
*state 可能的值见p_prompt.noticeType
*text  通知信息
*/
persagy_promptElement.prototype.pshow = function (state, text) {
    var target = $('#' + this.id);
    var parent = target.parent();
    var height = target.height();
    target.text(text || '');
    target.attr('class', state);

    target.stop(true, true).animate({ 'marginTop': '0px', opacity: 1 }, 200).
        delay(2000).animate({ 'marginTop': (-height) + 'px', opacity: 0 }, 500);
};
;/*
*博锐尚格时间控件 包括表单时间控件form  图表时间控件chart  
*   能组合的图表时间控件dchart  默认创建表单时间控件
*表单时间控件永远只有一段，图表时间控件只到日或周
*事件 sel   选择时间后的回调
*/
function persagy_time() {
    this.constructor = arguments.callee;
    this.customTAttr = {
        minyear: 'minyear'      /*可选择的最小年份，默认为当前年往前推十年*/
        , maxyear: 'maxyear'    /*可选择的最大年份，默认为当前年往后推五年*/
        , format: 'format'      /*可能的值包括：y一段的年、yy两段的年、M一段的月、MM两段的月、d(日)、
                                dd(日日)、h(小时)、hh(时时)、m(分)、mm(分分)、w(周)、ww(周周)     日和周只可取其一，并存时                                创建选择周的表单时间控件。都不存在时，对于表单时间控件默认创建选择日的*/
        , show: 'show'          /*图表时间控件的显示方式 v 两段上下排列    h 两段左右排列   默认左右排列*/
        , lock: 'lock'          /*为true时  锁定步长   dchart类型的默认锁定，其它类型默认不锁定*/
        , xlock: 'xlock'        /*是否需要锁按钮，false时不需要，默认true*/
        /*start object型，开始时间，属性包括:y:整型或字符串型的年份,M:整型或字符串型的月份,d:整型或字符串型的日,
                    h:整型或字符串型的时，m:整型或字符串型的分,w:整型或字符串型的周
        */
        , start: 'start'
        /*end object型，结束时间，属性同start*/
        , end: 'end'
    };

    this.chartShowClass = {
        h: 'calendar-horizontal'
        , v: 'calendar-vertical'
        , animateClass: 'animat'
        , weekDayClass: 'cur'
        , jiantouStateClass: 'jiantou'
    };
    this.lockIcon = {
        /*锁定状态*/
        s: {
            text: 's', nextText: 'c'
        },
        /*解锁状态*/
        c: {
            text: 'c', nextText: 's'
        }
    };
    this.customEvent = { sel: 'sel' };
};
persagy_time.prototype = new persagy_event();

/*构造html*/
persagy_time.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type || p_time.childType.form;
    var id = objAttr[this.customAttr.id] ? objAttr[this.customAttr.id] : this.produceId();
    var minYear = parseInt((objAttr[this.customTAttr.minyear] || '').toString().ppriperDel());
    var maxYear = parseInt((objAttr[this.customTAttr.maxyear] || '').toString().ppriperDel());
    var format = (objAttr[this.customTAttr.format] || 'yMdhm').ppriperDel();
    var show = (objAttr[this.customTAttr.show] || 'h').ppriperDel();
    var lock = objAttr[this.customTAttr.lock];
    lock = !lock && lock != false ? 'false' : lock.toString().ppriperDel();
    var lockText = lock == 'true' ? this.lockIcon.s.text : this.lockIcon.c.text;
    objAttr.id = id;

    var typeStr = this.joinPtype(p_time.name, type);
    var currDate = new Date();
    var currYear = currDate.getFullYear();
    var currMonth = currDate.getMonth() + 1 < 10 ? '0' + (currDate.getMonth() + 1) : currDate.getMonth() + 1;
    var currDay = currDate.getDate() < 10 ? '0' + currDate.getDate() : currDate.getDate();
    var currHour = currDate.getHours() < 10 ? '0' + currDate.getHours() : currDate.getHours();
    var currMinute = currDate.getMinutes() < 10 ? '0' + currDate.getMinutes() : currDate.getMinutes();

    if (!minYear) {
        minYear = (currDate.getFullYear() - 10).toString();
    }
    if (!maxYear) {
        maxYear = (currDate.getFullYear() + 5).toString();
    }

    var yearMarker = format.replace(/[^y]/g, '');
    var monthMarker = format.replace(/[^M]/g, '');
    var dayMarker = format.replace(/[^d]/g, '');
    var weekMarker = format.replace(/[^w]/g, '');
    if (weekMarker) dayMarker = '';
    var hourMarker = format.replace(/[^h]/g, '');
    var minuteMarker = format.replace(/[^m]/g, '');

    var year1Html = '', month1Html = '', day1Html = '',
        hour1Html = '', minute1Html = '', html = '';

    var yearItems = [], monthItems = [],
        dayItems = [], hourItems = [], minuteItems = [];
    for (var i = minYear; i <= maxYear; i++) {
        yearItems.push(i);
    }
    for (i = 1; i <= 12; i++) {
        monthItems.push(i < 10 ? '0' + i : i);
    }
    var maxDay = this.getMaxDay(currDate.getFullYear(), currDate.getMonth() + 1);

    for (i = 1; i <= maxDay; i++) {
        dayItems.push(i < 10 ? '0' + i : i);
    }
    for (i = 0; i <= 23; i++) {
        hourItems.push(i < 10 ? '0' + i : i);
    }
    for (i = 0; i <= 59; i++) {
        minuteItems.push(i < 10 ? '0' + i : i);
    }

    var pcmb = new persagy_combobox();
    this.slideUpUl();
    if (type == p_time.childType.form) {
        if (yearMarker.length > 0) {
            year1Html = '<div class="year-box">' +
                pcmb.createHtml({ placeholder: currYear + ' 年', items: yearItems }, {}, 'menu') +
                '</div>';
        }
        if (monthMarker.length > 0) {
            month1Html = '<div class="month-box">' +
                pcmb.createHtml({ placeholder: currMonth + ' 月', items: monthItems }, {}, 'menu') +
                '</div>';
        }
        if (dayMarker.length > 0) {
            day1Html = '<div class="day-box">' +
                pcmb.createHtml({ placeholder: currDay + ' 日', items: dayItems }, {}, 'menu') +
                '</div>';
        }
        if (hourMarker.length > 0) {
            hour1Html = '<div class="hour-box">' +
                pcmb.createHtml({ placeholder: currHour + ' 时', items: hourItems }, {}, 'menu') +
                '</div>';
        }
        if (minuteMarker.length > 0) {
            minute1Html = '<div class="minute-box">' +
                pcmb.createHtml({ placeholder: currMinute + ' 分', items: minuteItems }, {}, 'menu') +
                '</div>';
        }
        html = '<div id="' + id + '" ' + this.persagyTypeAttr + '="' + typeStr + '">' +
                year1Html + month1Html + day1Html
                + hour1Html + minute1Html + '</div>';
    } else if (type == p_time.childType.chart) {
        /*默认是1段还是2段*/
        var duanShu = yearMarker.length > 1 || monthMarker.length > 1 ||
            dayMarker.length > 1 || weekMarker.length > 1 ? 2 : 1;

        var monthIsSel = monthMarker.length > 0 || weekMarker.length > 0 || dayMarker.length > 0 ? true : false;
        var dayIsSel = monthIsSel == false || (weekMarker.length == 0 && dayMarker.length == 0) ? false : true;

        year1Html = createChartDuanHtml(currYear, '年', yearItems, true);
        month1Html = createChartDuanHtml(currMonth, '月', monthItems, monthIsSel);
        day1Html = createChartDuanHtml(currDay, weekMarker.length > 0 ? '周' : '日', dayItems, dayIsSel);
        var isLock = objAttr[this.customTAttr.xlock];
        var lockHtml = isLock == false ? '' : '<div class="time-lock">' + lockText + '</div>';
        html = '<div id="' + id + '" ' + this.persagyTypeAttr + '="' + typeStr + '" class="' +
                this.chartShowClass[show] + '"><div class="calendar-box">' +
                year1Html + month1Html + day1Html +
                '</div><div class="time-to ' + (duanShu == 1 ? this.chartShowClass.jiantouStateClass : '')
                + '" ' + (lock == 'true' ? 'disabled' : '') +
                '></div><div class="calendar-box ' +
                (duanShu == 1 && show == 'v' ? this.chartShowClass.animateClass : '') +
                '" style="' + (duanShu == 1 && show == 'h' ? 'display:none;' : '') + '">' +
                year1Html + month1Html + day1Html +
                 lockHtml + '</div></div>';
    } else if (type == p_time.childType.dchart) {
        type = p_time.childType.chart;
        typeStr = this.joinPtype(p_time.name, p_time.childType.chart);
        /*默认是1段还是2段*/
        var duanShu = yearMarker.length > 1 || monthMarker.length > 1 ||
            dayMarker.length > 1 || weekMarker.length > 1 ? 2 : 1;
        var isDisabled = objAttr[this.customTAttr.lock];
        isDisabled = isDisabled != false ? true : false;

        year1Html = createDchartDuanHtml(currYear, '年', yearItems, isDisabled);
        month1Html = createDchartDuanHtml(currMonth, '月', monthItems, isDisabled);
        day1Html = createDchartDuanHtml(currDay, weekMarker.length > 0 ? '周' : '日', dayItems, isDisabled);

        var tempHtml = dayMarker.length > 0 || weekMarker.length > 0 ? year1Html + month1Html + day1Html :
                       monthMarker.length > 0 ? year1Html + month1Html : year1Html;

        html = '<div ' + p_time.childType.dchart + ' id="' + id + '" ' +
                this.persagyTypeAttr + '="' + typeStr + '" class="' +
                this.chartShowClass[show] + '"><div class="calendar-box">' +
                tempHtml +
                '</div><div class="time-to ' + (duanShu == 1 ? this.chartShowClass.jiantouStateClass : '') +
                '" style="display:' + (duanShu == 1 ? 'none' : 'block') +
                ';" disabled="' + isDisabled + '"></div><div class="calendar-box" style="display:' +
                (duanShu == 1 ? 'none' : 'block') + ';">' +
                tempHtml +
                '</div></div>';
    }

    if (!parent) return html;

    this.regInserted(watchEle, this.registerEvent({ attr: objAttr, event: objEvent }), false);
    this.appendHtml(parent, html);

    return new persagy_comboboxElement(id);

    function createChartDuanHtml(placeholder, type, liItems, isSel) {
        var classObj = {
            '年': 'year-box', '月': 'month-box', '日': 'day-box',
            '周': 'day-box', '时': 'hour-box', '分': 'minute-box'
        };
        var liStr = '';
        for (var jj = 0; jj < liItems.length; jj++) {
            liStr += '<li><a>' + liItems[jj] + '</a></li>';
        }
        var spanStr = type == '日' || type == '周' ? '<span class="pitch" ' + (lock == 'true' ? 'disabled' : '') +
            '><em class="week '
            + (type == '周' && isSel == true ? _this.chartShowClass.weekDayClass : '') + '">周</em><em class="day '
            + (type == '日' && isSel == true ? _this.chartShowClass.weekDayClass : '') + '">日</em></span>'
                    : '<span ' + (isSel == true ? 'class="cur" ' : '') + (lock == 'true' ? 'disabled' : '') +
            '>' + type + '</span>';
        return '<div class="' + classObj[type] + ' ' + (isSel == false ? 'animat' : '') + '"><div class="calendar-text"><i>' + placeholder +
                '</i>' + spanStr + '</div><ul class="calendar-list">' + liStr +
                '</ul></div>';
    };

    function createDchartDuanHtml(placeholder, type, liItems, isDisabled) {
        var classObj = {
            '年': 'year-box', '月': 'month-box', '日': 'day-box',
            '周': 'day-box', '时': 'hour-box', '分': 'minute-box'
        };
        var liStr = '';
        for (var jj = 0; jj < liItems.length; jj++) {
            liStr += '<li><a>' + liItems[jj] + '</a></li>';
        }
        var spanStr = '<span disabled="' + isDisabled +
            '" class="cur">' + type + '</span>';
        return '<div class="' + classObj[type] + '"><div class="calendar-text"><i>' + placeholder +
                '</i>' + spanStr + '</div><ul class="calendar-list">' + liStr +
                '</ul></div>';
    };
};

/*图表时间控件的下拉表每项点击事件*/
persagy_time.prototype.itemSelEvent = function (selEvent) {
    return (function (se, otherAttr, timeSelector) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();
                var target = event.target || event.srcElement;
                var li = $(target.tagName !== 'LI' ? target.parentNode : target);
                var index = li.index();
                var text = li.text();
                var divHead = li.parent().prev();
                /*divHead.find('i').text(text);*/
                event[otherAttr] = { target: li[0] };
                if (typeof se === 'function') se(event);
                $(timeSelector).find('ul').slideUp();
            }
        };
    })(selEvent, this.eventOthAttribute, this.crSelector());
};

/*每项选择事件的回调*/
persagy_time.prototype.timeSel = function (timeType, selEvent) {
    return (function (otherAttr, tt, se) {
        return function (event) {
            if (event) {
                event.stopBubbling();
                event.stopDefault();
            }
            var objClass = {
                y: '.year-box'
                , M: '.month-box'
                , d: '.day-box'
                , h: '.hour-box'
                , m: '.minute-box'
            };
            var start = {};
            var li = $(event[otherAttr].target);
            if (tt == p_time.childType.form) {
                var text = parseInt(li.find('b').text());

                var headerEm = li.parent().parent().prev().find('em');
                headerEm.text(text);

                var divM = li.parent().parent().parent().parent();
                var divMax = divM.parent();
                for (var oc in objClass) {
                    if (objClass.hasOwnProperty(oc) == false) continue;
                    start[oc] = parseInt(divMax.find(objClass[oc]).find('[header]').find('em').text());
                }
            } else if (tt == p_time.childType.chart) {
                text = parseInt(li.find('a').text());

                divM = li.parent().parent();
                divMax = divM.parent().parent();
                var divMIndex = divM.parent().index();
                var change = divMIndex == 0 ? 'last' : 'first';
                var isWeek =
                divMax.find('.day-box').find('.calendar-text').find('em').filter('.cur').index() == 0
                || divMax.find('.day-box').find('.calendar-text').find('span').eq(0).text() == '周' ? true : false;
                var end = {};
                for (var i = 0; i < divMax.children().length; i++) {
                    var divPp = divMax.children().eq(i);
                    for (var oc in objClass) {
                        if (objClass.hasOwnProperty(oc) == false) continue;
                        var currDd = divPp.find(objClass[oc]);
                        var val = 1;
                        if (!currDd.hasClass('animat')) {
                            val = divM.hasClass(objClass[oc].substr(1)) && i == divMIndex ? text :
                                parseInt(divPp.find(objClass[oc]).find('.calendar-text').find('i').text());
                        } else {
                            if (i > 0) {
                                val = oc == 'M' ? 12 : oc == 'd' ? 31 : 1;
                            }
                        }
                        i == 0 ? start[oc] = val : end[oc] = val;
                    }
                }
                if (isWeek == true) {
                    start.w = start.d;
                    delete start.d;
                    end.w = end.d;
                    delete end.d;
                }
                $(event.currentTarget).slideUp();
            }
            divMax.psetTime(start, end, change);
            if (typeof se == 'function') {
                event[otherAttr].target = divMax[0];
                se(event);
            }
        };
    })(this.eventOthAttribute, timeType, selEvent);
};

/*拼接选择器*/
persagy_time.prototype.crSelector = function () {
    return '[' + this.persagyTypeAttr + '="' + this.joinPtype(p_time.name, p_time.childType.chart) + '"]';
};

/*注册document事件以便收起图表时间控件的下拉框*/
persagy_time.prototype.slideUpUl = function () {
    var isRegUpChart = document.regUpTimeChart;
    if (isRegUpChart === true) return;
    document.regUpTimeChart = true;
    var selector = this.crSelector();
    this.domRegEvent(document, {
        click: (function (st) {
            return function () {
                $(st).find('ul').slideUp();
            };
        })(selector)
    }, false);
};

/*图表时间控件的每个框头部点击事件*/
persagy_time.prototype.pheaderClick = function (ul) {
    var selectorStr = this.crSelector();
    return (function (u, selector) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();
                $(selector).find('ul').not(u[0]).slideUp();
                u.slideToggle();
            }
        };
    })(ul, selectorStr);
};

/*控件生成后 注册事件*/
persagy_time.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function (event) {
            var pb = persagy_public.getInstance();
            var srcTarget = pb.getInsertedSrcJqEle(event, ob.attr.id);
            if (!srcTarget) return;

            var pe = persagy_event.getInstance();
            var pcm = new persagy_combobox();
            var pt = new persagy_time();

            ob = ob || {};
            var objEvent = ob.event || {};
            var objAttr = ob.attr || {};

            var maxDiv = $(this);
            var timeTargets = srcTarget;

            for (var x = 0; x < timeTargets.length; x++) {
                var currJqTimeTarget = timeTargets.eq(x);
                var currTimeTarget = timeTargets[x];
                pe.regConInserted(currTimeTarget);
                var type = pb.parsePtype(currTimeTarget).childType;
                var show = (objAttr[pt.customTAttr.show] || 'h').ppriperDel();

                if (type == p_time.childType.chart) {
                    var timeUls = currJqTimeTarget.find('ul');
                    for (var i = 0; i < timeUls.length; i++) {
                        var currUl = timeUls.eq(i);
                        /*头部点击事件*/
                        pe.domRegEvent(currUl.prev().find('i'), pt.pheaderClick(currUl));
                        /*选择时间事件*/
                        pe.domRegEvent(currUl, pt.itemSelEvent(pt.timeSel(type, objEvent.sel)));
                    }
                    /*注册年月日时分按钮的点击事件*/
                    var timeClassArr = ['.year-box', '.month-box', '.day-box', '.hour-box', '.minute-box'];
                    var timeIcons = currJqTimeTarget.find(timeClassArr.join(','));
                    for (i = 0; i < timeIcons.length; i++) {
                        pe.domRegEvent(timeIcons.eq(i).find('.calendar-text').find('span'),
                            pt.timeIconClick(timeClassArr));
                        pe.domRegEvent(timeIcons.eq(i).find('.calendar-text'), pt.timeMouseWheel());
                    }

                    /*周、日图标点击事件*/
                    var icons = currJqTimeTarget.find('.day-box').find('.calendar-text').find('em');
                    for (i = 0; i < icons.length; i++) {
                        pe.domRegEvent(icons[i], pt.weekIconClick());
                    }

                    /*注册箭头按钮的点击事件*/
                    var jiantou = currJqTimeTarget.find('.time-to');
                    if (jiantou.length > 0)
                        pe.domRegEvent(jiantou[0], pt.lastPartToggle(show));

                    /*注册锁的点击事件*/
                    var lockDiv = currJqTimeTarget.find('.time-lock');
                    if (lockDiv.length > 0)
                        pe.domRegEvent(lockDiv[0], pt.lockClick());
                } else if (type = p_time.childType.form) {
                    var cmbTypeStr = pb.joinPtype(p_combobox.name, p_combobox.childType.menu);
                    var comboboxs = currJqTimeTarget.find('[' + pb.persagyTypeAttr + '="' + cmbTypeStr + '"]');
                    for (var i = 0; i < comboboxs.length; i++) {
                        var currCombobox = comboboxs.eq(i);
                        var headerEle = currCombobox.find('[header]');
                        currUl = currCombobox.find('ul');
                        /*头部点击打开下拉表*/
                        pe.domRegEvent(headerEle[0], pcm.pheaderClick(currUl));
                        /*下拉表每项选择事件*/
                        pe.domRegEvent(currUl[0], pcm.cbItemSel(new persagy_time().timeSel(type, objEvent.sel), 'menu'));
                    }
                }
                var start = objAttr[pt.customTAttr.start] || {};
                var end = objAttr[pt.customTAttr.end] || {};
                this.psetTime(start, end);
            }
        };
    })(objBind);
};

/*年月日时分按钮的点击事件*/
persagy_time.prototype.timeIconClick = function (iconClassArr) {
    return (function (ica, animateClass, timeSelector) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();
                $(timeSelector).find('ul').slideUp();
                var tempArr = [];
                var target = $(this).parent().parent();
                var index = target.index();

                var otherDuan = target.parent().index() == 0 ? target.parent().next().next() :
                                target.parent().prev().prev();

                var childrens = target.parent().children();
                var otherChildrens = otherDuan.children();

                if (target.hasClass(animateClass)) {
                    for (var i = 0; i <= index; i++) {
                        var currChilren = childrens.eq(i);
                        otherChildrens.eq(i).removeClass(animateClass);
                        temp(childrens.eq(i), otherChildrens.eq(i), true);
                    }

                } else {
                    for (var i = index + 1; i < childrens.length; i++) {
                        temp(childrens.eq(i), otherChildrens.eq(i), false);
                    }
                }

                function temp(cd1, cd2, isSel) {
                    var ccSpan1 = cd1.find('.calendar-text').find('span');
                    var emem1 = ccSpan1.find('em');
                    var ccSpan2 = cd2.find('.calendar-text').find('span');
                    var emem2 = ccSpan2.find('em');
                    if (isSel == true) {
                        cd1.removeClass(animateClass);
                        cd2.removeClass(animateClass);
                        if (emem1.length == 0) {
                            ccSpan1.addClass('cur');
                            ccSpan2.addClass('cur');
                        }
                    } else {
                        cd1.addClass(animateClass);
                        cd2.addClass(animateClass);
                        if (emem1.length == 0) {
                            ccSpan1.removeClass('cur');
                            ccSpan2.removeClass('cur');
                        }
                        else {
                            emem1.removeClass('cur');
                            emem2.removeClass('cur');
                        }
                    }
                }
            }
        };
    })(iconClassArr, this.chartShowClass.animateClass, this.crSelector());
};

/*周和日按钮点击事件*/
persagy_time.prototype.weekIconClick = function () {
    return (function (wdc, timeSelector) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();

                var target = $(this);
                if (target.hasClass(wdc)) return;
                target.siblings().removeClass(wdc);
                target.addClass(wdc);

                var maxDiv = target.parent().parent().parent().parent();
                var otherDuan = maxDiv.index() == 0 ? maxDiv.next().next() : maxDiv.prev().prev();
                var year = parseInt(maxDiv.find('.year-box').find('.calendar-text').find('i').text());
                var month = parseInt(maxDiv.find('.month-box').find('.calendar-text').find('i').text());
                if (!year) year = new Date().getFullYear();
                if (!month) month = new Date().getMonth() + 1;

                var pt = new persagy_time();

                if (target.hasClass('week')) {
                    var objWeek = pt.getWeekTime(year, month);
                    var middleDay = objWeek.weekLength;

                    target.parent().prev().text('01');
                    var ul = target.parent().parent().next();
                    ul.empty();

                    for (var i = 1; i <= middleDay; i++) {
                        ul.append('<li><a>' + pt.appendZero(i) + '</a></li>');
                    }
                    var otweek = otherDuan.find('.day-box').find('.calendar-text').find('.week')[0];
                    if (otweek) otweek.click();
                } else if (target.hasClass('day')) {
                    var maxDay = pt.getMaxDay(year, month);
                    target.parent().prev().text('01');
                    var ul = target.parent().parent().next();
                    ul.empty();

                    for (i = 1; i <= maxDay; i++) {
                        ul.append('<li><a>' + pt.appendZero(i) + '</a></li>');
                    }
                    var otday = otherDuan.find('.day-box').find('.calendar-text').find('.day')[0];
                    if (otday) otday.click();
                }
                target.parent()[0].click();
            }
        };
    })(this.chartShowClass.weekDayClass, this.crSelector());
};

/*非表单类时间控件 鼠标滑动时选中选项*/
persagy_time.prototype.timeMouseWheel = function () {
    return (function () {
        return {
            mousewheel: function (event) {
                event.stopBubbling();
                event.stopDefault();
                var scrollVal = event.wheelDelta || event.detail;
                var target = $(this);
                var currText = target.find('i').text();
                var lis = target.next().find('li');
                for (var i = 0; i < lis.length; i++) {
                    var currLi = lis.eq(i);
                    if (currLi.find('a').text() == currText) {
                        var joinLi = scrollVal > 0 ? currLi.prev() : currLi.next();
                        joinLi = joinLi.length > 0 ? joinLi : scrollVal > 0 ? lis.eq(lis.length - 1) : lis.eq(0);
                        joinLi[0].click();
                        break;
                    }
                }
            }
        };
    })();
};

/*判断某月的第一周的开始时间及最后一周的结束时间
*每周均是从周日到周六
*每月的周从第一个周日的那天(这天必须在当月内)开始算
*  到最后一周的周六的那天(这天可以是下月的天)结束
*/
persagy_time.prototype.getWeekTime = function (year, month) {
    var firstDay = 1;
    var lastDay = this.getMaxDay(year, month);

    var firstDate = new Date(year, month - 1, 1);
    var firstDayOfWeek = firstDate.getDay();
    if (firstDayOfWeek != 0) {
        firstDay = firstDay + (7 - firstDayOfWeek);
        firstDate.setDate(firstDay);
    }

    var lastDate = new Date(year, month - 1, lastDay);
    var lastDayOfWeek = lastDate.getDay();
    var middleDay = 6 - lastDayOfWeek;
    var oneDayTime = 24 * 60 * 60 * 1000;;
    var middleTime = middleDay * oneDayTime;
    lastDate.setTime(lastDate.getTime() + middleTime);

    var middleDay = ((lastDate.getTime() - firstDate.getTime()) / oneDayTime + 1) / 7;

    return { start: firstDate.format(), end: lastDate.format(), weekLength: middleDay };
};

/*后半段的展开、收起*/
persagy_time.prototype.lastPartToggle = function (show) {
    return (function (ac, jsc, sh, timeSelector) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();
                $(timeSelector).find('ul').slideUp();
                var target = $(this);
                var lastPart = target.next();
                if (sh == 'v')
                    lastPart.toggleClass(ac);
                else {
                    lastPart.toggle(200);
                }
                target.toggleClass(jsc);
            }
        };
    })(this.chartShowClass.animateClass, this.chartShowClass.jiantouStateClass, show, this.crSelector());
};

/*锁的点击事件*/
persagy_time.prototype.lockClick = function () {
    return (function (lockIcon, timeSelector) {
        return {
            click: function (event) {
                event.stopBubbling();
                event.stopDefault();
                $(timeSelector).find('ul').slideUp();
                var target = $(this);
                target.text(lockIcon[target.text()].nextText);
                var icon = target.text();
                var disabled = icon == 'c' ? false : true;
                target.parent().prev().pdisable(disabled);
                var spans = target.parent().parent().find('.calendar-text').find('span');
                for (var i = 0; i < spans.length; i++) {
                    spans[i].pdisable(disabled);
                }
            }
        };
    })(this.lockIcon, this.crSelector());
};

/*根据锁定的步长来改变时间*/
persagy_time.prototype.validStep = function (startObj, endObj, target, change) {
    var _this = this;
    var isLock = target.find('.time-lock').text() == 's' ? true : false;
    var isWeek = target.find('.day-box').find('.calendar-text').find('em').filter('.cur').index() == 0
        || target.find('.day-box').find('.calendar-text').find('span').eq(0).text() == '周' ? true : false;

    /*是一段还是两段*/
    var duanShu = target.find('.time-to').hasClass(this.chartShowClass.jiantouStateClass) ? 1 : 2;

    startObj = this.validTime(startObj, true, isWeek);
    endObj = this.validTime(endObj, true, isWeek, true);


    var newStartDate = new Date(startObj.y, startObj.M - 1, startObj.d, startObj.h, startObj.m, startObj.s);
    var newEndDate = new Date(endObj.y, endObj.M - 1, endObj.d, startObj.h, startObj.m, startObj.s);

    if (isLock == false) {
        /*由于第二段的周取的是结束时间，所以要把y、M、d置为结束周的开始时间*/
        if (isWeek == true) {
            newEndDate.setDate(newEndDate.getDate() - 6);
            endObj.y = newEndDate.getFullYear();
            endObj.M = newEndDate.getMonth() + 1;
            endObj.d = newEndDate.getDate();
        }
        return dhTime(startObj, endObj, duanShu);
    }

    var lockType = isWeek == true ? 'w' :
            target.find('.day-box').find('.calendar-text').find('em').filter('.cur').index() == 1 ||
            target.find('.day-box').find('.calendar-text').find('span').eq(0).text() == '日' ? 'd' :
            target.find('.month-box').find('.calendar-text').find('span').filter('.cur').length > 0 ? 'M' : 'y';

    var oldObjTime = target.pgetTime();
    var oldStartStr = oldObjTime.startStr;
    var oldEndStr = oldObjTime.endStr;

    var oldStartDate = new Date(oldStartStr);
    var oldEndDate = new Date(oldEndStr);

    var middle = 0;
    switch (lockType) {
        case 'y':
            middle = oldEndDate.getFullYear() - oldStartDate.getFullYear();
            change == 'first' ? startObj.y = endObj.y - middle : endObj.y = startObj.y + middle;
            return dhTime(startObj, endObj, duanShu);
        case 'M':
            middle = (oldEndDate.getFullYear() - oldStartDate.getFullYear() + 1) * 12 -
                (oldStartDate.getMonth() + 1) - (12 - oldEndDate.getMonth() - 1);
            switch (change) {
                case 'first':
                    newEndDate.setDate(28); /*避免从1月倒推到2月时，天数超限。另：setMonth参数为月的索引*/
                    newEndDate.setMonth(newEndDate.getMonth() - middle);
                    startObj.y = newEndDate.getFullYear();
                    startObj.M = newEndDate.getMonth() + 1;
                    return dhTime(startObj, endObj, duanShu);
                default:
                    newStartDate.setDate(28);
                    newStartDate.setMonth(newStartDate.getMonth() + middle);
                    endObj.y = newStartDate.getFullYear();
                    endObj.M = newStartDate.getMonth() + 1;
                    return dhTime(startObj, endObj, duanShu);
            }
        case 'd':
            middle = getDateMiddle(oldStartStr, oldEndStr);
            return weekdayP(middle);
        case 'w':
            middle = getDateMiddle(oldStartStr, oldEndStr);
            weekdayP(middle);
            var swObj = this.getWeekByTime(startObj.y, startObj.M, startObj.d);
            startObj.y = swObj.weekStartYear;
            startObj.M = swObj.weekStartMonth;
            startObj.d = swObj.weekStartDate;
            startObj.w = swObj.currWeek;

            var ewObj = this.getWeekByTime(endObj.y, endObj.M, endObj.d);
            endObj.y = ewObj.weekStartYear;
            endObj.M = ewObj.weekStartMonth;
            endObj.d = ewObj.weekStartDate;
            endObj.w = ewObj.currWeek;
            return dhTime(startObj, endObj, duanShu);
    }

    /*获取两个日期间相差的天数*/
    function getDateMiddle(sstr, estr) {
        var sdateObj = new Date(sstr);
        var edateObj = new Date(estr);

        var middleYearDay = 0, middleingDay = 0, middledDay = 0;
        var syear = sdateObj.getFullYear();
        var eyear = edateObj.getFullYear();

        if (syear == eyear && sdateObj.getMonth() == edateObj.getMonth()) {
            return edateObj.getDate() - sdateObj.getDate();
        }

        /*获取相差的年的总天数*/
        for (var i = syear + 1; i < eyear; i++) {
            middleYearDay = middleYearDay + new Date(i, 0, 1).getYearLength();
        }

        /*获取开始年未过的天数 同年同月时未过的天数既是已过的天数*/
        var smonth = sdateObj.getMonth() + 1;
        /*结束月已过的天数在下面 获取结束年已过的天数内计算  故此处结束月不加1*/
        var maxSmonth = syear == eyear ? edateObj.getMonth() : 12;
        var sdate = sdateObj.getDate();
        sdate = _this.getMaxDay(sdateObj.getFullYear(), smonth) - sdate + 1;
        /*var maxSdate = syear == eyear && sdateObj.getMonth() == edateObj.getMonth() ? edateObj.getDate()
            : _this.getMaxDay(sdateObj.getFullYear(), smonth);*/
        for (i = smonth + 1; i <= maxSmonth; i++) {
            middleingDay = middleingDay + _this.getMaxDay(sdateObj.getFullYear(), i);
        }
        /*middleingDay = maxSdate - sdate + middleingDay;*/
        middleingDay = middleingDay + sdate;

        /*获取结束年已过的天数*/
        var emonth = edateObj.getMonth() + 1;
        /*var eminMonth = syear != eyear ? sdateObj.getMonth() + 2 : 1;*/
        var eminMonth = syear != eyear ? 1 : emonth;
        var edate = edateObj.getDate();
        /*edate = syear == eyear && sdateObj.getMonth() == edateObj.getMonth() ? 0 : edate;*/
        for (i = eminMonth; i < emonth; i++) {
            middledDay = middledDay + _this.getMaxDay(edateObj.getFullYear(), i);
        }
        middledDay = middledDay + edate;
        return middleYearDay + middleingDay + middledDay - 1;
    };

    /*周或日时 计算开始时间和结束时间*/
    function weekdayP(md) {
        switch (change) {
            case 'first':
                newEndDate.setDate(newEndDate.getDate() - md);
                startObj.y = newEndDate.getFullYear();
                startObj.M = newEndDate.getMonth() + 1;
                startObj.d = newEndDate.getDate();
                return dhTime(startObj, endObj, duanShu);
            default:
                newStartDate.setDate(newStartDate.getDate() + md);
                endObj.y = newStartDate.getFullYear();
                endObj.M = newStartDate.getMonth() + 1;
                endObj.d = newStartDate.getDate();
                return dhTime(startObj, endObj, duanShu);
        }
    };

    function dhTime(startObj, endObj, duanShu) {
        /*只有一段时不颠倒开始、结束时间*/
        if (duanShu == 2 && new Date(startObj.y, startObj.M - 1, startObj.d, startObj.h, startObj.m, startObj.s).getTime() >
        new Date(endObj.y, endObj.M - 1, endObj.d, endObj.h, endObj.m, endObj.s).getTime()) {
            var mddObj = startObj;
            startObj = endObj;
            endObj = mddObj;
        }
        return { startObj: startObj, endObj: endObj };
    }
};

persagy_time.prototype.validTime = function (obj, isChart, isWeek, isLast) {
    var _this = this;
    obj = obj || {};
    var currDate = new Date();
    obj.y = obj.y || currDate.getFullYear();
    obj.M = valid(obj.M || currDate.getMonth() + 1, 'M');
    obj.d = valid(obj.d || currDate.getDate(), 'd');
    if (isWeek == true)
        obj.w = valid(obj.w || 1, 'w');
    obj.h = isChart == true && isLast == true ? 23
                : isChart == true && isLast != true ? 0
                : obj.h || obj.h == 0 ? obj.h : currDate.getHours();
    obj.h = valid(obj.h, 'h');

    obj.m = isChart == true && isLast == true ? 59
                : isChart == true && isLast != true ? 0
                : obj.m || obj.m == 0 ? obj.m : currDate.getMinutes();
    obj.m = valid(obj.m, 'm');

    obj.s = isChart == true && isLast == true ? 59 : 0;
    return obj;

    function valid(val, type) {
        val = parseInt(val);
        switch (type) {
            case 'M':
                return val < 1 ? 1 : val > 12 ? 12 : val;
            case 'd':
                var maxDay = _this.getMaxDay(obj.y, obj.M);
                return val > maxDay ? maxDay : val < 1 ? 1 : val;
            case 'h':
                return val < 0 ? 0 : val > 23 ? 23 : val;
            case 'm':
                return val < 0 ? 0 : val > 59 ? 59 : val;
            case 'w':
                var weekObj = _this.getWeekTime(obj.y, obj.M);
                var maxWeek = weekObj.weekLength;
                val = val < 1 ? 1 : val > maxWeek ? maxWeek : val;
                weekObj = _this.getWeekStartEnd(obj.y, obj.M, parseInt(val));
                var dateObj = new Date(isLast != true ? weekObj.startStr : weekObj.endStr);

                obj.M = dateObj.getMonth() + 1;
                obj.d = dateObj.getDate();
                obj.y = dateObj.getFullYear();

                return val;
        }
    };
};

persagy_time.prototype.appendZero = function (val) {
    return val < 10 ? '0' + val : val.toString();
};

/*根据时间来对应其当前周数*/
persagy_time.prototype.getWeekByTime = function (year, month, date) {
    var weekObj = this.getWeekTime(year, month);

    var realyStartDate = new Date(weekObj.start);
    var realyStartDateTime = realyStartDate.getTime();

    var currDate = new Date(year, month - 1, date);
    var currDateTime = currDate.getTime();
    if (realyStartDateTime > currDateTime) {
        var tempDate = new Date(year, month - 1, date);
        tempDate.setMonth(tempDate.getMonth() - 1);
        var tempMaxDay = this.getMaxDay(tempDate.getFullYear(), tempDate.getMonth() + 1);
        return arguments.callee.call(this, tempDate.getFullYear(), tempDate.getMonth() + 1, tempMaxDay);
    }

    var week = parseInt((currDateTime - realyStartDateTime) / (7 * 24 * 60 * 60 * 1000)) + 1;

    var weekStartDate = currDate.getDate() - currDate.getDay();
    var weekEndDateObj = new Date(year, month - 1, weekStartDate);
    var weekStartMonth = weekEndDateObj.getMonth() + 1;
    var weekStartYear = weekEndDateObj.getFullYear();

    weekEndDateObj.setDate(weekStartDate + 6);
    return {
        currWeek: week, weekStartDate: weekStartDate,
        weekStartMonth: weekStartMonth, weekStartYear: weekStartYear,
        weekEndDate: weekEndDateObj.getDate(), weekEndMonth: weekEndDateObj.getMonth() + 1,
        weekEndYear: weekEndDateObj.getFullYear()
    };
};

/*取得某周的开始结束时间*/
persagy_time.prototype.getWeekStartEnd = function (year, month, currWeek) {
    var weekObj = this.getWeekTime(year, month);
    currWeek = currWeek > weekObj.weekLength ? weekObj.weekLength : currWeek;
    var realyStartDate = new Date(weekObj.start);
    var realyStartDateTime = realyStartDate.getTime();

    realyStartDate.setTime(realyStartDateTime + (currWeek - 1) * 7 * 24 * 60 * 60 * 1000);

    var startStr = realyStartDate.format();

    var returnObj = {
        startStr: startStr,
        weekStartDate: realyStartDate.getDate(),
        weekStartMonth: realyStartDate.getMonth() + 1,
        weekStartYear: realyStartDate.getFullYear(),
        currWeek: currWeek
    };

    realyStartDate.setDate(realyStartDate.getDate() + 6);
    var endStr = realyStartDate.format();

    returnObj.weekEndDate = realyStartDate.getDate();
    returnObj.weekEndMonth = realyStartDate.getMonth() + 1;
    returnObj.weekEndYear = realyStartDate.getFullYear();
    returnObj.endStr = endStr;

    return returnObj;
};

/*取得某年内某月的天数，默认当前年的当前月*/
persagy_time.prototype.getMaxDay = function (year, month) {
    year = parseInt(year);
    month = parseInt(month);
    year = year || new Date().getFullYear();
    month = month || new Date().getMonth() + 1;
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
;/*js创建时 返回此实例对象*/
function persagy_timeElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_timeElement.prototype = new persagyElement();

/*时间控件专用 设置时间
*start object型或String型，开始时间，
        object型时属性包括:y:整型或字符串型的年份,
            M:整型或字符串型的月份,d:整型或字符串型的日,
            h:整型或字符串型的时，m:整型或字符串型的分
        String时，为符合时间格式的字符串

*end object型或String型，结束时间，属性同start
*change 时间控件处于锁定步长状态时，调整哪段来适应步长，可能的值包括 first、last,默认last
*/
persagy_timeElement.prototype.psetTime = function (start, end, change) {
    var date1;
    if (typeof start == 'string') {
        date1 = new Date(start);
        start = {
            y: parseInt(date1.format('y')),
            M: parseInt(date1.format('M')),
            d: parseInt(date1.format('d')),
            h: parseInt(date1.format('h')),
            m: parseInt(date1.format('m'))
        };
    }
    if (typeof end == 'string') {
        date1 = new Date(end);
        end = {
            y: parseInt(date1.format('y')),
            M: parseInt(date1.format('M')),
            d: parseInt(date1.format('d')),
            h: parseInt(date1.format('h')),
            m: parseInt(date1.format('m'))
        };
    }

    start = start || {};
    end = end || {};
    var obj = {
        y: {
            className: 'year-box', append: ' 年'
        },
        M: {
            className: 'month-box', append: ' 月'
        },
        d: {
            className: 'day-box', append: ' 日'
        },
        h: {
            className: 'hour-box', append: ' 时'
        },
        m: {
            className: 'minute-box', append: ' 分'
        },
        w: {
            className: 'day-box', append: ''
        }
    };
    var target = this.getJqEle();
    var pub = persagy_public.getInstance();
    var pt = new persagy_time();
    var typeObj = pub.parsePtype(target);
    var maxDay;

    switch (typeObj.childType) {
        case p_time.childType.form:
            start = pt.validTime(start, false);
            execute(start, target, 'b');
            break;
        case p_time.childType.chart:
            var isWeek =
                target.find('.day-box').find('.calendar-text').find('em').filter('.cur').index() == 0
                || target.find('.day-box').find('.calendar-text').find('span').eq(0).text() == '周' ? true : false;
            var currDate = new Date();
            start.y = start.y || currDate.getFullYear();
            start.M = start.M || currDate.getMonth() + 1;
            start.d = start.d || currDate.getDate();
            if (isWeek == true) {
                var oo1 = start.w ? pt.getWeekStartEnd(start.y, start.M, start.w) : pt.getWeekByTime(start.y, start.M, start.d);
                start.y = oo1.weekStartYear;
                start.M = oo1.weekStartMonth;
                start.d = oo1.weekStartDate;
                start.w = oo1.currWeek;
            }

            end.y = end.y || currDate.getFullYear();
            end.M = end.M || currDate.getMonth() + 1;
            end.d = end.d || currDate.getDate();
            if (isWeek == true) {
                var oo2 = end.w ? pt.getWeekStartEnd(end.y, end.M, end.w) : pt.getWeekByTime(end.y, end.M, end.d);
                end.y = oo2.weekStartYear;
                end.M = oo2.weekStartMonth;
                end.d = oo2.weekStartDate;
                end.w = oo2.currWeek;
            }

            var newDateObj = pt.validStep(start, end, target, change);
            start = newDateObj.startObj;
            end = newDateObj.endObj;

            delete start.h;
            delete start.m;
            delete end.h;
            delete end.m;
            if (isWeek == true) {
                delete start.d;
                delete end.d;
            } else {
                delete start.w;
                delete end.w;
            }

            var timeDiv = target.find('.calendar-box');
            for (i = 0; i < timeDiv.length; i++) {
                var currTimeDiv = timeDiv.eq(i);
                var currTimeObj = i == 0 ? start : end;
                execute(currTimeObj, currTimeDiv, 'a');
            }
            break;
    }

    function execute(tobj, timeDiv, liConTag) {
        for (var ob in tobj) {
            if (tobj.hasOwnProperty(ob) == false) continue;
            var currObj = obj[ob];
            if (!currObj) continue;
            var currVal = pt.appendZero(tobj[ob]);

            var timeTypeDiv = timeDiv.find('.' + currObj.className);
            switch (liConTag) {
                case 'a':
                    timeTypeDiv.find('.calendar-text').find('i').text(currVal);
                    break;
                case 'b':
                    timeTypeDiv.find('[header]').find('em').text(currVal + currObj.append);
                    break;
            }
            maxDay = ob == 'd' ? maxDay = pt.getMaxDay(tobj.y, tobj.M) :
                    ob == 'w' ? pt.getWeekTime(tobj.y, tobj.M).weekLength : [];
            if (ob == 'd' || ob == 'w') {
                var ul = timeTypeDiv.find('ul');
                ul.empty();
                for (var i = 1; i <= maxDay; i++) {
                    ul.append('<li><' + liConTag + '>' + pt.appendZero(i) + '</' + liConTag + '></li>');
                }
            }
        }
    }
};

/*时间控件专用 获取时间*/
persagy_timeElement.prototype.pgetTime = function () {
    var target = this.getJqEle();
    var pub = persagy_public.getInstance();
    var pt = new persagy_time();
    var animateClass = pt.chartShowClass.animateClass;
    var dayBoxText = target.find('.day-box').find('.calendar-text').eq(0);
    var isWeek =
                (dayBoxText.find('em').filter('.cur').index() == 0 &&
                dayBoxText.parent().hasClass(animateClass) == false)
                || dayBoxText.find('span').eq(0).text() == '周' ? true : false;
    var typeObj = pub.parsePtype(target);
    var startTime = '', endTime = '';
    switch (typeObj.childType) {
        case p_time.childType.form:
            var headers = target.find('[header]');
            for (var i = 0; i < headers.length; i++) {
                var currHeader = headers.eq(i);
                var currText = currHeader.find('em').text();
                var time = parseInt(currText);
                if (isNaN(time)) continue;
                time = pt.appendZero(time);
                if (headers.eq(i + 1).parent().parent().hasClass('hour-box'))
                    startTime += time + ' ';
                else if (currHeader.parent().parent().hasClass('hour-box'))
                    startTime += time + ':';
                else
                    startTime += time + '/';
            }
            return { startStr: startTime.substr(0, startTime.length - 1), endStr: endTime };
        case p_time.childType.chart:
            var timeDiv = target.find('.calendar-box');
            var timeType = '';
            var startYear, startMonth, startDate, endYear, endMonth, endDate;
            for (i = 0; i < timeDiv.length; i++) {
                var currTimeDiv = timeDiv.eq(i);
                if (currTimeDiv.prev().hasClass(pt.chartShowClass.jiantouStateClass) ||
                    currTimeDiv.hasClass(pt.chartShowClass.animateClass)) continue;
                var timeHeader = currTimeDiv.find('.calendar-text');

                for (var j = 0; j < timeHeader.length; j++) {
                    currHeader = timeHeader.eq(j);
                    currText = parseInt(currHeader.find('i').text());
                    if (!currText) continue;
                    currText = pt.appendZero(currText);
                    if (currHeader.parent().hasClass(animateClass)) continue;
                    currHeader.parent().hasClass('year-box') ?
                    (i == 0 ? startYear = currText : endYear = currText, timeType = 'y') :
                    currHeader.parent().hasClass('month-box') ?
                    (i == 0 ? startMonth = currText : endMonth = currText, timeType = 'M') :
                    currHeader.parent().hasClass('day-box') ?
                    (i == 0 ? startDate = currText : endDate = currText, timeType = isWeek == true ? 'w' : 'd') : '';
                }
            }
            timeType = target.find('.time-to').hasClass(pt.chartShowClass.jiantouStateClass) ? timeType : timeType + timeType;
            var isDisabled = target.find('.time-to')[0].getAttribute('disabled');
            switch (timeType) {
                case 'd':
                    endYear = startYear;
                    endMonth = startMonth;
                    endDate = startDate;
                case 'dd':
                    endTime = endYear + '/' + endMonth + '/' + endDate + ' 23:59:59';
                    startTime = startYear + '/' + startMonth + '/' + startDate + ' 00:00:00';
                    break;
                case 'w':
                    endYear = startYear;
                    endMonth = startMonth;
                    endDate = startDate;
                case 'ww':
                    var weekObj = pt.getWeekStartEnd(startYear, startMonth, startDate);
                    startTime = weekObj.startStr + ' 00:00:00';
                    weekObj = pt.getWeekStartEnd(endYear, endMonth, endDate);
                    endTime = weekObj.endStr + ' 23:59:59';
                    break;
                case 'M':
                    endYear = startYear;
                    endMonth = startMonth;
                case 'MM':
                    startTime = startYear + '/' + startMonth + '/01 00:00:00';
                    endTime = endYear + '/' + endMonth + '/' +
                        pt.getMaxDay(endYear, endMonth) + ' 23:59:59';
                    break;
                case 'y':
                    endYear = startYear;
                case 'yy':
                    startTime = startYear + '/01/01 00:00:00';
                    endTime = endYear + '/12/31 23:59:59';
                    break;
            }

            var realDate = new Date(endTime);
            realDate.setSeconds(realDate.getSeconds() + 1);
            var realEndStr = realDate.format() + ' 00:00:00';

            return {
                startStr: startTime,
                endStr: endTime,
                realEndStr: realEndStr,
                timeType: timeType,
                isLock: isDisabled == 'true' ? true : false
            };
    }
};

/*时间控件展开或收起*/
persagy_timeElement.prototype.pslideToggle = function () {
    var target = this.getEle();
    var childType = persagy_public.getInstance().parsePtype(target).childType;
    if (childType != p_time.childType.chart) return;
    var timeTo = $(target).find('.time-to');
    if (timeTo.attr('disabled') == 'true') return;
    timeTo[0].click();
};
/*时间控件展开*/
persagy_timeElement.prototype.pslideDown = function () {
    var target = this.getEle();
    var childType = persagy_public.getInstance().parsePtype(target).childType;
    if (childType != p_time.childType.chart) return;
    var timeTo = $(target).find('.time-to');
    if (timeTo.attr('disabled') == 'true') return;

    var lastPart = timeTo.next();
    if (lastPart.is(':hidden') == false && !lastPart.hasClass('animat')) return;
    timeTo[0].click();
};
/*时间控件收起*/
persagy_timeElement.prototype.pslideUp = function () {
    var target = this.getEle();
    var childType = persagy_public.getInstance().parsePtype(target).childType;
    if (childType != p_time.childType.chart) return;
    var timeTo = $(target).find('.time-to');
    if (timeTo.attr('disabled') == 'true') return;

    var lastPart = timeTo.next();
    if (lastPart.is(':hidden') == true || lastPart.hasClass('animat')) return;
    timeTo[0].click();
};

/*锁定或解锁时间控件*/
persagy_timeElement.prototype.plockToggle = function () {
    var target = this.getEle();
    var childType = persagy_public.getInstance().parsePtype(target).childType;
    var jqTarget = $(target);
    switch (childType) {
        case p_time.childType.chart:
            var dh = jqTarget.attr(p_time.childType.dchart);
            if (dh == null) {
                var lockDiv = jqTarget.find('.time-lock')[0];
                if (!lockDiv) return;
                lockDiv.click();
            } else {
                var spans = jqTarget.find('.year-box,.month-box,.day-box').find('.calendar-text span');
                var nextDisabledVal = spans[0].getAttribute('disabled') == 'true' ? 'false' : 'true';
                for (var i = 0; i < spans.length; i++) {
                    spans[i].setAttribute('disabled', nextDisabledVal);
                }
                var timeTo = jqTarget.find('.time-to')[0];
                if (timeTo) timeTo.setAttribute('disabled', nextDisabledVal);
            }
            break;
        default:
            return;
    }
};

/*解锁时间控件*/
persagy_timeElement.prototype.plockDown = function () {
    var target = this.getEle();
    var childType = persagy_public.getInstance().parsePtype(target).childType;
    var jqTarget = $(target);
    switch (childType) {
        case p_time.childType.chart:
            var dh = jqTarget.attr(p_time.childType.dchart);
            if (dh == null) {
                var lockDiv = jqTarget.find('.time-lock');
                if (lockDiv.length == 0 || lockDiv.text() == 'c') return;
                lockDiv[0].click();
            } else {
                var spans = jqTarget.find('.year-box,.month-box,.day-box').find('.calendar-text span');
                for (var i = 0; i < spans.length; i++) {
                    spans[i].setAttribute('disabled', 'false');
                }
                var timeTo = jqTarget.find('.time-to')[0];
                if (timeTo) timeTo.setAttribute('disabled', 'false');
            }
            break;
        default:
            return;
    }
};

/*锁定时间控件*/
persagy_timeElement.prototype.plockUp = function () {
    var target = this.getEle();
    var childType = persagy_public.getInstance().parsePtype(target).childType;
    var jqTarget = $(target);
    switch (childType) {
        case p_time.childType.chart:
            var dh = jqTarget.attr(p_time.childType.dchart);
            if (dh == null) {
                var lockDiv = jqTarget.find('.time-lock');
                if (lockDiv.length == 0 || lockDiv.text() == 's') return;
                lockDiv[0].click();
            } else {
                var spans = jqTarget.find('.year-box,.month-box,.day-box').find('.calendar-text span');
                for (var i = 0; i < spans.length; i++) {
                    spans[i].setAttribute('disabled', 'true');
                }
                var timeTo = jqTarget.find('.time-to')[0];
                if (timeTo) timeTo.setAttribute('disabled', 'true');
            }
            break;
        default:
            return;
    }
};

/*
*设置时间控件的时间类型
*timeType:y 一段的年   yy两段的年  M 一段的月  MM两段的月   d 一段的日  dd两段的日  w一段的周  ww两段的周
*/
persagy_timeElement.prototype.psetType = function (timeType) {
    var target = this.getEle();
    var childType = persagy_public.getInstance().parsePtype(target).childType;
    if (childType != p_time.childType.chart) return;
    var typeObj = {
        y: {
            className: '.year-box', duan: 1
        },
        yy: {
            className: '.year-box', duan: 2
        },
        M: {
            className: '.month-box', duan: 1
        },
        MM: {
            className: '.month-box', duan: 2
        },
        d: {
            className: '.day-box', duan: 1
        },
        dd: {
            className: '.day-box', duan: 2
        }
    };
    typeObj.w = typeObj.d;
    typeObj.ww = typeObj.dd;

    var currTypeObj = typeObj[timeType];
    if (!currTypeObj) return;
    var jqTarget = $(target);
    if (currTypeObj.duan == 2) jqTarget.pslideDown();
    else jqTarget.pslideUp();
    var timeTarget = jqTarget.find(currTypeObj.className).find('.calendar-text');
    if (currTypeObj.className != typeObj.d.className)
        return timeTarget.find('span')[0].click();
    var wdObj = {
        d: '.day', dd: '.day', w: '.week', ww: '.week'
    };
    var aaa = timeTarget.find('em').filter(wdObj[timeType])[0];
    if (!aaa) aaa = timeTarget.find('span')[0];
    aaa.click();
};
;/*
*博锐尚格表格控件 包括基础表格normal 动态表格dynamic  默认创建normal
*/
function persagy_grid() {
    this.customGdAttr = {
        /*columns列数组,每列属性如下*/
        columns: {
            _name: 'columns'
            , name: 'name'                /*列头名称*/
            , source: 'source'          /*每列的数据源即表格数据源内的每项的此属性值*/
            , minwidth: 'minwidth'      /*最小宽，可以是像素值也可以是百分比*/
            , sort: 'sort'              /*此属性为true时创建带有排序按钮的列头*/
            , order: 'order'            /*创建排序列时，该列的默认排序方式，可能的值包括asc、desc*/
            , sortclick: 'sortclick'    /*排序按钮点击事件*/
            , combobox: 'combobox'      /*此属性为true时创建带下拉列表的列头*/
            , combind: 'combind'        /*object类型，具有的属性同下拉列表*/
        }
        , template: 'template'          /*模板id，用于自定义动态表格的每行*/
        , items: 'items'                /*表格数据源数组*/
        , checkbox: 'checkbox'          /*此属性为true且创建的为动态表格时则自动创建带复选框的表格*/
        , page: 'page'                  /*此属性为true时创建带分页控件的列表*/
         , pagebind: 'pagebind'           /*object类型，分页的属性，同分页控件*/
         , lineback: 'lineback'      /*行背景色，为false时，动态表格每行点击后不加背景色，默认为true*/
    };
    this.customGdEvent = {
        lineevent: 'lineevent'          /*object类型 每行的事件，支持所有的html原生事件*/
        , cbchange: 'cbchange'          /*每行的复选框状态改变事件，释义同复选框控件的change事件*/
        , acbchange: 'acbchange'        /*全选复选框的状态改变事件，释义同复选框控件的change事件*/
    };
    this.constructor = arguments.callee;
};

persagy_grid.prototype = new persagy_event();

persagy_grid.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_grid.childType.normal;
    var ptypeStr = _this.joinPtype(p_grid.name, type);
    var id = objAttr.id ? objAttr.id : _this.produceId();
    var columns = objAttr[_this.customGdAttr.columns._name] || [];
    var items = objAttr[_this.customGdAttr.items] || [];
    var checkbox = (objAttr[_this.customGdAttr.checkbox] || '').toString().ppriperDel();
    var objPageBind = objAttr[_this.customGdAttr.pagebind] || {};
    var page = (objAttr[_this.customGdAttr.page] || '').toString().ppriperDel();
    var pageCount = parseInt((objAttr[_this.customGdAttr.pagecount] || '').toString().ppriperDel()) || 1;
    var pageOrien = (objAttr[_this.customGdAttr.pageorien] || '').toString().ppriperDel() || 'up';
    var template = objAttr[_this.customGdAttr.template] || '';
    var lineEvent = objEvent[_this.customGdEvent.lineevent] || {};

    var reEvent = {};

    var headHtml1 = '<div gdheader class="grid-titile"><ul>';
    var headListr = '';
    var headHtml2 = '</ul></div>';

    var conHtml1 = '<div class="grid-content"><ul gconul>';
    var conLineStr = '';
    var conHtml2 = '</ul></div>';
    var currLineStr = '';

    var pageHtml = '';

    var psw = new persagy_switch();
    var pcmb = new persagy_combobox();
    var ppage = new persagy_paging();


    /*拼接头*/
    if (checkbox == 'true') headListr += '<li checkbox>' + psw.createHtml({}, {}, 'checkbox') + '</li>';
    for (var i = 0; i < columns.length; i++) {
        var currColumn = columns[i];
        var headLiCon = '';
        var isCbLi = false;
        var cbStr = '';
        if (currColumn.sort && currColumn.sort.toString().ppriperDel() == 'true') {
            headLiCon = '<b>' + currColumn.name +
                '</b><span class="icon"><em ' + (currColumn.order == 'asc' ? 'disabled="true" ' : '') +
                '>t</em><em ' + (currColumn.order == 'desc' ? 'disabled="true" ' : '') +
                '>b</em></span>';
        }
        else if (currColumn.combobox && currColumn.combobox.toString().ppriperDel() == 'true') {
            var comBind = currColumn.combind || {};
            var attrCbStr = (JSON.stringify(comBind.attr) || '{}').replace(/"/g, '\'');
            var eventCbStr = (JSON.stringify(comBind.event) || '{}').replace(/"/g, '\'');
            cbStr = ' ' + this.persagyCreateType + '="combobox-noborder" ' + this.persagyCreateBind +
                    '="attr:' + attrCbStr + ',event:' + eventCbStr + '" ' +
                    this.persagyRely + '="' + isRely + '" ';
            isCbLi = true;
        }
        else
            headLiCon = currColumn.name;
        headListr += '<li ' + (isCbLi == true ? 'cbli' : '') + ' ' +
            (currColumn.sort && currColumn.sort.toString().ppriperDel() == 'true' ?
            'sort="' + (currColumn.order || '') + '"' : '') +
            createMinStyle(currColumn) + cbStr + '>' + headLiCon + '</li>';
    }

    /*拼接内容*/
    var customLineHtml = (document.getElementById(template) || {}).innerHTML || '';
    var otherEventArr = [];
    if (isRely != true) {
        if (type == p_grid.childType.normal) {
            for (var i = 0; i < items.length; i++) {
                var currItem = items[i];
                currLineStr = '';
                if (checkbox == 'true') currLineStr = '<div lck checkbox>' + psw.createHtml({}, {}, 'checkbox') + '</div>';
                if (customLineHtml && type != p_grid.childType.normal) currLineStr += customLineHtml;
                else {
                    for (var j = 0; j < columns.length; j++) {
                        var currColumn = columns[j];
                        var customObj = currColumn.custom;
                        var conValStr = currItem[currColumn.source] || '';
                        currLineStr += '<div title="' + conValStr + '"' + createMinStyle(currColumn) + '>' +
                            conValStr + '</div>';
                    }
                }
                conLineStr += '<li>' + currLineStr + '</li>';
            }
        }
    } else {
        var pb = persagy_toBind.getInstance();
        if (checkbox == 'true') currLineStr = '<div lck checkbox>' + psw.createHtml({}, {}, 'checkbox') + '</div>';
        if (!customLineHtml || type == p_grid.childType.normal) {
            for (var j = 0; j < columns.length; j++) {
                var currColumn = columns[j];
                currLineStr += '<div' + createMinStyle(currColumn) + ' ' +
                    pb.createBind({ text: currColumn.source }, null, false, true, { title: currColumn.source }) + '></div>';
            }
        } else currLineStr += customLineHtml;

        conLineStr = '<li ' + pb.createBind({ visible: objAttr[this.customAttr.visible] }, lineEvent) +
            '>' + currLineStr + '</li>';
        conLineStr = pb.toRepeat(items, conLineStr);
    }

    if (page == 'true') {
        /*pageHtml += ppage.controlInit(null, null, objPageBind);*/
        var pageBindStr = JSON.stringify(objPageBind).replace(/\"/g, '\'');
        pageHtml += '<div ' + this.persagyCreateType + '="' + p_paging.name +
            this.typeSeparator + p_paging.childType.common + '" ' +
            this.persagyCreateBind + '="' + pageBindStr.substring(1, pageBindStr.length - 1) + '"></div>';
    }

    var html = '<div style="padding-bottom:' + (page == 'true' ? '70' : '0') + 'px;" ' +
        _this.persagyTypeAttr + '="' + ptypeStr + '" id="' + id + '"><div class="grid-wrap">'
            + headHtml1 + headListr +
        headHtml2 + conHtml1 + conLineStr + conHtml2 + pageHtml + '</div></div>';
    if (!parent) {
        return !customLineHtml ? html : { html: html, otherEvent: otherEventArr };
    }

    _this.regInserted(parent, _this.registerEvent({ attr: objAttr, event: objEvent, otherEvent: otherEventArr }));
    _this.appendHtml(parent, html);
    return new persagy_gridElement();

    function createMinStyle(currCol) {
        return ' style="' + (currCol.minwidth ? 'min-width:' + currCol.minwidth + ';' : '') + '"';
    }
};

/*注册头部排序事件、头部下拉框选择事件、复选框选择取消事件*/
persagy_grid.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function (event) {
            if (event.stopBubbling) {
                event.stopBubbling();
                event.stopDefault();
            }
            var pe = persagy_event.getInstance();
            var pg = new persagy_grid();
            var pcm = new persagy_combobox();
            var ppag = new persagy_paging();
            var psw = new persagy_switch();
            var pb = persagy_public.getInstance();

            pe.removeEvent(this, pe.insertedEvent);

            ob = ob || {};
            var objAttr = ob.attr || {};
            var objEvent = ob.event || {};

            var target = $(this);
            var gdHeaderDiv = target.find('[gdheader]');

            var gridTarget = target.find(pb.joinSelector(p_grid));
            var type = pb.parsePtype(gridTarget).childType;
            if (type == p_grid.childType.normal) return;

            var columns = objAttr[pg.customGdAttr.columns._name] || [];
            var le = objEvent[pg.customGdEvent.lineevent] || {};
            var isRely = ob.isRely;
            var oe = ob.otherEvent;

            isRely != true ? le.click = pg.lineActive(le.click, objAttr[pg.customGdAttr.lineback])
                : le = { click: pg.lineActive(null, objAttr[pg.customGdAttr.lineback]) };

            /*注册头部排序和头部下拉框事件*/
            var cbLis = gdHeaderDiv.find('li[cbli]');
            var sortLi = gdHeaderDiv.find('li[sort]');
            var js = 0, jc = 0;
            for (var i = 0; i < columns.length; i++) {
                var currColumn = columns[i];
                if (currColumn.sort && currColumn.sort.toString().ppriperDel() == 'true') {
                    var currSortClick = currColumn.sortclick;
                    currSortClick = typeof currSortClick == 'string' ?
                        eval(currSortClick.ppriperDel()) : currSortClick;

                    pe.domRegEvent(sortLi[js], {
                        click:
                            pg.sortFn(currSortClick)
                    });
                    js++;
                } else if (currColumn.combobox && currColumn.combobox.toString().ppriperDel() == 'true') {
                    var comboxBind = currColumn.combind || {};
                    comboxBind.isRely = isRely;
                    pcm.registerEvent(comboxBind).call(cbLis[jc], event);
                    jc++;
                }
            }

            /*分页事件
            var pageDiv = target.find(pb.joinSelector(p_paging));
            if (pageDiv.length > 0)
                ppag.registerEvent(objAttr[pg.customGdAttr.pagebind] || {}).call(pageDiv[0]);*/

            /*头部复选框事件*/
            var headCheckDiv = gdHeaderDiv.find(pb.joinSelector(p_switch));
            if (headCheckDiv.length > 0)
                pe.domRegEvent(headCheckDiv[0], psw.changeSel(pg.headCheckCall(objEvent[pg.customGdEvent.acbchange])));

            /*内容区改变事件*/
            var contentUl = target.find('[gconul]');
            var conChange = le;
            conChange[pe.insertedEvent] = pg.contentChange(objEvent[pg.customGdEvent.cbchange]);
            pe.domRegEvent(contentUl, conChange);

            /*生成控件内部的控件*/
            persagy_public.getInstance().createControlByCreateType(this);
        };
    })(objBind);
};

/*头部排序的回调函数*/
persagy_grid.prototype.sortFn = function (sortEvent) {
    return (function (se, eoa) {
        return function (event) {
            var target = $(this);
            var sort = target.attr('sort');
            var dtarget;
            var nextSort = '';
            var disableEm = sort == 'desc' ? (dtarget = target.find('em:first'), nextSort = 'asc') :
                (dtarget = target.find('em:last'), nextSort = 'desc');
            dtarget.pdisable(true);
            dtarget.siblings().pdisable(false);
            target.attr('sort', nextSort);
            if (typeof se == 'function') {
                event[eoa] = { sort: nextSort };
                se(event);
            }
        };
    })(sortEvent, this.eventOthAttribute);
};

/*头部复选框的回调*/
persagy_grid.prototype.headCheckCall = function (allChangeEvent) {
    return (function (eoa, ae) {
        return function (event) {
            var pe = persagy_event.getInstance();
            var checkboxSeletor = pe.persagyTypeAttr + '="' +
                pe.joinPtype(p_switch.name, p_switch.childType.checkbox) + '"';

            var state = event[eoa].state;
            var checkboxs = $(event.srcElement || event.target).parent().parent().parent().next().find('div[' +
                checkboxSeletor + ']');
            for (var i = 0; i < checkboxs.length; i++) {
                var ck = checkboxs.eq(i);
                ck['p' + state + 'State']();
            }
            if (typeof ae == 'string') ae = eval(ae.ppriperDel());
            if (typeof ae == 'function') ae(event);
        };
    })(this.eventOthAttribute, allChangeEvent);
};

/*内容区每行复选框的回调*/
persagy_grid.prototype.lineCheckCall = function (changeEvent) {
    var pe = persagy_event.getInstance();
    var checkboxSeletor = pe.persagyTypeAttr + '="' +
        pe.joinPtype(p_switch.name, p_switch.childType.checkbox) + '"';
    return (function (eoa, cbs, ce) {
        return function (event) {
            var state = event[eoa].state;
            var headCheck = $(event.srcElement || event.target).parent().parent().parent().parent().prev().find('div[' + cbs + ']');
            var li = $(event.srcElement || event.target).parent().parent();
            switch (state) {
                case persagy_control.selState.on:
                    var newState = persagy_control.selState.on;
                    var lingsCheck = li.siblings().find('div[' + cbs + ']');
                    for (var i = 0; i < lingsCheck.length; i++) {
                        if (lingsCheck.eq(i).attr('state') != persagy_control.selState.on) {
                            newState = persagy_control.selState.off;
                            break;
                        }
                    }
                    break;
                case persagy_control.selState.off:
                    newState = persagy_control.selState.off;
                    break;
            }
            headCheck['p' + newState + 'State']();
            if (typeof ce == 'string') ce = eval(ce.ppriperDel());
            if (typeof ce == 'function') {
                event[eoa].index = li.index();
                ce(event);
            }
        };
    })(this.eventOthAttribute, checkboxSeletor, changeEvent);
};

/*内容区内容改变时 注册每行的复选框点击事件*/
persagy_grid.prototype.contentChange = function (changeEvent) {
    var pe = persagy_event.getInstance();
    var checkboxSeletor = pe.persagyTypeAttr + '="' +
        pe.joinPtype(p_switch.name, p_switch.childType.checkbox) + '"';
    return (function (cbs, ce) {
        return function (event) {
            /*if (event) {
                event.stopBubbling();
                event.stopDefault();
            }*/
            if ((event.srcElement || event.target).tagName != 'LI') return;
            var pet = persagy_event.getInstance();
            var psw = new persagy_switch();
            var pgd = new persagy_grid();
            var target = $(event.srcElement || event.target);
            var checkboxDiv = target.find('div[' + cbs + ']');
            for (i = 0; i < checkboxDiv.length; i++) {
                pet.domRegEvent(checkboxDiv[i], psw.changeSel(pgd.lineCheckCall(ce)));
            }
        };
    })(checkboxSeletor, changeEvent);
};

/*每行点击时加上选中状态*/
persagy_grid.prototype.lineActive = function (lineClick, lineBack) {
    return (function (lc, eoa, lb) {
        return function (event) {
            event.stopBubbling();
            event.stopDefault();
            var srcTarget = $(event.srcElement || event.target);
            var i = 1;
            while (srcTarget[0].tagName != 'LI' && i < 10) {
                i++;
                srcTarget = srcTarget.parent();
            }
            if (srcTarget[0].tagName != 'LI') return;
            new persagy_grid().lineAddBack(lb, srcTarget[0], true);
            var liIndex = srcTarget.index();
            event[eoa] = { index: liIndex };
            if (typeof lc == 'function') lc(event);
        };
    })(lineClick, this.eventOthAttribute, lineBack);
};

/*每行加上背景色*/
persagy_grid.prototype.lineAddBack = function (isBack, li, isSingleLine) {
    if (isBack != false) {
        var target = $(li);
        var lineActiveClass = 'active';
        if (isSingleLine == true)
            target.siblings().removeClass(lineActiveClass);
        target.addClass(lineActiveClass);
    }
};

/*每行取消背景色*/
persagy_grid.prototype.lineRemoveBack = function (li) {
    var target = $(li);
    target.removeClass('active');
};
;/*js创建时 返回此实例对象*/
function persagy_gridElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_gridElement.prototype = new persagyElement();

(function () {
    function selectiontor() {
        var selectorStr = '';
        var pbu = persagy_public.getInstance();
        var pgTypes = p_paging.childType;
        for (var t in pgTypes) {
            if (pgTypes.hasOwnProperty(t) == false) continue;
            selectorStr += ',[' + pbu.persagyTypeAttr + '="' + pbu.joinPtype(p_paging.name, t) + '"]';
        }
        return selectorStr.substr(1);
    };

    /*获取或设置总页数  当设置的总页数比当前页码小时 会更改当前页为最后一页*/
    persagy_gridElement.prototype.pcount = function (count) {
        var target = $('#' + this.id);
        return target.find(selectiontor()).pcount(count);
    };

    /*获取或设置当前页码  当设置的页码大于总页数时 则为总页数*/
    persagy_gridElement.prototype.psel = function (index) {
        var target = $('#' + this.id);
        return target.find(selectiontor()).psel(index);
    };

    /*下一页*/
    persagy_gridElement.prototype.pnextPage = function () {
        var target = $('#' + this.id);
        return target.find(selectiontor()).pnextPage();
    };

    /*上一页*/
    persagy_gridElement.prototype.pprevPage = function () {
        var target = $('#' + this.id);
        return target.find(selectiontor()).pprevPage();
    };

    /*选中某行,会触发该行的复选框状态改变事件
    *index 从零开始的行索引
    *isCheck 为true时，选中对应行的复选框
    *isBack 为true时，给对应行添加背景色
    *isSingleLine 为true时，取消掉除对应行外的其它行的背景色
    */
    persagy_gridElement.prototype.pon = function (index, isCheck, isBack, isSingleLine) {
        var gridTarget = this.getJqEle();
        if (!index.toString().pisInt() || (isCheck != true && isBack != true)) return;
        var li = gridTarget.find('[gconul]').children().eq(index);
        if (li.length == 0) return;
        if (isCheck == true) {
            var check = li.find('[lck]')[0];
            if (check) check.pon();
        }
        if (isBack == true) {
            new persagy_grid().lineAddBack(true, li[0], isSingleLine);
        }
    };

    /*取消选中行,会触发该行的复选框状态改变事件
    *index 从零开始的行索引
    *isCheck 为true时，取消对应行的复选框
    *isBack 为true时，取消对应行的背景色
    */
    persagy_gridElement.prototype.poff = function (index, isCheck, isBack) {
        var gridTarget = this.getJqEle();
        if (!index.toString().pisInt() || (isCheck != true && isBack != true)) return;
        var li = gridTarget.find('[gconul]').children().eq(index);
        if (li.length == 0) return;
        if (isCheck == true) {
            var check = li.find('[lck]')[0];
            if (check) check.poff();
        }
        if (isBack == true) new persagy_grid().lineRemoveBack(li);
    };

    /*选中所有行*/
    persagy_gridElement.prototype.ponAll = function () {
        var gridTarget = this.getJqEle();
        gridTarget.find('[gdheader] li:first').ponState();
        var checks = gridTarget.find('[gconul]').children().find('[lck]');
        for (var i = 0; i < checks.length; i++) {
            checks[i].pon();
        }
    };

    /*取消选中所有行*/
    persagy_gridElement.prototype.poffAll = function () {
        var gridTarget = this.getJqEle();
        gridTarget.find('[gdheader] li:first').poffState();
        var checks = gridTarget.find('[gconul]').children().find('[lck]');
        for (var i = 0; i < checks.length; i++) {
            checks[i].poff();
        }
    };

    /*选中或取消选中所有行*/
    persagy_gridElement.prototype.ptoggleAll = function () {
        var gridTarget = this.getJqEle();
        var checks = gridTarget.find('[gconul]').children().find('[lck]');
        var oldState = gridTarget.find('div[gdheader] li').eq(0).psel();
        var state = oldState == persagy_control.selState.on ? persagy_control.selState.off
                    : persagy_control.selState.on;
        for (var i = 0; i < checks.length; i++) {
            checks[i]['p' + state]();
        }
    };

    /*获取选中行数*/
    persagy_gridElement.prototype.pselCount = function () {
        var gridTarget = this.getJqEle();
        var checks = gridTarget.find('[gconul] li [lck]');
        var returnArr = [];
        for (var i = 0; i < checks.length; i++) {
            if (checks[i].psel() == persagy_control.selState.on) returnArr.push(i);
        }
        return returnArr;
    };

    /*
    *设置头部某列的标题
    *index  从零开始的列的索引
    *text   标题
    */
    persagy_gridElement.prototype.ptitle = function (index, text) {
        var gridTarget = this.getJqEle();
        if ((!index && index != 0) || !index.toString().pisPositiveInt() || !text) return;
        gridTarget.find('div[gdheader]').children().children().eq(index).text(text);
    };

    /*
    *表格头部某列进行排序
    *index  从零开始的列的索引
    *order  排序类型，可能的值包括asc、desc
    *isEvent   是否激发事件，默认true
    */
    persagy_gridElement.prototype.psort = function (index, order, isEvent) {
        var gridTarget = this.getJqEle();
        if ((!index && index != 0) || !index.toString().pisPositiveInt()) return;
        isEvent = isEvent == false ? false : true;
        var li = gridTarget.find('div[gdheader]').children().children()[index];
        if (!li) return;

        var jqLi = $(li);
        var oldSort = jqLi.attr('sort');
        if (oldSort == order && !isEvent) return;

        var ems = jqLi.find('em');
        ems.removeAttr('disabled');
        var disabledEm = order == persagy_control.order.asc ? ems.eq(0) :
                         order == persagy_control.order.desc ? ems.eq(1) : null;
        if (!disabledEm) return;

        if (oldSort == order && isEvent) {
            disabledEm.siblings().pdisable(true);
            jqLi.attr('sort', order == persagy_control.order.asc ? persagy_control.order.desc : persagy_control.order.asc);
            return li.click();
        }

        disabledEm.pdisable(true);
        jqLi.attr('sort', order);
    };

    /*
    *表格头部某列选中某选项
    *columnIndex  从零开始的列的索引
    *selIndex  从零开始的选项的索引
    *isEvent   是否激发事件，默认true
    */
    persagy_gridElement.prototype.pheaderSel = function (columnIndex, selIndex, isEvent) {
        var gridTarget = this.getJqEle();
        if ((!columnIndex && columnIndex != 0) || !columnIndex.toString().pisPositiveInt()) return;
        isEvent = isEvent == false ? false : true;
        var li = gridTarget.find('div[gdheader]').children().children()[columnIndex];
        if (!li) return;
        li.psel(selIndex, isEvent);
    };

    /*
    *表格头部某列禁用
    *columnIndex  从零开始的列的索引
    *disabled  true或false
    */
    persagy_gridElement.prototype.pheaderDisabled = function (columnIndex, disabled) {
        var gridTarget = this.getJqEle();
        if ((!columnIndex && columnIndex != 0) || !columnIndex.toString().pisPositiveInt()) return;
        var li = gridTarget.find('div[gdheader]').children().children()[columnIndex];
        if (!li) return;
        li.setAttribute('disabled', disabled);
    };
})();
;/*
*博锐尚格模态控件库 包括用于确认信息的common 用于警示信息的warning 用于提示信息的tip 用于自定义内容的custom
*默认创建common
*推荐同一个系统内同种的模态层只存在一个
*可使用target、$(target)或js创建的返回对象的pshow、phide方法来显示隐藏控件
*/
function persagy_modal() {
    this.customMdAttr = {
        template: 'template'                 /*模版id 用于自定义模态层的填充内容*/
        , title: 'title'                    /*标题文本*/
        , subtitle: 'subtitle'              /*子标题文本*/
        /*数组或object类型的按钮 只适用于非自定义模态层  最多只支持两个按钮*/
        , buttons: {
            name: 'buttons'
            , text: 'text'                /*按钮文本*/
            , 'click': 'click'          /*按钮事件*/
        }
    };
    this.constructor = arguments.callee;
};

persagy_modal.prototype = new persagy_event();

persagy_modal.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_modal.childType.common;
    var ptypeStr = _this.joinPtype(p_modal.name, type);
    var id = objAttr.id ? objAttr.id : _this.produceId();
    var template = objAttr[_this.customMdAttr.template] || '';
    var title = objAttr[_this.customMdAttr.title] || '';
    var subTitle = objAttr[_this.customMdAttr.subtitle] || '';
    var buttons = objAttr[_this.customMdAttr.buttons.name] || [];

    var templateHtml = (document.getElementById(template) || {}).innerHTML || '';
    var otherEventArr = [];
    /*if (templateHtml) {
        var tmeplateObj = this.parseTemplate(templateHtml);
        templateHtml = tmeplateObj.templateHtml;
        otherEventArr = tmeplateObj.eventArr;
    }*/

    var btnHtml = '';
    var defaultButtons = type == p_modal.childType.common || type == p_modal.childType.warning ?
        [{ text: '确定' }, { text: '取消' }] :
        type == p_modal.childType.tip || type == p_modal.childType.warntip
        ? [{ text: '确定' }] : [];
    var buttons = objAttr[_this.customMdAttr.buttons.name] || [];
    if (buttons instanceof Array !== true) buttons = [buttons];

    for (var i = 0; i < defaultButtons.length; i++) {
        var cbtn = buttons[i] || {};
        var btnObj = createBtn(i, cbtn.text);
        btnHtml += btnObj.html;
    }

    var html = '';
    if (type === p_modal.childType.custom || type === p_modal.childType.warncustom) {
        var closeBtnId = _this.produceId();
        html = '<div id="' + id + '" ' + _this.persagyTypeAttr + '="' + ptypeStr + '">' +
               '<div class="dialog-wrap">' +
               '<div class="dialog-wrap-con">' + templateHtml + '</div></div></div>';
    }
    else {
        html = '<div id="' + id + '" ' + _this.persagyTypeAttr +
               '="' + ptypeStr + '">' +
               '<div class="dialog-wrap"><div class="dialog-con"><h4>' + title +
               '</h4><span>' + subTitle + '</span></div>' +
               '<div class="dialog-button" mbtnd>' + btnHtml + '</div></div></div>';
    }

    /*加全局遮罩*/
    _this.createMask();
    if (!parent) {
        return !templateHtml ? html : { html: html, otherEvent: otherEventArr };
    }
    this.regInserted(watchEle, this.registerEvent({ event: objEvent, otherEvent: otherEventArr, attr: objAttr }));
    this.appendHtml(parent, html);
    return new persagy_modalElement(id);

    function createBtn(index, text) {
        var btnId = _this.produceId();
        var btnHtstr = '';
        var pbtn = new persagy_button();
        
        if (index == 0) {
            btnHtstr = type === p_modal.childType.common ?
               pbtn.createHtml({ text: text || '确定', id: btnId }, null, 'backBlueBorder') :
             type === p_modal.childType.warning ?
              pbtn.createHtml({ text: text || '确定', id: btnId }, null, 'backRedBorder') :
             type === p_modal.childType.tip ?
              pbtn.createHtml({ text: text || '确定', id: btnId }, null, 'backBlueBorder') :
              type === p_modal.childType.warntip ?
              pbtn.createHtml({ text: text || '确定', id: btnId }, null, 'backRedBorder') : '';
        }
        else
            btnHtstr = pbtn.createHtml({ text: text || '取消', id: btnId }, null, 'grayBorder');
        return { html: btnHtstr, id: btnId };
    };
};

/*按钮默认点击事件 关闭窗体*/
persagy_modal.prototype.btnClick = function (btnEvent, type) {
    return (function (be, t) {
        return {
            click: function (event) {
                var target = type == p_modal.childType.custom ? $(this).parent().parent() :
                    $(this).parent().parent().parent().parent();
                target.phide();
                if (typeof be == 'function') be(event);
            }
        };
    })(btnEvent,type);
};


persagy_modal.prototype.registerEvent = function (objBind) {
    return (function (obi) {
        return function (event) {
            if (event.stopBubbling) {
                event.stopBubbling();
                event.stopDefault();
            }
            var pb = persagy_public.getInstance();
            var pe = persagy_event.getInstance();
            var pm = new persagy_modal();
            pe.removeEvent(this, pe.insertedEvent);

            obi = obi || {};
            var objEvent = obi.event || {};
            var objAttr = obi.attr || {};

            var target = $(this);
            var type = pb.parsePtype(target.children()[0]).childType;
            if (type == p_modal.childType.custom || type == p_modal.childType.warncustom) {
                /*pb.regiTempConEvent(obi, this);注册内容区 别的控件的事件*/
                pb.createControlByCreateType(this);
            } else {
                var buttons = objAttr[pm.customMdAttr.buttons.name] || [];
                if (buttons instanceof Array !== true) buttons = [buttons];

                /*各按钮点击事件*/
                var buttonHtmls = target.find('[mbtnd]').find(pb.joinSelector(p_button));
                buttonHtmls.each(function (index) {
                    pe.domRegEvent(this, pm.btnClick((buttons[index] || {}).click, type));
                });
            }
        };
    })(objBind);
};
;/*js创建时 返回此实例对象*/
function persagy_modalElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_modalElement.prototype = new persagyElement();

/*带动画效果的显示窗体
*calls 回调函数或回调函数数组 和模态层内的按钮顺序一一对应
*title 标题，string
*subTitle  副标题，string或string[]
*/
persagy_modalElement.prototype.pshow = function (calls, title, subTitle) {
    calls = calls || [];
    if (calls instanceof Array === false) calls = [calls];
    var target = $('#' + this.id);
    var pmd = new persagy_modal();
    var pub = new persagy_public();
    var ptype = pub.parsePtype(target);
    var ct = ptype.childType;

    var pevent = new persagy_event();
    pub.maskShow();
    if (ct != p_modal.childType.custom && ct != p_modal.childType.warncustom) {
        target.find("div:first").addClass("animationIn").removeClass("animationOut");
        if (calls.length > 0) {
            var buttonSelector = pub.joinSelector(p_button);
            var btns = target.find(buttonSelector);
            btns.each(function (currIndex) {
                pevent.domRegEvent(this, pmd.btnClick(calls[currIndex]));
            });
        }
        //var targetH = target.find("div:first").height();
        //if (targetH % 2 == 0) {
        //    target.find("div:first").height(targetH);
        //} else {
        //    target.find("div:first").height(targetH+1);
        //}
        if (title)
            target.find('h4').text(title);
        if (subTitle)
            target.find('span').text(subTitle);

    }
    else
        target.find("div:first").addClass("animationTop").removeClass("animationBottom");
};

/*带动画效果的隐藏窗体*/
persagy_modalElement.prototype.phide = function () {
    var pub = new persagy_public();
    var target = $('#' + this.id);
    var ptype = pub.parsePtype(target);
    var ct = ptype.childType;

    if (ct != p_modal.childType.custom && ct != p_modal.childType.warncustom)
        target.find("div:first").addClass("animationOut").removeClass("animationIn");
    else
        target.find("div:first").addClass("animationBottom").removeClass("animationTop");
    pub.maskHide();
};
;/*
*博锐尚格浮动层控件 包括normal
*自定义属性：icon 弹出层左上角图标   text 按钮上的文字    其它属性见customFlAttr
*自定义事件：bclick 按钮的点击事件
*/
function persagy_float() {
    this.customFlAttr = {
        title: 'title'              /*浮动层的标题*/
        , template: 'template'      /*模版id 浮动层的内容*/
        , button: 'button'          /*此值为true时 创建带按钮的浮动层*/
    };
    this.customFlEvent = {
        bclick: 'bclick',
        hide: 'hide'                /*浮动层关闭的事件*/
    };
    this.constructor = arguments.callee;
};

persagy_float.prototype = new persagy_event();

persagy_float.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_float.childType.normal;
    var ptypeStr = _this.joinPtype(p_float.name, type);
    var id = objAttr.id ? objAttr.id : _this.produceId();
    var closeId = _this.produceId();
    var btnId = _this.produceId();
    var icon = objAttr[_this.customAttr.icon] || '';
    var text = objAttr[_this.customAttr.text] || '';
    var title = objAttr[_this.customFlAttr.title] || '';
    var template = objAttr[_this.customFlAttr.template] || '';
    var button = (objAttr[_this.customFlAttr.button] || false).toString();

    var conHtml = (document.getElementById(template) || {}).innerHTML || '';
    var btnHtml = '';
    if (button == 'true') {
        var pbtn = new persagy_button();
        btnHtml = '<div class="float-bottom" floatbtn>' +
            pbtn.createHtml({ text: text, id: btnId }, {}, 'backBlueBorder') + '</div>';
    }
    var otherEventArr = [];
    /*if (conHtml) {
        var tmeplateObj = this.parseTemplate(conHtml);
        conHtml = tmeplateObj.templateHtml;
        otherEventArr = tmeplateObj.eventArr;
    }*/
    var html = '<div ' + _this.persagyTypeAttr + '="' + ptypeStr + '" id="' + id +
               '" ' + (button == 'true' ? 'class="submit-but"' : '') + '>' +
               '<div class="float-title"><i>' + icon + '</i><em tt>' + title +
               '</em><span close id="' + closeId + '">x</span></div><div class="float-con">' + conHtml +
               '</div>' + btnHtml + '</div>';

    if (!parent) {
        return !conHtml ? html : { html: html, otherEvent: otherEventArr };
    }
    this.regInserted(watchEle, this.registerEvent({ event: objEvent, otherEvent: otherEventArr }));
    this.appendHtml(parent, html);
    return new persagy_floatElement(id);
};

/*关闭按钮事件*/
persagy_float.prototype.closeEvent = function (hideEvent) {
    return (function (he, eoa) {
        return {
            click: function (event) {
                var maxDiv = $(this).parent().parent();
                if (typeof hideEvent == 'function') {
                    event[eoa] = { target: maxDiv[0] };
                    hideEvent(event);
                }
                else
                    maxDiv.parent().hide();
            }
        };
    })(hideEvent, this.eventOthAttribute);
};

/*按钮单击事件*/
persagy_float.prototype.btnEvent = function (btnEvent) {
    return (function (be) {
        return {
            click: function (event) {
                if (typeof be == 'function') be(event);
                /*var target = $(this).parent().parent().find('[close]').click();*/
            }
        };
    })(btnEvent);
};

persagy_float.prototype.registerEvent = function (objBind) {
    objBind = objBind || {};
    var objEvent = objBind.event || {};

    var bClick = objEvent[this.customFlEvent.bclick];
    var hideEvent = objEvent[this.customFlEvent.hide];

    return (function (bck, he, ob) {
        return function (event) {
            if (event.stopBubbling) {
                event.stopBubbling();
                event.stopDefault();
            }
            var pb = persagy_public.getInstance();
            var pe = persagy_event.getInstance();
            var pf = new persagy_float();
            pe.removeEvent(this, pe.insertedEvent);
            var watchTarget = $(this);
            var btnTargets = watchTarget.find('[floatbtn]').find(pb.joinSelector(p_button));
            btnTargets.each(function () {
                pe.domRegEvent(this, pf.btnEvent(bck));
            });
            /*注册关闭按钮事件*/
            var closeBtn = watchTarget.find('[close]')[0];
            if (closeBtn) pe.domRegEvent(closeBtn, pf.closeEvent(he));

            /*pb.regiTempConEvent(ob, this);注册内容区 别的控件的事件*/
            pb.createControlByCreateType(this);
        };
    })(bClick, hideEvent, objBind);
};
;/*js创建时 返回此实例对象*/
function persagy_floatElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_floatElement.prototype = new persagyElement();

/*获取或设置title值*/
persagy_floatElement.prototype.ptitle = function (title) {
    var target = this.getJqEle();
    var titleTarget = target.find('[tt]');
    if (!title) return titleTarget.text();
    titleTarget.text(title);
};

/*获取或设置icon值*/
persagy_floatElement.prototype.picon = function (icon) {
    var target = this.getJqEle();
    var iconTarget = target.find('.float-title i');
    if (!icon) return iconTarget.text();
    iconTarget.text(icon);
};
;/*
*博锐尚格分页控件 包括common
*默认创建common
*可使用target、$(target)或js创建的返回对象的pcount、psel、pnextPage、pprevPage、porien
*/
function persagy_paging() {
    this.customPaAttr = {
        page: 'page'            /*默认页码 int型 从1开始  默认值为1*/
        , 'count': 'count'        /*总页数 int型  默认值1*/
        , 'orien': 'orien'      /*页码展开的方向 默认向上   down 向下   up 向上*/
    };
    this.customPaEvent = {
        sel: 'sel'            /*选择页码事件*/
    };
    this.constructor = arguments.callee;
};

persagy_paging.prototype = new persagy_event();

persagy_paging.prototype.createHtml = function (objAttr, objEvent, type, isRely, parent, watchEle) {
    var _this = this;
    type = type ? type : p_paging.childType.common;
    var ptypeStr = _this.joinPtype(p_paging.name, type);
    var id = objAttr.id ? objAttr.id : _this.produceId();
    var page = (objAttr[_this.customPaAttr.page] || 1).toString().ppriperDel();
    var count = (objAttr[_this.customPaAttr.count] || 1).toString().ppriperDel();
    var orien = (objAttr[_this.customPaAttr.orien] || persagy_control.orienObj.up).ppriperDel();
    var selEvent = objEvent[_this.customPaEvent.sel];

    var pcomb = new persagy_combobox();
    var pbtn = new persagy_button();
    var prevPageHtml = pbtn.createHtml({ text: '上一页', icon: 'l' }, null, 'grayBorder');
    var nextPageHtml = pbtn.createHtml({ text: '下一页', icon: 'r' }, null, 'grayBorder');

    var items = [];
    for (var i = 1; i <= count; i++) {
        items.push(i);
    }
    var placeholder = items[page - 1] + '/' + count;
    var comboboxHtml = pcomb.createHtml({ placeholder: placeholder, items: items, orien: orien },
        {}, p_combobox.childType.menu);

    var html = '<div id="' + id + '" ' + _this.persagyTypeAttr + '="' + ptypeStr +
                '"><div class="page prev-page">' + prevPageHtml +
                '</div><div class="page curr-page">' + comboboxHtml +
                '</div><div class="page">' + nextPageHtml + '</div></div>';
    if (!parent) return html;
    _this.regInserted(parent, _this.registerEvent({ attr: objAttr, event: objEvent }));
    _this.appendHtml(parent, html);
    return new persagy_pagingElement(id);
};

/*创建完毕后 注册事件*/
persagy_paging.prototype.registerEvent = function (objBind) {
    return (function (ob) {
        return function (event) {
            var pcomb = new persagy_combobox();
            var ppag = new persagy_paging();
            var pevent = persagy_event.getInstance();

            pevent.removeEvent(this, pevent.insertedEvent);

            ob = ob || {};
            var objAttr = ob.attr || {};
            var objEvent = ob.event || {};
            var currPage = objAttr[ppag.customPaAttr.page] || 1;
            var selEvent = objEvent[ppag.customPaEvent.sel];
            selEvent = typeof selEvent == 'string' ? eval(selEvent.ppriperDel()) : selEvent;

            var target = $(this);
            var reEvent = {};
            /*分页控件下拉表头部点击事件*/
            var headerEle = target.find('div[header]');
            var ul = target.find('ul');
            if (headerEle.length > 0)
                pevent.domRegEvent(headerEle, pcomb.pheaderClick(ul));

            /*分页选择事件*/
            if (ul.length > 0)
                pevent.domRegEvent(ul, pcomb.cbItemSel(ppag.selPageEvent(selEvent), p_combobox.childType.menu));

            var eles = target.find('.page');
            if (eles.length > 1) {
                if (currPage == 1) eles[0].pdisable(true);
                if (currPage == ul.find('li').length) eles[2].pdisable(true);
                if (ul.find('li').length == 1) eles[1].pdisable(true);
                pevent.domRegEvent($(eles[0]), ppag.changePage());
                pevent.domRegEvent($(eles[2]), ppag.changePage());
            }
        };
    })(objBind);
};

/*分页选择事件*/
persagy_paging.prototype.selPageEvent = function (selEvent) {
    return (function (eoa, se) {
        return function (event) {
            var selIndex = event[eoa].index + 1;
            var li = $(event[eoa].target);
            var pageEm = li.parent().parent().prev().find('em');
            var count = pageEm.text().split('/')[1];
            pageEm.text(selIndex + '/' + count);
            var combox = li.parent().parent().parent().parent();
            if (selIndex == 1) combox.prev().pdisable(true);
            else combox.prev().pdisable(false)
            if (selIndex == count) combox.next().pdisable(true);
            else combox.next().pdisable(false);
            event[eoa].index = selIndex;
            if (typeof se == 'function') se(event);
        };
    })(this.eventOthAttribute, selEvent);
};

/*上一页或下一页事件*/
persagy_paging.prototype.changePage = function () {
    return (function () {
        return {
            click: function (event) {
                var target = $(this);
                var header = target.parent().find('div[header]').find('em');
                var headText = header.text();
                var currPage = parseInt(headText.split('/')[0]);
                if (target.hasClass('prev-page')) currPage--;
                else currPage++;
                target.parent().find('li').eq(currPage - 1).click();
            }
        };
    })();
};
;/*js创建时 返回此实例对象*/
function persagy_pagingElement(id) {
    this.id = id;
    this.constructor = arguments.callee;
};

persagy_pagingElement.prototype = new persagyElement();

/*获取或设置总页数 不传递参数时返回总页数  当设置的总页数比当前页码小时 会更改当前页为第一页*/
persagy_pagingElement.prototype.pcount = function (count) {
    var target = $('#' + this.id);
    var boxDiv = target.find('.page').eq(1);
    var showPageEm = boxDiv.find('div[header]').find('em');

    var showPageText = showPageEm.text();
    var oldCount = parseInt(showPageText.split('/')[1]);
    var currPage = parseInt(showPageText.split('/')[0]);

    var pcmb = new persagy_combobox();
    var pe = persagy_event.getInstance();


    if (!count.toString().pisInt()) return oldCount;

    count = parseInt(count);
    var ul = boxDiv.find('ul');
    ul.empty();

    var liStr = '';
    for (var i = 1; i <= count; i++) {
        liStr += pcmb.createLi(i);
    }

    if (count < currPage) {
        currPage = 1;
        pe.regInserted(ul, function (event) {
            (event.target || event.srcElement).click();
            pe.removeEvent(this, pe.insertedEvent);
        });
    }

    if (count == 1) {
        currPage = 1;
        boxDiv.pdisable(true);
        boxDiv.next().pdisable(true);
        boxDiv.prev().pdisable(true);
    } else {
        boxDiv.pdisable(false);
        if (currPage == 1)
            boxDiv.prev().pdisable(true);
        else boxDiv.prev().pdisable(false);

        if (count == currPage)
            boxDiv.next().pdisable(true);
        else boxDiv.next().pdisable(false);
    }

    ul.append(liStr);
    showPageEm.text(currPage + '/' + count);
    return count;
};

/*获取或设置当前页码 不传递参数时返回当前页码  当设置的页码大于总页数时 则页码为最后一页*/
persagy_pagingElement.prototype.psel = function (index, isEvent) {
    var pagesDiv = $('#' + this.id).find('.page');
    var boxDiv = pagesDiv.eq(1);
    var prevPageDiv = pagesDiv.eq(0);
    var nextPageDiv = pagesDiv.eq(2);
    var currPageDiv = boxDiv.find('div[header]').find('em');

    var showPageText = currPageDiv.text();
    var count = parseInt(showPageText.split('/')[1]);
    var currPage = parseInt(showPageText.split('/')[0]);
    index = parseInt(index) || -1;
    if (index < 0) return currPage;

    if (index > count) index = count;
    currPageDiv.text(index + '/' + count);
    if (isEvent == false) {
        if (index == 1) prevPageDiv.pdisable(true);
        else prevPageDiv.pdisable(false);
        if (index == count) nextPageDiv.pdisable(true);
        else nextPageDiv.pdisable(false);
        return index;
    }
    boxDiv.find('ul').find('li').eq(index - 1).click();
    return index;
};

/*下一页*/
persagy_pagingElement.prototype.pnextPage = function () {
    $('#' + this.id).find('.page').eq(2).click();
};

/*上一页*/
persagy_pagingElement.prototype.pprevPage = function () {
    $('#' + this.id).find('.page').eq(0).click();
};

/*设置页码展开方向 默认向上 up 向上  down向下*/
persagy_pagingElement.prototype.porien = function (orien) {
    orien = orien || persagy_control.orienObj.up;
    $('#' + this.id).find('.page').eq(1).porien(orien);
};
 ;return persagy_control; })();