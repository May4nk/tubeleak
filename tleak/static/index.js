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
})


$(function(){
    $('.vido').on('mouseenter', function(){
         $(this).trigger('play');
    }).on('mouseleave', function(){
        $(this).trigger('pause');
	$(this).attr('currentTime',0);
    });
});


$('.spin').click(function(e){
	$('.flipboxinner').toggleClass('flip');	
	if($('.flipboxinner').hasClass('flip')){
		$('#lbtn').delay(230).hide(0);
		$('#anbtn').delay(230).hide(0);
	}else{
		$('#lbtn').delay(230).show(0);
		$('#anbtn').delay(230).show(0);
	}
})


$('.lspace').on('click',function(){
	$('.flipbox').css('display','block');
})


$('.cross').click(function(){
	$(".flipbox").css('display','none');
})


$('#sbtn').click(function(){
	let sf_name = $('input[name=sf_name]').val();	
	let sl_name = $('input[name=sl_name]').val();
	let susername = $('input[name=susername]').val();	
	let spass = $('input[name=spass]').val();
	let scpass = $('input[name=scpass]').val();	
	$.ajax({
		type: 'POST',
		url: '/signup/',
		headers :{
			'X-CSRFToken':  getcsrfToken(),
		},
		data: {
			sf_name : sf_name,
			sl_name : sl_name,
			susername : susername,
			spass : spass,
			scpass : scpass,
		},
		success: (data) => {
			if(data){
				$('input[name=sf_name]').val(''),	
				$('input[name=sl_name]').val(''),
				$('input[name=susername]').val(''),	
				$('input[name=spass]').val(''),	
				$('input[name=scpass]').val(''),	
				location.reload();
			}
		},

	})	
})


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


$('#lbtn').click(function(){
	let lusername = $('input[name=lusername]').val();	
	let lpass = $('input[name=lpassword]').val();
	$.ajax({
		type: 'POST',
		url: '/login/',
		headers :{
			'X-CSRFToken':  getcsrfToken(),
		},
		data: {
			lusername : lusername,
			lpass : lpass,
		},
		success: (data) => {
			if(data){
				$('input[name=lusername]').val('');
				$('input[name=lpassword]').val('');	
				M.toast({html: 'logged In'});
				setTimeout('location.reload()',300);
			}
		},

	})	
})

$('#pbtn').click(function(){
	let pclips = $('input[name=pclip').val();	
	let ptitle = $('input[name=ptitle]').val();
	let ptags = $('input[name=ptags]').val();
	let pclip = pclips.substring('12')
	alert(pclip)
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
$('#home.tabcontent').css('display','block');
/* ------------------------- Materialize js -------------------------*/

$(document).ready(function(){
	$('.modalx').modal();
	$('.carousel').carousel();
});

document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.sidenav');
    let instances = M.Sidenav.init(elems);
  });
  
