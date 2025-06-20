import { useState } from "react"


const Togglable = ({childElement1, childElement2}) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisibleIsTrue = {display: visible ? 'none' : ''}
    const showWhenVisibleIsFalse = {display: visible ? '' : 'none'}

    const toggleVisibility = () => setVisible(!visible)

    return (
        <div>
            <div style={hideWhenVisibleIsTrue}>
                {childElement1(toggleVisibility)}
            </div>
            <div style={showWhenVisibleIsFalse}>
                <button onClick={toggleVisibility}>back</button>
                {childElement2}
            </div>
        </div>
    )
}

export default Togglable