const InitialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage' },
    'task-2': { id: 'task-2', content: 'Do the dishes' },
    'task-3': { id: 'task-3', content: 'Finish homework' },
    'task-4': { id: 'task-4', content: 'Walk the dog' },
    'task-5': { id: 'task-5', content: 'Prepare dinner' },
  },
  columns:{
    'column-1':{
      id:'column-1',
      title:'To-do',
      taskIds:['task-1','task-2','task-3','task-4'],
    }
  },
  columnOrder:['column-1']
}

export default InitialData