//螺旋线图
var first = "2013.csv";
var second = "2014.csv";
var third = "2015.csv";
var fourth = "2016.csv";
var fifth = "2017.csv";
var sixth = "2018.csv";

var width = 1000,  //设置画布的宽度和高度
  height = 850,
  start = 0,  //设置螺旋线的起始半径
  end = 2.25,  //设置螺旋线的长度
  numSpirals = 2  //设置螺旋线的数量
margin = { top: 50, bottom: 50, left: 0, right: 0 };  //设置边距

var theta = function (r) {
  return numSpirals * Math.PI * r;  //设置螺旋线的弧度
};

var r = d3.min([width, height]) / 2.2;  //设置螺旋线的半径
var radius = d3.scaleLinear()
  .domain([start, end])
  .range([240, r]);

var projection = d3.geoMercator()  //投影
  .center([107, 31])  //地图中心位置, 107是经度, 31是纬度
  .scale(460)  //设置缩放量
  .translate([500, 560]);  //设置平移量

// Define path generator
var path1 = d3.geoPath()  //生成地图path
  .projection(projection);  //设置投影

var color1 = d3.scaleLinear()  //设置颜色比例尺
  .domain([0, 400])  //范围
  .range(["#fef0d9", "#990000"]);  //颜色

//Create SVG element and append map to the SVG
var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.left + margin.right)
  .append("g");

var points = d3.range(start, end + 0.001, (end - start) / 1000);  //设置螺旋线上的点

var spiral = d3.radialLine()  //设置螺旋线
  .curve(d3.curveCardinal)
  .angle(theta)
  .radius(radius);

var path = svg.append("path")  //添加螺旋线
  .datum(points) //绑定数据
  .attr("id", "spiral")
  .attr("d", spiral)
  .attr("transform", "translate(510,500)")
  .style("fill", "none")  //填充颜色
  .style("stroke", "steelblue")  //线条颜色

var spiralLength = path.node().getTotalLength(),  //获取螺旋线的长度
  N = 365,  //设置螺旋线上的点的数量,
  barWidth = (spiralLength / N) - 1;  //柱状图的宽度

function update(tmp) {  //更新地图
  d3.json("../data/chart_data/china.geo.json", function (json) {
    // Loop through each state data value in the .csv file
    d3.csv("../data/chart_data/" + tmp, function (data) {
      var someData = [];
      var pro = 1;
      // Loop through each state data value in the .csv file
      for (var i = 0; i < data.length; i++) {
        // Grab data value 
        var dataTime = data[i].Time;
        var dataState = data[i].Province;
        // console.log(data[i].Province)

        // Find the corresponding state inside the GeoJSON
        for (var j = 0; j < json.features.length; j++) {
          var jsonState = json.features[j].properties.name;  //获取地图上的省份名称

          if (dataState == jsonState) {  //如果数据中的省份名称和地图上的省份名称相同
            // Copy the data value into the JSON
            json.features[j].properties.res = data[i].AQI;  //将数据中的AQI值赋给地图中的省份
            data[i].Province = jsonState;  //将地图中的省份名称赋给数据中的省份名称
            // Stop looking through the JSON
            break;
          }
        }
      }

      d3.select('svg').selectAll('path1').remove();
      // Bind the data to the SVG and create one path per GeoJSON feature
      svg.selectAll("path1")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path1)
        .on("mouseover", function (d, i) {
          d3.select(this)
            .attr("opacity", "0.9");  //设置鼠标悬浮时的透明度
        })
        .on("mouseout", function (d, i) {
          d3.select(this)
            .transition()
            .duration(300)
            .attr("opacity", "1");  //鼠标移开时的透明度
        })
        .on("click", function (n, d) {  //鼠标点击事件
          pro = n.properties.name;
          someData = [];
          for (var i = 0; i < data.length; i++) {  //获取点击省份的数据
            if (data[i].Province == pro) {
              var currentdate = new Date(data[i].Time);  //将时间字符串转换为时间格式
              someData.push({
                date: currentdate,  //获取时间
                value: data[i].AQI,   //获取AQI值
                Pro: data[i].Province,  //获取省份
                group: currentdate.getMonth()   //获取月份
              });
            }
          }

          draw(someData);
        })
        .style("stroke", "#fff")  //边缘颜色
        .style("stroke-widthrt", "1")  //边缘宽度
        .style("fill", function (d) {  //填充颜色

          // Get data value
          let value = d.properties.res;
          if (value) {
            //If value exists
            return color1(value);
          } else {
            //If value is undefined
            return "rgb(213,222,217)";
          }

        });

      for (var i = 0; i < data.length; i++) {

        if (pro == 1) { pro = "安徽" }  //默认显示安徽省的数据
        if (data[i].Province == pro) {  //获取点击省份的数据，更新柱状图数据
          var currentdate = new Date(data[i].Time);  //将时间字符串转换为时间格式

          someData.push({
            date: currentdate,
            value: data[i].AQI,
            Pro: data[i].Province,
            group: currentdate.getMonth()
          });
        }
      }

      function draw(tem) {  //绘制柱状图
        var timeScale = d3.scaleTime()  //设置时间比例尺
          .domain(d3.extent(tem, function (d) {
            return d.date;
          }))
          .range([0, spiralLength]);  //时间比例尺的范围

        let xxx = [];
        for (var i = 0; i < tem.length; i++) {  //获取数组中的最大值和最小值
          xxx.push(tem[i].value);
        }
        var big = Math.max.apply(null, xxx);  //获取数组中的最大值
        var small = Math.min.apply(null, xxx);
        // yScale for the bar height
        var yScale = d3.scaleLinear()
          .domain([small, big])
          .range([10, ((r - 260) / numSpirals) - 10]);  //柱状图的高度

        // console.log((r - 170) / numSpirals);
        // console.log(big);
        // console.log(small);
        d3.select('svg').selectAll("rect").remove();
        d3.select('svg').selectAll('text').remove();

        svg.selectAll("rect")  //绘制柱状图
          .data(tem)
          .enter()
          .append("rect")
          .attr("transform", "translate(510,500)")
          .attr("x", function (d, i) {
            var linePer = timeScale(d.date),  //柱状图的位置
              posOnLine = path.node().getPointAtLength(linePer),
              angleOnLine = path.node().getPointAtLength(linePer - barWidth);

            d.linePer = linePer; // % distance are on the spiral
            d.x = posOnLine.x; // x postion on the spiral
            d.y = posOnLine.y; // y position on the spiral
            //angle at the spiral position
            d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90;
            return d.x;
          })
          .attr("y", function (d) {
            return d.y;
          })
          .attr("width", function (d) {
            return barWidth;
          })
          .attr("height", function (d) {
            return yScale(d.value);
          })
          .style("fill", function (d) { return color1(d.value); })
          .style("stroke", "none")
          .attr("transform", function (d) {
            return "translate(510,500)rotate(" + d.a + "," + d.x + "," + d.y + ")"; // rotate the bar
          });

        // add date labels
        var tF = d3.timeFormat("%b %Y"),  //时间格式
          firstInMonth = {};

        svg.selectAll("text")
          .data(tem)
          .enter()
          .append("text")
          .attr("dy", 15)
          .style("text-anchor", "start")
          .style("font", "15px arial")
          .append("textPath")
          // only add for the first of each month
          .filter(function (d) {
            var sd = tF(d.date);
            if (!firstInMonth[sd]) {
              firstInMonth[sd] = 1;
              return true;
            }
            return false;
          })
          .text(function (d) {
            return tF(d.date);
          })
          // place text along spiral
          .attr("xlink:href", "#spiral")
          .style("fill", "white")
          .attr("startOffset", function (d) {
            return ((d.linePer / spiralLength) * 100) + "%";
          })


        var tooltip = d3.select("#chart")  //鼠标移动到柱状图上显示数据
          .append('div')
          .attr('class', 'tooltip');  //添加一个类名为tooltip的div

        tooltip.append('div')
          .attr('class', 'date');
        tooltip.append('div')
          .attr('class', 'value');
        tooltip.append('div')
          .attr('class', 'Pro');

        svg.selectAll("rect")
          .on('mouseover', function (d) {
            tooltip.select('.Pro').html(" <b style=\'font-size:15px;color:white;\'>" +
              "Province:" + d.Pro + "</b>")  //显示省份
            tooltip.select('.date').html(" <b style=\'font-size:15px;color:white;\'>" +
              "Date:" + d.date.toDateString() + "</b>")  //显示日期
            tooltip.select('.value').html(" <b style=\'font-size:15px;color:white;\'>" +
              "Value:" + Math.round(d.value * 100) / 100 + "<b>")  //显示AQI数值

            d3.select(this)  //鼠标移动到柱状图上时，柱状图变暗
              .style("opacity", 0.4)  //透明度
              .style("stroke", "#000000")  //边框颜色
              .style("stroke-width", "2px");  //边框宽度

            tooltip.style('display', 'block')  //显示tooltip
              .style('opacity', 1)  //设置tooltip的透明度
          })

          .on('mousemove', function () {  //鼠标移动到柱状图上
            tooltip.style('top', '780px')  //设置tooltip的位置
              .style('right', '370px')
              .style("font", "15px arial")  //设置字体大小
              .style("fill", "white");  //字体颜色
          })
          .on('mouseout', function () {  //鼠标移出柱状图时
            d3.selectAll("rect")
              .style("opacity", 1)
              .style("stroke", "none")

            tooltip.style('display', 'none');
            tooltip.style('opacity', 0);
          });
      }
      draw(someData)
    })
  })
}
update(first);  //调用函数
