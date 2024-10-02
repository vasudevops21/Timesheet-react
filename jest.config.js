module.exports = {
  // Other Jest settings
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',  // Ensure Babel is handling JavaScript/JSX files
  },
};
