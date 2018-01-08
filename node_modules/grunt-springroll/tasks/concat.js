module.exports = {
	options: {
		sourceMap: true
	},
	libraries: {
		dest: "<%= jsFolder %>/libraries.js",
		src: ["<%= build.js.librariesDebug %>"],
		nonull: true
	},
	main: {
		dest: "<%= jsFolder %>/main.js",
		src: ["<%= build.js.mainDebug %>"],
		nonull: true
	}
};