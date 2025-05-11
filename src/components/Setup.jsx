import { useState } from "react"

const Setup = ({setWidth, setHeight}) => {
    const [isSubmitted, setSubmitted] = useState(false)
    const onSubmit = (event) => {
        event.preventDefault()
        setWidth(event.target.inputWidth.value)
        setHeight(event.target.elements.inputHeight.value)
        setSubmitted(true)
    }

    if (isSubmitted){
        return (<></>)
    }
    return (
        <form onSubmit={onSubmit}>
        <p>Enter width: <input name="inputWidth"/></p>
        Enter height: <input name="inputHeight"/>
        <p><button type="submit">Create Grid</button></p>
      </form>
    )
}

export default Setup