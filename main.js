var w,h,h1, d,d2, dragId = -1;
var canv,ctx;
var degree;
var pts = [];
var radio = "move";
var dragId = -1, isMouseDown = false;
var scale = 0.4;

window.addEventListener("load",function(){
    canv = document.getElementById("c1");
    ctx = canv.getContext("2d");
    canv.addEventListener('mousemove', drag, false);
    canv.addEventListener('touchmove', drag, false);
    canv.addEventListener('mousedown', start_drag, false);
    canv.addEventListener('touchstart', start_drag, false);                                    
    // canv.addEventListener('touchend', stop_drag, false);
    document.addEventListener('mouseup', function(){isMouseDown = false;}, false);
    redraw();

},true);

function printPoints(){
    if(pts.length == 0) {
        return;
    }
    for(var i = 0;i<pts.length;i++){
        ctx.fillStyle = "rgba(0,255,0,1)";
        ctx.beginPath();
        ctx.arc(pts[i][0],pts[i][1],5,0,Math.PI*2,false);
        ctx.fill();
        ctx.closePath();   
    }
}

function drawSpline(){
    ctx.clearRect(0,0,canv.width,canv.height);
    if(pts.length == 0) {
        return;
    }
    for(var i = 0;i<pts.length;i++){
        ctx.fillStyle = "rgba(0,255,0,1)";
        ctx.beginPath();
        ctx.arc(pts[i][0],pts[i][1],5,0,Math.PI*2,false);
        ctx.fill();
        ctx.closePath();   
    }
    var spline = new BSpline(pts,degree,true);
    ctx.beginPath();
    var oldx,oldy,x,y;
    oldx = spline.calcAt(0)[0];
    oldy = spline.calcAt(0)[1];

    for(var t = 0;t <= 1;t+=0.001){
        ctx.moveTo(oldx,oldy);
        var interpol = spline.calcAt(t);
        x = interpol[0];
        y = interpol[1];
        ctx.lineTo(x,y);
        oldx = x;
        oldy = y;
    }
    ctx.stroke();
    ctx.closePath();
}

function putpoint(e){
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    pts.push([x,y]);
    drawSpline();
}

function deletepoint(e){
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;;
    var margem = 10;
    for(var i = 0; i<pts.length; i++){
        var point = pts[i];
        if((x >= point[0]) && (x <= (point[0]+10))) {
            if((y>= point[1]) && (y <= (point[1]+10))){
                pts.splice(i,1);
                break;
            }
        }
    }
    redraw();
}

function drag(ev){
  if (!isMouseDown) return;
  var c = getXY(ev);
  pts[dragId] = [c];
  // Px[dragId] = c[0];  Py[dragId] = c[1];
  drawSpline();
  ev.preventDefault();
}

function getXY(ev){
  if (!ev.clientX) ev = ev.touches[0];
  var rect = canv.getBoundingClientRect();
  var x = (ev.clientX - rect.left) / w,
      y = (h1 - (ev.clientY - rect.top)) / h;
  return [x, y];
}

function start_drag(ev){
  isMouseDown = true;
  if (radio == "move"){
   // var c = getXY(ev);
   // console.log(c);
   // dragId = getPointId(c, n + 2);
   // drawSpline();
    }
  else if ( radio == "delete" ){
    deletepoint(ev)
    } 
  else if ( radio == "add" ){
    putpoint(ev)
    } 
  ev.preventDefault();
}

function stop_drag(ev){
  dragId = -1;
  ev.preventDefault();
}

function redraw(){
    degree = 3;
    drawSpline();
}

function ptsClear(){
    pts = [];
    drawSpline();
}