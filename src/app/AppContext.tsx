import { createContext } from 'react';

type ApplicationState = {
    isLoading: boolean,
    isSignedIn: boolean,
    userInfo?: User,
    userMessage?: string
}
export declare interface User {
    firstName: string,
    email: string
    sub?: string,
    email_verified?: boolean
}

export const initialContext: ApplicationState = {
    isLoading: true,
    isSignedIn: false
}

export const UserContext = createContext(initialContext);