import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { useCommentContext } from '../hooks/CommentHooks';

const PlanDetails = () => {
  const { id } = useParams(); // id plana iz urla
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { comment, dispatch } = useCommentContext();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    const fetchPlanDetails = async () => {
      try {
        
        const response = await fetch(`http://localhost:4000/api/plan/${id}`, {
          headers: { authorization: token },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setPlan(data);
        dispatch({ type: 'SET_COMMENT', payload: data.comments });
      } catch (error) {
        console.error('Error fetching plan details:', error);
        setError('Failed to load plan details');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [id, dispatch]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!plan) return <p className="text-center text-gray-500">Plan not found</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-6">Plan Details</h1>
          <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
            <p className="text-lg mb-2"><strong>Place:</strong> {plan.place}</p>
            <p className="text-lg mb-2"><strong>Date and time:</strong> {new Date(plan.time).toLocaleString()}</p>
            <p className="text-lg mb-2"><strong>Length [km]:</strong> {plan.length}</p>
            <p className="text-lg"><strong>Plan creator:</strong> {plan.creator?.name || 'Unknown'}</p>
            <p className="text-lg"><strong>Runners:</strong> {plan.itinerary.map(itinerary => (<div>{itinerary.user.name}</div>))}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-semibold mb-4">Comments</h2>
            {comment && comment.length > 0 ? (
              comment.map((comment1, index) => (
                <Comment key={index} plan={plan} comment={comment1} />
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>

          <div>
            {new Date () > new Date(plan.time) ?<CommentForm planId={plan.id} />: null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;
