/* bender-tags: widget */
/* bender-ckeditor-plugins: embedsemantic,toolbar,undo,basicstyles */
/* bender-include: ../widget/_helpers/tools.js, ../embedbase/_helpers/tools.js */
/* global embedTools, widgetTestsTools */

'use strict';

bender.editors = {
	classic: {
		name: 'editor_classic',
		creator: 'replace'
	}
};

var obj2Array = widgetTestsTools.obj2Array;

embedTools.mockJsonp();

var tcs = {
	spies: [],

	tearDown: function() {
		var spy;

		while ( spy = this.spies.pop() ) {
			spy.restore();
		}
	},

	'test undo is disabled on load': function() {
		var bot = this.editorBots.classic,
			editor = bot.editor;

		bot.setData( '<p>x</p><oembed>http://onload/1</oembed><oembed>http://onload/2</oembed><p>x</p>', function() {
			assert.areSame( 2, obj2Array( editor.widgets.instances ).length, 'two widgets on data ready' );
			// Make sure that the TC works - widgets should be empty at this stage.
			assert.isMatching( /^(<br>|)$/, obj2Array( editor.widgets.instances )[ 0 ].element.getHtml(),
				'first widget is still empty' );
			assert.isMatching( /^(<br>|)$/, obj2Array( editor.widgets.instances )[ 1 ].element.getHtml(),
				'second widget is still empty' );

			editor.resetUndo();

			wait( function() {
				assert.isMatching( /<p>url:http/i,
					obj2Array( editor.widgets.instances )[ 0 ].element.getHtml(), 'first widget is ready' );
				assert.isMatching( /<p>url:http/i,
					obj2Array( editor.widgets.instances )[ 1 ].element.getHtml(), 'second widget is ready' );

				// Make sure that we grab all unrecored changes.
				editor.fire( 'saveSnapshot' );
				assert.areSame( CKEDITOR.TRISTATE_DISABLED, editor.getCommand( 'undo' ).state, 'undo is disabled on load' );
			}, 200 );
		} );
	},

	'test undo should not cause load': function() {
		var bot = this.editorBots.classic,
			editor = bot.editor,
			that = this;

		bot.setData( '<p>x</p><oembed>http://undo/no/load</oembed><p>x</p>', function() {
			wait( function() {
				assert.isInnerHtmlMatching( '<p>url:http%3A%2F%2Fundo%2Fno%2Fload</p>',
					obj2Array( editor.widgets.instances )[ 0 ].element.getHtml(), 'widget is ready on load' );

				var p = editor.editable().findOne( 'p' ),
					range = editor.createRange();

				range.selectNodeContents( p );
				editor.getSelection().selectRanges( [ range ] );

				editor.execCommand( 'bold' );
				assert.areSame( '<p><strong>x</strong></p><oembed>http://undo/no/load</oembed><p>x</p>', editor.getData() );

				var loadContentSpy = sinon.spy( editor.widgets.registered.embedSemantic, 'loadContent' );
				that.spies.push( loadContentSpy );

				editor.execCommand( 'undo' );

				assert.isFalse( loadContentSpy.called, 'widget.loadContent was not called on undo' );
			}, 100 );
		} );
	}
};

widgetTestsTools.addTests( tcs, {
	name: 'basic',
	widgetName: 'embedSemantic',
	extraPlugins: 'embedsemantic',
	initialInstancesNumber: 1,
	newData: [
		[ 'info', 'url', 'http://xxx' ]
	],
	newWidgetPattern: '<oembed>http://xxx</oembed>'
} );

bender.test( tcs );