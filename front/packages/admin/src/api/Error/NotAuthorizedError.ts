export class NotAuthorizedError extends Error {
    constructor() {
        super('You are not authorized to access this page');

        this.name = 'NotAuthorizedError';            
    }
}