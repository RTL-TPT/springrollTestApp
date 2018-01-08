# Grunt SpringRoll [![Dependency Status](https://david-dm.org/SpringRoll/grunt-springroll.svg?style=flat)](https://david-dm.org/SpringRoll/grunt-springroll) [![Build Status](https://travis-ci.org/SpringRoll/grunt-springroll.svg)](https://travis-ci.org/SpringRoll/grunt-springroll) [![npm version](https://badge.fury.io/js/grunt-springroll.svg)](http://badge.fury.io/js/grunt-springroll)

Grunt SpringRoll is a Node plugin which provides common project build tasks for creating SpringRoll projects. The plugin requires both [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/) to be installed on the local system in order to build.

## Requirements

There are a couple of tools that you'll need to install before we can create our project. Please make sure the following items are available on your machine:

* Install [Node JS](http://nodejs.org/)
* Install [Grunt](http://gruntjs.com/getting-started) `npm install -g grunt-cli`
* Install [Bower](http://bower.io/#install-bower) `npm install -g bower`

## Adding Dependencies

Grunt SpringRoll is designed to easily include external dependencies into your project.

Modify the **bower.json** file to include additional libraries into your project. For more information about using Bower please visit the [website](http://bower.io). For instance, if you wanted to include [CreateJS](http://createjs.com), **bower.json** might look like this. Note that the _version_ and _name_ field is automatically updated from the **springroll.json** file.

```js
{
	"name": "MyApp",
	"version":"0.0.1",
	"dependencies": {
		"jquery" : "~1",
		"normalize-css" : "*",
		"EaselJS" : "*",
		"TweenJS" : "*",
		"PreloadJS" : "*",
		"SoundJS" : "*"
	}
}
```

Then, update **springroll.json** to list the files you'd like to include from the libraries.

```js
{
	"name" : "MyApp",
	"version" : "1.0.0",
	"main" : [
		"src/main.js",
		"src/main.less"
	],
	"libraries" : [
		"components/normalize-css/normalize.css",
		"components/jquery/dist/jquery.min.js",
		"components/EaselJS/lib/easeljs-*.*.*.min.js",
		"components/EaselJS/lib/movieclip-*.*.*.min.js",
		"components/PreloadJS/lib/preloadjs-*.*.*.min.js",
		"components/SoundJS/lib/soundjs-*.*.*.min.js",
		"components/TweenJS/lib/tweenjs-*.*.*.min.js"
	]
}
```

After adding these libraries, run `grunt libs` from the commandline to import new libraries into your project.

## Grunt Tasks

These are the list of grunt tasks for building the project.

Task | Description
---|---
**build** | Build the project and libraries in release mode.
**build-debug** | Build the project and libraries in debug mode.
**default** | Alias for **build** task.
**debug** | Alias for **build-debug** task.
**dev** | Development mode to build the project, this watches source files and auto-rebuilds whenever there's a change in CSS, main JavaScript or assets.
**dev-main** | Development mode which watches source JavaScript files only and auto-rebuilds whenever there's a change. Faster than **dev** because it excludes assets building.
**config** | Concatenate the JSON source files into a single release configuration file. The configuration file is required for all project and contains useful implementation-sepecific information to be loaded at run-time, like level data, sound library, etc. All JS-style code blocks and comments are removed from the source files. 
**config-debug** | The debug version of the **config** task. 
**assets** | Minify all assets JavaScript files
**assets-debug** | Combine all assets JavaScript files with source maps for better debugging
**libs** | Import and rebuild the external dependencies
**libs-debug** | Import and concat the external dependencies including building source maps for better debugging
**clean-all** | Delete all generated build files and delete components directory
**clean-libs** | Delete all downloaded Bower components and library build files
**qa** | Build the project in debug mode and run in the web browser by running a NodeJS server
**run** | Preview the deploy index.html file in a web browser by running a NodeJS server
**version** | Control the project versioning, and update the version number in **springroll.json** and **bower.json**. This task requires a single argument, for instance, **version:1.0.0** (uses the [Semantic Version](http://semver.org/) format) or increment the version using **version:major**, **version:minor** or **version:patch**. Change the version _before_ doing a build.

## Task Hooks

These are the list of grunt tasks which are safe to be overridden using `grunt.registerTask()`. These task aliases are empty and contain no sub-tasks.

Task | Description
---|---
**_pre-build** | Before the build starts. 
**_pre-build-debug** | Before the debug build starts.
**_post-build** | After the build ends.
**_post-build-debug** | After the debug build ends.

## Build File

The **springroll.json** file contains the list of all required JavaScript and CSS files in order to build the project. Below describes the different fields of this file.

Property | Type | Description
---|---|---
**name** | string | The name of the project
**version** | string | The [semantic versioning](http://semver.org/) number
**main** | array | The list of files to use to build the project, this can be a mix of JavaScript and CSS/LESS files. Note: the order of the files is how the output is built.
**libraries** | array | The list of external file dependencies imported by Bower. Note: the order of the files is how the output is built.
**config** | string | The path to the JSON configuration files. This get concatenated and exported. See [grunt-concat-json](https://github.com/springroll/grunt-concat-json) for more information about concatenating JSON.
**mainDebug** _(optional)_ | array | The same as `main` except that this file list is only used when building in `dev` task.
**librariesDebug** _(optional)_ | array | The same as `libraries` except that this file list is only used when building in `dev` task.
**assets** _(optional)_ | array, object | A list of published JavaScript files that should be minified and combined to create an `assets.js` file alongside main and libraries. The common use-case for this list is to minify large EaselJS assets exported from Flash to increase the **dev** task build time. Note: assets are not run through JS hinting. Multiple asset files can also be created where the key is the file name (without ".js" or path) and the value is the array of files.
**librariesCopy** _(optional)_ | object | To copy library files (e.g., binary files, SWFs, fonts) into your project after Bower is done. The `librariesCopy` property is an object where the key is the original file and the value is the output destination folder. For instance: `{"components/soundjs/lib/FlashAudioPlugin.swf":"deploy/assets/swfs/"}`.

## Conditional Compiling

The main JavaScript source building supports conditional compiling with global constants. These constants can be use to specify an inline block of code that should be use for development or release builds of the project. The booleans `DEBUG` and `RELEASE` are supported.

### Example

```js
if (DEBUG)
{
	// This code is only visible when built using the 'dev' task
	alert('Debug code here!');
}

if (RELEASE)
{
	// This code is only visible when built using the 'default' task
}
```

## Project Structure

Structure | Description
--- | ---
**./components/** | The directory which contains all the dependencies from Bower; this directory should be ignored by the versioning system
**./deploy/** | Contains all the assets needed to play a deployable version of the project
**./deploy/assets/** | The assets used by the project, such as images, CSS, JSON
**./deploy/assets/js** | The project logic and required dependency logic
**./deploy/assets/css** | The project built CSS
**./deploy/assets/config** | The output configuration folder. Contains project data JSON.
**./deploy/index.html** | The main HTML file needed to run the project
**./node_modules/** | The Node plugins required for the build process; this directory should be ignored by the versioning system
**./src/** | The source JavaScript or CSS/LESS files needed to build the project
**./bower.json** | The list of Bower dependencies
**./springroll.json** | See above, the list of source files and libraries to build
**./Gruntfile.js** | Contains the Grunt automation tasks
**./package.json** | The list of Node dependencies
**./README.md** | The readme markdown file describing the project

## Plugin Settings

The Grunt SpringRoll plugin can accept additional options. Here's an example to add additional arguments:

```js
module.exports = function(grunt)
{
	require('grunt-springroll')(grunt, {
		options: {
			jsFolder : "deploy/js",
			cssFolder : "deploy/css"
		}
	});
};
```

### settings.options.autoInit

A _boolean_ defaults to true. If grunt.initConfig() is automatically called.

### settings.options.buildFile

A _string_ defaults to "springroll.json". The name of the JSON file which contains the JavaScript, CSS files to build. See the Build File above for more information about what this does.

### settings.options.distFolder

A _string_ defaults to "deploy". The base output folder where to save the compiled project files.

### settings.options.jsFolder

A _string_ defaults to "deploy/assets/js". The base output folder for JavaScript files (libraries.js and main.js).

### settings.options.cssFolder

A _string_ defaults to "deploy/assets/css". The base output folder for CSS files (libraries.css and main.css).

### settings.options.configFolder

A _string_ defaults to "deploy/assets/config". The name of the output folder which will contain the configuration files.

### settings.options.configFile

A _string_ defaults to "deploy/assets/config/config.json". The name of the output file which will contain the concatenated configuration JSON file.

### settings.*

Any additional arguments to be accessible by the Grunt cofnig. The data to set which can be accessible by all Grunt tasks, for instance `{ "name": "MyApp"}` would allow a substitution `<%= name %>` which would resolve to _MyApp_.
