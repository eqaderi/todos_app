import { debounce } from 'lodash'
const commitLoaderUpdate = (commit, status, item) =>
  commit('UPDATE_LOADER', {
    status,
    todoId: item ? item.id : 'all'
  })

export function debouncedAction ({
  context,
  item,
  leading = false,
  wait = 500,
  updateLoaderWait = 500,
  apiFunction,
  dataMutation
}) {
  return debounce(
    async () => {
      const updateLoader = commitLoaderUpdate(context.commit, true, item)
      const dbUpdateLoader = debounce(updateLoader, updateLoaderWait)
      dbUpdateLoader()

      const result = await apiFunction(item)

      dbUpdateLoader.cancel()
      context.commit(dataMutation, { result })
      commitLoaderUpdate(context.commit, false, item)
    },
    wait,
    { leading }
  )
}

export function sm ({
  context,
  item,
  updateLoaderWait = 500,
  apiFunction,
  dataMutation
}) {
  return async () => {
    const updateLoader = commitLoaderUpdate(context.commit, true, item)
    const dbUpdateLoader = debounce(updateLoader, updateLoaderWait)
    dbUpdateLoader()

    const result = item ? await apiFunction(item) : await apiFunction(item)
    console.log({ result })

    dbUpdateLoader.cancel()
    context.commit(dataMutation, { result })
    commitLoaderUpdate(context.commit, false, item)
  }
}
