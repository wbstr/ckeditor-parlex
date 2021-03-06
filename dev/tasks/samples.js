/* jshint node: true, browser: false, es3: false */

'use strict';

module.exports = function( grunt ) {
	var banner = [
			'/**',
			' * Copyright (c) 2003-' + new Date().getFullYear() + ', CKSource - Frederico Knabben. All rights reserved.',
			' * For licensing, see LICENSE.html or http://cksource.com/ckeditor/license',
			' */',
		],
		jsBanner = banner.concat( [ '', '// jscs: disable', '// jshint ignore: start', '' ] ),
		samplesFrameworkDir = 'node_modules/cksource-samples-framework',
		samplesFrameworkJsFiles = [
			samplesFrameworkDir + '/js/sf.js',
			samplesFrameworkDir + '/components/**/*.js'
		];

	grunt.config.merge( {
		less: {
			samples: {
				files: [
					{
						src: 'samples/less/samples.less',
						dest: 'samples/css/samples.css'
					}
				],

				options: {
					ieCompat: true,
					paths: [ 'samples/' ],
					relativeUrls: true,

					banner: banner.join( '\n' ),
					sourceMap: true,
					sourceMapFileInline: true,
					sourceMapFilename: 'samples/css/samples.css.map',
					sourceMapURL: 'samples.css.map',
					sourceMapRootpath: '../../'
				}
			}
		},

		watch: {
			'samples-less': {
				files: [
					'<%= less.samples.options.paths[ 0 ] + "/**/*.less" %>',
					samplesFrameworkDir + '/components/**/*.less'
				],
				tasks: [ 'less:samples' ],
				options: {
					nospawn: true
				}
			},

			'samples-js': {
				files: samplesFrameworkJsFiles,
				tasks: [ 'concat:samples' ]
			}
		},

		jsduck: {
			toolbarconfigurator: {
				src: [
					'samples/toolbarconfigurator/js'
				],
				dest: 'samples/toolbarconfigurator/docs'
			}
		},

		concat: {
			samples: {
				options: {
					stripBanners: true,
					banner: jsBanner.join( '\n' )
				},
				src: samplesFrameworkJsFiles,
				dest: 'samples/js/sf.js'
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-less' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jsduck' );
};
