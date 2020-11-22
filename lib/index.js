'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('tslib');
require('react');
require('@watch-state/react');
var History = require('@watch-state/history-api');
var Router = require('./Router.js');
var Redirect = require('./Redirect.js');
var Link = require('./Link.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var History__default = /*#__PURE__*/_interopDefaultLegacy(History);



Object.keys(History).forEach(function (k) {
	if (k !== 'default') Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () {
			return History[k];
		}
	});
});
Object.defineProperty(exports, 'History', {
	enumerable: true,
	get: function () {
		return History__default['default'];
	}
});
exports.Router = Router['default'];
exports.RouterContext = Router.RouterContext;
exports.RouterDefaultProps = Router.RouterDefaultProps;
exports.default = Router['default'];
exports.getMatchReg = Router.getMatchReg;
exports.history = Router.history;
exports.Redirect = Redirect['default'];
exports.RedirectDefaultProp = Redirect.RedirectDefaultProp;
exports.Link = Link['default'];
exports.LinkDefaultProps = Link.LinkDefaultProps;
