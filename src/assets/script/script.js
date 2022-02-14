import $ from 'jquery'
// import '../autosize/autosize'

var script = document.createElement('script');
script.src = '../jquery/jquery-3.6.0.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

$(document).ready(function(){
    
    // Auto size textarea
    // autosize($('#autoresizing'));
    
    // Textarea change color
    $('#autoresizing').on('click', function(){
        $(this).css('color', '#000');
    });

});

// Task (Checkbox)
// $(document).on('change', ".task-data input", function(event){
// 	event.preventDefault();

// 	var attr = $(this).attr('data');

// 	$(document).find('.wtask p[datas="'+ attr +'"]').toggleClass('action');

//     if($(document).find('.wtask p[datas="'+ attr +'"]').hasClass('action')){
//         $(document).find('.bar-prog[data-collapse="'+ attr +'"]').removeClsass('action');
//         $(document).find('.btn-calendar[target="'+ attr +'"]').addClass('action');
//         $(document).find('.btn-close[target="'+ attr +'"]').removeClass('action');
//     } else {
//         $(document).find('.bar-prog[data-collapse="'+ attr +'"]').addClass('action');
//         $(document).find('.btn-calendar[target="'+ attr +'"]').removeClass('action');
//         $(document).find('.btn-close[target="'+ attr +'"]').addClass('action');
//     }
// });

//Tambah Anggota
$(document).on('click', ".btn-anggota", function(){
    $('.tambah-anggota').addClass('action');
    $('.ctambah-anggota').addClass('action');
});

$(document).on('click', ".tambah-anggota .btn-close", function(){
    $('.tambah-anggota').removeClass('action');
    $('.ctambah-anggota').removeClass('action');
});

$(document).on('click', ".tambah-anggota .screen", function(){
    $('.tambah-anggota').removeClass('action');
    $('.ctambah-anggota').removeClass('action');
});

//Info Target
$(document).on('click', ".btn-info", function(){
    $('.info').addClass('action');
    $('.cinfo').addClass('action');
});

$(document).on('click', ".info .btn-close", function(){
    $('.info').removeClass('action');
    $('.cinfo').removeClass('action');
});

$(document).on('click', ".info .screen", function(){
    $('.info').removeClass('action');
    $('.cinfo').removeClass('action');
});

//Info Goal
$(document).on('click', ".btn-info2", function(){
    $('.info2').addClass('action');
    $('.cinfo2').addClass('action');
});

$(document).on('click', ".info2 .btn-close", function(){
    $('.info2').removeClass('action');
    $('.cinfo2').removeClass('action');
});

$(document).on('click', ".info2 .screen", function(){
    $('.info2').removeClass('action');
    $('.cinfo2').removeClass('action');
});

//Task
$(document).on('click', ".wrap-task p", function(){
    if( !$(this).hasClass('action') ){
        $('.goal[target="' + $(this).attr("datas") + '"]').addClass('action');
        $('.cgoal').addClass('action');

        var attr = $(this).attr('datas');

        $(document).find('.bar-prog[data-collapse="'+ attr +'"]').addClass('action');
    }
});

$(document).on('click', ".goal .btn-close", function(){
    $('.goal').removeClass('action');
    $('.cgoal').removeClass('action');
});

$(document).on('click', ".goal .screen", function(){
    $('.goal').removeClass('action');
    $('.cgoal').removeClass('action');
});

// //Message
// $(document).on('click', ".btn-message", function(){
//     $('.message').addClass('action');
//     $('.cmessage').addClass('action');
// });

// $(document).on('click', ".message .btn-close", function(){
//     $('.message').removeClass('action');
//     $('.cmessage').removeClass('action');
// });

// $(document).on('click', ".message .screen", function(){
//     $('.message').removeClass('action');
//     $('.cmessage').removeClass('action');
// });

// //Kontak
// $(document).on('click', ".btn-kontak", function(){
//     $('.kontak').addClass('action');
//     $('.ckontak').addClass('action');
// });

// $(document).on('click', ".kontak .btn-close", function(){
//     $('.kontak').removeClass('action');
//     $('.ckontak').removeClass('action');

//     document.getElementById("kontak-default").selected = "true";
// });

// $(document).on('click', ".kontak .screen", function(){
//     $('.kontak').removeClass('action');
//     $('.ckontak').removeClass('action');

//     document.getElementById("kontak-default").selected = "true";
// });

// $(document).on('click', ".kontak .btn-batal", function(){
//     $('.kontak').removeClass('action');
//     $('.ckontak').removeClass('action');

//     document.getElementById("kontak-default").selected = "true";
// });

//Btn Goal
$(document).on('click', ".btn-goal", function(){
    var attr = $(this).attr('datas');
    $('#goal-form-input-' + attr).toggleClass('action');
});

//Btn Metrics
$(document).on('click', ".btn-metrics", function(){
    var attr = $(this).attr('datas');
    $('#metrics-form-input-' + attr).toggleClass('action');
});

//Btn Notifikasi
$(document).on('click', ".btn-notif", function(){
    $(this).toggleClass('action');
    $('.notifikasi').toggleClass('action');
    $('.cnotifikasi').toggleClass('action');
    $('.screen-notif').toggleClass('action');
});

//Screen Notifikasi
$(document).on('click', ".screen-notif", function(){
    $('.btn-notif').removeClass('action');
    $('.notifikasi').removeClass('action');
    $('.cnotifikasi').removeClass('action');
    $('.screen-notif').removeClass('action');
});

