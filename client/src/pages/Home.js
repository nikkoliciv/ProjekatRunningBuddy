import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-green-50 p-4 pt-20">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-4xl font-bold text-green-600 mb-6">Running Facts</h1>
          <div className="flex items-center text-green-800 text-lg bg-white rounded-[20px] p-4 shadow-md">
            <span className="material-symbols-outlined mr-2">directions_run</span>
            Running can reduce your risk of cardiovascular disease by 45%.
          </div>
          <div className="flex items-center text-green-800 text-lg bg-white rounded-[20px] p-4 shadow-md">
            <span className="material-symbols-outlined mr-2">local_fire_department</span>
            A 160-pound person burns approximately 606 calories by running for an hour at a 5-mph pace.
          </div>
          <div className="flex items-center text-green-800 text-lg bg-white rounded-[20px] p-4 shadow-md">
            <span className="material-symbols-outlined mr-2">mood</span>
            Running can improve your mental health and help alleviate symptoms of depression.
          </div>
          <div className="flex items-center text-green-800 text-lg bg-white rounded-[20px] p-4 shadow-md">
            <span className="material-symbols-outlined mr-2">fitness_center</span>
            Regular running strengthens your muscles and improves overall fitness.
          </div>
          <div className="flex items-center text-green-800 text-lg bg-white rounded-[20px] p-4 shadow-md">
            <span className="material-symbols-outlined mr-2">self_improvement</span>
            Running boosts your immune system and can increase your life expectancy.
          </div>
          <div className="mt-6 space-x-4 flex justify-center">
            
              <Link to='/register' className="hover:text-green-800"><h5 className="text-green-600 text-lg font-bold bg-white rounded-[20px] p-4 shadow-md">Register </h5></Link>
            
            
              <Link to='/login' className="hover:text-green-800"><h5 className="text-green-600 text-lg font-bold bg-white rounded-[20px] p-4 shadow-md">Login </h5></Link>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
