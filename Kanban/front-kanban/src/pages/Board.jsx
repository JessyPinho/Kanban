import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../assets/styles/Board.css'
import boardApi from '../api/boardApi'
import Star from '../assets/images/star-regular.svg'
import FullStar from '../assets/images/star-solid.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useDispatch } from 'react-redux'
import { setBoards } from '../redux/features/boardSlice'
import Kanban from '../components/common/Kanban'

let timer
const timeout= 500

const Board = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState([])
  const [isFavourite, setIsFavourite] = useState(false)
  const boards = useSelector((state) => state.board.value)

  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId)
        setTitle(res.title)
        setDescription(res.description)
        setSections(res.sections)
      } catch (err) {
        console.log(err)
        console.log(err)
      }
    }
    getBoard()
  }, [boardId])

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    let temp = [...boards]
    const index = temp.findIndex(e => e._id === boardId)
    temp[index] = {...temp[index], title: newTitle}
    dispatch(setBoards(temp))
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, {title: newTitle})
      } catch (err) {
        console.log(err)
      }
    }, timeout)
  }

  const updateDescription = async (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)

    let temp = [...boards]
    const index = temp.findIndex(e => e._id === boardId)
    temp[index] = {...temp[index], description: newDescription}
    dispatch(setBoards(temp))
    timer = setTimeout(async () => {
      try {
        await boardApi.update(boardId, {description: newDescription})
      } catch (err) {
        console.log(err)
      }
    }, timeout)
  }

  const addFavourite = async () => {
    try {
      await boardApi.update(boardId, { favourite: !isFavourite })
      setIsFavourite(!isFavourite)
    } catch(err) {
      console.log(err)
    }
  }

  const deleteBoard = async () => {
    try {
      await boardApi.delete(boardId)

      const newList = boards.filter(e => e._id !== boardId)
      if (newList.length === 0) {
        navigate('/boards')
        window.location.reload()
      } else {
        navigate(`/boards/${newList[0].id}`)
        window.location.reload()
      }
      dispatch(`/boards/${newList[0].id}`)
      window.location.reload()
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className='BoardDiv'>
        <button className='StarButton' onClick={addFavourite}>
          {
            isFavourite ? (
              <img src={FullStar} alt='FullStarFavorite' className='Star'/>
            ) : (
              <img src={Star} alt='StarFavorite' className='Star'/>
            )
          } 
        </button>
        <button className='DeleteButton' onClick={deleteBoard}>
          <FontAwesomeIcon icon={faTrashCan} style={{color: "#ff0000",}} className='DeleteIcon' />
        </button>
      </div>
      <div className='BoardInputs'>
        <input value={title} onChange={updateTitle} placeholder='Titre du tableau' className='BoardTitle'/>
        <textarea value={description} onChange={updateDescription} placeholder='Description du tableau' className='BoardDescription'/>
        <div>
          <Kanban data={sections} boardId={boardId} />
        </div>
      </div>
    </>
  )
}

export default Board