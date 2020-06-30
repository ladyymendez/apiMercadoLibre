module.exports = (grunt) => {
  grunt.initConfig({
    clean: ['coverage'],
    mochaTest: {
      files: './test/*.test.js'
    },
    mocha_istanbul: {
      coverage: {
        src: './',
        options: {
          mask: './test/*.test.js'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('coverage', ['clean', 'mocha_istanbul']);
};
