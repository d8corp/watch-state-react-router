import ReactDom from 'react-dom'
import React, {ReactElement} from 'react'
import Router, {history, Redirect} from '../index'

function render (component: ReactElement): HTMLDivElement {
  const div = document.createElement('div')
  ReactDom.render(component, div)
  return div
}

describe('Redirect', () => {
  describe('default', () => {
    test('simple', () => {
      const {state} = history

      expect(history.url).toBe('/')

      render(<Redirect />)

      expect(history.url).toBe('/')
      expect(history.state).toBe(state)
    })
    test('simple push', () => {
      const {state} = history

      expect(history.url).toBe('/')

      render(<Redirect push />)

      expect(history.url).toBe('/')
      expect(history.state).toBe(state)
    })
  })
  describe('url', () => {
    test('simple', () => {
      const {length} = history.state.steps
      expect(history.url).toBe('/')

      render(<Redirect url='/test' />)

      expect(history.url).toBe('/test')
      expect(history.state.steps.length).toBe(length)
    })
    test('push', () => {
      const {length} = history.state.steps

      expect(history.url).toBe('/test')

      render(<Redirect url='/' push />)

      expect(history.url).toBe('/')

      expect(history.state.steps.length).toBe(length + 1)
    })
    test('path', () => {
      expect(history.url).toBe('/')

      render(<Redirect url='/test1?key=value#test' path='/test2' />)

      expect(history.url).toBe('/test2?key=value#test')
    })
    test('search', () => {
      history.replace('/')
      expect(history.url).toBe('/')

      render(<Redirect url='/test1?key=value#test' search='key1=value1' />)

      expect(history.url).toBe('/test1?key1=value1#test')
    })
    test('object search', () => {
      history.replace('/')
      expect(history.url).toBe('/')

      render(<Redirect url='?key1=value1&key2=value2#test' search={{key1: undefined, key2: 'value'}} />)

      expect(history.url).toBe('/?key2=value#test')
    })
    test('hash', () => {
      history.replace('/')
      expect(history.url).toBe('/')

      render(<Redirect url='/test?key#test1' hash='test2' />)

      expect(history.url).toBe('/test?key#test2')
    })
  })
  test('path', () => {
    history.replace('/')

    render(<Redirect path='/test2' />)

    expect(history.url).toBe('/test2')
  })
  describe('search', () => {
    test('string', () => {
      history.replace('/')

      render(<Redirect search='key=value' />)

      expect(history.url).toBe('/?key=value')
    })
    test('object search', () => {
      history.replace('/')

      render(<Redirect search={{key1: undefined, key2: 'value'}} />)

      expect(history.url).toBe('/?key2=value')
    })
    test('keep path', () => {
      history.replace('/test')

      render(<Redirect search={{key1: undefined, key2: 'value'}} />)

      expect(history.url).toBe('/test?key2=value')
    })
    test('keep path empty', () => {
      history.replace('/test?modal=login')

      render(<Redirect search={{modal: undefined}} />)

      expect(history.url).toBe('/test')
    })
  })
  test('hash', () => {
    history.replace('/')

    render(<Redirect hash='test2' />)

    expect(history.url).toBe('/#test2')
  })
  describe('combine', () => {
    test('simple', () => {
      history.replace('/')

      render(<><Redirect url='/test1' /><Redirect url='/test2' /></>)

      expect(history.url).toBe('/test2')
    })
    test('url and path', () => {
      history.replace('/')

      render(<><Redirect url='/test1' /><Redirect path='/test2' /></>)

      expect(history.url).toBe('/test2')
    })
    test('url and search', () => {
      history.replace('/')

      render(<><Redirect url='/test1' /><Redirect search='test' /></>)

      expect(history.url).toBe('/test1?test')
    })
    test('url and hash', () => {
      history.replace('/')

      render(<><Redirect url='/test1' /><Redirect hash='test' /></>)

      expect(history.url).toBe('/test1#test')
    })
    test('path and hash', () => {
      history.replace('/')

      render(<><Redirect path='/test1' /><Redirect hash='test2' /></>)

      expect(history.url).toBe('/test1#test2')
    })
    test('remove add search', () => {
      history.replace('/?test1=value1&test2=value2')

      render(<><Redirect search={{test1: undefined}} /><Redirect search='test2=value1' /></>)

      expect(history.url).toBe('/?test2=value1')
    })
  })
  describe('redirect from', () => {
    test('simple', () => {
      history.replace('/')

      render(
        <>
          <Router path='/foo'>
            <Redirect path='/bar' />
          </Router>
        </>
      )

      expect(history.url).toBe('/')

      history.push('/foo')

      expect(history.url).toBe('/bar')
    })
    test('get value', () => {
      history.replace('/')

      render(
        <>
          <Router path='/foo/(1|2)'>
            {get => <Redirect path={`/bar/${get(1)}`} />}
          </Router>
        </>
      )

      expect(history.url).toBe('/')

      history.replace('/foo/1')

      expect(history.url).toBe('/bar/1')

      history.replace('/foo/2')

      expect(history.url).toBe('/bar/2')
    })
  })
})
