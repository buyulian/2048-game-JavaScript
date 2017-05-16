/**
 * Created by 不语恋 on 2017/5/16.
 */
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