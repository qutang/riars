let context;
if (module.hot) {
    context = require.context(
        "mocha-loader!./",
        false,
        /\.test.js$/
    );
}

document.addEventListener('DOMContentLoaded', function(){
    context.keys().forEach(context);
});
