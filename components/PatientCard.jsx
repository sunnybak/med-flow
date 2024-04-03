"use client";

const PatientCard = ({ key, patient }) => {

  const handlePatientClick = () => {

  };

  if (!patient) return (<h1>Loading...</h1>);
  return (
    <div className='prompt_card'>
      <div className='flex justify-between items-start gap-5'>
        <div
          className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
          onClick={handlePatientClick}
        >
          <div className='flex flex-col'>
            <h3 className='font-satoshi font-semibold text-gray-900'>
              {patient.name}
            </h3>
            <p className='font-inter text-sm text-gray-500'>
              {patient.complaint}
            </p>
          </div>
        </div>
      </div>

      <p className='my-4 font-satoshi text-sm text-gray-700'>{patient.assignedClinic}</p>
    </div>
  );
};

export default PatientCard;