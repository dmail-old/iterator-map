var proto = require('@dmail/proto');
var Iterator = require('@dmail/iterator');
var isIterable = require('@dmail/iterator/is-iterable');

var MappedIterator = proto.extend.call(Iterator, {
	constructor: function(iterable, map, bind){
		if( typeof map != 'function' ) throw new TypeError('map must be a function');
		if( !isIterable(iterable) ) throw new TypeError('not iterable', iterable);

		this.iterable = iterable;
		this.iterator = iterable[Symbol.iterator]();
		this.map = map;
		this.bind = bind;
		this.index = 0;
	},

	next: function(){
		var next = this.iterator.next();
		if( next.done === true ) return next;
		next.value = this.map.call(this.bind, next.value, this.index, this.iterable);
		this.index++;
		return next;
	},

	toString: function(){
		return '[object Mapped Iterator]';
	}
});

var MappedIterable = proto.extend({
	iterable: null,
	map: null,
	bind: null,

	constructor: function(iterable, map, bind){
		this.iterable = iterable;
		this.map = map;
		this.bind = bind;
	},

	toString: function(){
		return '[object Mapped Iterable]';
	}
});

MappedIterable[Symbol.iterator] = function(){
	return MappedIterator.create(this.iterable, this.map, this.bind);
};

function map(iterable, fn, bind){
	return MappedIterable.create(iterable, fn, bind);
}

module.exports = map;
Iterator.map = map;