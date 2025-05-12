var path = require( 'path' );

const NODE_ENV = process.env.NODE_ENV || 'production';

var config = {
	mode: NODE_ENV,
	entry: {
		'quiz-admin': './src/index.js',
		'quiz-frontend': './src/frontend.js',
		blocks: './src/blocks.js',
	},
	output: {
		path: path.join( __dirname, './assets/js/backend/' ),
		filename: '[name].js',
		sourceMapFilename: '[file].map', // This will place the source maps next to the output files
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: { loader: 'babel-loader' },
			},
			{
				test: /\.(scss|css)$/,
				use: [ 'style-loader', 'css-loader', 'sass-loader' ],
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: '@svgr/webpack', // or any other loader you are using for SVG files
						options: {
							icon: true,
							memo: true,
							svgoConfig: {
								plugins: [
									// Use SVGO plugin in correct format
									{
										name: 'preset-default',
										params: {
											overrides: {
												removeViewBox: false,
											},
										},
									},
								],
							},
						},
					},
					{
						loader: 'url-loader', // or any other loader you are using for SVG files
					},
				],
			},
		],
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
	devtool: 'source-map',
	externals: {
		'@wordpress/element': 'wp.element',
		'@wordpress/components': 'wp.components',
		'@wordpress/blocks': 'wp.blocks',
		'@wordpress/block-editor': 'wp.blockEditor',
		'@woocommerce/components': 'wc.components',
		moment: 'moment',
		lodash: 'lodash',
		'@woocommerce/date': 'wc.date',
		'@wordpress/i18n': 'wp.i18n',
	},
};

module.exports = [ config ];
