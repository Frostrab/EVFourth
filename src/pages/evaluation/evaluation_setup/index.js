import React from 'react'
import Loadable from 'react-loadable'
import { Loading } from '../../../components/Loading'
export const Criteria = Loadable({
  loader: () => import('./Criteria/Criteria'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})

export const EvaluationTemplate = Loadable({
  loader: () => import('./EvaluationTemplate/EvaluationTemplate'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
export const Grade = Loadable({
  loader: () => import('./Grade/Grade'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
export const LevelPoint = Loadable({
  loader: () => import('./Levelpoint/Levelpoint'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
export const Performance = Loadable({
  loader: () => import('./Performance/Performance'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
export const PerformanceGroup = Loadable({
  loader: () => import('./PerformanceGroup/PerformanceGroup'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
export const Period = Loadable({
  loader: () => import('./Period/Period'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
