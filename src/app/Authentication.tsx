export enum AuthenticationEvents {
  BOOTSTRAP_COMPLETE,
  SIGN_IN,
  SIGN_OUT
}

export const initialState = {
    isLoading: true,
    isSignedIn: false,
    userInfo: null
}

export function authenticationReducer(prevState: any, action: any) {
    switch (action.type) {
        case AuthenticationEvents.BOOTSTRAP_COMPLETE:
            return {
                ...prevState,
                isLoading: false,
            };
        case AuthenticationEvents.SIGN_IN:
            return {
                ...prevState,
                isSignedIn: true,
                userInfo: action.userInfo
            }
        case AuthenticationEvents.SIGN_OUT:
            return {
                ...prevState,
                isSignedIn: false,
                userInfo: null
            }
    }
}