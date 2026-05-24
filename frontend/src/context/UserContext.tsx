import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

export type User = {
    accessToken: string
}

export type UserContextType = {
    user: User,
    setUser: Dispatch<SetStateAction<User>>
}

export const UserContext = createContext<UserContextType>({
    user: { 
        accessToken: "" 
    },
    setUser: () => {}
}) // default value required. l;iterally doesnt matter as will be overwritten

type UserProvidedProp = {
    children: ReactNode
}

export default function UserProvider({children}: UserProvidedProp) {
    const [user, setUser] = useState<User>({
        accessToken: ""
    })

    return <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
}