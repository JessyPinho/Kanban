import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import '../../assets/styles/Kanban.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons'
import sectionApi from '../../api/sectionApi'
import taskApi from '../../api/taskApi'
import TaskModal from './TaskModal'
import randomColor from "randomcolor";

let timer
const timeout = 500

const Kanban = props => {
  const boardId = props.boardId
  const [data, setData] = useState([])
  const [selectedTask , setSelectedTask ] = useState(undefined)
  const [showModal, setShowModal] = useState(false);
  const [hex, setHex] = useState('#ffffff');

  const randomiseHex = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);

    setHex(randomColor);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  useEffect(() => {
    setData(props.data)
  }, [props.data])

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return
    const sourceColIndex = data.findIndex(e => e._id === source.droppableId)
    const destinationColIndex = data.findIndex(e => e._id === destination.droppableId)
    const sourceCol = data[sourceColIndex]
    const destinationCol = data[destinationColIndex]

    const sourceSectionId = sourceCol._id
    const destinationSectionId = destinationCol._id

    const sourceTasks = [...sourceCol.tasks]
    const destinationTasks = [...destinationCol.tasks]

    if (source.droppableId !== destination.droppableId) {
      const [removed] = sourceTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[sourceColIndex].tasks = sourceTasks
      data[destinationColIndex].tasks = destinationTasks
    } else {
      const [removed] = destinationTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, removed)
      data[destinationColIndex].tasks = destinationTasks
    }

    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destinationTasks,
        resourceSectionId: sourceSectionId,
        destinationSectionId: destinationSectionId
      })
      setData(data)
    } catch (err) {
      console.log(err)
    }
  }

  const createSection = async () => {
    try {
      const section = await sectionApi.create(boardId)
      setData([...data, section])
    } catch (err) {
      console.log(err)
    }
  }

  const deleteSection = async (sectionId) => {
    try {
      await sectionApi.delete(boardId, sectionId)
      const newData = [...data].filter(e => e._id !== sectionId)
      setData(newData)
    } catch (err) {
      console.log(err)
    }
  }

  const updateSectionTitle = async (e, sectionId) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    const newData = [...data]
    const index = newData.findIndex(e => e._id === sectionId)
    newData[index].title = newTitle
    setData(newData)
    timer = setTimeout(async () => {
      try {
        await sectionApi.update(boardId, sectionId, { title: newTitle })
      } catch (err) {
        console.log(err)
      }
    }, timeout)
  }

  const createTask = async (sectionId) => {
    try {
      const task = await taskApi.create(boardId, { sectionId })
      const newData = [...data]
      const index = newData.findIndex(e => e._id === sectionId)
      newData[index].tasks.unshift(task)
      setData(newData)
    } catch (err) {
      console.log(err.message)
    }
  }

  const onUpdateTask = (task) => {
    const newData = [...data]
    const sectionIndex = newData.findIndex(e => e._id === task.section._id)
    const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id)
    newData[sectionIndex].tasks[taskIndex] = task
    setData(newData)
  }

  const onDeleteTask = (task) => {
    const newData = [...data]
    const sectionIndex = newData.findIndex(e => e._id === task.section._id)
    const taskIndex = newData[sectionIndex].tasks.findIndex(e => e._id === task._id)
    newData[sectionIndex].tasks.splice(taskIndex, 1)
    setData(newData)
  }

  

  return (
    <>
        <div className='SectionDiv'>
            <button className='SectionButton' onClick={createSection}>Ajoutez une section</button>
             <h3 className='BoardSections'>{data.length} Sections</h3>
          </div>
          <hr style={{marginTop: '10px'}} />
          <DragDropContext onDragEnd={onDragEnd}>
            <div className='KanbanBoard'>
              {
                data.map(section => (
                  <div className='Section' key={section._id}>
                    <Droppable key={section._id} droppableId={section._id}>
                      {(provided) => (
                        <div className='SectionContent' {...provided.droppableProps} ref={provided.innerRef}>
                          <div className='SectionContentList'>
                            <input 
                            value={section.title}
                            onChange={(e) => updateSectionTitle(e, section._id)} 
                            className='SectionTitle'
                            placeholder='Ajoutez un titre à cette section'
                            />
                            <button className='AddBlock' id='AddBlockId' onClick={() => createTask(section._id)}>
                              <FontAwesomeIcon icon={faPlus} className='Plus' />
                            </button>
                            <button className='DeleteBlock' onClick={() => deleteSection(section._id)}>
                              <FontAwesomeIcon icon={faTrashCan} className='Trashcan' />
                            </button>
                          </div>
                          <div className='SectionTasks'>

                          </div>
                          {
                            section.tasks.map((task, index) => (
                              <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided, snapshot) => (
                                  <div className='TaskSection'
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps} 
                                  ref={provided.innerRef}
                                  onClick={() => {setSelectedTask(task); }}
                                  >
                                    <div className='TaskContent' style={{cursor: snapshot.isDragging ? 'grab' : 'pointer!important', backgroundColor: `${hex}`}}>
                                      <h3 className='TaskTitle'>
                                        {task.title === '' ? 'Non renseigné' : task.title}
                                      </h3>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          }
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))
              }
            </div>
          </DragDropContext>
          <TaskModal task={selectedTask}  boardId={boardId} 
            onClose={() =>  setSelectedTask(undefined)} 
            onUpdate={onUpdateTask} onDelete={onDeleteTask}
          />
    </>

  )
}

export default Kanban