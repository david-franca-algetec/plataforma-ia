import {create} from 'zustand'
import {createJSONStorage, persist} from 'zustand/middleware'
import nodes from "./nodes.json";

export interface Section {
  key: string;
  title: string;
  text?: string;
  sections?: Section[];
}

export interface Homework {
  id: string;
  title: string;
  sections?: Section[];
}

export interface HomeworkState {
  homeworks: Homework[];
}

export type HomeworkActions = {
  findHomework: (id: string | null) => Homework | undefined
  addHomework: (homework: Homework) => void
  removeHomework: (id: string) => void
  totalHomeworks: () => number
}

export type HomeworkStore = HomeworkState & HomeworkActions

export const defaultInitState: HomeworkState = {
  homeworks: [{
    id: "1",
    title: "Exemplo de Trabalho",
    sections: nodes
  }]
}

// export const initCounterStore = (): CounterState => {
//   return { count: new Date().getFullYear() }
// }

export const initHomeworkStore = (): HomeworkState => {
  return {homeworks: defaultInitState.homeworks}
}

export const createHomeworkStore = (initState: HomeworkState = defaultInitState) => {
  return create(
    persist<HomeworkStore>(
      (set, get) => ({
        ...initState,
        findHomework: (id: string | null) => {
          if (!id) return
          return get().homeworks.find(homework => homework.id === id)
        },
        addHomework: (homework: Homework) => {
          set((state) => ({homeworks: [...state.homeworks, homework]}))
        },
        removeHomework: (id: string) => {
          set({homeworks: get().homeworks.filter(homework => homework.id !== id)})
        },
        totalHomeworks: () => get().homeworks.length + 1,
      }),
      {
        name: 'homework-storage', // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      },
    ),
  )
}

// export const createHomeworkStore = (
//   initState: HomeworkState = defaultInitState,
// ) => {
//   return create<HomeworkStore>((set) => ({
//     ...initState,
//     findHomework: (id: string | null) => {
//       if (!id) return defaultInitState.homeworks[0]
//       return defaultInitState.homeworks.find(homework => homework.id === id) || defaultInitState.homeworks[0]
//     },
//     addHomework: (homework: Homework) => {
//       set({homeworks: [...defaultInitState.homeworks, homework]})
//     },
//     removeHomework: (id: string) => {
//       set({homeworks: defaultInitState.homeworks.filter(homework => homework.id !== id)})
//     },
//   }))
// }