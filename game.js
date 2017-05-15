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

// 格子对象
function Grid(x, y, n) {
    this.x = x;//格子x坐标
    this.y = y;//格子y坐标
    this.number = n;//格子的数字
    this.color = colors[n % 11];//格子的颜色
    this.actions = [];//动作对象

    //绘制格子
    this.rendering = function () {
        canvas_ctx.fillStyle = this.color;
        canvas_ctx.fillRect(start_x + this.x, start_y + this.y, grid_offset, grid_offset);

        var px = 30, py = 70;
        canvas_ctx.fillStyle = '#000000';

        // 针对不同的数字使用不同大小的字体
        if (this.number > 64) {
            if (this.number > 512) {
                canvas_ctx.font = "40px 宋体";
                canvas_ctx.fillText(this.number.toString(), start_x + this.x + px - 20, start_y + this.y + py - 10);
            } else {
                canvas_ctx.font = "45px 宋体";
                canvas_ctx.fillText(this.number.toString(), start_x + this.x + px - 15, start_y + this.y + py - 10);
            }
        } else if (this.number < 16) {
            canvas_ctx.font = "60px 宋体";
            canvas_ctx.fillText(this.number.toString(), start_x + this.x + px, start_y + this.y + py);
        } else {
            canvas_ctx.font = "50px 宋体";
            canvas_ctx.fillText(this.number.toString(), start_x + this.x + px - 10, start_y + this.y + py - 10);
        }
    };

    //执行动作
    this.executeActions = function (dt) {
        var i = this.actions.length;
        while (i--) {
            this.actions[i].execute(this, dt);
            if (this.actions[i].done(this)) {
                this.actions.splice(i, 1);
            }
        }
    };

    //设置数字
    this.setNumber = function (number) {
        this.number = number;
        this.color = colors[number % 11];
    };


    this.update = function (dt) {

        // 动作
        this.executeActions(dt);

        // 渲染
        this.rendering();
    };


    //增加一个动作
    this.runAction = function (actionObj) {
        this.actions.push(actionObj);
    };
}

// MoveTo动作对象
function MoveTo(src_x, src_y, dst_x, dst_y, duration) {
    this.dx = (dst_x - src_x) / duration;
    this.dy = (dst_y - src_y) / duration;
    this.dst_x = dst_x;
    this.dst_y = dst_y;
    this.duration = duration;

    this.execute = function (obj, dt) {
        if (obj.x < this.dst_x) {
            obj.x += this.dx * dt;
        }
        if (obj.y < this.dst_y) {
            obj.y += this.dy * dt;
        }
    };

    this.done = function (obj) {
        return obj.x === dst_x && obj.y === dst_y;
    };
}

// MoveBy动作对象
function MoveBy(dx, dy, duration) {
    this.dx = dx;
    this.dy = dy;
    this.total_x = dx;
    this.total_y = dy;
    this.duration = duration;

    this.execute = function (obj, dt) {
        if (Math.abs(this.total_x) > Math.abs(this.dx / duration * dt)) {
            obj.x += this.dx / duration * dt;
            this.total_x -= this.dx / duration * dt;
        } else {
            obj.x += this.total_x;
            this.total_x = 0;
        }

        if (Math.abs(this.total_y) > Math.abs(this.dy / duration * dt)) {
            obj.y += this.dy / duration * dt;
            this.total_y -= this.dy / duration * dt;
        } else {
            obj.y += this.total_y;
            this.total_y = 0;
        }
    };

    this.done = function (obj) {
        return Math.abs(this.total_x) >= Math.abs(this.dx) && Math.abs(this.total_y) >= Math.abs(this.dy);
    };

}

// 清空格子 --abandoned
function clearGrid(i, j) {
    // canvas_ctx.fillStyle = '#00FFFF';
    // canvas_ctx.fillRect(start_x + grid_width * i, start_y + grid_width * j, grid_offset, grid_offset);
    grids[i][j] = null;
}

// 绘制数字, 在i, j处绘制2的n次方数字 --abandoned
function drawNumber(i, j, n) {

    canvas_ctx.fillStyle = colors[n % 10];
    canvas_ctx.fillRect(start_x + grid_width * i, start_y + grid_width * j, grid_offset, grid_offset);

    var px = 30, py = 70;
    var number = Math.pow(2, n);
    canvas_ctx.fillStyle = '#000000';
    // 针对不同的幂使用不同大小的字体
    if (n > 6) {
        if (n > 9) {
            canvas_ctx.font = "40px 宋体";
            canvas_ctx.fillText(number.toString(), start_x + grid_width * i + px - 20, start_y + grid_width * j + py - 10);
        } else {
            canvas_ctx.font = "45px 宋体";
            canvas_ctx.fillText(number.toString(), start_x + grid_width * i + px - 15, start_y + grid_width * j + py - 10);
        }
    } else if (n < 4) {
        canvas_ctx.font = "60px 宋体";
        canvas_ctx.fillText(number.toString(), start_x + grid_width * i + px, start_y + grid_width * j + py);
    } else {
        canvas_ctx.font = "50px 宋体";
        canvas_ctx.fillText(number.toString(), start_x + grid_width * i + px - 10, start_y + grid_width * j + py - 10);
    }
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

    // for (i = 0; i < 4; ++i) {
    //     for (j = 0; j < 4; ++j) {
    //         if (table[i][j] === -1) {
    //             clearGrid(j, i);
    //         } else {
    //             drawNumber(j, i, table[i][j]);
    //         }
    //     }
    // }
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

// 绘制有所格子
function drawGrids(dt) {
    var i, j;
    for (i = 0; i < 4; ++i) {
        for (j = 0; j < 4; ++j) {
            if (grids[i][j] !== null) {
                grids[i][j].update(dt);
            }
        }
    }
}

// 随机生成数字 --abandoned
function creatrec() {
    var i, j;
    var f = 0;
    var p = 10;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (table[i][j] === -1) {
                var n = parseInt(Math.random() * p);
                if (n === 0 && f < 4) {
                    table[i][j] = parseInt(Math.random() * 2) + 1;
                    // drawNumber(j, i, table[i][j]);
                    f++;
                }
            }
        }
    }
}

// 在空余的地方随机生成一个数字
function generateNumber() {
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
        // var p = parseInt(Math.random() * 3) + 1;
        // table[emptyTable[k][0]][emptyTable[k][1]] = p;
        // grids[emptyTable[k][0]][emptyTable[k][1]] = new Grid(emptyTable[k][1] * grid_width, emptyTable[k][0] * grid_width, 2 << (p - 1));
        grids[emptyTable[k][0]][emptyTable[k][1]] = new Grid(emptyTable[k][1] * grid_width, emptyTable[k][0] * grid_width, 2);
    }
}

// 响应按键
function upUpdate() {
    var i, j, p;

    // var temp = [];
    // // 计算table
    // for (j = 0; j < 4; j++) {
    //     var p = 0;
    //     for (i = 0; i < 4; i++) {
    //         temp[i] = -1;
    //     }
    //     for (i = 0; i < 4; i++) {
    //         if (table[i][j] !== -1) {
    //             temp[p] = table[i][j];
    //             p++;
    //         }
    //     }
    //     temp[p] = -1;
    //     for (i = 0; i < p - 1; i++) {
    //         if (temp[i] === temp[i + 1] && temp[i] > -1) {
    //             temp[i] = temp[i] + 1; // 幂+1
    //             for (k = i + 1; k < 3; k++) {
    //                 temp[k] = temp[k + 1];
    //             }
    //             temp[k] = -1;
    //         }
    //     }
    //     for (i = 0; i < 4; i++) {
    //         table[i][j] = temp[i];
    //     }
    // }

    // 格子移动
    for (j = 0; j < 4; ++j) {
        // 聚合
        p = 0;
        for (i = 1; i < 4; ) {
            if (i === p || grids[i][j] === null) {
                ++i;
                continue;
            }

            // p指向null
            if (grids[p][j] === null) {
                grids[p][j] = grids[i][j];
                grids[i][j] = null;
                grids[p][j].runAction(new MoveBy(0, -grid_width * (i - p), 0.3));
                ++i;
            } else if (grids[i][j].number === grids[p][j].number) {
                // 如果相等
                grids[p][j] = grids[i][j];
                grids[p][j].runAction(new MoveBy(0, -grid_width * (i - p), 0.3));
                grids[p][j].setNumber(grids[p][j].number * 2);
                grids[i][j] = null;
                ++i;
                ++p;
            } else {
                ++p;
            }
        }
    }
}

function downUpdate() {
    var i, j, p;
    // var sa2 = [];
    //
    // for (j = 0; j < 4; j++) {
    //     var p = 0;
    //     for (i = 0; i < 4; i++)
    //         sa2[i] = -1;
    //     for (i = 0; i < 4; i++)
    //         if (table[3 - i][j] !== -1) {
    //             sa2[p] = table[3 - i][j];
    //             p++;
    //         }
    //     sa2[p] = -1;
    //     for (i = 0; i < p - 1; i++)
    //         if (sa2[i] === sa2[i + 1] && sa2[i] > -1) {
    //             sa2[i] = sa2[i] + 1;
    //             for (k = i + 1; k < 3; k++) {
    //                 sa2[k] = sa2[k + 1];
    //             }
    //             sa2[k] = -1;
    //         }
    //     for (i = 0; i < 4; i++) {
    //         table[3 - i][j] = sa2[i];
    //     }
    // }


    // 格子移动
    for (j = 0; j < 4; ++j) {
        // 聚合
        p = 3;
        for (i = 2; i >= 0; ) {
            if (i === p || grids[i][j] === null) {
                --i;
                continue;
            }

            // p指向null
            if (grids[p][j] === null) {
                grids[p][j] = grids[i][j];
                grids[i][j] = null;
                grids[p][j].runAction(new MoveBy(0, -grid_width * (i - p), 0.3));
                --i;
            } else if (grids[i][j].number === grids[p][j].number) {
                // 如果相等
                grids[p][j] = grids[i][j];
                grids[p][j].runAction(new MoveBy(0, -grid_width * (i - p), 0.3));
                grids[p][j].setNumber(grids[p][j].number * 2);
                grids[i][j] = null;
                --i;
                --p;
            } else {
                --p;
            }
        }
    }
}

function leftUpdate() {
    var i, j, p;
    // var sa2 = [];
    //
    // for (j = 0; j < 4; j++) {
    //     var p = 0;
    //     for (i = 0; i < 4; i++)
    //         sa2[i] = -1;
    //     for (i = 0; i < 4; i++)
    //         if (table[j][i] !== -1) {
    //             sa2[p] = table[j][i];
    //             p++;
    //         }
    //     sa2[p] = -1;
    //     for (i = 0; i < p - 1; i++)
    //         if (sa2[i] === sa2[i + 1] && sa2[i] > -1) {
    //             sa2[i] = sa2[i] + 1;
    //             for (k = i + 1; k < 3; k++) {
    //                 sa2[k] = sa2[k + 1];
    //             }
    //             sa2[k] = -1;
    //         }
    //     for (i = 0; i < 4; i++) {
    //         table[j][i] = sa2[i];
    //     }
    // }

    // 格子移动
    for (i = 0; i < 4; ++i) {
        // 聚合
        p = 0;
        for (j = 1; j < 4; ) {
            if (j === p || grids[i][j] === null) {
                ++j;
                continue;
            }

            // p指向null
            if (grids[i][p] === null) {
                grids[i][p] = grids[i][j];
                grids[i][j] = null;
                grids[i][p].runAction(new MoveBy(-grid_width * (j - p), 0, 0.3));
                ++j;
            } else if (grids[i][j].number === grids[i][p].number) {
                // 如果相等
                grids[i][p] = grids[i][j];
                grids[i][p].runAction(new MoveBy(-grid_width * (j - p), 0, 0.3));
                grids[i][p].setNumber(grids[i][p].number * 2);
                grids[i][j] = null;
                ++j;
                ++p;
            } else {
                ++p;
            }
        }
    }
}

function rightUpdate() {
    var i, j, p;
    // var sa2 = [];
    //
    // for (j = 0; j < 4; j++) {
    //     var p = 0;
    //     for (i = 0; i < 4; i++)
    //         sa2[i] = -1;
    //     for (i = 0; i < 4; i++)
    //         if (table[j][3 - i] !== -1) {
    //             sa2[p] = table[j][3 - i];
    //             p++;
    //         }
    //     sa2[p] = -1;
    //     for (i = 0; i < p - 1; i++)
    //         if (sa2[i] === sa2[i + 1] && sa2[i] > -1) {
    //             sa2[i] = sa2[i] + 1;
    //             for (k = i + 1; k < 3; k++) {
    //                 sa2[k] = sa2[k + 1];
    //             }
    //             sa2[k] = -1;
    //         }
    //     for (i = 0; i < 4; i++) {
    //         table[j][3 - i] = sa2[i];
    //     }
    // }

    // 格子移动
    for (i = 0; i < 4; ++i) {
        // 聚合
        p = 3;
        for (j = 2; j >= 0; ) {
            if (j === p || grids[i][j] === null) {
                --j;
                continue;
            }

            // p指向null
            if (grids[i][p] === null) {
                grids[i][p] = grids[i][j];
                grids[i][j] = null;
                grids[i][p].runAction(new MoveBy(-grid_width * (j - p), 0, 0.3));
                --j;
            } else if (grids[i][j].number === grids[i][p].number) {
                // 如果相等
                grids[i][p] = grids[i][j];
                grids[i][p].runAction(new MoveBy(-grid_width * (j - p), 0, 0.3));
                grids[i][p].setNumber(grids[i][p].number * 2);
                grids[i][j] = null;
                --j;
                --p;
            } else {
                --p;
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
            temp[i][j] = grids[i][j];
        }
    }

    /// 监听键盘事件
    var e = event || window.event || arguments.callee.caller.arguments[0];

    if (e && e.keyCode === 38) { //up
        upUpdate();
    }
    if (e && e.keyCode === 40) { // down
        downUpdate();
    }
    if (e && e.keyCode === 37) { // left
        leftUpdate();
    }
    if (e && e.keyCode === 39) { // right
        rightUpdate();
    }

    if (gameOver()) {
        alert("Game Over!");
    }

    var flag = false;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            if (temp[i][j] !== grids[i][j]) {
                flag = true;
                break;
            }
        }
    }

    // Todo: remember the status when status change generate number.
    //var flag = true;
    if (flag) {
        generateNumber();
    }
};

// 初始化
function init() {
    canvas_node = document.getElementById("mainCanvas");
    canvas_ctx = canvas_node.getContext("2d");

    var i, j;
    // for (i = 0; i < 4; i++) {
    //     table[i] = [];
    //     for (j = 0; j < 4; j++) {
    //         table[i][j] = -1;
    //     }
    // }

    for (i = 0; i < 4; ++i) {
        grids[i] = [];
        for (j = 0; j < 4; ++j) {
            grids[i][j] = null;
        }
    }

    // 生成初始数字
    generateNumber();
    generateNumber();
    // window.requestAnimationFrame(gameLoop);
    setTimeout("gameLoop()", 1000);
}

// 游戏循环
var last_time;
function gameLoop() {
    // 绘制路径开始
    canvas_ctx.beginPath();

    var time = Date.now();
    var dt;
    if (last_time === undefined) {
        last_time = time;
    }
    dt = (time - last_time) / 1000;
    drawBoard();
    drawScore();
    drawGrids(dt);

    requestAnimationFrame(gameLoop);
    last_time = time;
}
