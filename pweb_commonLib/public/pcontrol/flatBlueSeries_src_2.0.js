(function () {;function persagy_tool() {
    this.enterName = 'controlInit';         /*每一个控件类的初始化控件的入口*/
    this.persagyCreateType = 'p-create';    /*旧版，以此属性放到div上来标记要创建的控件类型*/
    this.typeSeparator = '-';               /*分隔符*/
    this.persagyRely = 'p-rely';            /*创建控件时，此属性值为true时代表生成绑定*/
    this.persagyCreateBind = 'p-bind';      /*旧版，通过html创建控件时，此属性内放控件属性、事件等*/
    this.pbindEventFnName = '_pbindEventForOtherLibary';        /*knockout、vue绑定的所有事件的唯一回调方法名称*/
    this.pstaticEventFnName = '_pstaticEventForOtherLibary';    /*控件库的控件注册静态事件的唯一回调方法名称*/
    this.attrPrefix = '{{';
    this.attrSuffix = '}}';
    this.cssStart = ' class="';
    this.cssAttrEnd = '"';
    this.libraryToPro = '_ppro';            /*控件对应的对象上额外追加的属性，object类型，可包括：type 控件类型  attr、event、css等等*/
    this.libraryTypeToHtml = '_pt';         /*控件库的html追加此属性，存放控件类型*/
    this.libraryIdToHtml = '_id';           /*用于唯一标识一批控件*/
    this.eventCurrTargetName = '_currentTarget';
    this.eventOthAttribute = 'pEventAttr';    /*此属性值作为属性追加到event上，以暴漏给使用者*/
    this.registeredEventRcord = '_peventrecord';    /*某元素注册过的事件及控件类型，防止重复注册。object类型，属性名称为事件名称,值为控件类型数组*/
    this.timerNameToElement = '_timer';         /*定时器，用以执行动画*/
    this.titleSourceAttr = 'ptitle';            /*title值的来源属性*/
    this.isRenderedToProName = '_rendered';     /*此属性的值为true时代表，控件走过了渲染后的方法*/
    this.controlPrivateToProName = '_other';     /*此属性存放各种值，每个控件自用*/
    this.maxDivMarker = 'pc';                   /*控件最外围的标记*/
    this.verifyResult = 'verify';               /*验证结果标记，不为false时即验证通过*/
    /*控件状态*/
    this.pcontrolState = {
        on: 'on',       /*打开或者被选中*/
        off: 'off',      /*关闭或者未被选中*/
        success: 'success',
        failure: 'failure'
    };
    /*形状*/
    this.shape = {
        /*矩形*/
        rectangle: 'rectangle',
        /*圆形*/
        ellipse: 'ellipse'
    };
    /*方向*/
    this.orientation = {
        /*向上*/
        up: 'up',
        /*向下*/
        down: 'down',
        /*向左*/
        left: 'left',
        /*向右*/
        right: 'right'
    };
    /*横向对齐方式*/
    this.align = {
        center: 'center',
        left: 'left',
        right: 'right'
    };
    /*排列方式*/
    this.arrangeType = {
        horizontal: 'horizontal',
        vertical: 'vertical'
    };
    /*验证类型*/
    this.verifyType = {
        space: {
            name: 'space',
            stringFnName: 'pisSpace'
        },
        length: {
            name: 'length',
            stringFnName: 'pvalidLength'
        },
        chinese: {
            name: 'chinese',
            stringFnName: 'pisChinese'
        },
        email: {
            name: 'email',
            stringFnName: 'pisEmail'
        },
        /*身份证号*/
        idcard: {
            name: 'idcard',
            stringFnName: 'pisCard'
        },
        /*负整数*/
        negativeint: {
            name: 'negativeint',
            stringFnName: 'pisNegativeInt'
        },
        /*正整数*/
        positiveint: {
            name: '正整数',
            stringFnName: 'pisPositiveInt'
        },
        /*整数*/
        int: {
            name: 'int',
            stringFnName: 'pisInt'
        },
        /*负数*/
        negativenumber: {
            name: 'negativenumber',
            stringFnName: 'pisNegativeNumber'
        },
        /*正数*/
        positivenumber: {
            name: 'positivenumber',
            stringFnName: 'pisPositiveNumber'
        },
        /*数字*/
        number: {
            name: 'number',
            stringFnName: 'pisNumber'
        },
        tel: {
            name: 'tel',
            stringFnName: 'pisTel'
        },
        mobile: {
            name: 'mobile',
            stringFnName: 'pisMobile'
        }
    };
    /*排序方式*/
    this.sortType = {
        asc: 'asc',
        desc: 'desc'
    };
};

/*动态创建控件实例*/
persagy_tool.prototype.constructorCon = function (controlType) {
    return persagy_tool.instanceFactory(controlType);
};

/*创建控件*/
persagy_tool.prototype.createControl = function (controlType, childType, element, obj) {
    var constructorInstance = this.constructorCon(controlType);
    return constructorInstance[this.enterName] ? constructorInstance[this.enterName](childType, element, obj) : '';
};

/*根据p-create取得控件类型*/
persagy_tool.prototype.getTypeByPcreate = function (target) {
    var jqTarget = ptool.getJqElement(target);
    if (!jqTarget) return console.error('获取容器对象失败');
    var typeValue = jqTarget.attr(this.persagyCreateType) || '';
    return this.getTypeAndChildType(typeValue);
};

/*根据type的拼接值，获取主类型和子类型*/
persagy_tool.prototype.getTypeAndChildType = function (typeStr) {
    var types = (typeStr || '').split(this.typeSeparator);
    var controlType = types[0];
    var childType = types[1];
    return {
        controlType: controlType, childType: childType
    };
};

/*根据控件html的属性获取控件对应的类型、子类型*/
persagy_tool.prototype.getTypeAndChildTypeFromEle = function (element) {
    var typeStr = $(element).attr(this.libraryTypeToHtml);
    return this.getTypeAndChildType(typeStr);
};

/*从创建控件的元素的p-bind上获取属性、事件等，旧版专用*/
persagy_tool.prototype.oldGetBind = function (element) {
    var _this = this;
    var reg = /(\?|\:|==)/g;
    element = ptool.getJqElement(element);
    if (!element) return false;
    var strBind = element.attr(_this.persagyCreateBind) || '';
    if (!strBind) return false;
    if (strBind.indexOf('{') !== 0)
        strBind = '{' + strBind + '}';
    var objPbind = createBindStr(strBind).val;
    objPbind.attr = objPbind.attr || {};
    var isBind = element.attr(_this.persagyRely);
    objPbind.attr.bind = isBind === 'true' ? true : false;

    element.removeAttr(_this.persagyCreateType);
    element.removeAttr(_this.persagyCreateBind);
    element.removeAttr(_this.persagyRely);

    return objPbind;

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
                    oo[pro.ptrimHeadTail()] = value;
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
                    var newVal = _this.valueParse(val);
                    str = str.substring(xiaoIndex);
                    return { val: newVal, str: str };
            }
        }
        return { val: oo, str: str };
    };
};

/*值转换为，转为整数或boolean*/
persagy_tool.prototype.valueParse = function (value) {
    var newVal = value === 'true' ? true : value === 'false' ? false : null;
    if (newVal != null) return newVal;

    newVal = parseFloat(value);
    if (!isNaN(newVal)) return newVal;
    return value || '';
};

/*元素上追加额外的属性*/
persagy_tool.prototype.elementAppendPattr = function (element, controlType, childType, objBind) {
    var _type = controlType + this.typeSeparator + childType;
    element[this.libraryToPro] = {
        type: _type,
        objBind: objBind
    };
};

/*根据dom上的type属性，获取对应的控件实例*/
persagy_tool.prototype.getInstanceFromDom = function (domTarget) {
    var objType = this.getTypeAndChildTypeFromEle(domTarget);
    return this.constructorCon(objType.controlType);
};

/*event上追加属性*/
persagy_tool.prototype.appendProToEvent = function (event, obj) {
    event[this.eventOthAttribute] = obj;
    return event;
};

/*动态生成模板*/
persagy_tool.prototype.createDynamicTemplate = function (contentStr, id) {
    id = id || ptool.produceId();
    var templateStr = '<script type="text/html" id="' + id + '">' + contentStr + '</script>';
    $(document.body).append(templateStr);
    return id;
};

/*根据值、验证类型来进行验证*/
persagy_tool.prototype.verifying = function (verifyType, value, len) {
    var validFnName = this.verifyType[verifyType].stringFnName;
    return value[validFnName](len);
};

/*根据输入值截取字符串*/
persagy_tool.prototype.splitStrByKey = function (key, value) {
    for (var j = 0; j < value.length; j++) {
        var colorVal = value.substr(j, key.length);
        if (colorVal == key) {
            var first = value.substring(0, j);
            var end = value.substr(j + key.length);
            return { start: first, key: key, end: end };
        }
    }
    return false;
};

persagy_tool.getInstance = function () {
    return persagy_tool.instanceFactory(persagy_tool);
};

/*实例工厂*/
persagy_tool.instanceFactory = function (name) {
    var fn = typeof name === 'string' ? eval(name) : name;
    if (!fn) return false;
    return fn._instance || (fn._instance = new fn()) || fn._instance;
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
/*事件*/
function persagy_event() {
    this.constructor = arguments.callee;
};

/*
*创建事件
*jqElement jquery元素，eventName 事件名称,fn 事件回调
*/
persagy_event.prototype.createEvent = function (jqElement, controlType, eventName, fn) {
    if (!jqElement) return;
    /*var eventRecord = jqElement[0][this.ptool.registeredEventRcord];
    var registeredEventToTypes;
    if (eventRecord) {
        registeredEventToTypes = eventRecord[eventName];
        if (registeredEventToTypes) {
            var typeStr = ',' + registeredEventToTypes.join(',') + ',';
            if (typeStr.indexOf(',' + controlType + ',') > -1) return;
        }
    }
    if (!registeredEventToTypes) registeredEventToTypes = [];
    registeredEventToTypes.push(controlType);*/

    $(jqElement).on(eventName, fn);
    /*!eventRecord ? jqElement[0][this.ptool.registeredEventRcord] = {} : '';
    jqElement[0][this.ptool.registeredEventRcord][eventName] = registeredEventToTypes;*/
};

/*静态事件回调*/
persagy_event.prototype.staticEventExecute = function (eventCallName) {
    return (function (fnName) {
        return function (event) {
            if (typeof fnName == 'function') return fnName(event);
            var fn = eval(fnName);
            if (typeof fn == 'function') return fn(event);
        };
    })(eventCallName);
};

persagy_event.getInstance = function () {
    return persagy_tool.instanceFactory(persagy_event);
};
;/*转换成绑定 支持knockout、Vue2.0以下*/
function persagy_toBind() {
    this.ptool = persagy_tool.getInstance();
    /*支持的框架*/
    this.frameTypes = {
        ko: 'ko',
        Vue: 'Vue'
    };
    this.currFrameType = null;
    /*扩展的属性*/
    this.attr = {
        id: {
            bind: ' id="',
            position: 1     /*位置 1 代表是在控件上  2 代表是在控件之间  3 代表只是内部使用*/
        },
        name: {
            bind: ' name="',
            position: 1
        },
        /*是否生成绑定，默认false*/
        bind: {
            bind: '',
            position: 3
        },
        /*是否禁用，默认false*/
        disabled: {
            bind: ' pdisabled="',
            position: 1
        },
        value: {
            bind: ' value="',
            position: 1
        },
        text: {
            bind: '',
            position: 2
        },
        errtext: {
            bind: '',
            position: 2
        },
        tiptext: {
            bind: '',
            position: 2
        },
        title: {
            bind: ' ptitle="',
            position: 1
        },
        name: {
            bind: ' name="',
            position: 1
        },
        icon: {
            bind: '',
            position: 2
        },
        /*是否带边框，默认true*/
        isborder: {
            bind: '',
            position: 3
        },
        /*形状*/
        shape: {
            bind: '',
            position: 3
        },
        state: {
            bind: '',
            position: 3
        },
        subtitle: {
            bind: '',
            position: 2
        },
        templateid: {
            bind: '',
            position: 2
        },
        orientation: {
            bind: '',
            position: 3
        },
        align: {
            bind: '',
            position: 3
        },
        istree: {
            bind: '',
            position: 3
        },
        datasource: {
            bind: '',
            position: 3
        },
        placeholder: {
            bind: ' placeholder="',
            position: 1
        },
        isshade: {
            bind: '',
            position: 3
        },
        accept: {
            bind: ' accept="',
            position: 1
        },
        number: {
            bind: '',
            position: 3
        },
        arrange: {
            bind: '',
            position: 3
        }
    };
    /*事件*/
    this.event = {
        click: 'click', mousedown: 'mousedown', mouseup: 'mouseup', mouseover: 'mouseover', mouseout: 'mouseout',
        mouseenter: 'mouseenter', mouseleave: 'mouseleave', mousewheel: 'mousewheel',
        change: 'change', beforechange: '', input: 'input', focus: 'focus', blur: 'blur', sel: '', beforesel: '',
        scroll: '', hide: '', beforehide: ''
    };
    /*扩展的样式；绑定时，一个扩展样式对应一个属性名称或字符串值*/
    this.css = {
        overallcss: 'class="',    /*整体样式*/
        iconcss: 'class="'       /*图标样式*/
    };
    this.getFrameName();
};

persagy_toBind.prototype = persagy_event.getInstance();

persagy_toBind.getInstance = function () {
    return persagy_tool.instanceFactory(persagy_toBind);
};

/*判断所用框架*/
persagy_toBind.prototype.getFrameName = function () {
    for (var frame in this.frameTypes) {
        if (this.frameTypes.hasOwnProperty(frame) == false) continue;
        try {
            var currFrame = eval(this.frameTypes[frame]);
            return this.currFrameType = frame;
        } catch (exception) { }
    }
};

/*根据属性、css拼接html-----非绑定*/
persagy_toBind.prototype.joinHtmlByAttrCss = function (templateStr, attr, css) {
    attr = attr || {};
    css = css || {};
    for (var attrName in this.attr) {
        if (this.attr.hasOwnProperty(attrName) == false) continue;

        var currAttr = this.attr[attrName];
        if (currAttr.position == 3) continue;

        var currTemplateAttr = this.ptool.attrPrefix + attrName + this.ptool.attrSuffix;
        var attrStartIndex = templateStr.indexOf(currTemplateAttr);
        if (attrStartIndex == -1) continue;
        var attrEndIndex = attrStartIndex + currTemplateAttr.length;
        if (!attr[attrName] && attr[attrName] !== false) {
            templateStr = templateStr.substring(0, attrStartIndex) + templateStr.substring(attrEndIndex);
            continue;
        }

        switch (currAttr.position) {
            case 1:
                var attrToStr = currAttr.bind + attr[attrName] + this.ptool.cssAttrEnd;
                templateStr = templateStr.substring(0, attrStartIndex) + attrToStr + templateStr.substring(attrEndIndex);
                break;
            case 2:
                var first = templateStr.substring(0, attrStartIndex);
                var middle = templateStr.substring(attrEndIndex);

                var jianIndex = middle.indexOf('>');
                var second = middle.substring(0, jianIndex + 1);
                var three = middle.substring(jianIndex + 1);
                var attrValue = attr[attrName];
                attrValue = attrName.toLocaleLowerCase() != 'templateid' ? attrValue : document.getElementById(attrValue).innerHTML;
                templateStr = first + second + attrValue + three;
                break;
        }
    }

    for (var cssName in css) {
        if (css.hasOwnProperty(cssName) == false) continue;

        var currTemplateCss = this.ptool.attrPrefix + cssName + this.ptool.attrSuffix;
        var cssStartIndex = templateStr.indexOf(currTemplateCss);
        if (cssStartIndex == -1) continue;
        var cssEndIndex = cssStartIndex + currTemplateCss.length;
        if (!css[cssName]) {
            templateStr = templateStr.substring(0, cssStartIndex) + templateStr.substring(cssEndIndex);
            continue;
        }

        var first = templateStr.substring(0, cssStartIndex);
        var second = templateStr.substring(cssEndIndex);

        var leftJianIndex = first.lastIndexOf('<');
        var leftClassIndex = first.lastIndexOf(this.ptool.cssStart);
        var leftClassEndIndex = leftClassIndex + this.ptool.cssStart.length;

        var rightJianIndex = second.indexOf('>');
        var rightClassIndex = second.indexOf(this.ptool.cssStart);
        var rightClassEndIndex = rightClassIndex + this.ptool.cssStart.length;

        if (leftClassIndex > leftJianIndex) {
            var middle = first.substring(0, leftClassEndIndex);
            var three = first.substring(leftClassEndIndex);
            templateStr = middle + css[cssName] + ' ' + three + second;
        }
        else if (rightClassIndex < rightJianIndex) {
            var middle = second.substring(0, rightClassEndIndex);
            var three = second.substring(rightClassEndIndex);
            templateStr = first + middle + css[cssName] + ' ' + three;
        }
        else templateStr = first + this.ptool.cssStart + css[cssName] + this.ptool.cssAttrEnd + second;
    }

    for (var eventName in this.event) {
        if (this.event.hasOwnProperty(eventName) == false) continue;

        var currTemplateEvent = this.ptool.attrPrefix + eventName + this.ptool.attrSuffix;
        var eventStartIndex = templateStr.indexOf(currTemplateEvent);
        if (eventStartIndex == -1) continue;
        var eventEndIndex = eventStartIndex + currTemplateEvent.length;
        templateStr = templateStr.substring(0, eventStartIndex) + templateStr.substring(eventEndIndex);
    }

    return templateStr;
};

/*根据属性、css拼接html-----绑定*/
persagy_toBind.prototype.joinHtmlToBindByAttrCss = function (templateStr, attr, event, css, isFor) {
    attr = attr || {};
    event = event || {};
    css = css || {};
    isFor = isFor === true ? true : false;
    if (!this.currFrameType) this.getFrameName();
    var bindFn = persagy_tool.instanceFactory('persagy_' + this.currFrameType);
    return bindFn.createBind(templateStr, attr, event, css, isFor);
};

/*生成for循环绑定*/
persagy_toBind.prototype.createForBind = function (templateStr, source, isFor) {
    isFor = isFor === true ? true : false;
    if (!this.currFrameType) this.getFrameName();
    var bindFn = persagy_tool.instanceFactory('persagy_' + this.currFrameType);
    return bindFn.createForBind(templateStr, source, isFor);
};

/*生成style绑定*/
persagy_toBind.prototype.createStyleBind = function (templateStr, styleObj) {
    if (!this.currFrameType) this.getFrameName();
    var bindFn = persagy_tool.instanceFactory('persagy_' + this.currFrameType);
    return bindFn.createStyleBind(templateStr, styleObj);
};

persagy_toBind.getInstance = function () {
    return persagy_tool.instanceFactory(persagy_toBind);
};






/*-------------Ko绑定相关------------------------------*/
/*ko的css绑定 只能指向一个属性，css:属性名称；但由于和类名:属性名称 这种绑定冲突，所以暂时使用后者，下面vue绑定同样如此；即意味着控件库暂不支持自定义样式*/
function persagy_ko() {
    this.constructor = arguments.callee;
    /*扩展的属性*/
    this.attr = {
        id: {
            bind: 'id:',
            position: 1     /*位置 1 代表是在控件上  2 代表不需要写在attr里面  3 代表只是内部使用*/
        },
        name: {
            bind: ' name:',
            position: 1
        },
        /*是否生成绑定，默认false*/
        bind: {
            bind: '',
            position: 3
        },
        /*是否禁用，默认false*/
        disabled: {
            bind: 'pdisabled:',
            position: 1
        },
        value: {
            bind: ' value:',
            position: 2
        },
        text: {
            bind: 'text:',
            position: 2
        },
        errtext: {
            bind: 'text:',
            position: 2
        },
        tiptext: {
            bind: 'text:',
            position: 2
        },
        title: {
            bind: 'title:',
            position: 1
        },
        name: {
            bind: ' name:',
            position: 1
        },
        icon: {
            bind: 'text:',
            position: 2
        },
        /*是否带边框，默认true*/
        isborder: {
            bind: '',
            position: 3
        },
        /*形状*/
        shape: {
            bind: '',
            position: 3
        },
        state: {
            bind: '',
            position: 3
        },
        subtitle: {
            bind: 'text:',
            position: 2
        },
        orientation: {
            bind: '',
            position: 3
        },
        align: {
            bind: '',
            position: 3
        },
        istree: {
            bind: '',
            position: 3
        },
        datasource: {
            bind: '',
            position: 3
        },
        placeholder: {
            bind: ' placeholder:',
            position: 1
        },
        isshade: {
            bind: '',
            position: 3
        },
        accept: {
            bind: ' accept:',
            position: 1
        },
        number: {
            bind: '',
            position: 3
        },
        arrange: {
            bind: '',
            position: 3
        },
        templateid: {
            bind: '',
            position: 2
        }
    };
    /*事件*/
    this.event = {
        click: 'click:', mousedown: 'mousedown:', mouseup: 'mouseup:', mouseover: 'mouseover:', mouseout: 'mouseout:',
        mouseenter: 'mouseenter:', mouseleave: 'mouseleave:', mousewheel: 'mousewheel:',
        change: '', beforechange: '', input: 'input:', focus: 'focus:', blur: 'blur:', sel: '', beforesel: '',
        scroll: '', hide: '', beforehide: ''
    };

    this.css = {};
};

persagy_ko.prototype = new persagy_toBind();

/*生成绑定绑定字符串*/
persagy_ko.prototype.createBind = function (templateStr, attr, event, css) {
    var _this = this;
    var ptool = persagy_tool.getInstance();
    return parser(templateStr);
    function parser(currTemplateStr) {
        var jianIndex = currTemplateStr.indexOf('>');
        if (jianIndex == -1) return currTemplateStr;
        var first = currTemplateStr.substring(0, jianIndex);
        var second = currTemplateStr.substring(jianIndex);
        if (jianIndex == 0) {
            first = currTemplateStr.substring(0, 1);
            second = currTemplateStr.substring(1);
            return first + arguments.callee(second);
        }

        var attrInStr = '', attrOutStr = '';
        for (var attrName in _this.attr) {
            if (_this.attr.hasOwnProperty(attrName) == false) continue;

            var currAttr = _this.attr[attrName];
            if (currAttr.position == 3) continue;

            var currTemplateAttr = _this.ptool.attrPrefix + attrName + _this.ptool.attrSuffix;
            var attrStartIndex = first.indexOf(currTemplateAttr);
            if (attrStartIndex == -1) continue;
            var attrEndIndex = attrStartIndex + currTemplateAttr.length;
            first = first.substring(0, attrStartIndex) + first.substring(attrEndIndex);
            /*if (attr[attrName] == null || attr[attrName] == '') continue;*/
            var attrVal = attr[attrName];
            if (attrVal == null) continue;

            if (attrName == 'templateid') {
                second = second.substr(0, 1) + document.getElementById(attrVal).innerHTML + second.substr(1);
                continue;
            }

            var currJoinStr = currAttr.bind + (attrVal || '$data');
            switch (currAttr.position) {
                case 1:
                    attrInStr += (!attrInStr ? '' : ',') + currJoinStr;
                    break;
                case 2:
                    attrOutStr += (!attrOutStr ? '' : ',') + currJoinStr;
                    break;
            }
        }
        attrInStr = !attrInStr ? '' : 'attr:{' + attrInStr + '}';
        var attrStr = attrInStr + (!attrInStr ? '' : ',') + attrOutStr;

        var cssStr = '';
        for (var cssName in css) {
            if (css.hasOwnProperty(cssName) == false) continue;

            var currTemplateCss = _this.ptool.attrPrefix + cssName + _this.ptool.attrSuffix;
            var cssStartIndex = first.indexOf(currTemplateCss);
            if (cssStartIndex == -1) continue;
            var cssEndIndex = cssStartIndex + currTemplateCss.length;
            first = first.substring(0, cssStartIndex) + first.substring(cssEndIndex);
            if (!css[cssName]) continue;
            cssStr += (cssStr.length > 0 ? ',' : '') + '\'' + cssName + '\':' + css[cssName];
        }
        cssStr = 'css:{' + cssStr + '}';
        cssStr = attrStr && cssStr ? ',' + cssStr : cssStr;

        var eventStr = '';
        for (var eventName in _this.event) {
            if (_this.event.hasOwnProperty(eventName) == false) continue;
            if (!_this.event[eventName]) continue;

            var currTemplateEvent = _this.ptool.attrPrefix + eventName + _this.ptool.attrSuffix;
            var eventStartIndex = first.indexOf(currTemplateEvent);
            if (eventStartIndex == -1) continue;
            var eventEndIndex = eventStartIndex + currTemplateEvent.length;
            first = first.substring(0, eventStartIndex) + first.substring(eventEndIndex);
            eventStr += (!eventStr ? '' : ',') + _this.event[eventName] + ptool.pbindEventFnName;
        }
        eventStr = eventStr ? 'event:{' + eventStr + '}' : '';
        eventStr = (attrStr || cssStr) && eventStr ? ',' + eventStr : eventStr;

        var bindStr = attrStr || cssStr || eventStr ? ' data-bind="' + attrStr + cssStr + eventStr + '"' : '';

        second = arguments.callee(second);

        return first + bindStr + second;
    };
};

/*生成for循环绑定*/
persagy_ko.prototype.createForBind = function (templateStr, source) {
    return '<!-- ko foreach: ' + source + ' -->' + templateStr + '<!-- /ko -->';
};

/*生成style绑定*/
persagy_ko.prototype.createStyleBind = function (templateStr, styleObj) {
    styleObj = styleObj || {};
    var bindStr = '';
    for (var soj in styleObj) {
        if (styleObj.hasOwnProperty(soj) == false) continue;
        var styleName = soj;
        var styleVal = styleObj[soj];
        bindStr += (bindStr.length > 0 ? ',' : '') + '\'' + styleName + '\':' + styleVal;
    }
    bindStr = 'style:{' + bindStr + '}';
    var templateJqTarget = $(templateStr);
    var oldBindStr = templateJqTarget.attr('data-bind');
    if (oldBindStr != null) {
        bindStr = oldBindStr + ',' + bindStr;
    }

    templateJqTarget.attr('data-bind', bindStr);
    return templateJqTarget[0].outerHTML;
};

persagy_ko.getInstance = function () {
    return persagy_tool.instanceFactory(persagy_ko);
};


/*-------------------------vue绑定相关只支持2.x -----------------------
vue的css绑定可绑定多个属性，如：css:[属性名称1,属性名称2]，但暂时采用：css:{类名:属性名,类名:属性名} 的形式
对于for 循环绑定，要求 v-for="model in 属性名"   必须是model in
*/
function persagy_Vue() {
    /*扩展的属性*/
    this.attr = {
        id: {
            bind: ' :id="',
            position: 1     /*位置 1 代表是在控件上  3 代表只是内部使用*/
        },
        name: {
            bind: ' :name="',
            position: 1
        },
        /*是否生成绑定，默认false*/
        bind: {
            bind: '',
            position: 3
        },
        /*是否禁用，默认false*/
        disabled: {
            bind: ' :pdisabled="',
            position: 1
        },
        value: {
            bind: ' v-model="',
            position: 1
        },
        text: {
            bind: ' v-text="',
            position: 1
        },
        errtext: {
            bind: ' v-text="',
            position: 1
        },
        tiptext: {
            bind: ' v-text="',
            position: 1
        },
        title: {
            bind: ' :title="',
            position: 1
        },
        name: {
            bind: ' :name="',
            position: 1
        },
        icon: {
            bind: ' v-text="',
            position: 1
        },
        /*是否带边框，默认true*/
        isborder: {
            bind: '',
            position: 3
        },
        /*形状*/
        shape: {
            bind: '',
            position: 3
        },
        state: {
            bind: '',
            position: 3
        },
        subtitle: {
            bind: ' v-text="',
            position: 2
        },
        orientation: {
            bind: '',
            position: 3
        },
        align: {
            bind: '',
            position: 3
        },
        istree: {
            bind: '',
            position: 3
        },
        datasource: {
            bind: '',
            position: 3
        },
        placeholder: {
            bind: ' :placeholder="',
            position: 1
        },
        isshade: {
            bind: '',
            position: 3
        },
        accept: {
            bind: ' :accept="',
            position: 1
        },
        number: {
            bind: '',
            position: 3
        },
        arrange: {
            bind: '',
            position: 3
        },
        templateid: {
            bind: '',
            position: 2
        }
    };
    /*事件*/
    this.event = {
        click: ' @click="', mousedown: ' @mousedown="', mouseup: ' @mouseup="', mouseover: ' @mouseover="', mouseout: ' @mouseout="',
        mouseenter: ' @mouseenter="', mouseleave: ' @mouseleave="', mousewheel: ' @mousewheel="',
        change: '', beforechange: '', input: ' @input="', focus: ' @focus="', blur: ' @blur="', sel: '', beforesel: '',
        scroll: '', hide: '', beforehide: ''
    };

    this.css = {};
};

persagy_Vue.prototype = new persagy_toBind();

/*生成绑定绑定字符串*/
persagy_Vue.prototype.createBind = function (templateStr, attr, event, css, isFor) {
    var forBindPrefix = isFor === true ? 'model' : '';
    var forBindSperator = isFor === true ? '.' : '';
    var _this = this;
    var ptool = persagy_tool.getInstance();
    return parser(templateStr);
    function parser(currTemplateStr) {
        var jianIndex = currTemplateStr.indexOf('>');
        if (jianIndex == -1) return currTemplateStr;
        var first = currTemplateStr.substring(0, jianIndex);
        var second = currTemplateStr.substring(jianIndex);
        if (jianIndex == 0) {
            first = currTemplateStr.substring(0, 1);
            second = currTemplateStr.substring(1);
            return first + arguments.callee(second);
        }

        var attrStr = '';
        for (var attrName in _this.attr) {
            if (_this.attr.hasOwnProperty(attrName) == false) continue;

            var currAttr = _this.attr[attrName];
            if (currAttr.position == 3) continue;

            var currTemplateAttr = _this.ptool.attrPrefix + attrName + _this.ptool.attrSuffix;
            var attrStartIndex = first.indexOf(currTemplateAttr);
            if (attrStartIndex == -1) continue;
            var attrEndIndex = attrStartIndex + currTemplateAttr.length;
            first = first.substring(0, attrStartIndex) + first.substring(attrEndIndex);
            /*if (attr[attrName] == null || attr[attrName] == '') continue;*/
            var attrVal = attr[attrName];
            if (attrVal == null) continue;

            if (attrName == 'templateid') {
                second = second.substr(0, 1) + document.getElementById(attrVal).innerHTML + second.substr(1);
                continue;
            }

            var currJoinStr = currAttr.bind + forBindPrefix + (!attrVal ? '' : forBindSperator + attrVal) + _this.ptool.cssAttrEnd;
            attrStr += currJoinStr;
        }

        var cssStr = '';
        for (var cssName in css) {
            if (css.hasOwnProperty(cssName) == false) continue;

            var currTemplateCss = _this.ptool.attrPrefix + cssName + _this.ptool.attrSuffix;
            var cssStartIndex = first.indexOf(currTemplateCss);
            if (cssStartIndex == -1) continue;
            var cssEndIndex = cssStartIndex + currTemplateCss.length;
            first = first.substring(0, cssStartIndex) + first.substring(cssEndIndex);
            if (!css[cssName]) continue;
            cssStr += (!cssStr ? '' : ',') + '\'' + cssName + '\':' + forBindPrefix + css[cssName];
        }
        cssStr = cssStr ? ' v-bind:class="{' + cssStr + '}"' : '';

        var eventStr = '';
        for (var eventName in _this.event) {
            if (_this.event.hasOwnProperty(eventName) == false) continue;
            if (!_this.event[eventName]) continue;

            var currTemplateEvent = _this.ptool.attrPrefix + eventName + _this.ptool.attrSuffix;
            var eventStartIndex = first.indexOf(currTemplateEvent);
            if (eventStartIndex == -1) continue;
            var eventEndIndex = eventStartIndex + currTemplateEvent.length;
            first = first.substring(0, eventStartIndex) + first.substring(eventEndIndex);
            eventStr += _this.event[eventName] + ptool.pbindEventFnName + '(model,$event)' + _this.ptool.cssAttrEnd;
        }

        var bindStr = attrStr + cssStr + eventStr;

        second = arguments.callee(second);

        return first + bindStr + second;
    };
};

/*生成for循环绑定*/
persagy_Vue.prototype.createForBind = function (templateStr, source, isFor) {
    var index = templateStr.indexOf('>');
    var str1 = templateStr.substring(0, index);
    var str2 = templateStr.substring(index);
    str1 = str1 + ' ' + 'v-for="model in ' + (isFor === true ? 'model.' : '') + source + '"';
    return str1 + str2;
};

/*生成style绑定*/
persagy_Vue.prototype.createStyleBind = function (templateStr, styleObj) {
    styleObj = styleObj || {};
    var bindStr = '';
    for (var soj in styleObj) {
        if (styleObj.hasOwnProperty(soj) == false) continue;
        var styleName = soj;
        var styleVal = styleObj[soj];
        bindStr += (bindStr.length > 0 ? ',' : '') + '\'' + styleName + '\':' + styleVal;
    }
    bindStr = '{' + bindStr + '}';
    var templateJqTarget = $(templateStr);
    templateJqTarget.attr('v-bind:style', bindStr);
    return templateJqTarget[0].outerHTML;
};

persagy_Vue.getInstance = function () {
    return persagy_tool.instanceFactory(persagy_Vue);
};
;/*
*所有的控件类继承此类
*支持的所有标签包括：header、item、verify、animate、tip、panel、button、combobox、column、page、user、manage
*   button、combobox 标签内用于创建pbutton、pcombobox
*/
function persagyElement() {
    this.constructor = arguments.callee;
    /*扩展的方法*/
    this.extendFn = {
        /*使用js创建控件
        *obj object类型，可包含属性如下：
        *   attr object类型，可包含属性为，将要创建的控件具有的属性；
        *       如果需要生成绑定，请在attr内加上bind:true
        *   css  object类型，可包含属性为，将要创建的控件具有的样式
        *   event object类型，可包含属性为，将要创建的控件具有的事件
        */
        pinit: function (controlType, childType, obj) {
            persagy_tool.getInstance().createControl(controlType, childType, this, obj);
        },
        /*初始化某区域内的控件*/
        prender: function () {
            var pt = persagy_tool.getInstance();
            var pel = persagyElement.getInstance();
            var types = pel.controlTypes;
            var selectorStr = '';
            for (var typeName in types) {
                if (types.hasOwnProperty(typeName) == false) continue;
                var childTypes = types[typeName].types;
                for (var i = 0; i < childTypes.length; i++) {
                    var childType = childTypes[i];
                    selectorStr = selectorStr + (selectorStr.length > 0 ? ',' : '') + typeName + pt.typeSeparator + childType;
                }
            }
            var jqElements = $(this).find(selectorStr);
            if (jqElements.length > 0) {
                jqElements.each(function () {
                    var typeObj = pt.getTypeAndChildType(this.tagName.toLowerCase());
                    pt.createControl(typeObj.controlType, typeObj.childType, this, null);
                });
            }
        },
        /*设置控件状态、选中某选项等*/
        psel: '',
        /*控件状态轮换等*/
        ptoggle: '',
        /*显示控件*/
        pshow: '',
        /*隐藏控件*/
        phide: '',
        /*设置滚动距离*/
        psetScroll: '',
        /*设置样式，用法同jquery的css*/
        pcss: '',
        /*获取或设置文本框的值*/
        pval: '',
        /*隐藏某区域内的错误及友好提示*/
        phideTextTip: function () {
            var target = $(this);
            var textTemplate = new ptext_template();
            target.find('[' + textTemplate.errMarker + '],[' + textTemplate.friendlyMarker + ']').hide();
            target.find('[' + textTemplate.textMarker + ']').removeClass(textTemplate.errCss);
            target.attr(textTemplate.ptool.verifyResult, 'true');
        },
        /*显示错误提示*/
        pshowTextTip: function (errMess) {
            var target = $(this);
            var textTemplate = new ptext_template();
            target.find('[' + textTemplate.errTextMarker + ']').text(errMess);
            target.find('[' + textTemplate.errMarker + ']').show();
            target.find('[' + textTemplate.textMarker + ']').addClass(textTemplate.errCss);
            target.attr(textTemplate.ptool.verifyResult, 'false');
        },
        /*判断某区域内的控件或某一个控件是否全部验证通过*/
        pverifi: function () {
            var target = $(this);
            var pt = persagy_tool.getInstance();
            var pet = persagyElement.getInstance().controlTypes;
            var controlTargetArr = target.attr(pt.maxDivMarker) != null ? target : target.find('[' + pt.maxDivMarker + ']');
            var textTemplate = new ptext_template();
            for (var i = 0; i < controlTargetArr.length; i++) {
                var currJqTarget = controlTargetArr.eq(i);
                if (currJqTarget.attr(pt.verifyResult) == 'false') return false;
                var typeObj = pt.getTypeAndChildTypeFromEle(currJqTarget);
                var val, fn;
                typeObj.controlType == pet.ptext.name ? (val = currJqTarget.pval(), fn = ptext) :
                typeObj.controlType == pet.pcombobox.name ? (val = currJqTarget.psel().text, fn = pcombobox) : '';
                if (!fn) continue;
                var _id = currJqTarget.attr(pt.libraryIdToHtml);
                var objBind = fn[_id];
                var attr = objBind.attr;
                var verifyArr = attr.verify;
                if (!(verifyArr instanceof Array)) verifyArr = [attr.verify];

                for (var i = 0; i < verifyArr.length; i++) {
                    var verifyObj = verifyArr[i];
                    if (!verifyObj.verifytype) continue;
                    var len = verifyObj.verifytype === pt.verifyType.length.name ? parseInt(verifyObj.length) : '';
                    var verifyResult = pt.verifying(verifyObj.verifytype, val, len);

                    if (verifyObj.verifytype == textTemplate.ptool.verifyType['space'].name) {
                        verifyResult = !verifyResult;
                    }
                    if (!verifyResult) {
                        currJqTarget.find('[' + textTemplate.errTextMarker + ']').text(verifyObj.errtip || '');
                        return false;
                    }
                }
            }
            return true;
        },
        /*某一区域内的控件或某一个控件恢复初始状态*/
        precover: function () {
            var jqTarget = $(this);
            var pt = persagy_tool.getInstance();
            var pet = persagyElement.getInstance();
            var controlTargetArr = jqTarget.attr(pt.maxDivMarker) != null ? jqTarget : jqTarget.find('[' + pt.maxDivMarker + ']');
            for (var i = 0; i < controlTargetArr.length; i++) {
                var currTarget = controlTargetArr[i];
                var controlInstance = pt.getInstanceFromDom(currTarget);
                if (!controlInstance) continue;
                if (typeof controlInstance.precover !== 'function') continue;
                controlInstance.precover.apply(currTarget, arguments);
            }
        },
        /*获取或设置总页数*/
        pcount: '',
        /*锁定时间控件*/
        plock: ''
    };

    /*控件类型*/
    this.controlTypes = {
        pbutton: {
            name: 'pbutton',
            types: ['white', 'blue', 'borderred', 'backred', 'menumain', 'menuminor']
        },
        pcombobox: {
            name: 'pcombobox',
            types: ['normal', 'custom', 'menumain', 'menuminor', 'text', 'page', 'time']
        },
        pswitch: {
            name: 'pswitch',
            types: ['checkbox', 'radio', 'slide']
        },
        pnotice: {
            name: 'pnotice',
            types: ['message', 'nodata']
        },
        ploading: {
            name: 'ploading',
            types: ['global', 'part']
        },
        pscroll: {
            name: 'pscroll',
            types: ['small']
        },
        ptab: {
            name: 'ptab',
            types: ['button', 'text', 'navigation']
        },
        ptext: {
            name: 'ptext',
            types: ['text', 'textarea', 'combobox']
        },
        pwindow: {
            name: 'pwindow',
            types: ['global', 'modal', 'confirm', 'float', 'bubble']
        },
        pupload: {
            name: 'pupload',
            types: ['attachment', 'img']
        },
        ppage: {
            name: 'ppage',
            types: ['simple', 'full']
        },
        psearch: {
            name: 'psearch',
            types: ['delay', 'promptly']
        },
        ptree: {
            name: 'ptree',
            types: ['normal']
        },
        ptime: {
            name: 'ptime',
            types: ['form', 'calendar']
        },
        pgrid: {
            name: 'pgrid',
            types: ['normal', 'multifunction']
        },
        plogin: {
            name: 'plogin',
            types: ['normal']
        },
        pframe: {
            name: 'pframe',
            types: ['normal']
        }
    };
};

persagyElement.prototype = persagy_toBind.getInstance();

/*创建控件的入口，根据控件类型分发到对应控件类的init方法*/
persagyElement.prototype.controlInit = function (childType, element, obj) {
    /*此处为了兼容旧版本，只有通过js创建或者旧版本写到p-bind里面，objBind才会不为null*/
    var objBind = obj || this.ptool.oldGetBind(element) || false;
    var jqElement = ptool.getJqElement(element);
    /*判断内为新版本的写法*/
    if (!objBind) {
        var val;
        var attr = {}, event = {}, css = {};
        for (var attrPro in this.attr) {
            if (this.attr.hasOwnProperty(attrPro) == false) continue;
            val = jqElement[0].getAttribute(attrPro);
            if (!val) continue;
            attr[attrPro] = this.ptool.valueParse(val);
            jqElement.removeAttr(attrPro);
        }
        for (var eventPro in this.event) {
            if (this.event.hasOwnProperty(eventPro) == false) continue;
            val = jqElement.attr(eventPro);
            if (!val) continue;
            event[eventPro] = val;
            jqElement.removeAttr(eventPro);
        }
        for (var cssPro in this.css) {
            if (this.css.hasOwnProperty(cssPro) == false) continue;
            val = jqElement.attr(cssPro);
            if (!val) continue;
            css[cssPro] = val;
            jqElement.removeAttr(cssPro);
        }

        var domElement = ptool.getDomElement(element);
        var attributes = domElement.attributes;
        var customAttribute = null;
        for (var i = 0; i < attributes.length; i++) {
            var currAttribute = attributes[i];
            if (!customAttribute) customAttribute = {};
            customAttribute[currAttribute.name] = currAttribute.value;
        }

        objBind = { attr: attr, event: event, css: css, customAttr: customAttribute };
    }
    objBind.attr.bind = objBind.attr.bind === true ? true : false;
    return this.init(childType, objBind, jqElement);
};

persagyElement.prototype.renderView = function (templateStr, controlType, childType, objBind, jqElement, replaceBeforeCall) {
    var newTemplateStr = '<div>' + templateStr + '</div>';
    var newTemplateJqTarget = $(newTemplateStr);
    newTemplateJqTarget.prender();
    templateStr = newTemplateJqTarget.html().replace(/(\}\}\=\"\")/g, '}}');

    var _id = ptool.produceId();
    var htmlStr = this.createHtml(templateStr, objBind, controlType, childType);
    this.constructor[_id] = objBind;
    return this.htmlReplace(jqElement, htmlStr, objBind, controlType, childType, _id, replaceBeforeCall);
};

/*
*生成html
*/
persagyElement.prototype.createHtml = function (templateStr, objBind, controlType, childType) {
    var attr = objBind.attr;
    var customAttr = objBind.customAttr;
    var event = objBind.event;
    var css = objBind.css;

    if (customAttr) {
        var indexJ = templateStr.indexOf('>');
        var templateStartStr = templateStr.substring(0, indexJ);
        var templateEndStr = templateStr.substring(indexJ);
        for (var cattrName in customAttr) {
            if (customAttr.hasOwnProperty(cattrName) == false) continue;
            templateStartStr += ' ' + cattrName + '="' + customAttr[cattrName] + '"';
        }
        templateStr = templateStartStr + templateEndStr;
    }

    if (attr.bind === false) return this.joinHtmlByAttrCss(templateStr, attr, css);
    return this.joinHtmlToBindByAttrCss(templateStr, attr, event, css);
};

/*
*用生成的html替换原有的html
*/
persagyElement.prototype.htmlReplace = function (element, htmlStr, objBind, controlType, childType, _id, replaceBeforeCall) {
    var jqElement = ptool.getJqElement(element);
    var jqNewElement = $(htmlStr);
    var type = controlType + this.ptool.typeSeparator + childType;
    jqNewElement.attr(this.ptool.libraryTypeToHtml, type);
    jqNewElement.attr(this.ptool.libraryIdToHtml, _id);
    if (typeof replaceBeforeCall == 'function') jqNewElement = replaceBeforeCall(jqNewElement);
    return jqNewElement.replaceAll(jqElement);
};

/*事件分发-> 针对控件事件*/
persagyElement.prototype.eventHandout = function (model, event) {
    var domTarget = event.currentTarget;
    var jqElement = $(domTarget);
    var controlInstance = this.ptool.getInstanceFromDom(domTarget);
    var _id = jqElement.attr(this.ptool.libraryIdToHtml);
    var objBind = controlInstance.constructor[_id];

    var orginEvent = objBind.event || {};
    var eventName = event.type;
    var eventFn = orginEvent[eventName];
    if (!eventFn) return null;
    return this.executeEventCall(model, event, eventFn);
};

/*调用事件的回调函数*/
persagyElement.prototype.executeEventCall = function (model, event, fnName) {
    if (!fnName) return null;
    if (typeof fnName == 'function') return model ? fnName(model, event) : fnName(event);
    var fn = eval(fnName);
    if (typeof fn == 'function') return model ? fn(model, event) : fn(event);
};


persagyElement.getInstance = function () {
    return persagy_tool.instanceFactory(persagyElement);
};
;var persagy_control = {
};

void function () {
    var pt = persagy_tool.getInstance();
    var pel = persagyElement.getInstance();

    function render() {
        $(function () {
            var jqBody = $(document.body);
            /*vue 2.0以上在实例化Vue时会把绑定的元素及其所有子元素的事件都给清掉，故把DOMNodeInserted事件注册给body
            *第一次改变model时  vue会执行DOMNodeInserted事件，其event.srcElement是new Vue时指向的元素；
            *后续改变model时不再执行DOMNodeInserted事件，除非model内的项增多了
            */
            pel.createEvent(jqBody, null, 'DOMNodeInserted', function (event) {
                var srcElement = event.srcElement || event.target;
                executeRen(srcElement);

                function executeRen(ele) {
                    var jqElement = $(ele);
                    var typeObj = pt.getTypeAndChildTypeFromEle(ele);
                    var libraryType = typeObj.controlType;

                    findChildControl(jqElement);

                    var types = pel.controlTypes;
                    if (!types[libraryType]) return;
                    var oldPpro = ele[pt.libraryToPro] || {};
                    if (oldPpro[pt.isRenderedToProName] === true) return;
                    if (jqElement.attr(pt.maxDivMarker) == null) return;

                    var controlInstance = pt.getInstanceFromDom(ele);
                    var _id = jqElement.attr(pt.libraryIdToHtml);
                    var objBind = controlInstance.constructor[_id];
                    controlInstance.rendered(ele, objBind, typeObj.childType);

                    oldPpro = ele[pt.libraryToPro] || {}
                    oldPpro[pt.isRenderedToProName] = true;
                    ele[pt.libraryToPro] = oldPpro;

                    /*只找第一级嵌套控件，避免重复执行*/
                    function findChildControl(jqElement) {
                        var childArr = jqElement.children();
                        for (var i = 0; i < childArr.length; i++) {
                            var currJqEle = childArr.eq(i);
                            if (currJqEle.attr(pt.maxDivMarker) != null) {
                                executeRen(currJqEle[0]);
                                continue;
                            }
                            arguments.callee(currJqEle);
                        }
                    };
                };
            });

            /*body上注册click事件，以便关闭各种面板*/
            pel.createEvent(jqBody, null, 'click', function () {
                new pcombobox().slideUp();
                new pcombobox().hideNotFirstLevelMenu();

                var psearchSelector = '';
                var psearchTypes = pel.controlTypes.psearch.types;
                var psearchName = pel.controlTypes.psearch.name;
                psearchTypes.forEach(function (currType) {
                    var tstr = psearchName + pt.typeSeparator + currType;
                    psearchSelector += (psearchSelector.length > 0 ? ',' : '') + '[' + pt.libraryTypeToHtml + '="' + tstr + '"]';
                });
                $(psearchSelector).find('[' + new psearch_template().friendlyMarker + ']').hide();
            });
            /*body上注册hover事件，以便关闭各种面板*/
            pel.createEvent(jqBody, null, 'mouseover', function () {
                new pcombobox().hideNotFirstLevelMenu();
            });

            /*解析模版内的控件*/
            $('script[type="text/html"],script[type="text/template"]').each(function () {
                var currTemplate = $(this);
                var htmlStr = '<div>' + currTemplate.html().replace(/\s+|\n/g, " ").replace(/>\s</g, "><").ptrimHeadTail() + '</div>';
                var htmlTarget = $(htmlStr);
                htmlTarget.prender();
                currTemplate.html(htmlTarget.html());
            });

            /*旧版，根据页面上的p-create特性来创建控件*/
            jqBody.find('[' + pt.persagyCreateType + ']').each(function () {
                var objType = pt.getTypeByPcreate(this);
                pt.createControl(objType.controlType, objType.childType, this, null);
            });

            /*新版，根据页面上的控件标签来创建控件*/
            $(document.body).prender();
        });
    };

    render();
    Object.freeze(persagy_control);
}();
;(function () {
    var pel = persagyElement.getInstance();
    var pt = persagy_tool.getInstance();

    /*HTMLElement、jQuery的扩展所调用的方法*/
    function ceExFn(funName, fun) {
        return (function (fnName, fn) {
            return function () {
                var domTarget = ptool.getDomElement(this);
                var controlInstance = pt.getInstanceFromDom(domTarget);
                while (controlInstance === false) {
                    domTarget = $(domTarget).children()[0];
                    if (!domTarget) break;
                    controlInstance = pt.getInstanceFromDom(domTarget);
                }
                if (!controlInstance && typeof fn != 'function') return false;
                if (controlInstance && typeof controlInstance[fnName] == 'function') {
                    new Array().unshift.call(arguments, domTarget);
                    return controlInstance[fnName].apply(controlInstance, arguments);
                }
                if (typeof fn == 'function') return fn.apply(this, arguments);
                return false;
            };
        })(funName, fun);
    };

    var objFn = pel.extendFn;
    for (var fnName in objFn) {
        if (objFn.hasOwnProperty(fnName) === false) continue;
        var fnV = objFn[fnName];
        var newFnV = ceExFn(fnName, fnV);
        HTMLElement.prototype[fnName] = newFnV;
        if (jQuery) jQuery.fn[fnName] = newFnV;
    };

    /*用以解决，在绑定vue的顶级属性时，model找不到的错误*/
    window.model = {};
    /*
    *window上追加此方法，作为knockout、vue绑定事件时的唯一方法，在此方法内再去调用控件创建者想绑定的方法
    *因此决定了，创建控件时，若bind为true 那么控件的事件的回调函数必须是全局的
    */
    window[pt.pbindEventFnName] = function (model, event) {
        eventExecute(model, event);
    };

    /*
    *window上追加此方法，作为控件库控件注册事件时的唯一方法，在此方法内再去调用控件创建者想绑定的方法
    *因此决定了，创建控件时，若bind为false 那么控件的事件的回调函数必须是全局的
    */
    window[pt.pstaticEventFnName] = function (event) {
        eventExecute(null, event);
    };

    function eventExecute(model, event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        var srcElement = event.srcElement || event.target;
        event.srcElement = event.target = srcElement;
        var currTarget = event.currentTarget;
        var controlInstance = pt.getInstanceFromDom(currTarget);
        var eachIndex = 0;
        while (!controlInstance) {
            ++eachIndex;
            if (eachIndex > 100) break;
            currTarget = $(currTarget).parent()[0];
            controlInstance = pt.getInstanceFromDom(currTarget);
        }
        if (!controlInstance) return;
        event[pt.eventCurrTargetName] = currTarget;
        controlInstance.eventHandout(model, event);
    };
})();
;﻿function pbutton_template() {
    this.constructor = arguments.callee;
    this.start = '<div ' + this.ptool.maxDivMarker + ' {{id}}{{disabled}}{{click}}{{mousedown}}{{mouseup}}{{mouseover}}{{mouseout}}{{mouseenter}}{{mouseleave}}{{mousewheel}} class="';

    /*文本、图标按钮，带边框*/
    this.textIconEnd = '"><i {{icon}} class="per-bIcon"></i><em {{text}}{{title}}></em></div>';
    this.white = this.start + 'per-button-grayBorder' + this.textIconEnd;
    this.blue = this.start + 'per-button-grayBg' + this.textIconEnd;
    this.borderred = this.start + 'per-button-redBorder' + this.textIconEnd;
    this.backred = this.start + 'per-button-redBg' + this.textIconEnd;

    /*纯文本，带边框*/
    this.textEnd = '"{{title}}><em {{text}}></em></div>';
    this.whiteText = this.start + 'per-button-grayBorder' + this.textEnd;
    this.blueText = this.start + 'per-button-grayBg' + this.textEnd;
    this.borderredText = this.start + 'per-button-redBorder' + this.textEnd;
    this.backredText = this.start + 'per-button-redBg' + this.textEnd;

    /*纯图标，带边框--矩形*/
    this.iconEnd = '"{{title}}><i {{icon}}></i></div>';
    this.whiteIconRectangle = this.start + 'per-squarebutton-grayBorder' + this.iconEnd;
    this.blueIconRectangle = this.start + 'per-squarebutton-grayBg' + this.iconEnd;
    this.borderredIconRectangle = this.start + 'per-squarebutton-redBorder' + this.iconEnd;
    this.backredIconRectangle = this.start + 'per-squarebutton-redBg' + this.iconEnd;

    /*纯图标，带边框--圆形*/
    this.whiteIconEllipse = this.start + 'per-iconbutton-grayBorder' + this.iconEnd;
    this.blueIconEllipse = this.start + 'per-iconbutton-grayBg' + this.iconEnd;
    this.borderredIconEllipse = this.start + 'per-iconbutton-redBorder' + this.iconEnd;
    this.backredIconEllipse = this.start + 'per-iconbutton-redBg' + this.iconEnd;


    /*无边框，纯文本、纯图标、文本加图标 三种，样式一样*/
    /*无边框--图标加文本*/
    this.whiteNoBorder = this.start + 'per-noBorderButton-white' + this.textIconEnd;
    this.blueNoBorder = this.start + 'per-noBorderButton-gray' + this.textIconEnd;
    this.borderredNoBorder = this.backRedNoBorder = this.start + 'per-noBorderButton-red' + this.textIconEnd;

    /*无边框--纯文本*/
    this.whiteTextNoBorder = this.start + 'per-noBorderButton-white' + this.textEnd;
    this.blueTextNoBorder = this.start + 'per-noBorderButton-gray' + this.textEnd;
    this.borderredTextNoBorder = this.backRedNoBorder = this.start + 'per-noBorderButton-red' + this.textEnd;

    /*无边框--纯图标*/
    this.whiteIconNoBorder = this.start + 'per-noBorderButton-white' + this.iconEnd;
    this.blueIconNoBorder = this.start + 'per-noBorderButton-gray' + this.iconEnd;
    this.redIconNoBorder = this.start + 'per-noBorderButton-red' + this.iconEnd;
};

pbutton_template.prototype = new persagyElement();
;/*api
@class pbutton 按钮
@mainattr text
@child 子类型
* white
* blue
* borderred
* backred
* menumain 带一个常用操作的菜单按钮
* menuminor 不带常用操作的菜单按钮
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* disabled 是否禁用，默认false boolean
* text 按钮上的文本 string
* title 提示文本 string
* icon 按钮上的图标 string
* isborder 是否带边框，默认true boolean
* shape 形状，只在纯图标按钮时生效，默认矩形，可能的值包括：rectangle(矩形)、ellipse(椭圆) enum rectangle、ellipse
* placeholder 头部提示文本，针对menumain、menuminor类型，需放到header标签上 string
* orientation 菜单弹出方向，针对menumain、menuminor类型，支持2个值：up、down 默认down string
* align 横向对齐方式，针对menumain、menuminor类型，支持2个值：left、right 默认left string
* datasource  菜单项的数据源名称，针对menumain、menuminor类型，需放到item标签上 string
* text 选项显示的值对应的属性名称，针对menumain、menuminor类型，需放到item标签上 string
* icon 选项前的图标对应的属性名称，针对menumain、menuminor类型，需放到item标签上 string
@event 事件
* click 点击
* mousedown 鼠标按下
* mouseup 鼠标起来
* mouseover 鼠标悬浮
* mouseout 鼠标离开，离开子元素也会触发
* mouseenter 鼠标进入
* mouseleave 鼠标离开，离开子元素不会触发
* mousewheel 鼠标滚轮事件
* sel 选项选择事件，针对menumain、menuminor类型
* beforesel 选项选择前触发事件，针对menumain、menuminor类型，如果回调函数返回false，选项不会改变，且不会触发sel事件
@css 样式，暂不支持
@function 方法
* pdisable(disabled) 启用或禁用按钮。#param:disabled:boolean:为true时禁用，false启用
* psel(indexOrText,isEvent) 获取或选择某选项，针对menumain、menuminor类型，不传参数时为获取当前选择项#param:indexOrText:int | string:为数字时，代表选项的索引；为字符串时代表选项的显示值:isEvent:boolean:是否激发事件，默认true
api*/
function pbutton() {
    this.constructor = arguments.callee;
};
pbutton.prototype = new pbutton_template();

/*构造html*/
pbutton.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;
    if (childType == this.controlTypes.pbutton.types[4] || childType == this.controlTypes.pbutton.types[5]) {
        return new pcombobox().init(childType, objBind, jqElement);
    }

    attr.isborder = attr.isborder === false ? false : true;
    attr.shape = attr.shape || this.ptool.shape.rectangle;

    var templatePrefix = childType;
    var templateMiddStr = attr.text && attr.icon ? '' :
                        attr.text && !attr.icon ? 'Text' :
                        attr.icon && !attr.text ? 'Icon' : '';
    var templateSuffix = attr.isborder == false ? 'NoBorder' :
                        attr.text ? '' :
                        attr.icon && attr.shape === this.ptool.shape.rectangle ? 'Rectangle' :
                        attr.icon && attr.shape === this.ptool.shape.ellipse ? 'Ellipse' : '';
    var templateName = templatePrefix + templateMiddStr + templateSuffix;
    var templateStr = this[templateName];

    this.renderView(templateStr, this.controlTypes.pbutton.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
pbutton.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);
    var titleSourceTarget = jqElement.find('em');
    titleSourceTarget = titleSourceTarget.length > 0 ? titleSourceTarget : jqElement;
    jqElement.registerEventForTitle(titleSourceTarget, this.ptool.titleSourceAttr);
    if (attr.isborder === false) {
        if (attr.text && attr.icon) {
            jqElement.registerEventForColorChange(jqElement.find('i'), 1);
            jqElement.registerEventForColorChange(jqElement.find('em'), 1);
        } else jqElement.registerEventForColorChange(null, 1);
    } else jqElement.registerEventForColorChange(null, 0);
    if (attr.bind === true) return;
    for (var eventName in event) {
        if (event.hasOwnProperty(eventName) == false) continue;
        this.createEvent(jqElement, this.controlTypes.pbutton.name, eventName, window[this.ptool.pstaticEventFnName]);
    }
};
;﻿function pswitch_template() {
    this.constructor = arguments.callee;
    this.selCss = {
        checkbox: 'per-checkbox-checked',
        radio: 'per-radio-checked',
        slide: 'per-slide-checked'
    };

    this.start = '<div ' + this.ptool.maxDivMarker + ' {{id}}{{title}}{{disabled}}{{click}}{{mousedown}}{{mouseup}}{{mouseover}}{{mouseout}}{{mouseenter}}{{mouseleave}} class="';

    /*复选框*/
    this.checkbox = this.start + 'per-switch-checkbox">';
    this.checkboxSpan1 = '<span class="per-checkbox_input';
    this.checkboxSpan2 = '"></span>';
    this.checkbox3 = '<span class="per-switch_label"{{text}}></span></div>';

    /*单选框*/
    this.radio = this.start + 'per-switch-radio"{{name}}>';
    this.radioSpan1 = '<span class="per-radio_input';
    this.radioSpan2 = '"></span>';
    this.radio3 = '<span class="per-switch_label" {{text}}></span></div>';


    /*滑动开关*/
    this.slide = this.start + 'per-switch-slide">';
    this.slideSpan1 = '<span class="per-slide-Bg';
    this.slideSpan2 = '"></span>';
    this.slide3 = '<span class="per-switch_round"></span></div>';
};

pswitch_template.prototype = new persagyElement();

pswitch_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    var selCssName = this.selCss[childType];
    if (attr.bind !== true) {
        var selCssStr = attr.state === true ? ' ' + selCssName : '';
        return this[childType] + this[childType + 'Span1'] + selCssStr + this[childType + 'Span2'] + this[childType + '3'];
    }
    var newAppend = '';
    var spanStr = this[childType + 'Span1'] + this[childType + 'Span2'];
    if (attr.state) {
        var cssObj = {};
        cssObj[selCssName] = attr.state;
        spanStr = this.createStyleBind(spanStr, cssObj);
    }
    return this[childType] + spanStr + this[childType + '3'];
};
;/*api
@class pswitch 开关
@mainattr 
@child 子类型
* checkbox
* radio
* slide
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* disabled 是否禁用，默认false boolean
* text 控件上的文本 string
* name 用于单选按钮分组
* title 提示文本 string
* state 默认是否选中 boolean
@event 事件
* click 点击
* mousedown 鼠标按下
* mouseup 鼠标起来
* mouseover 鼠标悬浮
* mouseout 鼠标离开，离开子元素也会触发
* mouseenter 鼠标进入
* mouseleave 鼠标离开，离开子元素不会触发
* mousewheel 鼠标滚轮事件
* change 状态改变事件，只有状态改变了才会触发
* beforechange 状态改变前触发事件，如果回调函数返回false 则不会改变状态，且不会触发change事件
@css 样式
@function 方法
* pdisable(disabled) 启用或禁用控件。#param:disabled:boolean:为true时禁用，false启用
* psel(state,isEvent) 设置开关状态，不传参数时，该方法返回当前控件的状态#param:state:boolean:状态，为true时打开，否则关闭:isEvent:boolean:是否激发事件，默认true
* ptoggle(isEvent) 开关状态轮换#param:isEvent:boolean:是否激发事件，默认true
api*/
function pswitch() {
    this.constructor = arguments.callee;
};
pswitch.prototype = new pswitch_template();

/*构造html*/
pswitch.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css || {};
    var templateStr = this.getTemplateStr(objBind, childType);

    this.renderView(templateStr, this.controlTypes.pswitch.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件，至少要有click事件以改变其选中态*/
pswitch.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);
    if (attr.bind === false)
        this.createEvent(jqElement, this.controlTypes.pswitch.name, 'click', window[this.ptool.pstaticEventFnName]);

    var titleSourceTarget = jqElement.find('span:last');
    jqElement.registerEventForTitle(titleSourceTarget, this.ptool.titleSourceAttr);
    jqElement.registerEventForColorChange(jqElement.find('span:first'), 0);

    if (attr.bind === true) return;
    for (var eventName in event) {
        if (event.hasOwnProperty(eventName) == false) continue;
        if (eventName == 'click') continue;
        this.createEvent(jqElement, this.controlTypes.pswitch.name, eventName, window[this.ptool.pstaticEventFnName]);
    }
};

/*事件的处理*/
pswitch.prototype.eventHandout = function (model, event) {
    var domTarget = event.currentTarget;
    var jqElement = $(domTarget);

    var _id = jqElement.attr(this.ptool.libraryIdToHtml);
    var objBind = pswitch[_id];

    var attr=objBind.attr;
    var orginEvent = objBind.event || {};
    var eventName = event.type;

    var typeObj = this.ptool.getTypeAndChildTypeFromEle(domTarget);
    var selCss = this.selCss[typeObj.childType];
    var selCssToElement = jqElement.find('span').eq(0);
    var currState = selCssToElement.hasClass(selCss) ? true : false;

    event = this.ptool.appendProToEvent(event, { state: currState });

    if (eventName == 'click') {
        var beforeChangeFn = orginEvent.beforechange;
        var beforeResult = true;
        if (beforeChangeFn) {
            beforeResult = this.executeEventCall(model, event, beforeChangeFn);
        }
        if (beforeResult !== false) {
            var isToSel = true;
            if (typeObj.childType == this.controlTypes.pswitch.types[1]) {
                if (currState == false) {
                    this.pgroupSelToClear(domTarget);
                } else isToSel = false;
            }
            if (isToSel) {
                this.psetSelState(domTarget, selCssToElement, selCss);
                currState = selCssToElement.hasClass(selCss) ? true : false;
                event = this.ptool.appendProToEvent(event, { state: currState });
                if (model && attr.state) model[attr.state] = currState;
                var changeFn = orginEvent.change;
                if (changeFn) this.executeEventCall(model, event, changeFn);
            }
        }
    }

    var eventFn = orginEvent[eventName];
    if (!eventFn) return;
    this.executeEventCall(model, event, eventFn);
};

/*单选按钮的时候，清除同组的单选按钮的选中状态*/
pswitch.prototype.pgroupSelToClear = function (element) {
    var domTarget = ptool.getDomElement(element);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(domTarget);
    var selCss = this.selCss[typeObj.childType];
    var groupName = $(element).attr('name');
    $('[name="' + groupName + '"]').find('span').removeClass(selCss);
};

/*给元素加选中态*/
pswitch.prototype.psetSelState = function (domTarget, selCssToJqElement, selCss) {
    domTarget[pconst.targetHoverCssSourcePro] = [];
    selCssToJqElement.css('backgroundColor', '');
    selCssToJqElement.toggleClass(selCss);
};

/*设置开关状态，不传参数时，该方法返回当前控件的状态
*state boolean 状态
*isEvent boolean 是否激发事件，默认true
*/
pswitch.prototype.psel = function (state, isEvent) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(ele);
    var selCss = this.selCss[typeObj.childType];
    var selCssToElement = jqEle.find('span').eq(0);
    var currState = selCssToElement.hasClass(selCss) ? true : false;
    if (arguments.length == 1) return currState;

    state = arguments[1];
    isEvent = arguments[2];
    isEvent = isEvent === false ? false : true;
    if (currState === state) return currState;
    if (isEvent) return ele.click();

    switch (state) {
        case true:
            if (typeObj.childType == this.controlTypes.pswitch.types[1]) this.pgroupSelToClear(ele);
            this.psetSelState(ele, selCssToElement, selCss);
            break;
        case false:
            if (typeObj.childType == this.controlTypes.pswitch.types[1]) return currState;
            selCssToElement.removeClass(selCss);
            break;
    }
};

/*开关状态轮换
*isEvent boolean 是否激发事件，默认true
*/
pswitch.prototype.ptoggle = function (isEvent) {
    var ele = arguments[0];
    isEvent = arguments[1];

    var jqEle = $(ele);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(ele);
    var selCss = this.selCss[typeObj.childType];
    var selCssToElement = jqEle.find('span').eq(0);
    var nextState = selCssToElement.hasClass(selCss) ? false : true;
    this.psel(ele, nextState, isEvent);
};
;﻿function pnotice_template() {
    this.constructor = arguments.callee;
    this.messCss = {
        success: ['per-notice-success', 'per-notice_successicon'],
        failure: ['per-notice-failure', 'per-notice_failureicon']
    };

    this.message = '<div ' + this.ptool.maxDivMarker + ' class="per-notice-common" {{id}}><i>Z</i><em></em></div>';
    this.nodata = '<div ' + this.ptool.maxDivMarker + ' {{id}} class="per-prompt-abnormalmess"><span class="per-prompt_icon"></span>' +
                '<span class="per-prompt_title" {{text}}></span><span class="per-prompt_subtitle" {{subtitle}}></span></div>';
};

pnotice_template.prototype = new persagyElement();
;/*api
@class pnotice 通知
@mainattr 
@child 子类型
* message 消息通知
* nodata 无数据的页面提示
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* text nodata类型的主标题 string
* subtitle nodata类型的副标题 string
@event 事件
@css 样式
@function 方法
* pshow(objParam) 显示控件。#param:objParam:object:示例：{text:'nodata类型的主标题或者message类型的提示文本',subTitle:'副标题，只对nodata类型的才有效',state:'状态，只对message类型的才有效，可能的值包括：success、failure，默认success'}
* phide() 隐藏控件，只对nodata类型的才有效
api*/
function pnotice() {
    this.constructor = arguments.callee;
    this.timeoutTime = 2000;
    this.showCss = { name: 'margin-top', value: '0px' };
    this.hideCss = { name: 'margin-top', value: '-70px' };
};
pnotice.prototype = new pnotice_template();

/*构造html*/
pnotice.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css || {};

    var templateStr = this[childType];
    this.renderView(templateStr, this.controlTypes.pnotice.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
pnotice.prototype.rendered = function (element, objBind, childType) { };


/*显示控件
*objParam object类型，{
    text:'nodata类型的主标题或者message类型的提示文本',
    subTitle:'副标题，只对nodata类型的才有效',
    state:'状态，只对message类型的才有效，可能的值包括：success、failure，默认success'
}
*/
pnotice.prototype.pshow = function (objParam) {
    if (arguments.length == 1) return;
    var _this = this;
    var ele = arguments[0];
    objParam = arguments[1] || {};
    var jqEle = $(ele);
    var typeObj = _this.ptool.getTypeAndChildTypeFromEle(ele);
    if (typeObj.childType == _this.controlTypes.pnotice.types[0]) {
        var cssArr = _this.messCss[objParam.state || _this.ptool.pcontrolState.success] || [];
        var clearCss = _this.messCss[_this.ptool.pcontrolState.success][0] + ' ' + _this.messCss[_this.ptool.pcontrolState.failure][0];
        jqEle.removeClass(clearCss);
        jqEle.addClass(cssArr[0] || '');

        clearCss = _this.messCss[_this.ptool.pcontrolState.success][1] + ' ' + _this.messCss[_this.ptool.pcontrolState.failure][1];
        var fontEle = jqEle.find('i');
        fontEle.removeClass(clearCss);
        fontEle.addClass(cssArr[1] || '');

        jqEle.find('em').text(objParam.text || '');

        var libraryToProObj = ele[_this.ptool.libraryToPro] || {};
        var timer = libraryToProObj[_this.ptool.timerNameToElement];
        if (timer) clearTimeout(timer);

        jqEle.css(_this.showCss.name, _this.showCss.value);
        libraryToProObj[_this.ptool.timerNameToElement] = setTimeout(function () {
            jqEle.css(_this.hideCss.name, _this.hideCss.value);
        }, _this.timeoutTime)
    } else {
        var spans = jqEle.find('span');
        if (objParam.text)
            spans.eq(1).text(objParam.text);
        if (objParam.subTitle)
            spans.eq(2).text(objParam.subTitle);
        jqEle.show();
    }
};

/*隐藏控件，只对nodata类型的才有效*/
pnotice.prototype.phide = function () {
    var ele = arguments[0];
    var jqEle = $(ele);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(ele);
    if (typeObj.childType == this.controlTypes.pnotice.types[0]) return;
    jqEle.hide();
};
;﻿function ploading_template() {
    this.constructor = arguments.callee;

    this.global = '<div ' + this.ptool.maxDivMarker + ' class="per-loading-overall" {{id}}><div class="loading-con">' +
                  '<div class="per-loading-overall_pic"></div>' +
                  '<div class="per-loading-overall_text" {{text}}></div></div></div>';

    this.part = '<div ' + this.ptool.maxDivMarker + ' class="per-loading-nomal" {{id}}><div class="loading-con">' +
                '<div class="per-loading-nomal_pic"></div>' +
                '<div class="per-loading-nomal_text" {{text}}></div></div></div>';
};

ploading_template.prototype = new persagyElement();
;/*api
@class ploading 加载提示
@mainattr 
@child 子类型
* global 全局loading
* part 局部loading
@attr 属性
* id 控件ID string
* text loading提示文本 string
@event 事件
@css 样式
@function 方法
* pshow(text) 显示控件。#param:objParam:text:提示文本
* phide() 隐藏控件
api*/
function ploading() {
    this.constructor = arguments.callee;
};
ploading.prototype = new ploading_template();

/*构造html*/
ploading.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css || {};

    var templateStr = this[childType];
    this.renderView(templateStr, this.controlTypes.ploading.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
ploading.prototype.rendered = function (element, objBind, childType) { };


/*显示控件
*text 提示文本
*/
ploading.prototype.pshow = function (text) {
    var _this = this;
    var ele = arguments[0];
    text = arguments[1];
    var jqEle = $(ele);
    if (text) jqEle.find('div').text(text);
    jqEle.show();
};

/*隐藏控件*/
ploading.prototype.phide = function () {
    var ele = arguments[0];
    var jqEle = $(ele);
    jqEle.hide();
};
;﻿function pscroll_template() {
    this.constructor = arguments.callee;
    /*最外围的标记*/
    this.externalDivMarker = 'scrollmax';
    /*滚动区域的标记*/
    this.scrollDivMarker = 'scroll';
    /*滚动区域的父级标记*/
    this.scrollDivParentMarker = 'scrollparent';
    /*横向滚动条父级的标记*/
    this.horizontalDivMarker = 'horizontal';
    /*横向滚动条标记*/
    this.horizontalBarMarker = 'horizontalbar';
    /*竖向滚动条父级的标记*/
    this.verticalDivMarker = 'vertical';
    /*竖向滚动条的标记*/
    this.verticalBarMarker = 'verticalbar';

    this.small = '<div ' + this.ptool.maxDivMarker + ' class="per-scrollbar" ' + this.externalDivMarker +
                '{{id}}><div class="per-scrollbar_wrap"' + this.scrollDivParentMarker +
                '><div class="per-scrollbar_actual" ' + this.scrollDivMarker + '{{templateid}}></div></div>' +
                '<div class="per-scrollbar__bar per-is-horizontal" ' + this.horizontalDivMarker + '>' +
                '<div class="per-scrollbar__thumb" ' + this.horizontalBarMarker + '></div></div>' +
                '<div class="per-scrollbar__bar per-is-vertical" ' + this.verticalDivMarker + '>' +
                '<div class="per-scrollbar__thumb" ' + this.verticalBarMarker + '></div></div></div>';
};

pscroll_template.prototype = new persagyElement();
;/*api
@class pscroll 滚动面板
@mainattr 
@child 子类型
* small 小滚动条
@attr 属性
* id 控件ID string
* templateid 滚动面板内显示的内容的模版ID string
@event 事件
* scroll 滚动事件
@css 样式
@function 方法
* psetScroll(scrollValue,type) 设置滚动距离。#param:scrollValue:number:滚动距离:type:string:滚动方式，horizontal 横向滚动；vertical 竖向滚动（默认）
api*/
function pscroll() {
    this.constructor = arguments.callee;
};
pscroll.prototype = new pscroll_template();

/*构造html*/
pscroll.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css || {};
    attr.bind = false;

    var templateStr = this[childType];
    this.renderView(templateStr, this.controlTypes.pscroll.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
pscroll.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);

    /*滚动区域div*/
    var scrollDiv = jqElement.find('[' + this.scrollDivMarker + ']');
    /*滚动区域父级div*/
    var scrollParentDiv = jqElement.find('[' + this.scrollDivParentMarker + ']');
    /*横向滚动条父级div*/
    var horizontalDiv = jqElement.find('[' + this.horizontalDivMarker + ']');
    /*竖向滚动条父级div*/
    var verticalDiv = jqElement.find('[' + this.verticalDivMarker + ']');

    /*鼠标进入时判断是否显示滚动条*/
    this.createEvent(jqElement, this.controlTypes.pscroll.name, 'mouseenter', this.setEventCall(element));
    /*鼠标离开时隐藏滚动条*/
    this.createEvent(jqElement, this.controlTypes.pscroll.name, 'mouseleave', this.setEventCall(element));
    /*滚动事件*/
    this.createEvent(scrollParentDiv, this.controlTypes.pscroll.name, 'scroll', this.setEventCall(element));
    /*横向滚动条父级点击事件*/
    this.createEvent(horizontalDiv, this.controlTypes.pscroll.name, 'click', this.setEventCall(element));
    /*竖向滚动条父级点击事件*/
    this.createEvent(verticalDiv, this.controlTypes.pscroll.name, 'click', this.setEventCall(element));
};

/*事件的处理*/
pscroll.prototype.eventHandout = function (model, event) {
    var domTarget = event.currentTarget;
    var jqElement = $(domTarget);
    var _this = this;
    if (event.type == 'mouseenter') {
        _this.setClientSize(jqElement);
        _this.setScrollbarSize(jqElement);
    }
    var _id = jqElement.attr(_this.ptool.libraryIdToHtml);
    var objBind = pscroll[_id];

    var orginEvent = objBind.event || {};
    var eventName = event.type;

    /*滚动区域div*/
    var scrollDiv = jqElement.find('[' + _this.scrollDivMarker + ']');
    /*滚动区域父级div*/
    var scrollParentDiv = jqElement.find('[' + _this.scrollDivParentMarker + ']');
    /*横向滚动条父级div*/
    var horizontalDiv = jqElement.find('[' + _this.horizontalDivMarker + ']');
    /*横向滚动条div*/
    var horizontalBarDiv = jqElement.find('[' + _this.horizontalBarMarker + ']');
    /*竖向滚动条父级div*/
    var verticalDiv = jqElement.find('[' + _this.verticalDivMarker + ']');
    /*竖向滚动条div*/
    var verticalBarDiv = jqElement.find('[' + _this.verticalBarMarker + ']');

    var clientWidth = jqElement.width();
    var scrollWidth = scrollDiv.width();
    var maxScrollLeft = scrollWidth - clientWidth;

    var clientHeight = jqElement.height();
    var scrollHeight = scrollDiv.height();
    var maxScrollTop = scrollHeight - clientHeight;

    switch (eventName) {
        case 'scroll':
            _this.setClientSize(jqElement);
            _this.setScrollbarSize(jqElement);
            scrollEvent();
            break;
        case 'mouseenter':
            if (maxScrollTop > 0) verticalDiv.show();
            if (maxScrollLeft > 0) horizontalDiv.show();
            if (orginEvent.mouseenter)
                _this.executeEventCall(null, event, orginEvent.mouseenter);
            break;
        case 'mouseleave':
            verticalDiv.hide();
            horizontalDiv.hide();
            if (orginEvent.mouseleave)
                _this.executeEventCall(null, event, orginEvent.mouseleave);
            scrollParentDiv.width('');
            scrollParentDiv.height('');
            break;
    }

    function scrollEvent() {
        var scrollTop = 0, scrollLeft = 0;
        if (maxScrollTop > 0) {
            scrollTop = scrollParentDiv.scrollTop();
            var translateY = Math.division(scrollTop, clientHeight);
            translateY = Math.multiplication(translateY, 100);
            verticalBarDiv.css({ transform: ' translateY(' + translateY + '%)' });
        }

        if (maxScrollLeft > 0) {
            scrollLeft = scrollParentDiv.scrollLeft();
            var translateX = Math.division(scrollLeft, clientWidth);
            translateX = Math.multiplication(translateX, 100);
            horizontalBarDiv.css({ transform: ' translateX(' + translateX + '%)' });
        }

        if (orginEvent.scroll) {
            event = _this.ptool.appendProToEvent(event, {
                maxScrollTop: maxScrollTop, currScrollTop: scrollTop,
                maxScrollLeft: maxScrollLeft, scrollLeft: scrollLeft
            });
            _this.executeEventCall(null, event, orginEvent.scroll);
        }
    };
};

/*事件的回调函数入口*/
pscroll.prototype.setEventCall = function (element) {
    return (function (_element) {
        return function (event) {
            if (event.stopPropagation)
                event.stopPropagation();
            event.currentTarget = _element;
            window[persagy_tool.getInstance().pstaticEventFnName](event);
        };
    })(element);
};

/*设置滚动距离*/
pscroll.prototype.psetScroll = function (scrollValue, type) {
    var ele = arguments[0];
    scrollValue = arguments[1];
    type = arguments[2] || this.ptool.arrangeType.vertical;

    var jqElement = $(ele);
    var scrollParentDiv = jqElement.find('[' + this.scrollDivParentMarker + ']');
    var scrollFnName = type == this.ptool.arrangeType.vertical ? 'scrollTop' : 'scrollLeft';
    scrollParentDiv[scrollFnName](scrollValue);
};

/*给滚动区域，即可视区域，赋宽、高*/
pscroll.prototype.setClientSize = function (jqEle) {
    var scrollParentDiv = jqEle.find('[' + this.scrollDivParentMarker + ']');
    var clientWidth = jqEle.width();
    var clientHeight = jqEle.height();

    var middlePx = 17;
    var oldScrollParentDivWidth = scrollParentDiv.width();
    var oldScrollParentDivHeight = scrollParentDiv.height();

    if (oldScrollParentDivWidth - clientWidth != middlePx || oldScrollParentDivHeight - clientHeight != middlePx) {
        scrollParentDiv.width(clientWidth + middlePx);
        scrollParentDiv.height(clientHeight + middlePx);
    }
};

/*设置滚动条的大小*/
pscroll.prototype.setScrollbarSize = function (jqElement) {
    /*滚动区域div*/
    var scrollDiv = jqElement.find('[' + this.scrollDivMarker + ']');
    /*横向滚动条div*/
    var horizontalBarDiv = jqElement.find('[' + this.horizontalBarMarker + ']');
    /*竖向滚动条div*/
    var verticalBarDiv = jqElement.find('[' + this.verticalBarMarker + ']');

    /*首先判断要不要显示滚动条*/
    var clientWidth = jqElement.width();
    var clientHeight = jqElement.height();
    var scrollHeight = scrollDiv.height();
    var scrollWidth = scrollDiv.width();
    var old = jqElement[0][this.ptool.libraryToPro] || {};
    old[this.ptool.controlPrivateToProName] = false;
    if (scrollHeight > clientHeight || scrollWidth > clientWidth) {
        old[this.ptool.controlPrivateToProName] = true;
        var scrollBarHeight = Math.division(clientHeight, scrollHeight);
        scrollBarHeight = Math.multiplication(scrollBarHeight, 100);

        var scrollBarWidth = Math.division(clientWidth, scrollWidth);
        scrollBarWidth = Math.multiplication(scrollBarWidth, 100);

        verticalBarDiv.height(scrollBarHeight + '%');
        horizontalBarDiv.width(scrollBarWidth + '%');
    }
    jqElement[0][this.ptool.libraryToPro] = old;
};
;﻿function ptext_template() {
    this.constructor = arguments.callee;
    this.errMarker = 'err';
    this.errTextMarker = 'errtext';
    this.friendlyMarker = 'friendly';
    this.textMarker = 'text';
    this.currCharLengthMarker = 'charlength';
    this.errCss = 'input-error';

    this.start = '<div ' + this.ptool.maxDivMarker + ' {{id}}{{disabled}} class="';
    this.basicTextStart = '"><input type="text" ' + this.textMarker + '{{placeholder}}{{value}}{{focus}}{{blur}}{{click}}{{mousedown}}{{mouseup}}{{mouseover}}{{mouseout}}>';

    this.unitTextStart = '"><div{{text}} class="';
    this.unitTextStart2 = '"></div><div class="';
    this.unitTextStart3 = '"><input type="text" ' + this.textMarker + '{{placeholder}}{{value}}{{focus}}{{blur}}{{click}}{{mousedown}}{{mouseup}}{{mouseover}}{{mouseout}}><div class="per-inputborder"></div></div>';

    this.textareaStart = '"><div class="per-input-textarea"><div class="textareawrap '; /*不带计数器时有后面的类*/
    this.textareaStart2 = '"><textarea ' + this.textMarker + '{{placeholder}}{{value}}{{focus}}{{blur}}{{click}}{{mousedown}}{{mouseup}}{{mouseover}}{{mouseout}}></textarea>' +
                          '<div class="per-textareaborder"></div>';
    this.textareaStart3 = '<div class="per-textarea-length"><b ' + this.currCharLengthMarker + '>0</b>/<b {{text}}></b></div>';        /*带计数器的*/

    this.end = '/div>';     /*不带单位的文本框不需要这个*/
    this.end2 = '<div class="reminder-tip" ' + this.friendlyMarker + '><i>*</i><em {{text}}></em></div>';
    this.end3 = '<div class="error-tip" ' + this.errMarker + '><i>！</i><em ' + this.errTextMarker + '></em></div></div>';

    this.noUnitStartClass = 'per-input-basic';
    this.unitStartClass = 'per-input-unit';
    this.textareaStartClass = 'per-input-textarea';

    this.unitLeftTextStartClass = 'per-inputunitL';
    this.unitRightTextStartClass = 'per-inputunit';

    this.unitLeftTextStartClass2 = 'per-inputwrapR';
    this.unitRightTextStartClass2 = 'per-inputwrap';

    this.textareaLengthStartClass = '';
    this.textareaNoLengthStartClass = 'per-textareawra-nolength';
};

ptext_template.prototype = new persagyElement();

ptext_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    var bind = attr.bind;
    var friendlyObj = attr.friendly || {};
    var remark = attr.text;
    var align = attr.align || this.ptool.align.right;
    var maxLength = attr.maxLength;

    var start = this.start + (childType === this.controlTypes.ptext.types[1] ? this.textareaStartClass : remark ?
                this.unitStartClass : this.noUnitStartClass);

    var middle = '';
    switch (childType) {
        case this.controlTypes.ptext.types[0]:
            if (remark) {
                middle = this.unitTextStart + (align == this.ptool.align.right ? this.unitRightTextStartClass : this.unitLeftTextStartClass) +
                        this.unitTextStart2 + (align == this.ptool.align.right ? this.unitRightTextStartClass2 : this.unitLeftTextStartClass2) +
                        this.unitTextStart3;
            } else middle = this.basicTextStart;
            break;
        case this.controlTypes.ptext.types[1]:
            middle = this.textareaStart + (maxLength ? this.textareaLengthStartClass : this.textareaNoLengthStartClass) +
                    this.textareaStart2 + (maxLength ? this.textareaStart3 : '');
            if (maxLength) attr.text = maxLength;
            break;
    }

    var end1 = childType === this.controlTypes.ptext.types[0] && remark ? this.end : '';
    var end2 = this.end2;
    var end3 = this.end3;

    var fnName = bind === true ? 'joinHtmlToBindByAttrCss' : 'joinHtmlByAttrCss';
    start = this[fnName](start, attr);
    middle = this[fnName](middle, attr, objBind.event);
    end2 = this[fnName](end2, { text: friendlyObj.info });

    return start + middle + end2 + end3;
};
;/*api
@class ptext 文本框，支持多个verify标签
@mainattr text
@child 子类型
* text
* textarea
* combobox 带有可选项的文本框
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* disabled 是否禁用，默认false boolean
* value value值 string
* text 文本框前后显示的备注；combobox类型时为选项显示的值对应的属性名称，需放到item标签上 string
* placeholder 提示文本；当类型为combobox时，需放到header标签上 string
* align 备注文字的对齐方式，默认right；当类型为combobox时，指下拉表横向对齐方式，默认left。支持2个值：left、right string
* orientation 菜单弹出方向，针对combobox类型，支持2个值：up、down 默认down string
* datasource  菜单项的数据源名称，针对combobox类型，需放到item标签上 string
* icon 选项前的图标对应的属性名称，针对combobox类型，需放到item标签上 string
* verifytype  验证类型，需放到verify标签上，可能的值包括：space(空格)、length(最大字符数)、chinese(汉子)、email(邮箱)、idcard(身份证)、negativeint(负整数)、positiveint(正整数)、int(整数)、negativenumber(负数)、positivenumber(正数)、number(数字)、tel(电话号)、mobile(手机号)
* length 可输入的最大字符数，需放到verify标签上 string
* errtip 错误提示，需放到verify标签上 string
* friendlytip 友好提示，需放到tip标签上 string
@event 事件
* click 点击
* mousedown 鼠标按下
* mouseup 鼠标起来
* mouseover 鼠标悬浮
* mouseout 鼠标离开
* mouseenter 鼠标进入
* mouseleave 鼠标离开
* sel 选项选择事件，针对combobox类型
* beforesel 选项选择前触发事件，针对combobox类型，如果回调函数返回false，选项不会改变，且不会触发sel事件
@css 样式，暂不支持
@function 方法
* pdisable(disabled) 启用或禁用按钮。#param:disabled:boolean:为true时禁用，false启用
* pval(value) 获取或设置文本框的值#param:value:string|number:不传参数时，只返回当前文本框的值
* pshowTextTip(errMess) 显示错误提示#param:errMess:string:错误消息
* precover() 恢复初始状态
* pverifi()	某一区域内的所有文本框是否验证通过 返回true验证通过   false未通过
api*/
function ptext() {
    this.constructor = arguments.callee;
};
ptext.prototype = new ptext_template();

/*构造html*/
ptext.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;

    var friendlyJqTarget = jqElement.find('tip');
    attr.friendly = {
        info: friendlyJqTarget.attr('friendlytip')
    };

    var verifyJqTargetArr = jqElement.find('verify');
    var arr = [];
    for (var i = 0; i < verifyJqTargetArr.length; i++) {
        var currVerifyJqTarget = verifyJqTargetArr.eq(i);
        var length = currVerifyJqTarget.attr('length');
        arr.push({
            verifytype: currVerifyJqTarget.attr('verifytype'),
            length: length,
            errtip: currVerifyJqTarget.attr('errtip')
        });
        if (length) attr.maxLength = parseInt(length);
    }
    attr.verify = arr;
    if (childType == this.controlTypes.ptext.types[2]) {
        return new pcombobox().init(this.controlTypes.pcombobox.types[4], objBind, jqElement);
    }
    var templateStr = this.getTemplateStr(objBind, childType);

    this.renderView(templateStr, this.controlTypes.ptext.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
ptext.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);
    /*注册输入框的focus、blur、input事件*/
    var inputTarget = jqElement.find('[' + this.textMarker + ']');
    if (!event.blur)
        this.createEvent(inputTarget, this.controlTypes.ptext.name, 'blur', window[this.ptool.pstaticEventFnName]);
    if (!event.focus)
        this.createEvent(inputTarget, this.controlTypes.ptext.name, 'focus', window[this.ptool.pstaticEventFnName]);
    if (!event.input && childType === this.controlTypes.ptext.types[1] && attr.maxLength)
        this.createEvent(inputTarget, this.controlTypes.ptext.name, 'input', window[this.ptool.pstaticEventFnName]);

    if (attr.bind === true) return;
    for (var eventName in event) {
        if (event.hasOwnProperty(eventName) == false) continue;
        this.createEvent(inputTarget, this.controlTypes.ptext.name, eventName, window[this.ptool.pstaticEventFnName]);
    }
};

/*事件的回调*/
ptext.prototype.eventHandout = function (model, event) {
    var ele = event[this.ptool.eventCurrTargetName];
    var jqEle = $(ele);
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(ele);
    var objBind = ptext[_id];
    var attr = objBind.attr;
    var verifyArr = attr.verify || [];
    var friendlyObj = attr.friendly || {};
    var originEvent = objBind.event;

    var eventName = event.type;
    var setEventFnName = originEvent[eventName];

    var errjqTarget = jqEle.find('[' + this.errMarker + ']');
    var friendlyjqTarget = jqEle.find('[' + this.friendlyMarker + ']');
    var inputTarget = jqEle.find('[' + this.textMarker + ']');
    var currValue = inputTarget.val();
    switch (eventName) {
        case 'focus':
            jqEle.phideTextTip();
            if (friendlyObj.info) friendlyjqTarget.show();
            break;
        case 'blur':
            friendlyjqTarget.hide();
            var verifyResult = jqEle.pverifi();
            if (!verifyResult) {
                errjqTarget.show();
                inputTarget.addClass(this.errCss);
            }
            else {
                errjqTarget.hide();
                inputTarget.removeClass(this.errCss);
            }
            break;
        case 'input':
            if (typeObj.childType === this.controlTypes.ptext.types[1] && attr.maxLength)
                jqEle.find('[' + this.currCharLengthMarker + ']').text(currValue.length);
            break;
    }
    this.executeEventCall(model, event, setEventFnName);
};

/*获取或设置文本框的值
*/
ptext.prototype.pval = function (value) {
    var ele = arguments[0];
    var jqEle = $(ele);
    value = arguments[1];
    var inputJqTarget = jqEle.find('[' + this.textMarker + ']');
    if (value == null) return inputJqTarget.val();
    inputJqTarget.val(value);
};

/*清空值
*/
ptext.prototype.precover = function () {
    var ele = arguments[0];
    var jqEle = $(ele);
    jqEle.pval('');
    jqEle.phideTextTip();
};
;﻿function pcombobox_template() {
    this.ptextTemplate = new ptext();
    this.constructor = arguments.callee;
    this.headerSplitor = ' / ';
    this.comboxMaxHeight = 212;
    this.headerTextMarker = 'cheadertext';
    this.headerIconMarker = 'cheadericon';
    this.headerMarkder = 'cheader';
    this.contentMaxDivMarker = 'con';
    this.contentFlexDivMarker = 'flex';
    this.comboxConMarker = 'cobcon';
    this.contentUlMarker = 'conul';
    this.levelMarker = 'level';
    this.selCss = 'per-pitch';
    this.basicHeaderClassName = 'per-combobox-title';
    this.noborderHeaderClassName = 'per-nobordercombobox-title';
    this.menuHeaderClassName = 'per-combobox-button';
    this.pageComboboxTitleClassName = 'per-paging-combobox_title';
    this.orientationCss = {
        up: '_combobox_top',
        down: '_combobox_bottom'
    };
    this.alignCss = {
        left: '_combobox_left',
        right: '_combobox_right'
    };

    this.contentExtenDivStart = '<div class="per-combobox-wrap';
    this.contentExtenDivStart2 = '" style="display: none;" ' + this.contentMaxDivMarker + '><div class="_combobox_flex" ' + this.contentFlexDivMarker + '>';
    this.contentDivStartStr1 = '<div class="per-combobox-con " style="display: inline-block;" ' +
                    this.comboxConMarker + ' ' + this.levelMarker + '="';
    this.contentDivStartStr2 = '>';
    this.contentDivEndStr = '</div>';
    this.contentUlStartStr = '<ul ' + this.contentUlMarker + '>';
    this.contentUlEndStr = '</ul>';
    this.itemTemplateStr1 = '<li class="per-combobox_item ';
    this.itemLiTemplateStr2_ = '" ' + this.levelMarker + '="';
    this.itemLiTemplateStr2 = '>';
    this.itemIconTemplateStr = '<span class="per-combobox_item_icon"{{text}}></span>';
    this.itemTextTemplateStr = '<b {{text}}></b>';
    this.itemTemplateStr2 = '<i class="';
    this.itemTemplateStr4 = '>';
    this.itemTemplateStr3 = '</i></li>';

    this.start = '<div ' + this.ptool.maxDivMarker + ' class="per-combobox-basic';
    this.end1 = '" {{id}}{{disabled}}><div ';
    this.end3 = this.headerMarkder + ' class="';
    this.endMiddle = '"><span class="';
    this.endMiddle4 = '" ' + this.headerTextMarker;
    this.endMiddle5 = '></span><span class="';
    this.endMiddle2 = '">';
    this.endMiddle3 = '</span></div>';
    this.errStr = '<div class="error-tip" ' + this.ptextTemplate.errMarker + '><i>！</i><em ' + this.ptextTemplate.errTextMarker + '{{text}}></em></div>';
    this.tipStr = '';
    this.end2 = '</div></div>';
    this.end2_ = '</div>';
    this.selIcon = {
        sel: 'Z', nextItem: '>'
    };
    this.itemTemplateClass = {
        'Z': 'per-combobox_item_iconR',
        '>': 'per-combobox_level_iconR'
    };
};

pcombobox_template.prototype = new persagyElement();

pcombobox_template.prototype.getTemplateStr = function (childType, objBind) {
    var attr = objBind.attr;
    var itemObj = attr.item;
    var verifyObj = attr.verify;
    var headerObj = attr.header;
    var friendlyObj = attr.friendly;
    var itemTextName = itemObj.text || '';
    var itemIconName = itemObj.icon || '';
    var isSelToProName = itemObj.pronametoissel;
    var childProName = itemObj.child;
    var conItemStr = '', iconStr = '', textStr = '', selIcon = '';
    var itemSourceStr = itemObj.datasource;

    var end2 = this.end2;
    var errStr = this.errStr;
    var tipStr = this.tipStr;

    var contentExtenDivStart = this.contentExtenDivStart;
    var contentMaxDivCss = ' ' + this.orientationCss[attr.orientation] + ' ' + this.alignCss[attr.align];
    contentExtenDivStart += contentMaxDivCss + ' ' + this.contentExtenDivStart2;

    var endMiddle4 = this.endMiddle4;
    endMiddle4 = attr.bind == true ? this.joinHtmlToBindByAttrCss(endMiddle4, { placeholder: headerObj.placeholder }) : this.joinHtmlByAttrCss(endMiddle4, { placeholder: headerObj.placeholder });
    var end1 = this.end1;
    var endMiddle = this.endMiddle;
    end1 += (childType == this.controlTypes.pcombobox.types[2] ? '' : '{{click}}') + this.end3;
    endMiddle += childType == this.controlTypes.pcombobox.types[2] ? 'per-comboboxButton_name' : 'per-combobox_name';
    endMiddle += endMiddle4 + (childType == this.controlTypes.pcombobox.types[2] ? '{{click}}' : '') + this.endMiddle5;;
    endMiddle += childType == this.controlTypes.pcombobox.types[2] ? 'per-comboboxButton_icon' : 'per-combobox_icon';
    endMiddle += this.endMiddle2 + (childType == this.controlTypes.pcombobox.types[2] ? 'b' : childType == this.controlTypes.pcombobox.types[5] ? '' : 'v') + this.endMiddle3;
    endMiddle += contentExtenDivStart;

    var ptStr = ' ' + this.ptool.libraryTypeToHtml + '="' + this.controlTypes.pcombobox.name + this.ptool.typeSeparator + childType + '"';
    var selIcon;
    var itemTemplateStr2 = this.itemTemplateStr2;
    if (attr.bind !== true) {
        end1 = this.joinHtmlByAttrCss(end1, { id: attr.id, disabled: attr.disabled });
        endMiddle = this.joinHtmlByAttrCss(endMiddle);
        var itemsArr = eval(itemSourceStr) || [];
        conItemStr = this.joinLi(itemsArr, objBind, childType, 1);
        errStr = this.joinHtmlByAttrCss(errStr, { text: verifyObj.errtip });
        tipStr = this.joinHtmlByAttrCss(tipStr, { text: friendlyObj.info });
    } else {
        errStr = this.joinHtmlToBindByAttrCss(errStr, { text: verifyObj.errtip });
        tipStr = this.joinHtmlToBindByAttrCss(tipStr, { text: friendlyObj.info });
        end1 = this.joinHtmlToBindByAttrCss(end1, { id: attr.id, disabled: attr.disabled });
        endMiddle = this.joinHtmlToBindByAttrCss(endMiddle);
        if (childType !== this.controlTypes.pcombobox.types[0] && childType !== this.controlTypes.pcombobox.types[4]) {
            selIcon = '';
            itemTemplateStr2 += '"';
            attr.istree = false;
        }
        else {
            if (attr.istree === false) {
                selIcon = this.selIcon.sel;
                itemTemplateStr2 += this.itemTemplateClass[selIcon] + '"';
            }
            else {
                selIcon = '';
                var bindCssObj = {};
                bindCssObj[this.itemTemplateClass[this.selIcon.sel]] = 'model.' + isSelToProName;
                bindCssObj[this.itemTemplateClass[this.selIcon.nextItem]] = 'model.' + childProName + '&&model.' + childProName + '.length>0';
                itemTemplateStr2 = this.joinHtmlToBindByAttrCss(itemTemplateStr2 + '"' + '{{text}}{{' +
                        this.itemTemplateClass[this.selIcon.sel] +
                    '}}{{' + this.itemTemplateClass[this.selIcon.nextItem] + '}}' + this.itemTemplateStr4,
                     {
                         text: "model." + isSelToProName + "==true?'" + this.selIcon.sel + "':model." + childProName + "&&model." +
                           childProName + ".length>0?'" + this.selIcon.nextItem + "':''"
                     },
                     {}, bindCssObj);
            }
        }

        iconStr = itemIconName ? this.joinHtmlToBindByAttrCss(this.itemIconTemplateStr, { text: itemIconName }, {}, {}) : '';
        textStr = this.joinHtmlToBindByAttrCss(this.itemTextTemplateStr, { text: itemTextName }, {}, {}, true);
        conItemStr = this.itemTemplateStr1 + this.itemLiTemplateStr2_ + '1"{{click}}' +
            (attr.istree === true && childType === this.controlTypes.pcombobox.types[0] ? '{{mouseenter}}' : '')
            + this.itemLiTemplateStr2 +
                    iconStr + textStr + itemTemplateStr2 + (attr.istree === true ? '' : this.itemTemplateStr4) + selIcon + this.itemTemplateStr3;
        conItemStr = this.joinHtmlToBindByAttrCss(conItemStr, {}, {}, {});
        conItemStr = this.createForBind(conItemStr, itemSourceStr);
    };

    var templateStartStr = this.start + end1;
    var headerClassName = childType == this.controlTypes.pcombobox.types[5] ? this.pageComboboxTitleClassName :
                          childType == this.controlTypes.pcombobox.types[2] ? this.menuHeaderClassName :
                          (childType == this.controlTypes.pcombobox.types[0] || childType == this.controlTypes.pcombobox.types[6]) && attr.isborder === false ? this.noborderHeaderClassName :
                          this.basicHeaderClassName;
    var three = this.createDownList(conItemStr, 1);
    end2 += errStr + tipStr + this.end2_;
    switch (childType) {
        case this.controlTypes.pcombobox.types[1]:
            return templateStartStr + headerClassName + endMiddle + this.contentDivStartStr1 + '1"{{templateid}}' + this.contentDivStartStr2 +
              this.contentDivEndStr + end2;
        case this.controlTypes.pcombobox.types[4]:
            var valueStr = '<input type="text"{{value}}{{placeholder}} ' + this.ptextTemplate.textMarker + '><div class="per-inputborder"></div></div></div>';
            valueStr = attr.bind == true ? this.joinHtmlToBindByAttrCss(valueStr, {
                value: attr.value, placeholder: headerObj.placeholder
            }) : this.joinHtmlByAttrCss(valueStr, {
                value: attr.value, placeholder: headerObj.placeholder
            });
            return '<div class="per-input-select" ' + this.ptool.maxDivMarker + '><div class="per-inputcombobox-title" ' + this.headerMarkder + '>' +
            '<div class="per-inputIcon" ' + this.headerIconMarker + '>b</div><div class="per-inputwrap">' +
            valueStr + contentExtenDivStart + three + '</div></div>' + errStr + tipStr + '</div>';
        default:
            return templateStartStr + headerClassName + endMiddle + three + end2;
    }
};

/*非绑定的情况下拼接li*/
pcombobox_template.prototype.joinLi = function (itemsArr, objBind, childType, level, header) {
    var attr = objBind.attr || {};
    var itemObj = attr.item || {};
    var herderObj = attr.header || {};
    var step = itemObj.step;
    var itemTextName = itemObj.text || '';
    var itemIconName = itemObj.icon || '';
    var isSelToProName = itemObj.pronametoissel;
    var childProName = itemObj.child;
    var conItemStr = '';
    var maxLength = childType === this.controlTypes.pcombobox.types[5] ? attr.number || 1 :
                    childType === this.controlTypes.pcombobox.types[6] ? itemObj.end + 1 : itemsArr.length;
    var i = childType === this.controlTypes.pcombobox.types[6] ? itemObj.start : 0;
    for (i; i < maxLength; i++) {
        var currItem = itemsArr[i];
        var textVal = '';
        switch (childType) {
            case this.controlTypes.pcombobox.types[5]:
                textVal = i + 1;
                break;
            case this.controlTypes.pcombobox.types[6]:
                if (!step) {
                    textVal = i;
                    textVal = textVal < 10 ? '0' + textVal : textVal;
                    textVal += herderObj.prefix || '';
                } else textVal = i + '~' + (i + step - 1);
                break;
            default:
                textVal = currItem[itemTextName] || '';
                break;
        }
        var iconStr = itemIconName ? this.joinHtmlByAttrCss(this.itemIconTemplateStr, { text: currItem[itemIconName] || '' }, {}) : '';
        var textStr = this.joinHtmlByAttrCss(this.itemTextTemplateStr, { text: textVal }, {});
        var selIcon = childType !== this.controlTypes.pcombobox.types[0] && childType !== this.controlTypes.pcombobox.types[4] ? '' :
            attr.istree === false ? this.selIcon.sel : currItem[isSelToProName] === true ? this.selIcon.sel :
            currItem[childProName] && currItem[childProName].length > 0 ? this.selIcon.nextItem : '';
        var classNameStr = (this.itemTemplateClass[selIcon] || '') + '"';
        conItemStr += this.itemTemplateStr1 + (!header ? '' : header == currItem[itemTextName] ? this.selCss : '') +
                    this.itemLiTemplateStr2_ + level + '"' + this.itemLiTemplateStr2 + iconStr + textStr + this.itemTemplateStr2 +
                    classNameStr + this.itemTemplateStr4 + selIcon + this.itemTemplateStr3;

        if (childType === this.controlTypes.pcombobox.types[6] && step)
            i = i + step - 1;
    }
    return conItemStr;
};

/*创建下拉表*/
pcombobox_template.prototype.createDownList = function (liStr, level) {
    var conStr = this.contentUlStartStr + liStr + this.contentUlEndStr;
    /*菜单数据改变时，怎么删除被废弃的模版????????????*/
    var templateId = this.ptool.createDynamicTemplate(conStr);
    var jqScrollTarget = $('<div><pscroll-small templateid="' + templateId + '"></pscroll-small></div></div>');
    conStr = jqScrollTarget.html();
    return this.contentDivStartStr1 + level + '"' + this.contentDivStartStr2 + conStr + this.contentDivEndStr;
};

/*针对time型的拼接li*/
pcombobox_template.prototype.joliToTime = function (start, end, prefix) {
    var liStr = '';
    for (var i = start; i <= end; i++) {
        var val = (i < 10 ? '0' + i : i) + (prefix || '');
        var str = this.itemTemplateStr1 + '"' + this.itemLiTemplateStr2 + this.itemTextTemplateStr +
            this.itemTemplateStr2 + '"' + this.itemTemplateStr4 + this.itemTemplateStr3;
        str = this.joinHtmlByAttrCss(str, { text: val });
        liStr += str;
    }
    return liStr;
};
;/*api
@class pcombobox 下拉菜单
@mainattr items
@child 子类型
* normal
* custom
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* disabled 是否禁用，默认false boolean
* isborder 是否带边框，默认true boolean
* orientation 菜单弹出方向，支持2个值：up、down 默认down string
* align 横向对齐方式，支持2个值：left、right 默认left string
* istree 是否是多级菜单
* templateid 自定义内容的模版ID，只对custom类型的才生效 string
* number 总页数，page类型专用 number
* placeholder 头部提示文本，需放到header标签上 string
* prefix 选择选项后，在选项前追加的文本，需放到header标签上 string
* datasource  菜单项的数据源名称，需放到item标签上 string
* text 选项显示的值对应的属性名称，需放到item标签上 string
* icon 选项前的图标对应的属性名称，需放到item标签上 string
* child 下级菜单项的数据源对应的属性名称，需放到item标签上 string
* pronametoissel 判断某项是否可以被选择的属性名称，用于多级菜单的情况，属性值类型为boolean，需放到item标签上 string
* verifytype  验证类型，需放到verify标签上，可能的值包括：space(空格)、length(最大字符数)、chinese(汉子)、email(邮箱)、idcard(身份证)、negativeint(负整数)、positiveint(正整数)、int(整数)、negativenumber(负数)、positivenumber(正数)、number(数字)、tel(电话号)、mobile(手机号)
* errtip 错误提示，需放到verify标签上 string
* friendlytip 友好提示，需放到tip标签上 string
@event 事件
* sel 选项选择事件
* beforesel 选项选择前触发事件，如果回调函数返回false，选项不会改变，且不会触发sel事件
* click 头部点击事件，需放到header标签上
@css 样式
@function 方法
* pdisable(disabled) 启用或禁用控件。#param:disabled:boolean:为true时禁用，false启用
* psel(indexOrText,isEvent) 获取或选择某选项，不传参数时为获取当前选择项#param:indexOrText:int | string:为数字时，代表选项的索引；为字符串时代表选项的显示值:isEvent:boolean:是否激发事件，默认true
* precover(headerText) 恢复初始状态#param:headerText:string:适用于placeholder绑定的时候，否则调用此方法时头部将显示placeholder的值
api*/
function pcombobox() {
    this.constructor = arguments.callee;
};
pcombobox.prototype = new pcombobox_template();

/*构造html*/
pcombobox.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;
    attr.number = attr.number || 1;

    var headerEle = jqElement.find('header');
    attr.header = {
        placeholder: childType === this.controlTypes.pcombobox.types[5] ? 1 + this.headerSplitor + (attr.number || 1) : headerEle.attr('placeholder'),
        prefix: headerEle.attr('prefix'),
        click: headerEle.attr('click')
    };

    var itemEle = jqElement.find('item');
    attr.item = {
        datasource: itemEle.attr('datasource'),
        text: itemEle.attr('text'),
        icon: itemEle.attr('icon'),
        child: itemEle.attr('child'),
        pronametoissel: itemEle.attr('pronametoissel'),
        start: parseInt(itemEle.attr('start')) || 0,
        end: parseInt(itemEle.attr('end')) || 0,
        step: parseInt(itemEle.attr('step')) || 0
    };

    var verifyJqTarget = jqElement.find('verify');
    attr.verify = {
        verifytype: verifyJqTarget.attr('verifytype'),
        errtip: verifyJqTarget.attr('errtip'),
        friendlytip: verifyJqTarget.attr('friendlytip')
    };

    var friendlyJqTarget = jqElement.find('tip');
    attr.friendly = {
        info: friendlyJqTarget.attr('friendlytip')
    };

    attr.isborder = attr.isborder === false ? false : true;
    attr.istree = attr.istree === true ? true : false;
    attr.orientation = attr.orientation ? attr.orientation : this.ptool.orientation.down;
    attr.align = attr.align ? attr.align : this.ptool.align.left;

    var templateStr = this.getTemplateStr(childType, objBind);

    var newJqElement = this.renderView(templateStr, this.controlTypes.pcombobox.name, childType, objBind, jqElement);

};

/*控件渲染后，注册控件内部的静态事件
*每级菜单的click、mouseenter注册在li上*/
pcombobox.prototype.rendered = function (element, objBind) {
    if (!objBind) return;
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqElement);
    var headerJqEle = jqElement.find('[' + this.headerMarkder + ']');

    if (attr.header.placeholder)
        jqElement.find('[' + this.headerTextMarker + ']').text(attr.header.placeholder);


    /*注册头部点击事件*/
    if (attr.bind !== true) {
        if (typeObj.childType !== this.controlTypes.pcombobox.types[2] && typeObj.childType !== this.controlTypes.pcombobox.types[4])
            this.createEvent(headerJqEle, this.controlTypes.pcombobox.name, 'click', window[this.ptool.pstaticEventFnName]);
        else {
            this.createEvent(headerJqEle.find('span:first'), this.controlTypes.pcombobox.name, 'click', window[this.ptool.pstaticEventFnName]);
        }
    }
    switch (typeObj.childType) {
        case this.controlTypes.pcombobox.types[2]:
            this.createEvent(headerJqEle.find('span:last'), this.controlTypes.pcombobox.name, 'click', window[this.ptool.pstaticEventFnName]);
            break;
        case this.controlTypes.pcombobox.types[4]:
            this.createEvent(headerJqEle.find('[' + this.headerIconMarker + ']'), this.controlTypes.pcombobox.name, 'click', window[this.ptool.pstaticEventFnName]);
            break;
    }

    if (typeObj.childType == this.controlTypes.pcombobox.types[1]) return;

    if (typeObj.childType === this.controlTypes.pcombobox.types[4]) {
        var inputTarget = jqElement.find('[' + this.ptextTemplate.textMarker + ']');
        if (!event.blur || attr.bind != true)
            this.createEvent(inputTarget, this.controlTypes.pcombobox.name, 'blur', window[this.ptool.pstaticEventFnName]);
        if (!event.focus || attr.bind != true)
            this.createEvent(inputTarget, this.controlTypes.pcombobox.name, 'focus', window[this.ptool.pstaticEventFnName]);
    }

    this.setScrollSize(jqElement);
    /*jqElement.prender();*/

    var itemObj = attr.item;
    var itemSourceStr = itemObj.datasource;
    var itemsArr = attr.bind === true ? [] : eval(itemSourceStr) || [];
    var _id = jqElement.attr(this.ptool.libraryIdToHtml);
    var ulJqTarget = jqElement.find('[' + this.contentUlMarker + ']');
    this.conUlSet(ulJqTarget, _id, itemsArr, !attr.bind, jqElement.find('[' + this.comboxConMarker + '][' + this.levelMarker + ']'), typeObj.childType);
};

/*头部点击事件的回调*/
pcombobox.prototype.headerClick = function (event) {
    var jqTarget = $(event.currentTarget);
    if (event.currentTarget.tagName == 'SPAN' || $(event.currentTarget).attr(this.headerIconMarker) == '') jqTarget = jqTarget.parent();
    /*当前下拉框*/
    var currComboxTarget = jqTarget.next();
    /*先收起其它所有的下拉框*/
    var otherComboxTargets = $('[' + this.contentMaxDivMarker + ']').not(currComboxTarget).slideUp(200);
    currComboxTarget.toggle(200);
};

/*事件的处理----每项的点击、悬浮事件*/
pcombobox.prototype.eventHandout = function (model, event) {
    if (event.type !== 'mouseover') {
        var currentTarget = event.currentTarget;
        var currentJqTarget = $(currentTarget);
        var maxJqTarget = $(event[this.ptool.eventCurrTargetName]);
        var _id = maxJqTarget.attr(this.ptool.libraryIdToHtml);
        var objBind = pcombobox[_id];
        var attr = objBind.attr;
        var prefix = attr.header.prefix || '';
        var typeObj = this.ptool.getTypeAndChildTypeFromEle(maxJqTarget);

        if (currentTarget.tagName == 'LI') {
            var srcJqEle = $(event.target);
            if (srcJqEle[0].tagName != 'LI') srcJqEle = srcJqEle.parent();
            var srcEle = srcJqEle[0];
            var ulCurrentTarget = srcJqEle.parent();


            var comboxTarget = ulCurrentTarget.parents('[' + this.ptool.libraryIdToHtml + '="' + _id + '"]').eq(0);
            event[this.ptool.eventCurrTargetName] = comboxTarget[0];

            var oldSelText = comboxTarget.find('[' + this.headerTextMarker + ']').text();
            if (prefix) {
                oldSelText = oldSelText.substr(prefix.length);
            }



            var srcEleIndex = srcJqEle.index();
            var currLevel = parseInt(srcJqEle.attr(this.levelMarker) || 1);
            var nextLevel = currLevel + 1;
            var nextLevelTargetSelector = '[' + this.comboxConMarker +
                                    '][' + this.levelMarker + '="' + nextLevel + '"]';
            var currSelItem = attr.bind === true && currLevel === 1 ? model || {} :
                (ulCurrentTarget[0][this.ptool.libraryToPro][this.ptool.controlPrivateToProName] || [])[srcEleIndex] || {};
            model = attr.bind === true ? currSelItem : model;
            var childItem = currSelItem[attr.item.child] || [];
        }

        switch (event.type) {
            case 'focus':
            case 'blur':
                ptext[_id] = objBind;
                return this.ptextTemplate.eventHandout(model, event);
                /*选项选择事件、非menumain类型的头部点击事件、menumain类型的常用按钮点击事件、menumain类型的下拉按钮点击事件*/
            case 'click':
                var headerClickFnName = attr.header.click;
                /*非menumain类型的头部点击事件*/
                if (currentJqTarget.attr(this.headerMarkder) == '') {
                    this.executeEventCall(model, event, headerClickFnName);
                    this.headerClick(event);
                    return;
                }
                /*menumain类型的常用按钮点击事件*/
                if (currentJqTarget.attr(this.headerTextMarker) == '') {
                    this.executeEventCall(model, event, headerClickFnName);
                    return;
                }
                /*menumain类型的下拉按钮点击事件*/
                if (currentTarget.tagName == 'SPAN' && currentJqTarget.attr(this.headerTextMarker) == null) {
                    return this.headerClick(event);
                }
                /*text类型的下拉按钮点击事件*/
                if (currentJqTarget.attr(this.headerIconMarker) == '') {
                    return this.headerClick(event);
                }


                if (attr.istree === true && currSelItem[attr.item.pronametoissel] !== true) return;
                event[this.ptool.eventOthAttribute] = { index: srcEleIndex, currItem: currSelItem };

                if (typeObj.childType === this.controlTypes.pcombobox.types[0] || typeObj.childType === this.controlTypes.pcombobox.types[4]
                        || typeObj.childType === this.controlTypes.pcombobox.types[5] || typeObj.childType === this.controlTypes.pcombobox.types[6]) {
                    if (attr.istree !== true || currSelItem[attr.item.pronametoissel] == true)
                        this.changeSelItem(comboxTarget, srcJqEle, objBind, typeObj.childType);
                };

                if (!comboxTarget.find('[' + this.contentMaxDivMarker + ']').is(':hidden')) {
                    var headerJqEle = comboxTarget.find('[' + this.headerMarkder + ']');
                    headerJqEle[0].click();
                }

                var selFnName = objBind.event.sel;
                var beforeSelFnName = objBind.event.beforesel;
                if (beforeSelFnName) {
                    var beforeSelResult = this.executeEventCall(model, event, beforeSelFnName);
                    if (beforeSelResult === false) return;
                }
                this.executeEventCall(model, event, selFnName);
                break;
                /*多级菜单鼠标悬浮时，显示下级菜单，同时把孙子级及其后面的都给隐藏*/
            case 'mouseenter':
                if (currentTarget.tagName == 'LI') {
                    var pscTarget = ulCurrentTarget.parent().parent().parent()[0];
                    new pscroll().setEventCall(pscTarget)({ type: 'mouseenter' });
                }
                if (attr.istree === false) return;
                var nextNextLevel = nextLevel + 1;
                var nextNextLevelTarget = comboxTarget.find('[' + this.comboxConMarker +
                                '][' + this.levelMarker + '="' + nextNextLevel + '"]');
                while (nextNextLevelTarget.length > 0) {
                    nextNextLevelTarget.hide();
                    nextNextLevel = nextNextLevel + 1;
                    nextNextLevelTarget = comboxTarget.find('[' + this.comboxConMarker +
                                '][' + this.levelMarker + '="' + nextNextLevel + '"]');
                }
                var childConJqTarget = comboxTarget.find(nextLevelTargetSelector);
                if (childItem && childItem.length > 0) {
                    var liItemStr = this.joinLi(childItem, objBind, typeObj.childType, nextLevel, oldSelText);
                    if (childConJqTarget.length > 0) {
                        var childUlJqTarget = childConJqTarget.find('[' + this.contentUlMarker + ']');
                        childUlJqTarget.empty();
                        childUlJqTarget.append(liItemStr);
                    } else {
                        var pscrollJqTargeSelector = '[' + new pscroll_template().externalDivMarker + ']';
                        var setWidth = comboxTarget.find(pscrollJqTargeSelector + ':first').width();
                        comboxTarget.find('[' + this.contentMaxDivMarker + ']').width(setWidth);
                        var conStr = this.createDownList(liItemStr, nextLevel);
                        comboxTarget.find('[' + this.contentFlexDivMarker + ']').append(conStr);
                        this.setScrollSize(comboxTarget);
                        comboxTarget.prender();
                        childConJqTarget = comboxTarget.find(nextLevelTargetSelector);
                    }
                    this.conUlSet(childConJqTarget.find('[' + this.contentUlMarker + ']'), _id, childItem, true, childConJqTarget, typeObj.childType);
                    childConJqTarget.show();
                } else childConJqTarget.hide();
                break;
        }
    }
};

/*获取或选择某选项，不传参数时为获取当前选择项
*indexOrText boolean|string 选项索引或者选项值
*isEvent boolean 是否激发事件，默认true
*/
pcombobox.prototype.psel = function (indexOrText, isEvent) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqEle);
    var objBind = pcombobox[_id];
    var attr = objBind.attr;
    var prefix = attr.header.prefix || '';
    if (arguments.length > 1) {
        indexOrText = arguments[1];
        isEvent = arguments[2];
    } else {
        indexOrText = typeObj.childType == this.controlTypes.pcombobox.types[4] ? jqEle.find('[' + this.ptextTemplate.textMarker + ']').val() :
                    jqEle.find('[' + this.headerTextMarker + ']').text();
        if (prefix && typeObj.childType !== this.controlTypes.pcombobox.types[6]) {
            indexOrText = indexOrText.substr(prefix.length);
        }
        isEvent = false;
    }
    isEvent = isEvent === false ? false : true;
    var liTargets = jqEle.find('[' + this.contentUlMarker + ']').children();
    var selLi, selLiIndex;
    for (var i = 0; i < liTargets.length; i++) {
        var currLi = liTargets.eq(i);
        var currText = currLi.find('b').text();
        if (i === indexOrText || currText === indexOrText) {
            indexOrText = currText;
            selLi = liTargets.eq(i);
            selLiIndex = i;
            break;
        }
    }
    if (!selLi) return false;
    if (isEvent) selLi[0].click();
    else this.changeSelItem(jqEle, selLi, objBind, typeObj.childType);
    return { index: selLiIndex, text: indexOrText };
};

/*清空值
*/
pcombobox.prototype.precover = function (headerText) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqEle);
    switch (typeObj.childType) {
        case this.controlTypes.pcombobox.types[4]:
            jqEle.find('[' + this.ptextTemplate.textMarker + ']').val('');
            break;
        case this.controlTypes.pcombobox.types[0]:
            var _id = jqEle.attr(this.ptool.libraryIdToHtml);
            var objBind = pcombobox[_id];
            var attr = objBind.attr;
            if (attr.istree === false) {
                var selIndex = jqEle.psel().index;
                jqEle.find('[' + this.contentUlMarker + ']').children().eq(selIndex).removeClass(this.selCss);
            }
            var headerObj = attr.header;
            headerText = attr.bind !== true ? headerObj.placeholder || '' : arguments[1] || '';
            jqEle.find('[' + this.headerTextMarker + ']').text(headerText);
            break;
    }
    jqEle.phideTextTip();
};

/*获取或设置文本框的值，text类型专用
*/
pcombobox.prototype.pval = function (value) {
    var ele = arguments[0];
    var jqEle = $(ele);
    value = arguments[1];

    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqEle);
    if (typeObj.childType === this.controlTypes.pcombobox.types[4]) return new ptext().pval(ele, value);
    return false;
};

/*选择某选项时给头赋值、给选项加选中样式*/
pcombobox.prototype.changeSelItem = function (jqEle, liEle, objBind, childType) {
    var prefix = objBind.attr.header.prefix || '';
    var text = liEle.find('b').text();
    if (childType !== this.controlTypes.pcombobox.types[4]) {
        if (childType === this.controlTypes.pcombobox.types[6]) text = text;
        else text = prefix + text;
        if (childType === this.controlTypes.pcombobox.types[5]) {
            text = text + this.headerSplitor + objBind.attr.number;
        }
        jqEle.find('[' + this.headerTextMarker + ']').text(text);
        var uls = jqEle.find('[' + this.contentUlMarker + ']');
        for (var i = 0; i < uls.length; i++) {
            uls.eq(i).find('li').removeClass(this.selCss);
        }
        liEle.addClass(this.selCss);
    } else
        jqEle.find('[' + this.ptextTemplate.textMarker + ']').val(text);
};

/*给滚动条赋最小宽和最大高*/
pcombobox.prototype.setScrollSize = function (jqElement) {
    var headerJqEle = jqElement.find('[' + this.headerMarkder + ']');
    var minWidth = headerJqEle.width();
    var scrollSelector = '[' + this.ptool.libraryTypeToHtml + '="' + this.controlTypes.pscroll.name + this.ptool.typeSeparator +
            this.controlTypes.pscroll.types[0] + '"]';
    jqElement.find(scrollSelector).css({
        'min-width': minWidth + 'px',
        'max-height': this.comboxMaxHeight + 'px'
    });
};

/*给内容ul赋属性、数据、注册click、mouseenter*/
pcombobox.prototype.conUlSet = function (ulJqTarget, _id, itemArr, isEvent, conDivTarget, childType) {
    var _this = this;
    var typeStr = this.controlTypes.pcombobox.name + this.ptool.typeSeparator + childType;
    ulJqTarget.attr(_this.ptool.libraryIdToHtml, _id);
    ulJqTarget.attr(_this.ptool.libraryTypeToHtml, typeStr);
    _this.createEvent(conDivTarget, _this.controlTypes.pcombobox.name, 'mouseover', window[_this.ptool.pstaticEventFnName]);
    if (isEvent) {
        var ulTarget = ulJqTarget[0];
        var _oldsource = ulTarget[_this.ptool.libraryToPro] || {};
        _oldsource[_this.ptool.controlPrivateToProName] = itemArr;
        ulTarget[_this.ptool.libraryToPro] = _oldsource;
        _this.conliEvent(ulJqTarget);
    }
};

/*给内容li注册click、mouseenter事件*/
pcombobox.prototype.conliEvent = function (ulJqTarget) {
    var _this = this;
    var liTargets = ulJqTarget.find('li');
    liTargets.each(function () {
        _this.createEvent(this, _this.controlTypes.pcombobox.name, 'mouseenter', window[_this.ptool.pstaticEventFnName]);
        _this.createEvent(this, _this.controlTypes.pcombobox.name, 'click', window[_this.ptool.pstaticEventFnName]);
    });
};

/*document点击时收起所有下拉框*/
pcombobox.prototype.slideUp = function () {
    var _this = this;
    var comboxSelector = '';
    var comboxTypes = _this.controlTypes.pcombobox.types;
    comboxTypes.forEach(function (curr) {
        var str = _this.ptool.libraryTypeToHtml + '="' + _this.controlTypes.pcombobox.name + _this.ptool.typeSeparator + curr + '"';
        comboxSelector += (comboxSelector.length == 0 ? '' : ',') + '[' + str + ']';
    });
    $(comboxSelector).find('[' + _this.contentMaxDivMarker + ']').slideUp(200);
};

/*document mouseover时隐藏所有非一级下拉框*/
pcombobox.prototype.hideNotFirstLevelMenu = function () {
    var _this = this;
    var comboxSelector = '';
    var comboxTypes = _this.controlTypes.pcombobox.types;
    comboxTypes.forEach(function (curr) {
        var str = _this.ptool.libraryTypeToHtml + '="' + _this.controlTypes.pcombobox.name + _this.ptool.typeSeparator + curr + '"';
        comboxSelector += (comboxSelector.length == 0 ? '' : ',') + '[' + str + ']';
    });
    var comboxTargets = $(comboxSelector);
    /*隐藏多级下拉菜单的非一级*/
    comboxTargets.each(function () {
        var childItemSelector = '[' + _this.comboxConMarker +
                '][' + _this.levelMarker + '!="1"]';
        $(this).find(childItemSelector).hide();
    });
};

/*page类型专用，设置页码*/
pcombobox.prototype.pcount = function (count) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = pcombobox[_id];
    var attr = objBind.attr;
    count = arguments[1];
    attr.number = count;
    objBind.attr = attr;
    pcombobox[_id] = objBind;

    var ulJqTarget = jqEle.find('[' + this.contentUlMarker + ']');
    var liStr = this.joinLi([], objBind, this.controlTypes.pcombobox.types[5], 1);
    ulJqTarget.empty();
    ulJqTarget.append(liStr);
    this.conliEvent(ulJqTarget);
};

/*time类型的重置选项*/
pcombobox.prototype.resetList = function (jqTarget, start, end, prefix) {
    var liStr = this.joliToTime(start, end, prefix);
    var _cbid = jqTarget.attr(this.ptool.libraryIdToHtml);
    var ulJqTarget = jqTarget.find('[' + this.ptool.libraryIdToHtml + '="' + _cbid + '"]');
    ulJqTarget.empty();
    ulJqTarget.append(liStr);
    this.conliEvent(ulJqTarget);
};

/*给下拉列表头部赋值------------多功能表格控件的头部左侧快捷选中行操作时*/
pcombobox.prototype.setHeaderText = function (jqTarget, text) {
    jqTarget.find('[' + this.headerTextMarker + ']').text(text);
};
;﻿function ptab_template() {
    this.constructor = arguments.callee;
    this.leftMarker = 'left';
    this.rightMarker = 'right';
    this.clientPadding = 10;
    this.contentTagMarker = 'ulm';
    this.contentLiMarker = 'ctli';
    this.selCss = {
        button: 'per-tab-button_active',
        text: 'per-tab-text_active',
        navigation: 'active'
    };

    this.buttonStart = '<div ' + this.ptool.maxDivMarker + ' class="per-tab-button"{{id}}><ul ' + this.contentTagMarker + '>';
    this.buttonItem = '<li class="per-tab-button_item"{{disabled}}{{click}}><span class="per-tab-button_nav"{{text}}></span></li>';
    this.buttonEnd = '</ul></div>';

    this.textStart = '<div ' + this.ptool.maxDivMarker + ' class="per-tab-text"{{id}}><div class="per-tab-text_but _tab-text-left" ' +
                    this.leftMarker + '="' + this.leftMarker +
                    '" disable="flase"><</div><div class="per-tab-text_wrap"><ul ' + this.contentTagMarker + '>';
    this.textItem = '<li class="per-tab-text_item"{{text}}{{disabled}}{{click}}></li>';
    this.textEnd = '</ul></div><div class="per-tab-text_but _tab-text-right" ' + this.rightMarker + '="' + this.rightMarker +
                    '" disable="flase">></div></div>';

    this.navigationStart = '<div ' + this.ptool.maxDivMarker + ' class="per-tab-navigation" {{id}}><div class="per-tab-navigation_title"><ul ' +
                            this.contentTagMarker + '>';
    this.navigationIcon = '<i class="per-tab-navigation_icon"{{icon}}></i>';
    this.navigationItem = '<li class="per-tab-navigation_item"{{disabled}}{{click}}>';
    this.navigationItemEnd = '<em {{text}}></em></li>';

    this.navigationEnd = '</ul></div><div class="per-tab-navigation_con" {{templateid}}></div></div>';
};

ptab_template.prototype = new persagyElement();

/*创建内容*/
ptab_template.prototype.joinLi = function (objBind, childType) {
    var attr = objBind.attr;
    var bind = attr.bind;
    var datasource = attr.datasource;
    var text = attr.text;
    var icon = attr.icon;
    var disabled = attr.disabled;

    var conTemplateStr = childType == this.controlTypes.ptab.types[0] ? this.buttonItem :
                                 childType == this.controlTypes.ptab.types[1] ? this.textItem :
                                  childType == this.controlTypes.ptab.types[2] ? this.navigationItem : '';
    if (childType === this.controlTypes.ptab.types[2]) {
        conTemplateStr += (icon ? this.navigationIcon : '') + this.navigationItemEnd;
    }
    var conItemStr = '';
    if (bind !== true) {
        var itemsArr = eval(datasource) || [];
        for (var i = 0; i < itemsArr.length; i++) {
            var currItem = itemsArr[i];
            var textStr = (text ? currItem[text] : currItem) || '';
            var iconStr = (text ? currItem[icon] : '') || '';
            var disabledStr = currItem[disabled] || '';

            var currTemplate = conTemplateStr;
            conItemStr += this.joinHtmlByAttrCss(currTemplate, { text: textStr, icon: iconStr, disabled: disabledStr }, {}, {});
        }
    } else {
        conItemStr = this.joinHtmlToBindByAttrCss(conTemplateStr, { text: text, icon: icon, disabled: disabled }, { click: '' }, {}, true);
        conItemStr = this.createForBind(conItemStr, datasource);
    }

    return conItemStr;
};

/*获取模版字符串*/
ptab_template.prototype.getTemplateStr = function (objBind, childType) {
    var contentStr = this.joinLi(objBind, childType);
    var startStr = this[childType + 'Start'];
    var endStr = this[childType + 'End'];
    var templateStr = startStr + contentStr + endStr;
    /*templateStr = this.joinHtmlByAttrCss(templateStr, { templateid: objBind.attr.templateid });*/
    return templateStr;
};
;/*api
@class ptab 选项卡
@mainattr 
@child 子类型
* button 按钮选项卡
* text 文本选项卡
* navigation 导航选项卡
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* disabled 是否禁用，默认false boolean
* datasource 选项卡数据源 string
* text 选项卡每项的文本对应的属性名称；不传时则默认取每一项的值作为文本 string
* icon 选项卡文本前的图标，导航选项卡专用 string
* templateid 自定义内容的模版ID，导航选项卡专用 string
@event 事件
* sel 选项选择事件
* beforesel 选项选择前触发事件，如果回调函数返回false，选项不会改变，且不会触发sel事件
@css 样式
@function 方法
* pdisable(disabled) 启用或禁用控件。#param:disabled:boolean:为true时禁用，false启用
* psel(index,isEvent) 选择某一个选项卡，不传参数时为获取当前选择项#param:index:int:选项的索引:isEvent:boolean:是否激发事件，默认true
api*/
function ptab() {
    this.constructor = arguments.callee;
};
ptab.prototype = new ptab_template();

/*构造html*/
ptab.prototype.init = function (childType, objBind, jqElement) {
    var templateStr = this.getTemplateStr(objBind, childType);
    this.renderView(templateStr, this.controlTypes.ptab.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件，至少要有click事件以改变其选中态*/
ptab.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);
    var itemTarget = jqElement.find('[' + this.contentTagMarker + ']').children();
    itemTarget.registerEventForColorChange(null, 0);

    var ulTarget = jqElement.find('[' + this.contentTagMarker + ']');
    if (attr.bind !== true)
        this.createEvent(ulTarget, this.controlTypes.ptab.name, 'click', window[this.ptool.pstaticEventFnName]);
    if (childType === this.controlTypes.ptab.types[1]) {
        this.createEvent(ulTarget, this.controlTypes.ptab.name, 'DOMSubtreeModified', window[this.ptool.pstaticEventFnName]);
        var leftBtn = jqElement.find('[' + this.leftMarker + ']');
        var rightBtn = jqElement.find('[' + this.rightMarker + ']');
        this.createEvent(leftBtn, this.controlTypes.ptab.name, 'click', window[this.ptool.pstaticEventFnName]);
        this.createEvent(rightBtn, this.controlTypes.ptab.name, 'click', window[this.ptool.pstaticEventFnName]);
        this.pisShowPage(jqElement);
    }
};

/*事件的处理*/
ptab.prototype.eventHandout = function (model, event) {
    var _this = this;
    var jqTarget = $(event[this.ptool.eventCurrTargetName]);
    var eventName = event.type;

    switch (eventName) {
        case 'click':
            var srcTarget = event.target;
            var srcJqTarget = $(srcTarget);

            /*text类型的选项卡 左右滑动*/
            var leftMarker = srcJqTarget.attr(this.leftMarker);
            var rightMarker = srcJqTarget.attr(this.rightMarker);
            if (leftMarker || rightMarker) {
                var ulJqTarget = jqTarget.find('[' + this.contentTagMarker + ']');
                var liTargetArr = ulJqTarget.children();
                var _oldPro = jqTarget[0][this.ptool.libraryToPro] || {};
                var oldStartIndex = _oldPro[this.ptool.controlPrivateToProName] || 0;
                var clientWidth = ulJqTarget.parent().width() + this.clientPadding;
                var maxLeft = ulJqTarget.width() - clientWidth;
                var liModuleWidth = 0, endLeft = 0;

                if (leftMarker) {
                    for (oldStartIndex; oldStartIndex >= 0; oldStartIndex--) {
                        var currLiwidth = this.getTextTypeLiWidth(liTargetArr.eq(oldStartIndex));
                        liModuleWidth += currLiwidth;
                        if (liModuleWidth >= clientWidth) break;
                    }
                    endLeft = getLeftByLiIndex();
                    ulJqTarget.animate({
                        "left": parseFloat('-' + endLeft)
                    }, 300);
                    if (endLeft == 0) srcJqTarget.pdisable(true);
                    else srcJqTarget.pdisable(false);
                    jqTarget.find('[' + this.rightMarker + ']').pdisable(false);
                }

                if (rightMarker) {
                    for (oldStartIndex; oldStartIndex < liTargetArr.length; oldStartIndex++) {
                        var currLiwidth = this.getTextTypeLiWidth(liTargetArr.eq(oldStartIndex));
                        liModuleWidth += currLiwidth;
                        if (liModuleWidth >= clientWidth) break;
                    }
                    endLeft = getLeftByLiIndex();
                    ulJqTarget.animate({
                        "left": parseFloat('-' + endLeft)
                    }, 300);
                    if (endLeft == maxLeft) srcJqTarget.pdisable(true);
                    else srcJqTarget.pdisable(false);
                    jqTarget.find('[' + this.leftMarker + ']').pdisable(false);
                }
                _oldPro[this.ptool.controlPrivateToProName] = oldStartIndex;
                jqTarget[0][this.ptool.libraryToPro] = _oldPro;
                return;
            }

            var liJqTarget = srcJqTarget;
            if (liJqTarget[0].tagName != 'LI') liJqTarget = liJqTarget.parent();

            var _id = jqTarget.attr(this.ptool.libraryIdToHtml);
            var objBind = ptab[_id];

            var orginEvent = objBind.event || {};

            var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqTarget);
            var selCss = this.selCss[typeObj.childType];
            var currState = liJqTarget.hasClass(selCss) ? true : false;

            var currJqEleIndex = liJqTarget.index();
            event = this.ptool.appendProToEvent(event, {
                state: currState,
                index: currJqEleIndex
            });


            var beforeSelFn = orginEvent.beforesel;
            var beforeResult = true;
            if (beforeSelFn) {
                beforeResult = this.executeEventCall(model, event, beforeSelFn);
            }
            if (beforeResult !== false) {
                this.cssChangeForSel(liJqTarget, selCss);
                currState = liJqTarget.hasClass(selCss) ? true : false;
                event = this.ptool.appendProToEvent(event, {
                    state: currState,
                    index: currJqEleIndex
                });
                var selFn = orginEvent.sel;
                if (selFn) this.executeEventCall(model, event, selFn);
            }
            break;
        case 'DOMSubtreeModified':
            this.pisShowPage(jqTarget);
            break;
    };

    function getLeftByLiIndex() {
        var endIndex = oldStartIndex;
        var left = 0;
        for (var i = 0; i < endIndex; i++) {
            var currLiwidth = _this.getTextTypeLiWidth(liTargetArr.eq(i));
            left += currLiwidth;
        }
        return Math.min(left, maxLeft);
    };
};

/*选择某一个选项卡，不传参数时，该方法返回当前控件的状态
*index int 选项索引
*isEvent boolean 是否激发事件，默认true
*/
ptab.prototype.psel = function (index, isEvent) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(ele);
    var selCss = this.selCss[typeObj.childType];
    var liTargets = jqEle.find('[' + this.contentTagMarker + ']').children();
    if (arguments.length === 1) {
        for (var i = 0; i < liTargets.length; i++) {
            if (liTargets.eq(i).hasClass(selCss)) return i;
        }
    }
    index = arguments[1];
    isEvent = arguments[2];
    isEvent = isEvent === false ? false : true;

    var selCssToElement = liTargets.eq(index);
    var currState = selCssToElement.hasClass(selCss) ? true : false;
    if (currState) return index;

    if (isEvent) return selCssToElement[0].click();
    this.cssChangeForSel(selCssToElement, selCss);
};

/*计算text类型的导航，是否显示左右按钮*/
ptab.prototype.pisShowPage = function (jqEle) {
    var contentJqEle = jqEle.find('[' + this.contentTagMarker + ']');
    var clientWidth = contentJqEle.parent().width() + this.clientPadding;
    var scrollWidth = contentJqEle.width();
    if (scrollWidth > clientWidth) {
        var leftBtn = jqEle.find('[' + this.leftMarker + ']');
        var rightBtn = jqEle.find('[' + this.rightMarker + ']');
        leftBtn.show();
        rightBtn.show();
        leftBtn.pdisable(true);
    }
};

/*text类型的导航，每一个li的宽*/
ptab.prototype.getTextTypeLiWidth = function (liJqEle) {
    return liJqEle.width() + 20 + this.clientPadding;
};

/*选项选择时的样式变化*/
ptab.prototype.cssChangeForSel = function (currLiTarget, selCss) {
    currLiTarget[0][pconst.targetHoverCssSourcePro] = [];
    currLiTarget.css('backgroundColor', '');
    currLiTarget.toggleClass(selCss);
    currLiTarget.siblings().removeClass(selCss);
};
;﻿function pwindow_template() {
    this.constructor = arguments.callee;
    this.closeMarker = 'close';
    this.buttonsMarker = 'buttons';
    this.floatMarker = 'float';
    this.titleMarker = 'tit';
    this.subTitleMarker = 'subtit';
    this.global = '<div ' + this.ptool.maxDivMarker + ' class="per-modal-control" style="display:none;opacity:0;" {{id}}><div class="per-modal-mask">' +
                 '<div class="per-modal-global_x" ' + this.closeMarker + '>x</div><div class="per-modal-global" {{templateid}}></div></div></div>';

    this.modal = '<div ' + this.ptool.maxDivMarker + ' class="per-modal-control" style="display:none;opacity:0;" {{id}}><div class="per-modal-mask">' +
                 '<div class="per-modal-custom"><div class="per-modal-custom_title" ' + this.titleMarker + ' {{text}}></div>' +
                 '<div class="per-modal-custom_con" {{templateid}}></div></div></div></div>';

    this.confirm = '<div ' + this.ptool.maxDivMarker + ' class="per-modal-control" style="display:none;opacity:0;" {{id}}><div class="per-modal-mask">' +
                   '<div class="per-modal-common"><div class="per-modal-common_con">' +
                   '<div class="per-modal-common_title" ' + this.titleMarker +
                   '{{text}}></div><div class="per-modal-common_subtitle" ' + this.subTitleMarker + '{{subtitle}}></div>' +
                   '</div><div class="per-modal-common_button" ' + this.buttonsMarker + '>';
    this.confirm2 = '</div></div></div></div>';

    this.float1 = '<div ' + this.ptool.maxDivMarker + ' ' + this.floatMarker + ' class="per-madal-float" style="';
    this.float2 = '>';
    this.float = '<div class="per-madal-float_title"><div class="per-madal-float_x" ' +
                this.closeMarker + '>x</div>' +
                 '<div class="per-madal-float_titcon"><b ' + this.titleMarker + '{{text}}></b></div><div class="per-madal-float_operate"' + this.buttonsMarker + '>';
    this.float3 = '</div></div><div class="per-madal-float_con"{{templateid}}></div></div>';
    this.floatShadeStart1 = '<div ' + this.ptool.maxDivMarker + ' class="per-modal-control" style="display:none;opacity:0;"';
    this.floatShadeStart2 = '>';
    this.floatShadeEnd = '</div>';

    this.bubble = '<div ' + this.ptool.maxDivMarker + ' class="per-modal-pop" style="display:none;"{{id}}>' +
                  '<div class="per-modal-pop_title" ' + this.titleMarker + '{{text}}></div>' +
                  '<div class="per-modal-pop_subtitle" ' + this.subTitleMarker + '{{subtitle}}></div>' +
                  '<div class="per-modal-pop_button" ' + this.buttonsMarker + '>';
    this.bubble2 = '</div></div>';
};

pwindow_template.prototype = new persagyElement();

pwindow_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    attr.text = attr.title;
    switch (childType) {
        case this.controlTypes.pwindow.types[3]:
            var animateObj = attr.animate || {};
            var float = this.float + (attr.buttons || '') + this.float3;
            var floatStr = this.float1 + (animateObj.orientation + ':' + animateObj.minpx + 'px;"');
            return attr.isshade ? (this.floatShadeStart1 + '{{id}}' + this.floatShadeStart2 + floatStr + this.float2 + float + this.floatShadeEnd) :
                 (floatStr + '{{id}}' + this.float2 + float);
        case this.controlTypes.pwindow.types[2]:
        case this.controlTypes.pwindow.types[4]:
            return this[childType] + (attr.buttons || '') + this[childType + '2'];
            break;
        default:
            return this[childType];
    }
};
;/*api
@class pwindow 弹窗，注：支持button标签，confirm、float、bubble类型专用。button标签内可创建按钮
@mainattr 
@child 子类型
* global 全屏
* modal 模态
* confirm 二次确认框
* float 侧弹窗
* bubble 气泡
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* templateid 模版ID，global、modal、float类型专属 string
* title modal、confirm、float、bubble类型专属 string
* subtitle confirm、bubble类型专属 string
* isshade 是否带遮罩，float类型专用，默认true boolean
* orientation 出来时的方向，float类型专用，需放到animate标签上，支持两个值：left、right string
* maxpx 完全呈现需达到的最大left或最大right，float类型专用，需放到animate标签上 number
* minpx 关闭时需达到的最小left或最小right，float类型专用，需放到animate标签上 number
@event 事件
* hide 隐藏事件
* beforehide 隐藏前触发事件，如果回调函数返回false，则不会关闭窗口
@css 样式，暂不支持
@function 方法
* pshow(objParm) 显示窗口。#param:objParm:object:modal、float类型时，例：{title:''}；confirm类型时，例：{title:'',subtitle:''}；bubble类型时,例：{left:'1px',right:'',title:'',subtitle:''}
* phide() 隐藏窗口
api*/
function pwindow() {
    this.constructor = arguments.callee;
};
pwindow.prototype = new pwindow_template();

/*构造html*/
pwindow.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;
    attr.buttons = jqElement.find('button').html();
    var jqAnimaterTarget = jqElement.find('animate');
    attr.animate = {
        orientation: jqAnimaterTarget.attr('orientation'),
        maxpx: jqAnimaterTarget.attr('maxpx'),
        minpx: jqAnimaterTarget.attr('minpx')
    };
    attr.isshade = attr.isshade === false ? false : true;
    var templateStr = this.getTemplateStr(objBind, childType);
    this.renderView(templateStr, this.controlTypes.pwindow.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
pwindow.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);

    var closeTarget = jqElement.find('[' + this.closeMarker + ']');

    if (closeTarget.length > 0)
        this.createEvent(closeTarget, this.controlTypes.pwindow.name, 'click', window[this.ptool.pstaticEventFnName]);

    /*jqElement.prender();*/
};

/*处理事件*/
pwindow.prototype.eventHandout = function (model, event) {
    var _this = this;
    var jqTarget = $(event[this.ptool.eventCurrTargetName]);
    var eventName = event.type;
    var eventJqCurrentTarget = $(event.currentTarget);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqTarget);
    var _id = jqTarget.attr(this.ptool.libraryIdToHtml);
    var objBind = pwindow[_id];
    var orginEvent = objBind.event || {};

    if (eventName == 'click' && eventJqCurrentTarget.attr(this.closeMarker) == '') {
        if (orginEvent.beforehide) {
            var beforeHideResult = this.executeEventCall(model, event, orginEvent.beforehide);
            if (!beforeHideResult) return;
        }

        switch (typeObj.childType) {
            case this.controlTypes.pwindow.types[0]:
            case this.controlTypes.pwindow.types[3]:
                jqTarget.phide();
                this.executeEventCall(model, event, orginEvent.hide);
                break;
        }
    }
};

/*显示控件
*objParm bubble类型专用
*modal类型时，例：{title:''}
*confirm类型时，例：{title:'',subtitle:''}
*float类型时，例：{title:''}
*bubble类型时,例：{left:'1px',right:'',title:'',subtitle:''},css属性可以是任意的
*/
pwindow.prototype.pshow = function (objParm) {
    var _this = this;
    var ele = arguments[0];
    objParm = arguments[1] || {};
    var jqEle = $(ele);
    var typeObj = _this.ptool.getTypeAndChildTypeFromEle(ele);
    var _id = jqEle.attr(_this.ptool.libraryIdToHtml);
    var objBind = pwindow[_id];
    var attr = objBind.attr;
    if (typeObj.childType != _this.controlTypes.pwindow.types[0] && objParm.title) {
        jqEle.find('[' + this.titleMarker + ']').text(objParm.title);
    }
    if ((typeObj.childType == _this.controlTypes.pwindow.types[2] || typeObj.childType == _this.controlTypes.pwindow.types[4]) && objParm.subtitle) {
        jqEle.find('[' + this.subTitleMarker + ']').text(objParm.subtitle);
    }
    switch (typeObj.childType) {
        case _this.controlTypes.pwindow.types[0]:
        case _this.controlTypes.pwindow.types[1]:
        case _this.controlTypes.pwindow.types[2]:
            jqEle.show();
            jqEle.animate({
                opacity: 1
            }, 500);
            break;
        case _this.controlTypes.pwindow.types[3]:
            var animateObj = attr.animate || {};
            objParm = {};
            objParm[animateObj.orientation] = animateObj.maxpx + 'px';
            if (attr.isshade === false) {
                jqEle.css(objParm);
            } else {
                jqEle.show();
                jqEle.animate({
                    opacity: 1
                }, 200, function () {
                    jqEle.find('[' + _this.floatMarker + ']').css(objParm);
                });
            }
            break;
        case _this.controlTypes.pwindow.types[4]:
            jqEle.css(objParm);
            jqEle.show();
            break;
    }
};

/*隐藏控件*/
pwindow.prototype.phide = function (cssObj) {
    var _this = this;
    var ele = arguments[0];
    cssObj = arguments[1] || {};
    var jqEle = $(ele);
    var typeObj = _this.ptool.getTypeAndChildTypeFromEle(ele);
    var _id = jqEle.attr(_this.ptool.libraryIdToHtml);
    var objBind = pwindow[_id];
    var attr = objBind.attr;
    switch (typeObj.childType) {
        case _this.controlTypes.pwindow.types[0]:
        case _this.controlTypes.pwindow.types[1]:
        case _this.controlTypes.pwindow.types[2]:
            jqEle.animate({
                opacity: 0
            }, 500, function () {
                jqEle.hide();
            });

            break;
        case _this.controlTypes.pwindow.types[3]:
            var animateObj = attr.animate || {};
            cssObj = {};
            cssObj[animateObj.orientation] = animateObj.minpx + 'px';
            if (attr.isshade === false) {
                jqEle.css(cssObj);
            } else {
                jqEle.find('[' + _this.floatMarker + ']').css(cssObj);
                jqEle.animate({
                    opacity: 0
                }, 500, function () {
                    jqEle.hide();
                });
            }
            break;
        case _this.controlTypes.pwindow.types[4]:
            jqEle.hide();
            break;
    }
};
;﻿function ppage_template() {
    this.constructor = arguments.callee;
    this.leftButtonMarker = 'ltp';
    this.rightButtonMarker = 'rtp';
    this.pageComboboxMarker = 'pagebox';
    this.fullUlMarker = 'fullul';
    this.fullTextMarker = 'fulltext';
    this.dotCss = 'per-paging-dot';
    this.fullSelCss = 'per-paging-pitch';
    this.dotStr = '···';

    this.start = '<div {{id}} ' + this.ptool.maxDivMarker + ' class="per-paging-normal"><div class="per-paging-concise">';
    this.end = '</div></div>';
    this.leftButton = '<pbutton-white icon="l" ' + this.leftButtonMarker + ' click="ppage.prevPageFn"></pbutton-white>';
    this.rightButton = '<pbutton-white icon="r" ' + this.rightButtonMarker + ' click="ppage.nextPageFn"></pbutton-white>';

    this.fullPageNumberUlStart = '<ul class="per-paging-page" ' + this.fullUlMarker + '>';
    this.fullPageNumberUlEnd = '</ul>';

    this.fullPageInputDiv = '<div class="per-paging-number">跳转到<ptext-text ' + this.fullTextMarker +
                            '><verify verifytype="positiveint" errtip="页码必须为正整数"></verify>' +
                            '</ptext-text>页</div><pbutton-white text="确定" click="ppage.sureClick"></pbutton-white>';
};

ppage_template.prototype = new persagyElement();

ppage_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;

    switch (childType) {
        case this.controlTypes.ppage.types[0]:
            var contentTarget = '<pcombobox-page ' + this.pageComboboxMarker + ' orientation="' + (attr.orientation || '') +
                                '" number="' + (attr.number || '') +
                                '" sel="ppage.selPageFn"></pcombobox-page>';
            return this.start + this.leftButton + contentTarget + this.rightButton + this.end;
        default:
            var conUlStr = this.createFullPageCon(attr.number, 1);
            return this.start + this.leftButton + conUlStr + this.rightButton + this.fullPageInputDiv + this.end;
    }
};

/*初始化全功能版分页的页码表*/
ppage_template.prototype.createFullPageCon = function (number, currPageIndex) {
    var liStr = this.createLiStr(number, currPageIndex);
    return this.fullPageNumberUlStart + liStr + this.fullPageNumberUlEnd;
};

ppage_template.prototype.createLiStr = function (number, currPageIndex) {
    var _this = this;
    var liStr = createLi(currPageIndex);
    var minedCrIndex = currPageIndex;
    var maxedCrIndex = currPageIndex;

    for (var i = 1; i <= 2; i++) {
        var pageIndex = currPageIndex - i;
        if (pageIndex <= 0) break;
        minedCrIndex = pageIndex;
        var currLiStr = createLi(pageIndex);
        liStr = currLiStr + liStr;
    }
    if (minedCrIndex - 1 > 1)
        liStr = createLi(_this.dotStr, true) + liStr;
    if (minedCrIndex - 1 > 0)
        liStr = createLi(1) + liStr;

    for (i = 1; i <= 2; i++) {
        pageIndex = currPageIndex + i;
        if (pageIndex > number) break;
        maxedCrIndex = pageIndex;
        var currLiStr = createLi(pageIndex);
        liStr += currLiStr;
    }
    if (number - maxedCrIndex > 1)
        liStr += createLi(_this.dotStr, true);
    if (number - maxedCrIndex > 0)
        liStr += createLi(number);
    return liStr;

    function createLi(value, isDot) {
        return '<li class="per-paging-item ' + (isDot === true ? _this.dotCss : '') + ' ' + (value === currPageIndex ? _this.fullSelCss : '')
                + '">' + value + '</li>';
    };
};
;/*api
@class ppage 分页，页码从1开始
@mainattr 
@child 子类型
* simple 简单版
* full 完整版
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* disabled 是否禁用，默认false boolean
* number 总页数 number
* orientation 页码列表的弹出方向，simple类型专用，支持2个值：up、down 默认down string
@event 事件
* sel 页码选择事件
@css 样式，暂不支持
@function 方法
* psel(pageNumber,isEvent) 切换到某一页，不传参时返回当前的页码。#param:pageNumber:number:从1开始的页码:isEvent:boolean:是否激发事件，默认true
* pcount(number) 获取总页数，不传参数时返回当前总页数。#param:number:number:总页数
api*/
function ppage() {
    this.constructor = arguments.callee;
};
ppage.prototype = new ppage_template();

/*构造html*/
ppage.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;
    attr.number = attr.number || 1;
    var templateStr = this.getTemplateStr(objBind, childType);
    this.renderView(templateStr, this.controlTypes.ppage.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
ppage.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);

    /*jqElement.prender();*/

    jqElement.find('[' + this.leftButtonMarker + ']').pdisable(true);
    if (attr.number == 1) {
        jqElement.find('[' + this.rightButtonMarker + ']').pdisable(true);
        jqElement.find('[' + this.pageComboboxMarker + ']').pdisable(true);
    }

    /*全功能的页码点击事件*/
    this.createEvent(jqElement.find('[' + this.fullUlMarker + ']'), this.controlTypes.ppage.name, 'click', window[this.ptool.pstaticEventFnName]);
};

/*事件处理------只有一个全功能的页码点击事件*/
ppage.prototype.eventHandout = function (model, event) {
    var jqEle = $(event.currentTarget).parents('[' + this.ptool.maxDivMarker + ']').eq(0);
    var liJqTarget = $(event.target);
    var text = liJqTarget.text();
    var selPageIndex = parseInt(text);
    if (text == this.dotStr) {
        if (liJqTarget.index() == 1) {
            var nextText = liJqTarget.next().text();
            selPageIndex = parseInt(nextText) - 1;
        } else {
            var prevText = liJqTarget.prev().text();
            selPageIndex = parseInt(prevText) + 1;
        }
    }
    this.pageChangedToData(jqEle, selPageIndex, event);
};

/*页码改变后的数据改变效果*/
ppage.prototype.pageChangedToData = function (jqEle, selPageIndex, event) {
    event[this.ptool.eventCurrTargetName] = jqEle[0];
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = ppage[_id];
    this.pageChanged(jqEle, selPageIndex);
    var oldPeventAttr = event[this.ptool.eventOthAttribute] || {};
    oldPeventAttr.pageIndex = selPageIndex;
    event[this.ptool.eventOthAttribute] = oldPeventAttr;
    this.executeEventCall(null, event, objBind.event.sel);
};

/*左右按钮翻页回调前的共用代码*/
ppage.prototype.pageBefore = function (event) {
    var jqEle = $(event.currentTarget).parents('[' + this.ptool.maxDivMarker + ']').eq(0);
    var ele = jqEle[0];
    var _oldPpro = ele[this.ptool.libraryToPro] || {};
    var currPageIndex = _oldPpro[this.ptool.controlPrivateToProName] || 1;

    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = ppage[_id];
    var attr = objBind.attr;
    var pageCount = attr.number;

    var leftTarget = jqEle.find('[' + this.leftButtonMarker + ']');
    var rightTarget = jqEle.find('[' + this.rightButtonMarker + ']');
    if (pageCount == 1) {
        leftTarget.pdisable(true);
        rightTarget.pdisable(true);
        return false;
    }
    return {
        currPageIndex: currPageIndex, leftTarget: leftTarget, _oldPpro: _oldPpro,
        ele: ele, rightTarget: rightTarget, pageCount: pageCount
    };
};

/*页码改变后的页面效果*/
ppage.prototype.pageChanged = function (jqEle, pageIndex) {
    var ele = jqEle[0];
    var _oldPpro = ele[this.ptool.libraryToPro] || {};
    _oldPpro[this.ptool.controlPrivateToProName] = pageIndex;
    ele[this.ptool.libraryToPro] = _oldPpro;

    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = ppage[_id];
    var attr = objBind.attr;
    var pageCount = attr.number;
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqEle);

    var leftTarget = jqEle.find('[' + this.leftButtonMarker + ']');
    var rightTarget = jqEle.find('[' + this.rightButtonMarker + ']');
    var simpleComboxJqTarget = jqEle.find('[' + this.pageComboboxMarker + ']');
    if (pageCount == 1) {
        leftTarget.pdisable(true);
        rightTarget.pdisable(true);
        simpleComboxJqTarget.pdisable(true);
    } else {
        simpleComboxJqTarget.pdisable(false);
        if (pageIndex == 1) {
            leftTarget.pdisable(true);
            rightTarget.pdisable(false);
        } else if (pageIndex == pageCount) {
            rightTarget.pdisable(true);
            leftTarget.pdisable(false);
        } else {
            rightTarget.pdisable(false);
            leftTarget.pdisable(false);
        }
    }
    if (typeObj.childType === this.controlTypes.ppage.types[1]) {
        var liStr = this.createLiStr(attr.number, pageIndex);
        var fullUlTarget = jqEle.find('[' + this.fullUlMarker + ']');
        fullUlTarget.empty();
        fullUlTarget.append(liStr);
    }
};

/*选择某一页
*pageNumber 从1开始的页码
*isEvent 是否触发事件，默认true
*/
ppage.prototype.psel = function (pageNumber, isEvent) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqEle);
    if (arguments.length == 1) {
        var _oldPpro = ele[this.ptool.libraryToPro] || {};
        return _oldPpro[this.ptool.controlPrivateToProName] || 1;
    }
    pageNumber = parseInt(arguments[1]);
    if (!pageNumber) return false;
    isEvent = arguments[2];
    isEvent = isEvent === false ? false : true;
    if (!isEvent) this.pageChanged(jqEle, pageNumber);
    if (typeObj.childType === this.controlTypes.ppage.types[0])
        return jqEle.find('[' + this.pageComboboxMarker + ']').psel(pageNumber - 1, isEvent);

    if (isEvent)
        this.pageChangedToData(jqEle, pageNumber, {});
};

/*获取或设置总页数
*number 总页数
*/
ppage.prototype.pcount = function (number) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqEle);
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = ppage[_id];
    var attr = objBind.attr;
    var currPageCount = attr.number;
    if (arguments.length == 1) return currPageCount;

    number = arguments[1];
    number = parseInt(number);
    attr.number = number;
    objBind.attr = attr;
    ppage[_id] = objBind;

    var _oldPpro = ele[this.ptool.libraryToPro] || {};
    var currPageIndex = _oldPpro[this.ptool.controlPrivateToProName] || 1;
    if (number < currPageIndex) currPageIndex = 1;
    _oldPpro[this.ptool.controlPrivateToProName] = currPageIndex;
    ele[this.ptool.libraryToPro] = _oldPpro;

    this.pageChanged(jqEle, currPageIndex);

    if (typeObj.childType === this.controlTypes.ppage.types[0]) {
        var simpleComboxJqTarget = jqEle.find('[' + this.pageComboboxMarker + ']');
        simpleComboxJqTarget.pcount(number);
        simpleComboxJqTarget.psel(currPageIndex - 1, false);
    } else {
        var fullUlJqTarget = jqEle.find('[' + this.fullUlMarker + ']');
        var liStr = this.createLiStr(number, currPageIndex);
        fullUlJqTarget.empty();
        fullUlJqTarget.append(liStr);
    }
};


/*上一页*/
ppage.prevPageFn = function (event) {
    var ppageObj = new ppage();
    var obj = ppageObj.pageBefore(event);
    if (obj == false) return;
    obj.rightTarget.pdisable(false);
    var currPageIndex = obj.currPageIndex;
    var _oldPpro = obj._oldPpro;
    var ele = obj.ele;

    if (currPageIndex == 1) return obj.leftTarget.pdisable(true);

    --currPageIndex;
    ele.psel(currPageIndex);
};

/*下一页*/
ppage.nextPageFn = function (event) {
    var ppageObj = new ppage();
    var obj = ppageObj.pageBefore(event);
    if (obj == false) return;
    obj.leftTarget.pdisable(false);
    var currPageIndex = obj.currPageIndex;
    var _oldPpro = obj._oldPpro;
    var ele = obj.ele;

    if (currPageIndex == obj.pageCount) return obj.rightTarget.pdisable(true);

    ++currPageIndex;
    ele.psel(currPageIndex);
};

/*精简版的选择某一页后的内部回调*/
ppage.selPageFn = function (event) {
    var ppageObj = new ppage();
    var jqEle = $(event[ppageObj.ptool.eventCurrTargetName]).parents('[' + ppageObj.ptool.maxDivMarker + ']').eq(0);
    var oldPeventAttr = event[ppageObj.ptool.eventOthAttribute];
    var selPageIndex = oldPeventAttr.index + 1;
    ppageObj.pageChangedToData(jqEle, selPageIndex, event);
};

/*全功能版的确定按钮点击事件*/
ppage.sureClick = function (event) {
    var ppageObj = new ppage();
    var jqEle = $(event.currentTarget).parents('[' + ppageObj.ptool.maxDivMarker + ']').eq(0);
    var textJqTarget = jqEle.find('[' + ppageObj.fullTextMarker + ']');
    var inputVal = textJqTarget.pval();
    if (!inputVal) return;
    if (!textJqTarget.pverifi()) return;
    var selPageIndex = parseInt(inputVal);
    ppageObj.pageChangedToData(jqEle, selPageIndex, event);
};
;﻿function psearch_template() {
    this.constructor = arguments.callee;
    this.friendlyUlMarker = 'friul';
    this.inputMarker = 'schinput';
    this.friendlyMarker = 'fri';
    this.scrollMarker = 'scro';
    this.liTextMarker = 'litt';
    this.comboboxMarker = 'scom';
    this.clearMarker = 'clear';
    this.delaySearchMarker = 'dsm';
    this.friendlyMaxHeight = new pcombobox_template().comboxMaxHeight;
    this.inputSelCss = 'per-searchbox-delay_border';

    this.maxDelayCss = 'per-searchbox-delay';
    this.maxPromptlyCss = 'per-searchbox-promptly';
    this.start = '<div {{id}} ' + this.ptool.maxDivMarker + ' class="';
    this.start2 = '">';

    this.comboxStart = '<div class="per-searchbox-combobox" ' + this.comboboxMarker + '>';
    this.comboxEnd = '</div>';

    this.searchInputStart = '<div class="per-searchbox-input">';
    this.promptlySearchIcon = '<div class="per-searchbox-icon">f</div>';
    this.searchInputMiddle = '<input {{placeholder}} type="text" ' + this.inputMarker + '/><div class="per-searchbox-input_x" ' + this.clearMarker + '>x</div>';

    this.searchFriendlyStart = '<div class="per-combobox-wrap" style="display: none;" ' + this.friendlyMarker +
                               '><div class="per-combobox-con" style="display:inline-block;"><pscroll-small ' + this.scrollMarker + ' templateid="';
    this.searchFriendlyStart2 = '"></pscroll-small>';
    this.searchFriendlyend = '</div></div>';

    this.friendlyUlCon = '<ul ' + this.friendlyUlMarker + ' ' + this.ptool.libraryTypeToHtml + '="';
    this.friendlyUlCon2 = '"></ul>';

    this.searchInputEnd = '</div>';

    this.delaySearchIcon = '<div class="per-searchbox-icon" ' + this.delaySearchMarker + '>f</div>';
    this.end = '</div>';
};

psearch_template.prototype = new persagyElement();

psearch_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    var tipObj = attr.tip;

    var comboxHtml = '';
    if (attr.comboboxHtml) {
        var tempComboxHtml = '<div>' + this.comboxStart + attr.comboboxHtml + this.comboxEnd + '</div>';
        var tempComboxTarget = $(tempComboxHtml);
        var cbTarget = tempComboxTarget.children().children().eq(0);
        cbTarget.attr('sel', 'psearch.typeSel');
        cbTarget.attr('isborder', 'false');
        comboxHtml = tempComboxTarget.html();
    }
    var friendlyHtml = '';
    if (tipObj.suggestsource || tipObj.advisesource) {
        var typeStr = this.controlTypes.psearch.name + this.ptool.typeSeparator + childType;
        var templateId = this.ptool.createDynamicTemplate(this.friendlyUlCon + typeStr + this.friendlyUlCon2);
        friendlyHtml = this.searchFriendlyStart + templateId + this.searchFriendlyStart2 + this.searchFriendlyend;
    }

    return this.start + (childType == this.controlTypes.psearch.types[0] ? this.maxDelayCss : this.maxPromptlyCss) + this.start2 +
    comboxHtml + this.searchInputStart + (childType == this.controlTypes.psearch.types[1] ? this.promptlySearchIcon : '') +
    this.searchInputMiddle + friendlyHtml + this.searchInputEnd +
    (childType == this.controlTypes.psearch.types[0] ? this.delaySearchIcon : '') + this.end;
};

/*创建搜索建议和联想
*
*/
psearch_template.prototype.createAdviseLiStr = function (objBind, val) {
    var attr = objBind.attr;
    var tipObj = attr.tip;
    var source, type, textPro;
    val ? (source = tipObj.suggestsource, type = 1, textPro = tipObj.suggesttext) : (source = tipObj.advisesource, type = 2, textPro = tipObj.advisetext);

    if (!source)
        return;

    var liStr = '';
    var sourceArr = eval(source);
    for (var i = 0; i < sourceArr.length; i++) {
        var currItem = sourceArr[i];
        var textVal = textPro ? currItem[textPro] : currItem;
        var bStr = '';
        if (type == 1) {
            var splitObj = this.ptool.splitStrByKey(val, textVal);
            if (splitObj) {
                bStr = splitObj.start + '<em class="per-searchbox-select_color">' + splitObj.key + '</em>' + splitObj.end;
            }
        }
        else {
            bStr = textVal;
        }
        if (!bStr) continue;
        liStr += '<li class="per-combobox_item" ' + this.liTextMarker + '="' + textVal + '"><b>' + bStr + '</b></li>';
    }
    return liStr;
};
;/*api
@class psearch 搜索；注：支持combobox标签，用于创建筛选类型下拉列表；combobox标签内可创建下拉列表，只可创建一个
@mainattr 
@child 子类型
* delay 结果搜索
* promptly 即时搜索
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* suggestsource 搜索联想的数据源，必须是全局变量，需放到tip标签上 string
* suggesttext 搜索联想的值对应的属性，不传时将呈现数据源内的每项，需放到tip标签上 string
* advisesource 搜索建议的数据源，必须是全局变量，需放到tip标签上 string
* advisetext 搜索建议的值对应的属性，不传时将呈现数据源内的每项，需放到tip标签上 string
@event 事件
* change 搜索事件
@css 样式，暂不支持
@function 方法
* pval(objParam) 获取或设置搜索文本框、下拉类型的值。#param:key:string:文本框的值:typeIndexOrText:int|string:下拉框项的索引或者值:isEvent:boolean:是否触发事件，默认true
* precover(headerText) 恢复初始状态#param:headerText:string:适用于带下拉框的搜索，且placeholder绑定的时候，否则调用此方法时下拉框头部将显示placeholder的值
api*/
function psearch() {
    this.constructor = arguments.callee;
};
psearch.prototype = new psearch_template();

/*构造html*/
psearch.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;
    var tipJqTarget = jqElement.find('tip');
    attr.tip = {
        suggestsource: tipJqTarget.attr('suggestsource'),
        suggesttext: tipJqTarget.attr('suggesttext'),
        advisesource: tipJqTarget.attr('advisesource'),
        advisetext: tipJqTarget.attr('advisetext')
    };
    if (!attr.tip.suggestsource && !attr.tip.advisesource) attr.friendly = false;
    else attr.friendly = true;
    attr.comboboxHtml = jqElement.find('combobox').html();
    var templateStr = this.getTemplateStr(objBind, childType);
    this.renderView(templateStr, this.controlTypes.psearch.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
psearch.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);

    /*jqElement.prender();*/
    /*注册输入框的focus、blur,input事件*/
    var inputTarget = jqElement.find('[' + this.inputMarker + ']');
    this.createEvent(inputTarget, this.controlTypes.psearch.name, 'focus', window[this.ptool.pstaticEventFnName]);
    this.createEvent(inputTarget, this.controlTypes.psearch.name, 'blur', window[this.ptool.pstaticEventFnName]);
    this.createEvent(inputTarget, this.controlTypes.psearch.name, 'input', window[this.ptool.pstaticEventFnName]);
    /*仅仅只是为了阻止在没有click事件的情况下文本框的focus会触发click事件*/
    this.createEvent(inputTarget, this.controlTypes.psearch.name, 'click', window[this.ptool.pstaticEventFnName]);
    /*建议、联想 选择事件*/
    var _id = jqElement.attr(this.ptool.libraryIdToHtml);
    var ulJqTarget = jqElement.find('[' + this.friendlyUlMarker + ']');
    ulJqTarget.attr(this.ptool.libraryIdToHtml, _id);
    this.createEvent(ulJqTarget, this.controlTypes.psearch.name, 'click', window[this.ptool.pstaticEventFnName]);
    /*清除按钮click事件*/
    this.createEvent(jqElement.find('[' + this.clearMarker + ']'), this.controlTypes.psearch.name, 'click', window[this.ptool.pstaticEventFnName]);
    /*点击搜索click事件*/
    this.createEvent(jqElement.find('[' + this.delaySearchMarker + ']'), this.controlTypes.psearch.name, 'click', window[this.ptool.pstaticEventFnName]);
};

/*处理事件*/
psearch.prototype.eventHandout = function (model, event) {
    var _this = this;
    var jqTarget = $(event[_this.ptool.eventCurrTargetName]);
    var _id = jqTarget.attr(_this.ptool.libraryIdToHtml);
    if (jqTarget[0].tagName == 'UL')
        jqTarget = jqTarget.parents('[' + _this.ptool.libraryIdToHtml + '="' + _id + '"]').eq(0);
    var comboboxJqTarget = jqTarget.find('[' + _this.comboboxMarker + ']');
    var eventName = event.type;
    var typeObj = _this.ptool.getTypeAndChildTypeFromEle(jqTarget);
    var objBind = psearch[_id];
    var orginEvent = objBind.event || {};
    var attr = objBind.attr;

    var friendlyJqTarget = jqTarget.find('[' + _this.friendlyMarker + ']');
    var inputJqTarget = jqTarget.find('[' + _this.inputMarker + ']');
    switch (eventName) {
        case 'focus':
            jqTarget.addClass(_this.inputSelCss);
            initFriendly();
            showOrHideClear();
            break;
        case 'blur':
            jqTarget.removeClass(_this.inputSelCss);
            break;
        case 'input':
            var currVal = inputJqTarget.val();
            initFriendly();
            if (typeObj.childType === this.controlTypes.psearch.types[1]) {
                executeSearch();
            }
            showOrHideClear();
            break;
        case 'click':
            /*搜索联想、建议的项点击事件*/
            if (event.currentTarget.tagName == 'UL') {
                var liJqTarget = $(event.target);
                if (event.target.tagName != 'LI') liJqTarget = liJqTarget.parent();
                var selText = liJqTarget.attr(_this.liTextMarker);
                inputJqTarget.val(selText);
                executeSearch();
                friendlyJqTarget.hide();
                showOrHideClear();
            }
            /*清除按钮点击事件*/
            if ($(event.currentTarget).attr(_this.clearMarker) == '') {
                inputJqTarget.val('');
                showOrHideClear();
                comboboxJqTarget.precover();
                executeSearch();
            }
            /*点击搜索的搜索按钮点击事件*/
            if ($(event.currentTarget).attr(_this.delaySearchMarker) == '') {
                executeSearch();
            }
            break;
    }

    function initFriendly() {
        if (attr.friendly === true) {
            var liStr = _this.createAdviseLiStr(objBind, inputJqTarget.val());
            if (liStr) {
                jqTarget.find('[' + _this.scrollMarker + ']').css({
                    'max-width': friendlyJqTarget.width(),
                    'max-height': _this.friendlyMaxHeight
                });

                var ulJqTarget = jqTarget.find('[' + _this.friendlyUlMarker + ']');
                ulJqTarget.empty();
                ulJqTarget.append(liStr);
                friendlyJqTarget.show();
            } else friendlyJqTarget.hide();
        }
    };

    function executeSearch() {
        var obj = { key: inputJqTarget.val(), type: comboboxJqTarget.psel() };
        event[_this.ptool.eventOthAttribute] = obj;
        _this.executeEventCall(model, event, orginEvent.change);
    };

    function showOrHideClear() {
        var clearJqTarget = jqTarget.find('[' + _this.clearMarker + ']');
        inputJqTarget.val().length > 0 ? clearJqTarget.show() : clearJqTarget.hide();
    };
};

/*获取或设置搜索文本框、下拉列表的值
*/
psearch.prototype.pval = function (objParam) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var inputJqTarget = jqEle.find('[' + this.inputMarker + ']');
    var comboboxJqTarget = jqEle.find('[' + this.comboboxMarker + ']');
    if (arguments.length == 1) {
        var key = inputJqTarget.val();
        var type = comboboxJqTarget.psel();
        return { key: key, type: type };
    }
    objParam = arguments[1] || {};
    var value = objParam.value;
    var indexOrText = objParam.indexOrText;
    var isEvent = objParam.isEvent || false;
    comboboxJqTarget.psel(indexOrText, false);
    inputJqTarget.val(value || '');
    if (isEvent) {
        var _id = jqEle.attr(this.ptool.libraryIdToHtml);
        var objBind = psearch[_id];
        var originEvent = objBind.event || {};

        var obj = { key: inputJqTarget.val(), type: comboboxJqTarget.psel() };
        var event = this.ptool.appendProToEvent({}, obj);
        this.executeEventCall(null, event, originEvent.change);
    }
};


/*清空值
*/
psearch.prototype.precover = function (headerText, isEvent) {
    var ele = arguments[0];
    var jqEle = $(ele);
    jqEle.find('[' + this.comboboxMarker + ']').precover(arguments[1]);
    isEvent = arguments[2] === false ? false : true;
    var clearJqTarget = jqEle.find('[' + this.clearMarker + ']');
    if (isEvent) return clearJqTarget[0].click();
    clearJqTarget.hide();
    jqEle.find('[' + this.inputMarker + ']').val('');
};

/*内部下拉列表的筛选事件*/
psearch.typeSel = function (model, event) { };
;﻿function pupload_template() {
    this.constructor = arguments.callee;
    this.inputFileMarker = 'itfile';
    this.imgUploadingSrc = './imgs/uploadingImg.png';
    this.imgMarkr = 'timg';
    this.fileRegionUlMarker = 'fileul';
    this.fileLabelMarker = 'filelabel';
    this.clearMarker = 'clear';
    this.currNumberMarker = 'crnu';
    this.uploadBarMarker = 'uploadbar';
    this.fileNameMarker = 'fname';
    this.oneFileLiMarker = 'fileli';
    this.fileDisableMarker = 'fdis';

    this.img1 = '<div ' + this.ptool.maxDivMarker + '{{id}} class="per-upload-picture ';
    this.img4 = '"><ul ' + this.fileRegionUlMarker + ' class="per-upload-picture-ul"></ul><div class="per-upload-picture-wrap"><label ' +
                this.fileLabelMarker;
    this.img2 = ' class="per-upload-picture_label"><span>J</span><span>点击上传</span></label>' +
                      '<input ' + this.inputFileMarker + ' accept="image/jpeg,image/gif,image/jpg,image/png" type="file" id="';
    this.img3 = '" style="display: none;"></div></div>';
    this.imgHorizontalCss = 'per-upload_horizontal';
    this.imgVerticalCss = 'per-upload_vertical';

    this.lonelyFile1 = '<div ' + this.ptool.maxDivMarker + '{{id}} class="per-upload-onlyfile"><pbutton-white click="pupload.uploadBtnClick" text="点击上传" icon="d" ' + this.fileLabelMarker +
                         '></pbutton-white><input ' + this.inputFileMarker + ' {{accept}} type="file" id="';
    this.lonelyFile3 = '" style="display: none;"><div class="per-upload-onlyfile_file" ' + this.oneFileLiMarker +
                      '><div class="per-upload-onlyfile_name" ' + this.fileDisableMarker + '><b ' + this.fileNameMarker + '></b></div><span class="per-upload-manyfile_x" ' + this.clearMarker + '>x</span>' +
                      '<div class="per-upload-manyfile_bar" ' + this.uploadBarMarker + '></div></div></div>';

    this.multipleFile1 = '<div ' + this.ptool.maxDivMarker + '{{id}} class="per-upload-manyfile"><pbutton-white click="pupload.uploadBtnClick" text="点击上传" icon="d" ' + this.fileLabelMarker +
                         '></pbutton-white><div class="per-upload-count"><em ' + this.currNumberMarker + '>0</em>/<em>';
    this.multipleFile2 = '</em></div><input ' + this.inputFileMarker + ' {{accept}} type="file" id="';
    this.multipleFile3 = '" style="display: none;"><ul ' + this.fileRegionUlMarker + '></ul></div>';
};

pupload_template.prototype = new persagyElement();

pupload_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    var inputFileId = ptool.produceId();
    switch (childType) {
        case this.controlTypes.pupload.types[1]:
            return this.img1 + (attr.arrange == this.ptool.arrangeType.horizontal ? this.imgHorizontalCss : this.imgVerticalCss) +
                   this.img4 + this.img2 + inputFileId + this.img3;
        default:
            return attr.number == 1 ? this.lonelyFile1 + inputFileId + this.lonelyFile3 :
                            this.multipleFile1 + attr.number + this.multipleFile2 + inputFileId + this.multipleFile3;
    }
};

/*上传前先创建显示图片的区域*/
pupload_template.prototype.createImgRegion = function (childType, fileName) {
    return childType == this.controlTypes.pupload.types[1] ?
            '<li class="per-upload-picture-wrap" ' + this.oneFileLiMarker + '><div class="per-upload-picture_x" ' +
            this.clearMarker + '>x</div><img ' + this.imgMarkr + ' src="' + this.imgUploadingSrc + '"></li>' :
        '<li class="per-upload-manyfile_item" ' + this.oneFileLiMarker + '><div class="per-upload-onlyfile_name"' + this.fileDisableMarker + '><b ' + this.fileNameMarker + '>' +
        fileName + '</b></div><span class="per-upload-manyfile_x"' +
        this.clearMarker + '>x</span><div class="per-upload-manyfile_bar" ' + this.uploadBarMarker + '></div></li>';
};

;/*api
@class pupload 上传控件
@mainattr 
@child 子类型
* attachment 任意类型的文件
* img 只针对图片
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，默认false，现支持的框架有：ko、vue boolean
* accept 指定文件类型，attachment类型专用 string
* number 可以上传的文件数量，默认1 number
* arrange img类型专用，文件的排列方式，默认横向，可能的值为：horizontal(横向)、vertical(竖向)
@event 事件
* change 选择文件后的事件，需放到panel标签上
* success 上传成功后的事件，需放到panel标签上
* err 上传失败后的事件，需放到panel标签上
* progress 上传进度事件，需放到panel标签上
* clear 某个文件被清除后的事件，需放到panel标签上
@css 样式，暂不支持
@function 方法
* pval() 获取已经上传成功的文件的url数组
api*/
function pupload() {
    this.constructor = arguments.callee;
};
pupload.prototype = new pupload_template();

/*构造html*/
pupload.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;
    attr.number = attr.number || 1;
    attr.arrange = attr.arrange || this.ptool.arrangeType.horizontal;

    var panelJqTarget = jqElement.find('panel');
    attr.panel = {
        change: panelJqTarget.attr('change'),
        success: panelJqTarget.attr('success'),
        err: panelJqTarget.attr('err'),
        progress: panelJqTarget.attr('progress'),
        clear: panelJqTarget.attr('clear')
    };

    var templateStr = this.getTemplateStr(objBind, childType);
    this.renderView(templateStr, this.controlTypes.pupload.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
pupload.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);

    var inputfileTarget = jqElement.find('[' + this.inputFileMarker + ']');
    this.createEvent(inputfileTarget, this.controlTypes.pupload.name, 'change', window[this.ptool.pstaticEventFnName]);

    if (childType == this.controlTypes.pupload.types[0]) {
        /*jqElement.prender();*/
        if (attr.number == 1) {
            this.createEvent(jqElement.find('[' + this.clearMarker + ']'), this.controlTypes.pupload.name, 'click', window[this.ptool.pstaticEventFnName]);
            this.createEvent(jqElement.find('[' + this.oneFileLiMarker + ']'), this.controlTypes.pupload.name, 'click', window[this.ptool.pstaticEventFnName]);
        }
    } else
        this.createEvent(jqElement.find('[' + this.fileLabelMarker + ']'), this.controlTypes.pupload.name, 'click', window[this.ptool.pstaticEventFnName]);
};

/*处理事件*/
pupload.prototype.eventHandout = function (model, event) {
    var _this = this;
    var jqTarget = $(event[this.ptool.eventCurrTargetName]);
    var ele = jqTarget[0];
    var eventName = event.type;
    var eventJqCurrentTarget = $(event.currentTarget);
    /*input file标签*/
    var inputfileJqTarget = jqTarget.find('[' + this.inputFileMarker + ']');
    /*上传按钮*/
    var fileLabelJqTarget = jqTarget.find('[' + this.fileLabelMarker + ']');
    /*多附件的数量显示标签*/
    var fileNumberJqTarget = jqTarget.find('[' + this.currNumberMarker + ']');
    /*单文件上传的文件区域*/
    var lonelyFileRegionJqTarget = jqTarget.find('[' + this.oneFileLiMarker + ']');
    /*多附件和图片的 存放文件的ul*/
    var fileUlJqTarget = jqTarget.find('[' + this.fileRegionUlMarker + ']');

    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqTarget);
    var _id = jqTarget.attr(this.ptool.libraryIdToHtml);
    var objBind = pupload[_id];
    var orginEvent = objBind.event || {};
    var attr = objBind.attr;
    var panelObj = attr.panel;
    var xHttpName = _this.createXmlhttpName(_id);

    var oldFileNumber = parseInt(fileNumberJqTarget.text()) || 0;

    switch (eventName) {
        case 'click':
            /*上传按钮点击事件*/
            if (eventJqCurrentTarget.attr(this.fileLabelMarker) != null) {
                objBind.fileLabelIndex = -1;
                inputfileJqTarget[0].click();
            }
                /*清除按钮的点击事件*/
            else if (eventJqCurrentTarget.attr(this.clearMarker) != null) {
                if (objBind[xHttpName]) objBind[xHttpName].abort();

                if (typeObj.childType == this.controlTypes.pupload.types[0] && attr.number == 1) {
                    objBind.files = [];
                    lonelyFileRegionJqTarget.hide();
                    fileLabelJqTarget.show();
                } else {
                    var clearLiRegionJqTarget = eventJqCurrentTarget.parent();
                    var index = clearLiRegionJqTarget.index();
                    clearLiRegionJqTarget.remove();
                    objBind.files.splice(index, 1);
                    if (typeObj.childType == this.controlTypes.pupload.types[1])
                        fileLabelJqTarget.parent().show();
                    else {
                        --oldFileNumber;
                        fileNumberJqTarget.text(oldFileNumber);
                        fileLabelJqTarget.pdisable(false);
                    }
                }
                this.executeEventCall(model, event, panelObj.clear);
            }
                /*已上传的文件上的点击重新选择文件事件*/
            else if (eventJqCurrentTarget.attr(this.oneFileLiMarker) != null) {
                objBind.fileLabelIndex = eventJqCurrentTarget.index();
                inputfileJqTarget[0].click();
            }
            break;
            /*文件选择后的改变事件*/
        case 'change':
            var file = inputfileJqTarget[0].files[0];
            var fileRegionJqTarget;

            /*对于attachment类型的单文件上传 的情况*/
            if (typeObj.childType == this.controlTypes.pupload.types[0] && attr.number == 1) {
                fileLabelJqTarget.hide();
                lonelyFileRegionJqTarget.find('[' + this.uploadBarMarker + ']').show();
                lonelyFileRegionJqTarget.find('[' + this.fileNameMarker + ']').text(file.name);
                lonelyFileRegionJqTarget.show();
                fileRegionJqTarget = lonelyFileRegionJqTarget;
            }
                /*对于img类型  以及attachment类型的多上传 且新上传文件 的情况*/
            else if (objBind.fileLabelIndex == -1) {
                var liStr = this.createImgRegion(typeObj.childType, file.name);
                fileUlJqTarget.append(liStr);
                this.createEvent(jqTarget.find('[' + this.clearMarker + ']:last'), this.controlTypes.pupload.name, 'click', window[this.ptool.pstaticEventFnName]);
                this.createEvent(fileUlJqTarget.find('[' + this.oneFileLiMarker + ']:last'), this.controlTypes.pupload.name, 'click', window[this.ptool.pstaticEventFnName]);
                fileRegionJqTarget = fileUlJqTarget.find('li:last');
            }
                /*对于img类型  以及attachment类型的多上传 且覆盖文件 的情况*/
            else {
                var changeFileRegionJqTarget = fileUlJqTarget.children().eq(objBind.fileLabelIndex);
                changeFileRegionJqTarget.find('[' + this.clearMarker + ']').show();
                switch (typeObj.childType) {
                    case this.controlTypes.pupload.types[0]:
                        changeFileRegionJqTarget.find('[' + this.uploadBarMarker + ']').show();
                        changeFileRegionJqTarget.find('[' + this.fileNameMarker + ']').text(file.name);
                        break;
                    case this.controlTypes.pupload.types[1]:
                        changeFileRegionJqTarget.find('[' + this.imgMarkr + ']').attr('src', this.imgUploadingSrc);
                        break;
                }
                fileRegionJqTarget = changeFileRegionJqTarget;
            };
            var uploadXml = pajax.upload({
                file: file,
                success: this.psuccess(jqTarget, objBind, fileRegionJqTarget, panelObj.success),
                progress: this.pprogress(fileRegionJqTarget, panelObj.progress),
                error: this.perror(jqTarget, objBind, fileRegionJqTarget, panelObj.err)
            });
            objBind[xHttpName] = uploadXml;
            fileRegionJqTarget.find('[' + this.fileDisableMarker + ']').pdisable(true);
            inputfileJqTarget[0].value = '';
            event = this.ptool.appendProToEvent(event, { file: file });
            this.executeEventCall(model, event, panelObj.change);
            break;
    }
    pupload[_id] = objBind;
};

/*上传进度回调*/
pupload.prototype.pprogress = function (fileRegionJqTarget, call) {
    return (function (_fileRegionJqTarget, _call) {
        return function (progressObj) {
            var pload = new pupload();
            _fileRegionJqTarget.find('[' + pload.uploadBarMarker + ']').css({
                width: progressObj.probe + '%'
            });
            pload.executeEventCall(null, progressObj, _call);
        };
    })(fileRegionJqTarget, call);
};

/*上传成功后的回调*/
pupload.prototype.psuccess = function (jqTarget, objBind, fileRegionJqTarget, call) {
    return (function (_jqTarget, _objBind, _fileRegionJqTarget, _call) {
        return function (successObj) {
            successObj = successObj || {};
            var pload = new pupload();
            if (successObj.result !== 1) {
                pload.perror(jqTarget, _objBind, _fileRegionJqTarget)({
                    status: 500, responseText: '程序异常', statusText: '程序异常'
                });
                return;
            }

            var fileNumberJqTarget = _jqTarget.find('[' + pload.currNumberMarker + ']');
            var _id = _jqTarget.attr(pload.ptool.libraryIdToHtml);

            var oldFileNumber = parseInt(fileNumberJqTarget.text()) || 0;

            var objBind = pupload[_id];
            var xHttpName = pload.createXmlhttpName(_id);
            var typeObj = pload.ptool.getTypeAndChildTypeFromEle(_jqTarget);

            var xHttpName = pload.createXmlhttpName(_id);
            _objBind[xHttpName] = null;

            var fileUrl = successObj.showUrl + '?ft=' + (typeObj.childType === pload.controlTypes.pupload.types[1] ? '1' : '2');
            var fileInfo = {
                url: fileUrl,
                name: successObj.name,
                suffix: successObj.suffix,
                isNewFile: true
            };
            var fileArr = _objBind.files || [];
            if (_objBind.fileLabelIndex === -1) {
                fileArr.push(fileInfo);
                ++oldFileNumber;
            }
            else fileArr.splice(_objBind.fileLabelIndex, 1, fileInfo);
            _objBind.files = fileArr;
            pupload[_id] = _objBind;

            fileNumberJqTarget.text(oldFileNumber);
            var attr = _objBind.attr;
            if (typeObj.childType == pload.controlTypes.pupload.types[1] || (typeObj.childType == pload.controlTypes.pupload.types[0] && attr.number > 1)) {
                if (_fileRegionJqTarget.siblings().length + 1 == attr.number) {
                    /*上传按钮*/
                    var fileLabelJqTarget = _jqTarget.find('[' + pload.fileLabelMarker + ']');
                    typeObj.childType == pload.controlTypes.pupload.types[1] ? fileLabelJqTarget.parent().hide() : fileLabelJqTarget.pdisable(true);
                }
            }

            _fileRegionJqTarget.find('[' + pload.fileDisableMarker + ']').pdisable(false);
            _fileRegionJqTarget.find('[' + pload.uploadBarMarker + ']').hide();

            switch (typeObj.childType) {
                case pload.controlTypes.pupload.types[1]:
                    _fileRegionJqTarget.find('[' + pload.imgMarkr + ']').attr('src', fileUrl);
                    break;
            }
            pload.executeEventCall(null, null, _call);
        };
    })(jqTarget, objBind, fileRegionJqTarget, call);
};

/*上传失败后的回调*/
pupload.prototype.perror = function (jqTarget, objBind, fileRegionJqTarget, call) {
    return (function (_jqTarget, _objBind, _fileRegionJqTarget, _call) {
        return function (errorObj) {
            /*   error 请求失败后的回调，失败的同时会输出错误信息，回调函数的参数为object，包含属性如下：
        *      readyState http请求的状态    responseText 服务端返回信息内容，即错误原因
        *      status     服务器响应状态码     statusText 服务器响应状态吗释义
            */
            alert('err');
            var pload = new pupload();
            pload.executeEventCall(null, null, _call);
        };
    })(jqTarget, objBind, fileRegionJqTarget, call);
};

/*创建xmlhttprequest在objBind上的属性名称*/
pupload.prototype.createXmlhttpName = function (id) {
    return id + 'XHTTP';
};

/*
*获取或设置已经上传成功的文件的url数组，不传参数时将返回已经上传的文件的数组
*files 为数组，例：[{url:'',name:'',suffix:'',isNewFile:true 是不是新文件}]
*/
pupload.prototype.pval = function (files) {
    var _this = this;
    var ele = arguments[0];
    var jqEle = $(ele);
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = pupload[_id];
    var attr = objBind.attr;
    if (arguments.length == 1) return JSON.parse(JSON.stringify(objBind.files || []));

    var newFiles = [];
    files = arguments[1] || [];
    /*多附件的数量显示标签*/
    var fileNumberJqTarget = jqEle.find('[' + this.currNumberMarker + ']');
    fileNumberJqTarget.text(files.length);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(ele);

    /*多附件和图片的 存放文件的ul*/
    var fileUlJqTarget = jqEle.find('[' + this.fileRegionUlMarker + ']');
    /*上传按钮*/
    var fileLabelJqTarget = jqEle.find('[' + this.fileLabelMarker + ']');
    /*单文件上传的文件区域*/
    var lonelyFileRegionJqTarget = jqEle.find('[' + this.oneFileLiMarker + ']');
    for (var i = 0; i < files.length; i++) {
        var currFile = files[i];
        var url = currFile.url + (currFile.url.indexOf('ft=') == -1 ? '?ft=' + (typeObj.childType === this.controlTypes.pupload.types[1] ? '1' : '2') : '');
        var name = currFile.name || '';
        var suffix = currFile.suffix || '';
        var dindex = name.indexOf('.');
        dindex > -1 ? (suffix = name.substring(dindex + 1), name = name.substring(0, dindex)) : '';
        newFiles.push({
            url: url, name: name, suffix: suffix,
            isNewFile: false
        });
        if (typeObj.childType === this.controlTypes.pupload.types[0] && attr.number === 1) {
            fileLabelJqTarget.hide();
            lonelyFileRegionJqTarget.find('[' + this.fileNameMarker + ']').text(name);
            lonelyFileRegionJqTarget.show();
            break;
        }
        else {
            var liStr = this.createImgRegion(typeObj.childType, name);
            fileUlJqTarget.append(liStr);
            if (typeObj.childType === this.controlTypes.pupload.types[1])
                fileUlJqTarget.children().filter(':last').find('[' + this.imgMarkr + ']').attr('src', url);
            this.createEvent(jqEle.find('[' + this.clearMarker + ']:last'), this.controlTypes.pupload.name, 'click', window[this.ptool.pstaticEventFnName]);
        }
    }
    jqEle.find('[' + this.uploadBarMarker + ']').hide();
    objBind.files = newFiles;
    pupload[_id] = objBind;

    switch (typeObj.childType) {
        case this.controlTypes.pupload.types[0]:
            if (attr.number > 1) {
                if (files.length === attr.number)
                    fileLabelJqTarget.pdisable(true);
                else fileLabelJqTarget.pdisable(false);
            }
            break;
        case this.controlTypes.pupload.types[1]:
            if (files.length === attr.number)
                fileLabelJqTarget.parent().hide();
            else fileLabelJqTarget.parent().show();
            break;
    }
};

/*清除已上传的附件
*/
pupload.prototype.precover = function () {
    var ele = arguments[0];
    var jqEle = $(ele);
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = pupload[_id];
    var attr = objBind.attr;
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(ele);
    /*上传按钮*/
    var fileLabelJqTarget = jqEle.find('[' + this.fileLabelMarker + ']');
    switch (typeObj.childType) {
        case this.controlTypes.pupload.types[0]:
            if (attr.number === 1) {
                /*单文件上传的文件区域*/
                var lonelyFileRegionJqTarget = jqEle.find('[' + this.oneFileLiMarker + ']');
                lonelyFileRegionJqTarget.find('[' + this.fileNameMarker + ']').text('');
                lonelyFileRegionJqTarget.hide();

                fileLabelJqTarget.show();
                break;
            }
        case this.controlTypes.pupload.types[1]:
            /*清空UL*/
            jqEle.find('[' + this.fileRegionUlMarker + ']').empty();
            /*显示并启用上传图片按钮*/
            fileLabelJqTarget.pdisable(false);
            fileLabelJqTarget.parent().show();
            break;
    }
    objBind.files = [];
    jqEle.find('[' + this.currNumberMarker + ']').text(0);
};

/*attachment类型的上传按钮点击事件*/
pupload.uploadBtnClick = function (event) {
    var pload = new pupload();
    var jqTarget = $(event.currentTarget).parent();
    var ele = jqTarget[0];
    var inputfileJqTarget = jqTarget.find('[' + pload.inputFileMarker + ']');
    var typeObj = pload.ptool.getTypeAndChildTypeFromEle(jqTarget);

    var _id = jqTarget.attr(pload.ptool.libraryIdToHtml);
    var objBind = pupload[_id];
    objBind.fileLabelIndex = -1;
    inputfileJqTarget[0].click();
};
;﻿function ptree_template() {
    this.constructor = arguments.callee;
    this.foldIconObj = {
        b: 'r', r: 'b'
    };
    this.foldMarker = 'fold';
    this.treeRegionMarker = 'treeregion';
    this.bodyRegionMarker = 'bodymarker';
    this.itemTitleMarker = 'itemtext';
    this.itemTitleValMarker = 'itemtextval';
    this.resultUlMarker = 'rul';
    this.resultMarker = 'sresult';
    this.operMarker = 'operd';
    this.operUlMarker = 'operdul';
    this.treeSearchMarker = 'tsm';

    this.singleCss = 'per-structure-single';
    this.panelCss = 'per-structure-default';
    this.selCss = 'per-tree-ts_active';

    this.start = '<div ' + this.ptool.maxDivMarker + ' class="per-structure-normal ';
    this.start2 = '"{{id}}>';

    this.searchStr = '<div class="per-structure-title"><psearch-promptly ' + this.treeSearchMarker +
                     ' change="ptree.searchPromptly"></psearch-promptly></div>';

    this.conout1 = '<div class="per-structure-con" ' + this.bodyRegionMarker + '><pscroll-small templateid="';
    this.conout2 = '"></pscroll-small></div></div>';

    this.conSearchResultRegion = '<div ' + this.resultMarker + ' class="per-tree-soso_result"><ul ' + this.resultUlMarker + '></ul></div>';
    this.conOperStr = '<div class="per-tree-ts"><span ' + this.operMarker;
    this.conOperStr2 = '>n</span><ul ' + this.operUlMarker + ' style="display: none;"';
    this.conOperStr3 = '><li>选择所有子级</li><li>选择下一级</li><li>取消选择所有子级</li></ul></div>';
};

ptree_template.prototype = new persagyElement();

ptree_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    var panelObj = attr.panel;
    var itemObj = attr.item;

    var start = this.start + (panelObj ? this.panelCss : '') + this.start2 + (attr.issearch === true ? this.searchStr : '');

    var scrollTemplateCon = this.conSearchResultRegion;
    var scrollTemplateId = ptool.produceId();
    var forTemplateStr = '';
    var forTemplateId = ptool.produceId();

    /*创建for循环模板*/
    var ptb = persagy_toBind.getInstance();
    var conOperStr = '';
    switch (ptb.currFrameType) {
        case ptb.frameTypes.ko:
            conOperStr = this.conOperStr + ' data-bind="click:' + this.ptool.pbindEventFnName + '"' +
                         this.conOperStr2 + ' data-bind="click:' + this.ptool.pbindEventFnName + '"' + this.conOperStr3;
            scrollTemplateCon += '<div ' + this.treeRegionMarker + ' class="per-tree-wrap" data-bind="template:{name:' + forTemplateId +
                            ',foreach:' + attr.datasource + '}"></div>';
            var itemIdBindStr = ',attr:{' + this.itemTitleMarker + ':' + (itemObj.itemid || "''") + '}';
            forTemplateStr = '<div class="per-tree-temp"><div data-bind="click:' + this.ptool.pbindEventFnName +
                            ',style:{\'padding-left\':(level*15+20)+\'px\'}' + itemIdBindStr + '" class="per-tree-title' +
                            (attr.number === 1 ? ' per-structure-single' : '') +
                            '"><div class="per-slh"><span ' + this.foldMarker + ' class="per-tree-arrow" data-bind="click:' +
                            this.ptool.pbindEventFnName + ',style:{visibility:' + itemObj.child + '&&' + itemObj.child +
                            '.length>0?\'visible\':\'hidden\'}">' + this.foldIconObj.b + '</span><b ' + this.itemTitleValMarker +
                            ' data-bind="text:' + itemObj.text +
                            '"></b></div>' + (attr.number === 1 ? '' : conOperStr) + '</div><div class="per-tree-con" style="display:none;" ' +
                            'data-bind="template:{name:' + forTemplateId + ',foreach:' + itemObj.child + '}"></div></div>';

            break;
        case ptb.frameTypes.Vue:
            conOperStr = this.conOperStr + ' @click="' + this.ptool.pbindEventFnName + '(model,$event)"' +
                         this.conOperStr2 + ' @click="' + this.ptool.pbindEventFnName + '(model,$event)"' + this.conOperStr3;
            var vueCustomTagName = 'vuetag' + forTemplateId;
            scrollTemplateCon += '<div class="per-tree-wrap" ' + this.treeRegionMarker + '><' + vueCustomTagName + ' v-for="item in ' +
                                attr.datasource + '" :model="item"></' + vueCustomTagName + '></div>';
            var itemIdBindStr = ' v-bind:' + this.itemTitleMarker + '="' + (itemObj.itemid ? 'model.' + itemObj.itemid : "''") + '"';
            forTemplateStr = '<div class="per-tree-temp"><div ' + itemIdBindStr + '  @click="' + this.ptool.pbindEventFnName +
                             '(model,$event)" v-bind:style="{\'padding-left\':(model.level*15+20)+\'px\'}" class="per-tree-title' +
                             (attr.number === 1 ? ' per-structure-single' : '') +
                            '"><div class="per-slh"><span ' + this.foldMarker + ' class="per-tree-arrow" @click="' + this.ptool.pbindEventFnName +
                             '(model,$event)" v-bind:style="{visibility:model.' + itemObj.child + '&&model.' + itemObj.child +
                             '.length>0?\'visible\':\'hidden\'}">' + this.foldIconObj.b + '</span><b ' + this.itemTitleValMarker +
                             ' v-text="model.' + itemObj.text +
                            '"></b></div>' + (attr.number === 1 ? '' : conOperStr) + '</div><div class="per-tree-con" style="display:none;" ' +
                            '><' + vueCustomTagName + ' v-for="item in model.' + itemObj.child + '" :model="item"></' + vueCustomTagName + '></div></div>';
            break;
    }

    this.ptool.createDynamicTemplate(scrollTemplateCon, scrollTemplateId);
    this.ptool.createDynamicTemplate(forTemplateStr, forTemplateId);
    if (ptb.currFrameType == ptb.frameTypes.Vue) {
        Vue.component(vueCustomTagName, {
            template: '#' + forTemplateId,
            props: {
                model: Object
            },
            methods: {}
        });
    };

    var end = this.conout1 + scrollTemplateId + this.conout2;
    return start + end;
};
;/*api
@class ptree 树形菜单，bind必须为true才可创建树
@mainattr 
@child 子类型
* normal
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，必须为true，默认true，可省略此属性，现支持的框架有：ko、vue boolean
* number 此值为1时，树仅支持单选，大于1时多选，默认为1 string
* datasource 数据源名称 string
* width 带有面板时，此属性必须设定值，需放到panel标签上 number
* height 带有面板时，此属性必须设定值，需放到panel标签上 number
* issearch 是否带有搜索功能，需放到item标签上，默认true boolean
* itemid 节点ID对应的属性名称，需放到item标签上 string
* text 节点显示值对应的属性名称，需放到item标签上 string
* disabled 节点是否禁用对应的属性名称，需放到item标签上 string
* child 子级对应的属性名称，需放到item标签上 string
@event 事件
* sel 每项的选择事件
@css 样式，暂不支持
@function 方法
* pshow() 显示面板
* phide() 隐藏窗口
api*/
function ptree() {
    this.constructor = arguments.callee;
};
ptree.prototype = new ptree_template();

/*构造html*/
ptree.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;
    attr.bind = true;
    attr.number = attr.number > 1 ? attr.number : 1;

    var jqPanelTarget = jqElement.find('panel');
    if (jqPanelTarget.length > 0)
        attr.panel = {
            width: jqPanelTarget.attr('width'),
            height: jqPanelTarget.attr('height')
        };

    var jqItemTarget = jqElement.find('item');
    attr.item = {
        itemid: jqItemTarget.attr('itemid'),
        text: jqItemTarget.attr('text'),
        disabled: jqItemTarget.attr('disabled'),
        child: jqItemTarget.attr('child'),
        issearch: jqItemTarget.attr('issearch')
    };
    attr.issearch = attr.item.issearch === 'false' ? false : true;
    var templateStr = this.getTemplateStr(objBind, childType);
    this.renderView(templateStr, this.controlTypes.ptree.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
ptree.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);

    var _id = jqElement.attr(this.ptool.libraryIdToHtml);
    var typeStr = this.controlTypes.ptree.name + this.ptool.typeSeparator + childType;
    var treeRegionJqTarget = jqElement.find('[' + this.treeRegionMarker + ']');
    treeRegionJqTarget.attr(this.ptool.libraryTypeToHtml, typeStr);
    treeRegionJqTarget.attr(this.ptool.libraryIdToHtml, _id);

    var searchResultJqTarget = jqElement.find('[' + this.resultMarker + ']');
    searchResultJqTarget.attr(this.ptool.libraryTypeToHtml, typeStr);
    searchResultJqTarget.attr(this.ptool.libraryIdToHtml, _id);

    var contentJqTarget = jqElement.find('[' + this.bodyRegionMarker + ']');
    var maxWidth = contentJqTarget.width();
    var maxHeight = contentJqTarget.height();
    var scrollTypeStr = this.controlTypes.pscroll.name + this.ptool.typeSeparator + this.controlTypes.pscroll.types[0];
    jqElement.find(scrollTypeStr).css({
        'max-width': maxWidth + 'px',
        'max-height': maxHeight + 'px'
    });

    /*jqElement.prender();*/
    if (attr.issearch) {
        this.createEvent(jqElement.find('[' + this.resultUlMarker + ']'), this.controlTypes.ptree.name, 'click', window[this.ptool.pstaticEventFnName]);
    }
};

/*处理事件*/
ptree.prototype.eventHandout = function (model, event) {
    var _this = this;
    var jqTarget = $(event[this.ptool.eventCurrTargetName]);
    var _id = jqTarget.attr(this.ptool.libraryIdToHtml);

    var eventType = event.type;
    var eventJqCurrentTarget = $(event.currentTarget);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqTarget);

    var objBind = ptree[_id];
    var attr = objBind.attr;
    var orginEvent = objBind.event || {};
    switch (eventType) {
        case 'click':
            /*展开收起下级*/
            if (eventJqCurrentTarget.attr(this.foldMarker) != null) {
                var childJqTarget = eventJqCurrentTarget.parent().parent().next();
                var slideFn = childJqTarget.is(':hidden') ? 'slideDown' : 'slideUp';
                childJqTarget[slideFn]();
                eventJqCurrentTarget.text(this.foldIconObj[eventJqCurrentTarget.text()]);
            }
                /*某级选中或取消选中*/
            else if (eventJqCurrentTarget.attr(this.itemTitleMarker) != null) {
                if (attr.number === 1 && !eventJqCurrentTarget.hasClass(this.selCss)) {
                    jqTarget.find('[' + this.itemTitleMarker + ']').removeClass(this.selCss);
                }
                eventJqCurrentTarget.toggleClass(this.selCss);
                event[this.eventOthAttribute] = { state: eventJqCurrentTarget.hasClass(this.selCss) };
                this.executeEventCall(model, event, orginEvent.sel);
                var _oldSelNodeModelArr = objBind[this.ptool.controlPrivateToProName] || [];
                if (eventJqCurrentTarget.hasClass(this.selCss)) _oldSelNodeModelArr.push(model);
                else {
                    for (var i = 0; i < _oldSelNodeModelArr.length; i++) {
                        var currSelNodeModel = _oldSelNodeModelArr[i];
                        if (currSelNodeModel.level === model.level && currSelNodeModel[attr.item.text] === model[attr.item.text]) {
                            _oldSelNodeModelArr.splice(i, 1);
                            break;
                        }
                    }
                }
                objBind[this.ptool.controlPrivateToProName] = _oldSelNodeModelArr;
                ptree[_id] = objBind;
            }
                /*搜索结果列表点击事件*/
            else if (eventJqCurrentTarget.attr(this.resultUlMarker) != null) {
                var liJqTarget = $(event.target);
                if (liJqTarget[0].tagName != 'LI') liJqTarget = liJqTarget.parent();
                liJqTarget.toggleClass(this.selCss);

                var ele = jqTarget[0];
                var _oldPpro = ele[this.ptool.libraryToPro] || {};
                var searchResultJqTargetArr = _oldPpro[this.ptool.controlPrivateToProName];
                var liIndex = liJqTarget.index();
                searchResultJqTargetArr[liIndex][0].click();
            }
                /*更多操作的省略号点击事件*/
            else if (eventJqCurrentTarget.attr(this.operMarker) != null) {
                //先收起后展开wyy
                if (!eventJqCurrentTarget.next().is(":visible")) {
                    $('[' + this.operUlMarker + ']').hide();
                }
                eventJqCurrentTarget.next().toggle();
            }
                /*更多操作内的每项操作点击事件*/
            else if (eventJqCurrentTarget.attr(this.operUlMarker) != null) {
                eventJqCurrentTarget.prev()[0].click();
                var operLiJqTarget = $(event.target);
                var operLiIndex = operLiJqTarget.index();
                var childJqTarget = eventJqCurrentTarget.parent().parent().next();
                var allChildTitleJqTarget = childJqTarget.find('[' + this.itemTitleMarker + ']');
                /*选择下一级*/
                if (operLiIndex == 1) {
                    var firstChildTitleJqTarget = allChildTitleJqTarget.eq(0);
                    if (!firstChildTitleJqTarget.hasClass(this.selCss)) firstChildTitleJqTarget[0].click();
                } else {
                    for (var x = 0; x < allChildTitleJqTarget.length; x++) {
                        var currTitleJqTarget = allChildTitleJqTarget.eq(x);
                        switch (operLiIndex) {
                            case 0:     /*选择所有子级*/
                                if (!currTitleJqTarget.hasClass(this.selCss)) currTitleJqTarget[0].click();
                                break;
                            case 2:     /*取消选择所有子级*/
                                if (currTitleJqTarget.hasClass(this.selCss)) currTitleJqTarget[0].click();
                                break;
                        }
                    }
                }
            }
            break;
    }
};

/*
*清空搜索框和已选择的项
*isClearSel 为true时，会把所有已选择的项清除，默认true
*/
ptree.prototype.precover = function (isClearSel) {
    var ele = arguments[0];
    var jqEle = $(ele);
    isClearSel = arguments[1] === false ? false : true;

    jqEle.find('[' + this.treeSearchMarker + ']').precover();
    if (isClearSel) {
        jqEle.find('[' + this.itemTitleMarker + ']').removeClass(this.selCss);
        var _id = jqEle.attr(this.ptool.libraryIdToHtml);
        var objBind = ptree[_id];
        objBind[this.ptool.controlPrivateToProName] = [];
        ptree[_id] = objBind;
    }
};

/*
*选中节点或取消选中节点；不传参数时返回当前所有选择的节点对应的model组成的数组
*objParam  {nodeId:'节点ID',isEvent:true,type:1}
*isEvent 默认true，为true时会激发节点ID对应项的click事件
*type 0 取消选中；1 选中； 2 在选中与取消选中中间轮换
*/
ptree.prototype.psel = function (objParam) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = ptree[_id];
    var _oldSelNodeModelArr = objBind[this.ptool.controlPrivateToProName] || [];
    if (arguments.length === 1) return _oldSelNodeModelArr;

    objParam = arguments[1] || {};
    var nodeId = objParam.nodeId;
    var isEvent = objParam.isEvent === false ? false : true;
    var type = objParam.type;

    var currItemJqTarget = jqEle.find('[' + this.itemTitleMarker + '="' + nodeId + '"]');
    if (currItemJqTarget.length == 0) return false;
    switch (type) {
        case 0:
            if (isEvent) {
                currItemJqTarget.addClass(this.selCss);
                currItemJqTarget[0].click();
            } else
                currItemJqTarget.removeClass(this.selCss);
            break;
        case 1:
            if (isEvent) {
                currItemJqTarget.removeClass(this.selCss);
                currItemJqTarget[0].click();
            } else
                currItemJqTarget.addClass(this.selCss);
            break;
        case 2:
            if (isEvent)
                currItemJqTarget[0].click();
            else
                currItemJqTarget.toggleClass(this.selCss);
            break;
    }
};

/*内部搜索事件*/
ptree.searchPromptly = function (event) {
    var treeObj = new ptree();
    var key = event[treeObj.ptool.eventOthAttribute].key;
    var searchJqTarget = $(event[treeObj.ptool.eventCurrTargetName]);
    var jqTarget = searchJqTarget.parent().next().find('[' + treeObj.treeRegionMarker + ']');
    var resultJqTarget = jqTarget.prev();
    var resultUlJqTarget = resultJqTarget.find('[' + treeObj.resultUlMarker + ']');
    if (!key) {
        resultJqTarget.hide();
        jqTarget.show();
        return;
    }
    jqTarget.hide();
    resultJqTarget.show();

    var itemJqTargets = jqTarget.find('[' + treeObj.itemTitleMarker + ']');
    var searchResultJqTargetArr = [];
    var liStr = '';
    for (var i = 0; i < itemJqTargets.length; i++) {
        var currItemJqTarget = itemJqTargets.eq(i);
        var currText = currItemJqTarget.find('[' + treeObj.itemTitleValMarker + ']').text();
        if (currText.indexOf(key) == -1) continue;
        searchResultJqTargetArr.push(currItemJqTarget);
        var splitObj = treeObj.ptool.splitStrByKey(key, currText);
        if (splitObj) {
            liStr += '<li class="' + (currItemJqTarget.hasClass(treeObj.selCss) ? treeObj.selCss : '') + '">' +
                    splitObj.start + '<em class="per-searchbox-select_color">' + splitObj.key + '</em>' + splitObj.end + '</li>';
        }
    }

    resultUlJqTarget.empty();
    resultUlJqTarget.append(liStr);
    var ele = resultJqTarget[0];
    var _oldPpro = ele[treeObj.ptool.libraryToPro] || {};
    _oldPpro[treeObj.ptool.controlPrivateToProName] = searchResultJqTargetArr;
    ele[treeObj.ptool.libraryToPro] = _oldPpro;
};
;﻿function ptime_template() {
    this.constructor = arguments.callee;
    this.calendarDefaultTimeTypeArr = ['d', 'w', 'M', 'y', 'h', 'm', 's'];
    this.calendarTimeTypeShow = {
        'd': '日', 'w': '周', 'M': '月', 'y': '年', 'h': '时', 'm': '分', 's': '秒'
    };
    this.calendarCommonTimeArr = ['d', 'pd', 'w', 'pw', 'M', 'pM', 'y', 'py'];
    this.calendarCommonTimeShow = {
        'd': '今天', 'pd': '昨天', 'w': '本周', 'pw': '上周',
        'M': '本月', 'pM': '上月', 'y': '今年', 'py': '去年'
    };
    this.lockObj = {
        c: 's', /*代表解锁*/
        s: 'c'
    };

    this.commonTimeLiMarker = 'commontimeli';
    this.contentNavigationLiMarker = 'navili';
    this.panelConMaxMarker = 'pcontm';
    this.panelConYearComboxMarker = 'yearbox';
    this.panelConCrossYearComboxMarker = 'crossyearbox';
    this.panelConMonthComboxMarker = 'monthbox';
    this.orientationMarker = 'orientationm';
    this.columnUlMarker = 'columnul';
    this.columnLiMarker = 'ival';
    this.selTimeShowRegionMarker = 'seltimeshowre';
    this.panelToggleMarker = 'arrowto';
    this.panelConHeaderQuickMarker = 'panelquickto';
    this.footLockMarker = 'footlock';
    this.contentMaxMarker = 'maxcon';
    this.headerWeekMarker = 'hdwkmr';
    this.stepUnitMarker = 'stepunit';
    this.stepValueMarker = 'stepval';
    this.tempSelTimeMarker = 'temptimeval';
    this.okBtnMarker = 'okt';
    this.timeTypeMarker = 'tmk';

    this.defaultMinYear = 1900;
    this.defaultMaxYear = 2099;
    this.oneDayMillSeconds = 1000 * 60 * 60 * 24;
    this.crossYearStep = 12;
    this.weekUnit = 'th';
    this.dateSperator = '-';
    this.timeSperator = ':';
    this.hourSperator = ' ';

    this.commonTimeSelCss = 'per-calendar_location_active';
    this.contentNavigationSelCss = 'per-calendar_details_active';
    this.columnSelCss = 'per-calendar_main_active';
    this.columnInCss = 'per-calendar_main_hover';
    this.toggleArrowCss = '_calendar-arrows-avtive';

    this.calendarShowRegion = '<div class="per-calendar-title">' +
                              '<div class="_time-left"><pbutton-white icon="l" click="ptime.headerQuickSelEvent" ' + this.orientationMarker + '="' +
                              this.ptool.orientation.left + '"></pbutton-white></div>' + '<div class="per-calendar-text" ' +
                              this.selTimeShowRegionMarker + '>此处显示当前选择的时间</div>' +
                              '<div class="_time-right"><pbutton-white ' + this.orientationMarker + '="' + this.ptool.orientation.right +
                              '" icon="r" click="ptime.headerQuickSelEvent"></pbutton-white></div></div>';

};

ptime_template.prototype = new persagyElement();

ptime_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    var panelObj = attr.panel;

    switch (childType) {
        case this.controlTypes.ptime.types[0]:
            var zoneTypeArr = panelObj.timetype || [];
            var str = '';
            for (var i = 0; i < zoneTypeArr.length; i++) {
                var currZoneType = zoneTypeArr[i];
                var formPrefix = this.calendarTimeTypeShow[currZoneType];
                var start, end;
                var headerEventStr = '';
                switch (currZoneType) {
                    case this.calendarDefaultTimeTypeArr[3]:
                        start = panelObj.startyear;
                        end = panelObj.endyear;
                        break;
                    case this.calendarDefaultTimeTypeArr[2]:
                        start = 1;
                        end = 12;
                        break;
                    case this.calendarDefaultTimeTypeArr[0]:
                        start = 0;
                        end = -2;
                        headerEventStr = 'click="ptime.formTimeDateHeaderEvent"';
                        break;
                    case this.calendarDefaultTimeTypeArr[4]:
                        start = 0;
                        end = 23;
                        break;
                    case this.calendarDefaultTimeTypeArr[5]:
                    case this.calendarDefaultTimeTypeArr[6]:
                        start = 0;
                        end = 59;
                        break;
                }
                var cbstr = '<pcombobox-time ' + this.timeTypeMarker + '="' + currZoneType +
                        '" sel="ptime.formTimeSelEvent" isborder="true"><header prefix="' + formPrefix +
                       '" ' + headerEventStr + '></header><item start="' + start + '" end="' + end + '"></item></pcombobox-time>';
                str += '<div class="time-box' + (currZoneType === this.calendarDefaultTimeTypeArr[4] ? ' hour-box' : '') + '">' + cbstr + '</div>';
            }
            return '<div {{id}}{{disabled}} class="per-time-chart" ' + this.ptool.maxDivMarker + '>' + str + '</div>';
        case this.controlTypes.ptime.types[1]:
            /*常用时间区域*/
            var commonTimeRegion = '';
            if (panelObj.iscommontime) {
                var commonTimeLiStr = '<li class="per-calendar_location_tit">常用时间</li>';
                for (var i = 0; i < panelObj.commontime.length; i++) {
                    commonTimeLiStr += '<li ' + this.commonTimeLiMarker + '="' + panelObj.commontime[i] +
                        '" class="per-calendar_location_item">' +
                        this.calendarCommonTimeShow[panelObj.commontime[i]] + '</li>';
                }
                commonTimeRegion = '<div class="per-calendar_location"><ul>' + commonTimeLiStr + '</ul></div>';
            }

            /*内容区导航*/
            var naviLiStr = '';
            for (var j = 0; j < panelObj.timetype.length; j++) {
                naviLiStr += '<li class="per-calendar_details_item" ' + this.contentNavigationLiMarker + '="' +
                            panelObj.timetype[j] + '">' + this.calendarTimeTypeShow[panelObj.timetype[j]] + '</li>';
            }
            var contentNavigationStr = '<div class="per-calendar_details_nav"><ul>' + naviLiStr + '</ul></div>';

            /*内容区面板*/
            var leftStr = this.createPanel(this.ptool.orientation.left, objBind);
            var middleToggleStr = '', rightStr = '';
            if (panelObj.double === true) {
                if (panelObj.doubletoggle === true)
                    middleToggleStr = '<div class="per-calendar-arrows"><div class="per-calendar-arrows_but" ' + this.panelToggleMarker +
                                      '>></div></div>';
                rightStr = this.createPanel(this.ptool.orientation.right, objBind);
            }
            var contentPanelStr = '<div class="per-calendar_details_con">' + leftStr + middleToggleStr + rightStr + '</div>'


            /*内容区底部*/
            var contentFooterStr = '<div class="per-calendar_details_footer">' +
                                   (panelObj.lock === true ? '<div class="per-calendar-lock"><em class="icon" ' + this.footLockMarker +
                                   '>' + this.lockObj.s + '</em><em style="display:none;">锁定步长为<em class="color countVal" ' +
                                   this.stepValueMarker + '>0</em><em class="countDateType" ' + this.stepUnitMarker +
                                   '>日</em></em></div>' : '')
                                   + '<div class="per-calendar-selecttime">已选时间：<em class="countTime" ' +
                                   this.tempSelTimeMarker + '>2016~2017</em></div>' +
                                   '<div class="per-calendar-but"><pbutton-blue text="确定" ' + this.okBtnMarker +
                                   ' click="ptime.timeOkEvent"></pbutton-blue></div></div>';

            var contentMainRegionStr = '<div class="per-calendar_details">' + contentNavigationStr + contentPanelStr + contentFooterStr + '</div>';

            var contentStr = '<div class="per-calendar-con" ' + this.contentMaxMarker + '>' + commonTimeRegion + contentMainRegionStr + '</div>';


            return '<div ' + this.ptool.maxDivMarker + ' class="per-time-calendar" {{id}}>' + this.calendarShowRegion + contentStr + '</div>';
    }
};

ptime_template.prototype.createPanel = function (orieignType, objBind) {
    var attr = objBind.attr;
    var panelObj = attr.panel;
    return '<div class="per-calendar_main" ' + this.orientationMarker + '="' + orieignType + '" ' + this.panelConMaxMarker + '>' +
           '<div class="per-calendar_main_menu">' +
           '<div class="_menu-icon _menu-prev" ' + this.panelConHeaderQuickMarker + '="' + this.ptool.orientation.left + '" ' +
                this.orientationMarker + '="' + orieignType + '"><</div>' +
           '<div class="_menu-icon _menu-next" ' + this.panelConHeaderQuickMarker + '="' + this.ptool.orientation.right + '" ' +
                this.orientationMarker + '="' + orieignType + '">></div>' +
           '<div class="per-calendar_combobox" ' + this.panelConCrossYearComboxMarker + '>' +
                '<pcombobox-time sel="ptime.panelTimeComboxSelEvent" isborder="false" ' + this.orientationMarker + '="' + orieignType +
                '"><header prefix="年"></header><item start="' +
                panelObj.startyear + '" end="' + panelObj.endyear + '" step="' + this.crossYearStep + '"></item></pcombobox-time></div>' +
           '<div class="per-calendar_combobox" ' + this.panelConYearComboxMarker + '>' +
                '<pcombobox-time sel="ptime.panelTimeComboxSelEvent" isborder="false" ' + this.orientationMarker + '="' + orieignType +
                '"><header prefix="年"></header><item start="' +
                panelObj.startyear + '" end="' + panelObj.endyear + '"></item></pcombobox-time></div>' +
           '<div class="per-calendar_combobox" ' + this.panelConMonthComboxMarker + '>' +
                '<pcombobox-time sel="ptime.panelTimeComboxSelEvent" isborder="false" ' + this.orientationMarker + '="' + orieignType +
                '"><header prefix="月"></header><item start="1" end="12"></item></pcombobox-time></div>' +
           '</div>' +
           '<div class="per-calendar-day">' +
           '<div class="per-calendar_main_week" ' + this.headerWeekMarker + '>' +
           '<ul><li class="per-calendar_main_item _week-item">日</li>' +
           '<li class="per-calendar_main_item _week-item">一</li>' +
           '<li class="per-calendar_main_item _week-item">二</li>' +
           '<li class="per-calendar_main_item _week-item">三</li>' +
           '<li class="per-calendar_main_item _week-item">四</li>' +
           '<li class="per-calendar_main_item _week-item">五</li>' +
           '<li class="per-calendar_main_item _week-item">六</li>' +
           '</ul></div>' +
           '<ul class="per-calendar-wrap_main" ' + this.orientationMarker + '="' + orieignType + '" ' + this.columnUlMarker +
           '></ul></div></div>';
};
;/*api
@class ptime 时间控件
@mainattr 
@child 子类型
* form 表单时间控件
* calendar 日历
@attr 属性
* id 控件ID string
* startyear 年份最小值，默认1900，需放到panel标签上 number
* endyear 年份最大值，默认2099，需放到panel标签上 number
* timetype 时间类型，值包括：m(分)、h(时)、d(日)、w(周)、M(月)、y(年)，需放到panel标签上，数组中的第一项将作为默认选中的类型；不传时创建全部，此时的日作为默认类型，如：'yd'则创建带有年和日切换按钮的控件 Array
* double 是否创建结束面板，calendar类型专用，需放到panel标签上，默认true boolean
* doubletoggle 是否需要展开收起结束面板的按钮，calendar类型专用，需放到panel标签上，默认true boolean
* lock 是否创建锁定按钮，calendar类型专用，需放到panel标签上，默认true boolean
* commontime 常用时间，calendar类型专用，需放到panel标签上，默认创建全部，值包括：d(今天),pd(昨天),w(本周),pw(上周),M(本月),pM(上月),y(今年),py(去年)，如：['d','py']则创建带有今天和去年选项控件 Array
* iscommontime 是否创建常用时间按钮，需放到panel标签上，默认true boolean
@event 事件
* sel 时间选择事件
@css 样式，暂不支持
@function 方法
* psel(objParm,isEvent) 获取或设置时间及时间类型；不传参时则获取时间及时间类型。#param:objParm:object:例：对于calendar类型{timeType:'可能的值同创建控件时的timetype',startTime:'符合时间格式的字符串或毫秒数',endTime:'符合时间格式的字符串或毫秒数'},对于form类型，M从1开始,{y:2017,M:1,h:0}
* plock(objParm,isEvent) 锁定时间控件。#param:objParm:object:参数同psel方法
api*/
function ptime() {
    this.constructor = arguments.callee;
};
ptime.prototype = new ptime_template();

/*构造html*/
ptime.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;

    var jqPanelTarget = jqElement.find('panel');
    var timeTypeArr = (jqPanelTarget.attr('timetype') || '').split('');
    var commonTimeArr = eval(jqPanelTarget.attr('commontime'));
    attr.panel = {
        startyear: parseInt(jqPanelTarget.attr('startyear')) || this.defaultMinYear,
        endyear: parseInt(jqPanelTarget.attr('endyear')) || this.defaultMaxYear,
        double: jqPanelTarget.attr('double') === 'false' ? false : true,
        doubletoggle: jqPanelTarget.attr('doubletoggle') === 'false' ? false : true,
        lock: jqPanelTarget.attr('lock') === 'false' ? false : true,
        timetype: timeTypeArr.length > 0 ? timeTypeArr : this.calendarDefaultTimeTypeArr,
        commontime: commonTimeArr || this.calendarCommonTimeArr,
        iscommontime: jqPanelTarget.attr('iscommontime') === 'false' ? false : true
    };

    var templateStr = this.getTemplateStr(objBind, childType);
    this.renderView(templateStr, this.controlTypes.ptime.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
ptime.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);

    /*jqElement.prender();*/

    if (childType === this.controlTypes.ptime.types[1]) {
        /*显示的选择时间面板点击事件，弹出日历*/
        this.createEvent(jqElement.find('[' + this.selTimeShowRegionMarker + ']'), this.controlTypes.ptime.name, 'click', window[this.ptool.pstaticEventFnName]);

        /*常用区域按钮点击事件*/
        var commonLiJqTargets = jqElement.find('[' + this.commonTimeLiMarker + ']');
        for (var i = 0; i < commonLiJqTargets.length; i++) {
            this.createEvent(commonLiJqTargets.eq(i), this.controlTypes.ptime.name, 'click', window[this.ptool.pstaticEventFnName]);
        }

        /*内容区导航，即时间类型切换事件*/
        var contentNavigationLiJqTargets = jqElement.find('[' + this.contentNavigationLiMarker + ']');
        for (var i = 0; i < contentNavigationLiJqTargets.length; i++) {
            var currNavigationLiJqTargets = contentNavigationLiJqTargets.eq(i);
            this.createEvent(currNavigationLiJqTargets, this.controlTypes.ptime.name, 'click', window[this.ptool.pstaticEventFnName]);
        }

        /*内容区面板，头部左右切换按钮点击事件*/
        var contentHeaderQuickJqTargets = jqElement.find('[' + this.panelConHeaderQuickMarker + ']');
        for (var i = 0; i < contentHeaderQuickJqTargets.length; i++) {
            this.createEvent(contentHeaderQuickJqTargets.eq(i), this.controlTypes.ptime.name, 'click', window[this.ptool.pstaticEventFnName]);
        }

        /*内容区面板，中间按钮点击事件，以展开收起后面面板*/
        var contentArrowJqTargets = jqElement.find('[' + this.panelToggleMarker + ']');
        this.createEvent(contentArrowJqTargets, this.controlTypes.ptime.name, 'click', window[this.ptool.pstaticEventFnName]);

        /*内容区面板，底部锁的点击事件*/
        var lockJqTargets = jqElement.find('[' + this.footLockMarker + ']');
        this.createEvent(lockJqTargets, this.controlTypes.ptime.name, 'click', window[this.ptool.pstaticEventFnName]);

        /*内容区面板，每一个格子的点击事件---注：注册在格子的父级ul上的*/
        var columnParentJqUls = jqElement.find('[' + this.columnUlMarker + ']');
        for (var i = 0; i < columnParentJqUls.length; i++) {
            this.createEvent(columnParentJqUls.eq(i), this.controlTypes.ptime.name, 'click', window[this.ptool.pstaticEventFnName]);
        }

        /*内容区导航 默认选中第一个时间类型*/
        var timeType = contentNavigationLiJqTargets.eq(0).attr(this.contentNavigationLiMarker);
        jqElement.psel({
            timeType: timeType,
            startTime: new Date().getTime(),
            endTime: new Date().getTime()
        }, false);
    } else {
        var nowDate = new Date();
        var maxDay = nowDate.getMonthLength();
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1;
        var dateJqTarget = jqElement.find('[' + this.timeTypeMarker + '="' + this.calendarDefaultTimeTypeArr[0] + '"]');
        if (dateJqTarget.length > 0) this.formTimeDateListReset(year, month, dateJqTarget);
        jqElement.psel({
            y: year,
            M: month,
            d: nowDate.getDate(),
            h: nowDate.getHours(),
            m: nowDate.getMinutes(),
            s: nowDate.getSeconds()
        }, false);
    }
};

/*处理事件----暂只有calendar类型的*/
ptime.prototype.eventHandout = function (model, event) {
    var _this = this;
    var jqTarget = $(event[_this.ptool.eventCurrTargetName]);
    var ele = jqTarget[0];
    var eventType = event.type;
    var eventJqCurrentTarget = $(event.currentTarget);
    var typeObj = _this.ptool.getTypeAndChildTypeFromEle(jqTarget);
    var _id = jqTarget.attr(_this.ptool.libraryIdToHtml);
    var objBind = ptime[_id];
    var panelObj = objBind.attr.panel;
    var orginEvent = objBind.event || {};
    var minYear = panelObj.startyear;
    var maxYear = panelObj.endyear;

    var _tempObj = _this.getStoreTime(ele).temp;
    _tempObj.ele = ele;

    switch (eventType) {
        case 'click':
            /*点击头部显示选择的时间的区域，弹出日历*/
            if (eventJqCurrentTarget.attr(_this.selTimeShowRegionMarker) != null) {
                //时间控件位置wyy
                //var offset = jqTarget.offset();
                //jqTarget.find('[' + this.contentMaxMarker + ']').css({
                //    left: offset.left,
                //    top: offset.top + 42,
                //    position: 'fixed'
                //})
                jqTarget.find('[' + this.contentMaxMarker + ']').toggle();
            }
                /*内容区的导航点击事件，即时间类型切换*/
            else if (eventJqCurrentTarget.attr(_this.contentNavigationLiMarker) != null) {
                navigationEvent();
            }
                /*内容区的头部下拉框两侧的按钮事件*/
            else if (eventJqCurrentTarget.attr(_this.panelConHeaderQuickMarker) != null) {
                conHeaderQuckEvent();
            }
                /*内容区的面板每一项的点击事件*/
            else if (eventJqCurrentTarget.attr(_this.columnUlMarker) != null) {
                panelItemSelEvent();
            }
                /*内容区的面板 展开收起右侧面板的按钮的点击事件*/
            else if (eventJqCurrentTarget.attr(_this.panelToggleMarker) != null) {
                rightPanelToggleEvent();
            }
                /*内容区的面板 锁的点击事件*/
            else if (eventJqCurrentTarget.attr(_this.footLockMarker) != null) {
                lockEvent();
            }
                /*常用时间点击事件*/
            else if (eventJqCurrentTarget.attr(_this.commonTimeLiMarker) != null) {
                commonTimeEvent();
            }
            break;
    }

    function navigationEvent() {
        var calendarDateType = eventJqCurrentTarget.attr(_this.contentNavigationLiMarker);
        if (_tempObj.timeType == calendarDateType) return;

        eventJqCurrentTarget.addClass(_this.contentNavigationSelCss).siblings().removeClass(_this.contentNavigationSelCss);

        var yearComboboxJqTarget = jqTarget.find('[' + _this.panelConYearComboxMarker + ']');
        var yearCrossComboboxJqTarget = jqTarget.find('[' + _this.panelConCrossYearComboxMarker + ']');
        var monthComboboxJqTarget = jqTarget.find('[' + _this.panelConMonthComboxMarker + ']');
        var headerWeekJqTarget = jqTarget.find('[' + _this.headerWeekMarker + ']');
        yearComboboxJqTarget.css({ width: '60px' });

        var rightPanel = jqTarget.find('[' + _this.panelConMaxMarker + '][' + _this.orientationMarker + '="' + _this.ptool.orientation.right + '"]');
        var rightIsHidden = rightPanel.attr(_this.panelConMaxMarker) === 'false' ? true : false;

        var startTimeMsec = rightIsHidden ? _tempObj.startTimeMsec : _tempObj.startTimeMsec || _tempObj.endTimeMsec;
        var endTimeMsec = rightIsHidden ? null : _tempObj.endTimeMsec || _tempObj.startTimeMsec;
        switch (calendarDateType) {
            /*无论上一个类型是什么，均不用改变startTimeMsec endTimeMsec*/
            case _this.calendarDefaultTimeTypeArr[0]:
                yearCrossComboboxJqTarget.hide();
                yearComboboxJqTarget.show();
                monthComboboxJqTarget.show();
                headerWeekJqTarget.show();
                break;
            case _this.calendarDefaultTimeTypeArr[1]:
                yearCrossComboboxJqTarget.hide();
                yearComboboxJqTarget.show();
                monthComboboxJqTarget.show();
                headerWeekJqTarget.show();

                var sdate = new Date(startTimeMsec);
                var startWeekObj = sdate.getWeekStartAndEnd();
                startTimeMsec = startWeekObj.startTime;

                if (endTimeMsec) {
                    var edate = new Date(endTimeMsec);
                    var endWeekObj = edate.getWeekStartAndEnd();
                    endTimeMsec = endWeekObj.endTime;
                }
                break;
            case _this.calendarDefaultTimeTypeArr[2]:
                monthComboboxJqTarget.hide();
                headerWeekJqTarget.hide();
                yearCrossComboboxJqTarget.hide();
                yearComboboxJqTarget.show();

                var sdate = new Date(startTimeMsec);
                sdate.setDate(1);
                startTimeMsec = sdate.getTime();

                if (endTimeMsec) {
                    var edate = new Date(endTimeMsec);
                    var maxDay = edate.getMonthLength();
                    edate.setDate(maxDay);
                    endTimeMsec = edate.getTime();
                }
                break;
            case _this.calendarDefaultTimeTypeArr[3]:
                yearComboboxJqTarget.hide();
                monthComboboxJqTarget.hide();
                headerWeekJqTarget.hide();
                yearCrossComboboxJqTarget.css({ width: 'auto' });
                yearCrossComboboxJqTarget.show();

                var sdate = new Date(startTimeMsec);
                sdate.setMonth(0);
                sdate.setDate(1);
                startTimeMsec = sdate.getTime();

                if (endTimeMsec) {
                    var edate = new Date(endTimeMsec);
                    edate.setMonth(11);
                    edate.setDate(31);
                    endTimeMsec = edate.getTime();
                }
                break;
        }

        _this.setStoreTime({
            timeType: calendarDateType, startTimeMsec: startTimeMsec, endTimeMsec: endTimeMsec, ele: ele
        });

        _this.setConHeadComboxVal(jqTarget);
        _this.calendarItem(jqTarget, _this.ptool.orientation.left);
        _this.calendarItem(jqTarget, _this.ptool.orientation.right);
        _this.calendarItemColor(jqTarget, _this.ptool.orientation.left);
        _this.calendarItemColor(jqTarget, _this.ptool.orientation.right);
        _this.calendarCountVal(jqTarget);
    };

    function conHeaderQuckEvent() {
        /*left 代表 左侧面板    right 代表右侧面板*/
        var oriengation = eventJqCurrentTarget.attr(_this.orientationMarker);

        /*left 代表 减少时间    right 代表增加时间*/
        var computedType = eventJqCurrentTarget.attr(_this.panelConHeaderQuickMarker);

        var yearComboboxJqTarget = jqTarget.find('[' + _this.panelConYearComboxMarker + ']').find('[' + _this.orientationMarker + '="' + oriengation + '"]');
        var monthComboboxJqTarget = jqTarget.find('[' + _this.panelConMonthComboxMarker + ']').find('[' + _this.orientationMarker + '="' + oriengation + '"]');
        var yearCrossComboboxJqTarget = jqTarget.find('[' + _this.panelConCrossYearComboxMarker + ']').find('[' + _this.orientationMarker + '="' + oriengation + '"]');

        var yearIndex = yearComboboxJqTarget.psel().index;
        var monthIndex = monthComboboxJqTarget.psel().index;
        var crossYearIndex = yearCrossComboboxJqTarget.psel().index;
        var maxYearIndex = maxYear - minYear;
        switch (_tempObj.timeType) {
            case _this.calendarDefaultTimeTypeArr[0]:
            case _this.calendarDefaultTimeTypeArr[1]:
                switch (computedType) {
                    case _this.ptool.orientation.left:
                        --monthIndex;
                        if (monthIndex < 0) {
                            monthIndex = 11;
                            --yearIndex;
                            if (yearIndex < 0) return;
                        }
                        break;
                    case _this.ptool.orientation.right:
                        ++monthIndex;
                        if (monthIndex > 11) {
                            monthIndex = 0;
                            ++yearIndex;
                            if (yearIndex > maxYearIndex) return;
                        }
                        break;
                }
                monthComboboxJqTarget.psel(monthIndex, false);
                yearComboboxJqTarget.psel(yearIndex, true);
                break;
            case _this.calendarDefaultTimeTypeArr[2]:

                switch (computedType) {
                    case _this.ptool.orientation.left:
                        --yearIndex;
                        if (yearIndex < 0) return;
                    case _this.ptool.orientation.right:
                        ++yearIndex;
                        if (yearIndex > maxYearIndex) return;
                        break;
                }
                yearComboboxJqTarget.psel(yearIndex, true);
                break;
            case _this.calendarDefaultTimeTypeArr[3]:
                var maxIndex = (maxYear + 1 - minYear) / _this.crossYearStep - 1;
                switch (computedType) {
                    case _this.ptool.orientation.left:
                        --crossYearIndex;
                        if (crossYearIndex < 0) return;
                    case _this.ptool.orientation.right:
                        ++crossYearIndex;
                        if (crossYearIndex > maxIndex) return;
                        break;
                }
                yearCrossComboboxJqTarget.psel(crossYearIndex, true);
                break;
        }
    };

    function panelItemSelEvent() {
        var liJqTarget = $(event.target);
        var selVal = liJqTarget.attr(_this.columnLiMarker);
        if (selVal == null) liJqTarget = liJqTarget[0].parent();
        selVal = parseInt(liJqTarget.attr(_this.columnLiMarker));

        /*left 代表 左侧面板    right 代表右侧面板*/
        var oriengation = eventJqCurrentTarget.attr(_this.orientationMarker);
        var yearComboboxJqTarget = jqTarget.find('[' + _this.panelConYearComboxMarker + ']').find('[' + _this.orientationMarker + '="' + oriengation + '"]');
        var monthComboboxJqTarget = jqTarget.find('[' + _this.panelConMonthComboxMarker + ']').find('[' + _this.orientationMarker + '="' + oriengation + '"]');

        var selYear, selMonth, selDate;
        switch (_tempObj.timeType) {
            case _this.calendarDefaultTimeTypeArr[0]:
            case _this.calendarDefaultTimeTypeArr[1]:
                selYear = minYear + yearComboboxJqTarget.psel().index;
                selMonth = monthComboboxJqTarget.psel().index + 1;
                selDate = selVal;
                break;
            case _this.calendarDefaultTimeTypeArr[2]:
                selYear = minYear + yearComboboxJqTarget.psel().index;
                selMonth = selVal;
                selDate = oriengation == _this.ptool.orientation.left ? 1 : new Date(selYear, selMonth - 1, 1).getMonthLength();
                break;
            case _this.calendarDefaultTimeTypeArr[3]:
                selYear = selVal;
                selMonth = oriengation == _this.ptool.orientation.left ? 1 : 12;
                selDate = oriengation == _this.ptool.orientation.left ? 1 : 31;
                break;
        }
        var time = new Date(selYear, selMonth - 1, selDate).getTime();
        var stime = oriengation == _this.ptool.orientation.left ? time : _tempObj.startTimeMsec;
        var etime = oriengation == _this.ptool.orientation.right ? time : _tempObj.endTimeMsec;
        _this.setStoreTime({
            timeType: _tempObj.timeType, startTimeMsec: stime, endTimeMsec: etime, ele: ele
        });

        _this.calendarItemColor(jqTarget, _this.ptool.orientation.left);
        _this.calendarItemColor(jqTarget, _this.ptool.orientation.right);
        _this.calendarCountVal(jqTarget);
    };

    function rightPanelToggleEvent() {
        var par = eventJqCurrentTarget.parent();
        var rightPanel = par.next();
        var isHidden = rightPanel.is(":hidden");
        var lockJqTargets = jqTarget.find('[' + _this.footLockMarker + ']');
        if (isHidden) {
            rightPanel.show();
            rightPanel.attr(_this.panelConMaxMarker, 'true');
            lockJqTargets.parent().show();
            par.removeClass(_this.toggleArrowCss);
            lockJqTargets.parent().next().css({ "right": "120px" });
            _this.calendarItem(jqTarget, _this.ptool.orientation.right);
        } else {
            rightPanel.hide();
            rightPanel.attr(_this.panelConMaxMarker, 'false');
            lockJqTargets.parent().hide();
            lockJqTargets.next().hide();
            lockJqTargets.text(_this.lockObj.s);
            par.addClass(_this.toggleArrowCss);
            lockJqTargets.parent().next().css({ "right": "auto" });
            _tempObj.endTimeMsec = null;
            _this.setStoreTime(_tempObj);
            _this.calendarItemColor(jqTarget, _this.ptool.orientation.left);
            _this.calendarCountVal(jqTarget);
        }
    };

    function lockEvent() {
        var oldText = eventJqCurrentTarget.text();
        var newText = _this.lockObj[oldText];
        eventJqCurrentTarget.text(newText);
        switch (newText) {
            case _this.lockObj.s:
                eventJqCurrentTarget.next().hide();
                break;
            default:
                eventJqCurrentTarget.next().show();
                break;
        }
    };

    function commonTimeEvent() {
        var commonTimeType = eventJqCurrentTarget.attr(_this.commonTimeLiMarker);
        var newTimeType, stime, _date;
        switch (commonTimeType) {
            case _this.calendarCommonTimeArr[0]:
            case _this.calendarCommonTimeArr[1]:
                newTimeType = _this.calendarDefaultTimeTypeArr[0];
                _date = new Date();
                if (commonTimeType === _this.calendarCommonTimeArr[1])
                    _date.setDate(_date.getDate() - 1);
                break;
            case _this.calendarCommonTimeArr[2]:
            case _this.calendarCommonTimeArr[3]:
                newTimeType = _this.calendarDefaultTimeTypeArr[1];
                _date = new Date();
                stime = _date.getWeekStartAndEnd().startTime;
                _date = new Date(stime);
                if (commonTimeType === _this.calendarCommonTimeArr[3])
                    _date.setDate(_date.getDate() - 7);
                break;
            case _this.calendarCommonTimeArr[4]:
            case _this.calendarCommonTimeArr[5]:
                newTimeType = _this.calendarDefaultTimeTypeArr[2];
                _date = new Date();
                if (commonTimeType === _this.calendarCommonTimeArr[5])
                    _date.setMonth(_date.getMonth() - 1);
                _date.setDate(1);
                break;
            case _this.calendarCommonTimeArr[6]:
            case _this.calendarCommonTimeArr[7]:
                newTimeType = _this.calendarDefaultTimeTypeArr[3];
                _date = new Date();
                if (commonTimeType === _this.calendarCommonTimeArr[7])
                    _date.setFullYear(_date.getFullYear() - 1);
                _date.setMonth(0);
                _date.setDate(1);
                break;
        }
        _date.setHours(0);
        _date.setMinutes(0);
        _date.setSeconds(0);
        _date.setMilliseconds(0);
        stime = _date.getTime();

        _this.setStoreTime({
            timeType: '_temp', startTimeMsec: stime, endTimeMsec: null, ele: ele, isReal: true
        });

        var rightPanel = jqTarget.find('[' + _this.panelConMaxMarker + '][' + _this.orientationMarker + '="' + _this.ptool.orientation.right + '"]');
        var rightIsHidden = rightPanel.attr(_this.panelConMaxMarker) === 'false' ? true : false;
        if (!rightIsHidden)
            jqTarget.find('[' + _this.panelToggleMarker + ']')[0].click();
        jqTarget.find('[' + _this.contentNavigationLiMarker + '="' + newTimeType + '"]')[0].click();
        jqTarget.find('[' + _this.okBtnMarker + ']')[0].click();
    };
};

/*内容区面板头部年月下拉框赋值*/
ptime.prototype.setConHeadComboxVal = function (jqTarget) {
    var yearOutJqTarget = jqTarget.find('[' + this.panelConYearComboxMarker + ']');
    var yearCrossOutJqTarget = jqTarget.find('[' + this.panelConCrossYearComboxMarker + ']');
    var monthOutJqTarget = jqTarget.find('[' + this.panelConMonthComboxMarker + ']');

    var leftYearComboboxJqTarget = yearOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.left + '"]');
    var leftYearCrossComboboxJqTarget = yearCrossOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.left + '"]');
    var leftMonthComboboxJqTarget = monthOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.left + '"]');

    var rightYearComboboxJqTarget = yearOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.right + '"]');
    var rightYearCrossComboboxJqTarget = yearCrossOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.right + '"]');
    var rightMonthComboboxJqTarget = monthOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.right + '"]');

    var _tempObj = this.getStoreTime(jqTarget[0]).temp;
    var startDate = _tempObj.startTimeMsec ? new Date(_tempObj.startTimeMsec) : null;
    var endDate = null;
    if (_tempObj.endTimeMsec) {
        var endTimeMsec = _tempObj.timeType === this.calendarDefaultTimeTypeArr[1] ?
            new Date(_tempObj.endTimeMsec).getWeekStartAndEnd().startTime : _tempObj.endTimeMsec;
        endDate = new Date(endTimeMsec);
    }
    switch (_tempObj.timeType) {
        case this.calendarDefaultTimeTypeArr[0]:
        case this.calendarDefaultTimeTypeArr[1]:
            if (startDate) {
                var monthIndex1 = startDate.getMonth();
                leftMonthComboboxJqTarget.psel(monthIndex1, false);
            }
            if (endDate) {
                var monthIndex2 = endDate.getMonth();
                rightMonthComboboxJqTarget.psel(monthIndex2, false);
            }
        case this.calendarDefaultTimeTypeArr[2]:
            if (startDate) {
                var year1 = startDate.getFullYear() + '年';
                leftYearComboboxJqTarget.psel(year1, false);
            }
            if (endDate) {
                var year2 = endDate.getFullYear() + '年';
                rightYearComboboxJqTarget.psel(year2, false);
            }
            break;
        case this.calendarDefaultTimeTypeArr[3]:
            var _id = jqTarget.attr(this.ptool.libraryIdToHtml);
            var objBind = ptime[_id];
            var panelObj = objBind.attr.panel;
            var startYear = panelObj.startyear;
            var endyear = panelObj.endyear;
            var step = this.crossYearStep;
            var index1 = 0, index2 = 0;
            var year1 = startDate ? startDate.getFullYear() : null;
            var year2 = endDate ? endDate.getFullYear() : null;
            var isYear1 = startDate ? false : true;
            var isYear2 = endDate ? false : true;
            for (var i = startYear; i <= endyear; i++) {
                var s1 = i;
                i = i + step - 1;
                var s2 = i;
                if (year1 && year1 >= s1 && year1 <= s2) isYear1 = true;
                if (year2 && year2 >= s1 && year2 <= s2) isYear2 = true;
                if (isYear1 && isYear2) break;
                if (!isYear1)
                    ++index1;
                if (!isYear2)
                    ++index2;
            }
            if (year1) leftYearCrossComboboxJqTarget.psel(index1, false);
            if (year2) rightYearCrossComboboxJqTarget.psel(index2, false);
            break;
    }
};

/*日历绘制颜色*/
ptime.prototype.calendarItemColor = function (jqTarget, orientation, isClear) {
    isClear = isClear || false;
    var columnJqTargets = jqTarget.find('[' + this.columnUlMarker + '][' + this.orientationMarker + '="' + orientation + '"]').children();
    var headerYear, headerMonth;
    var headerHour = headerMinute = headerSecond = 0;
    var _headerObj = this.getYearMonthFromConHead(jqTarget);

    var _tempObj = this.getStoreTime(jqTarget[0]).temp;
    var seledStartTimeMsec = _tempObj.startTimeMsec;
    var seledEndTimeMsec = _tempObj.endTimeMsec;
    var timeType = _tempObj.timeType;
    var leftSelWeekEndTime, rightSelWeekStartTime, selWeekStartTime, selWeekEndTime;

    switch (orientation) {
        case this.ptool.orientation.left:
            headerYear = _headerObj.startYear1;
            headerMonth = _headerObj.month1;
            if (timeType === this.calendarDefaultTimeTypeArr[1]) {
                selWeekStartTime = _tempObj.startTimeMsec;
                if (selWeekStartTime)
                    selWeekEndTime = new Date(selWeekStartTime).getWeekStartAndEnd().endTime;
            }
            break;
        case this.ptool.orientation.right:
            headerYear = _headerObj.startYear2;
            headerMonth = _headerObj.month2;
            if (timeType === this.calendarDefaultTimeTypeArr[1]) {
                selWeekEndTime = _tempObj.endTimeMsec;
                if (selWeekEndTime)
                    selWeekStartTime = new Date(selWeekEndTime).getWeekStartAndEnd().startTime;

            }
            break;
    }



    if (timeType === this.calendarDefaultTimeTypeArr[1]) {
        var weekArr = new Date(headerYear, headerMonth - 1, 1).getWeekArr();
        if (seledStartTimeMsec)
            leftSelWeekEndTime = new Date(seledStartTimeMsec).getWeekStartAndEnd().endTime;
        if (seledEndTimeMsec)
            rightSelWeekStartTime = new Date(seledEndTimeMsec).getWeekStartAndEnd().startTime;
    }

    for (var i = 0; i < columnJqTargets.length; i++) {
        var currColumnJqTarget = columnJqTargets.eq(i);
        currColumnJqTarget.removeClass(this.columnSelCss + ' ' + this.columnInCss);
        if (isClear) continue;
        var currTime;
        switch (timeType) {
            case this.calendarDefaultTimeTypeArr[0]:
                currTime = new Date(headerYear, headerMonth - 1, i + 1, headerHour, headerMinute, headerSecond, 0).getTime();
                break;
            case this.calendarDefaultTimeTypeArr[1]:
                var currWeekObj = weekArr[i];
                if (_tempObj.startTimeMsec && _tempObj.endTimeMsec) {
                    if (currWeekObj.startTime > leftSelWeekEndTime && currWeekObj.endTime < rightSelWeekStartTime) {
                        currColumnJqTarget.addClass(this.columnInCss);
                        continue;
                    }
                }
                if (currWeekObj.startTime == selWeekStartTime && currWeekObj.endTime == selWeekEndTime)
                    currColumnJqTarget.addClass(this.columnSelCss);
                continue;
            case this.calendarDefaultTimeTypeArr[2]:
                var headerDay = orientation === this.ptool.orientation.left ? 1 : new Date(headerYear, i, 1).getMonthLength();
                currTime = new Date(headerYear, i, headerDay, headerHour, headerMinute, headerSecond, 0).getTime();
                break;
            case this.calendarDefaultTimeTypeArr[3]:
                var smt, dy;
                orientation === this.ptool.orientation.left ? (smt = 0, dy = 1) : (smt = 11, dy = 31);
                currTime = new Date(headerYear + i, smt, dy, headerHour, headerMinute, headerSecond, 0).getTime();
                break;
        }
        if (seledStartTimeMsec && seledEndTimeMsec) {
            if (currTime > seledStartTimeMsec && currTime < seledEndTimeMsec) {
                currColumnJqTarget.addClass(this.columnInCss);
                continue;
            }
        }
        if (currTime === seledStartTimeMsec || currTime === seledEndTimeMsec) currColumnJqTarget.addClass(this.columnSelCss);
    }
};

/*内容区面板上放入格子*/
ptime.prototype.calendarItem = function (jqTarget, orientation) {
    var _this = this;
    var columnJqTarget = jqTarget.find('[' + this.columnUlMarker + '][' + this.orientationMarker + '="' + orientation + '"]');
    columnJqTarget.html(_this.calendarItemHtml(jqTarget, orientation));
};

/*拼装面板格子*/
ptime.prototype.calendarItemHtml = function (jqTarget, orientation) {
    var headerStartYear, headerEndYear, headerMonth;
    var _headerObj = this.getYearMonthFromConHead(jqTarget);

    switch (orientation) {
        case this.ptool.orientation.left:
            headerStartYear = _headerObj.startYear1;
            headerEndYear = _headerObj.endYear1;
            headerMonth = _headerObj.month1;
            break;
        case this.ptool.orientation.right:
            headerStartYear = _headerObj.startYear2;
            headerEndYear = _headerObj.endYear2;
            headerMonth = _headerObj.month2;
            break;
    }

    var _tempObj = this.getStoreTime(jqTarget[0]).temp;
    var timeType = _tempObj.timeType;
    if (timeType === this.calendarDefaultTimeTypeArr[0] || timeType === this.calendarDefaultTimeTypeArr[1])
        var dateObj = new Date(headerStartYear, headerMonth - 1, 1);
    var liStr = '';
    switch (timeType) {
        case this.calendarDefaultTimeTypeArr[0]:
            var currMonthWeek = dateObj.getDay();
            var maxDay = dateObj.getMonthLength();
            for (var i = 1; i <= maxDay; i++) {
                var margin = i == 1 ? ' style = "margin-left:' + currMonthWeek * 30 + 'px"' : '';
                liStr += '<li class="per-calendar_main_item" ' + this.columnLiMarker + '="' + i + '"' + margin + ' ' + this.orientationMarker + '="' + orientation + '">' + i + '</li>';
            }
            return liStr;
        case this.calendarDefaultTimeTypeArr[1]:
            var weekArr = dateObj.getWeekArr();
            for (i = 0; i < weekArr.length; i++) {
                var currWeek = weekArr[i];
                var currWeekStartDate = new Date(currWeek.startTime);
                var currWeekEndDate = new Date(currWeek.endTime);

                var sdate = currWeekStartDate.getDate();
                sdate = sdate < 10 ? '0' + sdate : sdate;
                var sstr = currWeekStartDate.format('M.d') + '~' + currWeekEndDate.format('M.d');

                liStr += '<li class="per-calendar_main_item _week_item" ' + this.columnLiMarker + '="' + sdate + '" ' + this.orientationMarker + '="' + orientation + '"><em>第' + (i + 1) + '周</em>' + sstr + '</li>';
            }
            return liStr;
        case this.calendarDefaultTimeTypeArr[2]:
            for (i = 1; i <= 12; i++) {
                liStr += '<li class="per-calendar_month_item" ' + this.columnLiMarker + '="' + i + '" ' + this.orientationMarker + '="' + orientation + '">' + i + '月</li>';
            }
            return liStr;
        case this.calendarDefaultTimeTypeArr[3]:
            for (i = headerStartYear; i <= headerEndYear; i++) {
                liStr += '<li class="per-calendar_month_item" ' + this.columnLiMarker + '="' + i + '" ' + this.orientationMarker + '="' + orientation + '">' + i + '年</li>';
            }
            return liStr;
    }
};

/*内容区底部--步长、已选时间 显示*/
ptime.prototype.calendarCountVal = function (jqTarget) {
    var _tempObj = this.getStoreTime(jqTarget[0]).temp;
    var timeType = _tempObj.timeType;
    var startTimeMsec = _tempObj.startTimeMsec || _tempObj.endTimeMsec;
    var endTimeMsec = _tempObj.startTimeMsec && _tempObj.endTimeMsec ? _tempObj.endTimeMsec : 0;

    var startDate = new Date(startTimeMsec);
    var endDate = new Date(endTimeMsec);

    if (endTimeMsec) {
        var computedEndDate = new Date(endTimeMsec);
        computedEndDate.setDate(computedEndDate.getDate() + 1);
        var computedEndTimeMsec = computedEndDate.getTime();
    }

    var startStr = '', endStr = '', count = 0;
    switch (timeType) {
        case this.calendarDefaultTimeTypeArr[0]:
            startStr = startDate.format('y.M.d');
            if (endTimeMsec) {
                endStr = endDate.format('y.M.d');
                count = (computedEndTimeMsec - startTimeMsec) / this.oneDayMillSeconds;
            } else count = 1;
            break;
        case this.calendarDefaultTimeTypeArr[1]:
            startStr = startDate.format('y.M.');
            var startWeek = startDate.getWeekStartAndEnd().week;
            startWeek = startWeek < 10 ? '0' + startWeek : startWeek;
            startStr += startWeek + this.weekUnit;

            if (endTimeMsec) {
                var objWeek = endDate.getWeekStartAndEnd();
                endStr = new Date(objWeek.startTime).format('y.M.');
                var endWeek = objWeek.week;
                endWeek = endWeek < 10 ? '0' + endWeek : endWeek;
                endStr += endWeek + this.weekUnit;
                count = (computedEndTimeMsec - startTimeMsec) / this.oneDayMillSeconds / 7;
            } else {
                count = 1;
            }
            break;
        case this.calendarDefaultTimeTypeArr[2]:
            startStr = startDate.format('y.M');
            if (endTimeMsec) {
                endStr = endDate.format('y.M');
                var middleMonth = (endDate.getFullYear() - startDate.getFullYear() - 1) * 12;
                count = middleMonth + (12 - startDate.getMonth()) + (endDate.getMonth() + 1);
            } else count = 1;
            break;
        case this.calendarDefaultTimeTypeArr[3]:
            startStr = startDate.format('y');
            if (endTimeMsec) {
                endStr = endDate.format('y');
                count = endDate.getFullYear() - startDate.getFullYear() + 1
            } else count = 1;
            break;
    }

    var stepUnitJqTarget = jqTarget.find('[' + this.stepUnitMarker + ']');
    stepUnitJqTarget.text(this.calendarTimeTypeShow[timeType]);

    var stepValJqTarget = jqTarget.find('[' + this.stepValueMarker + ']');
    stepValJqTarget.text(count);

    var timeStr = startStr + (endStr ? '~' + endStr : '');
    var tempTimeValJqTarget = jqTarget.find('[' + this.tempSelTimeMarker + ']');
    tempTimeValJqTarget.text(timeStr);
};

/*从内容区头部获取左右对应的年月*/
ptime.prototype.getYearMonthFromConHead = function (jqTarget) {
    var _tempObj = this.getStoreTime(jqTarget[0]).temp;
    var _id = jqTarget.attr(this.ptool.libraryIdToHtml);
    var objBind = ptime[_id];
    var panelObj = objBind.attr.panel;
    var minYear = panelObj.startyear;
    var maxYear = panelObj.endyear;
    var startYear1, endYear1, month1, startYear2, endYear2, month2;

    var yearOutJqTarget = jqTarget.find('[' + this.panelConYearComboxMarker + ']');
    var yearCrossOutJqTarget = jqTarget.find('[' + this.panelConCrossYearComboxMarker + ']');
    var monthOutJqTarget = jqTarget.find('[' + this.panelConMonthComboxMarker + ']');

    var leftYearComboboxJqTarget = yearOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.left + '"]');
    var leftYearCrossComboboxJqTarget = yearCrossOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.left + '"]');
    var leftMonthComboboxJqTarget = monthOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.left + '"]');

    var rightYearComboboxJqTarget = yearOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.right + '"]');
    var rightYearCrossComboboxJqTarget = yearCrossOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.right + '"]');
    var rightMonthComboboxJqTarget = monthOutJqTarget.find('[' + this.orientationMarker + '="' + this.ptool.orientation.right + '"]');

    switch (_tempObj.timeType) {
        case this.calendarDefaultTimeTypeArr[0]:
        case this.calendarDefaultTimeTypeArr[1]:
            month1 = leftMonthComboboxJqTarget.psel().index + 1;
            month2 = rightMonthComboboxJqTarget.psel().index + 1;
        case this.calendarDefaultTimeTypeArr[2]:
            startYear1 = minYear + leftYearComboboxJqTarget.psel().index;
            startYear2 = minYear + rightYearComboboxJqTarget.psel().index;
            break;
        case this.calendarDefaultTimeTypeArr[3]:
            var step = this.crossYearStep;
            var middle1 = leftYearCrossComboboxJqTarget.psel().index * step;
            var middle2 = rightYearCrossComboboxJqTarget.psel().index * step;

            startYear1 = minYear + middle1;
            endYear1 = startYear1 + step - 1;

            startYear2 = minYear + middle2;
            endYear2 = startYear2 + step - 1;
            break;
    }

    return {
        startYear1: startYear1, endYear1: endYear1, month1: month1,
        startYear2: startYear2, endYear2: endYear2, month2: month2
    };
};

/*从element上获取保存的时间、时间类型等信息*/
ptime.prototype.getStoreTime = function (ele) {
    var _oldPpro = ele[this.ptool.libraryToPro] || {};
    var _otherObj = _oldPpro[this.ptool.controlPrivateToProName] || {};
    return { temp: _otherObj.temp || {}, real: _otherObj.real || {} };
};

/*element上进行保存时间、时间类型等信息。同时给内容区面板头部的年月下拉框赋值
*objParam {timeType:'',startTimeMsec:毫秒数,endTimeMsec:毫秒数,
*startWeekIndex:开始于第几周，从1开始,endWeekIndex:结束于第几周，从1开始,
*ele:target,isReal:true 是否存储真实信息，默认false}
*/
ptime.prototype.setStoreTime = function (objParam) {
    var ele = objParam.ele;
    var _oldPpro = ele[this.ptool.libraryToPro] || {};
    var _otherObj = _oldPpro[this.ptool.controlPrivateToProName] || {};
    var tempObj = _otherObj.temp || {};
    var realObj = _otherObj.real || {};

    var isReal = objParam.isReal || false;

    tempObj.timeType = objParam.timeType || tempObj.timeType;
    tempObj.startTimeMsec = objParam.startTimeMsec;
    tempObj.endTimeMsec = objParam.endTimeMsec;
    if (tempObj.startTimeMsec) {
        var newDate = new Date(tempObj.startTimeMsec);
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        tempObj.startTimeMsec = newDate.getTime();
        tempObj.startWeekIndex = new Date(tempObj.startTimeMsec).getWeekStartAndEnd().week;
    }
    else
        tempObj.startWeekIndex = '';

    if (tempObj.endTimeMsec) {
        var newDate = new Date(tempObj.endTimeMsec);
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        tempObj.endTimeMsec = newDate.getTime();
        tempObj.endWeekIndex = new Date(tempObj.endTimeMsec).getWeekStartAndEnd().week;
    }
    else
        tempObj.endWeekIndex = '';

    if (isReal) {
        realObj.timeType = tempObj.timeType;
        realObj.startTimeMsec = tempObj.startTimeMsec;
        realObj.endTimeMsec = tempObj.endTimeMsec;
        realObj.startWeekIndex = tempObj.startWeekIndex;
        realObj.endWeekIndex = tempObj.endWeekIndex;
    }

    _otherObj.temp = tempObj;
    _otherObj.real = realObj;
    _oldPpro[this.ptool.controlPrivateToProName] = _otherObj;
    ele[this.ptool.libraryToPro] = _oldPpro;

    this.headerIsQuick($(ele), tempObj.startTimeMsec, tempObj.endTimeMsec);
};

/*psel(objParm,isEvent) 获取或设置时间及时间类型；不传参时则获取时间及时间类型。
*对于calendar类型  objParm:{timeType:'可能的值同创建控件时的timetype',startTime:'符合时间格式的字符串或毫秒数',endTime:'符合时间格式的字符串或毫秒数'}
*对于form类型，M从1开始 objParam:{y:2017,M:1,h:0}
*/
ptime.prototype.psel = function (objParm, isEvent) {
    var ele = arguments[0];
    objParm = arguments[1] || {};
    isEvent = arguments[2] === false ? false : true;
    var jqEle = $(ele);
    var childType = this.ptool.getTypeAndChildTypeFromEle(ele).childType;

    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = ptime[_id];
    var panelObj = objBind.attr.panel;

    if (arguments.length == 1) {
        if (childType === this.controlTypes.ptime.types[1]) {
            var _realObj = this.getStoreTime(ele).real;
            var _realStartTimeMsec = _realObj.startTimeMsec || _realObj.endTimeMsec;
            var _realEndTimeMsec = _realObj.endTimeMsec && _realObj.startTimeMsec ? _realObj.endTimeMsec : null;
            var returnTimeType = _realObj.timeType;

            var returnStartTime = _realStartTimeMsec;
            var returnEndTime, returnRealEndTime, returnWeek;
            var _date;
            if (_realEndTimeMsec) {
                _date = new Date(_realEndTimeMsec);
            }
            else {
                switch (_realObj.timeType) {
                    case this.calendarDefaultTimeTypeArr[0]:
                        _date = new Date(_realStartTimeMsec);
                        break;
                    case this.calendarDefaultTimeTypeArr[1]:
                        var tempTime = new Date(_realStartTimeMsec).getWeekStartAndEnd().endTime;
                        _date = new Date(tempTime);
                        break;
                    case this.calendarDefaultTimeTypeArr[2]:
                        _date = new Date(_realStartTimeMsec);
                        _date.setDate(_date.getMonthLength());
                        break;
                    case this.calendarDefaultTimeTypeArr[3]:
                        _date = new Date(_realStartTimeMsec);
                        _date.setMonth(11);
                        _date.setDate(31);
                        break;
                }
            }
            _date.setHours(23);
            _date.setMinutes(59);
            _date.setSeconds(59);
            _date.setMilliseconds(0);
            returnEndTime = _date.getTime();
            returnWeek = _date.getWeekStartAndEnd().week;
            returnRealEndTime = returnEndTime + 1000;
            return { timeType: _realObj.timeType, startTime: returnStartTime, endTime: returnEndTime, realEndTime: returnRealEndTime, week: returnWeek };
        } else {
            var timeStr = '';
            var timeTypeJqTargets = jqEle.find('[' + this.timeTypeMarker + ']');
            for (var i = 0; i < timeTypeJqTargets.length; i++) {
                var currTimeTypeJqTarget = timeTypeJqTargets.eq(i);
                var currTimeType = currTimeTypeJqTarget.attr(this.timeTypeMarker);
                switch (currTimeType) {
                    case this.calendarDefaultTimeTypeArr[3]:
                        jolinTimeStr(this.dateSperator, panelObj.startyear + currTimeTypeJqTarget.psel().index);
                        break;
                    case this.calendarDefaultTimeTypeArr[2]:
                        jolinTimeStr(this.dateSperator, currTimeTypeJqTarget.psel().index + 1);
                        break;
                    case this.calendarDefaultTimeTypeArr[0]:
                        jolinTimeStr(this.dateSperator, currTimeTypeJqTarget.psel().index + 1);
                        break;
                    case this.calendarDefaultTimeTypeArr[4]:
                        jolinTimeStr(this.hourSperator, currTimeTypeJqTarget.psel().index);
                        break;
                    case this.calendarDefaultTimeTypeArr[5]:
                    case this.calendarDefaultTimeTypeArr[6]:
                        jolinTimeStr(this.timeSperator, currTimeTypeJqTarget.psel().index);
                        break;
                }
            }
            return { startTime: timeStr };
        }
        function jolinTimeStr(sperator, val) {
            val = val < 10 ? '0' + val : val;
            timeStr += (timeStr.length == 0 ? '' : sperator) + val;
        };
    }

    if (childType === this.controlTypes.ptime.types[1]) {
        if (objParm.startTime || objParm.endTime) {
            var startTimeMsec = objParm.startTime ? new Date(objParm.startTime).getTime() : null;
            var endTimeMsec = objParm.endTime ? new Date(objParm.endTime).getTime() : null;
            if (objParm.timeType) {
                var navigationLiJqTarget = jqEle.find('[' + this.contentNavigationLiMarker + '="' + objParm.timeType + '"]');
                if (navigationLiJqTarget.length > 0) {
                    this.setStoreTime({
                        startTimeMsec: startTimeMsec,
                        endTimeMsec: endTimeMsec,
                        ele: ele
                    });
                    navigationLiJqTarget[0].click();
                }
            } else {
                this.setStoreTime({
                    startTimeMsec: startTimeMsec,
                    endTimeMsec: endTimeMsec,
                    ele: ele
                });
                this.setConHeadComboxVal(jqEle);
                this.calendarItem(jqEle, this.ptool.orientation.left);
                this.calendarItem(jqEle, this.ptool.orientation.right);
                this.calendarItemColor(jqEle, this.ptool.orientation.left);
                this.calendarItemColor(jqEle, this.ptool.orientation.right);
                this.calendarCountVal(jqEle);
            }

            this.okEdChange(jqEle);
        }
    } else {
        for (var i = 0; i < this.calendarDefaultTimeTypeArr.length; i++) {
            var currTimeType = this.calendarDefaultTimeTypeArr[i];
            var timeTypeJqTarget = jqEle.find('[' + this.timeTypeMarker + '="' + currTimeType + '"]');
            if (timeTypeJqTarget.length == 0) continue;
            var val = objParm[currTimeType];
            var index;
            switch (currTimeType) {
                case this.calendarDefaultTimeTypeArr[3]:
                    index = val - panelObj.startyear;
                    timeTypeJqTarget.psel(index, false);
                    break;
                case this.calendarDefaultTimeTypeArr[2]:
                    index = val - 1;
                    break;
                case this.calendarDefaultTimeTypeArr[0]:
                    index = val - 1;
                    break;
                case this.calendarDefaultTimeTypeArr[4]:
                    index = val;
                    break;
            }
            timeTypeJqTarget.psel(index, false);
        }
    }
    if (isEvent) {
        this.executeSel(jqEle);
    }
};

/*锁定时间控件，参数释义同psel*/
ptime.prototype.plock = function (objParm, isEvent) {
    var ele = arguments[0];
    var jqEle = $(ele);
    jqEle.psel(objParm, isEvent);
    var lockJqTargets = jqEle.find('[' + this.footLockMarker + ']');
    if (lockJqTargets.length > 0)
        lockJqTargets[0].click();
};

/*头部下拉框左右两侧的按钮是否可点击*/
ptime.prototype.headerIsQuick = function (jqTarget, startTimeMsec, endTimeMsec) {
    return;
    var contentHeaderQuickJqTargets = jqTarget.find('[' + this.panelConHeaderQuickMarker + ']');

    var leftPrevQuickJqTarget = contentHeaderQuickJqTargets.eq(0);
    var leftNextQuickJqTarget = contentHeaderQuickJqTargets.eq(1);
    var rightPrevQuickJqTarget = contentHeaderQuickJqTargets.eq(2);
    var rightNextQuickJqTarget = contentHeaderQuickJqTargets.eq(3);

    var _id = jqTarget.attr(_this.ptool.libraryIdToHtml);
    var objBind = ptime[_id];
    var panelObj = objBind.attr.panel;
    var minYear = panelObj.startyear;
    var maxYear = panelObj.endyear;

    var minTime = new Date(minYear, 0, 1, 0, 0, 0, 0);
    var maxTime = new Date(maxYear, 11, 31, 0, 0, 0, 0);

    if (startTimeMsec) {
        var sdate = new Date(startTimeMsec);
        if (sdate == minTime) leftPrevQuickJqTarget.pdisable(true);
        else leftPrevQuickJqTarget.pdisable(false);
        if (sdate == maxTime) leftNextQuickJqTarget.pdisable(true);
        else leftNextQuickJqTarget.pdisable(false);
    }
    if (endTimeMsec) {
        var edate = new Date(endTimeMsec);
        if (edate == minTime) rightPrevQuickJqTarget.pdisable(true);
        else rightPrevQuickJqTarget.pdisable(false);
        if (edate == maxTime) rightNextQuickJqTarget.pdisable(true);
        else rightNextQuickJqTarget.pdisable(false);
    }
};

/*找寻日历控件最外围标签---用于日历内嵌控件的事件内*/
ptime.prototype.findMaxJqTarget = function (target) {
    var jqTarget = $(target);
    var index = 0;
    while (jqTarget.attr(this.ptool.maxDivMarker) == null) {
        jqTarget = jqTarget.parent();
        ++index;
        if (index > 50) break;
    }
    if (index > 50) return false;
    return jqTarget;
};

/*form类型-------重置日的下拉表*/
ptime.prototype.formTimeDateListReset = function (year, month, dateJqTarget) {
    var maxDay = new Date(year, month - 1, 1).getMonthLength();
    new pcombobox().resetList(dateJqTarget, 1, maxDay, this.calendarTimeTypeShow.d);
};

/*calendar类型--确定按钮点击后的页面变化*/
ptime.prototype.okEdChange = function (jqTarget) {
    var ele = jqTarget[0];
    var _tempObj = this.getStoreTime(ele).temp;
    _tempObj.isReal = true;
    _tempObj.ele = ele;
    this.setStoreTime(_tempObj);

    var showText = jqTarget.find('[' + this.tempSelTimeMarker + ']').text();
    var heJqTarget = jqTarget.find('[' + this.selTimeShowRegionMarker + ']');
    heJqTarget.text(showText);
    if (!jqTarget.find('[' + this.contentMaxMarker + ']').is(':hidden'))
        heJqTarget[0].click();
};

/*触发sel事件*/
ptime.prototype.executeSel = function (jqTarget, event) {
    event = event || {};
    var _id = jqTarget.attr(this.ptool.libraryIdToHtml);
    var objBind = ptime[_id];
    var orginEvent = objBind.event || {};
    if (orginEvent.sel) {
        var currSelTimeObj = jqTarget.psel();
        event[this.ptool.eventOthAttribute] = currSelTimeObj;
        this.executeEventCall(null, event, orginEvent.sel);
    }
};


/*日历显示区(即文本框)左右按钮点击事件*/
ptime.headerQuickSelEvent = function (event) {
    var ptm = new ptime();
    var currBtnJqTarget = $(event[ptm.ptool.eventCurrTargetName]);
    var jqTarget = ptm.findMaxJqTarget(currBtnJqTarget.parent());
    if (!jqTarget) return;
    var ele = jqTarget[0];
    var oriengation = currBtnJqTarget.attr(ptm.orientationMarker);
    var _realObj = ptm.getStoreTime(ele).real;
    var stime = _realObj.startTimeMsec;
    var etime = _realObj.endTimeMsec;
    if (stime && etime) {
        var middle = etime - stime;
        if (oriengation == ptm.ptool.orientation.left) {
            etime = stime - ptm.oneDayMillSeconds;
            stime = etime - middle;
        }
        else {
            stime = etime + ptm.oneDayMillSeconds;
            etime = stime + middle;
        }

    } else {
        var time = _realObj.startTimeMsec || _realObj.endTimeMsec;
        switch (_realObj.timeType) {
            case ptm.calendarDefaultTimeTypeArr[0]:
                time = oriengation == ptm.ptool.orientation.left ? time - ptm.oneDayMillSeconds : time + ptm.oneDayMillSeconds;
                break;
            case ptm.calendarDefaultTimeTypeArr[1]:
                time = oriengation == ptm.ptool.orientation.left ? time - ptm.oneDayMillSeconds * 7 : time + ptm.oneDayMillSeconds * 7;
                break;
            case ptm.calendarDefaultTimeTypeArr[2]:
                var _date = new Date(time);
                var newD = oriengation == ptm.ptool.orientation.left ? _date.getDate() - 1 : _date.getDate() + 1;
                _date.setDate(newD);
                time = _date.getTime();
                break;
            case ptm.calendarDefaultTimeTypeArr[3]:
                _date = new Date(time);
                var newY = oriengation == ptm.ptool.orientation.left ? _date.getFullYear() - 1 : _date.getFullYear() + 1;
                _date.setFullYear(newY);
                time = _date.getTime();
                break;
        }
        !stime ? etime = time : stime = time;
    }

    var _id = jqTarget.attr(ptm.ptool.libraryIdToHtml);
    var objBind = ptime[_id];
    var panelObj = objBind.attr.panel;
    var minYear = panelObj.startyear;
    var maxYear = panelObj.endyear;

    if (stime) {
        _date = new Date(stime);
        var _year = _date.getFullYear();
        if (_year < minYear || _year > maxYear) return;
    }
    if (etime) {
        _date = new Date(etime);
        _year = _date.getFullYear();
        if (_year < minYear || _year > maxYear) return;
    }
    _realObj.startTimeMsec = stime;
    _realObj.endTimeMsec = etime;
    _realObj.isReal = true;
    _realObj.ele = ele;

    ptm.setStoreTime(_realObj);

    ptm.setConHeadComboxVal(jqTarget);
    ptm.calendarItem(jqTarget, ptm.ptool.orientation.left);
    ptm.calendarItem(jqTarget, ptm.ptool.orientation.right);
    ptm.calendarItemColor(jqTarget, ptm.ptool.orientation.left);
    ptm.calendarItemColor(jqTarget, ptm.ptool.orientation.right);
    ptm.calendarCountVal(jqTarget);
    jqTarget.find('[' + ptm.okBtnMarker + ']')[0].click();
};

/*日历面板上年份、月份、年类型的年下拉框选择事件*/
ptime.panelTimeComboxSelEvent = function (event) {
    var ptm = new ptime();
    var currComboxJqTarget = $(event[ptm.ptool.eventCurrTargetName]);
    var oriengation = currComboxJqTarget.attr(ptm.orientationMarker);
    var jqTarget = ptm.findMaxJqTarget(currComboxJqTarget.parent());
    if (!jqTarget) return;

    ptm.calendarItem(jqTarget, oriengation);
    ptm.calendarItemColor(jqTarget, oriengation);
    ptm.calendarItemColor(jqTarget, oriengation);
};

/*日历面板上的确定按钮点击事件*/
ptime.timeOkEvent = function (event) {
    var ptm = new ptime();
    var currBtnJqTarget = $(event[ptm.ptool.eventCurrTargetName]);
    var jqTarget = ptm.findMaxJqTarget(currBtnJqTarget.parent());
    if (!jqTarget) return;
    ptm.okEdChange(jqTarget);

    ptm.executeSel(jqTarget, event);
};

/*form类型的----时间选择事件*/
ptime.formTimeSelEvent = function (event) {
    var ptm = new ptime();
    var currComboxJqTarget = $(event[ptm.ptool.eventCurrTargetName]);
    var jqTarget = ptm.findMaxJqTarget(currComboxJqTarget.parent());
    if (!jqTarget) return;

    ptm.executeSel(jqTarget, event);
};

/*form类型的----日下拉表的头部点击事件*/
ptime.formTimeDateHeaderEvent = function (event) {
    var ptm = new ptime();
    var currComboxJqTarget = $(event[ptm.ptool.eventCurrTargetName]);
    var jqTarget = ptm.findMaxJqTarget(currComboxJqTarget.parent());
    if (!jqTarget) return;

    var _id = jqTarget.attr(ptm.ptool.libraryIdToHtml);
    var objBind = ptime[_id];
    var panelObj = objBind.attr.panel;

    var monthJqTarget = jqTarget.find('[' + ptm.timeTypeMarker + '="' + ptm.calendarDefaultTimeTypeArr[2] + '"]');
    if (monthJqTarget.length == 0) return;

    var yearJqTarget = jqTarget.find('[' + ptm.timeTypeMarker + '="' + ptm.calendarDefaultTimeTypeArr[3] + '"]');
    if (yearJqTarget.length == 0) return;

    var month = monthJqTarget.psel().index + 1;
    var year = panelObj.startyear + yearJqTarget.psel().index;

    var maxDay = new Date(year, month - 1, 1).getMonthLength();
    var oldSelDate = currComboxJqTarget.psel().index + 1;

    ptm.formTimeDateListReset(year, month, currComboxJqTarget);
    var newDate = Math.min(maxDay, oldSelDate);
    currComboxJqTarget.psel(newDate - 1, false);
};
;﻿function plogin_template() {
    this.loginMarker = 'login';
    this.formMarker = 'formm';
    this.normal = '<div ' + this.ptool.maxDivMarker + '{{id}}' + ' class="per-login-normal"><form ' + this.formMarker + ' method="post" action="/' + pconst.requestType.plogin + '"><div class="per-login-normal-con"><div class="per-login-normal_title ">';
    this.mian = ' </div><div class="per-login-normal_main"><input type="text" placeholder="用户名" name="name"><input type="password" placeholder="密码" name="pass" class="marB20"></div><input type="button" value="登录" ' + this.loginMarker + ' class="per-login-normal_button"></div><div class="per-login-ICP" ></div></form></div>';
};

plogin_template.prototype = new persagyElement();

plogin_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    var panel = attr.panel;
    this.mainTitle = '<b>' + panel.title + '</b><em>' + panel.subtitle + ' </em>'

    return this[childType] + this.mainTitle + this.mian;

};
;/*api
@class plogin 登录
@mainattr 
@child 子类型
* normal
@attr 属性
* id 控件ID string
* title 标题，需放到panel标签上 string
* subtitle 副标题，需放到panel标签上 string
* backimgurl 背景图片地址，需放到panel标签上 string
@event 事件
@css 样式，暂不支持
@function 方法
api*/
function plogin() {
    this.constructor = arguments.callee;
};
plogin.prototype = new plogin_template();

/*构造html*/
plogin.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var panelJqElement = jqElement.find('panel');
    attr.panel = {
        title: panelJqElement.attr('title'),
        subtitle: panelJqElement.attr('subtitle'),
    };
    var templateStr = this.getTemplateStr(objBind, childType);


    this.renderView(templateStr, this.controlTypes.plogin.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
plogin.prototype.rendered = function (element, objBind, childType) {
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);
    var closeTarget = jqElement.find('[' + this.loginMarker + ']');
    this.createEvent(closeTarget, this.controlTypes.plogin.name, 'click', window[this.ptool.pstaticEventFnName]);
};

/*处理事件*/
plogin.prototype.eventHandout = function (model, event) {
    var _this = this;
    var jqTarget = $(event[this.ptool.eventCurrTargetName]);
    var eventName = event.type;
    if (eventName == 'click') {
        jqTarget.find('[' + this.formMarker + ']').submit();
    }
};


;﻿function pframe_template() {
    this.constructor = arguments.callee;
    this.menuLiMarker = 'menuli';
    this.navigationMarker = 'nav';
    this.subTitleMarker = 'smt';
    this.userNameMarkder = 'unm';
    this.iframeMarker = 'ifm';
    this.navigationActiveMarker = 'nam';
    this.userMenuItemMarker = 'umim';
    this.systemManagerMarker = 'smm';
    this.navigationMenuUlMarker = 'nmum';

    this.navigationNoActiveCss = 'active';
};

pframe_template.prototype = new persagyElement();

pframe_template.prototype.getTemplateStr = function (objBind, childType) {
    var attr = objBind.attr;
    var headerObj = attr.header;
    var itemObj = attr.item;

    /*拼接左侧系统管理*/
    var systemStr = '';
    if (itemObj.manageText) {
        systemStr = '<div ' + this.systemManagerMarker + ' class="per-frame-set"><i {{icon}}></i><em {{text}}>项目管理</em></div>';
        systemStr = this.joinHtmlToBindByAttrCss(systemStr, { text: itemObj.manageText, icon: itemObj.manageIcon });
    }

    /*拼接左侧筛选下拉框*/
    var navigationComStr = '';
    if (itemObj.comboxHtml) {
        navigationComStr = '<div class="per-frame-combobox">' + itemObj.comboxHtml + '</div>';
        var naJqTarget = $(navigationComStr);
        naJqTarget.children().attr('isborder', 'false');
        navigationComStr = naJqTarget[0].outerHTML;
    }

    /*拼接导航*/
    var navigationMenuStr = '<li {{click}} ' + this.menuLiMarker + '><b>></b><em' + (itemObj.icon ? ' {{icon}}' : '') +
        '></em><span {{text}}></span></li>';
    navigationMenuStr = this.joinHtmlToBindByAttrCss(navigationMenuStr, { text: itemObj.text, icon: itemObj.icon }, null, null, true);
    navigationMenuStr = this.createForBind(navigationMenuStr, itemObj.child, true);
    navigationMenuStr = '<ul ' + this.navigationMenuUlMarker + '>' + navigationMenuStr + '</ul>';

    var navigationGroup = '<div class="per-frame-nav_temp"><div class="temp-title" {{text}}></div>' + navigationMenuStr + '</div>';
    navigationGroup = this.joinHtmlToBindByAttrCss(navigationGroup, { text: itemObj.text }, null, null, true);
    navigationGroup = this.createForBind(navigationGroup, itemObj.datasource);

    var navigationStr = '<div class="per-frame-nav-wrap">' + navigationGroup + '</div>';

    var leftStr = '<div class="per-frame-nav blckScroll" ' + this.navigationMarker + '>' + systemStr + navigationComStr + navigationStr + '</div>';

    /*拼接头部*/
    var userHeadStr = '<span class="pic"></span>';
    if (headerObj.uhead) {
        var backurl = '\'url(\'+' + headerObj.uhead + '+\')\'';
        userHeadStr = this.createStyleBind(userHeadStr, { 'background-image': backurl });
    }
    var userNameStr = '<em {{text}}></em>';
    userNameStr = this.joinHtmlToBindByAttrCss(userNameStr, { text: headerObj.uname });

    var titleStr = '<span {{text}}></span>';
    titleStr = this.joinHtmlToBindByAttrCss(titleStr, { text: headerObj.title });

    var userMenuStr = '<li ' + this.userMenuItemMarker + ' {{click}}><em {{text}}></em></li>';
    userMenuStr = this.joinHtmlToBindByAttrCss(userMenuStr, { text: headerObj.text || '' }, null, null, true);
    userMenuStr = this.createForBind(userMenuStr, headerObj.dataSource);

    var topStr = '<div class="per-frame-header"><div ' + this.navigationActiveMarker + ' class="per-frame-nav_button active"></div>' +
                 '<div class="per-frame-title">' + titleStr + '><span ' + this.subTitleMarker + '></span></div>' +
                 '<div class="per-frame-nav_header_right"><div class="per-frame-user">' +
                 '<div ' + this.userNameMarkder + ' class="user-title"><b>v</b>' + userHeadStr + userNameStr + '</div>' +
                 '<div class="user-con" style="display: none;"><ul>' + userMenuStr +
                 '</ul></div></div></div></div>';

    /*拼接底部*/
    var footStr = '<div class="per-frame-main"><iframe ' + this.iframeMarker + ' src="" style="height: 100%; width: 100%;"></iframe></div>';

    return '<div ' + this.ptool.maxDivMarker + ' class="per-frame-normal"{{id}}>' + topStr + leftStr + footStr + '</div>';
};



pframe_template.prototype.joinUrl = function (url) {
    url += (url.indexOf('?') > -1 ? '&' : '?') + pconst.pticket + '=' + (window[pconst.pticket] || '');
    return url;
};
;/*api
@class pframe 框架，支持user、item、manage(需放在item标签内)、combobox(需放在item标签内)标签，当item标签放在user标签内的时候代表点击用户名称时弹出的菜单；否则代表左侧导航面板。有manage标签时会在左侧面板上创建管理的按钮；有combobox标签时会在左侧面板上创建筛选下拉框，此标签内可使用下拉框控件
@mainattr 
@child 子类型
* normal
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，必须为true，默认true，可省略此属性，现支持的框架有：ko、vue boolean
* title 标题 string
* head 用户的头像，需放到user标签上 string
* name 用户的真实姓名，需放到user标签上 string
* datasource 项数据源，需放到item标签上 string
* text 写在item标签上时代表每项或分组的显示文本对应的属性；写在manage标签上时代表管理按钮名称 string
* icon 写在item标签上时代表每项的图标；写在manage标签上时代表管理按钮图标 string
* url 写在item标签上时代表导航栏每项的url；写在manage标签上时代表系统管理的url string
* child 子级对应的属性名称，需放到item标签上 string
@event 事件
* click 用户菜单的每项、导航栏的每项、管理按钮的点击事件，即可放在item标签上，也可放在manage标签上
@css 样式，暂不支持
@function 方法
* psel(groupIndex,itemIndex) 打开某个导航#param:groupIndex:int:群组从零开始的索引:itemIndex:int:群组内的项从零开始的索引
api*/
function pframe() {
    this.constructor = arguments.callee;
};
pframe.prototype = new pframe_template();

/*构造html*/
pframe.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    attr.bind = true;
    var userJqElement = jqElement.find('user');
    var userItemJqTarget = userJqElement.find('item');
    attr.header = {
        title: attr.title,
        uhead: userJqElement.attr('head'),
        uname: userJqElement.attr('name'),
        dataSource: userItemJqTarget.attr('datasource'),
        text: userItemJqTarget.attr('text'),
        click: userItemJqTarget.attr('click')
    };

    var itemJqElement = jqElement.children().filter('item');
    var itemManageJqElement = itemJqElement.find('manage');
    var itemComboxJqElement = itemJqElement.find('combobox');
    attr.item = {
        datasource: itemJqElement.attr('datasource'),
        text: itemJqElement.attr('text'),
        icon: itemJqElement.attr('icon'),
        url: itemJqElement.attr('url'),
        click: itemJqElement.attr('click'),
        child: itemJqElement.attr('child'),
        manageText: itemManageJqElement.attr('text'),
        manageIcon: itemManageJqElement.attr('icon') || "'u'",
        manageClick: itemManageJqElement.attr('click'),
        manageUrl: itemManageJqElement.attr('url'),
        comboxHtml: itemComboxJqElement.html()
    };
    var templateStr = this.getTemplateStr(objBind, childType);
    this.renderView(templateStr, this.controlTypes.pframe.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
pframe.prototype.rendered = function (element, objBind, childType) {
    var _this = this;
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);

    /*头部左侧小图标悬浮时导航的显示隐藏*/
    var navigationActiveJqEle = jqElement.find('[' + this.navigationActiveMarker + ']');
    this.createEvent(navigationActiveJqEle, this.controlTypes.pframe.name, 'mouseenter', window[this.ptool.pstaticEventFnName]);
    this.createEvent(navigationActiveJqEle, this.controlTypes.pframe.name, 'mouseleave', window[this.ptool.pstaticEventFnName]);

    /*导航区域悬浮时导航的显示隐藏*/
    var menuJqEle = jqElement.find('[' + this.navigationMarker + ']');
    this.createEvent(menuJqEle, this.controlTypes.pframe.name, 'mouseenter', window[this.ptool.pstaticEventFnName]);
    this.createEvent(menuJqEle, this.controlTypes.pframe.name, 'mouseleave', window[this.ptool.pstaticEventFnName]);

    /*用户名称点击*/
    var userNameJqEle = jqElement.find('[' + this.userNameMarkder + ']');
    this.createEvent(userNameJqEle, this.controlTypes.pframe.name, 'click', window[this.ptool.pstaticEventFnName]);

    /*系统管理点击*/
    var systemJqEle = jqElement.find('[' + this.systemManagerMarker + ']');
    this.createEvent(systemJqEle, this.controlTypes.pframe.name, 'click', window[this.ptool.pstaticEventFnName]);
};

/*处理事件*/
pframe.prototype.eventHandout = function (model, event) {
    var _this = this;
    var jqTarget = $(event[this.ptool.eventCurrTargetName]);
    var eventType = event.type;
    var eventJqCurrentTarget = $(event.currentTarget);
    var _id = jqTarget.attr(this.ptool.libraryIdToHtml);
    var objBind = pframe[_id];
    var attr = objBind.attr;
    var headerObj = attr.header;
    var itemObj = attr.item;

    var navigationActiveJqEle = jqTarget.find('[' + this.navigationActiveMarker + ']');
    var menuJqEle = jqTarget.find('[' + this.navigationMarker + ']');
    switch (eventType) {
        case 'mouseenter':
            menuJqEle.css({ 'left': '0px' });
            navigationActiveJqEle.removeClass(this.navigationNoActiveCss);
            break;
        case 'mouseleave':
            menuJqEle.css({ 'left': '-222px' });
            navigationActiveJqEle.addClass(this.navigationNoActiveCss);
            break;
        case 'click':
            /*用户姓名点击*/
            if (eventJqCurrentTarget.attr(this.userNameMarkder) != null) {
                eventJqCurrentTarget.next().toggle();
            }
                /*用户菜单项点击*/
            else if (eventJqCurrentTarget.attr(this.userMenuItemMarker) != null) {
                var userMenuIndex = eventJqCurrentTarget.index();
                event = this.ptool.appendProToEvent(event, { index: userMenuIndex });
                this.executeEventCall(model, event, headerObj.click);
                jqTarget.find('[' + this.userNameMarkder + ']')[0].click();
            }
                /*系统管理点击*/
            else if (eventJqCurrentTarget.attr(this.systemManagerMarker) != null) {
                jqTarget.find('[' + this.subTitleMarker + ']').text(itemObj.manageText);
                jqTarget.find('[' + this.iframeMarker + ']').attr('src', itemObj.manageUrl);
                this.executeEventCall(model, event, itemObj.manageClick);
            }
                /*导航项点击*/
            else if (eventJqCurrentTarget.attr(this.menuLiMarker) != null) {
                var oldUrl = model[itemObj.url];
                var url = this.joinUrl(oldUrl);
                var subTitle = model[itemObj.text];
                jqTarget.find('[' + this.subTitleMarker + ']').text(subTitle);
                jqTarget.find('[' + this.iframeMarker + ']').attr('src', url);
                this.executeEventCall(model, event, itemObj.click);
            }
    }
};

/*打开某个导航
*/
pframe.prototype.psel = function (objParam) {
    var ele = arguments[0];
    var jqEle = $(ele);
    objParam = arguments[1] || {};

    var groupIndex = objParam.groupIndex;
    var itemIndex = objParam.itemIndex;
    var subTitle = objParam.subTitle || '';
    var url = objParam.url || '';

    if (url) {
        jqEle.find('[' + this.subTitleMarker + ']').text(subTitle);
        jqEle.find('[' + this.iframeMarker + ']').attr('src', url);
    } else {
        var ulJqTarget = jqEle.find('[' + this.navigationMenuUlMarker + ']').eq(groupIndex);
        ulJqTarget.find('[' + this.menuLiMarker + ']')[itemIndex].click();
    }
};
;﻿function pgrid_template() {
    this.constructor = arguments.callee;
    this.normalFirstColumMarker = 'nfcm';
    this.normalFirstColumConUlMarker = 'nfccum';
    this.normalRightColumnUlMarker = 'nrcum';
    this.normalRightConUlMarker = 'nrconum';
    this.normalRightConScrollRegionMarker = 'nrcsrm';
    this.normalLeftRegionConMarker = 'nlrcm';
    this.multiPagingMarker = 'mpm';
    this.multiGridLeftComboxMarker = 'mplcm';
    this.multiGridConCheckboxMarker = 'mgccbm';
    this.multiGridConUlMarker = 'mgcum';
    this.multiGridConMarker = 'mgcm';
    this.multiGridSortHeadMarker = 'mgshm';
    this.multiGridSortIconMarker = 'mgsim';
    this.multiGridOutHeaderMarker = 'mgohm';
    this.multiGridColumnHeaderMarker = 'mgchm';
    this.conColumnMarker = 'ccm';
    this.conLineMarker = 'clm';
    this.nodataMarker = 'ndm';

    this.quickSelLinePrefix = '已选：';
    this.quickSelLineSperator = '/';
    this.pageSize = 20;

    /*普通表格锁定时的第一列的行模板*/
    this.normalFirstConLi = '<li ' + this.conLineMarker + ' ' + this.normalFirstColumMarker;
    this.normalFirstConLi2 = '><em {{text}}></em></li>';
    /*普通表格右侧内容区的每列模板*/
    this.normalRightConColumn = '<div ' + this.conColumnMarker;
    this.normalRightConColumn3 = '><em {{text}}></em></div>';
    /*普通表格右侧内容区的每行模板*/
    this.normalRightConColumn1 = '<li ' + this.conLineMarker + ' {{click}}>';
    this.normalRightConColumn2 = '</li>';

    this.sortIconCss = {
        asc: 'icon-up',
        desc: 'icon-down'
    };
};

pgrid_template.prototype = new persagyElement();

pgrid_template.prototype.getTemplateStr = function (childType, objBind) {
    var _this = this;
    var attr = objBind.attr;
    var panelObj = attr.panel;
    var columnArr = attr.columns;
    switch (childType) {
        case this.controlTypes.pgrid.types[0]:
            var lockRegionStr = '';
            var firstColumn = columnArr[0];
            /*拼接锁定区域html*/
            if (panelObj.lock == true) {
                var firstConItemStr = this.normalFirstConLi + (panelObj.columnclick ? ' {{click}}' : '') + this.normalFirstConLi2;
                firstConItemStr = this.joinHtmlToBindByAttrCss(firstConItemStr, { text: firstColumn.source }, {}, {}, true);
                firstConItemStr = this.createForBind(firstConItemStr, panelObj.datasource);
                lockRegionStr = '<div class="per-grid-normal_l"><div class="per-grid-normal_column">' +
                                firstColumn.name + '</div><div ' + this.normalLeftRegionConMarker +
                                '  class="per-grid-normal_ul"><ul ' + this.normalFirstColumConUlMarker +
                                ' style="top: 0px;">' + firstConItemStr + '</ul></div></div>';
            }

            /*------拼接滚动区域------*/
            /*先拼接列头及内容的每列、每行*/
            var rightColumnHeadStr = '';
            var rightColumnLiStr = '';
            var rightConLineStr = '', rightConColumnStr = '';
            var i = panelObj.lock ? 1 : 0;
            for (i; i < columnArr.length; i++) {
                var currRightColumn = columnArr[i];
                rightColumnLiStr += '<li><em>' + currRightColumn.name + '</em></li>';

                var columnStr = this.normalRightConColumn + (panelObj.columnclick ? ' {{click}}' : '') + this.normalRightConColumn3;
                rightConColumnStr += this.joinHtmlToBindByAttrCss(columnStr, { text: currRightColumn.source }, {}, {}, true);
            }
            rightColumnHeadStr = '<div class="per-grid-normal_title"><ul ' + this.normalRightColumnUlMarker +
                                 ' style="left: 0px;">' + rightColumnLiStr + '</ul></div>';

            rightConLineStr = this.normalRightConColumn1 + rightConColumnStr + this.normalRightConColumn2;
            rightConLineStr = this.joinHtmlToBindByAttrCss(rightConLineStr, {}, {}, {}, true);
            rightConLineStr = this.createForBind(rightConLineStr, panelObj.datasource);

            /*拼接内容*/
            var rightConStr = '<div ' + this.normalRightConScrollRegionMarker +
                              ' class="per-grid-normal_con scroll_big"><div class="per-grid-nomal-wrap"><ul ' + this.normalRightConUlMarker +
                              '>' + rightConLineStr + '</ul></div></div>';

            /*拼接右侧区域*/
            var rightStr = '<div class="per-grid-normal_r">' + rightColumnHeadStr + rightConStr + '</div>';

            /*无数据提示*/
            var nodataStr = createNoDataStr();

            /*分页*/
            var normalPageStr = createPageStr(attr.pageHtml, this.controlTypes.pgrid.types[0]);

            return '<div ' + this.ptool.maxDivMarker + ' class="per-grid-normal" {{id}}><div class="per-grid-normal_main">' +
                    lockRegionStr + rightStr + nodataStr + normalPageStr + '</div></div>';
        default:
            /*先创建表格顶部，自定义操作区域*/
            var multiTopRegionStr = '';
            if (panelObj.checkbox || attr.customButtonHtml) {
                /*创建左侧固定区域的下拉框*/
                var multiTopLeftStr = '';
                if (panelObj.checkbox) {
                    multiTopLeftStr = '<div class="per-grid-dynamic_header_left"><pcombobox-menuminor ' + this.multiGridLeftComboxMarker +
                                      ' sel="pgrid.quickSelLineEvent">' +
                                      '<header placeholder="' + this.quickSelLinePrefix + '0' + this.quickSelLineSperator + '0"></header>' +
                                      '<item datasource="pgrid.multiGridTopLeftComboxSource" text="name"></item></pcombobox-menuminor></div>';
                }
                var multiTopRightStr = '';
                if (attr.customButtonHtml) {
                    multiTopRightStr = '<div class="per-grid-dynamic_header_right">' + attr.customButtonHtml + '</div>';
                }
                multiTopRegionStr = '<div ' + this.multiGridOutHeaderMarker + ' class="per-grid-dynamic_header">' +
                                    multiTopLeftStr + multiTopRightStr + '</div>';
            }

            /*-------创建表格部分-------*/
            var multiGridStr = '';

            /*创建列头  及内容区列绑定*/
            var multiConStr = '';
            var customColumnJqTargets = [];
            if (panelObj.templateid) {
                var teinnerHtml = '<div>' + document.getElementById(panelObj.templateid).innerHTML + '</div>';
                customColumnJqTargets = $(teinnerHtml).children();
            }
            var multiColumnStr = panelObj.checkbox ? '<div class="per-grid-dynamic_item _grid-cheackbox"></div>' : '';
            for (var i = 0; i < columnArr.length; i++) {
                var currMultiColumn = columnArr[i];
                var widthStyle = currMultiColumn.width ? ' style="width:' + currMultiColumn.width + ';"' : '';
                multiColumnStr += '<div' + widthStyle + ' class="per-grid-dynamic_item' + (currMultiColumn.sort ? ' _grid-sort' : '') + '"' +
                                 (currMultiColumn.sort ? ' ' + this.multiGridSortHeadMarker + '="' + currMultiColumn.defaultsort + '"' : '') +
                                 '><b>' + (currMultiColumn.sort ? '<em>' + currMultiColumn.name + '</em><span class="icon ' +
                                this.sortIconCss[currMultiColumn.defaultsort] + '" ' + this.multiGridSortIconMarker +
                                '></span>' : currMultiColumn.name) + '</b></div>';

                var defaultCstr = customColumnJqTargets[i] ? customColumnJqTargets[i].outerHTML : '<em {{text}}></em>';
                var cstr = '<div ' + this.conColumnMarker + widthStyle + ' class="per-grid-dynamic_item"' +
                            (panelObj.columnclick ? ' {{click}}' : '') + '>' + defaultCstr + '</div>';
                cstr = this.joinHtmlToBindByAttrCss(cstr, { text: currMultiColumn.source }, {}, {}, true);
                multiConStr += cstr;
            }
            if (panelObj.operation) {
                multiColumnStr += '<div class="per-grid-dynamic_item  _grid-dynamic_item-icon"></div>';
                multiConStr += '<div class="per-grid-dynamic_item _grid-dynamic_item-icon">' +
                    (customColumnJqTargets[customColumnJqTargets.length - 1].outerHTML || '') + '</div>';

            }
            multiColumnStr = '<div ' + this.multiGridColumnHeaderMarker +
                            ' class="per-grid-dynamic_title"><ul><li class="per-grid-dynamic_li _dynamic-title-height">' +
                             multiColumnStr + '</li></ul></div>';

            /*创建内容区*/
            if (panelObj.checkbox)
                multiConStr = '<div class="per-grid-dynamic_item _grid-cheackbox"><pswitch-checkbox ' + this.multiGridConCheckboxMarker +
                              ' change="pgrid.checkboxSelEvent" bind="true">' + '</pswitch-checkbox></div>' + multiConStr;
            multiConStr = '<li ' + this.conLineMarker + ' class="per-grid-dynamic_li" {{click}}>' + multiConStr + '</li>';
            multiConStr = this.joinHtmlToBindByAttrCss(multiConStr, {}, {}, {}, true);
            multiConStr = this.createForBind(multiConStr, panelObj.datasource);
            var conTemplateStr = '<ul ' + this.multiGridConUlMarker + '>' + multiConStr + '</ul>';
            var conTemplateJqTarget = $(conTemplateStr);
            conTemplateJqTarget.prender();
            conTemplateStr = conTemplateJqTarget[0].outerHTML;
            var conTemplateId = this.ptool.createDynamicTemplate(conTemplateStr);
            var multiConRegionStr = '<div ' + this.multiGridConMarker + ' class="per-grid-dynamic_con"><pscroll-small templateid="' +
                                    conTemplateId + '"></pscroll-small></div>';

            /*创建分页*/
            var multiPagingStr = createPageStr(attr.pageHtml, this.controlTypes.pgrid.types[1]);

            /*无数据提示*/
            var nodataStr = createNoDataStr();

            multiGridStr = '<div class="per-grid-dynamic_wrap">' + multiColumnStr + multiConRegionStr + multiPagingStr + nodataStr + '</div>';

            return '<div {{id}} ' + this.ptool.maxDivMarker + '  class="per-grid-dynamic">' + multiTopRegionStr + multiGridStr + '</div>';
    }

    /*创建无数据提示*/
    function createNoDataStr() {
        return '<div ' + _this.nodataMarker +
            ' class="per-grid-nodata"><pnotice-nodata text="暂无数据" subtitle="请检查网络是否通畅"></pnotice-nodata></div>';
    };

    /*创建分页*/
    function createPageStr(pageHtml, childType) {
        if (!pageHtml) return '';
        var tempJqTarget = $('<div ' + _this.multiPagingMarker + '="' + childType + '" class="per-grid-paging">' + pageHtml + '</div>');
        var first = tempJqTarget.children().eq(0);
        first.attr('number', '0');
        first.attr('sel', 'pgrid.pageSelEvent');
        return tempJqTarget[0].outerHTML;
    };
};
;/*api
@class pgrid 表格，bind必须为true才可创建表格；支持button、header、page标签，button标签为multifunction类型专用，内部可包含任意的控件库控件；header标签内部可包含多个column标签，用于创建列；page标签内部可创建分页控件
@mainattr items
@child 子类型
* normal
* multifunction
@attr 属性
* id 控件ID string
* bind 控件是否用于绑定，必须为true，默认true，可省略此属性，现支持的框架有：ko、vue boolean
* datasource 数据源名称，需放到panel标签上 string
* checkbox 每一行是否创建复选框，multifunction类型专用，默认false，需放到panel标签上 boolean
* templateid 每一行的布局所用的模版ID，multifunction类型专用，需放到panel标签上 string
* operation 是否是操作列，默认false，multifunction类型专用，需放到panel标签上 boolean
* lock 是否锁定，默认false，仅仅对normal类型的第一列生效，需放到panel标签上 boolean
* pagesize 每页条数，默认20，需放到panel标签上 int
* name 列名称，需放到column标签上 string
* source 列对应的数据属性名称，当templateid属性不为空时，此属性可不设值，需放到column标签上 string
* sort 是否排序，默认false，需放到column标签上 boolean
* defaultsort 某列是排序列时的默认排序方式，可能的值包括：asc(升序)、desc(降序)，默认asc，需放到column标签上 string
* width 每一列的宽，带px的像素值或带%的百分比值，需放到column标签上 string
@event 事件
* lineclick 行点击事件，需放到panel标签上
* columnclick 列点击事件，，需放到panel标签上
* sel 翻页事件，需写到panel标签上
* sortevent 排序列头的点击事件，需写到panel标签上
* change 每行复选框的状态改变事件，需写到panel标签上
@css 样式
@function 方法
* psel(pageNumber,isEvent) 切换到某一页，不传参时返回当前的页码。#param:pageNumber:number:从1开始的页码:isEvent:boolean:是否激发事件，默认true
* pcount(number) 获取或设置总页数，不传参数时返回当前总页数。#param:number:number:数据总数(非总页数)
* precover() 恢复初始状态，恢复排序列到默认排序方式，取消每行复选框的选中状态，恢复页码到第一页，同时触发页码切换事件
api*/
function pgrid() {
    this.constructor = arguments.callee;
};
pgrid.prototype = new pgrid_template();

pgrid.multiGridTopLeftComboxSource = [{ name: '选择全部' }, { name: '选择本页' }, { name: '本页反选' }, { name: '全不选' }];

/*构造html*/
pgrid.prototype.init = function (childType, objBind, jqElement) {
    var attr = objBind.attr;
    var event = objBind.event;
    var css = objBind.css;
    attr.bind = true;

    var panelEle = jqElement.find('panel');
    var headerCheckbox = panelEle.attr('checkbox') == 'true' ? true : false;
    var columnOperation = panelEle.attr('operation') == 'true' ? true : false;
    var columnLock = panelEle.attr('lock') == 'true' ? true : false;
    attr.panel = {
        datasource: panelEle.attr('datasource'),
        checkbox: headerCheckbox,
        templateid: panelEle.attr('templateid'),
        lineclick: panelEle.attr('lineclick'),
        columnclick: panelEle.attr('columnclick'),
        sel: panelEle.attr('sel'),
        change: panelEle.attr('change'),
        lock: columnLock,
        operation: columnOperation,
        pagesize: parseInt(panelEle.attr('pagesize')) || this.pageSize,
        sortevent: panelEle.attr('sortevent')
    };

    var columnEles = jqElement.find('header').find('column');
    var columns = [];
    for (var i = 0; i < columnEles.length; i++) {
        var currColumnEle = columnEles.eq(i);
        var columnSort = currColumnEle.attr('sort') == 'true' ? true : false;
        var columnDefaultSort = currColumnEle.attr('defaultsort') || this.ptool.sortType.asc;
        columns.push({
            name: currColumnEle.attr('name'),
            source: currColumnEle.attr('source'),
            sort: columnSort,
            defaultsort: columnDefaultSort,
            width: currColumnEle.attr('width')
        });
    }
    attr.columns = columns;

    attr.customButtonHtml = jqElement.find('button').html();
    attr.pageHtml = jqElement.find('page').html();
    var templateStr = this.getTemplateStr(childType, objBind);

    this.renderView(templateStr, this.controlTypes.pgrid.name, childType, objBind, jqElement);
};

/*控件渲染后，注册控件内部的静态事件*/
pgrid.prototype.rendered = function (element, objBind) {
    if (!objBind) return;
    var attr = objBind.attr;
    var event = objBind.event;
    var jqElement = ptool.getJqElement(element);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqElement);

    switch (typeObj.childType) {
        case this.controlTypes.pgrid.types[0]:
            /*普遍表格的内容区滚动事件*/
            this.createEvent(jqElement.find('[' + this.normalRightConScrollRegionMarker + ']'), this.controlTypes.pgrid.name, 'scroll', window[this.ptool.pstaticEventFnName]);
            /*普遍表的内容区ul内数据改变事件*/
            var normalConUlJqTarget = jqElement.find('[' + this.normalRightConUlMarker + ']');
            this.createEvent(normalConUlJqTarget, this.controlTypes.pgrid.name, 'DOMSubtreeModified', window[this.ptool.pstaticEventFnName]);
            break;
        case this.controlTypes.pgrid.types[1]:
            /*多功能表的排序表头点击事件*/
            var sortHeadJqTargets = jqElement.find('[' + this.multiGridSortHeadMarker + ']');
            for (var i = 0; i < sortHeadJqTargets.length; i++) {
                this.createEvent(sortHeadJqTargets[i], this.controlTypes.pgrid.name, 'click', window[this.ptool.pstaticEventFnName]);
            }
            /*多功能表的内容区ul内数据改变事件*/
            var conUlJqTarget = jqElement.find('[' + this.multiGridConUlMarker + ']');
            var _id = jqElement.attr(this.ptool.libraryIdToHtml);
            var type = this.controlTypes.pgrid.name + this.ptool.typeSeparator + this.controlTypes.pgrid.types[1];
            conUlJqTarget.attr(this.ptool.libraryTypeToHtml, type);
            conUlJqTarget.attr(this.ptool.libraryIdToHtml, _id);
            this.createEvent(conUlJqTarget, this.controlTypes.pgrid.name, 'DOMSubtreeModified', window[this.ptool.pstaticEventFnName]);

            var maxWidth = jqElement.width();
            var maxHeight = jqElement.height();

            var pagingHeight = 70;
            var outHeaderHeight = jqElement.find('[' + this.multiGridOutHeaderMarker + ']').height() || 0;
            var columnHeaderHeight = 32;
            maxHeight = maxHeight - pagingHeight - outHeaderHeight - columnHeaderHeight;

            var scrollSelector = '[' + this.ptool.libraryTypeToHtml + '="' + this.controlTypes.pscroll.name + this.ptool.typeSeparator +
                            this.controlTypes.pscroll.types[0] + '"]';
            jqElement.find(scrollSelector).css({
                'max-width': maxWidth + 'px',
                'max-height': maxHeight + 'px'
            });
            break;
    }

    this.isShowNoData(typeObj.childType, jqElement);
};

/*事件的处理*/
pgrid.prototype.eventHandout = function (model, event) {
    var currentTarget = event.currentTarget;
    var currentJqTarget = $(currentTarget);
    var jqTarget = $(event[this.ptool.eventCurrTargetName]);
    if (jqTarget.attr(this.ptool.maxDivMarker) == null) {
        jqTarget = this.findMaxJqTarget(jqTarget.parent(), this.controlTypes.pgrid.types[1]);
        if (!jqTarget)
            jqTarget = this.findMaxJqTarget(jqTarget.parent(), this.controlTypes.pgrid.types[0]);
    }
    var _id = jqTarget.attr(this.ptool.libraryIdToHtml);
    var objBind = pgrid[_id];
    var attr = objBind.attr;
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqTarget);
    var panelObj = attr.panel;
    var columnArr = attr.columns;
    var eventType = event.type;

    switch (eventType) {
        /*普遍表格的内容区滚动事件*/
        case 'scroll':
            var scrollTop = currentTarget.scrollTop;
            var scrollLeft = currentTarget.scrollLeft;
            jqTarget.find('[' + this.normalRightColumnUlMarker + ']').css({ left: '-' + scrollLeft + 'px' });
            jqTarget.find('[' + this.normalFirstColumConUlMarker + ']').css({ top: '-' + scrollTop + 'px' });
            break;
        case 'click':
            /*多功能表的排序表头的点击事件*/
            if (currentJqTarget.attr(this.multiGridSortHeadMarker) != null) {
                var columnIndex = currentJqTarget.index();
                if (panelObj.checkbox)--columnIndex;
                var currSortType = currentJqTarget.attr(this.multiGridSortHeadMarker);
                var nextSortType = currSortType == this.ptool.sortType.asc ? this.ptool.sortType.desc : this.ptool.sortType.asc;
                event = this.ptool.appendProToEvent(event, { columnIndex: columnIndex, sortType: nextSortType });
                this.executeEventCall(null, event, panelObj.sortevent);
                var sortIconJqTarget = currentJqTarget.find('[' + this.multiGridSortIconMarker + ']');
                sortIconJqTarget.removeClass(this.sortIconCss[currSortType]);
                sortIconJqTarget.addClass(this.sortIconCss[nextSortType]);
                currentJqTarget.attr(this.multiGridSortHeadMarker, nextSortType);
                return;
            }
            /*列点击事件*/
            if (currentJqTarget.attr(this.conColumnMarker) != null) {
                var columnIndex = currentJqTarget.index();
                if (panelObj.checkbox)--columnIndex;
                if (panelObj.lock)++columnIndex;

                var currColumn = columnArr[columnIndex];
                var lineJqTarget = currentJqTarget.parent('[' + this.conLineMarker + ']:first');
                var lineIndex = lineJqTarget.index();
                event = this.ptool.appendProToEvent(event, { columnIndex: columnIndex, lineIndex: lineIndex });
                this.executeEventCall(model, event, panelObj.columnclick);
                return;
            }
            /*行点击事件*/
            if (currentJqTarget.attr(this.conLineMarker) != null) {
                var lineIndex = currentJqTarget.index();
                var clickFnName = panelObj.lineclick;
                event = this.ptool.appendProToEvent(event, { lineIndex: lineIndex });
                this.executeEventCall(model, event, clickFnName);
                return;
            }
            break;
        case 'DOMSubtreeModified':
            this.isShowNoData(typeObj.childType, jqTarget);
            break;
    }
};

/*表格内是否有数据*/
pgrid.prototype.isShowNoData = function (childType, jqTarget, isNoData) {
    var nodataJqTarget = jqTarget.find('[' + this.nodataMarker + ']');
    var pagingJqTarget = jqTarget.find('[' + this.multiPagingMarker + ']');
    isNoData = isNoData === true ? true : false;

    switch (childType) {
        case this.controlTypes.pgrid.types[0]:
            var normalConUlJqTarget = jqTarget.find('[' + this.normalRightConUlMarker + ']');
            var leftRegionConJqTarget = jqTarget.find('[' + this.normalLeftRegionConMarker + ']');
            var rightRegionConJqTarget = jqTarget.find('[' + this.normalRightConScrollRegionMarker + ']');
            if (isNoData===true|| normalConUlJqTarget.children().length == 0) {
                leftRegionConJqTarget.hide();
                rightRegionConJqTarget.hide();
                pagingJqTarget.hide();
                nodataJqTarget.show();
            } else {
                nodataJqTarget.hide();
                leftRegionConJqTarget.show();
                rightRegionConJqTarget.show();
                pagingJqTarget.show();
            }
            break;
        case this.controlTypes.pgrid.types[1]:
            var conJqTarget = jqTarget.find('[' + this.multiGridConMarker + ']');
            var conUlJqTarget = jqTarget.find('[' + this.multiGridConUlMarker + ']');
            if (isNoData === true || conUlJqTarget.children().length == 0) {
                conJqTarget.hide();
                pagingJqTarget.hide();
                nodataJqTarget.show();
            } else {
                nodataJqTarget.hide();
                conJqTarget.show();
                pagingJqTarget.show();
            }
            break;
    }
};

/*获取或设置总页数
*number 数据总数(非总页数)
*/
pgrid.prototype.pcount = function (number) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqEle);
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = pgrid[_id];
    if (arguments.length == 1) return objBind.pageCount || 0;
    number = parseInt(arguments[1]) || 0;
    var attr = objBind.attr;
    var pageSize = attr.panel.pagesize;
    var pageCount = Math.ceil(Math.division(number, pageSize));
    objBind.pageCount = pageCount;
    objBind.count = number;
    if (objBind.selAll == true) objBind.selCount = number;
    pgrid[_id] = objBind;
    jqEle.find('[' + this.multiPagingMarker + ']').pcount(pageCount);
    this.setLeftComboxHeaderText(jqEle);
};

/*恢复初始状态
*/
pgrid.prototype.precover = function () {
    var ele = arguments[0];
    var jqEle = $(ele);
    var typeObj = this.ptool.getTypeAndChildTypeFromEle(jqEle);
    var pageJqTarget = jqEle.find('[' + this.multiPagingMarker + ']');
    pageJqTarget.psel(1, false);
    if (typeObj.childType === this.controlTypes.pgrid.types[0]) return;

    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = pgrid[_id];
    var attr = objBind.attr;
    objBind.pageCount = 0;
    objBind.count = 0;
    objBind.selAll = false;
    objBind.selCount = 0;
    objBind.pageIndex = 1;
    pgrid[_id] = objBind;

    pageJqTarget.pcount(1);
    this.setLeftComboxHeaderText(jqEle);
    this.isShowNoData(typeObj.childType, jqEle, true);
};

/*找寻表格控件最外围标签---用于表格内嵌控件的事件内*/
pgrid.prototype.findMaxJqTarget = function (target, childType) {
    var jqTarget = $(target);
    var type = this.controlTypes.pgrid.name + this.ptool.typeSeparator + childType;
    var index = 0;
    while (jqTarget.attr(this.ptool.libraryTypeToHtml) !== type || jqTarget.attr(this.ptool.maxDivMarker) == null) {
        jqTarget = jqTarget.parent();
        ++index;
        if (index > 50) break;
    }
    if (index > 50) return false;
    return jqTarget;
};

/*给多功能表格左侧下拉列表头部赋值*/
pgrid.prototype.setLeftComboxHeaderText = function (jqTarget) {
    var _id = jqTarget.attr(this.ptool.libraryIdToHtml);
    var objBind = pgrid[_id];
    if (objBind.selAll == true) {
        objBind.selCount = objBind.count;
        pgrid[_id] = objBind;
    }
    var headerText = this.quickSelLinePrefix + (objBind.selCount || 0) + this.quickSelLineSperator + (objBind.count || 0);
    new pcombobox().setHeaderText(jqTarget.find('[' + this.multiGridLeftComboxMarker + ']'), headerText);
};

/*切换到某一页，不传参时返回当前的页码
*pageNumber 从1开始的页码
*isEvent 是否激发事件，默认true
*/
pgrid.prototype.psel = function (pageNumber, isEvent) {
    var ele = arguments[0];
    var jqEle = $(ele);
    var _id = jqEle.attr(this.ptool.libraryIdToHtml);
    var objBind = pgrid[_id];
    if (arguments.length == 1) return objBind.pageIndex || 1;

    pageNumber = parseInt(arguments[1]);
    isEvent = arguments[2] === false ? false : true;

    if (!pageNumber) return objBind.pageIndex || 1;

    if (isEvent) return jqEle.find('[' + this.multiPagingMarker + ']').psel(pageNumber);
    objBind.pageIndex = pageNumber;
    pgrid[_id] = objBind;
};

/*多功能表格头部，左侧下拉列表选择事件*/
pgrid.quickSelLineEvent = function (event) {
    var pgd = new pgrid();
    var selIndex = event[pgd.ptool.eventOthAttribute].index;
    var currComboboxJqTarget = $(event[pgd.ptool.eventCurrTargetName]);
    var jqTarget = pgd.findMaxJqTarget(currComboboxJqTarget.parent(), pgd.controlTypes.pgrid.types[1]);
    var checkboxJqTargets = jqTarget.find('[' + pgd.multiGridConCheckboxMarker + ']');
    var _id = jqTarget.attr(pgd.ptool.libraryIdToHtml);
    var objBind = pgrid[_id];
    var oldSelCount = objBind.selCount || 0;
    switch (selIndex) {
        /*选择全部*/
        case 0:
            oldSelCount = objBind.count;
            objBind.selAll = true;
            break;
            /*选择本页*/
        case 1:
            objBind.selAll = false;
            oldSelCount = jqTarget.find('[' + pgd.multiGridConUlMarker + ']').children().length;
            break;
            /*本页反选*/
        case 2:
            objBind.selAll = false;
            oldSelCount = 0;
            for (var i = 0; i < checkboxJqTargets.length; i++) {
                var currCheckboxJqTarget = checkboxJqTargets[i];
                var state = !currCheckboxJqTarget.psel();
                if (state)++oldSelCount;
                checkboxJqTargets[i].psel(state, false);
            }
            break;
            /*全不选*/
        case 3:
            objBind.selAll = false;
            oldSelCount = 0;
            break;
    }
    objBind.selCount = oldSelCount;
    pgrid[_id] = objBind;
    pgd.setLeftComboxHeaderText(jqTarget);
    if (selIndex != 2) {
        for (var i = 0; i < checkboxJqTargets.length; i++) {
            var state = oldSelCount === 0 ? false : true;
            checkboxJqTargets[i].psel(state, false);
        }
    }
};

/*多功能表格每行的复选框选择事件*/
pgrid.checkboxSelEvent = function (model, event) {
    var pgd = new pgrid();
    var selState = event[pgd.ptool.eventOthAttribute].state;
    var currCheckboxJqTarget = $(event[pgd.ptool.eventCurrTargetName]);
    var jqTarget = pgd.findMaxJqTarget(currCheckboxJqTarget.parent(), pgd.controlTypes.pgrid.types[1]);
    var _id = jqTarget.attr(pgd.ptool.libraryIdToHtml);
    var objBind = pgrid[_id];
    var oldSelCount = objBind.selCount || 0;
    selState ? (++oldSelCount) : (--oldSelCount);
    objBind.selCount = oldSelCount;
    pgrid[_id] = objBind;
    pgd.setLeftComboxHeaderText(jqTarget);

    event = pgd.ptool.appendProToEvent(event, { state: selState });
    pgd.executeEventCall(model, event, objBind.attr.panel.change);
};

/*表格分页事件*/
pgrid.pageSelEvent = function (event) {
    var pgd = new pgrid();
    var pageIndex = event[pgd.ptool.eventOthAttribute].pageIndex;
    var currPageJqTarget = $(event[pgd.ptool.eventCurrTargetName]);
    var pageParentJqTarget = currPageJqTarget.parent();
    var cdType = pageParentJqTarget.attr(pgd.multiPagingMarker);
    var jqTarget = pgd.findMaxJqTarget(pageParentJqTarget, cdType);
    var _id = jqTarget.attr(pgd.ptool.libraryIdToHtml);
    var objBind = pgrid[_id];

    if (cdType === pgd.controlTypes.pgrid.types[1]) {
        objBind.pageIndex = pageIndex;
        if (objBind.selAll != true) {
            objBind.selCount = 0;
            pgrid[_id] = objBind;
            pgd.setLeftComboxHeaderText(jqTarget);
        }
    }
    event = pgd.ptool.appendProToEvent(event, { pageIndex: pageIndex });
    pgd.executeEventCall(null, event, objBind.attr.panel.sel);
};
 ;})();