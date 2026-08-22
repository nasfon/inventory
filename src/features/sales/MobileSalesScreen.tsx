import { useState } from 'react'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import History from '@mui/icons-material/History'
import PointOfSale from '@mui/icons-material/PointOfSale'
import MobileNewSaleFlow from './MobileNewSaleFlow'
import MobileSalesHistory from './MobileSalesHistory'

interface MobileSalesScreenProps {
  initialTab?: 'new' | 'history'
}

export default function MobileSalesScreen({ initialTab = 'new' }: MobileSalesScreenProps) {
  const [tab, setTab] = useState<'new' | 'history'>(initialTab)

  return (
    <Box>
      <ToggleButtonGroup
        value={tab}
        exclusive
        onChange={(_event, value) => value && setTab(value)}
        size="small"
        sx={{ mb: 1.5, width: '100%' }}
      >
        <ToggleButton value="new" sx={{ flex: 1, textTransform: 'none' }}>
          <PointOfSale fontSize="small" sx={{ mr: 0.5 }} />
          New Sale
        </ToggleButton>
        <ToggleButton value="history" sx={{ flex: 1, textTransform: 'none' }}>
          <History fontSize="small" sx={{ mr: 0.5 }} />
          History
        </ToggleButton>
      </ToggleButtonGroup>

      {tab === 'new' ? <MobileNewSaleFlow /> : <MobileSalesHistory />}
    </Box>
  )
}
