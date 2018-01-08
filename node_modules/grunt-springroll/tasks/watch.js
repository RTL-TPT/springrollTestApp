module.exports = {
	// global watch options
	options:
	{
		reload: true,
		atBegin: true
	},
	main:
	{
		files: [
			"Gruntfile.js",
			"<%= build.js.main %>",
			"<%= build.file %>"
		],
		tasks: [
			"newer:jshint:main",
			"newer:concat:main",
			"replace:main"
		]
	},
	css:
	{
		files: [
			"<%= build.css.main %>",
			"<%= build.file %>"
		],
		tasks: [
			"newer:less:development"
		]
	},
	config:
	{
		files: [
			"<%= build.config %>/**/*.{json,js}"
		],
		tasks: [
			"newer:concat-json:debug"
		]
	}
};