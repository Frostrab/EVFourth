import React from 'react'
import Loadable from 'react-loadable'
import { Loading } from '../../components/Loading'
export const VendorFilter = Loadable({
  loader: () => import('./VendorFilter/VendorFilter'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})

export const VendorProfile = Loadable({
  loader: () => import('./VendorProfile/VendorProfile'),
  loading: () => (
    <div>
      <Loading />
    </div>
  ),
})
