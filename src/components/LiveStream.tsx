import React from 'react';

const LiveStream: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <img
        src="http://localhost:5000/video_feed"
        alt="Live Stream"
        className="rounded-2xl shadow-xl max-w-full"
      />
    </div>
  );
};

export default LiveStream;