var id = location.href.split('?id=').pop();
$.get('/ajax/book?id=' + id, function (d) {
    new Vue({
        el: '#app',
        data: {
            d,
            windowWidth,
            dialogShow: true
        },
        mounted: function () {
            this.dialogShow = false;
        },
        methods: {
            readBook: function () {
                location.href = '/reader';
            }
        }
    })
}, 'json');