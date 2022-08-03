$(function(){
    function sectionLight(){
        $('.section').css('border', 'solid 2px black')
    }

    function sectionDark(){
        let i = 0
        while(i<18){
            $('.section.dark-theme').eq(i).css('border', 'solid 2px var(--sec'+i+')');
            i++;
        }
    }

    $(function(){
        sectionDark();

        // $(window).scrollTop(900);
        var i = 0;
        while (i<19){
            $('.section').eq(i).css('box-shadow', '5px 5px var(--sec'+i+'), 5px 5px 0 2px black');
            i++;
        }
    })

    // $(function(){
    //     var userAgent = window.navigator.userAgent.toLowerCase();
        
    //     if(userAgent.indexOf('android'))
    // })

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
        $('.new-btn').find('a').attr('href', '/sectionnew/'+section_num);
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
        $('.active').find('.card-meaning, .card-pron').show();
    }
    var tm = 8000;
    var id = setTimeout(fn,tm);

    remembered_words = 0
    done_words = 0
    var total = $('.card-wrap').length -1;

    $('.this-ar').text('0/'+total)

    $('.show-btn').click(function(){
        $(this).parents('.card-wrap').find('.card-meaning, .card-pron').css('display', 'block');
        clearTimeout(id);
    });


    $('.answer-btn').click(function(){
        clearTimeout(id);
        var learning = $(this).val();
        $(this).parents('.answer').find('.learning').val(learning);
        var $displaycard = $('.active');
        $displaycard.removeClass('active');
        $displaycard.next().addClass('active');
        id = setTimeout(fn, tm );
        done_words++;
        $('#indicater').attr('style', 'width:'+done_words/total*100+'%').text(done_words);
        if ($('.last-card').is(':visible')){
            var section = $('#section-num').val()
            $.ajax({
                url:'/section/result'+section,
                type:'POST',
            })
            .done(function(data){
                $('#result-bar').attr('style', 'width:'+data['answer_rate']+'%').text(data['answer_rate']+'%')
                $('#result-bar2').attr('style', 'width:'+data['answered']+'%').text(data['answered']+'%')
                $('#result-bar').addClass('visible');
                $('#result-bar2').addClass('visible');

            })
            .fail(function(){
                $('#result-bar').text('no');
            })
        }
    
    });

    $('.btn1').click(function(){
        remembered_words++;
        // $('#result-bar2').attr('style', 'width:'+remembered_words/total*100+'%').text(remembered_words+'/'+total)
        $('.this-ar').text(remembered_words+'/'+total)
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
            sectionDark();
        }else{
            $.removeCookie("dark-mode");
            $('.dark-theme').addClass('light-theme');
            $('.dark-theme').removeClass('dark-theme');
            sectionLight()
        };
        
    });

}); 