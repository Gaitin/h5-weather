var deg;
function Lining(opt){
    this.tval=opt.tval;//温度值
    var canvas = '<canvas id="canvass" width="'+eval($(window).width()*4)+'" height="'+eval($(window).width()*0.6*4)+'"></canvas>';
    if($('#canvass').length>0){
        console.log('第二条线')
    }else{
        $(".canvas").html(canvas);
    }
    this.ctx=document.getElementById("canvass").getContext("2d");
    this.step=300;
    this.toTop=450;//文字离折线高度
    var newdeg;
    function setdeg(a) {
        var maxtem=Math.max.apply(null, a);
        console.log(maxtem);
        if (maxtem>30){
            this.deg=9;
        }else if(maxtem>20&&maxtem<=30){
            this.deg=11;
        }else if(maxtem>10&&maxtem<=20){
            this.deg=14;
        }else if(maxtem>0&&maxtem<=10){
            this.deg=14;
        }else if(maxtem>-10&&maxtem<=0){
            this.deg=12;
        }else if(maxtem>-20&&maxtem<=-10){
            this.deg=9;
        }else if(maxtem<-20){
            this.deg=8;
        }else{
            this.deg=9;
        }
        return this.deg;
    }
    if(opt.type=='height'){
        // 第一条折线
        this.toline=this.toTop-50;//折线离画布顶部高度
        // this.deg=setdeg(this.tval)
        deg=setdeg(this.tval);
    }else{
        // 第二条折线
        this.toline=this.toTop+80;//折线离画布顶部高度
    }
    this.deg=deg;//折线曲率数字越大折线变化越大建议1-10
    // this.deg=opt.deg;//折线曲率数字越大折线变化越大建议1-10
    this.init();
    this.Drawline();
    this.text();
    this.point();
}
Lining.prototype={
    init:function () {
        var that=this;
        this.ctx.beginPath();
        this.ctx.strokeStyle="#fff";
        for(var line=0;line<4;line++){
            that.ctx.moveTo((line+1)*300,0);
            that.ctx.lineTo((line+1)*300,1000);
            that.ctx.stroke();
        }
    },
    Drawline:function(){
        /*折线*/
        var that=this;
        this.ctx.beginPath();
        this.ctx.strokeStyle="#fff";
        this.ctx.lineWidth=4;
        for(var i=0;i<that.tval.length;i++){
            that.ctx.lineTo((i+1)*that.step-150,(-that.tval[i]*this.deg)+that.toTop);
            that.ctx.stroke();
        }
        this.ctx.closePath();
        this.ctx.save();
    },
    text:function(){
        /*绘制文字*/
        var that=this;
        this.ctx.font="50px Arial";
        this.ctx.fillStyle ='#fff';
        for(var i=0;i<that.tval.length;i++){
            that.ctx.fillText(that.tval[i]+'°',(i+1)*that.step-150,(-that.tval[i]*this.deg)+that.toline);

        }
    },

    point:function(){
        /*绘制点*/
        var that=this;
        for(var j=0;j<that.tval.length;j++){
            that.ctx.beginPath();
            that.ctx.fillStyle="#fff";
            that.ctx.arc((j+1)*that.step-150,(-that.tval[j]*this.deg)+that.toTop,10,0,2*Math.PI,false);
            that.ctx.closePath();
            that.ctx.fill();
        }

    }
}
