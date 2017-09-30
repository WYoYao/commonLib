/*扩展jQuery、htmlelement方法*/
void function () {
    var extendFn = {
        /*启用或禁用按钮 disabled true禁用 false启用*/
        pdisable: function (disabled) {
            var target = $(this)[0];
            if (!target) return;
            target.setAttribute('pdisabled', disabled);
        },
        /*某元素注册mouseenter、mouseleave 以实现色彩变化
        *changeType  0 背景色变化(默认)   1 字体颜色变化    2 两者同时变化
        *changeTarget 背景色、字体变化的元素，默认当前注册事件的元素
        */
        registerEventForColorChange: function (changeTarget, changeType) {
            var jqTarget = $(this);
            if (jqTarget.length > 1) {
                jqTarget.each(function () {
                    this.registerEventForColorChange(changeTarget, changeType);
                });
                return;
            }

            changeType = parseInt(changeType) || 0;
            var domTarget = ptool.getDomElement(this);
            var jqChangeTarget = changeTarget ? $(changeTarget) : jqTarget;
            jqChangeTarget = jqChangeTarget.length > 1 ? jqTarget : jqChangeTarget;
            var currCssArr = [], prevCssArr = [];

            jqTarget.on({
                mouseenter: function (event) {
                    prevCssArr = domTarget[pconst.targetHoverCssSourcePro] || [];
                    currCssArr = [];
                    switch (changeType) {
                        case 0:
                            back();
                            break;
                        case 1:
                            font();
                            break;
                        case 2:
                            back();
                            font();
                            break;
                    }
                    setElementColor();
                },
                mouseleave: function (event) {
                    prevCssArr = domTarget[pconst.targetHoverCssSourcePro] || [];
                    if (prevCssArr.length == 0 || currCssArr.length === 0)
                        return domTarget[pconst.targetHoverCssSourcePro] = prevCssArr = currCssArr = [];
                    setElementColor();
                }
            });

            function setElementColor(ele) {

                for (var i = 0; i < prevCssArr.length; i = i + 2) {
                    jqChangeTarget.css(prevCssArr[i], prevCssArr[i + 1]);
                }
                domTarget[pconst.targetHoverCssSourcePro] = currCssArr;
                currCssArr = prevCssArr;
            };

            function back() {
                var backColorName = 'backgroundColor';
                currCssArr.push(backColorName);
                var color = jqChangeTarget.css(backColorName);
                currCssArr.push(color);
                if (prevCssArr.length == 0) {
                    prevCssArr.push(backColorName);
                    prevCssArr.push(ptool.colorChangeToHover(color));
                }
            };

            function font() {
                var colorName = 'color';
                currCssArr.push(colorName);
                var color = jqChangeTarget.css(colorName);
                currCssArr.push(color);
                if (prevCssArr.length == 0) {
                    prevCssArr.push(colorName);
                    prevCssArr.push(ptool.colorChangeToHover(color));
                }
            };
        },
        /*某元素注册mouseenter、mouseleave 以实现title的显示隐藏
        *titleSourceTarget title值的来源元素；title值的来源元素，默认当前注册事件的元素
        *titleSourceAttr title值的来源属性，默认text
        *title 值，优先于titleSourceAttr
        */
        registerEventForTitle: function (titleSourceTarget, titleSourceAttr, title) {
            titleSourceTarget = titleSourceTarget || this;
            titleSourceAttr = titleSourceAttr || '';
            var jqSourceTarget = $(titleSourceTarget);
            var domSourceTarget = jqSourceTarget[0];
            var jqTarget = $(this);
            var width = jqSourceTarget.width();
            var scrollWidth = domSourceTarget.scrollWidth;

            title = title || jqSourceTarget.attr(titleSourceAttr) || jqSourceTarget.text();

            jqTarget.on({
                mouseenter: function (event) {
                    if (scrollWidth > width)
                        jqTarget.attr('title', title);
                },
                mouseleave: function (event) {
                    jqTarget.attr('title', '');
                }
            });
        }
    };

    for (var fnName in extendFn) {
        if (extendFn.hasOwnProperty(fnName) === false) continue;
        var fnV = extendFn[fnName];
        if (typeof fnV == 'function') {
            HTMLElement.prototype[fnName] = fnV;
            if (jQuery) jQuery.fn[fnName] = fnV;
        }
    };
}();