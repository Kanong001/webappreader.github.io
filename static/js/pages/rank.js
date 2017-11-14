$.get('/ajax/rank', function (result) {
    for (var i = 0; i < result.items.length; i++) {
        result.items[i].description = result.items[i].description.split('\n');
    }
    new Vue({
        el: '#app',
        data: {
            result,
            windowWidth,
            dialogShow: true
        },
        mounted: function () {
            this.dialogShow = false;
        }
    })
}, 'json');