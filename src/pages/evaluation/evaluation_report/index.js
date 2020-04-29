import React from 'react'
import Loadable from 'react-loadable'
import { Loading } from '../../../components/Loading'
export const EvaluationReportSummary = Loadable({
  loader: () => import('./EvaluationReportSummary'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})

export const EvaluationReportVendor = Loadable({
  loader: () => import('./EvaluationReportVendor'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
