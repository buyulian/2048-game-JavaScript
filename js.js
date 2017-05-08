var rx = 400;//矩形起始坐标
var ry = 50;//矩形起始坐标
var rr = 400;
var srr = 100;//小方格的间距
var srrx = srr - 3;//绘制具体数字时的宽度
var color = ['red', '#0000FF', '#FFFF00', '#FF00FF', '#C0C0C0', '#8A2BE2', '#B8860B', '#4B0082', '#FF6FFF', '#800000'];
var c;
var cans;
var sa=new Array();//存储数字
//清空
function clears(i,j) {
    cans.fillStyle = '#00FFFF';
    cans.fillRect(rx + srr * i, ry + srr * j, srrx, srrx);
}
//绘制数字，坐标i,j处绘制数字2^n;
function srec(i, j,n) {
    cans.fillStyle = color[n%10];//循环获取颜色
    cans.fillRect(rx + srr * i, ry + srr * j, srrx, srrx);//绘制矩形
    var px = 30, py = 70;
    var s = Math.pow(2, n);
    cans.fillStyle = '#000000';//数字颜色
    //不同数字绘制的字体大小不同
    if (n > 6) {
        if(n>9){
            cans.font = "40px 宋体";
            cans.fillText(s, rx + srr * i + px - 20, ry + srr * j + py - 10);
        }else{
            cans.font = "45px 宋体";
            cans.fillText(s, rx + srr * i + px - 15, ry + srr * j + py - 10);
        }
    } else if (n < 4) {
        cans.font = "60px 宋体";
        cans.fillText(s, rx + srr * i + px, ry + srr * j + py);
    } else {
        cans.font = "50px 宋体";
        cans.fillText(s, rx + srr * i + px - 10, ry + srr * j + py - 10);
    }
}
//随机生成数字
function creatrec() {
    var i,j,f=0;
    for(i=0;i<4;i++)//循环每个坐标
        for(j=0;j<4;j++)
            if(sa[i][j]==-1){//如果此坐标为空
                var n=Math.floor(Math.random() * 10);//如果n为零则生成新数字
                if(n==0&&f<4){//f
                    sa[i][j]=Math.floor(Math.random() * 2)+1;
                    srec(j,i,sa[i][j]);
                    f++;
                }
            }
}
function upupdate() {
    var i,j,k;
    var sa2=new Array();

    for(j=0;j<4;j++)
    {
        var p=0;
        for(i=0;i<4;i++)
            sa2[i]=-1;
        for(i=0;i<4;i++)
            if(sa[i][j]!=-1)
            {
                sa2[p]=sa[i][j];
                p++;
            }
        sa2[p]=-1;
        for(i=0;i<p-1;i++)
            if(sa2[i]==sa2[i+1]&&sa2[i]>-1)
            {
                sa2[i]=sa2[i]+1;
                for(k=i+1;k<3;k++){
                    sa2[k]=sa2[k+1];
                }
                sa2[k]=-1;
            }
        for(i=0;i<4;i++)
        {
            sa[i][j]=sa2[i];
            if(sa[i][j]>-1)
                srec(j,i,sa[i][j]);
            else
                clears(j,i);
        }
    }

}
function downupdate() {
    var i,j,k;
    var sa2=new Array();

    for(j=0;j<4;j++)
    {
        var p=0;
        for(i=0;i<4;i++)
            sa2[i]=-1;
        for(i=0;i<4;i++)
            if(sa[3-i][j]!=-1)
            {
                sa2[p]=sa[3-i][j];
                p++;
            }
        sa2[p]=-1;
        for(i=0;i<p-1;i++)
            if(sa2[i]==sa2[i+1]&&sa2[i]>-1)
            {
                sa2[i]=sa2[i]+1;
                for(k=i+1;k<3;k++){
                    sa2[k]=sa2[k+1];
                }
                sa2[k]=-1;
            }
        for(i=0;i<4;i++)
        {
            sa[3-i][j]=sa2[i];
            if(sa[3-i][j]>-1)
                srec(j,3-i,sa[3-i][j]);
            else
                clears(j,3-i);
        }
    }
}
function leftupdate() {
    var i,j,k;
    var sa2=new Array();

    for(j=0;j<4;j++)
    {
        var p=0;
        for(i=0;i<4;i++)
            sa2[i]=-1;
        for(i=0;i<4;i++)
            if(sa[j][i]!=-1)
            {
                sa2[p]=sa[j][i];
                p++;
            }
        sa2[p]=-1;
        for(i=0;i<p-1;i++)
            if(sa2[i]==sa2[i+1]&&sa2[i]>-1)
            {
                sa2[i]=sa2[i]+1;
                for(k=i+1;k<3;k++){
                    sa2[k]=sa2[k+1];
                }
                sa2[k]=-1;
            }
        for(i=0;i<4;i++)
        {
            sa[j][i]=sa2[i];
            if(sa[j][i]>-1)
                srec(i,j,sa[j][i]);
            else
                clears(i,j);
        }
    }
}
function rightupdate() {
    var i,j,k;
    var sa2=[];

    for(j=0;j<4;j++)
    {
        var p=0;
        for(i=0;i<4;i++)
            sa2[i]=-1;
        for(i=0;i<4;i++)
            if(sa[j][3-i]!=-1)
            {
                sa2[p]=sa[j][3-i];
                p++;
            }
        sa2[p]=-1;
        for(i=0;i<p-1;i++)
            if(sa2[i]==sa2[i+1]&&sa2[i]>-1)
            {
                sa2[i]=sa2[i]+1;
                for(k=i+1;k<3;k++){
                    sa2[k]=sa2[k+1];
                }
                sa2[k]=-1;
            }
        for(i=0;i<4;i++)
        {
            sa[j][3-i]=sa2[i];
            if(sa[j][3-i]>-1)
                srec(3-i,j,sa[j][3-i]);
            else
                clears(3-i,j);
        }
    }
}
//键盘事件
document.onkeydown = function (event) {
    var saf=[];
    var i,j,f=0;
    for(i=0;i<4;i++)
    {
        saf[i]=[];
        for(j=0;j<4;j++)
            saf[i][j]=sa[i][j];
    }
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e && e.keyCode == 38) { //up
        //要做的事情
        upupdate();
        //alert('u');
    }
    if (e && e.keyCode == 40) { // down
        downupdate();
        //alert('d');

    }
    if (e && e.keyCode == 37) { // left
        leftupdate();
        //alert('l');

    }
    if (e && e.keyCode == 39) { // right
        rightupdate();
        //alert('r');
    }
    var tm=0;
    for(i=0;i<4;i++)
        for(j=0;j<4;j++)
            if(sa[i][j]==-1){
                tm=1;
                break;
            }
    if(tm==0)
        alert("游戏结束");
    for(i=0;i<4;i++)
        for(j=0;j<4;j++)
            if(saf[i][j]!=sa[i][j]){
                f=1;
                break;
            }
    if(f==1)
        creatrec();
};
//初始化
function ini() {
    c = document.getElementById("myCanvas");
    cans = c.getContext("2d");
    cans.fillStyle = '#00FFFF';
    cans.fillRect(rx, ry, rr, rr);//绘图
    var i, j;
    for (i = 0; i < 5; i++) {
        cans.moveTo(rx, ry + i * srr);
        cans.lineTo(rx + rr, ry + i * srr);//划线
        cans.lineWidth = 1;
        cans.strokeStyle = '#00FF5F';
        cans.stroke();
    }
    for (j = 0; j < 5; j++) {
        cans.moveTo(rx + j * srr, ry);
        cans.lineTo(rx + j * srr, ry + rr);//划线
        cans.lineWidth = 1;
        cans.strokeStyle = '#00FF5F';
        cans.stroke();
    }
    //初始化
    for(i=0;i<4;i++){
        sa[i]=[];
        for(j=0;j<4;j++)
            sa[i][j]=-1;
    }

    //生成前两个数字
    var num=2,aa=-1;
    for(var i=0;i<num;i++){
        var n = Math.floor(Math.random() * 10)+1;//生成0-10之间的随机数
        n=n%4+1;//控制生成数字的大小,2~2^4
        aa+=Math.floor(Math.random() * 15/num)+1;//随机生成坐标
        var x=Math.floor(aa/4);
        var y=aa%4;
        srec(x,y,n);//绘制数字
        sa[y][x]=n;
    }
    //生成下面的数字
    creatrec();
}