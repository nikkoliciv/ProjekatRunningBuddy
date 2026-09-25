import { createContext, useReducer } from "react";

export const CommentContext = createContext();

export const commentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COMMENT':
      return {
        comment: action.payload
      };
    case 'ADD_COMMENT':
      return {
        comment: [action.payload, ...state.comment] // Ensure state.comment is an array
      };
    case 'DELETE_COMMENT':
      return {
        comment: state.comment.filter((c) => c.id !== action.payload.id)
      };
    default:
      return state;
  }
};

export const CommentContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, {
    comment: [] // Initialize as an empty array
  });

  return (
    <CommentContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CommentContext.Provider>
  );
};
