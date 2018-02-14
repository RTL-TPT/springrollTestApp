(function(){

	// Library depencencies
	var Application = include('springroll.Application'),
		Texture = include('PIXI.Texture'),
		PixiDisplay = include('springroll.pixi.PixiDisplay'),
		PixiButton = include('springroll.pixi.Button');

	// Create a new application
	var app = new Application({
		name: "pixispring",
		debug: true,
		preload: [
			{
				id: "PixiAssets",
				image: 'assets/images/button.png',
				atlas: 'assets/images/button.json',
				type: 'pixi'
			},
			{
				id: 'Button',
				src: 'assets/images/button.png'
			}
		]
	});

	// Handle when app is ready to use
	app.on('init', function()
	{
		this.initPixi();
	});
	
	
	app.initPixi = function()
	{
		var display = this.addDisplay("stage", PixiDisplay, {
			clearView: true,
			width: 1047,
			backgroundColor: 0xccddff
		});
	
		// Setup the toggle button
		var texture = this.getCache('PixiAssets');
		var button = new PixiButton(
			{
				up : texture.getFrame('button_up'),
				over : texture.getFrame('button_over'),
				down : texture.getFrame('button_down'),
				disabled : texture.getFrame('button_disabled')
			},
			{
				text : 'button',
				style : {
					font : '20px Arial',
					fill : "#ffffff"
				}
			}
		);

		button.position.x = (display.width - button.width) / 2;
		button.position.y = (display.height - button.height) / 2;
		button.on('buttonPress', this.toggleDisplay.bind(this, false));

		display.stage.addChild(button);
	};
	
	app.toggleDisplay = function(showPixi)
	{
		pixi.enabled = showPixi;
		pixi.visible = showPixi;
	};
	
}());