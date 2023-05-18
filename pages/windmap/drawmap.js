//windmap
//echarts, flowGL, bmap

const input = document.querySelector("#date");
input.addEventListener("input", change);  //监听日期变化
var year;
var month;
var day;
var date = document.querySelector("input[type='date']");  //获取日期
var ymd = date.value;
year = ymd[0] + ymd[1] + ymd[2] + ymd[3];
month = ymd[5] + ymd[6];
day = ymd[8] + ymd[9];
year = window.localStorage.year;
month = window.localStorage.mon;
day = window.localStorage.day;
date.value = year + "-" + month + "-" + day;
window.localStorage.year = year;
window.localStorage.mon = month;
window.localStorage.day = day;
console.log(date.value);

var filepath =
  "./wind/" +
  year +
  month +
  "/wind-" +
  year +
  month +
  day +
  "00.csv";

//console.log(filepath);
var a = Promise.resolve(d3.csv(filepath));  //读取csv文件

a.then(function (result) {
  //console.log(result);
  //console.log(result.length);
  var data = [];
  for (var i = 0; i < result.length; i++) {
    data.push([
      result[i]["lon"], //经度
      result[i]["lat"],  //纬度
      result[i]["U"],  //经向风速
      result[i]["V"],  //纬向风速
      Math.sqrt(
        result[i]["U"] * result[i]["U"] + result[i]["V"] * result[i]["V"]
      ),  //风速
    ]);
  }
  //console.log(data);

  // 基于准备好的 dom, 初始化 echarts 实例
  var myChart = echarts.init(document.getElementById("main"));
  var maxMag = 32.1547;  //最大风速
  var minMag = 0;

  var trajectory = [];  //风场轨迹
  let series2 = [
    {
      type: "flowGL",
      coordinateSystem: "bmap",
      data: data,
      supersampling: 4,  //超采样
      particleType: "line",  //粒子类型
      particleDensity: 128,  //粒子密度
      particleSpeed: 1.5,  //粒子速度，值越大速度越快
      itemStyle: {
        opacity: 0.6,  //透明度
      },
    },
  ];

  trajectory.forEach(function (element, index) {  //风场轨迹
    if (index < trajectory.length - 1) {
      let endNum = index + 1;
      series2.push({
        type: "lines",
        zlevel: 2,  //线的层级
        effect: {
          show: true,
          period: 0.3,  //速度，值越小速度越快
          trailLength: 0,  //轨迹长度
        },
        lineStyle: {
          normal: {
            width: 3,  //线宽
            opacity: 0.5,  //线透明度
            curveness: 0,  //线弯曲度
          },
        },
        data: [
          {
            coords: [  //线的起点和终点
              [trajectory[index][0], trajectory[index][1]],  //起点
              [trajectory[endNum][0], trajectory[endNum][1]],  //终点
            ],
          },
        ],
      });
    }
  });

  myChart.setOption({
    visualMap: {
      left: "right",
      min: minMag,
      max: maxMag,
      dimension: 4,
      inRange: {  //风速颜色
        color: [
          "#313695",
          "#4575b4",
          "#74add1",
          "#abd9e9",
          "#e0f3f8",
          "#ffffbf",
          "#fee090",
          "#fdae61",
          "#f46d43",
          "#d73027",
          "#a50026",
        ],
      },
      realtime: false,  //拖拽时，是否实时更新
      calculable: true,  //显示拖拽用的手柄（手柄能拖拽调整选中范围）
      textStyle: {
        color: "#fff",
      },
    },
    bmap: {
      center: [110, 35],  //地图中心点
      zoom: 4,  //地图缩放
      roam: true,  //开启鼠标缩放和平移漫游
      mapStyle: {  //地图样式
        styleJson:
          [{
            "featureType": "land",
            "elementType": "geometry",
            "stylers": {
              "color": "#f7f7f7ff"
            }
          }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": {
              "color": "#bbdce6ff",
              "opacity": "ff"
            }
          }, {
            "featureType": "water",
            "elementType": "labels",
            "stylers": {
              "visibility": "on"
            }
          }, {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "subwaystation",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "education",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "education",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "medical",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "medical",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "manmade",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "scenicspots",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "scenicspots",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "entertainment",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "estate",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "shopping",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "transportation",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "playground",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "parkinglot",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "transportation",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": {
              "visibility": "on"
            }
          }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
              "visibility": "on"
            }
          }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
              "visibility": "on"
            }
          }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": {
              "visibility": "on"
            }
          }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "tertiaryway",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "tertiaryway",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "fourlevelway",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "fourlevelway",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "local",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "scenicspotsway",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "universityway",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "vacationway",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "subway",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "highwaysign",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "highwaysign",
            "elementType": "labels.icon",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "nationalwaysign",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "nationalwaysign",
            "elementType": "labels.icon",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "provincialwaysign",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "provincialwaysign",
            "elementType": "labels.icon",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels.icon",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "subwaylabel",
            "elementType": "labels.icon",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "subwaylabel",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "roadarrow",
            "elementType": "labels.icon",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "footbridge",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "crosswalk",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "underpass",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "parkingspace",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "laneline",
            "elementType": "geometry",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": {
              "color": "#ddddddff"
            }
          }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": {
              "color": "#ffcc66ff"
            }
          }, {
            "featureType": "poilabel",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "poilabel",
            "elementType": "labels.icon",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "districtlabel",
            "elementType": "labels",
            "stylers": {
              "visibility": "on"
            }
          }, {
            "featureType": "continent",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "country",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "boundary",
            "elementType": "geometry",
            "stylers": {
              "visibility": "on"
            }
          }, {
            "featureType": "island",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "village",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          }, {
            "featureType": "city",
            "elementType": "labels.icon",
            "stylers": {
              "visibility": "on"
            }
          }, {
            "featureType": "district",
            "elementType": "labels",
            "stylers": {
              "visibility": "on"
            }
          }]
      }
    },
    series: series2,
  });
});


// 日期选择器
function change(event) {
  date = document.querySelector("input[type='date']");
  ymd = date.value;
  year = ymd[0] + ymd[1] + ymd[2] + ymd[3];
  month = ymd[5] + ymd[6];
  day = ymd[8] + ymd[9];
  window.localStorage.year = year;
  window.localStorage.mon = month;
  window.localStorage.day = day;
  filepath =
    "./wind/" +
    year +
    month +
    "/wind-" +
    year +
    month +
    day +
    "00.csv";
  console.log(filepath);
  a = Promise.resolve(
    d3.csv(
      filepath
    )
  );

  a.then(function (result) {
    console.log(result);
    console.log(result.length);
    var data = [];
    for (var i = 0; i < result.length; i++) {
      data.push([
        result[i]["lon"],
        result[i]["lat"],
        result[i]["U"],
        result[i]["V"],
        Math.sqrt(
          result[i]["U"] * result[i]["U"] + result[i]["V"] * result[i]["V"]
        ),
      ]);
    }
    console.log(data);

    // 基于准备好的 dom ，初始化 echarts 实例
    var myChart = echarts.init(document.getElementById("main"));
    var maxMag = 32.1547;
    var minMag = 0;
    var trajectory = [];
    let series2 = [
      {
        type: "flowGL",
        coordinateSystem: "bmap",
        data: data,
        supersampling: 4,
        particleType: "line",
        particleDensity: 128,
        particleSpeed: 1.5,
        itemStyle: {
          opacity: 0.6,
        },
      },
    ];

    trajectory.forEach(function (element, index) {
      if (index < trajectory.length - 1) {
        let endNum = index + 1;
        series2.push({
          type: "lines",
          coordinateSystem: "bmap",
          zlevel: 2,
          effect: {
            show: true,
            period: 6,
            trailLength: 0,
          },
          lineStyle: {
            normal: {
              width: 3,
              opacity: 0.5,
              curveness: 0,
            },
          },
          data: [
            {
              coords: [
                [trajectory[index][0], trajectory[index][1]],
                [trajectory[endNum][0], trajectory[endNum][1]],
              ],
            },
          ],
        });
      }
    });
    myChart.setOption({
      visualMap: {
        left: "right",
        min: minMag,
        max: maxMag,
        dimension: 4,
        inRange: {
          color: [
            "#313695",
            "#4575b4",
            "#74add1",
            "#abd9e9",
            "#e0f3f8",
            "#ffffbf",
            "#fee090",
            "#fdae61",
            "#f46d43",
            "#d73027",
            "#a50026",
          ],
        },
        realtime: false,
        calculable: true,
        textStyle: {
          color: "#fff",
        },
      },
      bmap: {
        center: [110, 35],
        zoom: 4,
        roam: true,
        mapStyle: {},
      },
      series: series2,
    });
  });
}
