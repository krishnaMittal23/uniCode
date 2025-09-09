import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-700 p-2 rounded-lg shadow-sm">
      <Avatar name={username} size="40" round="12px" />
      <span className="font-medium">{username}</span>
    </div>
  );
};

export default Client;
