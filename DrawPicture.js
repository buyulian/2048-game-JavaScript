/**
 * Created by 不语恋 on 2017/5/16.
 */
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
//画一个行的格子
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