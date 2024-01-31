import React, { useEffect, useState } from 'react'
import '../../assets/styles/Sidebar.css'
import boardApi from "../../api/boardApi"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { setBoards } from '../../redux/features/boardSlice'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import ListItemButton from './ListItemButton'


const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const boards = useSelector((state) => state.board.value)
  const { boardId } = useParams()
  const [activeIndex, setActiveIndex] = useState(0)

  const onDragEnd = async ({ source, destination }) => {
    const newList = [...boards]
    const [removed] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, removed)

    const activeItem = newList.findIndex(e => e._id === boardId)
    setActiveIndex(activeItem)
    dispatch(setBoards(newList))

    try {
      await boardApi.updatePosition({ boards: newList })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll()
        dispatch(setBoards(res))
      } catch (err) {
        console.log(err)
      }
    }
    getBoards()
  }, [dispatch])

  useEffect(() => {
    const activeItem = boards.findIndex(e => e._id === boardId )
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0]._id}`)
    }
    setActiveIndex(activeItem)
  }, [boards, boardId, navigate])

  const addBoard = async () => {
    try {
      const res = await boardApi.create()
      const newList = [res, ...boards]
      dispatch(setBoards(newList))
      navigate(`/boards/${res._id}`)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='Sidebar'>
      <div className='SidebarList'>
        <div className='SidebarListItems'>
          <div className='SidebarListContent'>
            <div className='SidebarListAdd'>
              <h2>Ajouter</h2>
              <FontAwesomeIcon icon={faSquarePlus} className='AddIcon' onClick={addBoard} />
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable key={'list-board-droppable'} droppableId={'list-board-droppable'}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {
                    boards.map((item, index) => (
                      <Draggable key={item._id} draggableId={item._id} index={index}>
                        {(provided, snapshot) => (
                          <ul className='SidebarBoardList'>
                            <ListItemButton
                              text={item.title}
                              className='SidebarBoardItem' style={{cursor: snapshot.isDragging ? 'grab' : 'pointer!important'}}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              selected={index === activeIndex}
                              component={Link}
                              to={`/boards/${item._id}`}
                            >
                            </ListItemButton>
                          </ul>
                        )}                          
                      </Draggable>
                    ))
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}

export default Sidebar