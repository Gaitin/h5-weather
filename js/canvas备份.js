function Lining(opt){
    this.tval=opt.tval;//温度值
    this.ctx=document.getElementById("canvass").getContext("2d");
    var DPR = window.devicePixelRatio;
    this.step=300;
    this.toTop=opt.toTop;//折线离画布顶部高度
    // if(this.tval[0]>0){
    //     this.toTop=this.toTop+200;
    //     this.toline=this.toTop+80;
    // }else{
    //     this.toTop=this.toTop-50;
    //     this.toline=opt.toTop;//
    // }
    if(this.tval[0]<0){
        this.toTop=this.toTop+400;
        this.toline=this.toTop+80;
    }else{
        this.toTop=this.toTop-100;
        this.toline=opt.toTop-20;//
    }

    this.deg=opt.deg;//折线曲率数字越大折线变化越大建议1-10
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
            // that.ctx.moveTo((line+1)*300,200);
            // that.ctx.lineTo((line+1)*300,1200);
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
