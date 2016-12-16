window.onload=function (){
	/*开始部分动画效果*/
	var birdMove=document.getElementsByClassName('bird')[0];   //图片文字和鸟的容器
	var smallBird=document.querySelectorAll('.bird img')[1];   //小鸟的图片
	var sliderMove=document.getElementsByClassName('slider')[0];   //草地
    var gameMusic=document.getElementById('game_music');     //游戏进行的音乐
    var overMusic=document.getElementById('over_music');     //游戏结束的音乐
    var bulletMusic=document.getElementById('bullet')  //小鸟飞的音乐
    var birdImg=document.querySelector('#fly_bird img');
    var startTimer;     //文字、鸟跳动定时器
    var sliderTimer;    //草地移动定时器
    var birdy=0;        //更换小鸟的2张图片
    var k=10;           //上下跳动赋值
    var dp=0;           //给草地移动赋值
    //图片文字部分和小鸟跳动
    startTimer=setInterval(function(){  	
        birdMove.style.top=100+k+'px';  
        birdy++;
        if(birdy==1){
            k=-10;
            smallBird.src='../img/bird1.png';
        }
        if(birdy==2){
        	k=10;
        	birdy=0;
            smallBird.src='../img/bird0.png';
        }
    },1000);
    //草地移动
    sliderTimer=setInterval(function(){
        sliderMove.style.left=dp+'px';
        dp-=2; 
        if(dp==-344){
            dp=0;
        }  
    },20);
    //点击开始以后
    var butn=document.getElementsByClassName('butn')[0];    //点击按钮和提交按钮容器
    var start=document.getElementsByClassName('start_butn')[0]; //点击按钮
    var flyBird=document.getElementById('fly_bird');    //控制的小鸟
    var bag=document.getElementsByClassName('bg')[0];   //背景
    var more_pipes=document.getElementById('more_pipes');   //管道容器
    var creat;  //管道生成定时器
    var speed=0;    //下落速度
    var h=0;        //上升高度
    var isflying;   //下落定时器
    var checking;   //检测碰撞定时器
    //点击开始游戏开始
    start.onclick=function(){ 
        //跳动的文字小鸟消失，按钮消失
        birdMove.style.display='none';
        butn.style.display='none';
        //小鸟出现
        flyBird.style.display='block';
        //背景音乐播放
        gameMusic.play();
        gameMusic.loop=true;
        //小鸟下落
        isplaying=setInterval(birdFly,30);
        //点击小鸟往上飞 
        document.onclick=function(){ 
              speed=-8;
              //飞的音乐
              bulletMusic.play();
        } 
        //生成管道
        creat=setInterval(creatPipe,2500);
        //检测是否碰撞
        checking=setInterval(check,15);
        //点击ok重新开始
        overButn.onclick=function(){
            location.reload();
        }
    }
    //随机函数
    function randomNum(max,min){
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    //鸟下落
    function birdFly(){
        speed+=0.5;
        //设置最大速度
        if(speed>8){
            speed=8;
        }
        var birdTop=flyBird.offsetTop+speed;
        if(h>birdTop){
            birdImg.src='../img/up_bird0.png'
        }
        else{
            birdImg.src='../img/down_bird1.png';
        }
        //小鸟落地
        if(birdTop>400){
            birdTop=400;
            clearInterval(isflying);
            gameOver();
        }
        //小鸟到顶
        if(birdTop<0){
            birdTop=400;
            clearInterval(isflying);
            gameOver();
        }
        flyBird.style.top=birdTop+'px';
        //记录小鸟的对地位移
        h=birdTop;
    }

    //管道出现
    function creatPipe(){
        var kp=0;         
        //创建管道容器
        var pipeBox=document.createElement('li');
        pipeBox.className='pipe';
        more_pipes.appendChild(pipeBox);
        //创建管道上半部分
        var top_pipe=document.createElement('div');
        top_pipe.className='up_pipe';
        top_pipe.style.height=randomNum(220,50)+'px';
        pipeBox.appendChild(top_pipe);
        //创建下半部分
        var bottom_pipe=document.createElement('div');
        bottom_pipe.className='down_pipe';
        bottom_pipe.style.height=423-top_pipe.offsetHeight-100+'px';
        pipeBox.appendChild(bottom_pipe);
        //移动
        pipeBox.downTimer=setInterval(function(){
            pipeBox.style.right=kp+'px';
            kp+=2;
            if(kp>=342){
                kp=0;
                clearInterval(pipeBox.downTimer);
                //移除障碍物 
                pipeBox.remove();
                //增加分数
                changeScore();
            }
        },20);   
    }

    //检测是否发生碰撞并处理
    function check(){
        var pipes=document.getElementsByClassName('pipe');
        for(var i=0;i<pipes.length;i++){
            //只有小鸟左边不大于管道的右边判断碰撞开始
            if(pipes[i].offsetLeft+pipes[i].offsetWidth>flyBird.offsetLeft){
                //上半部分是否碰到
                if(crash(flyBird,pipes[i].firstElementChild)){
                    console.log('上半部分碰到');
                    flyBird.style.transition='all 1s cubic-bezier(0.2,-0.5,0.8,1.5)';
                    flyBird.style.top=400+'px';
                    gameOver();
                }
                if(crash(flyBird,pipes[i].lastElementChild)){
                    console.log('下半部分碰到');
                    flyBird.style.transition='all 1s cubic-bezier(0.2,-0.5,0.8,1.5)';
                    flyBird.style.top=400+'px';
                    gameOver();
                }
            }
        }
    } 

    //判断2个物体是否相撞
    function crash(obj1,obj2){
        var bool=null;
        //获取obj1的左、右、上、下边距
        var left1=obj1.offsetLeft;
        var right1=obj1.offsetLeft+obj1.offsetWidth;
        var top1=obj1.offsetTop;
        var bottom1=obj1.offsetTop+obj1.offsetHeight;
        //获取obj2的左、右、上、下边距
        //管道外面有容器，不能直接用自己的offsetLeft，改用parentNode.offsetLeft
        var left2=obj2.parentNode.offsetLeft;  
        var right2=obj2.parentNode.offsetLeft+obj2.offsetWidth;
        var top2=obj2.offsetTop;
        var bottom2=obj2.offsetTop+obj2.offsetHeight;
        //判断是否发生碰撞
        if(right1>left2 && left1<right2 && bottom1>top2 && top1<bottom2){
            bool=true;  //碰撞
        }
        else{
            bool=false; //未碰撞
        }
        return bool;
    }
    //得分
    var getMark=0;
    var score=document.getElementsByClassName('score')[0];
    function changeScore(){
        getMark++;
        score.innerHTML='';
        if(getMark<10){
            var img=document.createElement('img');
            img.src='../img/'+getMark+'.jpg';
            score.appendChild(img);
        }
        else{
            //score.style.left='';
            //十位图片
            var imgx=document.createElement('img');
            imgx.src='../img/'+Math.floor(getMark/10)+'.jpg';
            score.appendChild(imgx);
            //个位图片
            var imgy=document.createElement('img');
            imgy.src='../img/'+getMark%10+'.jpg';
            score.appendChild(imgy);
        }
    }
    //游戏结束部分
    var overImg=document.getElementById('over_img');     //获取游戏结束图片
    var overButn=document.getElementById('over_btn');    //OK按钮
    var overMessage=document.getElementById('over_message');    //游戏结束信息
    var endMark=document.getElementById('end_score');   //结束分数
    var bestMark=document.getElementById('best_score'); //最好成绩
    function gameOver(){
        //背景音乐消失
        gameMusic.pause();
        //结束音乐出现
        overMusic.play();
        //清除所有定时器
        var end=setInterval(function(){},1);
        for(var i=0;i<=end;i++){
            clearInterval(i);
        }
        //gameover图片出现
        overImg.style.transition='all 1s cubic-bezier(0.2,-0.5,0.8,1.5)';
        overImg.style.top=120+'px';
        //ok按钮出现
        overButn.style.transition='all 1s cubic-bezier(0.2,-0.5,0.8,1.5)';
        overButn.style.left=118+'px';
        //分数显示
        overMessage.style.transition='all 1s cubic-bezier(0.2,-0.5,0.8,1.5)';
        overMessage.style.top=180+'px';
        //得分
        endMark.innerHTML=getMark;
        //最好成绩
        localStorage.clear();
        if(localStorage.bestMark){
            var a=localStorage.bestMark>getMark? localStorage.bestMark:getMark;
            bestMark.innerHTML=a;
            localStorage.bestMark=a;
        }
        else{
            bestMark.innerHTML=getMark;
            localStorage.bestMark=getMark;
        }
    }
}