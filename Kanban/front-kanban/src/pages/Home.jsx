import React from 'react'
import '../assets/styles/Home.css'
import { useDispatch } from 'react-redux'
import { setBoards } from '../redux/features/boardSlice'
import { useNavigate } from 'react-router-dom'
import boardApi from '../api/boardApi'
import logo from "../assets/images/planzone-logo.jpg"


const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const createBoard = async () => {
    try {
      const res = await boardApi.create()
      dispatch(setBoards([res]))
      navigate(`/boards/${res._id}`)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='HomePage'>
      <img src={logo} alt="logo" className="logo"/>
      <button className='CreateBoardButton' onClick={createBoard}>Cliquez Ici pour créer ton tableau</button>
    </div>
  )
}

export default Home