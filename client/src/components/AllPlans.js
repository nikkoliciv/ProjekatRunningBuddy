import React from 'react';
import PlanCard from './PlanCard'; 

const AllPlans = ({ plans }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-600 mb-4">All Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.length > 0 ? (
          plans.map(plan => (
            <div key={plan.id} className="bg-white p-4 rounded-lg shadow-md">
              <PlanCard plan={plan} />
            </div>
          ))
        ) : (
          <p className="text-gray-600">No plans available.</p>
        )}
      </div>
    </div>
  );
};

export default AllPlans;
