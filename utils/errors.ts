class AuthenticationError extends Error{
    constructor(){
        super('Authentication failed! Invalid username or password')
        this.name = 'AuthenticationError'
    }
}

export default AuthenticationError