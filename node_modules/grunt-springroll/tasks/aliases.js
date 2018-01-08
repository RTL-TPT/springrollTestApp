module.exports = function(grunt)
{
	grunt.registerTask(
		"default",
		"Default task to build all the project code in release mode", 
		["build"]
	);

	grunt.registerTask(
		"debug",
		"Default task to build all the project code in debug mode", 
		["build-debug"]
	);

	// backward compatibility
	// deprecated
	grunt.registerTask(
		"build-dev",
		"Synonym for the build-debug task",
		["build-debug"]
	);

	// Override-able tasks for adding to the build
	grunt.registerTask("_pre-build", []);
	grunt.registerTask("_post-build", []);
	grunt.registerTask("_pre-build-debug", []);
	grunt.registerTask("_post-build-debug", []);

	grunt.registerTask(
		"build-debug",
		"Build the games and the libraries in debug mode", [
			"_pre-build-debug",
			"clean:main",
			"jshint:main",
			"concat:main",
			"replace:main",
			"clean:css",
			"less:development",
			"clean:config",
			"config-debug",
			"libs-debug",
			"assets-debug",
			"_post-build-debug"
		]
	);

	grunt.registerTask(
		"build",
		"Build the games and the libraries in release mode", [
			"_pre-build",
			"clean:main",
			"jshint:main",
			"uglify:main",
			"clean:css",
			"less:release",
			"clean:config",
			"config",
			"libs",
			"assets",
			"_post-build"
		]
	);

	grunt.registerTask(
		"dev",
		"Development mode to build the project main, css and assets", [
			"clean:newer",
			"clean:main",
			"clean:css",
			"clean:config",
			"watch"
		]
	);

	grunt.registerTask(
		"dev-main",
		"Development mode to build the project - faster, only watches main source (no assets or css)", [
			"clean:newer", 
			"clean:main",
			"watch:main"
		]
	);

	grunt.registerTask(
		"clean-all",
		"Remove all build files and bower components", 
		["clean"]
	);

	grunt.registerTask(
		"clean-libs",
		"Remove all the bower components and library build files", [
			"clean:libraries",
			"clean:components"
		]
	);

	// Check if we have library files to copy
	grunt.registerTask(
		"libs-copy", 
		"Copy library files (e.g. fonts, SWFs) to project",
		(grunt.config.get("hasCopy") ? ["copy"] : [])
	);

	grunt.registerTask(
		"libs",
		"Import external client-side dependencies using Bower", [
			"clean:libraries",
			"bower:install",
			"libs-copy",
			"uglify:libraries",
			"less:libraries"
		]
	);

	grunt.registerTask(
		"libs-debug",
		"Import using Bower and build debug versions of libraries", [
			"clean:libraries",
			"bower:install",
			"libs-copy",
			"concat:libraries",
			"less:libraries-debug"
		]
	);

	grunt.registerTask(
		"qa",
		"Do QA on the games generate and run", [
			"debug",
			"run"
		]
	);

	grunt.registerTask(
		"run",
		"Preview the game by running a node server and opening it in the web browser", 
		["connect:server"]
	);

	grunt.registerTask(
		"config",
		"Combine the config JSONs within config/ into a single file", [
			"concat-json:release"
		]
	);

	grunt.registerTask(
		"config-debug",
		"Combine the config JSONs within config/ into a single file", [
			"concat-json:debug"
		]
	);
};
