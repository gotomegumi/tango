$(function(){
    $('.section').click(function(){
        var prg = $(this).find('.section-bars').find('.prg-percent').html();
        var ar = $(this).find('.section-bars').find('.ar-percent').html();
        $('.prg-bar4').attr('style', "width:"+prg);
        $('.st1-2').html(prg);
        $('.ar-bar4').attr('style', 'width:'+ar);
        $('.st2-2').html(ar);

        $('.start-menu').fadeIn();
        $('.home').hide();
        if (prg == '100%'){
            $('.st1-3').text('CONGLAT!');
            $('.st1-3').css('color', 'rgb(67, 136, 255)');
        };
        if (ar == '100%'){
            $('.st1-3').text('CONGLAT!');
            $('.st1-3').css('color', 'rgb(67, 136, 255)');
        };
        var section_num = $(this).val();
        $('.start-btn').find('a').attr('href', '/section/'+section_num);        
        $('.mistake-btn').find('a').attr('href', '/sectionmistake/'+section_num);
        $('.section-num').text('Section'+section_num)
    })

    $('#status2, #status1').click(function(){
        var section=$(this).val()
        $('.section.'+section).trigger('click')
    })

    $('.start-hide').click(function(){
        $('.start-menu').hide();
        $('.home').show();
    })


    // shuffle cards
    function shuffleContent(container) {
        var content = container.find("> *");
        var total = content.length - 1;
        content.each(function() {
            content.eq(Math.floor(Math.random() * total)).prependTo(container);
        });
    }
    $(function() {
        shuffleContent($(".item_wrapper"));
        // var total = $('.card-wrap').length - 2;
        // $('.card-wrap').eq(total).find('.answer').find('.answer-btn').addClass('last-btn');
        $('.card-wrap').eq(0).addClass('active');
    });

    var fn = function(){
        $('.active').find('.card-meaning').show();
    }
    var tm = 8000;
    var id = setTimeout(fn,tm);

    remembered_words = 0
    done_words = 0
    var total = $('.card-wrap').length -1;

    $('#result-bar2').text('0/'+total)

    $('.show-btn').click(function(){
        $(this).parents('.card-wrap').find('.card-meaning').css('display', 'block');
        clearTimeout(id);
    });


    $('.answer-btn').click(function(){
        clearTimeout(id);
        var learning = $(this).val();
        $(this).parents('.answer').find('.learning').val(learning);
        var $displaycard = $('.active');
        // $displaycard.find('#line1').attr('id', ' ');
        $displaycard.removeClass('active');
        $displaycard.next().addClass('active');
        id = setTimeout(fn, tm );
        done_words++;
        $('#indicater').attr('style', 'width:'+done_words/total*100+'%').text(done_words);
        if ($('.last-card').is(':visible')){
            var section = $('#section-num').val()
            $.ajax({
                url:'/section/result'+section,
                type:'GET'
            })
            .done(function(data){
                $('#result').text(data);
                $('#result-bar').attr('style', 'width:'+data+'%').text(data+'%')
                $('#result-bar2').addClass('visible');
                $('#result-bar').addClass('visible');
            })
            .fail(function(){
                $('#result').text('no');
            })
        }
    
    });

    $('.btn1').click(function(){
        remembered_words++;
        $('#result-bar2').attr('style', 'width:'+remembered_words/total*100+'%').text(remembered_words+'/'+total)
    })

    $('.answer').submit(function(e){
        e.preventDefault();
        $.ajax({
            url:'/section/up',
            type:'POST',
            data:{
                id:$(this).find('.id').val(),
                learning:$(this).find('.learning').val()
            }
        });
    }); 


    $('.lg2').click(function(){
        window.location.reload(false);
    })


    $('.start').click(function(){
        $('#start-section').submit();
    })

    $('.cover, .start-back').click(function(){
        $('.start-modal, .cover').hide();
        $('.home').show();
    })

    $('#progressbar').progressbar({
        value:50
    });

    var dark = $.cookie('dark-mode');
    if(dark){
        $('.light-theme').addClass('dark-theme');
        $('.light-theme').removeClass('light-theme');
        $('#btn-mode').prop('checked', true);
    }
    $('#btn-mode').change(function(){
        if($('#btn-mode').is(':checked')){
            $.cookie("dark-mode", 1);
            $('.light-theme').addClass('dark-theme');
            $('.light-theme').removeClass('light-theme');
        }else{
            $.removeCookie("dark-mode");
            $('.dark-theme').addClass('light-theme');
            $('.dark-theme').removeClass('dark-theme');
        };
        
    });

}); 