class AuthenticationError extends Error{
    constructor(){
        super('Authentication failed! Invalid username or password')
        this.name = 'AuthenticationError'
    }
}

class DeactivatedAccountError extends Error{
    constructor(){
        super('Unable to login. Account is still inactive. Please activate your account using the activation link sent to your e-mail.')
        this.name = 'DeactivatedAccountError'
    }
}

class NotCurrentPlayerError extends Error{
    constructor(){
        super('You are not the current player in the game. Please wait your turn.')
        this.name = 'NotCurrentPlayerError';
    }
}

export default {
    AuthenticationError,
    DeactivatedAccountError,
    NotCurrentPlayerError
}