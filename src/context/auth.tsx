import { createContext, useContext, useEffect, useReducer } from 'react';
import { useMeQuery, User } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface State {
    authenticated: boolean;
    user: User | null;
    loading: boolean;
}

interface Action {
    type: string;
    payload?: any;
}

const StateContext = createContext<State>({
    authenticated: false,
    user: null,
    loading: true
});

const DispatchContext = createContext<any>(null);

const reducer = (state: State, { payload, type }: Action) => {
    switch (type) {
        case 'LOGIN':
            return {
                ...state,
                authenticated: true,
                user: payload
            };
        case 'LOGOUT':
            return {
                ...state,
                authenticated: false,
                user: null
            };
        case 'STOP_LOADING':
            return {
                ...state,
                loading: false
            };
        default:
            throw new Error(`Unknown action type: ${type}`);
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, defaultDispatch] = useReducer(reducer, {
        authenticated: false,
        user: null,
        loading: true
    } as State);

    const dispatch = (type: string, payload?: any) => {
        defaultDispatch({ type, payload });
    };

    useEffect(() => {
        try {
            const { data } = useMeQuery({
                skip: isServer()
            });
            dispatch('LOGIN', data?.me);
        } catch (err) {
            console.log(err);
        } finally {
            dispatch('STOP_LOADING');
        }
    }, []);

    return (
        <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                {children}
            </StateContext.Provider>
        </DispatchContext.Provider>
    );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
