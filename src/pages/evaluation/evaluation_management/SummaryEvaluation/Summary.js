import React from 'react'
import { FormSummaryVendor } from './summaryVendorForm/index'
import { useAuth } from '../../../../context/auth'

const SummaryEvaluationTemplate = props => {
  return (
    <div>
      <FormSummaryVendor
        approve={true}
        rowSelect={props.rowSelect}
        mode={props.mode}
        mediaSize={props.mediaSize}
        token={props.token}
        template={props.template}
        criteria={props.criteria}
        levelpoint={props.levelpoint}
        grade={props.grade}
        evaluationId={props.evaluationId}
        adUser={props.adUser}
        currentUser={props.employee}
        dataDetail={props.dataDetail}
        handleBackFromMonitor={() => props.handleBackFromMonitor()}
      />
    </div>
  )
}

export default SummaryEvaluationTemplate
