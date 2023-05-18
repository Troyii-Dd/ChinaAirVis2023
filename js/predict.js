function predict(pd) {
    var proname = pd;
    if (proname === "长沙市") {
        var cityfilename = "../data/city_predict/changsha.csv";
    } else if (proname === "成都市") {
        var cityfilename = "../data/city_predict/chengdu.csv";
    } else if (proname === "哈尔滨") {
        var cityfilename = "../data/city_predict/haerbin.csv";
    } else if (proname === "杭州市") {
        var cityfilename = "../data/city_predict/hangzhou.csv";
    } else if (proname === "济南市") {
        var cityfilename = "../data/city_predict/jinan.csv";
    } else if (proname === "郑州市") {
        var cityfilename = "../data/city_predict/zhengzhou.csv";
    } else if (proname === "乌鲁木齐") {
        var cityfilename = "../data/city_predict/wulumuqi.csv";
    }
    var a = Promise.resolve(d3.csv(cityfilename));
    a.then(function (result) {
        console.log(result);
        console.log(result.length);

        var data = [];
        for (var i = 0; i < result.length; i++) {
            data.push([i + 1, result[i]["AQI"], result[i]["AQI_real"]]);
        }
        console.log(data);

        var myChart = echarts.init(document.getElementById("main"));
        myChart.setOption(
            (option = {
                title: {
                    text: proname + " AQI (2019年1月)",
                    left: "15%",
                    top: "10%",
                },
                tooltip: {
                    trigger: "axis",
                },
                grid: {
                    left: "15%",
                    right: "15%",
                    top: "23%",
                    bottom: "10%",
                },
                xAxis: {
                    data: data.map(function (item) {
                        return item[0];
                    }),
                },
                yAxis: {},
                toolbox: {
                    right: 10,
                    feature: {
                        dataZoom: {
                            yAxisIndex: "none",
                        },
                        restore: {},
                        saveAsImage: {},
                    },
                },
                dataZoom: [
                    {
                        startValue: "1",
                    },
                    {
                        type: "inside",
                    },
                ],
                visualMap: {  //视觉映射组件
                    top: 50,
                    right: 10,
                    pieces: [
                        {
                            gt: 0,
                            lte: 50,
                            color: "#93CE07",
                        },
                        {
                            gt: 50,
                            lte: 100,
                            color: "#FBDB0F",
                        },
                        {
                            gt: 100,
                            lte: 150,
                            color: "#FC7D02",
                        },
                        {
                            gt: 150,
                            lte: 200,
                            color: "#FD0100",
                        },
                        {
                            gt: 200,
                            lte: 300,
                            color: "#AA069F",
                        },
                        {
                            gt: 300,
                            color: "#AC3B2A",
                        },
                    ],
                    outOfRange: {
                        color: "#999",
                    },
                },
                series: [{
                    name: proname + " AQI（预测）",
                    type: "line",
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    lineStyle: {
                        opacity: 0.7,
                        type: 'dotted'
                    },
                    markLine: {
                        silent: true,
                        lineStyle: {
                            color: "#424242",  //标线的颜色
                        },
                        data: [
                            {
                                yAxis: 50,
                            },
                            {
                                yAxis: 100,
                            },
                            {
                                yAxis: 150,
                            },
                            {
                                yAxis: 200,
                            },
                            {
                                yAxis: 300,
                            },
                        ],
                    },
                },
                {
                    name: proname + " AQI（实际）",
                    type: "line",
                    data: data.map(function (item) {
                        return item[2];
                    })
                }
                ],
            })
        );
    });
}