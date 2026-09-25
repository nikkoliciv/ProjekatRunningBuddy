import { AuthContext } from "../context/AuthContext";

import { useContext } from "react";

export const useAuthContext = () =>{
    const context = useContext(AuthContext)

    if (!context){
        throw Error('AuthContext must be inside AuthContextProvider')
    }


    return context
}