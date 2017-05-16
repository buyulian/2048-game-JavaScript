/**
 * Created by 不语恋 on 2017/5/16.
 */
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