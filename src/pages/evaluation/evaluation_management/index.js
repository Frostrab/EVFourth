import React from 'react'
import Loadable from 'react-loadable'
import { Loading } from '../../../components/Loading'
export const Evaluation = Loadable({
  loader: () => import('./Evaluation/Evaluation'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})

export const SummaryEvaluationList = Loadable({
  loader: () => import('./SummaryEvaluation/SummaryEvaluation'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
