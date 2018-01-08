module.exports = {
	release: {
		base: "<%= build.config %>",
		src: "<%= build.config %>/**/*.{json,js}",
		dest: "<%= configFile %>"
	},
	debug: {
		base: "<%= build.config %>",
		src: "<%= build.config %>/**/*.{json,js}",
		dest: "<%= configFile %>",
		options: {
			space: "\t"
		}
	}
};