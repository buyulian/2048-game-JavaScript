/**
 * Created by 不语恋 on 2017/5/16.
 */

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