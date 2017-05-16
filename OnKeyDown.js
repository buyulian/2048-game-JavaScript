/**
 * Created by 不语恋 on 2017/5/16.
 */

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