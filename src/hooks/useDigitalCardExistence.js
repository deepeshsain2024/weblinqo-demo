import { useEffect } from 'react';
import { checkDigitalCardExists } from '../services/api';
import useUserStore from '../stores/userStore';
import dcLinkApi from '../services/dcLinkApi';

export const useDigitalCardExistence = () => {
  const { 
    moduleStates, 
    setDigitalCardExists, 
    setCheckingDigitalCard 
  } = useUserStore();

  const checkExistence = async () => {
    // If already checking or already have a result, don't check again
    if (moduleStates.isCheckingDigitalCard || moduleStates.digitalCardExists !== null) {
      return moduleStates.digitalCardExists;
    }

    setCheckingDigitalCard(true);
    
    try {
      const exists = await checkDigitalCardExists();
      setDigitalCardExists(exists);
      await dcLinkApi.fetchDcData();
      return exists;
    } catch (error) {
      console.error('Error checking digital card existence:', error);
      setDigitalCardExists(false);
      return false;
    }
  };

  const resetExistence = () => {
    setDigitalCardExists(null);
  };

  // Auto-check on mount if not already checked
  useEffect(() => {
    if (moduleStates.digitalCardExists === null && !moduleStates.isCheckingDigitalCard) {
      checkExistence();
    }
  }, []);

  return {
    digitalCardExists: moduleStates.digitalCardExists,
    isChecking: moduleStates.isCheckingDigitalCard,
    checkExistence,
    resetExistence,
  };
};
