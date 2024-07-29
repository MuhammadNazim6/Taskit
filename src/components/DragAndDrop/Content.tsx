import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import Api from "@/services/api";
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { RiArrowGoBackLine } from "react-icons/ri";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "../ui/input";
import { MdDeleteOutline } from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


const Content = () => {
  const { taskUserInfo } = useSelector((state: RootState) => state.auth)

  const closeAddTaskModal = useRef()
  const [columns, setColumns] = useState({})
  const [newTask, setNewTask] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const response = await Api.get('/get-tasks', {
      params: { userId: taskUserInfo._id }
    })
    if (response.data.success) {
      const result = response.data.data[0]
      if (result) {
        setColumns({
          todo: result.todo || { name: 'To do', items: [] },
          progress: result.progress || { name: 'In Progress', items: [] },
          done: result.done || { name: 'Done', items: [] }
        });
      } else {
        setColumns({
          todo: { name: 'To do', items: [] },
          progress: { name: 'In Progress', items: [] },
          done: { name: 'Done', items: [] }
        });
      }
    }
  }


  const onDragEnd = result => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    console.log(source);
    console.log(destination);
    console.log(removed);

    switchStatus(destination.droppableId, removed.id)

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        }
      })
    } else {
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      })
    }
  }


  const handleAddTask = async () => {
    const data = { content: newTask, userId: taskUserInfo._id }
    const response = await Api.post('/add-task', data)
    console.log(response.data.success);
    if (response.data.success) {
      setColumns({
        ...columns,
        todo: {
          name: "To do", items: [...columns.todo.items, { id: response.data.data._id, content: newTask }]
        }
      })
      setNewTask('')
      toast({
        description: "Task added successfully.",
      })
      if (closeAddTaskModal.current) {
        closeAddTaskModal.current.click();
      }
    } else {
      toast({
        description: response.data.message,
      })
    }
  }

  const switchStatus = async (status, taskId) => {
    const data = { status, taskId }
    const response = await Api.patch('/switch-status', data)
  }

  const handleIsEditing = async (task) => {
    setEditedTask(task)
    setIsEditing(true)
  }

  const handleSaveEditedTask = async (taskId) => {
    const data = { taskId, content: editedTask }
    const response = await Api.patch('/edit-task', data)
    if (response.data.success) {
      setIsEditing(false)
      fetchTasks()
    }
  }

  const handleDeleteTask = async (taskId) => {
    const response = await Api.delete('/delete-task', {
      params: { taskId }
    })
    if (response.data.success) {
      setIsEditing(false)
      fetchTasks()
      toast({
        description: response.data.message,
      })
    }
  }

  return (
    <>
    <h1 className="text-center text-xl mt-5 select-none ">Hello {taskUserInfo.name.split(' ')[taskUserInfo.name.split(' ').length-1]} !</h1>
      <div className="w-full flex md:pl-36 justify-center md:justify-normal pt-10 select-none">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="outline outline-1">Add new task</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add new task</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="flex justify-center items-center mt-9">
                  <Input placeholder="Your task here..." className='outline outline-1' value={newTask} onChange={(e) => setNewTask(e.target.value)} />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="p-5">
              <AlertDialogCancel ref={closeAddTaskModal}>Cancel</AlertDialogCancel>
              <Button variant="default" onClick={handleAddTask}>Add now</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="" style={{ display: 'flex', justifyContent: 'center', height: '100%' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="md:flex">
            {Object.entries(columns).map(([columnId, column], index) => {
              return (
                <div style={{ margin: 8 }} key={columnId}>
                  <h2 className="text-centr p-2 text-sm select-none">{column?.name}</h2>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          className="rounded outline outline-1 "
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            // background: snapshot.isDraggingOver
                            //   ? 'white' : '#D6E5EC',
                            padding: 19,
                            width: 240,
                            minHeight: 250
                          }}
                        >
                          {column?.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <div
                                          className="outlin outline-1 bg-secondary text-primary"
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            userSelect: 'none',
                                            padding: 16,
                                            margin: "0 0 8px 0",
                                            minHeight: "50px",
                                            // backgroundColor: snapshot.isDragging
                                            //   ? "#4e6a80"
                                            //   : "#75909f",
                                            // color: 'white',
                                            borderRadius: '4px',
                                            ...provided.draggableProps.style
                                          }}
                                        >
                                          <p className="text-sm tracking-wider"> {item.content}</p>
                                        </div>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader className="select-none">
                                          <AlertDialogTitle>Task details</AlertDialogTitle>
                                          <AlertDialogDescription className="">
                                            <div className="flex h-full pt-5 justify-between">
                                              <p className="w-full pr-8">
                                                {isEditing ? (<Input placeholder="Your task here..." value={editedTask} className='outline outline-1 w-full overflow-y-scroll custom-scrollbar' onChange={(e) => setEditedTask(e.target.value)} />
                                                ) : (<>
                                                  <p className="text-lg items-center w-full max-h-60 overflow-y-scroll custom-scrollbar">{item.content} </p>
                                                  <p className="text-sm items-center pt-32"> Updated at: {new Date(item.updatedAt).toLocaleString()}</p>
                                                </>)}

                                              </p>
                                              <div className="mt-10 space-y-6">
                                                {isEditing
                                                  ? (<>
                                                    <Button variant="default" className="block w-16 p-1" onClick={() => handleSaveEditedTask(item.id)}>Save</Button>
                                                    <Button variant="outline" onClick={() => setIsEditing(false)} className="block w-16 p-1">Cancel</Button> </>
                                                  )
                                                  : (<>
                                                    <Button variant="default" className="block" onClick={() => handleIsEditing(item.content)}><LuClipboardEdit className="text-xl" /></Button>

                                                    <AlertDialog>
                                                      <AlertDialogTrigger asChild>
                                                        <Button variant="default" className="block bg-red-900 hover:bg-red-950 text-white"><MdDeleteOutline className="text-2xl" /></Button>
                                                      </AlertDialogTrigger>
                                                      <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            This action cannot be undone.
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                          <AlertDialogAction onClick={() => handleDeleteTask(item.id)}>Delete </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                      </AlertDialogContent>
                                                    </AlertDialog>


                                                    <AlertDialogCancel onClick={() => setIsEditing(false)} className="block"><RiArrowGoBackLine className="text-lg" /></AlertDialogCancel>
                                                  </>)}

                                              </div>
                                            </div>
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>

                                      </AlertDialogContent>
                                    </AlertDialog>

                                  )
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>
    </>
  )
}

export default Content