//各省份AQI热力地图
const input = document.querySelector("#date");  //日期输入框
input.addEventListener("input", change);  //监听日期输入框的变化
var date = document.querySelector("input[type='date']");
var ymd = "2013-01-01";  //默认日期
var year = "2013";
var month = "01";
var day = "01";
date.value = year + "-" + month + "-" + day;
var proname = "anhui.json";
var pproname = "安徽省";
var pst
var color = d3
    .scaleLinear() //AQI颜色比例尺
    .domain([0, 50, 100, 150, 200, 300, 501])
    .range([
        "#fef0d9",
        "#fdd49e",
        "#fdbb84",
        "#fc8d59",
        "#ef6548",
        "#d7301f",
        "#990000",
    ]);

function drawgeo() {  //绘制地图
    var psn = proname.split(".");  // proname: anhui.json
    pst = psn[0];  // anhui
    var path_file_data =
        "../data/city/" +
        pst +
        "/" +
        year +
        month +
        "/CN-Reanalysis-daily-" +
        year +
        month +
        day +
        "00.csv";
    console.log(path_file_data);
    var par = get_par(proname);  //获取地图参数: center, translate, scale
    var cen = par[0];  //地图中心
    var tra = par[1];  //地图平移
    var sca = par[2];  //地图缩放比例

    d3.json("../data/geo_pro_json/" + proname).then(function (data) {
        //读取地图数据
        console.log(proname);
        // console.log(data);
        var projection = d3
            .geoMercator() //Mercator投影
            .center(cen)
            .translate(tra)
            .scale(sca);

        var geopath = d3
            .geoPath() //生成地图path
            .projection(projection);  //投影
        d3.select("svg").remove();  //删除原有svg画布

        var svg = d3
            .select("body") //画一个svg画布
            .append("svg")
            .attr("width", "700")
            .attr("height", "500");

        svg.append("rect")  //添加背景颜色
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "pink")  //背景颜色
            .attr("opacity", 0);  //背景颜色透明度

        svg.append("g").attr("id", "g");
        d3.select('svg').selectAll('geopath').remove();

        svg
            .select("#g")
            .selectAll("geopath")
            .data(data.features)  //绑定地图数据
            .enter()
            .append("path")  //添加地图路径
            .attr("d", geopath)
            .attr("stroke", "#004C6B")  //边线颜色
            .attr("stroke-width", 1)  //边线宽度
            .attr("fill", "#DCDCDC")  //填充颜色
            .attr("opacity", 0.5)  //地图填充透明度
            //.attr("class", "storke")
            ;
        svg
            .select("#g")
            .append("text")  //添加地图标题
            .attr("x", 40)  //标题位置
            .attr("y", 40)
            .attr("fill", "#424242")
            .attr("font-size", 30)
            .text(pproname);  //标题内容: 省份名

        svg
            .selectAll(".texts")  //添加地图标注
            .data(data.features)  //绑定地图数据
            .enter()
            .append("text")  //添加标注: 城市名
            .attr("class", "texts")
            .text(function (d, i) {
                if (i == 0) {
                    return d.properties.name;
                }
            })
            .attr("transform", function (d) {  //标注位置
                var centroid = geopath.centroid(d),
                    x = centroid[0],
                    y = centroid[1];
                return "translate(" + x + ", " + y + ")";
            })
            .attr("fill", "black")
            .attr("font-size", "15px")
            //.on("click", mouseclick3)  //标注点击事件
            ;

        var g1 = svg.select("g");  //添加标注点
        d3.csv(path_file_data).then(function (alldata) {
            //获取空气数据
            // console.log(alldata);
            var location = g1  //添加标注点
                .selectAll(".location")
                .data(alldata)
                .enter()
                .append("g")
                .attr("class", "location")  //标注点样式
                .attr("transform", function (d) {  //计算标注点的位置
                    var coor = projection([d["lon"], d["lat"]]);
                    return "translate(" + coor[0] + "," + coor[1] + ")";
                });
            location
                .append("circle")
                //.attr("transform", `rotate(${8}) translate(0,0)`)
                .attr("r", 4);  //标注点大小
            var rect = d3
                .selectAll(".location")
                .select("circle")
                .attr("fill", (d) => color(d["AQI"]))  //标注点颜色
                .attr("opacity", 0.5);  //标注点透明度

            var tip = d3  //添加tip文本提示框
                .tip()
                .attr("class", "d3-tip")  //tips样式
                .offset([-10, 0])  //tips位置
                .html(function (d, i) {  //tips内容
                    //console.log(d.target.__data__);
                    return (
                        "<strong>AQI: </strong><span><font color='#8B0000'>" +
                        i["AQI"] +
                        "<br></font></span>" +
                        "<strong>Major Pollutant: </strong><span><font color='8B0000'>" +
                        i["Major pollutants"] +
                        "<br></font></span>"
                    );
                });
            location.on("mouseover", tip.show).on("mouseout", tip.hide);  //鼠标移入移出事件
            location.call(tip);  //调用tip
            location.on("click", mouseclick);  //鼠标点击事件
        });

        svg.call(  //添加缩放事件
            d3
                .zoom()
                .extent([
                    [0, 0],
                    [1000, 900],
                ])
                .scaleExtent([1, 8])  //缩放范围
                .on("zoom", zoomed)
        );
        function zoomed({ transform }) {
            svg.transition().duration(30).attr("transform", transform);  //缩放动画
        }
    });
}

function change(event) {
    //获取日期
    var date = document.querySelector("input[type='date']");
    ymd = date.value;
    year = ymd[0] + ymd[1] + ymd[2] + ymd[3];
    month = ymd[5] + ymd[6];
    day = ymd[8] + ymd[9];
    window.localStorage.ymd = ymd;
    window.localStorage.pst = pst;
    d3.select("#svg").remove();
    d3.select("#svg1").remove();
    d3.select("#svg2").remove();
    d3.select("#svg3").remove();
    drawgeo();
}

window.addEventListener('storage', event => {
    if (event.key === 'name') {  //获取省份
        pproname = event.newValue;
        proname = get_proname()
        d3.select("#svg").remove();
        d3.select("#svg1").remove();
        d3.select("#svg2").remove();
        d3.select("#svg3").remove();
        drawgeo()
    } else if (event.key === 'ymd') {  //获取日期
        ymd = event.newValue;
        year = ymd[0] + ymd[1] + ymd[2] + ymd[3];
        month = ymd[5] + ymd[6];
        day = ymd[8] + ymd[9];
        date.value = year + "-" + month + "-" + day;
        d3.select("#svg").remove();
        d3.select("#svg1").remove();
        d3.select("#svg2").remove();
        d3.select("#svg3").remove();
        drawgeo()
    }
})
drawgeo();
