var koa = require('koa');
var controller = require('koa-route');
var views = require('co-views');    //具有模板渲染能力的中间键
var app = new koa();
var render = views('./view', {
    map: {html: 'ejs'}
});

var koa_server = require('koa-static-server');     //获取静态资源中间键
var service = require('./service/webAppService.js');
var querystring = require('querystring');

app.use(koa_server({
    rootDir: './static/',
    rootPath: '/static/',
    maxage: 0                   //缓存周期
}));

/* 测试代码 */
app.use(controller.get('/route_test', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = 'hello koa!';
}));

app.use(controller.get('/ejs_test', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = yield render('test', {title: 'title_test'});
}));

app.use(controller.get('/api_test', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = service.get_test_data();
}));

/* 页面模板 */
app.use(controller.get('/', function*() {
    this.set('CacheControl', 'no-cache');
    this.body = yield render('index', {title: '首页'});
}));

app.use(controller.get('/bookcase', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = yield render('/include/index-shelf', {nav: '书架'});
}));

app.use(controller.get('/search', function*() {
    this.set('CacheControl', 'no-cache');
    this.body = yield render('search', {nav: '搜索'});
}));

app.use(controller.get('/reader', function*() {
    this.set('CacheControl', 'no-cache');
    this.body = yield render('reader');
}));

app.use(controller.get('/female', function*() {
    this.set('CacheControl', 'no-cache');
    this.body = yield render('female', {title: '女生频道', nav: '女生频道'});
}));

app.use(controller.get('/male', function*() {
    this.set('CacheControl', 'no-cache');
    this.body = yield render('male', {title: '男生频道', nav: '男生频道'});
}));

app.use(controller.get('/rank', function*() {
    this.set('CacheControl', 'no-cache');
    this.body = yield render('rank', {title: '排行', nav: '排行'});
}));

app.use(controller.get('/category', function*() {
    this.set('CacheControl', 'no-cache');
    this.body = yield render('category', {title: '分类', nav: '分类'});
}));

app.use(controller.get('/book', function*() {
    this.set('CacheControl', 'no-cache');
    var querystring = require('querystring');
    var params = querystring.parse(this.req._parsedUrl.query);
    var bookID = params.id;
    this.body = yield render('book', {nav: "书籍详情", bookID: bookID});
}));

/* 任务代码 */
app.use(controller.get('/ajax/index', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = service.get_index_data();
}));

app.use(controller.get('/ajax/rank', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = service.get_rank_data();
}));

app.use(controller.get('/ajax/chapter', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = service.get_chapter_data();
}));

app.use(controller.get('/ajax/chapter_data', function*() {
    this.set('Cache-Control', 'no-cache');
    var params = querystring.parse(this.req._parsedUrl.query);
    var id = params.id;
    if (!id) {
        id = '';
    }
    this.body = service.get_chapter_content_data(id);
}));

app.use(controller.get('/ajax/bookbacket', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = service.get_bookbacket_data();
}));

app.use(controller.get('/ajax/category', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = service.get_category_data();
}));

app.use(controller.get('/ajax/male', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = service.get_male_data();
}));

app.use(controller.get('/ajax/female', function*() {
    this.set('Cache-Control', 'no-cache');
    this.body = service.get_female_data();
}));

app.use(controller.get('/ajax/book', function*() {
    this.set('Cache-Control', 'no-cache');
    var params = querystring.parse(this.req._parsedUrl.query);
    var id = params.id;
    if (!id) {
        id = '';
    }
    this.body = service.get_book_data(id);
}));

/* 搜索-线上接口 */
app.use(controller.get('/ajax/search', function*() {
    this.set('Cache-Control', 'no-cache');
    var _this = this;
    var params = querystring.parse(this.req._parsedUrl.query);
    var start = params.start;
    var end = params.end;
    var keyword = params.keyword;
    this.body = yield service.get_search_data(start, end, keyword);
}));

app.listen(3001);
console.log("Koa serve is started!");