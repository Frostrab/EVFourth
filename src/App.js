import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AuthContext } from './context/auth'
// import Content1 from './pages/inbox/Content1'
// import LoginPage from './pages/Login'
// import Evaluation from './pages/evaluation/evaluation_management/Evaluation/Evaluation'
// import SummaryEvaluationList from './pages/evaluation/evaluation_management/SummaryEvaluation/SummaryEvaluation'

// import Criteria from './pages/evaluation/evaluation_setup/Criteria/Criteria'
// import EvaluationTemplate from './pages/evaluation/evaluation_setup/EvaluationTemplate/EvaluationTemplate'
// import Grade from './pages/evaluation/evaluation_setup/Grade/Grade'
// import LevelPoint from './pages/evaluation/evaluation_setup/Levelpoint/Levelpoint'
// import Performance from './pages/evaluation/evaluation_setup/Performance/Performance'
// import PerformanceGroup from './pages/evaluation/evaluation_setup/PerformanceGroup/PerformanceGroup'
// import Period from './pages/evaluation/evaluation_setup/Period/Period'

// import VendorFilter from './pages/vendor/VendorFilter/VendorFilter';
// import VendorProfile from './pages/vendor/VendorProfile/VendorList';
// import VendorTransection from './pages/vendor/vendorTransection/VendorTransection';

// import Approval from './pages/central/Approval/Approval';
// import EvaluationGroup from './pages/central/EvaluationGroup/evaluatorGroup';
// import Holiday from './pages/central/HolidayCalendar/HolidayCalendar';
// import EvaluationPercent from './pages/central/EvaluationPercentageConfig/EvaluationPercent';
// import PurchaseOrg from './pages/central/PurchaseOrg/PurchaseOrg';

// import AuthorityCompany from './pages/authorization/AuthorityCompany/AuthorityCompany';
// import RoleManagement  from './pages/authorization/RoalManagement/RoleManagement';
// import UserRole from './pages/authorization/UserRole/UserRole';

// import VendorEvaReport  from './pages/evaluation/evaluation_report/EvaluationReportVendor';
import PrivateRoute from './components/PrivateRoute'
import Loadable from 'react-loadable'
import { Spin, Icon } from 'antd'
const antIcon = <Icon type="loading" style={{ fontSize: 70 }} spin />
const LoadingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        margin: 0,
        alignItems: 'center',
      }}
    >
      <div>
        <Spin indicator={antIcon} />
        <div>Loading ...</div>
      </div>
    </div>
  )
}
const Content1 = Loadable({
  loader: () => import('./pages/inbox/Content1'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const LoginPage = Loadable({
  loader: () => import('./pages/Login'),
  loading: () => null,
})
const Evaluation = Loadable({
  loader: () =>
    import('./pages/evaluation/evaluation_management/Evaluation/Evaluation'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const SummaryEvaluationList = Loadable({
  loader: () =>
    import(
      './pages/evaluation/evaluation_management/SummaryEvaluation/SummaryEvaluation'
    ),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const Criteria = Loadable({
  loader: () => import('./pages/evaluation/evaluation_setup/Criteria/Criteria'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const EvaluationTemplate = Loadable({
  loader: () =>
    import(
      './pages/evaluation/evaluation_setup/EvaluationTemplate/EvaluationTemplate'
    ),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const Grade = Loadable({
  loader: () => import('./pages/evaluation/evaluation_setup/Grade/Grade'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const LevelPoint = Loadable({
  loader: () =>
    import('./pages/evaluation/evaluation_setup/Levelpoint/Levelpoint'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const Performance = Loadable({
  loader: () =>
    import('./pages/evaluation/evaluation_setup/Performance/Performance'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const PerformanceGroup = Loadable({
  loader: () =>
    import(
      './pages/evaluation/evaluation_setup/PerformanceGroup/PerformanceGroup'
    ),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const Period = Loadable({
  loader: () => import('./pages/evaluation/evaluation_setup/Period/Period'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const VendorFilter = Loadable({
  loader: () => import('./pages/vendor/VendorFilter/VendorFilter'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const VendorProfile = Loadable({
  loader: () => import('./pages/vendor/VendorProfile/VendorList'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const VendorTransection = Loadable({
  loader: () => import('./pages/vendor/vendorTransection/VendorTransection'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const Approval = Loadable({
  loader: () => import('./pages/central/Approval/Approval'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const EvaluationGroup = Loadable({
  loader: () => import('./pages/central/EvaluationGroup/evaluatorGroup'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const Holiday = Loadable({
  loader: () => import('./pages/central/HolidayCalendar/HolidayCalendar'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const EvaluationPercent = Loadable({
  loader: () =>
    import('./pages/central/EvaluationPercentageConfig/EvaluationPercent'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const PurchaseOrg = Loadable({
  loader: () => import('./pages/central/PurchaseOrg/PurchaseOrg'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})

const AuthorityCompany = Loadable({
  loader: () =>
    import('./pages/authorization/AuthorityCompany/AuthorityCompany'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const RoleManagement = Loadable({
  loader: () => import('./pages/authorization/RoalManagement/RoleManagement'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const UserRole = Loadable({
  loader: () => import('./pages/authorization/UserRole/UserRole'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const VendorEvaReport = Loadable({
  loader: () =>
    import('./pages/evaluation/evaluation_report/EvaluationReportVendor'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
const ReportEva = Loadable({
  loader: () =>
    import('./pages/evaluation/evaluation_report/EvaluationReportPlate1'),
  loading: () =>
    //null,
    {
      return <LoadingPage />
    },
})
function App() {
  const [authTokens, setAuthTokens] = React.useState()
  const setTokens = data => {
    setAuthTokens(data)
  }
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <React.Fragment>
        <Switch>
          <PrivateRoute path="/Inbox" component={Content1} />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_MGT_Group/Evaluation"
            component={Evaluation}
          />
          <PrivateRoute
            path="/CentralSetting/PurchaseOrg"
            component={PurchaseOrg}
          />
          <PrivateRoute
            path="/CentralSetting/EvaluationPercentageConfig"
            component={EvaluationPercent}
          />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_RP_Group/EvaluationReportVendor"
            component={VendorEvaReport}
          />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_RP_Group/EvaluationReportSummary"
            component={ReportEva}
          />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_MGT_Group/SummaryEvaluation"
            component={SummaryEvaluationList}
          />
          {/* eval  setup*/}
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_Setup_Group/Criteria"
            component={Criteria}
          />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_Setup_Group/EvaluationTemplate"
            component={EvaluationTemplate}
          />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_Setup_Group/Grade"
            component={Grade}
          />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_Setup_Group/LevelPoint"
            component={LevelPoint}
          />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_Setup_Group/Kpi"
            component={Performance}
          />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_Setup_Group/KpiGroup"
            component={PerformanceGroup}
          />
          <PrivateRoute
            path="/Evaluation_Group/Evaluation_Setup_Group/Period"
            component={Period}
          />

          <PrivateRoute
            path="/CentralSetting/HolidayCalendar"
            component={Holiday}
          />
          <PrivateRoute path="/CentralSetting/Approval" component={Approval} />
          <PrivateRoute
            path="/CentralSetting/EvaluatorGroup"
            component={EvaluationGroup}
          />

          <PrivateRoute
            path="/Authorization/RoleManagement"
            component={RoleManagement}
          />
          <PrivateRoute path="/Authorization/UserRole" component={UserRole} />
          <PrivateRoute
            path="/Authorization/AuthorityCompany"
            component={AuthorityCompany}
          />

          <PrivateRoute
            path="/Vendor_Group/VendorFilter"
            component={VendorFilter}
          />
          <PrivateRoute
            path="/Vendor_Group/VendorProfile"
            component={VendorProfile}
          />
          <PrivateRoute
            path="/Vendor_Group/VendorTransection"
            component={VendorTransection}
          />
          {/* <RouterPath /> */}
          <Route path="/" component={LoginPage} />
        </Switch>
      </React.Fragment>
    </AuthContext.Provider>
  )
}

export default App
