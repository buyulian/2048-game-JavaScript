var start_x = 400; // 矩形起始坐标
var start_y = 50; // 距离top
var container_width = 400; // canvas 宽度
var grid_width = 100; // 小方块宽度
var grid_offset = grid_width - 3; // 实际绘制宽度
var colors = ['#FF0000', '#0000FF', '#FFFF00', '#FF00FF', '#C0C0C0', '#8A2BE2', '#B8860B', '#4B0082', '#FF6FFF', '#800000', '#00FF00'];
var canvas_node;
var canvas_ctx;
// var table = []; // table 中记录的是2的幂
var score_x = start_x + container_width * 1.2;//分数的x坐标
var score_y = start_y * 1.5;//分数的y坐标
var grids = []; // 格子
var duration=150;//渲染时间,单位ms
var fps=100;//每秒刷新率
var oneFrameTime=1000.0/fps;//每一帧刷新时间,ms
var interval;

//二维向量
function vector2(x,y) {
    this.x=x;
    this.y=y;

    this.add=function (b){
        this.x+=b.x;
        this.y+=b.y;
    };
    this.mul=function (b) {
        this.x*=b;
        this.y*=b;
    };
    this.sub=function (b) {
        this.x-=b.x;
        this.y-=b.y;
    };
    this.clone=function (){
        var b=new vector2();
        b.x=this.x;
        b.y=this.y;
        return b;
    };
    //坐标对应的位置
    this.coordinate=function (i,j){
        this.x=grid_width*j;
        this.y=grid_width*i;
    };
}
function log2(n) {
    var s=0;
    while (n>1){
        s++;
        n/=2;
    }
    return s;
}
// 格子对象
function Grid(nowPosition,number) {
    this.nowPosition=nowPosition;//格子目前所在的位置
    this.goalPosition = nowPosition.clone();//格子要到指定的位置
    //this.speed=new vector2(0,0);//移动的速度,单位px/ms；
    this.surplusTime=0;//剩余时间
    this.number = number;//格子的数字
    this.color = colors[log2(number)%11];//格子的颜色

    //dt代表dt时间后，单位毫秒,返回是否到达
    this.moveTime = function (dt) {
        var flag=false;
        if(dt>=this.surplusTime){
            this.surplusTime=0;
            this.nowPosition=this.goalPosition.clone();
            //console.log("surplusTime  "+this.surplusTime);
            flag=true;
        }else{
            var tm=new vector2(0,0);
            tm=this.goalPosition.clone();
            tm.sub(this.nowPosition);
            tm.mul(dt/this.surplusTime);
            this.nowPosition.add(tm);
            this.surplusTime-=dt;
            //console.log("surplusTime  "+this.surplusTime);
        }
        this.draw();
        return flag;
    };
    //移动到目标位置
    this.moveGoalPosition=function (goalPosition,surplusTime){
        this.goalPosition=goalPosition.clone();
        this.surplusTime=surplusTime;
    };
    //设置数字和颜色
    this.setNumber=function (number){
        this.number=number;
        this.color = colors[log2(number)%11];
    }
    //绘制格子
    this.draw = function () {
        canvas_ctx.fillStyle = this.color;
        canvas_ctx.fillRect(start_x + this.nowPosition.x, start_y + this.nowPosition.y, grid_offset, grid_offset);

        var px = 30, py = 70;
        canvas_ctx.fillStyle = '#000000';

        // 针对不同的数字使用不同大小的字体
        if (this.number > 64) {
            if (this.number > 512) {
                canvas_ctx.font = "40px 宋体";
                canvas_ctx.fillText(this.number.toString(), start_x + this.nowPosition.x + px - 20, start_y + this.nowPosition.y + py - 10);
            } else {
                canvas_ctx.font = "45px 宋体";
                canvas_ctx.fillText(this.number.toString(), start_x + this.nowPosition.x + px - 15, start_y + this.nowPosition.y + py - 10);
            }
        } else if (this.number < 16) {
            canvas_ctx.font = "60px 宋体";
            canvas_ctx.fillText(this.number.toString(), start_x + this.nowPosition.x + px, start_y + this.nowPosition.y + py);
        } else {
            canvas_ctx.font = "50px 宋体";
            canvas_ctx.fillText(this.number.toString(), start_x + this.nowPosition.x + px - 10, start_y + this.nowPosition.y + py - 10);
        }
    };
}
// 清空格子 --abandoned
function clearGrid(i, j) {
    grids[i][j] = null;
}
// 绘制棋盘
function drawBoard() {
    // 绘制背景
    canvas_ctx.fillStyle = '#00FFFF';
    canvas_ctx.fillRect(start_x, start_y, container_width, container_width);

    // 绘制棋盘
    var i;
    // 横线
    for (i = 0; i < 5; i++) {
        canvas_ctx.moveTo(start_x, start_y + i * grid_width);
        canvas_ctx.lineTo(start_x + container_width, start_y + i * grid_width);
        canvas_ctx.lineWidth = 1;
        canvas_ctx.strokeStyle = '#00FF5F';
        canvas_ctx.stroke();
    }
    // 竖线
    for (i = 0; i < 5; i++) {
        canvas_ctx.moveTo(start_x + i * grid_width, start_y);
        canvas_ctx.lineTo(start_x + i * grid_width, start_y + container_width);
        canvas_ctx.lineWidth = 1;
        canvas_ctx.strokeStyle = '#00FF5F';
        canvas_ctx.stroke();
    }
}

// 更新并绘制分数
function drawScore() {
    var s = 0;
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (grids[i][j] !== null) {
                s += grids[i][j].number;
            }
        }
    }

    canvas_ctx.fillStyle = '#FFFFFF';
    canvas_ctx.fillRect(score_x - 10, score_y - 60, grid_offset, grid_offset + 60);

    canvas_ctx.fillStyle = '#000000';
    canvas_ctx.font = "40px 宋体";
    canvas_ctx.fillText("score", score_x, score_y);
    canvas_ctx.font = "40px 宋体";
    canvas_ctx.fillText(s.toString(), score_x, score_y + 60);
}
// 绘制有所格子,返回true代表绘制完成
function drawGrids(dt) {
    var i, j;
    var flag=true;
    for (i = 0; i < 4; ++i) {
        for (j = 0; j < 4; ++j) {
            if (grids[i][j] !== null) {
                if(!grids[i][j].moveTime(dt)){
                    flag=false;
                }
            }
        }
    }
    return flag;
}

// 随机生成数字
function randomProduceNumber() {
    var i, j;
    var f = 0;
    var nullGridNumber = 0;//空格子的总数
    for (i = 0; i < 4; ++i) {
        for (j = 0; j < 4; ++j) {
            if (grids[i][j] === null) {
                nullGridNumber++;
            }
        }
    }
    var p=12;
    if(nullGridNumber<=8){
        p=10;
        if(nullGridNumber<=4){
            p=12;
            if(nullGridNumber<=2){
                p=6;
            }
        }
    }
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (grids[i][j] ==null) {
                var n = parseInt(Math.random() * p);
                if (n === 0 && f < 16) {//16代表最多产生的格子数
                    var number=parseInt(Math.random() * 2) + 1;
                    number=Math.pow(2,number);
                    grids[i][j]=new Grid(new vector2(j*grid_width,i*grid_width),number);
                    f++;
                    p*=4;//下一个格子产生的概率缩小16倍
                }
            }
        }
    }
}

// 在空余的地方随机生成一个数字
function produceOneNumber() {
    var emptyTable = [];
    var i, j, s = 0;
    for (i = 0; i < 4; ++i) {
        for (j = 0; j < 4; ++j) {
            if (grids[i][j] === null) {
                emptyTable[s] = [];
                emptyTable[s][0] = i;
                emptyTable[s][1] = j;
                ++s;
            }
        }
    }

    if (emptyTable.length !== 0) {
        var k = parseInt(Math.random() * emptyTable.length);
        grids[emptyTable[k][0]][emptyTable[k][1]] = new Grid(new vector2(emptyTable[k][1] * grid_width, emptyTable[k][0] * grid_width), 2);
    }
}

// 响应按键
function update(direction) {
    var i, j, p;
    var gj,gi,nj,ni;
    // 格子移动
    for (j = 0; j < 4; ++j) {
        // 聚合
        p = 0;
        for (i = 1; i < 4; ) {
            
            if(direction=="up"||direction=="left"){
                gi=p;
                ni=i;
            }else{
                ni=3-i;
                gi=3-p;
            }
            var tmp;
            gj=j;
            nj=j;
            if(direction=="up"||direction=="down"){
                //什么都不做
            }else{
                tmp=gi;
                gi=gj;
                gj=tmp;

                tmp=ni;
                ni=nj;
                nj=tmp;
            }

            
            if (i === p || grids[ni][nj] === null) {
                i++;
                continue;
            }
            var goalPosition=new vector2(0,0);
            goalPosition.coordinate(gi,gj);
            // p指向null,最上面的(grids[gi][gj])为空则把下面第一个(grids[ni][nj])移到最上面
            if (grids[gi][gj] === null) {
                grids[gi][gj] = grids[ni][nj];
                grids[ni][nj] = null;
                grids[gi][gj].moveGoalPosition(goalPosition,duration);
                ++i;
            } else if (grids[ni][nj].number === grids[gi][gj].number) {
                // 如果相等
                grids[gi][gj] = grids[ni][nj];
                grids[gi][gj].setNumber(grids[gi][gj].number*2);
                grids[gi][gj].moveGoalPosition(goalPosition,duration);
                grids[ni][nj] = null;
                ++i;
                ++p;
            } else {
                ++p;
            }
        }
    }
}

// 判断游戏结束
function gameOver() {
    var i, j;
    for (i = 0; i < 4; ++i) {
        for (j = 0; j < 4; ++j) {
            if (grids[i][j] === null) {
                return false;
            } else if ((i < 3 && j < 3) &&
                       (grids[i + 1][j] !== null && grids[i][j].number === grids[i + 1][j].number ||
                       (grids[i][j + 1] !== null && grids[i][j].number === grids[i][j + 1].number))) {
                return false;
            } else if (i === 3 && j < 3 && grids[i][j + 1] !== null && grids[i][j].number === grids[i][j + 1].number) {
                return false;
            } else if (j === 3 && i < 3 && grids[i + 1][j] !== null && grids[i][j].number === grids[i + 1][j].number) {
                return false;
            }
        }
    }
    return true;
}
//键盘事件
document.onkeydown = function (event) {

    // 在移动前记录原先的状态以用于在状态未改变时不产生新块
    var temp = [];
    var i, j;
    for (i = 0; i < 4; i++) {
        temp[i] = [];
        for (j = 0; j < 4; j++) {
            if(grids[i][j]!=null)
                temp[i][j] = grids[i][j].number;
            else temp[i][j]=null;
        }
    }
    /// 监听键盘事件
    var e = event || window.event || arguments.callee.caller.arguments[0];

    if (e && e.keyCode === 38) { //up
        update("up");
    }
    if (e && e.keyCode === 40) { // down
        update("down");
    }
    if (e && e.keyCode === 37) { // left
        update("left");
    }
    if (e && e.keyCode === 39) { // right
        update("right");
    }

    if (gameOver()) {
        alert("Game Over!");
    }

    var flag = false;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if(grids[i][j]!=null){
                if(temp[i][j] !== grids[i][j].number){
                    flag = true;
                    break;
                }
            }else{
                if(temp[i][j] !== grids[i][j]){
                    flag = true;
                    break;
                }
            }

        }
    }
    // Todo: remember the status when status change produceOne number.
    //var flag = true;
    if (flag) {
        last_time=null;
        isComplete=false;
        setTimeout("drawOneFrame()",oneFrameTime);
        setTimeout("drawNewGrids()",duration*0.2);
    }
};
function drawNewGrids() {
    if(isComplete){
        //produceOneNumber();
        randomProduceNumber();
        isComplete=false;
        setTimeout("drawOneFrame()",oneFrameTime);
    }else {
        setTimeout("drawNewGrids()",duration*0.52);
    }
}
// 初始化
function init() {
    canvas_node = document.getElementById("mainCanvas");
    canvas_ctx = canvas_node.getContext("2d");

    var i, j;

    for (i = 0; i < 4; ++i) {
        grids[i] = [];
        for (j = 0; j < 4; ++j) {
            grids[i][j] = null;
        }
    }

    // 生成初始数字
    produceOneNumber();
    produceOneNumber();
    setTimeout("drawOneFrame()",oneFrameTime);
}

// 游戏循环
var last_time=null;
var isComplete=false;
//绘制一帧图像
function drawOneFrame() {
    // 绘制路径开始
    canvas_ctx.beginPath();

    var time = Date.now();
    var dt;
    if (last_time === null) {
        last_time = time;
    }
    dt = time - last_time;
    console.log(dt);
    drawBoard();//画棋盘
    drawScore();//画分数
    isComplete=drawGrids(dt);//画格子
    if(!isComplete){
        setTimeout("drawOneFrame()",oneFrameTime);
    }else{
        isComplete=true;
    }
    last_time = time;
}
