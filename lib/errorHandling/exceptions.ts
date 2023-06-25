export class AuthRequiredError extends Error{
    constructor(message = 'an error occurred, it can occur because no data is loaded or because of the internal server'){
        super(message)
        this.name = 'AuthRequiredError'
    }
}