const DEFAULT_OPTIONS = {
    rootMode: 'upward',
    ignore: [
        /node_modules/,
        // function _debugFilter(filepath) { console.log(filepath); }
    ],
};

require('@babel/register')(DEFAULT_OPTIONS);

module.exports = function _jasminRegister() {
    require('@babel/register')(DEFAULT_OPTIONS);
};
