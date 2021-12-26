const todos = [
  {
    id: 1,
    createdAt: new Date().toJSON(),
    type: 'home',
    color: '#53db89',
    title: 'Clean the kitchen',
    description: 'Kitchen is messy, clean it before wife comes home',
    steps: [
      {
        order: 1,
        text: 'Go to kitchen',
        done: false
      },
      {
        order: 2,
        text: 'Wash the dishes',
        done: false
      }
    ],
    dueDate: new Date().toJSON(),
    done: false
  },
  {
    id: 2,
    createdAt: new Date().toJSON(),
    type: 'work',
    color: '#f98a4b',
    title: 'Wash the car',
    description: 'Car is messy, clean it before the trip',
    steps: [
      {
        order: 1,
        text: 'Go to parking lot',
        done: false
      },
      {
        order: 2,
        text: 'Clean the car',
        done: false
      }
    ],
    dueDate: new Date().toJSON(),
    done: false
  }
]

export function fetchTodos () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(todos)
    }, 100)
  })
}

export function updateTodo (req) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const reqId = req.id
      const index = todos.findIndex(({ id }) => +id === +reqId)

      const reqAllStepsDone = req.steps.every(({ done }) => done)
      const reqDone = req.done
      const currentAllStepsDone = todos[index].steps.every(({ done }) => done)

      if (req.steps.length) {
        if (reqAllStepsDone && !currentAllStepsDone && !reqDone) {
          req.done = true
        } else if (!reqAllStepsDone && currentAllStepsDone && reqDone) {
          req.done = false
        } else if (!reqAllStepsDone && reqDone) {
          req.steps.forEach((element) => {
            element.done = true
          })
        } else if (currentAllStepsDone && !reqDone) {
          req.steps.forEach((element) => {
            element.done = false
          })
        }
      }

      todos[index] = JSON.parse(JSON.stringify(req))
      resolve(todos[index])
    }, 2000)
  })
}
