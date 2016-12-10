//
// Copyright (c) 2016 12 Quarters Consulting
//
//	eeny meeny miney AMD loader
//
(function(win,doc){

	var pending = {}, loaded = {};

	win.define = function( name, deps, body ) {
		if( name in loaded )
			throw Error( "Already defined: " + name );

		loaded[name] = [ deps, body ];

		(pending[name] || [])
			.forEach( function(cb) { cb() } );

		delete pending[name]
	}

	function require_config( config ) {

		var ready = {},
			require = _require.bind( null, load );

		require.config = require_config;
		require.bundled = _require.bind( null, 0 );

		return require;

		function _require( load, deps, cb ) {

			var count = 1 + deps.filter( function( dep ) { 
							return !( dep in loaded || 
									  (pending[dep] || (pending[dep]=[])).push( trigger )
									  	&& load && load( dep ) 
									)
						} ).length;

			trigger();

			function trigger() {
				if( --count == 0 )
					cb.apply( null, deps.map( init ) );
			}
		}

		function init( mdl ) {
			var deps, body, cfg;

			return ready[mdl] || (ready[mdl] = (
						deps = loaded[mdl][0].map( initDependency ),
					  	typeof (body = loaded[mdl][1]) == 'function'
							? body.apply( null, deps )
							: body
				   	))

			function initDependency( dep ) {
				return dep == "require" ? require
					   : dep == "module" ? { 
							config: function() { 
								return cfg || matchPath( config.config, mdl, function( val ) { return cfg = val || {} } )
							},
							id: mdl 
						 }
					   : init( dep )
			}
		}

		function load( mdl ) {
			var s = doc.createElement( "script" );
			s.src = matchPath( config.paths || {}, mdl, function( base, pfx ) { 
						return (base || "") + mdl.substr( pfx.length )
					} ) + ".js?" + (config.urlArgs || "");
			s.async = true;
			doc.head.appendChild( s );
		}
	}

	win.require = require_config({});

	function matchPath( cfg, path, cb ) {
		while( path && !cfg[path] )
			path = path.replace( /\/?[^/]*$/, "" );
		return cb( cfg[path], path ); 
	}

})(window,document)
