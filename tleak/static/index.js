function getcsrfToken(){
	let cookieValue = null;
	if(document.cookie && document.cookie != ''){
		const cooke = document.cookie.split(';');
		for(let i = 0; i< cooke.length; i++){
			let val = cooke[i].trim();
			if(val.substring(0 , 'csrftoken'.length+1)===('csrftoken' + '=')){
				cookieValue = decodeURIComponent(val.substring('csrftoken'.length+1));
				break;
			}
		}
	}
	return cookieValue;
}


function upload(tag,input){
	let reader = new FileReader();
	reader.onload = function(){
		$(tag).attr('src',reader.result);
	}
	reader.readAsDataURL(input.files[0]);
}

function upload_clip(tag,input){
	let reader = new FileReader();
	reader.readAsArrayBuffer(input.files[0]);
	reader.onload = function(){
		let inp = input.files[0];
		let buffer = reader.result;
		let videoBlob = new Blob([new Uint8Array(buffer)], { type: 'video/mp4' });
		let url = window.URL.createObjectURL(videoBlob);
		$(tag).attr('src',url);
	}
}

$('.icnright').click(function(e){
	$('.sidnav').toggleClass('sienav');		
	$('.mn').toggleClass('nm');
	$('.vido').toggleClass('vido1');
	$('.boxvid').toggleClass('boxvid1');
        $('.vid_time').toggleClass('vid_time1');
        $('.vid_date').toggleClass('vid_date1');
})

$(function(){
    $('.vido').on('mouseenter', function(){
         $(this).trigger('play');
    }).on('mouseleave', function(){
        $(this).trigger('pause');
	$(this).attr('currentTime',0);
    });
});

$('#anbtn').click(function(){
	a = getcsrfToken()
        b= a.substring(10,15)
	$.ajax({
		type: 'POST',
		url: '/ansign/',
		headers :{
			'X-CSRFToken':  getcsrfToken(),
		},
		data: {
			anusername: 'anon' + b 
		},
		success: (data) => {
			if(data){
				location.reload()
			}
		},

	})	
})

$('#pbtn').click(function(e){
        e.preventDefault();
	let pclips = $('input[name=pclip').val();	
	let ptitle = $('input[name=ptitle]').val();
	let ptags = $('input[name=ptags]').val();
	let pclip = pclips.substring('12');
        let fail = false;
        $('form#add_form').find('input').each(function(){
                if( !$(this).prop('required') ) {
                        
                }else{
                        if($(this).val()=='') {
                                fail=true;
                        }
                }
        });

        if(!fail){
                $.ajax({
                        type: 'POST',
                        url: '/clipon/',
                        headers :{
                                'X-CSRFToken':  getcsrfToken(),
                        },
                        data: {
                                pclip : pclip,
                                ptitle : ptitle,
                                ptags : ptags,
                        },
                        success: (data) => {
                                if(data){
                                        $('input[name=pclip]').val('');
                                        $('input[name=ptitle]').val('');	
                                        $('input[name=ptags]').val('');	
                                        M.toast({html: 'Posted'});
                                       setTimeout('location.reload()',300);
                                }
                        },

                })
        }else{
                M.toast({ html:'fill all fields.' });
        }
})

$('.title_icn').click(function(){
        $('.box0').toggle().css('height','40%');
});

$('#uploa').on('change',function(){
	upload_clip('#uplo',this);
})

$('#pix').on('change',function(){
	upload('#profimg',this);
	a = $(this).val();
	ur = a.substring(12);
	$.ajax({
		type:'POST',
		url:'pix/',
		headers:{
			'X-CSRFToken': getcsrfToken(),
		},
		data:{
			img:ur,
		},
		success: (data) => {
			if(data){
				location.reload();
			}
		},
	})
})

$('#cmnt_inp').keyup(function(e){
	value = $(this).val();	
	if(e.keyCode == '13'){
		$.ajax({
			type: 'POST',
			url: 'cmnt/',
			headers: {
     				'X-CSRFToken': getcsrfToken(),
			},
			data: {
				cmnt: value,
			},
			success: (data) => {
				if(data){
					$(this).val('');
					location.reload();
				}
			},

		})	
	}
})

$('.subscribebtn').click(function(e){
	value = $(this).attr('name');	
	$.ajax({
		type: 'POST',
		url: 'subs/',
		headers: {
			'X-CSRFToken': getcsrfToken(),
		},
		data: {
			subs: value,
		},
		success: (data) => {
			if(data){
				location.reload();
			}
		},

	})	
})

$('.subscribedbtn').click(function(e){
	value = $(this).attr('name');	
	$.ajax({
		type: 'POST',
		url: 'unsubs/',
		headers: {
			'X-CSRFToken': getcsrfToken(),
		},
		data: {
			subs: value,
		},
		success: (data) => {
			if(data){
				location.reload();
			}
		},

	})	
})

$('.tabs').click(function(){
	id = $(this).html().trim();
	$('.tabs').removeClass('active');
	$(this).addClass('active');
	$('.tabcontent').css('display','none');
	$(`#${id}.tabcontent`).css('display','block');	
})

$('#default.tabs').addClass('active');
$('#videos.tabcontent').css('display','block');
/* ------------------------- Materialize js -------------------------*/

$(document).ready(function(){
        $('img').each(function(){
                if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0){
                        $(this).attr('src','/static/t.png');
                }
        });

	$('.modalx').modal();
        $('.len').each(function(){
                if($(this).children('.black-text').html().length >= 40){
                        $(this).children('a').html($(this).children('a').html().substring(0,41).concat('....'));
                }
        })
});

document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.sidenav');
    let instances = M.Sidenav.init(elems);
  });

