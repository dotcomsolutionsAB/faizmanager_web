import React from 'react'
import AppTheme from '../../styles/AppTheme'
import { CssBaseline } from '@mui/material'

import HierarchyComponent from '../../components/hierarchy/HierarchyComponent';

const Hierarchy = () => {
  return (
    <AppTheme>
        <CssBaseline />
        <HierarchyComponent />
    </AppTheme>
  )
}

export default Hierarchy