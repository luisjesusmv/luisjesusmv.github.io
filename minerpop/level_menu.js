var sfx_select;

var level_menu = {

	preload: function() {

		game.load.image('game_menu', 'assets/game_menu.png');
		game.load.image('button_play', 'assets/button_play.png');
		game.load.image('button_erase', 'assets/button_erase.png');
		game.load.image('b_close', 'assets/b_close.png');
		game.load.audio('select', ['assets/select.wav']);
	},

	create: function() {

		game.add.sprite(0, 0, 'game_menu');

		sfx_select = game.add.audio('select');

		var button_play = game.add.sprite(96, 224, 'button_play');
		var button_erase = game.add.sprite(112, 392, 'button_erase');
		var b_close = game.add.sprite(256, 64, 'b_close');

		button_play.inputEnabled = true;
		button_erase.inputEnabled =  true;
		b_close.inputEnabled = true;

		button_play.events.onInputDown.add(function() {

			game.state.start('level_game');
			sfx_select.play();
		});

		button_erase.events.onInputDown.add(function() {

			localStorage.clear();
			game.state.start('level_menu');
			sfx_select.play();
		});

		var t_hiscore = game.add.text(96, 352, '', {font: '16px Sans', fill: '#fff'});

		if (localStorage.getItem('hiscore')) {

			t_hiscore.setText(new String(localStorage.getItem('hiscore')));
		}
		else {

			t_hiscore.setText(new String(0));
		}	

		var ad_options = {

			APP_ID: 'LEGENDARYPIXELGAMES_MinerPop_other',
			TYPE: 'Rectangle',
			REFRESH_RATE: 30
		}	

		var ad_instance = Inneractive.createAd(ad_options);

		ad_instance.placement('center', 'center');
		ad_instance.addTo(document.body);

		b_close.events.onInputDown.add(function() {

			if (ad_instance) {

				ad_instance.remove();	
				ad_instance = null;
				b_close.destroy();
			}
		});
	}
}