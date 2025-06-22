

const FormInput = ({text, fieldName, type}) => {
    if (type === "number"){
        return (
            <p style={{fontWeight: "bold"}}>
                {text}<input type={type} className="formInput" name={fieldName} min="3" onWheel={(event) => event.target.blur()}/>
            </p>
        )
    }

    return (
        <p style={{fontWeight: "bold"}}>
            {text}<input type={type} className="formInput" name={fieldName}/>
        </p>
    )
}

export default {
    FormInput
}