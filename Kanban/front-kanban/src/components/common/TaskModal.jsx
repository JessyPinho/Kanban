import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faX } from '@fortawesome/free-solid-svg-icons'
import Moment from 'moment'
import '../../assets/styles/Task.css'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import taskApi from '../../api/taskApi'

let timer
const timeout = 500
let isModalClosed = false

const TaskModal = props => {
    const boardId = props.boardId
    const [task, setTask] = useState(props.task)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const editorWrapperRef = useRef()

    const updateEditorHeight = () => {
        setTimeout(() => {
          if (editorWrapperRef.current) {
            const box = editorWrapperRef.current
            box.querySelector('.ck-editor__editable_inline').style.height = (box.offsetHeight - 50) + 'px'
          }
        }, timeout)
    }

    const onClose = () => {
        isModalClosed = true
        props.onUpdate(task)
        props.onClose()
    }

    useEffect(() => {
      setTask(props.task)
      setTitle(props.task !== undefined ? props.task.title : '')
      setContent(props.task !== undefined ? props.task.content : '')
        if (props.task !== undefined) {
            isModalClosed = false
    
            updateEditorHeight()
        }
    }, [props.task])

    const deleteTask = async () => {
        try {        
            await taskApi.delete(boardId, task._id);
            props.onDelete(task);
            setTask(undefined);
        } catch (err) {
        }
    }

    const updateTitle = async (e) => {
        clearTimeout(timer)
        const newTitle = e.target.value
        timer = setTimeout(async () => {
          try {
            await taskApi.update(boardId, task._id, { title: newTitle })
          } catch (err) {
            console.log(err)
          }
        }, timeout)
    
        task.title = newTitle
        setTitle(newTitle)
        props.onUpdate(task)
    }
    
    const updateContent = async (event, editor) => {
        clearTimeout(timer)
        const data = editor.getData()


        if (!isModalClosed) {
            timer = setTimeout(async () => {
            try {
                await taskApi.update(boardId, task._id, { content: data })
            } catch (err) {
                console.log(err)
            }
            }, timeout);

            task.content = data
            setContent(data)
            props.onUpdate(task)
        }
    }

    if (task === undefined) {
        return null
    }
    return (
        <div className='Task' id='Task'>
            <div className='TaskModal' id='TaskModal'>
                <div className='TaskModalContent' >
                    <button className='ModalOffButton' id='ModalOffButtonId' onClick={onClose}>
                        <FontAwesomeIcon icon={faX} className='ModalX' id='closebutton'/>
                    </button>
                    <button className='ModalDeleteButton' onClick={deleteTask} >
                        <FontAwesomeIcon icon={faTrashCan} className='ModalTrashCan' />
                    </button>
                </div>
                <div className='TaskModalInputs'>
                    <input 
                        value={title}
                        onChange={updateTitle}
                        className='ModalTitle'
                        placeholder='Ajoutez un titre à cette tache'
                    />
                    <h2 className='ModalDate'>
                        {task !== undefined ? Moment(task.createdAt).format('DD/MM/YYYY') : '' }
                    </h2>
                    <hr style={{ margin: '1.5rem 0' }}/>
                    <h3 className='ModalEditorLabel'>Description</h3>
                    <div className='ModalEditor'>
                        <CKEditor
                            editor={ClassicEditor}
                            data={content}
                            onChange={updateContent}
                            onFocus={updateEditorHeight}
                            onBlur={updateEditorHeight}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskModal