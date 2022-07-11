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

    function prg(done_words, total){
        $('#bar2').attr('style', 'width:'+done_words/total*100+'%').text(done_words);
    }    


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
        $('#bar2').attr('style', 'width:'+done_words/total*100+'%').text(done_words);
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
            $.ajax({
                url:'/section1/result',
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
            url:'/section1/up',
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
        $('.start-modal, .cover').show();
        $('.cover').show();
        var section_num = $(this).val();
        $('.start').attr('href', '/section/'+section_num);
    })

    $('.start').click(function(){
        $('#start-section').submit();
    })

    $('.cover, .start-back').click(function(){
        $('.start-modal, .cover').hide();
    })

    $('#progressbar').progressbar({
        value:50
    });

}); 