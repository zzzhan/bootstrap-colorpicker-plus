module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
		files: {
			'dist/js/<%= pkg.file %>.min.js':'dist/js/<%=pkg.file %>.js'
		}
      }
    },
	cssmin: {
      options: {
        report: 'gzip'
      },
      build: {
		files: {		
			'dist/css/<%= pkg.file %>.min.css':'dist/css/<%=pkg.file %>.css'
		}
      }
	},
    clean: ['dist/css/<%= pkg.file %>.min.css', 'dist/js/<%= pkg.file %>.min.js']
  });
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-cssmin');
  //grunt.loadNpmTasks('grunt-contrib-clean');
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['clean','uglify','cssmin']);
}