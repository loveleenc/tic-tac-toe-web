import { useState } from "react"


const Togglable = (props) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisibleIsTrue = {display: visible ? 'none' : ''}
    const showWhenVisibleIsFalse = {display: visible ? '' : 'none'}

    const toggleVisibility = () => setVisible(!visible)

    return (
        <div style={{ padding: "10px" }}>
            <div style={hideWhenVisibleIsTrue}>
                <button className={props.buttonClassName} onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisibleIsFalse}>
                {props.children}
            <button style={{margin: '5px'}} className={props.buttonClassName} onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    )
}

export default Togglable