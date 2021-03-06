var offset = $($('.Swipe-tab').find('a')[0]).offset();
var index_header_tab_width = offset.width;
$.get('/ajax/index', function (d) {
    // debugger;

    new Vue({
        el: '#app',
        data: {
            screen_width: windowWidth,
            double_screen_width: windowWidth * 2,
            index_header_tab_width: index_header_tab_width,
            top: d.items[0].data.data,
            hot: d.items[1].data.data,
            recommend: d.items[2].data.data,
            female: d.items[3].data.data,
            male: d.items[4].data.data,
            free: d.items[5].data.data,
            topic: d.items[6].data.data,
            tab_1_class: 'Swipe-tab__on',
            tab_2_class: '',
            header_position: 0,
            header_duration: 0,
            position: 0,
            duration: 0,
            dialogShow:true
        },
        mounted:function () {
            this.dialogShow = false;
        },
        methods: {
            tabSwitch: function (pos) {
                this.duration = 0.5;
                this.header_duration = 0.5;
                if (pos === 0) {
                    this.position = 0;
                    this.header_position = 0;
                    this.tab_1_class = 'Swipe-tab__on';
                    this.tab_2_class = '';
                } else {
                    this.position = (-this.screen_width);
                    this.header_position = this.index_header_tab_width;
                    this.tab_1_class = '';
                    this.tab_2_class = 'Swipe-tab__on';
                }
            }
        }
    });
}, 'json');
