import { createContext, useReducer } from "react";

export const PlansContext = createContext()

export const plansReducer = (state,action)=>{

    switch (action.type){
        case 'SET_PLAN':
            return{
                plans:action.payload
            }
        case 'ADD_PLAN':
            return{
                plans:[action.payload, ...state.plans]
            }
        case 'DELETE_PLAN':
        return{
            plans:state.plans.filter((w)=>w.id !== action.payload.id)
        }
        default:
            return state    
            
    }

}

export const PlansContextProvider = ({children}) => {

    const [state, dispatch]=useReducer(plansReducer,{
        plans: []
    })




    return (
        <PlansContext.Provider value={{...state, dispatch}}>
            {children}
        </PlansContext.Provider>
    )
}