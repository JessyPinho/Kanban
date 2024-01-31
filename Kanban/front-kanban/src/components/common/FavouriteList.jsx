import React, { useEffect, useState } from 'react'
import '../../assets/styles/Favourite.css'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import boardApi from '../../api/boardApi'
import { setFavouriteList } from '../../redux/features/favouriteSlice'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const FavouriteList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const list = useSelector((state) => state.favourites.value)
    const [activeIndex, setActiveIndex] = useState(0)
    const { boardId } = useParams()

    useEffect(() => {
        const getBoards = async () => {
            try {
                const res = await boardApi.getFavourites()
                dispatch(setFavouriteList(res))
            } catch (err) {
                alert(err)
            }
        }
        getBoards()
    }, [dispatch])

    const onDragEnd = () => {

    }

    return (
        <>
            <div className='FavouriteListContent'>
                <div className='FavouriteListAdd'>
                    <h2>Favoris</h2>
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
            <Droppable key={'list-board-droppable'} droppableId={'list-board-droppable'}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {
                    list.map((item, index) => (
                      <Draggable key={item._id} draggableId={item._id} index={index}>
                        {(provided, snapshot) => (
                          <div className='SidebarBoardItem' style={{cursor: snapshot.isDragging ? 'grab' : 'pointer!important'}}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          selected={activeIndex === index}
                          component={Link}
                          to={`/boards/${item._id}`}
                          >
                            <h2 className='BoardItem'>
                              {item.title}
                            </h2>
                          </div>
                        )}
                            
                          
                      </Draggable>
                    ))
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
    )
}

export default FavouriteList