function deal_with_txt(pollution) {
    if (pollution === "PM2.5(μg/m3)") {
        return "log(PM2.5(μg/m3))";
    } else if (pollution === "CO(μg/m3)") {
        return "log(CO(μg/m3))";
    } else if (pollution === "PM10(μg/m3)") {
        return "log(PM10(μg/m3))";
    } else if (pollution === "SO2(μg/m3)") {
        return "log(SO2(μg/m3))";
    } else if (pollution === "NO2(μg/m3)") {
        return "log(NO2(μg/m3))";
    } else if (pollution === "O3(μg/m3)") {
        return "log(O3(μg/m3))";
    }
}

function reback_txt(pollution) {
    if (pollution === "log(PM2.5(μg/m3))") {
        return "PM2.5(μg/m3)";
    } else if (pollution === "log(CO(μg/m3))") {
        return "CO(μg/m3)";
    } else if (pollution === "log(PM10(μg/m3))") {
        return "PM10(μg/m3)";
    } else if (pollution === "log(SO2(μg/m3))") {
        return "SO2(μg/m3)";
    } else if (pollution === "log(NO2(μg/m3))") {
        return "NO2(μg/m3)";
    } else if (pollution === "log(O3(μg/m3))") {
        return "O3(μg/m3)";
    }
}

//读数据：条形图，雷达图
function data_min_chart(pst, ymd, type) {
    var mbyear = ymd[0] + ymd[1] + ymd[2] + ymd[3];
    var mbmonth = ymd[5] + ymd[6];
    var mbday = ymd[8] + ymd[9];

    var path_file_data =
        "../data/city/" +
        pst +  //shandong
        "/" +
        mbyear +
        mbmonth +  //201301
        "/CN-Reanalysis-daily-" +
        mbyear +
        mbmonth +
        mbday +  //20130101
        "00.csv";
    console.log(path_file_data);

    d3.csv(path_file_data).then(function (data) {  //读取数据
        // console.log(data[0])
        var ppdata = {
            "AQI": data[0]["AQI"],
            "CO(毫克每立方米)": data[0]["CO(毫克每立方米)"],
            "SO2(微克每立方米)": data[0]["SO2(微克每立方米)"],
            "NO2(微克每立方米)": data[0]["NO2(微克每立方米)"],
            "O3(微克每立方米)": data[0]["O3(微克每立方米)"],
            "PM2.5(微克每立方米)": data[0]["PM2.5(微克每立方米)"],
            "PM10(微克每立方米)": data[0]["PM10(微克每立方米)"],
            "Major pollutants": data[0]["Major pollutants"]
        };
        console.log(ppdata);
        if (type === 'bar') {
            min_barchart(ppdata);
        } else if (type === 'rar') {
            min_radarchart(ppdata);
        }
    })
}

// bar chart
function min_barchart(d, pollution = "PM2.5(μg/m3)") {
    d3.select("#svg1").remove();  // remove the old chart
    var goal = deal_with_txt(pollution);
    // console.log(goal);
    var ddata = [];  // data for bar chart
    var jst = {};  // json for bar chart
    var flag = false;
    jst = {
        group: "log(PM2.5(μg/m3))",
        value: Math.log(d["PM2.5(微克每立方米)"]),
    };
    ddata.push(jst);
    jst = {
        group: "log(CO(μg/m3))",
        value: Math.log(d["CO(毫克每立方米)"] * 1000),  // 1mg = 1000μg
    };
    ddata.push(jst);
    jst = {
        group: "log(PM10(μg/m3))",
        value: Math.log(d["PM10(微克每立方米)"]),
    };
    ddata.push(jst);
    jst = {
        group: "log(SO2(μg/m3))",
        value: Math.log(d["SO2(微克每立方米)"]),
    };
    ddata.push(jst);
    jst = {
        group: "log(NO2(μg/m3))",
        value: Math.log(d["NO2(微克每立方米)"]),
    };
    ddata.push(jst);
    jst = {
        group: "log(O3(μg/m3))",
        value: Math.log(d["O3(微克每立方米)"])
    };
    ddata.push(jst);

    var major = d["Major pollutants"];  //首要污染物
    if (major === "CO") {
        major += "(μg/m3)";
        major = "log(" + major + ")";
    } else {
        major += "(μg/m3)";
        major = "log(" + major + ")";
    }

    const margin = { top: 10, right: 30, bottom: 100, left: 90 },
        width = 370 - margin.left - margin.right,
        height = 270 - margin.top - margin.bottom;
    var svg1 = d3
        .select("#barchart") //画一个svg画布
        .append("svg")
        .attr("height", "200").attr("width", "100%")  //设置画布的大小
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "svg1")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);  //设置画布的位置

    //设置x轴
    const x = d3
        .scaleBand()  //设置比例尺
        .range([0, width])  //x轴范围
        .domain(ddata.map((d) => d.group))  //x轴数据
        .padding(0.5);  //柱子之间的间距
    svg1
        .append("g")
        .attr("transform", `translate(0,${height})`)  //设置x轴的位置
        //设置x轴的样式
        .attr("class", "axisRed")
        .call(d3.axisBottom(x))
        .selectAll("text")  //设置x轴的文字样式
        .attr("transform", "translate(-10,0)rotate(-45)")  //设置x轴标签的位置和旋转角度
        .style("text-anchor", "end");

    //设置y轴
    let ttop = [];  //找出最大值
    for (var i = 0; i < 6; i++) {
        ttop.push(ddata[i].value);
    }
    // console.log(ttop);
    var tt = Math.max.apply(null, ttop);
    // console.log(tt);
    tt = tt + 2;  //y轴的最大值
    const y = d3
        .scaleLinear()  //设置y轴
        .range([height, 0])  //设置比例尺的范围
        .domain([0, tt]);  //设置比例尺的域
    svg1
        .append("g")
        //设置y轴的样式
        .attr("class", "axisRed")
        .call(d3.axisLeft(y))

    svg1
        .selectAll("mybar")
        .data(ddata)
        .join("rect")
        .attr("x", (d) => x(d.group))
        .attr("width", x.bandwidth())
        .attr("fill", function (d) {
            if (d.group === major && d.group === goal) {  //首要污染物&目标污染物
                return "#990000";  //深红色
            } else if (d.group === major && d.group !== goal) {  //首要污染物
                return "#d7301f"  //红色
            } else if (d.group === goal) {  //目标污染物
                return "#82CDE6"  //浅蓝色
            } else {
                return "#59678c";  //蓝灰色
            }
        })
        .attr("height", (d) => height - y(0)) // always equal to 0
        .attr("y", (d) => y(0));

    svg1
        .selectAll("rect")  //柱状图的动画效果
        .data(ddata)
        .transition()
        .duration(800)
        .attr("y", (d) => y(d.value))  //y轴的位置
        .attr("height", (d) => height - y(d.value))  //柱状图的高度
        .delay((d, i) => {  //延迟
            return i * 100;
        });

    svg1.selectAll("rect")
        .data(ddata)
        .append("svg:title")  //鼠标悬停时显示的内容
        .text(function (d) {
            return d["value"];
        })
}


//下面开始画雷达图
//设置雷达图的颜色
function getColor(idx) {
    var palette = [  //颜色列表
        'rgba(253,187,132,0.5)',
        '#ffb980',  //浅橙色
        '#f5994e',
        '#8d98b3',  //蓝灰色
        '#59678c',
    ]
    return palette[idx % palette.length];
}

function min_radarchart(pdata, pollution = "PM2.5(μg/m3)") {
    d3.select("#svg1").remove();
    var goal = deal_with_txt(pollution);
    var width = 300, height = 240;  //雷达图的宽高
    // 创建一个分组用来组合要画的图表元素
    var main = d3.select('.container').append('svg')
        .attr("id", "svg1").attr("height", "300").attr("width", "100%").append("g")  //设置画布的大小
        .classed('main', true)  //设置分组的类名
        .attr('transform', "translate(" + width / 2 + ',' + height / 2 + ')');  //图片位置

    var data = {
        fieldNames: ['log(SO2(μg/m3))', 'log(NO2(μg/m3))', 'log(O3(μg/m3))', 'log(PM2.5(μg/m3))', 'log(PM10(μg/m3))', 'log(CO(μg/m3))'],
        values: [
            [Math.log(pdata["SO2(微克每立方米)"]), Math.log(pdata["NO2(微克每立方米)"]), Math.log(pdata["O3(微克每立方米)"]), Math.log(pdata["PM2.5(微克每立方米)"]), Math.log(pdata["PM10(微克每立方米)"]), Math.log(pdata["CO(毫克每立方米)"] * 1000)]
        ]
    };
    // 设定一些方便计算的常量
    var radius = 70,  //雷达图的半径
        // 指标的个数，即fieldNames的长度
        total = 6,
        // 需要将网轴分成几级，即网轴上从小到大有多少个正多边形
        level = 8,
        // 网轴的范围，类似坐标轴
        rangeMin = 0,  //Math.log(Math.min.apply(null, data.values[0])),
        rangeMax = data.values[0][5] + 2,  //Math.log(Math.max.apply(null, data.values[0])) + 2,
        arc = 2 * Math.PI;
    // 每项指标的角度
    var onePiece = arc / total;
    // 计算网轴的正多边形的坐标
    var polygons = {
        webs: [],
        webPoints: []
    };
    for (var k = level; k > 0; k--) {
        var webs = '',
            webPoints = [];
        var r = radius / level * k;
        for (var i = 0; i < total; i++) {
            var x = r * Math.sin(i * onePiece),
                y = r * Math.cos(i * onePiece);
            webs += x + ',' + y + ' ';
            webPoints.push({
                x: x,
                y: y
            });
        }
        polygons.webs.push(webs);
        polygons.webPoints.push(webPoints);
    }
    // 绘制网轴
    var webs = main.append('g')
        .classed('webs', true);
    webs.selectAll('polygon')
        .data(polygons.webs)
        .enter()
        .append('polygon')
        .attr("fill", "rgb(107,113,111)")  //雷达图底色
        .attr("opacity", "0.4")
        .attr('points', function (d) {
            return d;
        });
    // 绘制纵轴
    var lines = main.append('g')
        .classed('lines', true);
    lines.selectAll('line')
        .data(polygons.webPoints[0])
        .enter()
        .append('line')
        .attr('x1', 0)  //中心点
        .attr('y1', 0)
        .attr('x2', function (d) {  //坐标点
            return d.x;
        })
        .attr('y2', function (d) {
            return d.y;
        });
    // 计算雷达图的坐标
    var areasData = [];  //用来保存雷达图的坐标数据
    var values = data.values;
    for (var i = 0; i < values.length; i++) {
        var value = values[i],  //当前的数据值
            area = '',  //用来保存雷达图区域的坐标点
            points = [];  //用来保存雷达图区域的数据值
        for (var k = 0; k < total; k++) {
            var r = radius * (value[k] - rangeMin) / (rangeMax - rangeMin);  //当前点的半径
            var x = r * Math.sin(k * onePiece),
                y = r * Math.cos(k * onePiece);  //当前点的坐标
            area += x + ',' + y + ' ';  //将坐标保存到字符串中
            points.push({
                x: x,
                y: y
            })
        }
        areasData.push({
            polygon: area,
            points: points
        });
    }
    // 添加g分组包含所有雷达图区域
    var areas = main.append('g')
        .classed('areas', true);
    // 添加g分组用来包含一个雷达图区域下的多边形以及圆点
    areas.selectAll('g')
        .data(areasData)
        .enter()
        .append('g')
        .attr('class', function (d, i) {
            return 'area' + (i + 1);
        });
    for (var i = 0; i < areasData.length; i++) {
        // 依次循环每个雷达图区域
        var area = areas.select('.area' + (i + 1)),
            areaData = areasData[i];
        // 绘制雷达图区域下的多边形
        area.append('polygon')
            .attr('points', areaData.polygon)
            .attr('stroke', function (d, index) {
                return getColor(i);
            })
            .attr('fill', function (d, index) {
                return getColor(i);
            });
        // 绘制雷达图区域下的点
        var circles = area.append('g')
            .classed('circles', true);
        circles.selectAll('circle')
            .data(areaData.points)
            .enter()
            .append('circle')  //添加圆点
            .attr("class", "circle")  //添加class
            .attr('cx', function (d) {  //坐标点
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })
            .attr('r', 3)  //半径
            .attr('fill', '#bfbfbf')  //填充颜色
            .attr('stroke', function (d, index) {  //边框颜色
                return getColor(i);
            });
    }
    var tipdata = [pdata["SO2(微克每立方米)"], pdata["NO2(微克每立方米)"],
    pdata["O3(微克每立方米)"], pdata["PM2.5(微克每立方米)"],
    pdata["PM10(微克每立方米)"], pdata["CO(毫克每立方米)"] * 1000]
    d3.selectAll(".circle")
        .data(tipdata)
        .append("svg:title")
        .text(function (d) {
            return d;
        })
    // 计算文字标签坐标
    var textPoints = [];
    var textRadius = radius + 20;  //文字距离中心点的距离
    for (var i = 0; i < total; i++) {
        var x = textRadius * Math.sin(i * onePiece),
            y = textRadius * Math.cos(i * onePiece);
        textPoints.push({
            x: x,
            y: y
        });
    }
    // 绘制文字标签
    var texts = main.append('g')
        .classed('texts', true);
    texts.selectAll('text')
        .data(textPoints)
        .enter()
        .append('text')
        .attr('x', function (d) {
            return d.x;
        })
        .attr('y', function (d) {
            return d.y;
        })
        .attr('text-anchor', "middle") // 文字水平居中
        .attr('dy', 0)  // 文字垂直方向偏移量
        .attr("font-size", 10)
        .attr("fill", "#000")
        /*
        .attr("fill", function (d, i) {
            if (data.fieldNames[i] === goal) {
                return "#59678c";
            } else {
                return "#000";
            }
        })
        */
        .text(function (d, i) {
            return data.fieldNames[i];
        });
    /*
    texts.selectAll('text')
        .data(data.fieldNames)
        .on("click", function (event, d) {
            var rtxt = reback_txt(d);
            min_radarchart(pdata, rtxt);
            window.localStorage.pollution1 = d;
        })
    */
}


//下面开始画气泡散点图
function scatterchart(ymd, pname, poluname_x, poluname_y) {
    var mbyear = ymd[0] + ymd[1] + ymd[2] + ymd[3];
    var mbmonth = ymd[5] + ymd[6];
    var mbday = ymd[8] + ymd[9];
    pname = get_pname(pname);
    pname = pname.split(".");
    pname = pname[0];
    console.log(pname);
    // console.log(poluname_x);
    // console.log(poluname_y);

    var path_file_data =
        "../data/city/" +
        pname +
        "/" +
        mbyear +
        mbmonth +
        "/CN-Reanalysis-daily-" +
        mbyear +
        mbmonth +
        mbday +
        "00.csv";
    // console.log(path_file_data);

    d3.select("#svg1").remove();
    const margin = { top: 10, right: 30, bottom: 20, left: 60 },
        width = 390 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;
    const svg = d3.select("#scatterchart")
        .append("svg")
        .attr("id", "svg1")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
    d3.csv(path_file_data).then(function (data) {
        var rel_data = [];
        var max_x = 0;
        var max_y = 0;
        let ttop = [];
        let yyop = [];
        for (var i = 0; i < data.length; i++) {
            var item_data = { "x": data[i][poluname_x], "y": data[i][poluname_y] };
            rel_data.push(item_data);
            ttop.push(data[i][poluname_x]);
            yyop.push(data[i][poluname_y]);
        }
        // console.log(ttop);
        max_x = Math.max.apply(null, ttop);
        max_y = Math.max.apply(null, yyop);
        console.log(max_x);
        // console.log(max_y);

        const x = d3.scaleLinear()  // x轴比例尺
            .domain([0, max_x + 10])  // x轴范围
            .range([0, width]);  // x轴长度
        svg.append("g")
            .attr("class", "axisRed")  // 要和下面的x轴对应
            .attr("transform", `translate(0, ${height})`)  // 画在底部
            .call(d3.axisBottom(x))  // 画x轴

        const y = d3.scaleLinear()  // y轴比例尺
            .domain([0, max_y + 10])  // y轴范围
            .range([height, 0]);  // y轴长度
        svg.append("g")
            .attr("class", "axisRed")  // 要和下面的y轴对应
            .call(d3.axisLeft(y));  // 画y轴

        svg.append('g')
            .selectAll("dot")  // 选择所有的点
            .data(rel_data)  // 传入数据
            .enter()
            .append("circle")  // 对于每个数据都画一个点
            .attr("cx", function (d) { return x(d.x); })  // x坐标
            .attr("cy", function (d) { return y(d.y); })  // y坐标
            .attr("r", 3)  // 圆点半径
            .style("fill", "#fdbb84")  // 填充颜色
            .style("opacity", "0.8")  // 透明度
            .style("stroke-width", "1px")  // 边框宽度
            .style("stroke", "#ef6548")  // 边框颜色


        svg.selectAll("circle")  // 选择所有的点
            .transition()  // 过渡动画
            .delay(function (d, i) { return (i * 3) })  // 每个点之间间隔一段时间
            .duration(2000)  // 动画持续时间
            .attr("cx", function (d) { return x(d.x); })  // x坐标
            .attr("cy", function (d) { return y(d.y); })  // y坐标
    });
}
