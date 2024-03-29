import {Component, ReactNode} from 'react'
import {history} from '../Router'
import {setSearch, parseUrl} from '@watch-state/history-api'

export interface RedirectData {
  path: string
  search: string
  hash: string
  push: boolean
  scrollFirst: boolean
  position: string | number
}

export interface RedirectProps {
  url?: string
  path?: string
  search?: {[key: string]: string | undefined} | string
  hash?: string
  push?: boolean
  scrollFirst?: boolean
  position?: string | number
  children?: ReactNode
}

export const RedirectDefaultProp = {
  url: '',
  path: '',
  hash: '',
  children: null
}

export class Redirect <P extends RedirectProps = RedirectProps, C = any> extends Component <P, C> {
  static data: RedirectData
  static defaultProps = RedirectDefaultProp

  static redirect () {
    if (Redirect.data) {
      const {path, search, hash, position, scrollFirst, push} = Redirect.data
      const url = path + search + hash
      delete Redirect.data
      if (history.url !== url) {
        history[push ? 'push' : 'replace'](url, position, scrollFirst)
      }
    }
  }

  componentDidMount () {
    Redirect.redirect()
  }

  componentDidUpdate () {
    Redirect.redirect()
  }

  get data (): RedirectData {
    let {url, path, search, hash, push, position, scrollFirst} = this.props
    if (url.startsWith('http')) {
      location.href = url
      return
    }

    const {data = {
      path: history.path,
      search: location.search,
      hash: location.hash,
      position: 0,
      push: false,
      scrollFirst: false
    }} = Redirect

    if (url) {
      const parsedUrl = parseUrl(url)
      if (!path) {
        path = parsedUrl.path
      }
      if (!search) {
        search = parsedUrl.search
      }
      if (!hash) {
        hash = parsedUrl.hash
      }
    }

    if (path) {
      data.path = path
    }
    if (typeof search === 'object') {
      for (const key in search) {
        const value = search[key]
        // @ts-ignore
        data.search = setSearch(data.search, key, value)
      }
    } else if (search) {
      data.search = '?' + search
    }
    if (hash) {
      data.hash = '#' + hash
    }

    if (push !== undefined) {
      data.push = push
    }
    if (position !== undefined) {
      data.position = position
    }
    if (scrollFirst !== undefined) {
      data.scrollFirst = scrollFirst
    }
    return data
  }

  render () {
    Redirect.data = this.data
    return this.props.children
  }
}
