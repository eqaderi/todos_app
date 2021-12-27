const todos = [
  {
    id: 1,
    createdAt: '2021-12-25T13:42:22.000Z',
    tags: ['home'],
    color: '#53db89',
    title: 'Clean the kitchen',
    description: 'Kitchen is messy, clean it before wife comes home',
    steps: [
      {
        order: 1,
        text: 'Go to kitchen',
        done: true
      },
      {
        order: 2,
        text: 'Wash the dishes',
        done: false
      }
    ],
    dueDate: '2021-12-27T14:02:33.000Z',
    done: false
  },
  {
    id: 2,
    createdAt: '2021-12-26T13:42:22.000Z',
    tags: ['work', 'home', 'fun'],
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
      },
      {
        order: 3,
        text: 'Clean the car',
        done: false
      },
      {
        order: 4,
        text: 'Clean the car',
        done: false
      }
    ],
    dueDate: '2021-12-27T15:58:32.282Z',
    done: false
  },
  {
    id: 3,
    createdAt: '2021-12-26T13:42:22.000Z',
    tags: ['work'],
    color: '#f94a9b',
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
    dueDate: '2021-12-28T20:43:56.000Z',
    done: false
  },
  {
    id: 4,
    createdAt: '2021-12-26T13:42:22.000Z',
    tags: ['work'],
    color: '#d1ea4b',
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
    dueDate: '2021-12-30T13:44:56.000Z',
    done: false
  },
  {
    id: 5,
    createdAt: '2021-12-26T13:42:22.000Z',
    tags: ['work'],
    color: '#f98acb',
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
    dueDate: '2022-01-08T13:12:53.000Z',
    done: false
  },
  {
    id: 6,
    createdAt: '2021-12-26T13:42:22.000Z',
    tags: ['work'],
    color: '#098afb',
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
    dueDate: '2022-01-08T13:12:53.000Z',
    done: false
  }
]

export function fetchTodos () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(todos)
    }, 30)
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
