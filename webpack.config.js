var webpack=require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");//引入webpack-plugin
//环境变量配置 dev online
var WEBPACK_ENV=process.env.WEBPACK_ENV || 'dev';
console.log(WEBPACK_ENV)

//获取html-webpack-plugin参数的方法
var getHtmlConfig=function(name){
    return{
        template:'./src/view/'+name+'.html',
        filename:'view/'+name+'.html',
        inject:true,
        hash:true,
        chunks:['common',name]
    }
}
module.exports = {
    entry:{
        'common':['./src/page/common/index.js'],
        'index':['./src/page/index/index.js'],
        'login':['./src/page/login/index.js']
    }, //已多次提及的唯一入口文件
    output: {
        path: "./dist",//打包后的文件存放的地方
        publicPath:"/dist", // 预览文件的路径
        filename: "js/[name].js"//打包后输出文件的文件名
    },
    /*终端没有安装jQuery的情况下添加externals对象*/
    externals:{
        'jquery':'window.jquery'
    },
    /*module是webpack处理css文件需要的对象,注:一定要在终端先安装:npm install css-loader style-loader url-loader file-loader--save-dev*/
    module: {
        loaders: [
            { test: /\.css$/, loader:  ExtractTextPlugin.extract("style-loader","css-loader")},
            {
                // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求 
                // 如下配置，将小于8192byte的图片转成base64码
                test: /\.(png|jpg|gif|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=8192&name=resource/[name].[ext]?[hash]',
            }
        ]
    },
    /*plugins是webpack中提取公共组件所添加的对象,需要安装:npm install html-webpack-plugin --save-dev*/
    plugins:[
        //独立通用组件模块到js/base.js中
        new webpack.optimize.CommonsChunkPlugin({
            name:'common',
            filename:'js/base.js'
        }),
        //把css单独打包到文件里
        new ExtractTextPlugin("css/[name].css"),
        //html模板的处理
        /*new HtmlWebpackPlugin({
            template:'./src/view/index.html', /!*本地模板文件的位置*!/
            filename:'view/index.html',/!*输出文件的文件名称*!/
            inject:true,/!*向template或者templateContent中注入所有静态资源，不同的配置值注入的位置不经相同,1、true或者body：所有JavaScript资源插入到body元素的底部
2、head: 所有JavaScript资源插入到head元素中
3、false： 所有静态资源css和JavaScript都不会注入到模板文件中*!/
            hash:true,/!*是否为所有注入的静态资源添加webpack每次编译产生的唯一hash值*!/
            chunks:['common','index'] /!*允许插入到模板中的一些chunk，不配置此项默认会将entry中所有的thunk注入到模板中*!/

        })*/
        new HtmlWebpackPlugin(getHtmlConfig('index')),
        new HtmlWebpackPlugin(getHtmlConfig('login')),
    ]
};
if('dev'===WEBPACK_ENV){
   module.exports.entry.common.push('webpack-dev-server/client?http://localhost:8082/')
}