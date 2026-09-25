import { useCommentContext } from "../hooks/CommentHooks";
import {jwtDecode} from 'jwt-decode';


const Comment = ({ plan, comment }) => {
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);

  const userId = decodedToken.userId;

  const { dispatch } = useCommentContext();

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
        },
      });
      const json = await response.json();
      const deletedComment = json.comment;

      if (response.ok) {
        dispatch({ type: 'DELETE_COMMENT', payload: deletedComment });
      }
    } catch (error) {
      console.error('Failed to remove comment:', error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 mb-4 rounded-lg shadow-sm">
      <p className="text-base mb-2">{comment.content}</p>
      <p className="text-sm text-gray-700 mb-2">{comment.creator.name}</p>
      <p className="text-sm text-gray-500 mb-2">{new Date(comment.createdAt).toLocaleString()}</p>
      {userId === comment.creatorId && (
        <button 
          onClick={() => handleDeleteComment(comment.id)} 
          className="text-red-500 hover:text-red-700 font-semibold"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export default Comment;
