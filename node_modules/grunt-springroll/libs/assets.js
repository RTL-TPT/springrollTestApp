module.exports = function(grunt, config, assets)
{
	// Import libs
	var _ = require('lodash');

	// The list of tasks to run for aliases
	var debugTasks = [];
	var releaseTasks = [];

	// If we don't have assets, remove from the tasks
	// this is determined by build-file.js
	if (assets)
	{
		config.clean.assets = [];
		config.watch.assets = {
			files: [],
			tasks: ['assets-debug']
		};
		config.uglify.assets = {
			files: {}
		};

		// Loop through all the build assets
		_.each(assets, function(files, key){
			var dest = '<%= jsFolder %>/' + key + '.js';
			var src = '<%= build.assets.' + key + ' %>';
			config.uglify.assets.files[dest] = src;
			config.watch.assets.files.push(src);
			config.clean.assets.push(dest + '.map', dest);
			config.concat[key] = {
				dest: dest,
				src: [src]
			};

			// Debug tasks
			debugTasks.push('newer:concat:' + key);
		});

		// Release tasks
		releaseTasks.push('clean:assets', 'uglify:assets');
	}

	grunt.registerTask(
		'assets-debug',
		'Combine, map all asset JS files uncompressed', 
		debugTasks
	);

	grunt.registerTask(
		'assets',
		'Minify all asset JS files uncompressed', 
		releaseTasks
	);
};