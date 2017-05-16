//求n的log2(n)
function log2(n) {
    var s=0;
    while (n>1){
        s++;
        n/=2;
    }
    return s;
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
