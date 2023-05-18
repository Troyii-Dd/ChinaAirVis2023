function get_par(proname) {
  if (proname == "heilongjiang.json") {  //ok
    var cen = [126.642464, 45.756967];
    var tra = [200, 240];
    var sca = 800;
  } else if (proname == "jilin.json") {  //ok
    var cen = [125.3245, 43.886841];
    var tra = [200, 170];
    var sca = 1500;
  } else if (proname == "liaoning.json") {  //ok
    var cen = [123.429096, 41.796767];
    var tra = [300, 130];
    var sca = 2300;
  } else if (proname == "neimenggu.json") {  //ok
    var cen = [111.670801, 40.818311];
    var tra = [200, 240];
    var sca = 620;
  } else if (proname == "xinjiang.json") {  //ok
    var cen = [87.617733, 43.792818];
    var tra = [270, 150];
    var sca = 650;
  } else if (proname == "gansu.json") {  //ok
    var cen = [103.823557, 36.058039];
    var tra = [310, 210];
    var sca = 1000;
  } else if (proname == "ningxia.json") {  //ok
    var cen = [106.278179, 38.46637];
    var tra = [230, 110];
    var sca = 2500;
  } else if (proname == "shangxi.json") {  //陕西ok
    var cen = [108.948024, 34.263161];
    var tra = [240, 200];
    var sca = 1700;
  } else if (proname == "shanxi.json") {  //山西ok
    var cen = [112.549248, 37.857014];
    var tra = [240, 150];
    var sca = 2000;
  } else if (proname == "hebei.json") {  //ok
    var cen = [114.502461, 38.045474];
    var tra = [200, 210];
    var sca = 1600;
  } else if (proname == "beijing.json") {  //ok
    var cen = [116.418757, 39.917544];
    var tra = [220, 200];
    var sca = 5000;
    // sip = 50;
  } else if (proname == "tianjin.json") {  //ok
    var cen = [117.195907, 39.118327];
    var tra = [220, 200];
    var sca = 5500;
    // sip = 80;
  } else if (proname == "shandong.json") {  //ok
    var cen = [117.000923, 36.675807];
    var tra = [170, 150];
    var sca = 2500;
  } else if (proname == "henan.json") {  //ok
    var cen = [113.665412, 34.757975];
    var tra = [250, 120];
    var sca = 2400;
  } else if (proname == "qinghai.json") {  //ok
    var cen = [101.778916, 36.623178];
    var tra = [360, 140];
    var sca = 1200;
  } else if (proname == "xizang.json") {  //ok
    var cen = [91.132212, 29.660361];
    var tra = [300, 210];
    var sca = 1000;
  } else if (proname == "sichuan.json") {  //ok
    var cen = [104.065735, 30.659462];
    var tra = [240, 160];
    var sca = 1300;
  } else if (proname == "chongqing.json") {  //ok
    var cen = [108.380246, 30.807807];
    var tra = [240, 120];
    var sca = 2700;
  } else if (proname == "hubei.json") {  //ok
    var cen = [108.380246, 30.807807];
    var tra = [100, 200];
    var sca = 2500;
  } else if (proname == "anhui.json") {  //ok
    var cen = [117.283042, 31.86119];
    var tra = [220, 180];
    var sca = 2000;
  } else if (proname == "jiangsu.json") {  //ok
    var cen = [118.767413, 32.041544];
    var tra = [220, 210];
    var sca = 2400;
  } else if (proname == "zhejiang.json") {  //ok
    var cen = [120.153576, 30.287459];
    var tra = [240, 110];
    var sca = 2700;
  } else if (proname == "shanghai.json") {  //ok
    var cen = [121.490317, 31.222771];
    var tra = [200, 170];
    var sca = 7500;
    sip = 50;
  } else if (proname == "jiangxi.json") {  //ok
    var cen = [115.892151, 28.676493];
    var tra = [220, 110];
    var sca = 2000;
  } else if (proname == "hunan.json") {  //ok
    var cen = [112.982279, 28.19409];
    var tra = [250, 140];
    var sca = 2000;
  } else if (proname == "guizhou.json") {  //ok
    var cen = [106.713478, 26.578343];
    var tra = [230, 170];
    var sca = 2500;
  } else if (proname == "yunnan.json") {  //ok
    var cen = [102.712251, 25.040609];
    var tra = [260, 180];
    var sca = 1500;
  } else if (proname == "guangxi.json") {  //ok
    var cen = [108.320004, 22.82402];
    var tra = [250, 210];
    var sca = 2000;
  } else if (proname == "guangdong.json") {  //ok
    var cen = [113.280637, 23.125178];
    var tra = [250, 160];
    var sca = 2000;
  } else if (proname == "fujian.json") {  //ok
    var cen = [119.306239, 26.075302];
    var tra = [270, 160];
    var sca = 2300;
  } else if (proname == "taiwan.json") {
    var cen = [121.509062, 25.044332];
    var tra = [250, 100];
    var sca = 2500;
  } else if (proname == "hainan.json") {  //ok
    var cen = [110.33119, 20.031971];
    var tra = [250, 100];
    var sca = 3500;
  }
  return [cen,tra,sca];  //center地图中心, translate地图平移, scale缩放比例
}
