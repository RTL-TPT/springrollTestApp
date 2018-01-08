module.exports = function(grunt, settings, undefined)
{
	// The root plugin directory
	var _ = require('lodash'),
		path = require('path'),
		loader = require('load-grunt-config'),
		base = path.dirname(__dirname);
	
	// Get the settings and options
	settings = settings || {};
	options = settings.options || {};

	// Get the user options but ignore options
	userData = _.cloneDeep(settings);
	delete userData.options;

	// Path to the main library-grunt folder
	var pluginFolder = path.dirname(__dirname);

	// Get the components folder if it's custom
	var components = 'bower_components';
	if (grunt.file.exists('.bowerrc'))
	{
		components = grunt.file.readJSON('.bowerrc').directory || components;
	}

	// We need to load the local grunt plugins
	var projectDir = process.cwd();
	process.chdir(pluginFolder);

	// The build file which contains all the list of files to build
	var build = require(path.join(__dirname, 'springroll-json.js'))(grunt, { 
		cwd: projectDir, 
		buildFile : options.buildFile 
	});

	// The data arguments
	var data = _.extend(userData, {

			// The name of the library from the build file
			build: build,

			// The deploy folder is the content that actually is for distribution
			distFolder: options.distFolder || 'deploy',

			// The path to the components folder
			components: components,

			// The output folders
			jsFolder: options.jsFolder || '<%= distFolder %>/assets/js',
			cssFolder: options.cssFolder || '<%= distFolder %>/assets/css',
			
			// Configuration properties
			configFolder: options.configFolder || '<%= distFolder %>/assets/config',
			configFile: options.configFile || '<%= configFolder %>/config.json',

			// Save the current working directory
			cwd: projectDir
		}
	);

	// Separate grunt config files
	var baseConfig = loader(grunt, {
		
		// Path to tasks
		configPath: path.join(pluginFolder, 'tasks'),

		// project specific overrides
		overridePath: path.join(projectDir, 'tasks/overrides'),

		// auto grunt.initConfig()
		init: false,

		// Load the grunt tasks
		loadGruntTasks : { pattern: [
			'grunt-*',
			'!grunt-springroll'
		]},

		// Data based into config
		data: data
	});
	process.chdir(projectDir);

	// Project-specific config
	var projectConfig = loader(grunt, {

		// The path for the tasks
		configPath: path.join(projectDir, 'tasks'),

		// Get the config, don't run
		init: false, 

		// We don't want to reload builder
		loadGruntTasks: { pattern: [
			'grunt-*',
			'!grunt-springroll'
		]}
	});

	// Merge the configs
	var config = _.extend(baseConfig, projectConfig);

	// Add the assets
	require(path.join(__dirname, 'assets.js'))(grunt, config, build.assets);

	// If we have files to copy, add the copy tasks
	if (grunt.config.get('hasCopy'))
	{
		config.copy = _.extend({}, config.copy, build.librariesCopy);
	}

	// If we should called initConfig right away
	var autoInit = !_.isUndefined(options.autoInit) ? !!options.autoInit : true;

	if (autoInit)
	{
		grunt.initConfig(config);
	}

	return config;
};