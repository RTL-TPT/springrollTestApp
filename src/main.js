(function(){

	// Library depencencies
	var Application = include('springroll.Application'),
		Display = include('springroll.easeljs.EaselJSDisplay');

	// Create a new application
	var app = new Application({
		name: "SpringrollPrototype",
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