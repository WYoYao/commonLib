var module = {
    controlTypes: [],
    selConfigItem: {}
};

$(function () {
    new Vue({
        el: "#navList",
        data: module,
        methods: {
            selConfig: function (item, event, controltype, config) {
                module.selConfigItem = item;
                $('#rightBox').show();

                var childName = config.name == 'child' ? item.name : item.defaultChild.name;
                var controlTag = controltype.name + '-' + childName;
                var attrStr = config.name == 'attr' && item.name == item.mainAttrName ? '' : ' ' + item.mainAttrName + '="我是' + controltype.note + '"';

                if (config.name == 'attr') {
                    var selAttrName = item.name;
                    var value = item.dataType == 'boolean' ? 'true' :
                                item.dataType == 'enum' ? item.dataEnum[0] || '' : item.note;
                    attrStr += ' ' + selAttrName + '="' + value + '"';
                } else if (config.name == 'event') {
                    attrStr += ' ' + item.name + '="eventCall"';
                }
                var createStr = '<' + controlTag + attrStr + '></' + controlTag + '>';
                $('#txtsource').val(createStr);
                run();
            }
        }
    });
    new Vue({
        el: "#rightBox",
        data: module,
        methods: {}
    });
});

function eventCall(event) {
    alert(event);
};