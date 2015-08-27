
var next_element_1 = null;
var next_element_2 = null;
var c_element_1 = null;
var c_element_2 = null;
var c_elements_on = false;
var last_step_time = 0;
var element_list = new Array();
var elements_to_clear = new Array();
var c_scene = 'game_scene';
var score = 0;
var t_score;
var level = 0;
var t_level;
var last_level_time = 0;
var sfx_pop;
var sfx_crash;
var game_end = false;

var level_game = {

	preload: function() {

		game.load.image('game_background', 'assets/game_background.png');
		game.load.image('your_score', 'assets/your_score.png');
		game.load.image('b_menu', 'assets/b_menu.png');
		game.load.spritesheet('elements', 'assets/elements.png', 32, 32);
		game.load.spritesheet('buttons', 'assets/buttons.png', 64, 64);
		game.load.spritesheet('shine', 'assets/shine.png', 32, 32);
		game.load.spritesheet('new_hiscore', 'assets/new_hiscore.png', 192, 32);
		game.load.audio('pop', ['assets/pop.wav']);
		game.load.audio('crash', ['assets/crash.wav']);
	}, 

	create: function() {

		game.add.sprite(0, 0, 'game_background');

		sfx_pop = game.add.audio('pop');
		sfx_crash = game.add.audio('crash');

		var b_left = game.add.sprite(16, game.height - 96, 'buttons', 0);
		var b_right = game.add.sprite(88, game.height - 96, 'buttons', 2);
		var b_down = game.add.sprite(168, game.height - 96, 'buttons', 4);
		var b_spin = game.add.sprite(240, game.height - 96, 'buttons', 6);
		var b_menu = game.add.sprite(240, 304, 'b_menu');

		b_left.inputEnabled = true;
		b_right.inputEnabled = true;
		b_down.inputEnabled = true;
		b_spin.inputEnabled = true;
		b_menu.inputEnabled = true;

		b_left.events.onInputDown.add(function() {
			
			if (c_elements_on && !check_elements_left(c_element_1) && !check_elements_left(c_element_2)) {

				if (c_element_1.x > 32 && c_element_2.x > 32) {
					c_element_1.x -= 32;
					c_element_2.x -= 32;
				}
			}

			b_left.frame = 1;
			sfx_select.play();									
			
		}, this);

		b_right.events.onInputDown.add(function() {

			if (c_elements_on && !check_elements_right(c_element_1) && !check_elements_right(c_element_2)) {

				if (c_element_1.x < 184 && c_element_2.x < 184) {

					c_element_1.x += 32;
					c_element_2.x += 32;
				}
			}

			b_right.frame = 3;
			sfx_select.play();
									
		}, this);

		b_down.events.onInputDown.add(function() {

			last_step_time = 1000;

			b_down.frame = 5;
			sfx_select.play();
			
		}, this);

		b_spin.events.onInputDown.add(function() {
			
			if (c_elements_on) {

				//Rotate to down 
				if (c_element_2.y == c_element_1.y && c_element_2.x == c_element_1.x + 32 && c_element_1.y < 320 
					&& !check_elements_down(c_element_1)) {

					c_element_2.x -= 32;
					c_element_2.y += 32;
				}
				//Rotate to left
				else if (c_element_2.y == c_element_1.y + 32 && c_element_2.x == c_element_1.x && c_element_1.x > 24
					&& !check_elements_left(c_element_1)) {
					
					c_element_2.x -= 32;
					c_element_2.y -= 32;
				}
				//Try rotate to left
				else if (c_element_2.y == c_element_1.y + 32 && c_element_2.x == c_element_1.x
					&& (check_elements_left(c_element_1) || c_element_1.x == 24) && !check_elements_right(c_element_1)) {
					
					c_element_1.x += 32;
					c_element_2.y -= 32;
				}
				//Rotate to up
				else if (c_element_2.y == c_element_1.y && c_element_2.x == c_element_1.x - 32 && c_element_1.y > 32) {
					c_element_2.x += 32;
					c_element_2.y -= 32;
				}
				//Rotate to right
				else if (c_element_2.y == c_element_1.y - 32 && c_element_2.x == c_element_1.x && c_element_1.x < 184
					&& !check_elements_right(c_element_1)) {
														
					c_element_2.x += 32;
					c_element_2.y += 32;
				}
				//Try rotate to right
				else if (c_element_2.y == c_element_1.y - 32 && c_element_2.x == c_element_1.x
					&& (check_elements_right(c_element_1) || c_element_1.x == 184) && !check_elements_left(c_element_1)) {
														
					c_element_1.x -= 32;
					c_element_2.y += 32;
				}
			}

			b_spin.frame = 7;
			sfx_select.play();
			
		}, this);

		b_menu.events.onInputDown.add(function() {

			game.state.start('level_menu');
			sfx_select.play();
		}, this);

		game.input.onUp.add(function() { 
			b_left.frame = 0;
			b_right.frame = 2;
			b_down.frame = 4;
			b_spin.frame = 6;
		});

		c_element_1 = game.add.sprite(game.rnd.integerInRange(0, 5) * 32 + 24, 32, 'elements', game.rnd.integerInRange(0, 5));
		c_element_2 = game.add.sprite(c_element_1.x + 32, 32, 'elements', game.rnd.integerInRange(0, 5));

		next_element_1 = game.add.sprite(240, 64, 'elements', game.rnd.integerInRange(0, 5));
		next_element_2 = game.add.sprite(272, 64, 'elements', game.rnd.integerInRange(0, 5));

		c_elements_on = true;

		score = 0;
		level = 0;
		last_step_time = 0;
		last_level_time = 0;
		element_list.length = 0;
		elements_to_clear.length = 0;
		game_end = false;

		t_score = game.add.text(248, 168, new String(score), {font: '16px Sans', fill: '#fff'});
		t_level = game.add.text(248, 264, new String(score), {font: '16px Sans', fill: '#fff'});
	},

	update: function() {

		if (game_end) {

			return;
		}

		if (c_elements_on && !check_elements_down(c_element_1) && !check_elements_down(c_element_2) && c_element_1.y < 320 && c_element_2.y < 320 
			&& last_step_time >= (1000 - (level * 50))) {

			c_element_1.y += 32;
			c_element_2.y += 32;

			last_step_time = 0;
		}
		else if (c_elements_on) {

			last_step_time += game.time.elapsed;
		}

		if (last_level_time >= 30000) {
			
			level++;
			last_level_time = 0;
		}
		else {

			last_level_time += game.time.elapsed;
		}

		if (c_elements_on && (c_element_1.y == 320 || c_element_2.y == 320 || check_elements_down(c_element_1) || check_elements_down(c_element_2))
			&& last_step_time >= (1000 -(level * 50))) {

			if (c_element_1.y == 32 || c_element_2.y == 32) {

				var is_newhiscore = false;

				if (localStorage.getItem('hiscore')) {

					if (score > localStorage.getItem('hiscore')) {

						localStorage.setItem('hiscore', score);
						is_newhiscore = true;						
					}

				}
				else if (score > 0) {

					localStorage.setItem('hiscore', score);
					is_newhiscore = true;
				}	

				var your_score = game.add.sprite(80, 176, 'your_score');
				var t_your_score = game.add.text(112, 224, new String(score), {font: '16px Sans', fill: '#f00'});

				if (is_newhiscore) {

					var new_hiscore = game.add.sprite(64, 288, 'new_hiscore');

					new_hiscore.animations.add('fade', [0, 1, 2, 1, 0], 5, true);
					new_hiscore.animations.play('fade');

				}				

				your_score.inputEnabled = true;

				your_score.events.onInputDown.add(function() {

					game.state.start('level_menu');
				});

				game_end = true;
			}
			else {

				element_list[element_list.length] = c_element_1;
				element_list[element_list.length] = c_element_2;

				c_element_1 = game.add.sprite(game.rnd.integerInRange(0, 5) * 32 + 24, 32, 'elements', next_element_1.frame);
				c_element_2 = game.add.sprite(c_element_1.x + 32, 32, 'elements', next_element_2.frame);

				next_element_1.frame = game.rnd.integerInRange(0, 5);
				next_element_2.frame = game.rnd.integerInRange(0, 5);
			}	

			sfx_pop.play();
			
			c_elements_on = false;
			last_step_time = 0;
		}

		if (!c_elements_on) {

			if (!clean_group()) {

				var kill_elements = false;

				for (var i = 0; i < element_list.length; i++) {

					elements_to_clear.length = 0;

					elements_to_clear[0] = i;

					clear_similar_elements(element_list[i]);

					if (elements_to_clear.length >= 4) {

						kill_elements = true;
						break;
					}
				};

				if (kill_elements) {

					for (var i = 0; i < elements_to_clear.length; i++) {
						
						var shine = game.add.sprite(element_list[elements_to_clear[i]].x, element_list[elements_to_clear[i]].y, 'shine');

						shine.animations.add('die', [0, 1, 2, 3], 10);
						shine.animations.play('die');

						sfx_crash.play();

						element_list[elements_to_clear[i]].destroy();	
						element_list[elements_to_clear[i]] = null;
						score += 100;
					};

					var tmp_list = new Array();

					for (var i = 0; i < element_list.length; i++) {
						
						if (element_list[i] != null) {

							tmp_list[tmp_list.length] = element_list[i];
						}
					};

					element_list = tmp_list;
				}
				else {

					c_elements_on = true;
				}
			}
		}

		t_score.setText(new String(score));
		t_level.setText(new String(level));
	}
}

function check_elements_down(c_element) {

	var element_down = false;

	for (var i = 0; i < element_list.length; i++) {

		if (c_element.y + 32 == element_list[i].y && c_element.x == element_list[i].x) {

			element_down = true;	
			break;			
		}
	};

	return element_down;
}

function check_elements_right(c_element) {
	
	var element_right = false;

	for (var i = 0; i < element_list.length; i++) {
		
		if (c_element.x + 32 == element_list[i].x && c_element.y == element_list[i].y) {
			
			element_right = true;
			break;
		}
	};

	return element_right;
}

function check_elements_left(c_element) {
	
	var element_left = false;

	for (var i = 0; i < element_list.length; i++) {

		if (c_element.x - 32 == element_list[i].x && c_element.y == element_list[i].y) {

			element_left = true;
			break;
		}
	};

	return element_left;
}


function clear_similar_elements(c_element) {

	for (var i = 0; i < element_list.length; i++) {

		//check left
		if (c_element.x - 32 == element_list[i].x && c_element.y == element_list[i].y && c_element.frame == element_list[i].frame
			&& !is_in_clist(element_list[i])) {

			elements_to_clear[elements_to_clear.length] = i;
			clear_similar_elements(element_list[i]);
		}

		//check right
		if (c_element.x + 32 == element_list[i].x && c_element.y == element_list[i].y && c_element.frame == element_list[i].frame
			&& !is_in_clist(element_list[i])) {

			elements_to_clear[elements_to_clear.length] = i;
			clear_similar_elements(element_list[i]);
		}

		//check up
		if (c_element.x == element_list[i].x && c_element.y - 32 == element_list[i].y && c_element.frame == element_list[i].frame
			&& !is_in_clist(element_list[i])) {
			
			elements_to_clear[elements_to_clear.length] = i;
			clear_similar_elements(element_list[i]);
		}

		//check down
		if (c_element.x == element_list[i].x && element_list[i].y + 32 == element_list[i].y && element_list[i].frame == element_list[i].frame
			&& !is_in_clist(element_list[i])) {
			
			elements_to_clear[elements_to_clear.length] = i;
			clear_similar_elements(element_list[i]);
		}
	}
}

function is_in_clist(c_element) {

	var in_list = false;

	for (var i = 0; i < elements_to_clear.length; i++) {
		
		if (c_element.x == element_list[elements_to_clear[i]].x && c_element.y == element_list[elements_to_clear[i]].y 
			&& c_element.frame == element_list[elements_to_clear[i]].frame) {

			in_list = true;
			break;
		}
	};

	return in_list;
}

function clean_group() {

	var elements_cleaned = false;

	for (var i = 0; i < element_list.length; i++) {
		
		if (!check_elements_down(element_list[i]) && element_list[i].y < 320) {
			
			element_list[i].y += 32;
			elements_cleaned = true;
		}
	};

	return elements_cleaned;
}