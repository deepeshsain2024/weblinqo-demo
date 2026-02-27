import React from 'react';
import { Outlet } from 'react-router-dom';
import { useDigitalCardExistence } from '../../../hooks/useDigitalCardExistence';
import DigitalCardCreationFlow from './digital-card-creation-flow';
import LoadingSpinner from '../../common/ui/loading-spinner';

const DigitalCardWrapper = () => {
  const { digitalCardExists, isChecking } = useDigitalCardExistence();

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  // If digital card doesn't exist, show creation flow within the dashboard layout
  if (!digitalCardExists) {
    return <DigitalCardCreationFlow />;
  }

  // If digital card exists, show normal dashboard
  return <Outlet />;
};

export default DigitalCardWrapper;
