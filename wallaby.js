module.exports = function () {

  return{

    files: ['./src/lib/**/*.js'],
    
    tests: ['./**/*.test.js'],
    
    env: {
      type: 'node',
    },
    
    testFramework: 'jest',

  };
};