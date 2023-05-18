//中国AQI热力地图
const input = document.querySelector("#date");  //日期输入框
input.addEventListener("input", change);  //监听日期输入框的变化
var date = document.querySelector("input[type='date']");  //获取日期输入框
var ymd = "2013-01-01";
var year = "2013";
var month = "01";
var day = "01";
console.log(ymd);  //打印日期
var color = d3
    .scaleLinear() //AQI颜色比例尺
    .domain([0, 50, 100, 150, 200, 300, 501])  //AQI范围
    .range([
        "#fef0d9",
        "#fdd49e",
        "#fdbb84",
        "#fc8d59",
        "#ef6548",
        "#d7301f",
        "#990000",  //AQI颜色
    ]);

function drawchinageo() {
    var path_file_data =
        "../data/country/" +
        year +
        month +
        "/CN-Reanalysis-daily-" +
        year +
        month +
        day +
        "00.csv";  //空气数据路径
    d3.json("../data/china.json").then(function (data) {
        //读取地图数据
        // console.log(data);
        var projection = d3
            .geoMercator()  //投影
            .center([82, 29])  //地图中心
            .translate([90, 350])  //地图位置
            .scale(550);  //地图缩放比例

        var geopath = d3
            .geoPath()  //生成地图path
            .projection(projection);  //投影
        d3.select("svg").remove();  //删除原有svg画布

        var svg = d3
            .select("body") //画一个svg画布
            .append("svg")
            .attr("width", "630")
            .attr("height", "600");  //画布大小
        svg.append("g").attr("id", "g");
        d3.select('svg').selectAll('geopath').remove();
        svg.selectAll("geopath")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", geopath)
            .on("mouseover", function (d, i) {
                d3.select(this)
                    .attr("opacity", "0.4"); //鼠标移入时改变透明度
            })
            .on("mouseout", function (d, i) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("opacity", "0");  //鼠标移出时恢复透明度
            })
            .on("click", function (n, d) {
                window.localStorage.name = d.properties.name;
                window.localStorage.year = year;
                window.localStorage.mon = month;
                window.localStorage.day = day;  //将地区名、年月日存入本地
            })
            .attr("fill", "rgba(248,244,244)")  //地图填充颜色
            .attr("opacity", "0")  //地图透明度

        var g1 = svg.select("g");

        d3.csv(path_file_data).then(function (alldata) {
            //获取空气数据
            // console.log(alldata);
            var location = g1
                .selectAll(".location")
                .data(alldata)
                .enter()
                .append("g")
                .attr("class", "location")
                .attr("transform", function (d) {
                    //计算标注点的位置
                    var coor = projection([d["lon"], d["lat"]]);  //经纬度坐标
                    return "translate(" + coor[0] + "," + coor[1] + ")";  //标注点位置
                });
            location
                .append("circle")  //添加标注点
                .attr("transform", `rotate(${8}) translate(0,0)`)
                .attr("r", 2);  //标注点大小
            var rect = d3
                .selectAll(".location")  //获取标注点
                .select("circle")
                .attr("fill", (d) => color(d["AQI"]));  //标注点颜色
            var valuetoshow = [0, 50, 100, 150, 200, 300, 501];  //AQI范围

            svg
                .selectAll("#g")  //添加图例
                .append("rect")
                .attr("class", "legend")
                .attr("x", 510)  //图例位置
                .attr("y", 410)
                .attr("width", 25)
                .attr("height", 15)
                .attr("fill", "#fef0d9");
            svg
                .selectAll("#g")  //添加图例文字
                .append("text")
                .attr("class", "legend")
                .attr("x", 545)  //文字位置
                .attr("y", 420)
                .attr("fill", "#aaa")
                .attr("font-size", 10)
                .text(">0");
            svg
                .selectAll("#g")
                .data(valuetoshow)
                .enter()
                .append("rect")
                .attr("class", "legend")
                .attr("y", function (d, i) {
                    return 410 + i * 25;
                })
                .attr("x", 510)  //图例位置
                .attr("width", 25)
                .attr("height", 15)
                .attr("fill", (d) => color(d));
            // console.log(valuetoshow);
            svg
                .selectAll("#g")
                .data(valuetoshow)
                .enter()
                .append("text")
                .attr("class", "legend")
                .attr("y", function (d, i) {
                    return 420 + i * 25;
                })
                .attr("x", 545)  //文字位置
                .attr("font-size", 10)
                .attr("fill", "#aaa")
                .text(function (d) {
                    d = ">" + d;
                    return d;
                });
            svg
                .select("#g")
                .selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("stroke", "#616161")  //边界线颜色
                .attr("stroke-width", "0.4")  //边界线宽度
                .style("fill", "white")  //地图填充颜色
                .style("fill-opacity", "0")  //地图填充透明度
                .attr("d", geopath);  //添加边界线

            svg.call(
                d3
                    .zoom()
                    .extent([
                        [0, 0],  //缩放范围
                        [1000, 900],
                    ])
                    .scaleExtent([1, 8])  //缩放比例
                    .on("zoom", zoomed)
            );

            function zoomed({ transform }) {
                svg.transition().duration(300).attr("transform", transform);
            }
        });
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
    drawchinageo();
}

window.addEventListener('storage', event => {
    if (event.key === 'ymd') {
        ymd = event.newValue;
        year = ymd[0] + ymd[1] + ymd[2] + ymd[3];
        month = ymd[5] + ymd[6];
        day = ymd[8] + ymd[9];
        date.value = year + "-" + month + "-" + day;

        d3.select("#svg").remove();
        d3.select("#svg1").remove();
        d3.select("#svg2").remove();
        d3.select("#svg3").remove();
        drawchinageo();
    }
})
drawchinageo();
