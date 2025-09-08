import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '5%',
      left: '40%',
      width: '200px',
      height: '10px',
      borderRadius: '5px',
      overflow: 'hidden',
    }} className='bg-gray-400'>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        backgroundColor: '#4caf50',
        transition: 'width 0.3s ease-in-out'
      }} />
    </div>
  );
};

export default ProgressBar;
