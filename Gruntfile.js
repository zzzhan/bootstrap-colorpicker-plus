module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
		files: {
			'dist/js/<%= pkg.file %>.min.js':'src/js/<%=pkg.file %>.js'
		}
      }
    },
	cssmin: {
      options: {
        report: 'gzip'
      },
      build: {
		files: {		
			'dist/css/<%= pkg.file %>.min.css':'src/css/<%=pkg.file %>.css'
		}
      }
	},
	copy: {
      build: {
		files: {		
			'dist/js/<%= pkg.file %>.js':'src/js/<%=pkg.file %>.js',
			'dist/css/<%= pkg.file %>.css':'src/css/<%=pkg.file %>.css'
		}
      }
	},
    clean: ['dist/css/<%= pkg.file %>.min.css', 'dist/js/<%= pkg.file %>.min.js']
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['clean','uglify','cssmin','copy']);
}