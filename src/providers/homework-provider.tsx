'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'
import {type HomeworkStore, createHomeworkStore, initHomeworkStore} from "@/stores/homework-store";

export const HomeworkStoreContext = createContext<StoreApi<HomeworkStore> | null>(
  null,
)

export interface HomeworkStoreProviderProps {
  children: ReactNode
}

export const HomeworkStoreProvider = ({
                                       children,
                                     }: HomeworkStoreProviderProps) => {
  const storeRef = useRef<StoreApi<HomeworkStore>>()
  if (!storeRef.current) {
    storeRef.current = createHomeworkStore(initHomeworkStore())
  }

  return (
    <HomeworkStoreContext.Provider value={storeRef.current}>
      {children}
    </HomeworkStoreContext.Provider>
  )
}

export const useHomeworkStore = <T,>(
  selector: (store: HomeworkStore) => T,
): T => {
  const counterStoreContext = useContext(HomeworkStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useHomeworkStore must be use within CounterStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}