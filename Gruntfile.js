/* jshint node: true */
module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    build: {
      // Build time
      time: grunt.template.today('mmmm d, yyyy hh:MM:ss TT'),
      // Build version
      version: '<%= pkg.version %>',
      // Build file names
      fileNames: {
        src: 'jsonp.js',
        dest: 'jsonp.min.js'
      },
      // Build paths
      paths: {
        src: '.',
        dest: './dist'
      }
    },

    copy: {
      dist: {
        files: [
          {
            src: '<%= build.paths.src %>/<%= build.fileNames.src %>',
            dest: '<%= build.paths.dest %>/<%= build.fileNames.src %>'
          }
        ]
      }
    },

    jshint: {
      options: {
        jshintrc: '<%= build.paths.src %>/.jshintrc'
      },
      beforeconcat: [
        '<%= build.paths.src %>/<%= build.fileNames.src %>'
      ]
    },

    mochaTest: {
      test: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          colors: true
        },
        src: [
          '<%= build.paths.src %>/test/index.js'
        ]
      }
    },

    uglify: {
      options: {
        compress: {
          drop_console: true
        },
        mangle: true,
        preserveComments: 'some',
        sourceMap: false
      },
      js : {
        files: [
          {
            expand: false,
            src: '<%= build.paths.src %>/<%= build.fileNames.src %>',
            dest: '<%= build.paths.dest %>/<%= build.fileNames.dest %>'
          }
        ]
      }
    }

  });

  // Load Grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Test task. Two parts to it:
  // 1. Static analysis via JSHint
  // 2. Unit tests via Mocha
  grunt.registerTask('test', [
    'jshint',
    'mochaTest'
  ]);

  grunt.registerTask('build', function() {
    // Don't build if we fail the testing tasks.
    grunt.task.run('test');
    // Copy to dist.
    grunt.task.run('copy:dist');
    // Minify and copy to dist.
    grunt.task.run('uglify:js');
  });

  // By convention, the default Grunt task should be the test task.
  grunt.registerTask('default', [
    'test'
  ]);

};
