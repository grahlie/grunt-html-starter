// Information about URL for page
var name = 'YOUR NAME HERE';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Clean build directory
    clean: {
      build: {
        src: 'build'
      }
    },



    // CSS
    // Compile style.scss and compress it
    sass: {
      production: {
        options: {
          style: 'compressed'
        },
        files: {
          'build/css/style.css': 'development/sass/style.scss'
        }
      },
      dev: {
        option: {
          style: 'expanded'
        },
        files: {
          'build/css/style.css': 'development/sass/style.scss'
        }
      }
    },
    autoprefixer:{
      dist:{
        files:{
          'build/css/style.css':'build/css/style.css'
        }
      }
    },
		criticalcss: {
			home: {
				options: {
					url: "http://dev." + name + ".se/index.php",
					width: 1200,
					height: 900,
					outputfile: "critical/critical.css",
					filename: "build/css/style.css",
					buffer: 800*1024,
					ignoreConsole: false
				}
			}
			// Add more pages here "pagename: { ..content.. }"
		},


		
		// HTML
		// Copy files, only for development / in production it using minifiers instead
    copy: {
      dev: {
        files: [
          {expand: true, cwd: 'development/', src: '*.*', dest: 'build/'},
          {expand: true, cwd: 'development/images', src: '*.*', dest: 'build/images'},
          {expand: true, cwd: 'development/fonts', src: '*.*', dest: 'build/fonts'}
        ]
      },
      html: {
        files: [
          {expand: true, cwd: 'development/', src: '*.*', dest: 'build/'}
        ]
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'development/*.html': 'build/*.html',
          'development/*.php': 'build/*.php'
        }
      }
    },



    // IMAGES
		webp: {
			files: {
				expand: true,
				cwd: 'build/images/',
				src: ['**/*.png', '**/*.jpg'],
				dest: 'build/webp/'
			},
			options: {
				quality: 90,
				alphaQuality: 90
			}
		},
		
		// JS
		// Check js files for errors
    jshint: {
      all: ['development/**/*.js', '!development/libs/**/*.js']
    },

    // Minify all js files
    uglify: {
      production: {
        files: {
          'build/js/scripts.min.js': ['development/**/*.js']
        }
      },
      dev: {
        options: {
          mangle: false,
          beautify: true
        },
        files: {
          'build/js/scripts.min.js': ['development/**/*.js']
        }
      }
    },



		// WATCH
		// Watch for changes in js and scss files
    watch: {
      css: {
        files: ['development/sass/style.scss'],
        tasks: ['sass:dev', 'autoprefixer']
      },
      js: {
        files: ['development/**/*.js'],
        tasks: ['jshint', 'uglify:dev']
      },
      html: {
        files: ['development/**/*.html', 'development/**/*.php'],
        tasks: ['copy:html']
      }
    },
    // Updates all browsers
    browserSync: {
      default_options: {
        bsFiles: {
          src : ['build/*.html', 'build/*.php', 'build/*.css', 'build/**/*.js']
        },
        options: {
          watchTask: true,
          proxy: "dev." + name + ".se/build"
        }
      }
    }
	});

	// GRUNT LOADS
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');



  // GRUNT TRIGGERS
  grunt.registerTask('dev', ['clean', 'jshint', 'copy:dev', 'uglify:dev', 'sass:dev', 'autoprefixer', 'browserSync', 'watch']);
  grunt.registerTask('production', ['clean', 'jshint', 'htmlmin', 'uglify:production', 'sass:production', 'autoprefixer', 'watch']);
  grunt.registerTask('css', ['criticalcss']);

}
