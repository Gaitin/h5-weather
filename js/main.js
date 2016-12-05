/**
 * Created by 143301 on 2016/11/22.
 */
(function($){
    var basic={};
    var aqi={};
    var now={};
    var daily_forecast;
    var hourly_forecast;
    var minutely;
    var wind;
    var suggestion={};
    var timeline='';
    var weekday='';
    var temperature=[];
    var App= App || {};
    App.rootPath="https://free-api.heweather.com/v5";
    App.URL=App.URL ||{
            weather:App.rootPath+"/weather"
        };
    init();
    function  init() {
        // najax();
        setcarlimit();
        hourlytime();
        htmlxinzuo();
        getxiaohua();
        // htmlxinzuostatus();
        // xinzuopra();
        // htmlcanvas();
        // swiper();
        // htmlnowtem();
        // htmlhourlyforecast();

    }
    //基本天气信息
    function najax() {
        var params={
            city:'beijing',
            key:'8772b65bb9a74831a0eeef281d912188',
            lang:'中文'
        };
        var datalist=[];
        $.ajax({
            url:App.URL.weather,
            type:'get',
            async: false,
            data:params,
            success:function (e) {
                console.log(e);
                datalist=e.HeWeather5;
            }
        });
        console.log(datalist);
        return datalist;
    }
    function hourlytime() {
        $.ajax({
            type:"post",
            // url:"https://api.caiyunapp.com/v2/X0lhgetnuFOu26nq/121.6544,25.1552/forecast.jsonp?callback=MYCALLBACK",/*url写异域的请求地址*/
            url:"http://api.caiyunapp.com/v2/X0lhgetnuFOu26nq/116.467,39.9/forecast.jsonp?callback=MYCALLBACK",/*url写异域的请求地址*/
            dataType: "jsonp",
            jsonpCallback: 'MYCALLBACK',
            success:function(e){
                console.log('彩云')
                console.log(e);
                temperature=e.result.hourly.temperature;
                daily_forecast=e.result.daily;
                hourly_forecast=e.result.hourly;
                minutely=e.result.minutely;
                // wind=e.result.daily.wind;
                htmlnowtem();
                swiper();
                htmlcanvas();
                $('#canlist1').html(htmlcanlist());
                $('#canlist1 .fdboxb').eq(0).find('li:first-child').html('今天');
                $("#futuretable").html(htmlweeklist());
                $('#futuretable tr').eq(0).find('td:first-child').html('&ensp;今天');
                $("#canlist2").html(htmlcasbottom());

            }
        });
    }
    function htmlnowtem() {
        var hourly=hourly_forecast;
        var daily=daily_forecast;
        var wcode=nowstatus();
        console.log(daily_forecast);
        $('.iconw').addClass(wcode[hourly.skycon[0].value]);
        $('#nowtem').html(strsub(hourly.temperature[0].value)+'<div class="dushudian">°</div>');
        $('#nowstatus').html(resettitle(hourly.skycon[0].value));
        $('#lowtem').html(strsub(daily.temperature[0].min));
        $('#heighttem').html(strsub(daily.temperature[0].max));
        $('#ntemqulity').html(hourly.aqi[0].value);
        $('#pm25').html(hourly.pm25[0].value);
        $('#ntwet').html(humid(hourly.humidity[0].value));
    }
    function resettitle(value) {
        var str;
        switch (value)
        {
            case 'CLEAR_DAY':
                str="晴";
                break;
            case 'CLEAR_NIGHT':
                str="晴";
                break;
            case 'PARTLY_CLOUDY_DAY':
                str="多云";
                break;
            case 'PARTLY_CLOUDY_NIGHT':
                str="多云";
                break;
            case 'CLOUDY':
                str="阴";
                break;
            case 'RAIN':
                str="雨";
                break;
            case 'SNOW':
                str="雪";
                break;
            case 'WIND':
                str="风";
                break;
            case 'FOG':
                str="雾";
                break;
            case 'HAZE':
                str="霾";
                break;
            case 'SLEET':
                str="冻雨";
                break;
        }
        return str;
    }
    function strsub(str) {
        str=parseFloat(str).toFixed(0);
        return str
    }
    function humid(value) {
        value=(value*100).toString().substring(0,2);
        return value;
    }
    function htmlhourlyforecast() {
        var wcode=swstatus();
        var str='';
        for(var i=0;i<hourly_forecast.temperature.length;i++){
            hourly_forecast.temperature[i].datetime=hourly_forecast.temperature[i].datetime.substring(11);
            var a=strsub(hourly_forecast.temperature[i].value);
            hourly_forecast.temperature[i].value=a.toString().substr(0,2);
            str+='<div class="swiper-slide">'+
                '<ul class="w-icon-ul">'+
                '<li>'+hourly_forecast.temperature[i].datetime+'</li>'+
                '<li><div class="w-icon-li '+wcode[hourly_forecast.skycon[i].value]+'"></div></li>'+
                '<li>'+hourly_forecast.temperature[i].value+'°</li>'+
                '</ul>'+
                '</div>';
        }
        return str;
    }
    function htmlcanvas() {
        var lowtmp=[];
        var heitmp=[];
        for(var i in daily_forecast.temperature){
            lowtmp.push(strsub(daily_forecast.temperature[i].min));
            heitmp.push(strsub(daily_forecast.temperature[i].max));
        }
//                console.log(lowtmp);
//                console.log(heitmp);
        drawline(lowtmp,heitmp);

    }
    function nowstatus() {
        var wcode={
            CLEAR_DAY:'iconw-CLEAR_DAY',                     //晴天
            CLEAR_NIGHT:'iconw-CLEAR_NIGHT',                 //晴夜
            PARTLY_CLOUDY_DAY:'iconw-PARTLY_CLOUDY_DAY',            //白天多云
            PARTLY_CLOUDY_NIGHT:'iconw-PARTLY_CLOUDY_NIGHT',        //夜间多云
            CLOUDY:'iconw-CLOUDY',                            //阴
            RAIN:'iconw-RAIN',                               //雨
            SNOW:'iconw-SNOW',                               //雪
            WIND:'iconw-WIND',                               //风
            FOG:'iconw-FOG',                                 //雾
            HAZE:'iconw-HAZE',                               //霾
            SLEET:'iconw-SLEET'                              //冻雨
        };
        return wcode;
    }
    function swstatus() {
        var wcode={
            CLEAR_DAY:'w-icon-clear-day',                     //晴天
            CLEAR_NIGHT:'w-icon-clear-night',                 //晴夜
            PARTLY_CLOUDY_DAY:'w-icon-cloudy-day',            //白天多云
            PARTLY_CLOUDY_NIGHT:'w-icon-cloudy-night',        //夜间多云
            CLOUDY:'w-icon-cloud',                            //阴
            RAIN:'w-icon-rain',                               //雨
            SNOW:'w-icon-snow',                               //雪
            WIND:'w-icon-wind',                               //风
            FOG:'w-icon-fog',                                 //雾
            HAZE:'w-icon-haze',                               //霾
            SLEET:'w-icon-sleet'                              //冻雨
        };
        return wcode;
    }
    function futerstatus() {
        var wcode={
            CLEAR_DAY:'fu-icon-clear-day',                     //晴天
            CLEAR_NIGHT:'fu-icon-clear-night',                 //晴夜
            PARTLY_CLOUDY_DAY:'fu-icon-cloudy-day',            //白天多云
            PARTLY_CLOUDY_NIGHT:'fu-icon-cloudy-night',        //夜间多云
            CLOUDY:'fu-icon-cloud',                            //阴
            RAIN:'fu-icon-rain',                               //雨
            SNOW:'fu-icon-snow',                               //雪
            WIND:'fu-icon-wind',                               //风
            FOG:'fu-icon-fog',                                 //雾
            HAZE:'fu-icon-haze',                               //霾
            SLEET:'fu-icon-sleet'                              //冻雨
        };
        return wcode;
    }
    function futer1status() {
        var wcode={
            CLEAR_DAY:'fdimg-icon-clear-day',                     //晴天
            CLEAR_NIGHT:'fdimg-icon-clear-night',                 //晴夜
            PARTLY_CLOUDY_DAY:'fdimg-icon-cloudy-day',            //白天多云
            PARTLY_CLOUDY_NIGHT:'fdimg-icon-cloudy-night',        //夜间多云
            CLOUDY:'fdimg-icon-cloud',                            //阴
            RAIN:'fdimg-icon-rain',                               //雨
            SNOW:'fdimg-icon-snow',                               //雪
            WIND:'fdimg-icon-wind',                               //风
            FOG:'fdimg-icon-fog',                                 //雾
            HAZE:'fdimg-icon-haze',                               //霾
            SLEET:'fdimg-icon-sleet'                              //冻雨
        };
        return wcode;
    }
    function formateday(day) {
        if (day>=7){
            day=day-7;
        }
        var str;
        switch (day)
        {
            case 0:
                str="星期日";
                break;
            case 1:
                str="星期一";
                break;
            case 2:
                str="星期二";
                break;
            case 3:
                str="星期三";
                break;
            case 4:
                str="星期四";
                break;
            case 5:
                str="星期五";
                break;
            case 6:
                str="星期六";
                break;
        }
        return str;

    }
    function htmlcanlist() {
        var date=new Date();
        var day=date.getDay();
        var str='';
        var wcode=futer1status();
        for(var i=0;i<daily_forecast.skycon.length;i++) {
            var params=day+i;
            str += '<li class="flex-1">' +
                '<ul class="fdboxb">' +
                '<li >'+formateday(params)+'</li>' +
                '<li class=""><span class="fdimg '+wcode[daily_forecast.skycon[i].value]+'"></span></li>' +
                '<li class="">'+resettitle(daily_forecast.skycon[i].value)+'</li>' +
                '</ul>' +
                '</li>'
        }
        return str;
    }
    function htmlweeklist() {
        var date=new Date();
        var day=date.getDay();
        var str='';
        var wcode=futerstatus();
        for(var i=0;i<daily_forecast.skycon.length;i++) {
            var params=day+i;
            str += '<tr>'+
                '<td>'+formateday(params)+'</td>'+
                '<td><div class="fu-icon '+wcode[daily_forecast.skycon[i].value]+'"></div></td>'+
                '<td>'+
                '<span>'+strsub(daily_forecast.temperature[i].min)+'°</span>'+
                '<span>'+strsub(daily_forecast.temperature[i].max)+'°</span>'+
                '</td>'+
                '</tr>'
        }
        return str;
    }
    function drawline(lowtmp,heitmp) {
        var linepic=new Lining({
            tval:heitmp, //温度值
            type:'height'
        });

        var linepic1=new Lining({
            tval:lowtmp, //温度值
            type:'low'
        });

    }
    function swiper() {
        var mySwiper1 = new Swiper('.hourlytime .swiper-container',{
            slidesPerView: 7,
            spaceBetween: 0,
            freeMode : true,
            freeModeFluid:true,
            observer:true,//修改swiper自己或子元素时，自动初始化swiper
            observeParents:true//修改swiper的父元素时，自动初始化swiper
        });
        $('#hourlytime').html(htmlhourlyforecast());
        mySwiper1.reInit();

        var featuredSwiper = new Swiper('.featured ',{
            slidesPerView: 3,
            loop:true,
            // loopAdditionalSlides:1,
            tdFlow: {
                rotate: 0,
                stretch:15,
                depth: 90,
                modifier: 2
            },
            onFirstInit: function(swiper){
               $('.xinzuotext').find($("[fname='双鱼座']")).addClass('show');
               $('.starbox').find($("[fname='双鱼座']")).addClass('table');
            },
            onTouchEnd:function (swiper) {
                var slide = featuredSwiper.getSlide(swiper.activeIndex+1);
                var flag=$(slide).find('div:first-child').attr('flag');
                // console.log('flag:'+flag);
                var b=switchxinzuo(flag);
                $('.xinzuotext').find($("[fname="+switchxinzuo(flag)+"]")).addClass('show');
                $('.xinzuotext').find($("[fname="+switchxinzuo(flag)+"]")).siblings().removeClass('show');
                $('.starbox').find($("[fname="+switchxinzuo(flag)+"]")).addClass('table');
                $('.starbox').find($("[fname="+switchxinzuo(flag)+"]")).siblings().removeClass('table');
            }
        });
    }
    function getxinzuo(consName) {
        var params={
            consName:consName,
            type:'today',
            key:'f3ddf260c9972e5ca4d75f6e71c6725f'
        };
        var datalist;
        $.ajax({
            url:'./data/xinzuo.php',
            type:'get',
            async:false,
            data:params,
            success:function (e) {
                e=JSON.parse(e);
                // console.log(e);
                datalist=e;
            }
        });
        return datalist;
    }
    //星座今日动态
    function htmlxinzuo() {
        var list=xinzuopra();
        var str='';
        var str1='';
       for(var i=0;i<list.length;i++){
            str+='<div class="prag none" fname='+list[i].name+'>'+list[i].summary+' </div>'
       }
        $('.xinzuotext').html(str);

        for(var j=0;j<list.length;j++){
            str1+='<table class="none" fname="'+list[j].name+'"><tr><td><div class="start">综合指数</div>' +
                '<div class="starmain '+stardeg(list[j].all)+'"></div>' +
                '</td><td><div>健康指数</div>' +
                '<div class="stardet">'+list[j].health+'</div>' +
                '</td></tr><tr><td><div class="start">爱情指数</div>' +
                '<div class="starmain '+stardeg(list[j].love)+'">' +
                '</div></td><td><div>幸运颜色</div>' +
                '<div class="stardet">'+list[j].color+'</div>' +
                '</td></tr><tr><td><div class="start">工作指数</div>' +
                '<div class="starmain '+stardeg(list[j].work)+'"></div>' +
                '</td><td><div>幸运数字</div>' +
                '<div class="stardet">'+list[j].number+'</div>' +
                '</td></tr><tr><td><div class="start">财运指数</div >' +
                '<div class="starmain '+stardeg(list[j].money)+'">' +
                '</div></td><td><div>速配Q友</div>' +
                '<div class="stardet">'+list[j].QFriend+'</div>' +
                '</td></tr></table>'
        }
        $('.starbox').html(str1);
    }
    function switchxinzuo(n) {
        n=parseInt(n);
        var str;
        switch (n)
        {
            case 1:
                str="水瓶座";
                break;
            case 2:
                str="双鱼座";
                break;
            case 3:
                str="白羊座";
                break;
            case 4:
                str="金牛座";
                break;
            case 5:
                str="双子座";
                break;
            case 6:
                str="巨蟹座";
                break;
            case 7:
                str="狮子座";
                break;
            case 8:
                str="处女座";
                break;
            case 9:
                str="天秤座";
                break;
            case 10:
                str="天蝎座";
                break;
            case 11:
                str="射手座";
                break;
            case 12:
                str="摩羯座";
                break;
        }
        return str;
    }
    function xinzuoset() {
        $('.xinzuotext').html(htmlxinzuo());
    }
    function xinzuopra() {
        var xinzuoarr=['水瓶座','双鱼座','白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','摩羯座'];
        // var data=getxinzuo("白羊座");
        var datalist=new Array();
        for(var i=0;i<xinzuoarr.length;i++){
            datalist.push(getxinzuo(xinzuoarr[i]));
        }
        console.log(datalist);
        return datalist;
    }
    //星座指数
    function htmlxinzuostatus() {
        var str='';
        var list=xinzuopra();
        for(var i=0;i<list.length;i++){
            str+='<table class="none" frame="'+list[i].name+'"><tr><td><div class="start">综合指数</div>' +
                '<div class="starmain'+stardeg(list[i].all)+'"></div>' +
                '</td><td><div>健康指数</div>' +
                '<div>'+list[i].health+'</div>' +
                '</td></tr><tr><td><div class="start">爱情指数</div>' +
                '<div class="starmain'+stardeg(list[i].love)+'">' +
                '</div></td><td><div>幸运颜色</div>' +
                '<div>'+list[i].color+'</div>' +
                '</td></tr><tr><td><div class="start">工作指数</div>' +
                '<div class="starmain'+stardeg(list[i].work)+'"></div>' +
                '</td><td><div>幸运数字</div>' +
                '<div>'+list[i].number+'</div>' +
                '</td></tr><tr><td><div class="start">财运指数</div >' +
                '<div class="starmain'+stardeg(list[i].money)+'">' +
                '</div></td><td><div>速配Q友</div>' +
                '<div>'+list[i].QFriend+'</div>' +
                '</td></tr></table>'
        }
        $('.starbox').html(str);
    }
    //获取星座指数比例转化
    function stardeg(n) {
        var str='';
       n=parseInt(n);
       if(n>=0&&n<16){
           str='star-5'
       }else if(n>=16&&n<32){
           str='star-4'
       }else if(n>=32&&n<48){
           str='star-3'
       }else if(n>=48&&n<64){
           str='star-2'
       }else if(n>=64&&n<=80){
           str='star-1'
       }else{
           str='star-0'
       }
       return str;
    }
    function setcarlimit() {
        function getXHNumber(tDate,sDate) {
            var nDayNum = tDate.getDay() == 0 ? 7 : tDate.getDay();
            if(nDayNum>5) return nDayNum;
            var nDiff = (tDate - sDate)/1000/3600/24/7/13;
            nDiff = Math.floor(nDiff) % 5;
            nDayNum = 5 - nDiff + nDayNum ;
            if(nDayNum>5) nDayNum -= 5;
            return nDayNum;
        }
        //获取今天的日期
        var dd = new Date();
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        if(m<10){
            m="0"+m;
        }
        if(d<10){
            d="0"+d;
        }
        var sday = y+"-"+m+"-"+d;
        var sStartDate = '2012-10-08';//开始星期，周一的日期
        var x1 = '1和6';
        var x2 = '2和7';
        var x3 = '3和8';
        var x4 = '4和9';
        var x5 = '5和0';
        var x6 = '不限行';
        var x7 = '不限行';
        var arr1=sStartDate.split("-");
        var vStartDate = new Date(arr1[0],arr1[1]-1,arr1[2]);
        var arr2 = sday.split("-");
        var vToday = new Date(arr2[0],arr2[1]-1,arr2[2]);
        var nTodayNum = getXHNumber(vToday,vStartDate);

        $('#carlimit').html(eval('x'+nTodayNum));
    }
    function htmlcasbottom() {
        var str='';
        var daytmp=setmday();
        var wind=daily_forecast.wind;
        for(var i=0;i<wind.length;i++){
           str+='<li class="flex-1">'+
                '<ul class="fdboxb">'+
                // '<li class=""><span class="fdimg fdimg-icon-clear-day"></span></li>'+
                // '<li class>晴</li>'+
                '<li class>'+daytmp.list1[i]+'/'+daytmp.list2[i]+'</li>'+
                '<li class>'+setwindd(wind[i].avg.direction)+'</li>'+
                '<li class>'+speedwindd(wind[i].min.speed)+'-'+speedwindd(wind[i].max.speed)+'级</li>'+
                '</ul>'+
                '</li>'
        }
        return str;
    }
    function setwindd(value) {
        value=parseInt(value);
        var str='';
        if(value>0&&value<=22.5){
            str='北风'
        }else if(value>22.5&&value<=67.5){
            str= '东北风'
        }else if(value>67.5&&value<=112.5){
            str= '东风'
        }else if(value>112.5&&value<=157.5){
            str= '东南风'
        }else if(value>157.5&&value<=202.5){
            str= '南风'
        }else if(value>202.5&&value<=247.5){
            str= '西南风'
        }else if(value>247.5&&value<=292.5){
            str= '西风'
        }else if(value>292.5&&value<=337.5){
            str= '西北风'
        }else if(value>337.5&&value<=360){
            str= '北风'
        }
        return str;
    }
    function speedwindd(value) {
        value=parseInt(value);
        var level=0;
        if(value>0&&value<1){
            level=0
        }else if(value>=1&&value<6){
            level=1
        }else if(value>=6&&value<12){
            level=2
        }else if(value>=12&&value<20){
            level=3
        }else if(value>=20&&value<29){
            level=4
        }else if(value>=29&&value<39){
            level=5
        }else if(value>39&&value<50){
            level=6
        }else if(value>=50&&value<62){
            level=7
        }else if(value>=62&&value<75){
            level=8
        }else if(value>=75&&value<89){
            level=9
        }else if(value>=89&&value<103){
            level=10
        }else if(value>=103&&value<117){
            level=11
        }else if(value>=117){
            level=12
        }
        return level;
    }
    //获取笑话
    function getxiaohua() {
        var page=parseInt(Math.random()*1000);
        var time=1470008031+parseInt(Math.random()*10000000);
        time=time.toString().substr(0,10);
        console.log(time);
        var params={
            sort:'asc',
            time:time,
            page:page,
            pagesize:1,
            key:'f3ddf260c9972e5ca4d75f6e71c6725f'
        };
        $.ajax({
            url:'./data/xiaohua.php',
            type:'get',
            async:false,
            data:params,
            success:function (e) {
                e=JSON.parse(e);
                console.log(e);
                var text=e.result.data[0].content;
                text=text.replace(/\s/ig,'').replace(/“/ig,'"').replace(/”/ig,'"');
                $('.joke-content').html( text);
            },error:function (e) {
                console.log(e);
            }
        });
    }
    //获取当前月份(现在是3月)的总天数:
    function getCountDays() {
        var curDate = new Date();
        /* 获取当前月份 */
        var curMonth = curDate.getMonth();
        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setMonth(curMonth + 1);
        /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
    }
    function setmday() {
        var list1=[];
        var list2=[];
        var countday=getCountDays();
        var date=new  Date();
        var mon=date.getMonth()+1;
        var day=date.getDate();
        for(var i=0;i<5;i++){
            day=day+i;
            if(day>countday){
                day=day-countday;
                mon=mon+1;
            }

        list1.push(mon);
        list2.push(day);
        //初始化day为今天
        day=date.getDate();
        }
        return {
            list1:list1,
            list2:list2
        }

    }


})(Zepto);