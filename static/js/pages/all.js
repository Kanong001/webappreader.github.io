var windowWidth = $(window).width();
if (windowWidth < 320) {
    windowWidth = 320;
}

// var aTopBack = document.getElementById('top_back');
// if (aTopBack) {
//     aTopBack.addEventListener('click', function (e) {
//         console.log(111);
//     });
// }

function back() {
    window.history.back();
}