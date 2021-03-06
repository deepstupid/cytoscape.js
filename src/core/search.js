'use strict';

var is = require( '../is' );
var Collection = require( '../collection' );

var corefn = ({

  // get a collection
  // - empty collection on no args
  // - collection of elements in the graph on selector arg
  // - guarantee a returned collection when elements or collection specified
  collection: function( eles, opts ){

    //TODO use a switch on typeof, this is. stuff may be slower than that

    if( is.string( eles ) ){
      return this.$( eles );

    } else if( is.elementOrCollection( eles ) ){
      return eles.collection();

    } else if( is.array( eles ) ){
      return new Collection( this, eles, opts );
    }

    return new Collection( this );
  },

  nodes: function( selector ){
    var nodes = this.$( function( ele ){
      return ele.isNode();
    } );

    if( selector ){
      return nodes.filter( selector );
    }

    return nodes;
  },

  edges: function( selector ){
    var edges = this.$( function( ele ){
      return ele.isEdge();
    } );

    if( selector ){
      return edges.filter( selector );
    }

    return edges;
  },

  // search the graph like jQuery
  $: function( selector ){
    var eles = this._private.elements;

    if( selector ){
      return eles.filter( selector );
    } else {
      return eles.spawnSelf();
    }
  },

  mutableElements: function(){
    return this._private.elements;
  }

});

// aliases
corefn.elements = corefn.filter = corefn.$;

module.exports = corefn;
