var pchart = (function () {
    /*
    *dataType和timeType的统一说明
    *dataType 数据类型(默认为0)      0 累积型数据     1 连续型数据
    *timeType 时间类型(默认dd)   y年   yy年到年   M月    MM月到月      d日  dd日到日    w周   ww周到周
    *------------------------------------------------------------------------------------------------
    *X轴根据timeType的显示规则为
    *对于累积型数据(相差，是指数据源内第一条数据的时间和最后一条数据的时间的差值)
    *   y X轴按月显示，例：2016.03     yy 相差<=1年(366天)时，同y；否则按年显示，例：2016
    *   M X轴按天显示，例：03.01       MM 相差<=1月(31天)时，同M；否则同y
    *   w X轴按小时显示，例：03.01 13:13     ww <=1周时，同w；>1周时，同M
    *   d X轴按小时显示，例：13:13     dd 相差<=1天时，同d；相差>1天&<=7天时，同w；相差>7天时，同M
    *对于连续型数据
    *   按小时显示，例：13:13,最后一个点为后一天的零点，显示成24:00
    */

    function persagy_chart() {
    };

    persagy_chart.instance = function () {
        return persagy_chart._instance || (persagy_chart._instance = new persagy_chart()) || persagy_chart._instance;
    };

    /*创建单一柱   可标记最大值、最小值
    *object类型的objParam，属性如下：
    *id 容器ID    legend 为true时创建图例,默认为true  legendClick  为false时图例不可点击，默认为true
    *legendAlign 图例对齐方式，支持left、right(默认)
    *tipFormatter 提示的样式，格式同tooltip.formatter的格式
    *mark 为true时标记最大值最小值
    *maxIcon 最大值图标的路径   minIcon 最小值图标的路径
    *data 数据源，格式同highchart的data格式
    *color 柱的颜色     name 柱的名称
    *dataType 数据类型      timeType 时间类型
    *xaxisNum  X轴显示的刻度数量
    */
    persagy_chart.prototype.createSingleColumn = function (objParam) {
        objParam = objParam || {};
        var serie = {
            name: objParam.name,
            color: objParam.color,
            data: objParam.data || []
        };
        var chart = persagy_chartToll.instanceColumn(objParam);
        chart.ptype = persagy_chartToll.columnType.single;
        chart.addSeriesArr(serie, objParam.dataType, objParam.timeType, objParam.xaxisNum);
        return chart;
    };

    /*创建堆积柱   不可标记最大值、最小值
    *object类型的objParam，属性如下：
    *id 容器ID    legend 为true时创建图例,默认为true  legendClick  为false时图例不可点击，默认为true
    *legendAlign 图例对齐方式，支持left、right(默认)
    *tipFormatter 提示的样式，格式同tooltip.formatter的格式
    *maxIcon 最大值图标的路径   minIcon 最小值图标的路径
    *series 数据源
    *dataType 数据类型      timeType 时间类型
    *xaxisNum  X轴显示的刻度数量
    */
    persagy_chart.prototype.createStackColumn = function (objParam) {
        objParam = objParam || {};
        var chart = persagy_chartToll.instanceColumn(objParam);
        chart.ptype = persagy_chartToll.columnType.stack;
        chart.addSeriesArr(objParam.series, objParam.dataType, objParam.timeType, objParam.xaxisNum);
        return chart;
    };

    /*创建柱和线的对比图
    *参数同createStackColumn方法
    */
    persagy_chart.prototype.createLineColumn = function (objParam) {
        objParam = objParam || {};
        var chart = persagy_chartToll.instanceColumn(objParam);
        chart.ptype = persagy_chartToll.columnType.columnline;
        chart.addSeriesArr(objParam.series, objParam.dataType, objParam.timeType, objParam.xaxisNum);
        return chart;
    };



    /*创建折线图
    *object类型的objParam，属性如下：
    *id 容器ID    legend 为true时创建图例,默认为true     legendClick  为false时图例不可点击，默认为true
    *legendAlign 图例对齐方式，支持left、right(默认)
    *tipFormatter 提示的样式，格式同tooltip.formatter的格式
    *maxIcon 最大值图标的路径   minIcon 最小值图标的路径
    *series 数据源
    *plotLine  为true时创建参考线
    *pcolor参考线颜色  pstyle参考线样式   pid  存放辅助线值的元素ID
    *dataType 数据类型      timeType 时间类型
    *xaxisNum  X轴显示的刻度数量
    */
    persagy_chart.prototype.createLine = function (objParam) {
        objParam = objParam || {};
        var chart = persagy_chartToll.instanceLine(objParam);
        chart.ptype = persagy_chartToll.lineType.line;
        chart.addSeriesArr(objParam.series, objParam.dataType, objParam.timeType, objParam.xaxisNum);
        return chart;
    };

    /*创建光滑折线图   可标记最大值、最小值
    *参数同createLine
    */
    persagy_chart.prototype.createSpLine = function (objParam) {
        objParam = objParam || {};
        var chart = persagy_chartToll.instanceLine(objParam);
        chart.ptype = persagy_chartToll.lineType.spline;
        chart.addSeriesArr(objParam.series, objParam.dataType, objParam.timeType, objParam.xaxisNum);
        return chart;
    };



    /*创建实心饼或环chart
    *object类型的objParam，属性如下：
    *id 容器ID   colors 颜色数组
    *tipFormatter 提示的样式，格式同tooltip.formatter的格式
    *data 数据源   
    *isRing 为true时创建圆环，默认false  titleHtml  圆环内显示的html
    */
    persagy_chart.prototype.createPie = function (objParam) {
        objParam = objParam || {};
        var chart = persagy_chartToll.instancePie(objParam);
        var serie = {
            type: 'pie',
            data: objParam.data || []
        };
        chart.addSeriesArr(serie);
        return chart;
    };



    /*创建区域chart
    *object类型的objParam，属性如下：
    *id 容器ID  legend 为true时创建图例,默认为true   legendClick  为false时图例不可点击，默认为true
    *legendAlign 图例对齐方式，支持left、right(默认)
    *tipFormatter 提示的样式，格式同tooltip.formatter的格式
    *series 数据源
    *plotLine  为true时创建参考线
    *pcolor参考线颜色  pstyle参考线样式   pid  存放辅助线值的元素ID
    *dataType 数据类型      timeType 时间类型
    *xaxisNum  X轴显示的刻度数量
    */
    persagy_chart.prototype.createNormalArea = function (objParam) {
        objParam = objParam || {};
        objParam.stacking = false;
        var chart = persagy_chartToll.instanceArea(objParam);
        chart.ptype = persagy_chartToll.areaType.normal;
        chart.addSeriesArr(objParam.series, objParam.dataType, objParam.timeType, objParam.xaxisNum);
        return chart;
    };

    /*创建堆积区域chart
    *参数同createNormalArea
    */
    persagy_chart.prototype.createStackArea = function (objParam) {
        objParam = objParam || {};
        objParam.stacking = true;
        var chart = persagy_chartToll.instanceArea(objParam);
        chart.ptype = persagy_chartToll.areaType.stackArea;
        chart.addSeriesArr(objParam.series, objParam.dataType, objParam.timeType, objParam.xaxisNum);
        return chart;
    };








    /*pchart辅助工具*/
    function persagy_chartToll() { };
    /*默认的最大最小值的图标*/
    persagy_chartToll.markImg = {
        max: '../imgs/max.png', min: '../imgs/min.png'
    };
    /*颜色数组*/
    persagy_chartToll.colors = ['#02a9d1', '#e26db4', '#f79862', '#d2e500', '#ffcd02', '#8b70e2', '#61d6bf',
        '#4a74e0', '#af23d2', '#99f090', '#04e143', '#008ba4', '#ed7cf7', '#008c1b', '#973c08',
        '#da603a', '#d19505', '#1313d8', '#db0f48', '#93ea8a', '#4566b8', '#45b4b8', '#45b848',
        '#b1b845', '#b87b45', '#b84586', '#8e45b8', '#6150ff', '#129dd1', '#18eedc', '#ecf249', '#e29c22'];
    /*柱的类型*/
    persagy_chartToll.columnType = {
        /*单一柱  可带标记*/
        single: 'single',
        /*堆积柱*/
        stack: 'stack',
        /*柱和线的对比*/
        columnline: 'columnline'
    };
    /*线的类型*/
    persagy_chartToll.lineType = {
        /*折线*/
        line: 'line',
        /*带区域的折线*/
        lineArea: 'lineArea',
        /*光滑曲线*/
        spline: 'spline'
    };
    /*区域图的类型*/
    persagy_chartToll.areaType = {
        /*堆积*/
        stackArea: 'stackArea',
        /*普通*/
        normal: 'normal'
    };


    /*标记出最大值最小值*/
    persagy_chartToll.addMaxMinMarker = function (chart, maxIcon, minIcon) {
        persagy_chartToll.removeMaxMinMarker(chart);
        var series = chart.series;
        var isRemoveMaxMinMarker = true;
        for (var i = 0; i < series.length; i++) {
            if (series[i].visible == true) {
                isRemoveMaxMinMarker = false;
                break;
            }
        }
        if (isRemoveMaxMinMarker == true) return;
        var maxPoint, minPoint;
        for (var i = 0; i < series.length; i++) {
            var currSeri = series[i];
            if (currSeri.visible == false) continue;
            for (var j = 0; j < currSeri.data.length; j++) {
                var currPoint = currSeri.data[j];
                if (maxPoint == null) {
                    maxPoint = minPoint = currPoint;
                } else {
                    maxPoint = currPoint.y > maxPoint.y ? currPoint : maxPoint;
                    minPoint = currPoint.y < minPoint.y ? currPoint : minPoint;
                }
            };
        }
        if (!maxPoint || !minPoint) return;
        var maxX = maxPoint.plotX;
        var maxY = maxPoint.plotY;
        var maxplotL = maxPoint.series.chart.plotLeft
        var maxptype = maxPoint.series.type;
        var maxYdiff;
        if (maxptype == 'column') {
            maxYdiff = 24;
        } else {
            maxYdiff = 18;
        }
        chart.maxMarker = chart.renderer.image(maxIcon || persagy_chartToll.markImg.max, maxX + maxplotL - 12, maxY + maxYdiff, 24, 28).attr({
            zIndex: 8
        }).add();
        var minX = minPoint.plotX;
        var minY = minPoint.plotY;
        var minptype = maxPoint.series.type;
        var minYdiff;
        if (minptype == 'column') {
            minYdiff = 24;
        } else {
            minYdiff = 18;
        }
        var minplotL = maxPoint.series.chart.plotLeft
        chart.minMarker = chart.renderer.image(minIcon || persagy_chartToll.markImg.min, minX + minplotL - 12, minY + minYdiff, 24, 28).attr({
            zIndex: 8
        }).add();
    };
    /*移除标记的最大值最小值*/
    persagy_chartToll.removeMaxMinMarker = function (chart) {
        if (chart.maxMarker) {
            chart.maxMarker.destroy();
            chart.maxMarker = null;
        }
        if (chart.minMarker) {
            chart.minMarker.destroy();
            chart.minMarker = null;
        }
    };
    /*默认提示*/
    persagy_chartToll.tipHtml = function () {
        return (function () {
            return function () {
                var html = '<span> x:' + this.x + '</span><span> y:' + this.y + '</span>';
                return html;
            };
        })();
    };
    /*计算第一个数据点和最后一个数据点的时间差*/
    persagy_chartToll.differTime = function (seriesArr) {
        if (seriesArr instanceof Array == false) seriesArr = [seriesArr];
        var middleTime = -1;
        var firstStr = '', lastStr = '';
        for (var i = 0; i < seriesArr.length; i++) {
            var currSerie = seriesArr[i];
            if (!currSerie) continue;
            var data = currSerie.data || [];
            firstStr = (data[0] || {}).x;
            lastStr = (data[data.length - 1] || {}).x;
            if (firstStr != null && lastStr != null)
                return new Date(lastStr).getTime() - new Date(firstStr).getTime();
        }
        return middleTime;
    };
    /*处理x轴的每个坐标*/
    persagy_chartToll.handleXPoint = function () {
        return (function () {
            return function () {
                if (this.value == null) return null;
                var dataType = this.chart.dataType;
                var timeType = this.chart.timeType;
                var differTime = this.chart.differTime;
                var oneDayTime = 1000 * 60 * 60 * 24;
                var currDate = new Date(this.value);
                if (currDate == 'Invalid Date') return this.value;
                var currTime = currDate.getTime();

                switch (parseInt(dataType)) {
                    case 1:
                        if (this.isLast) return 24;
                        return currDate.format('h:m');
                    case 0:
                        switch (timeType) {
                            case 'y': return currDate.format('y.M');
                            case 'yy':
                                return differTime <= 366 * oneDayTime ? currDate.format('y.M') : currDate.format('y');
                            case 'M': return currDate.format('M.d');
                            case 'MM': return differTime <= 31 * oneDayTime ? currDate.format('M.d') : currDate.format('y.M');
                            case 'w': return currDate.format('M.d h:m');
                            case 'ww': return differTime <= 7 * oneDayTime ? currDate.format('M.d h:m') : currDate.format('M.d');
                            case 'd': return currDate.format('h:m');
                            case 'dd': return differTime <= oneDayTime ? currDate.format('h:m')
                                : differTime <= 7 * oneDayTime ? currDate.format('M.d h:m') : currDate.format('M.d');
                            case 's': return currDate.format('h:m:s');
                        }
                }
            };
        })();
    };


    /*实例化柱chart
    *object类型的objParam，属性如下：
    *id 容器ID  legend 为true时创建图例,默认为true legendClick  为false时图例不可点击，默认为true
    *legendAlign 图例对齐方式，支持left、right(默认)
    *tipFormatter 提示的样式，格式同tooltip.formatter的格式
    *mark 为true时标记最大值最小值
    *maxIcon 最大值图标的路径  minIcon 最小值图标的路径
    */
    persagy_chartToll.instanceColumn = function (objParam) {
        return new Highcharts.Chart({
            chart: {
                renderTo: objParam.id,
                marginRight: 12,
                marginTop: 52,
                backgroundColor: "rgba(0,0,0,0)",
                style: {
                    overflow: 'visible'
                }
            },
            /*导出模块*/
            exporting: {
                enabled: false
            },
            /*版权的一些事*/
            credits: {
                enabled: false
            },
            legend: {
                enabled: objParam.legend == false ? false : true,
                align: objParam.legendAlign || 'right',
                verticalAlign: 'top',
                useHTML: true,
                itemStyle: {
                    color: '#000000',
                    radius: 5,
                    fontWeight: 'normal',
                    pointerEvents: objParam.legendClick == false ? 'none' : ''
                },
                x: 0,
                y: 0
            },
            title: {
                text: null
            },
            subtitle: {
                text: null
            },
            xAxis: {
                startOnTick: false,
                endOnTick: false,/*结束于标线；是否强制轴线在标线处结束*/
                maxPadding: 0,
                lineWidth: 1, /*刻度线整条线的长度*/
                lineColor: '#ccc',
                tickmarkPlacement: 'on',
                tickLength: 6,
                tickWidth: 1,
                type: 'datetime',
                labels: {
                    style: {
                        fontFamily: 'Arial,"微软雅黑",sans-serif'
                    },
                    enabled: true,
                    staggerLines: 1,
                    formatter: persagy_chartToll.handleXPoint()
                },
                gridZIndex: 2
            },
            yAxis: {
                title: {
                    text: null,
                },
                labels: {
                    style: {
                        fontFamily: 'Arial,"微软雅黑",sans-serif'
                    }
                },
                gridLineColor: '#dddddd',/*x轴网格线的颜色*/
                gridLineDashStyle: 'Dash',/*x轴网格线的样式*/
                gridLineWidth: 1,/*x轴网格线*/
                endOnTick: true,
                maxPadding: 0.25
            },
            tooltip: {
                enabled: true,
                animation: true,
                borderColor: null,
                borderWidth: 0,
                shadow: false,
                backgroundColor: null,
                useHTML: true,
                formatter: objParam.tipFormatter || persagy_chartToll.tipHtml(),
                style: {
                    zIndex: 6
                },
                shared: true
            },
            plotOptions: {/*绘图区选项*/
                series: {/*绘图区数列*/
                    connectNulls: false,/*是否连接一条线穿过空值点。*/
                    stickyTracking: false,/*粘连追踪*/
                    events: {/*节点事件*/
                        afterAnimate: anyFn(),
                        show: anyFn(),
                        hide: anyFn()
                    },
                    turboThreshold: 10000
                },
                column: {
                    stacking: 'normal',
                    borderWidth: 0,
                    borderColor: "red",
                    borderStyle: 'dot',
                    animation: false
                },
                line: {
                    animation: false
                }

            }
        });
        function anyFn() {
            return (function () {
                return function () {
                    /*已经完成了最初的动画,或在动画是禁用的情况下,立即显示系列。4.0版本以上才有哦*/
                    if (objParam.mark == true && this.chart.ptype != persagy_chartToll.columnType.stack) {
                        persagy_chartToll.addMaxMinMarker(this.chart, objParam.maxIcon, objParam.minIcon);
                    }
                };
            })();
        };
    };
    /*对于单一柱图的数据源进行处理*/
    persagy_chartToll.singleColumnSeries = function (seriesArr, chart) {
        if (!seriesArr) return;
        if (seriesArr instanceof Array == false) seriesArr = [seriesArr];
        for (var i = 0; i < seriesArr.length; i++) {
            var currSerie = seriesArr[i];
            currSerie.color = currSerie.color || persagy_chartToll.colors[i] ||
                            persagy_chartToll.colors[i % persagy_chartToll.colors.length];
            currSerie.type = 'column';
            chart.addSeries(currSerie);
        }
    };
    /*对于堆积柱图的数据源进行处理*/
    persagy_chartToll.stackColumnSeries = function (seriesArr, chart) {
        if (!seriesArr) return;
        if (seriesArr instanceof Array == false) seriesArr = [seriesArr];
        for (var i = seriesArr.length - 1; i >= 0; i--) {
            var currSerie = seriesArr[i];
            currSerie.color = currSerie.color || persagy_chartToll.colors[i] ||
                                    persagy_chartToll.colors[i % persagy_chartToll.colors.length];
            currSerie.type = currSerie.type || 'column';
            chart.addSeries(currSerie);
        }
    };
    /*对柱线的对比图数据源进行处理*/
    persagy_chartToll.lineColumnSeries = function (seriesArr, chart) {
        if (!seriesArr) return;
        if (seriesArr instanceof Array == false) seriesArr = [seriesArr];
        var newSeriesArr = [];

        var columnSeries = seriesArr.filter(function (currSe) {
            return !currSe.type || currSe.type == 'column';
        });
        var lineSeries = seriesArr.filter(function (currSe) {
            return currSe.type == 'line';
        });
        var j = 0, k = 0;
        var currSerie;
        for (var i = 0; i < seriesArr.length; i++) {
            if (j > 0 && k > 0) break;
            currSerie = seriesArr[i];
            if ((!currSerie.type || currSerie.type == 'column') && j == 0) {
                currSerie.type = 'column';
                currSerie.color = currSerie.color || '#69c6b3';
                chart.addSeries(currSerie);
                j++;
            }
            if (currSerie.type == 'line' && k == 0) {
                currSerie.states = currSerie.states || {
                    hover: {
                        enabled: false
                    }
                };
                currSerie.lineWidth = currSerie.lineWidth || 1.5;
                currSerie.dashStyle = currSerie.dashStyle || 'ShortDash';
                currSerie.color = currSerie.color || '#869eb4';
                currSerie.marker = currSerie.marker || {
                    enabled: true,
                    radius: 4,
                    fillColor: '#fff',
                    lineColor: null,
                    lineWidth: 1,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                };
                chart.addSeries(currSerie);
                k++;
            }
        }
    };




    /*实例化线chart
    *object类型的objParam，属性如下：
    *id 容器ID  legend 为true时创建图例,默认为true   legendClick  为false时图例不可点击，默认为true
    *legendAlign 图例对齐方式，支持left、right(默认)
    *tipFormatter 提示的样式，格式同tooltip.formatter的格式
    *mark 为true时标记最大值最小值
    *maxIcon 最大值图标的路径  minIcon 最小值图标的路径
    *plotLine  为true时创建参考线
    *pcolor参考线颜色  pstyle参考线样式   pid  存放辅助线值的元素ID
    */
    persagy_chartToll.instanceLine = function (objParam) {
        return new Highcharts.Chart({
            chart: {
                renderTo: objParam.id,
                //type: objParam.chart.type,
                marginRight: 12,
                marginTop: 52,
                backgroundColor: "rgba(0,0,0,0)",
                style: {
                    overflow: 'visible'
                }
            },
            /*导出模块*/
            exporting: {
                enabled: false
            },
            /*版权的一些事*/
            credits: {
                enabled: false
            },
            legend: {
                enabled: objParam.legend == false ? false : true,
                align: objParam.legendAlign || 'right',
                verticalAlign: 'top',
                useHTML: true,
                itemStyle: {
                    color: '#000000',
                    radius: 5,
                    fontWeight: 'normal',
                    pointerEvents: objParam.legendClick == false ? 'none' : ''
                },
                x: 0,
                y: 0
            },
            title: {
                text: null
            },
            subtitle: {
                text: null
            },
            xAxis: {
                startOnTick: false,
                endOnTick: false,/*结束于标线；是否强制轴线在标线处结束*/
                maxPadding: 0,
                lineWidth: 1, /*刻度线整条线的长度*/
                tickColor: '#ccc',
                tickLength: 6,
                tickmarkPlacement: 'on',
                tickWidth: 1,
                minorTickLength: 1,
                type: 'datetime',
                labels: {
                    style: {
                        fontFamily: 'Arial,"微软雅黑",sans-serif',
                    },
                    enabled: true,
                    staggerLines: 1,
                    formatter: persagy_chartToll.handleXPoint()
                },
                gridZIndex: 2
            },
            yAxis: {
                title: {
                    text: null,
                },
                labels: {
                    style: {
                        fontFamily: 'Arial,"微软雅黑",sans-serif'
                    }
                },
                gridLineColor: '#dddddd',/*x轴网格线的颜色*/
                gridLineDashStyle: 'Dash',/*x轴网格线的样式*/
                gridLineWidth: 1,/*x轴网格线*/
                endOnTick: true,
                maxPadding: 0.25
            },
            tooltip: {
                enabled: true,
                animation: true,
                borderColor: null,
                borderWidth: 0,
                shadow: false,
                backgroundColor: null,
                useHTML: true,
                formatter: objParam.tipFormatter || persagy_chartToll.tipHtml(),
                crosshairs: {
                    width: 1,
                    color: '#dddddd',
                    dashStyle: 'ShortDashDotDot',

                },
                shared: true
            },
            plotOptions: {/*绘图区选项*/
                series: {/*绘图区数列*/
                    connectNulls: false,/*是否连接一条线穿过空值点。*/
                    stickyTracking: false,/*粘连追踪*/
                    events: {/*节点事件*/
                        afterAnimate: anyFn(), show: anyFn(), hide: anyFn()
                    },
                    turboThreshold: 10000//最大点

                }
            }
        });
        function anyFn() {
            return (function () {
                return function () {
                    /*创建最大最小标记*/
                    if (objParam.mark == true && this.chart.ptype != persagy_chartToll.lineType.lineArea) {
                        persagy_chartToll.addMaxMinMarker(this.chart, objParam.maxIcon, objParam.minIcon);
                    }
                    /*绘制参考线*/
                    if (objParam.plotLine == true && this.chart.ptype != persagy_chartToll.lineType.lineArea) {
                        this.chart.addPlotLine({
                            color: objParam.pcolor, style: objParam.pstyle, id: objParam.pid
                        });
                    }
                };
            })();
        };
    };
    /*对折线图的数据源进行处理*/
    persagy_chartToll.lineSeries = function (seriesArr, chart) {
        if (!seriesArr) return;
        if (seriesArr instanceof Array == false) seriesArr = [seriesArr];

        var areaLines = seriesArr.filter(function (currSerie) {
            return currSerie.type == 'arearange';
        });
        if (areaLines.length > 0) {
            chart.addSeries(changeSerie(areaLines[0], 'rgba(235,242,245,0.7)', 'arearange'));
            chart.ptype = persagy_chartToll.lineType.lineArea;
        }

        var lines = seriesArr.filter(function (currSerie) {
            return !currSerie.type || currSerie.type == 'line';
        });
        for (var i = 0; i < lines.length; i++) {
            chart.addSeries(changeSerie(lines[i], persagy_chartToll.colors[i], 'line'));
        }

        function changeSerie(serie, lineColor, type) {
            serie.states = serie.states || {
                hover: {
                    enabled: true,
                    lineWidth: 2
                }
            };
            serie.marker = serie.marker || {
                enabled: true,
                radius: 5,
                lineColor: 'white',
                lineWidth: 1,
                symbol: 'circle',
                states: {
                    hover: {
                        fillColor: serie.color || lineColor,
                        lineColor: "#fff",
                        lineWidth: 0,
                        radius: 5
                    }
                }
            };
            serie.color = serie.color || lineColor;
            serie.type = serie.type || type;
            return serie;
        }
    };
    /*对光滑折线图的数据源进行处理*/
    persagy_chartToll.splineSeries = function (seriesArr, chart) {
        if (!seriesArr) return;
        if (seriesArr instanceof Array == false) seriesArr = [seriesArr];

        var areaLines = seriesArr.filter(function (currSerie) {
            return currSerie.type == 'arearange';
        });
        if (areaLines.length > 0) {
            chart.addSeries(changeSerie(areaLines[0], 'rgba(235,242,245,0.7)', 'arearange'));
        }

        var lines = seriesArr.filter(function (currSerie) {
            return currSerie.type == 'spline' || !currSerie.type;
        });
        for (var i = 0; i < lines.length; i++) {
            chart.addSeries(changeSerie(lines[i], persagy_chartToll.colors[i], 'spline'));
        }
        function changeSerie(serie, lineColor, type) {
            serie.states = serie.states || {
                hover: {
                    enabled: false
                }
            };
            serie.marker = serie.marker || {
                enabled: false
            };
            serie.color = serie.color || lineColor;
            serie.type = serie.type || type;
            return serie;
        }
    };


    /*实例化饼或环chart
    *object类型的objParam，属性如下：
    *id 容器ID   colors 颜色数组   titleHtml 自定义的标题，圆心饼图专用
    *tipFormatter 提示的样式，格式同tooltip.formatter的格式
    *isRing 为true时创建圆环，默认false
    */
    persagy_chartToll.instancePie = function (objParam) {
        return new Highcharts.Chart({
            chart: {
                renderTo: objParam.id,
                plotBackgroundColor: "rgba(0,0,0,0)",
                backgroundColor: "rgba(0,0,0,0)",
                plotBorderWidth: null,

            },
            colors: objParam.colors || persagy_chartToll.colors,
            title: {
                useHTML: true,
                text: objParam.titleHtml,
                align: 'center',
                verticalAlign: 'middle',
                y: -30,
                zIndex: -1
            },
            credits: {
                enabled: false,
            },
            tooltip: {
                enabled: true,
                animation: true,
                borderColor: null,
                borderWidth: 0,
                shadow: false,
                backgroundColor: null,
                useHTML: true,
                formatter: objParam.tipFormatter || persagy_chartToll.tipHtml(),
                zIndex: 6
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    innerSize: objParam.isRing == true ? "75%" : "0",
                    borderWidth: 0,
                    animation: false
                }
            }
        });
    };


    /*实例化区域chart
    *object类型的objParam，属性如下：
    *id 容器ID  legend 为true时创建图例,默认为true   legendClick  为false时图例不可点击，默认为true
    *legendAlign 图例对齐方式，支持left、right(默认)
    *tipFormatter 提示的样式，格式同tooltip.formatter的格式
    *stacking 为true时创建堆叠图
    *plotLine  为true时创建参考线
    *pcolor参考线颜色  pstyle参考线样式   pid  存放辅助线值的元素ID
    */
    persagy_chartToll.instanceArea = function (objParam) {
        return new Highcharts.Chart({
            chart: {
                renderTo: objParam.id,
                marginRight: 12,
                marginTop: 60,
                backgroundColor: "rgba(0,0,0,0)",
                style: {
                    overflow: 'visible'
                }
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: objParam.legend == false ? false : true,
                align: objParam.legendAlign || 'right',
                verticalAlign: 'top',
                itemStyle: {
                    color: '#000000',
                    fontWeight: 'normal',
                    radius: 5,
                    pointerEvents: objParam.legendClick == false ? 'none' : ''
                },
                useHTML: true,
                x: 0,
                y: 10
            },
            title: {
                text: null
            },
            subtitle: {
                text: null
            },
            xAxis: {
                startOnTick: false,
                endOnTick: false,
                maxPadding: 0,
                lineWidth: 1,
                lineColor: '#ccc',
                tickColor: '#ccc',
                tickLength: 6,
                tickmarkPlacement: 'on',
                tickWidth: 1,
                type: 'datetime',
                labels: {
                    style: {
                        fontFamily: 'Arial,"微软雅黑",sans-serif'
                    },
                    enabled: true,
                    staggerLines: 1,
                    formatter: persagy_chartToll.handleXPoint()
                },
                gridZIndex: 2
            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    style: {
                        fontFamily: 'Arial,"微软雅黑",sans-serif'
                    }
                },
                gridLineColor: '#dddddd',
                gridLineDashStyle: 'Dash',
                gridLineWidth: 1,
                endOnTick: true,
                maxPadding: 0.25
            },
            tooltip: {
                enabled: true,
                animation: true,
                borderColor: null,
                borderWidth: 0,
                shadow: false,
                backgroundColor: null,
                useHTML: true,
                formatter: objParam.tipFormatter || persagy_chartToll.tipHtml(),
                style: {
                    zIndex: 10
                },
                crosshairs: {
                    width: 1,
                    color: '#dddddd',
                    dashStyle: 'ShortDashDotDot',
                    zIndex: 5
                },
                shared: true
            },
            plotOptions: {
                series: {
                    lineWidth: 2,
                    stacking: objParam.stacking == true ? 'normal' : '',
                    connectNulls: false,
                    stickyTracking: false,
                    events: {
                        afterAnimate: anyFn(), show: anyFn(), hide: anyFn()
                    },
                    turboThreshold: 10000

                }
            }
        });
        function anyFn() {
            return (function () {
                return function () {
                    /*绘制参考线*/
                    if (objParam.plotLine == true) {
                        this.chart.addPlotLine({
                            color: objParam.pcolor, style: objParam.pstyle, id: objParam.pid
                        });
                    }
                };
            })();
        };
    };
    /*对普通区域图的数据源进行处理*/
    persagy_chartToll.normalAreaSeries = function (seriesArr, chart) {
        persagy_chartToll.areaSeries(seriesArr, 'asc', chart);
    };
    /*对堆积区域图的数据源进行处理*/
    persagy_chartToll.stackAreaSeries = function (seriesArr, chart) {
        persagy_chartToll.areaSeries(seriesArr, 'desc', chart);
    };
    persagy_chartToll.areaSeries = function (seriesArr, inerationType, chart) {
        if (!seriesArr) return;
        if (seriesArr instanceof Array == false) seriesArr = [seriesArr];
        var opacity = seriesArr.length == 1 ? '1' : '0.35';
        var lastOpactiy = seriesArr.length == 1 ? '0' : opacity;
        if (inerationType == 'asc') {
            for (var i = 0; i < seriesArr.length; i++) {
                var seriesItem = getSerie(seriesArr[i], i);
                chart.addSeries(seriesItem);
            }
        } else if (inerationType == 'desc') {
            for (var i = seriesArr.length - 1; i >= 0; i--) {
                var seriesItem = getSerie(seriesArr[i], i);
                chart.addSeries(seriesItem);
            }
        }

        function getSerie(seriesItem, index) {
            var currColor = seriesItem.color || persagy_chartToll.colors[index];
            seriesItem.states = seriesItem.states || {
                hover: {
                    enabled: false
                }
            };
            seriesItem.fillColor = seriesItem.fillColor || {
                linearGradient: [0, 0, 0, 300],
                stops: [
                      [0, Highcharts.Color(currColor).setOpacity(opacity).get('rgba')],
                      [1, Highcharts.Color(currColor).setOpacity(lastOpactiy).get('rgba')]
                ]
            };
            seriesItem.color = currColor;
            seriesItem.marker = seriesItem.marker || {
                enabled: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            };
            seriesItem.type = 'area';
            return seriesItem;
        }
    };

    /*对大众数据源进行处理*/
    persagy_chartToll.normalSeries = function (seriesArr, chart) {
        if (!seriesArr) return;
        if (seriesArr instanceof Array == false) seriesArr = [seriesArr];
        for (var i = 0; i < seriesArr.length; i++) {
            var currSerie = seriesArr[i];
            currSerie.color = currSerie.color || persagy_chartToll.colors[i] ||
                            persagy_chartToll.colors[i % persagy_chartToll.colors.length];
            currSerie.type = currSerie.type;
            chart.addSeries(currSerie);
        }
    };

    /*Highcharts.Chart.prototype追加自定义方法*/
    function highchartsProAppend() {
        /*移除所有的series*/
        Highcharts.Chart.prototype.removeSeries = function () {
            for (var i = 0; i < this.series.length; i++) {
                this.series[i].remove();
                i--;
            }
        };
        /*批量新增seires
        * seriesArr可以是series数组，也可以是一个series对象
        * dataType 数据类型     timeType 时间类型
        *xaxisNum X轴显示的刻度数量
        */
        Highcharts.Chart.prototype.addSeriesArr = function (seriesArr, dataType, timeType, xaxisNum) {
            if (!seriesArr) return;
            this.removeSeries();
            this.dataType = dataType || 0;
            this.timeType = timeType || 'dd';
            if (seriesArr instanceof Array == false) seriesArr = [seriesArr];
            this.differTime = persagy_chartToll.differTime(seriesArr);
            //var currType = '';
            //暂且不用
            //var categories = [];
            //var isPushCategories = true;
            //for (var j = 0; j < seriesArr.length; j++) {
            //    var currSerie = seriesArr[j];
            //    var data = currSerie.data;
            //    for (var i = 0; i < data.length; i++) {
            //        var currData = data[i];
            //        var cate = (currSerie.type == 'arearange' ? currData[0] : currData.x) || i;
            //        isPushCategories ? categories.push(cate) : '';
            //        currSerie.type == 'arearange' ? currData.splice(0, 1) : delete data[i].x;
            //    }
            //    isPushCategories = false;
            //}
            //var step = !xaxisNum ? 1 : categories.length < xaxisNum ? 1 : Math.round(categories.length / xaxisNum);
            //this.axes[0].setCategories(categories);
            //this.axes[0].update({
            //    tickInterval: step
            //}, true);

            switch (this.ptype) {
                case persagy_chartToll.columnType.single:
                    return persagy_chartToll.singleColumnSeries(seriesArr, this);
                case persagy_chartToll.columnType.stack:
                    return persagy_chartToll.stackColumnSeries(seriesArr, this);
                case persagy_chartToll.columnType.columnline:
                    return persagy_chartToll.lineColumnSeries(seriesArr, this);
                case persagy_chartToll.lineType.line:
                    return persagy_chartToll.lineSeries(seriesArr, this);
                case persagy_chartToll.lineType.spline:
                    return persagy_chartToll.splineSeries(seriesArr, this);
                case persagy_chartToll.areaType.normal:
                    return persagy_chartToll.normalAreaSeries(seriesArr, this);
                case persagy_chartToll.areaType.stackArea:
                    return persagy_chartToll.stackAreaSeries(seriesArr, this);
                default:
                    return persagy_chartToll.normalSeries(seriesArr, this);
            }
        };
        /*移除指定的辅助线 plotLineId即显示辅助线值的元素ID*/
        Highcharts.Chart.prototype.removePlotLine = function (plotLineId) {
            if (this.yAxis[0].plotLinesAndBands.length == 0) return;
            this.yAxis[0].plotLinesAndBands[0].destroy();
            $('#' + plotLineId).hide();
        };
        /*添加辅助线
        *color参考线颜色  style参考线样式
        *id  存放辅助线值的元素ID
        *value 此参数没值时从id对应的元素上取text作为value
        */
        Highcharts.Chart.prototype.addPlotLine = function (lineObj) {
            if (!lineObj || !lineObj.id) return;
            this.removePlotLine(lineObj.id);
            var isRemovePlotLine = true;
            for (var i = 0; i < this.series.length; i++) {
                if (this.series[i].visible == true) {
                    isRemovePlotLine = false;
                    break;
                }
            }
            if (isRemovePlotLine == true) return;
            var target = $("#" + lineObj.id);
            var value = lineObj.value || target.text();
            if (!value) return;
            target.text(value);
            this.yAxis[0].addPlotLine({
                value: value,
                color: lineObj.color || '#7a94ad',
                dashStyle: lineObj.style || 'ShortDash',
                width: 2,
                zIndex: 100,
                id: lineObj.id
            });
            var plotLine = this.yAxis[0].plotLinesAndBands[0];
            var yValue = plotLine.svgElem.d;
            var yValues = yValue.split(" ", 3);
            var w = this.plotLeft;
            target.show().css({
                top: (parseInt(yValues[2])),
                width: w
            });
        };
    };

    highchartsProAppend();

    var pis = persagy_chart.instance();
    pis.pcolors = persagy_chartToll.colors;
    pis.multiItemColors = ['#FED045', '#4ED6A6', '#FE3908', '#4EA6D2']; //A、B、C、合
    return pis;
})();