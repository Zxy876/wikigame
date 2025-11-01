// 简化的 store，避免 @reduxjs/toolkit 依赖问题
export const store = {
  // 空的 store 实现
  getState: () => ({}),
  dispatch: (action: any) => action,
  subscribe: (listener: () => void) => () => {}
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
