var id = location.href.split('?id=').pop();
new Vue({
    el: '#app',
    data: {
        srceen_width:windowWidth,
        show_all_tags: true,
        show_search_nothing: false,
        is_show_results:false,
        search_data:[]
    },
    methods: {
        searchBooks: function () {
            var value = $('#search_input-box').val();
            var _this = this;
            this.show_all_tags = false;
            $.get('/ajax/search', {
                keyword: value
            }, function (result) {
                _this.is_show_results = result.more;
                _this.show_search_nothing = !result.more;
                _this.search_data = result.items;
            }, 'json');
        }
    }
});