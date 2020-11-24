import React, {Component, ReactNode, createContext} from 'react'
import watch, {event, cache, state, Watch, mixer} from '@watch-state/react'
import History from '@watch-state/history-api'

const history = new History()

const RouterContext = createContext<Router>(null)

interface RouterProps {
  match?: string
  path?: string
  search?: string
  hash?: string
  other?: boolean
  ish?: boolean
  pathIsh?: boolean
  searchIsh?: boolean
  hashIsh?: boolean
  delay?: number
  showDelay?: number
  hideDelay?: number
  onShow?: () => void
  onShown?: () => void
  onHide?: () => void
  onHidden?: () => void
  children?: ((get: (id?: number, defaultValue?: string) => string) => ReactNode) | ReactNode
}

const RouterDefaultProps = {
  match: '',
  path: '',
  search: '',
  hash: '',
  ish: false,
  pathIsh: false,
  searchIsh: false,
  hashIsh: false
}

function getMatchReg (props: RouterProps) {
  const {match} = props
  if (match) {
    return match
  } else {
    let {search, pathIsh, searchIsh, ish, path, hash, hashIsh} = props
    return `^${path ? `${path}${ish || pathIsh ? '(/[^?#]*)?' : ''}` : '[^?#]*'}${search ?
      `\\?${ish || searchIsh ? '([^#]*\\&)?' : ''}${search}${ish || searchIsh ? '(\\&[^#]*)?' : ''}` :
      '(\\?[^#]*)?'}${hash ? `\\#${ish || hashIsh ? '.*' : ''}${hash}${ish || hashIsh ? '.*' : ''}` : '(\\#.*)?'}$`
  }
}

@watch
class Router <P extends RouterProps = RouterProps, C = any> extends Component<P, C> {
  static defaultProps = RouterDefaultProps
  static contextType = RouterContext

  timer: any
  reaction: Watch

  componentDidMount () {
    this.unmount = false
    this.reaction = new Watch(() => {
      if (this.matched) {
        this.onShow()
      } else {
        this.onHide()
      }
    })
  }
  componentWillUnmount () {
    if (this.show) {
      this.unmount = true
      this.onHide()
    }
    this.reaction.destructor()
  }

  get children () {
    const {matchReg} = this
    if (!matchReg) return null
    let {children} = this.props

    if (typeof children === 'function') {
      let {match, search, searchIsh, ish, path} = this.props
      // @ts-ignore
      return children((id: 0, defaultValue) => {
        if (id && !match && search && (searchIsh || ish)) {
          let start = 0
          let end = start + search.split('(').length + 1
          if (path) {
            const {length} = path.split('(')
            start += length - 1
            end += length - 1
          }
          if (id > start) {
            id++
            if (id >= end) {
              id++
            }
          }
        }
        return history.get(matchReg, id, defaultValue) || defaultValue
      })
    } else {
      return children
    }
  }

  unmount = false
  @state show = false
  @state childRouterCount = 0

  @cache get showOther (): boolean {
    return !this.childRouterCount
  }
  @mixer get matched (): boolean {
    const {props} = this
    if (props.other && !this.context?.showOther) {
      return false
    }
    if (!props.path && !props.search && !props.hash && !props.match) {
      return true
    }
    return history.is(this.matchReg)
  }
  @mixer get matchReg (): string {
    return getMatchReg(this.props)
  }

  @event onShow () {
    const {onShow, showDelay, delay} = this.props
    if (onShow) {
      onShow()
    }
    if (showDelay || delay) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.onShown(), showDelay || delay)
    } else {
      this.onShown()
    }
  }
  @event onShown () {
    const {onShown} = this.props
    if (!this.show && !this.props.other && this.context) {
      this.context.childRouterCount++
    }
    this.show = true
    if (onShown) {
      onShown()
    }
  }
  @event onHide () {
    const {onHide, hideDelay, delay} = this.props
    if (onHide) {
      onHide()
    }
    if ((hideDelay || delay) && !this.unmount) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.onHidden(), hideDelay || delay)
    } else {
      this.onHidden()
    }
  }
  @event onHidden () {
    if (this.show && !this.props.other && this.context) {
      this.context.childRouterCount--
    }
    this.show = false
    if (this.props.onHidden) {
      this.props.onHidden()
    }
  }

  render () {
    return this.show ? (
      <RouterContext.Provider value={this}>
        {this.children}
      </RouterContext.Provider>
    ) : null
  }
}

export default Router

export {
  Router,
  history,
  RouterContext,
  RouterProps,
  RouterDefaultProps,
  getMatchReg
}
