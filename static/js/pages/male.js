$.get('/ajax/male', function (result) {
    new Vue({
        el: '#app',
        data: {
            screenWidth: windowWidth,
            d: result.items,
            dialogShow: true
        },
        mounted: function () {
            this.dialogShow = false;
        }
    })
}, 'json');