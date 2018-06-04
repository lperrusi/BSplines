var canv,ctx;
var degree;
var pts = [];
var radio = "move";
var dragId = -1, isMouseDown = false;

window.addEventListener("load",function(){
    canv = document.getElementById("c1");
    ctx = canv.getContext("2d");
    canv.addEventListener("mousedown",putpoint,false);
    canv.addEventListener('mousemove', drag, false);
    canv.addEventListener('touchmove', drag, false);
    // canv.addEventListener('mousedown', start_drag, false);
    // canv.addEventListener('touchstart', start_drag, false);                                    
    // canv.addEventListener('touchend', stop_drag, false);
    document.addEventListener('mouseup', function(){isMouseDown = false;}, false);
    redraw();
},true);

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

function redraw(){
    degree = 3;
    drawSpline();
}

function ptsClear(){
    pts = [];
    drawSpline();
}

function drag(ev){
  if (!isMouseDown) return;
  var c = getXY(ev);
  pts[dragId] = [c];
  // Px[dragId] = c[0];  Py[dragId] = c[1];
  drawSpline();
  ev.preventDefault();
}

// function getPointId(c, kn){
//    var Rmin = 2, r2,xi,yi, Id = 0;
//    for (var i = 0; i < kn; i++){
//     xi = (c[0] - Px[i]); yi = (c[1] - Py[i]);
//     r2 = xi*xi + yi*yi;
//     if ( r2 < Rmin ){ Id = i; Rmin = r2;}}
//    return Id;
// }
function getXY(ev){
  if (!ev.clientX) ev = ev.touches[0];
  var rect = canv.getBoundingClientRect();
  var x = (ev.clientX - rect.left) / w,
      y = (h1 - (ev.clientY - rect.top)) / h;
  return [x, y];
}

// function start_drag(ev){
//   isMouseDown = true;
//   if (radio == "move"){
//    var c = getXY(ev);
//    dragId = getPointId(c, n + 2);
//    drawSpline();}
//   else if ( radio == "delete" ){
//    var c = getXY(ev);
//    var Id = getPointId(c, n);
//    for (var i = Id; i < n + 2; i++){
//     Px[i] = Px[i+1];  Py[i] = Py[i+1];}
//    n1--; n--;
//    drawSpline();} 
//   else if ( radio == "add" ){
//    var c = getXY(ev);
//    var Id = getPointId(c, n) + 1;
//    for (var i = n + 2; i > Id; i--){
//     Px[i] = Px[i-1];  Py[i] = Py[i-1];}
//    Px[Id] = c[0];  Py[Id] = c[1];
//    n1++; n++;
//    drawSpline();} 
//   ev.preventDefault();
// }

function stop_drag(ev){
  dragId = -1;
  ev.preventDefault();
}

function getPointId(c, kn){
   var Rmin = 2, r2,xi,yi, Id = 0;
   for (var i = 0; i < kn; i++){
    xi = (c[0] - Px[i]); yi = (c[1] - Py[i]);
    r2 = xi*xi + yi*yi;
    if ( r2 < Rmin ){ Id = i; Rmin = r2;}}
   return Id;
}