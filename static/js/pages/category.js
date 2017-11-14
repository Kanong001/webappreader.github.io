$.get('/ajax/category', function (result) {
    new Vue({
        el: '#app',
        data: {
            windowWidth,
            male: result.male,
            female:result.female,
            dialogShow:true
        },
        mounted:function () {
            this.dialogShow = false;
        }
    })
}, 'json');