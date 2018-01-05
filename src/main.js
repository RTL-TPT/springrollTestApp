(function(){

	// Library depencencies
	var Application = include('springroll.Application'),
		Display = include('springroll.pixi.PixiDisplay');

	// Create a new application
	var app = new Application({
		name: "PIXISandbox",
		canvasId: "stage",
		display: Display,
		displayOptions:	{
			clearView: true,
		}
	});

	// Handle when app is ready to use
	app.on('init', function()
	{
		// Start application
	});

	// Assign to the window for easy access
	window.app = app;
	
}());