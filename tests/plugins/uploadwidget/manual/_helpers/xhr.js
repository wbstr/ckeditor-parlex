/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

// Mock the real XMLHttpRequest so the upload test may work locally.

window.FormData = function() {
	var total, filename;
	return {
		append: function( name, file, filename ) {
			total = file.size;
			filename = filename;
		},
		getTotal: function() {
			return total;
		},
		getFileName: function() {
			return filename;
		}
	};
};

window.XMLHttpRequest = function() {
	var basePath = bender.config.tests[ bender.testData.group ].basePath;

	return {
		open: function() {},

		send: function( formData ) {
			var total = formData.getTotal(),
				loaded = 0,
				step = Math.round( total / 10 ),
				xhr = this,
				onprogress = this.onprogress,
				onload = this.onload,
				interval;

			// Wait 400 ms for every step.
			interval = setInterval( function() {
				// Add data to 'loaded' counter.
				loaded += step;
				if ( loaded > total ) {
					loaded = total;
				}

				// If file is not loaded call onprogress.
				if ( loaded < total ) {
					onprogress( { loaded: loaded } );
				}
				// If file is loaded call onload.
				else {
					var responseData = {
						fileName: formData.getFileName(),
						uploaded: 1,
						url: '\/' + basePath + '_assets\/lena.jpg',
						error: {
							number: 201,
							message: ''
						}
					};
					CKEDITOR.tools.extend( responseData, XMLHttpRequest.responseData, true );

					clearInterval( interval );
					xhr.status = 200;
					xhr.responseText = JSON.stringify( responseData );
					onload();
				}
			}, 400 );
		},

		// Abort should call onabort.
		abort: function() {
			this.onabort();
		}
	};
};
