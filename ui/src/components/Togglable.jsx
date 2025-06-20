import { useState } from "react"


const Togglable = ({childElement1, childElement2}) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisibleIsTrue = {display: visible ? 'none' : ''}
    const showWhenVisibleIsFalse = {display: visible ? '' : 'none'}

    const toggleVisibility = () => setVisible(!visible)

    return (
        <div>
            <div style={hideWhenVisibleIsTrue}>
                {childElement1}
            </div>
            <div style={showWhenVisibleIsFalse}>
                {childElement2()}
            </div>
        </div>
    )
}

export default Togglable