import { createContext, useContext } from 'react'

export interface MobileNavValue {
  isMobile: boolean
  setTitle: (title: string | null) => void
  setShowBack: (show: boolean) => void
  setRefresh: (refresh: (() => unknown) | null) => void
}

const noop = () => {}

const defaultValue: MobileNavValue = {
  isMobile: false,
  setTitle: noop,
  setShowBack: noop,
  setRefresh: noop,
}

export const MobileNavContext = createContext<MobileNavValue>(defaultValue)

export function useMobileNav() {
  return useContext(MobileNavContext)
}
