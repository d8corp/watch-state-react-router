import { __rest, __decorate } from 'tslib';
import React, { Component } from 'react';
import watch, { event } from '@watch-state/react';
import '@watch-state/history-api';
import { history } from './Router.es6.js';

const LinkDefaultProps = {
    href: '/',
};
let Link = class Link extends Component {
    move(url) {
        const { scrollTo, scrollFirst, replace } = this.props;
        history[replace ? 'replace' : 'push'](url, scrollTo, scrollFirst);
    }
    onMove(url) {
        const { onMove } = this.props;
        if (onMove) {
            onMove(() => this.move(url));
        }
        else {
            this.move(url);
        }
    }
    onClick(e) {
        const { href } = this.props;
        let url = href;
        if (href.startsWith('?')) {
            url = history.path + (href === '?' ? '' : href);
        }
        else if (href.startsWith('#')) {
            url = history.path + location.search + (href === '#' ? '' : href);
        }
        else if (!href.startsWith('/')) {
            return;
        }
        e === null || e === void 0 ? void 0 : e.preventDefault();
        this.onMove(url);
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }
    get isLocal() {
        return !this.props.href.startsWith('http');
    }
    get isActive() {
        const { href = '/' } = this.props;
        let prefix = '';
        if (href.startsWith('?')) {
            prefix = '[^?]*';
        }
        else if (href.startsWith('#')) {
            prefix = '[^#]*';
        }
        else if (!href.startsWith('/')) {
            return false;
        }
        return history.is(`^${prefix}${this.props.href}${this.props.exact ? '$' : ''}`);
    }
    get className() {
        let { className, activeClass } = this.props;
        if (activeClass && this.isActive) {
            if (className) {
                className += ' ' + activeClass;
            }
            else {
                className = activeClass;
            }
        }
        return className;
    }
    render() {
        const { isLocal } = this;
        const _a = this.props, { activeClass, exact, scrollTo, scrollFirst, replace, href, onMove, rel = isLocal ? undefined : 'noopener noreferrer nofollow', target = isLocal ? undefined : '_blank' } = _a, props = __rest(_a, ["activeClass", "exact", "scrollTo", "scrollFirst", "replace", "href", "onMove", "rel", "target"]);
        const { locale } = history;
        return React.createElement("a", Object.assign({}, props, { href: !this.isLocal || !locale ? href : href === '/' ? `/${locale}` : `/${locale}${href}`, rel: rel, target: target, onClick: e => this.onClick(e), className: this.className }));
    }
};
Link.defaultProps = LinkDefaultProps;
__decorate([
    event
], Link.prototype, "move", null);
Link = __decorate([
    watch
], Link);
var Link$1 = Link;

export default Link$1;
export { Link, LinkDefaultProps };
