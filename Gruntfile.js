module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
		files: {
			'dist/js/<%= pkg.name %>.min.js':'src/js/<%=pkg.name %>.js'
		}
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/js/*.js'
      ]
	},
	cssmin: {
      options: {
        report: 'gzip'
      },
      build: {
		files: {		
			'dist/css/<%= pkg.name %>.min.css':'src/css/<%=pkg.name %>.css'
		}
      }
	},
	copy: {
      build: {
        expand: true,
        cwd: 'src/',
        src: ['**/*'],
        dest:'dist/'
      },
      mjolnic: {
        expand: true,
        cwd: 'bower_components/mjolnic-bootstrap-colorpicker/dist',
        src: ['**/*'],
        dest:'dist/'
      }
	},
    clean: ['dist']
  });
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint','clean','uglify','cssmin','copy']);
};