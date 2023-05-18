function heatmap() {
  window.location.replace("../heatmap.html");
}
function windmap() {
  window.localStorage.year = year;
  window.localStorage.mon = month;
  window.localStorage.day = day;
  window.location.replace("../pages/windmap/windmap.html");
}
function cluster(){
  window.location.replace("../cluster.html");
}
function cluster_to_heatmap() {
  window.location.replace("../pages/heatmap.html");
}
function heatmap_to_cluster() {
  window.location.replace("./cluster.html");
}


//煤炭
function jump1(){
  window.location.replace("../pages/line-race_coal.html")
}
//汽油生产
function jump2_1(){
  window.location.replace("../pages/line-race_gasoline_pro.html")
}
//汽油消费
function jump2_2(){
  window.location.replace("../pages/line-race_gasoline_con.html")
}
//焦炭生产
function jump3_1(){
  window.location.replace("../pages/line-race_coke_pro.html")
}
//焦炭消费
function jump3_2(){
  window.location.replace("../pages/line-race_coke_con.html")
}