
var terminal_text_ident = '&gt; ';
var terminal_text_title = '' +
	'KVALI UNDERRUN\n' +
	'__ \n' +
	'იდეა, გრაფიკა და პროგრამირება:\n' +
	'Sandro Kvaliashvili // WWW.KVALI.DEV\n' +
	'___ \n' +
	'სისტემის ვერსია: 20.08.29\n' +
	'CPU: SU(N) S-KVALI 7240 @ 12.6 THZ\n' +
	'MEMORY: 108086391056891900 BYTES\n' +
	' \n' +
	'ვუკავშირდები...';

var terminal_text_garbage = 
	'´A1e{∏éI9·NQ≥ÀΩ¸94CîyîR›kÈ¡˙ßT-;ûÅf^˛,¬›A∫Sã€«ÕÕ' +
	'1f@çX8ÎRjßf•ò√ã0êÃcÄ]Î≤moDÇ’ñ‰\\ˇ≠n=(s7É;';

var terminal_text_story = 
	'რიცხვი: თებ. 29, 2720 - 23:32\n' +
	'სისტემის კრიტიკული შეფერხება მოხდა\n' +
	'ვაანალიზებ...\n' +
	'____\n \n' +
	'ERROR CODE: JS29K2008\n' +
	'სისტემის სტატუსი: არ არის ხაზზე\n' +
	'აღწერა: ხდება ბუფერაცია SATCOM R.U.D.-ის გამო\n' +
	'რა მოუვიდა სისტემას: ცდილობს ჩართოს FACILITY AUTOMATION\n' +
	'რა მოუვიდა ქვე სისტემას: დაზიანდა AI, RADIATION SHIELDS, POWER MANAGEMENT\n' +
	' \n' +
	'ვცდილობ ჩავრთო აღდგენითი სისტემა...\n' +
	'___' +
	'მოქმედება ვერ მოხერხდა\n \n' +
	'ვცდილობ გადავტვირთო სისტემა...\n' +
	'___' +
	'მოქმედება ვერ მოხერხდა\n' +
	'_ \n \n' +
	'კარგი, ჩვენით უნდა გადავტვირთოთ სერვერი\n' +
	'_ \n' +
  	'უნდა წახვიდე და სერვერები ჩართო (სერვერებთან ახლოს მისვლით სერვერი ჩაირთვება)\n' +
	'_ \n' +
	'გამოიყენე WASD ან ისრებიანი ღილაკები მოძრაობისთვის, მაუსით ისროლე\n' +
	'დააჭირე "აქ" რომ გადავიტვირთო\n ';

var terminal_text_outro = 
	'ყველა სატელიტი ხაზზეა...\n' +
	'ვუკავშირდები...___' +
	'კავშირი წარმატებით დამყარდა\n' +
	'ვიღებ შეტყობინებას...___ \n' +
	
	'გამოგზავნილია: თებ. 29, 2008\n' +
	'მიღებულია: თებ. 29, 2721\n \n' +
	
	'მადლობა რომ ითამაშე! ❤_ \n' +
	
	'შემდეგში შეგხვდები!\n' +

	'Kvali__' +
	'გადაცემის დასასრული';

var terminal_text_buffer = [],
	terminal_state = 0,
	terminal_current_line,
	terminal_line_wait = 100,
	terminal_print_ident = true,
	terminal_timeout_id = 0,
	terminal_hide_timeout = 0;

terminal_text_garbage += terminal_text_garbage + terminal_text_garbage;

function terminal_show() {
	clearTimeout(terminal_hide_timeout);
	a.style.opacity = 1;
	a.style.display = 'block';
}

function terminal_hide() {
	a.style.opacity = 0;
	terminal_hide_timeout = setTimeout(function(){a.style.display = 'none'}, 1000);
}

function terminal_cancel() {
	clearTimeout(terminal_timeout_id);
}

function terminal_prepare_text(text) {
	return text.replace(/_/g, '\n'.repeat(10)).split('\n');
}

function terminal_write_text(lines, callback) {
	if (lines.length) {
		terminal_write_line(lines.shift(), terminal_write_text.bind(this, lines, callback));
	}
	else {
		callback && callback();
	}
}

function terminal_write_line(line, callback) {
	if (terminal_text_buffer.length > 20) {
		terminal_text_buffer.shift();
	}
	if (line) {
		audio_play(audio_sfx_terminal);
		terminal_text_buffer.push((terminal_print_ident ? terminal_text_ident : '') + line);
		a.innerHTML = '<div>'+terminal_text_buffer.join('&nbsp;</div><div>')+'<b>█</b></div>';
	}
	terminal_timeout_id = setTimeout(callback, terminal_line_wait);
}

function terminal_show_notice(notice, callback) {
	a.innerHTML = '';
	terminal_text_buffer = [];

	terminal_cancel();
	terminal_show();
	terminal_write_text(terminal_prepare_text(notice), function(){
		terminal_timeout_id = setTimeout(function(){
			terminal_hide();
			callback && callback();
		}, 2000);
	});
}

function terminal_run_intro(callback) {
	terminal_text_buffer = [];
	terminal_write_text(terminal_prepare_text(terminal_text_title), function(){
		terminal_timeout_id = setTimeout(function(){
			terminal_run_garbage(callback);
		}, 4000);
	});
}

function terminal_run_garbage(callback) {
	terminal_print_ident = false;
	terminal_line_wait = 16;

	var t = terminal_text_garbage,
		length = terminal_text_garbage.length;

	for (var i = 0; i < 64; i++) {
		var s = (_math.random()*length)|0;
		var e = (_math.random()*(length - s))|0;
		t += terminal_text_garbage.substr(s, e) + '\n';
	}
	t += ' \n \n';
	terminal_write_text(terminal_prepare_text(t), function(){
		terminal_timeout_id = setTimeout(function(){
			terminal_run_story(callback);
		}, 1500);
	});
}

function terminal_run_story(callback) {
	terminal_print_ident = true;
	terminal_line_wait = 100;
	terminal_write_text(terminal_prepare_text(terminal_text_story), callback);
}

function terminal_run_outro(callback) {
	c.style.opacity = 0.3;
	a.innerHTML = '';
	terminal_text_buffer = [];

	terminal_cancel();
	terminal_show();
	terminal_write_text(terminal_prepare_text(terminal_text_outro));
}
