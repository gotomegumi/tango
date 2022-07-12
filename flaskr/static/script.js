$(function(){
    // $('#line').first().attr('id',  'line1')
   
    // var bar = new ProgressBar.Line(line1, {
    //     strokeWidth: 6,
    //     duration: 6000,
    //     color: '#FFEA82',
    //     trailColor: '#eee',
    //     trailWidth: 1,
    //     svgStyle: null
    // });
      
    // bar.animate(1.0); 

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



    $('.answer-btn').click(function(){
        clearTimeout(id);
        var learning = $(this).val();
        $(this).parents('.answer').find('.learning').val(learning);
        var $displaycard = $('.active');
        // $displaycard.find('#line1').attr('id', ' ');
        $displaycard.removeClass('active');
        $displaycard.next().addClass('active');
        id = setTimeout(fn, tm );
        // $('#line').first().attr('id', 'line1')
        done_words++;
        $('#indicater').attr('style', 'width:'+done_words/total*100+'%').text(done_words);
        // var bar = new ProgressBar.Line(line1, {
        //     strokeWidth: 6,
        //     duration: 6000,
        //     color: '#FFEA82',
        //     trailColor: '#eee',
        //     trailWidth: 1,
        //     svgStyle: null
        // });
          
        // bar.animate(1.0); 
        if ($('.last-card').is(':visible')){
            var section = $('#section-num').val()
            $.ajax({
                url:'/section/result'+section,
                type:'GET',
            })
            .done(function(data){
                $('#result').text(data);
                $('#result-bar').attr('style', 'width:'+data+'%').text(data+'%')
                $('.bar').addClass('visible');

            })
            .fail(function(){
                $('#result').text('Something went wrong...');
            })
        }
    
    });


    
    // function prg(done_words, total){
    //     $('#bar2').attr('style', 'width:'+done_words/total*100+'%').text(done_words);
    // }    


    $('.btn1').click(function(){
        remembered_words++;
        $('#result-bar2').attr('style', 'width:'+remembered_words/total*100+'%').text(remembered_words+'/'+total)
    })

    // $('.btn3').click(function(){
    //     $(this).parents('.card-wrap').next().css('background-color', 'rgb(255, 217, 242)');
    // })

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

    $('.show-btn').click(function(){
        $(this).parents('.card-wrap').find('.card-meaning').css('display', 'block');
        clearTimeout(id);
    });

    $('.lg2').click(function(){
        window.location.reload(false);
    })

    $('.section').click(function(){
        var prg = $(this).find('.section-bars').find('.prg-percent').html();
        var ar = $(this).find('.section-bars').find('.ar-percent').html();
        $('.prg-bar4').attr('style', "width:"+prg).html(prg);
        $('#prg-text').html(prg);
        $('.ar-bar4').attr('style', 'width:'+ar).html(ar);
        $('#ar-text').html(ar);

        $('.start-menu').show();
        $('.home').hide();
        if (prg == '100%'){
            $('.st1-2').text('CONGLATULTION!');
            $('.st1-2').css('color', 'blue');

        };
        var section_num = $(this).val();
        $('.start-btn').find('a').attr('href', '/section/'+section_num);        
        $('.mistake-btn').find('a').attr('href', '/section/mistake/'+section_num);
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

    $('#btn-mode').change(function(){
        if($('#btn-mode').is(':checked')){
            $('.light-theme').addClass('dark-theme');
            $('.light-theme').removeClass('light-theme');
        }else{
            $('.dark-theme').addClass('light-theme');
            $('.dark-theme').removeClass('dark-theme');
        };
        
    });

}); 