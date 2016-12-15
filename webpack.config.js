import "babel-core/register";
import { resolve } from "path";

module.exports = {
    context : resolve("src"),
    entry : {
        app: "js/app.js"
    },
    resolve: {
        root: resolve(__dirname + "/src"),
        extensions: ["", ".js", ".jsx", ".json", ".scss"]
    },
    output : {
        path: resolve(__dirname + "/build"),
        publicPath : "/build",
        filename: "[name].js"
    },
    module: {
        loaders: [{
            test: /\.js$|\.jsx$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }]
    },
    plugins : [],
    watch : true
};