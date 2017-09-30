/*配置项*/
var config = {
    port: 7004,
    isInitBase: false,        //为true时将在网站启动时创建数据库及表，并生成数据配置页面
    isRealData: false       //是否获取真实数据，默认false，为false时，为虚假数据
};
module.exports = config;
