var professor = true;
jQuery(function professor($) {
	if (professor) {
		/* Configuration parameters at: https://github.com/noelboss/featherlight/#configuration */
		$('a.professor').show().featherlight({
			namespace: 'janelaProfessor',
			targetAttr: 'href',
			openSpeed: 250,
			closeSpeed: 250,
			closeIcon: '&#10005;',
			loading: '',
		});
			console.log("entrei");
	} else {
		$('.professor').remove();
		$('#professor').remove();
	}
});

var i = 1;
$(function(){
	$('a.professor').each(function (index, value){
		var bt_feather_prof = $(this);
		var conteudo_feather_prof = $(this).next();
		var status_conteudo_feather;
		if(!conteudo_feather_prof.is(':visible') && conteudo_feather_prof.is('.professor')){
			status_conteudo_feather = true;
		}
		if(status_conteudo_feather){
			bt_feather_prof.attr('href','#professor'+i)
			conteudo_feather_prof.attr('id','professor'+i)
			i++;
		}
	});
});

var professorExt = true;
jQuery(function professorExt($) {
	if (professorExt) {
		/* Configuration parameters at: https://github.com/noelboss/featherlight/#configuration */
		$('a.professorExt').show().featherlight({
			namespace: 'janelaProfessorExtensivo',
			targetAttr: 'href',
			openSpeed: 250,
			closeSpeed: 250,
			closeIcon: '&#10005;',
			loading: '',
		});
			console.log("entrei");
	} else {
		$('.professorExt').remove();
	}
});

var i = 1;
$(function(){
	$('a.professorExt').each(function (index, value){
		var bt_feather_prof = $(this);
		var conteudo_feather_prof = $(this).next();
		var status_conteudo_feather;
		if(!conteudo_feather_prof.is(':visible') && conteudo_feather_prof.is('.professorExt')){
			status_conteudo_feather = true;
		}
		if(status_conteudo_feather){
			bt_feather_prof.attr('href','#professor'+i)
			conteudo_feather_prof.attr('id','professor'+i)
			i++;
		}
	});
});

var rank = true;
jQuery(function rank(abrerank) {
	if (rank) {
		/* Configuration parameters at: https://github.com/noelboss/featherlight/#configuration */
		abrerank('a.rank').show().featherlight({
			namespace: 'janelaRank',
			targetAttr: 'href',
			openSpeed: 250,
			closeSpeed: 250,
			closeIcon: '&#10005;',
			loading: '',
		});
	} else {
		$('.rank').remove();
	}
});
var b = 1;
$(function janelaRank(){
	$('a.rank').each(function (index, value){
		var bt_feather_rank = $(this);
		var conteudo_feather_rank = $(this).next();
		var status_conteudo_feather_rank;

		if(!conteudo_feather_rank.is(':visible') && conteudo_feather_rank.is('.rank')){
			status_conteudo_feather_rank = true;
		}
		if(status_conteudo_feather_rank){
			bt_feather_rank.attr('href','#rank'+b)
			conteudo_feather_rank.attr('id','rank'+b)
			b++;
		}
	});
});

var rankExt = true;
jQuery(function rankExt(abrerank) {
	if (rankExt) {
		/* Configuration parameters at: https://github.com/noelboss/featherlight/#configuration */
		abrerank('a.rankExt').show().featherlight({
			namespace: 'janelaRankExtensivo',
			targetAttr: 'href',
			openSpeed: 250,
			closeSpeed: 250,
			closeIcon: '&#10005;',
			loading: '',
		});
	} else {
		$('.rankExt').remove();
	}
});
var c = 0;
$(function janelaRankExt(){
	$('a.rankExt').each(function (index, value){
		var bt_feather_rank = $(this);
		var conteudo_feather_rank = $(this).next();
		var status_conteudo_feather_rank;

		if(!conteudo_feather_rank.is(':visible') && conteudo_feather_rank.is('.rankExt')){
			status_conteudo_feather_rank = true;
		}
		if(status_conteudo_feather_rank){
			bt_feather_rank.attr('href','#rank'+c)
			conteudo_feather_rank.attr('id','rank'+c)
			c++;
		}
	});
});

var colunaFalsa = true;
jQuery(function colunaFalsa($) {
	if (colunaFalsa) {
		/* Configuration parameters at: https://github.com/noelboss/featherlight/#configuration */
		$('a.colunaFalsa').show().featherlight({
			namespace: 'janelacolunaFalsa',
			targetAttr: 'href',
			openSpeed: 250,
			closeSpeed: 250,
			closeIcon: '&#10005;',
			loading: '',
		});
	} else {
		$('.colunaFalsa').remove();
	}
});

var i = 1;
$(function(){
	$('a.colunaFalsa').each(function (index, value){
		var bt_feather_prof = $(this);
		var conteudo_feather_prof = $(this).next();
		var status_conteudo_feather;

		if(!conteudo_feather_prof.is(':visible') && conteudo_feather_prof.is('.colunaF')){
			status_conteudo_feather = true;
		}
		if(status_conteudo_feather){
			bt_feather_prof.attr('href','#colunaF'+i)
			conteudo_feather_prof.attr('id','colunaF'+i)
			i++;
		}
	});
});

var colunaFalsaNote = true;
jQuery(function colunaFalsaNote($) {
	if (colunaFalsaNote) {
		/* Configuration parameters at: https://github.com/noelboss/featherlight/#configuration */
		$('a.colunaFalsaNote').show().featherlight({
			namespace: 'janelacolunaFalsaNote',
			targetAttr: 'href',
			openSpeed: 250,
			closeSpeed: 250,
			closeIcon: '&#10005;',
			loading: '',
		});
	} else {
		$('.colunaFalsaNote').remove();
	}
});

var i = 1;
$(function(){
	$('a.colunaFalsaNote').each(function (index, value){
		var bt_feather_prof = $(this);
		var conteudo_feather_prof = $(this).next();
		var status_conteudo_feather;

		if(!conteudo_feather_prof.is(':visible') && conteudo_feather_prof.is('.colunaF')){
			status_conteudo_feather = true;
		}
		if(status_conteudo_feather){
			bt_feather_prof.attr('href','#colunaF'+i)
			conteudo_feather_prof.attr('id','colunaF'+i)
			i++;
		}
	});
});



