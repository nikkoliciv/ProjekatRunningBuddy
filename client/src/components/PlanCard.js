import { useNavigate } from 'react-router-dom';

const PlanCard = ({ plan }) => {
    const navigate = useNavigate();
    const creatorName = plan.creator ? plan.creator.name : 'Unknown';

// idi na detalje plana
    const handleClick = () => {
        navigate(`/plan/${plan.id}`); 
    };

    return (
        <div 
        className="bg-white p-6 rounded-lg border-4 border-green-600 shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300"
        onClick={handleClick}
        >
            <p className="text-lg font-semibold mb-2"><strong>Place:</strong> {plan.place}</p>
            <p className="text-base mb-2"><strong>Date and time:</strong> {new Date(plan.time).toLocaleString()}</p>
            <p className="text-base mb-2"><strong>Length [km]:</strong> {plan.length}</p>
            <p className="text-base"><strong>Plan creator:</strong> {creatorName}</p>
        </div>
    );
};

export default PlanCard;
