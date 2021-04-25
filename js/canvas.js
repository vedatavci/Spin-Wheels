var canvas=document.getElementById("canvas");
var lastdiv = document.getElementById("popup1");
var sections=["Galatasaray","Fenerbahçe","Beşiktaş","TrabzonSpor",
"Başakşehir","AlanyaSpor","Kayseri","ErzurumSpor"];
var colors=["#FF0000","#000080","#000000","#800000",
"#FFA500","#008000","#FFFF00","#0000FF"];

var wheels=null;//tekerlek
var frame=null;//çerveve
function repaint(angle){//angle>açı repaint>rutuş yapmak
    var r=Math.min(innerWidth,innerHeight)/2.30;
    if(wheels==null){
        wheels=[];
        for(var selected=0;selected<sections.length;selected++){
            var c=document.createElement("canvas");
            c.width=c.height=2*r+10;
            var ctx=c.getContext("2d"),cx=5+r,cy=5+r;    
            // var g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);
            // g.addColorStop(0,"rgba(0,0,0,0)");
            // g.addColorStop(1,"rgba(0,0,0,0.5)");
            for(var i=0;i<sections.length;i++){
                var a0=2*Math.PI*i/sections.length;
                var a1=a0+2*Math.PI/(i==0 ? 1 :sections.length);
                var a=2*Math.PI*(i+0.5)/sections.length;
                ctx.beginPath();
                ctx.moveTo(cx,cy);
                ctx.arc(cx,cy,r,a0,a1,false);
                ctx.fillStyle=colors[i];
                ctx.fill();
                // ctx.fillStyle=g;
                // ctx.fill();
                ctx.save();
                if(i==selected){
                    ctx.fillStyle="#FFF";
                    ctx.shadowColor="#FFF";
                    ctx.shadowBlur=r/20;
                }
                else{
                    ctx.fillStyle="#AAA";
                    ctx.shadowColor="#000";
                    ctx.shadowBlur=r/10;
                }
                ctx.font = "bold " + "30px serif";
                ctx.textAlign="center";
                ctx.textBaseline="middle";//yazının konumu
                ctx.translate(cx,cy);
                ctx.rotate(a);
                ctx.fillText(sections[i],r*0.62,0);
                ctx.restore();
            }
            wheels.push(c);
        }
    }
    if(frame==null){
        frame=document.createElement("canvas");
        frame.width=frame.height=10+2*r*1.25 ;
        var ctx=frame.getContext("2d"),cx=frame.width/2,cy=frame.height/2;
        ctx.shadowOffsetX =r/80;
        ctx.shadowOffsetY=r/80;
        ctx.shadowBlur=r/40;
        ctx.shadowColor="rgba(0,0,0,0,5)";
        ctx.beginPath();
        ctx.arc(cx,cy,r*1.025,0,2*Math.PI,true);
        ctx.arc(cx,cy,r*0.990,0,2*Math.PI,false);
        ctx.fillStyle="cyan";
        ctx.fill();
        ctx.shadowOffsetX=r/40;
        ctx.shadowOffsetY=r/40;
        g=ctx.createRadialGradient(cx-r/7,cy-r/7,0,cx,cy,r/3);
        g.addColorStop(0,"#FFF");
        g.addColorStop(0.2,"#F44");
        g.addColorStop(1,"#811");
        ctx.fillStyle=g;
        ctx.beginPath();
        ctx.arc(cx,cy,r/5,0,2*Math.PI,false);//orta yuvarlak
        ctx.fill();
        ctx.translate(cx,cy);
        ctx.rotate(Math.PI-0.2);
        ctx.beginPath();
        ctx.moveTo(-r*1.1,-r*0.05);
        ctx.lineTo(-r*0.9,0);
        ctx.lineTo(-r*1.1,r*0.05);
        ctx.fillStyle="#F44";
        ctx.fill();
    }
    canvas.width=innerWidth;
    canvas.height=innerHeight;
    var cx=innerWidth/2,cy=innerHeight/2;
    var ctx=canvas.getContext("2d");
    var selected=(Math.floor((-0.2-angle)*sections.length/(2*Math.PI))%sections.length);
    if(selected<0) selected+=sections.length;
    ctx.save();
    ctx.translate(cx,cy);
    ctx.rotate(angle);
    ctx.translate(-wheels[selected].width/2,-wheels[selected].height/2);
    ctx.drawImage(wheels[selected],0,0);
    ctx.restore();
    ctx.drawImage(frame,cx-frame.width/2,cy-frame.height/2);

}
var angle=0,running=false;
function spinTo(winner,duration){
    var final_angle=(-0.2)-(0.5+winner)*2*Math.PI/sections.length;
    var start_angle=angle-Math.floor(angle/(2*Math.PI))*2*Math.PI-5*2*Math.PI;
    var start=performance.now();
    function frame(){
        var now=performance.now();
        var t=Math.min(1,(now-start)/duration);
        t=3*t*t-2*t*t;
        angle=start_angle+t*(final_angle-start_angle);
        repaint(angle);
        if(t<1)requestAnimationFrame(frame);else running=false;
        if(running==false){
            var audio = document.getElementById("music");
            audio.play();
            congratulations();
        }
        else{
            var audiotwo=document.getElementById("musictwo");
            audiotwo.play();
        }
    }
    requestAnimationFrame(frame);
    running=true;
  
}
function congratulations(){
        lastdiv.setAttribute("class", "displayShow");
      
   
}
canvas.onmousedown=function(){
    if(!running){
        spinTo(Math.random()*sections.length,9001);
    }
};

repaint(angle);
