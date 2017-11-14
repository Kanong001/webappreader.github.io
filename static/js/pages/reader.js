(function () {
    var Util = (function () {
        var prefix = 'html5_reader_';
        var StorageGetter = function (key) {
            try {
                return localStorage.getItem(prefix + key);
            } catch (e) {
                console.log(e);
            }
        };
        var StorageSetter = function (key, val) {
            return localStorage.setItem(prefix + key, val);
        };
        //数据解密
        function getJSONP(url, callback) {
            return $.jsonp({
                url: url,
                cache: true,
                callback: "duokan_fiction_chapter",
                success: function (result) {
                    var data = $.base64.decode(result);
                    var json = decodeURIComponent(escape(data));
                    callback(json);
                }
            });

        };

        return {
            getJSONP: getJSONP,
            StorageGetter: StorageGetter,
            StorageSetter: StorageSetter
        }
    })();

    var Dom = {
        topNav: $('#topNav'),
        footerNav: $('#footerNav'),
        fontContainer: $('.font_container'),
        fontButton: $('#fontButton'),
        fontButtonIcon: $('#fontButton .icon'),
        whiteArc: $('.white-arc'),
        blackArc: $('.black-arc'),
        night: $('#night'),
        bkContainer: $('.bk-container'),
        changeChapterButton:$(document.querySelector('.m-button-bar'))
    };
    var Win = $(window);
    var Doc = $(document);
    var Body = $('body');
    var readerModel;
    var readerUI;
    const NIGHT = "#0f1410";
    const SUN = "#fff";
    var fictionContainer = $('#fictionContainer');
    var initFontSize = Util.StorageGetter('font_size');
    initFontSize = parseInt(initFontSize);
    if (!initFontSize) {
        initFontSize = 14;
    }
    fictionContainer.css('font-size', initFontSize);
    var UBackColor = Util.StorageGetter('background_color');
    if (!UBackColor) {
        UBackColor = "#e9dfc7";
    }
    Body.css('background', UBackColor);

    function main() {
        //todo 程序入口
        readerModel = ReaderModel();
        readerUI = ReaderBaseFrame(fictionContainer);
        readerModel.init(function (data) {
            readerUI(data);
        });
        EventHanlder();
    }

    function ReaderModel() {
        //todo 实现和阅读器相关的数据交互的方法
        var Chapter_id;
        var Chapter_total;
        var init = function (UIcallback) {
//                getFictionInfo(function () {
//                    getCurChapterContent(Chapter_id,function (data) {
//                        //TODO ...
//                        UIcallback && UIcallback(data);
//                    })
//                });
            getFictionInfoPromise().then(function () {
                return getCurChapterContentPromise();
            }).then(function (data) {
                UIcallback && UIcallback(data);
            });
        };
        var getFictionInfoPromise = function () {
            return new Promise(function (resolve, reject) {
                $.get('/ajax/chapter', function (data) {
                    //TODO 获得章节信息后的回调
                    if (data.result == 0) {
                        Chapter_id = Util.StorageGetter('last_chapter_id');
                        if (Chapter_id == "NaN") {
                            Chapter_id = data.chapters[1].chapter_id;
                            console.log(Chapter_id);
                        }
                        Chapter_total = data.chapters.length;
                        resolve();
                    } else {
                        reject();
                    }

                }, 'json')
            });
        };
        var getFictionInfo = function (callback) {
            $.get('data/chapter.json', function (data) {
                //TODO 获得章节信息后的回调
                Chapter_id = Util.StorageGetter('last_chapter_id');
                if (Chapter_id == null) {
                    Chapter_id = data.chapters[1].chapter_id;
                }
                Chapter_total = data.chapters.length;
                callback && callback();
            }, 'json')
        };
        var getCurChapterContentPromise = function () {
            return new Promise(function (resolve, reject) {
                $.get('/ajax/chapter_data', {
                    id: Chapter_id
                }, function (data) {
                    if (data.result == 0) {
                        var url = data.jsonp;
                        Util.getJSONP(url, function (jsondata) {
                            resolve(jsondata);
                        });
                    } else {
                        reject({msg: 'fail'});
                    }
                }, 'json');
            });
        };
        var getCurChapterContent = function (chapter_id, callback) {
            $.get('data/data' + chapter_id + '.json', function (data) {
                if (data.result == 0) {
                    var url = data.jsonp;
                    Util.getBSONP(url, function (jsondata) {
                        callback && callback(jsondata);
                    });
                }
            }, 'json');
        };
        var prevChapter = function (UIcallback) {
            Chapter_id = parseInt(Chapter_id, 10);
            if (Chapter_id == 0) {
                return;
            }
            Chapter_id--;
            getCurChapterContentPromise().then(function (data) {
                UIcallback && UIcallback(data);
            });
            Util.StorageSetter('last_chapter_id', Chapter_id);
        };
        var nextChapter = function (UIcallback) {
            Chapter_id = parseInt(Chapter_id, 10);
            if (Chapter_id == Chapter_total) {
                return;
            }
            Chapter_id++;
            getCurChapterContentPromise().then(function (data) {
                UIcallback && UIcallback(data);
            });
            Util.StorageSetter('last_chapter_id', Chapter_id);
        };
        return {
            init: init,
            prevChapter: prevChapter,
            nextChapter: nextChapter
        }
    }

    function ReaderBaseFrame(container) {
        //todo 渲染基本的UI结构
        function parseChapterData(jsonData) {
            var jsonObj = JSON.parse(jsonData);
            var html = '<h4>' + jsonObj.t + '</h4>';
            for (var i = 0; i < jsonObj.p.length; i++) {
                html += '<p>' + jsonObj.p[i] + '</p>';
            }
            return html;
        }

        return function (data) {
            container.html(parseChapterData(data));
            Dom.changeChapterButton.show();
        }
    }

    function EventHanlder() {
        //todo 交互的事件绑定
        $('#actionMid').on('click', function () {
            if (Dom.topNav.css('display') == 'none') {
                Dom.topNav.show();
                Dom.footerNav.show();
            } else {
                Dom.topNav.hide();
                Dom.footerNav.hide();
                Dom.fontContainer.hide();
                Dom.fontButtonIcon.removeClass('activate');
                Dom.whiteArc.removeClass('activate-icon');
            }
        });


        Dom.fontButton.on('click', function () {
            Dom.whiteArc.removeClass('activate-icon');
            if (Dom.fontContainer.css('display') == 'none') {
                Dom.fontContainer.show();
                Dom.fontButtonIcon.addClass('activate');
            } else {
                Dom.fontContainer.hide();
                Dom.fontButtonIcon.removeClass('activate');
            }
        });

        $('#nightButton').on('click', function () {
            //TODO 出发背景切换的事件
            Dom.fontContainer.hide();
            Dom.fontButtonIcon.removeClass('activate');
            if (Dom.blackArc.css('display') != 'none') {
                Dom.blackArc.hide();
                Body.css('background', NIGHT);
                Dom.night.text('白天');
            } else {
                Dom.blackArc.show();
                Body.css('background', SUN);
                Dom.night.text('夜间');
            }
            Dom.whiteArc.addClass('activate-icon');
        });

        $('#largeFont').on('click', function () {
            if (initFontSize >= 20) {
                return;
            }
            initFontSize++;
            fictionContainer.css('font-size', initFontSize);
            Util.StorageSetter('font_size', initFontSize);
        });

        $('#smallFont').click(function () {
            if (initFontSize <= 12) {
                return;
            }
            initFontSize--;
            fictionContainer.css('font-size', initFontSize);
            Util.StorageSetter('font_size', initFontSize);
        });

        Dom.bkContainer.each(function () {
            var backColor = $(this).css('background');
            $(this).on('click', function () {
                Body.css('background', backColor);
                Util.StorageSetter('background_color', backColor);
            });
        });


        Win.on('scroll', function () {
            Dom.topNav.hide();
            Dom.footerNav.hide();
            Dom.fontContainer.hide();
            Dom.fontButtonIcon.removeClass('activate');
            Dom.whiteArc.removeClass('activate-icon');
        });

        $('#prev-button').on('click', function () {
            readerModel.prevChapter(function (data) {
                readerUI(data);
            })
        })

        $('#next-button').on('click', function () {
            readerModel.nextChapter(function (data) {
                readerUI(data);
            })
        })
    }

    main();
})();