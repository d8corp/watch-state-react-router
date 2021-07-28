import React, {AnchorHTMLAttributes, Component, ReactNode} from 'react'
import {history} from '../Router'
import watch, {event} from '@watch-state/react'

export interface LinkProps<T = any> extends AnchorHTMLAttributes<T> {
  activeClass?: string
  exact?: boolean
  replace?: boolean
  scrollFirst?: boolean
  scrollTo?: number | string
  children?: ReactNode
  onMove?: (move: () => void) => any
  disabled?: boolean
}

export const LinkDefaultProps = {
  href: '/',
}

@watch
export class Link <P extends LinkProps = LinkProps, C = any> extends Component<P, C> {
  static defaultProps = LinkDefaultProps
  @event move (url) {
    const {scrollTo, scrollFirst, replace} = this.props
    history[replace ? 'replace' : 'push'](url, scrollTo, scrollFirst)
  }
  onMove (url: string) {
    const {onMove, disabled} = this.props
    if (!disabled) {
      if (onMove) {
        onMove(() => this.move(url))
      } else {
        this.move(url)
      }
    }
  }
  onClick (e) {
    const {href} = this.props
    let url = href
    if (href.startsWith('?')) {
      url = history.path + (href === '?' ? '' : href)
    } else if (href.startsWith('#')) {
      url = history.path + location.search + (href === '#' ? '' : href)
    } else if (!href.startsWith('/')) {
      return
    }
    e?.preventDefault()
    this.onMove(url)
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }
  get isLocal (): boolean {
    return !this.props.href.startsWith('http')
  }
  get isActive (): boolean {
    const {href = '/'} = this.props
    let prefix = ''
    if (href.startsWith('?')) {
      prefix = '[^?]*'
    } else if (href.startsWith('#')) {
      prefix = '[^#]*'
    } else if (!href.startsWith('/')) {
      return false
    }
    return history.is(`^${prefix}${this.props.href}${this.props.exact ? '$' : ''}`)
  }
  get className (): string {
    let {className, activeClass} = this.props
    if (activeClass && this.isActive) {
      if (className) {
        className += ' ' + activeClass
      } else {
        className = activeClass
      }
    }
    return className
  }
  render () {
    const {isLocal} = this
    const {
      activeClass,
      exact,
      scrollTo,
      scrollFirst,
      replace,
      href,
      onMove,
      rel = isLocal ? undefined : 'noopener noreferrer nofollow',
      target = isLocal ? undefined : '_blank',
      ...props
    } = this.props

    const {locale} = history

    return <a
      {...props}
      href={!this.isLocal || !locale ? href : href === '/' ? `/${locale}` : `/${locale}${href}`}
      rel={rel}
      target={target}
      onClick={e => this.onClick(e)}
      className={this.className}
    />
  }
}
