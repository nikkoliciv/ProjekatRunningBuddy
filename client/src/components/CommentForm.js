import { useState } from "react";
import { useCommentContext } from "../hooks/CommentHooks";

const CommentForm = ({ planId }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const { dispatch } = useCommentContext();
  const token = sessionStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (token) {
      const comment = { content };
      try {
        const response = await fetch(`http://localhost:4000/api/comment/${planId}`, {
          method: 'POST',
          body: JSON.stringify(comment),
          headers: {
            'Content-Type': 'application/json',
            'authorization': token,
          },
        });

        const json = await response.json();
        if (!response.ok) {
          setError(json.error);
          setEmptyFields(json.emptyFields || []);
        } else {
          setEmptyFields([]);
          setError(null);
          setContent('');
          dispatch({ type: 'ADD_COMMENT', payload: json.comment });
        }
      } catch (error) {
        console.error('Failed to decode token:', error);
        setError('Failed to decode token.');
      }
    } else {
      setError('No token found. Please log in.');
    }
  };

  return (
    <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
      <label className="block text-lg font-medium mb-2">Add Comment:</label>
      <input
        type="text"
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className={`w-full p-2 border rounded-lg ${emptyFields.includes('content') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      <button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add comment
      </button>
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </form>
  );
};

export default CommentForm;
