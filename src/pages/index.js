import React from 'react'
import Loadable from 'react-loadable'
import { Loading } from '../components/Loading'
export * from './evaluation'
export * from './vendor'
export * from './authorization'
export * from './central'
export const LoginPage = Loadable({
  loader: () => import('./Login'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
export const Inbox = Loadable({
  loader: () => import('./inbox'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
export const Content1 = Loadable({
  loader: () => import('./Content1'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
export const Layout = Loadable({
  loader: () => import('../components/layout'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
