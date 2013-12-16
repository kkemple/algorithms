module.exports = function(grunt) {

    grunt.initConfig({
        coffee: {
            buildAll: {
                expand: true,
                flatten: false,
                cwd: 'scripts/coffee',
                src: ['**/*.coffee'],
                dest: 'scripts/js/',
                ext: '.js'
            }
        },
        sass: {
            buildAll: {
                options: { 
                    style: 'expanded'
                },
                files: { 
                    'styles/css/app.css': 'styles/sass/app.sass',
                }
            }
        },
        watch: {
            scripts: {
               files: '**/*.coffee',
               tasks: ['coffee'],
               options: {
                 debounceDelay: 500,
                 livereload: true
               },
            },
            styles: {
               files: '**/*.sass',
               tasks: ['sass'],
               options: {
                 debounceDelay: 500,
                 livereload: true
               },
            },
            html: {
                files: '**/*.html',
                options: {
                    debounceDelay: 500,
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
};