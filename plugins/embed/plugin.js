/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'embed', {
		icons: 'embed', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'embedbase',

		init: function( editor ) {
			var widgetDefinition = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( editor );

			// Extend the base definition with additional properties.
			CKEDITOR.tools.extend( widgetDefinition, {
				// Use a dialog exposed by the embedbase plugin.
				dialog: 'embedBase',
				button: editor.lang.embedbase.button,
				allowedContent: 'div[!data-oembed-url]',
				requiredContent: 'div[data-oembed-url]',
				providerUrl: new CKEDITOR.template(
					editor.config.embed_provider ||
					'//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}'
				),

				upcast: function( el, data ) {
					if ( el.name == 'div' && el.attributes[ 'data-oembed-url' ] ) {
						data.url = el.attributes[ 'data-oembed-url' ];

						return true;
					}
				},

				downcast: function( el ) {
					el.attributes[ 'data-oembed-url' ] = this.data.url;
				}
			}, true );

			// Register the definition as 'embed' widget.
			editor.widgets.add( 'embed', widgetDefinition );

			// Do not filter contents of the div[data-oembed-url] at all.
			editor.filter.addElementCallback( function( el ) {
				if ( 'data-oembed-url' in el.attributes ) {
					return CKEDITOR.FILTER_SKIP_TREE;
				}
			} );
		}
	} );

} )();

/**
 * A template for URL to the provider endpoint. This URL will be queried for each resource to be embedded.
 * By default CKEditor uses [Iframely](https://iframely.com/) service.
 *
 * The template might use the following parameters:
 *
 *	* `url` - The URL of requested media, e.g. `https://twitter.com/ckeditor/status/401373919157821441`.
 *	* `callback` - A name of globally available callback, used for JSONP requests.
 *
 * You can read more about content providers in {@link CKEDITOR.plugins.embedBase.baseDefinition#providerUrl}.
 *
 * @since 4.5.0
 * @cfg {String} [embed_provider=//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}]
 * @member CKEDITOR.config
 */
