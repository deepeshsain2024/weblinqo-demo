import { useEffect } from 'react';
import { checkLinkInBioExists } from '../services/api';
import useUserStore from '../stores/userStore';

export const useLinkInBioExistence = () => {
  const { 
    moduleStates, 
    setLinkInBioExists, 
    setCheckingLinkInBio 
  } = useUserStore();

  const checkExistence = async () => {
    // If already checking or already have a result, don't check again
    if (moduleStates.isCheckingLinkInBio || moduleStates.linkInBioExists !== null) {
      return moduleStates.linkInBioExists;
    }

    setCheckingLinkInBio(true);
    
    try {
      const exists = await checkLinkInBioExists();
      setLinkInBioExists(exists);
      return exists;
    } catch (error) {
      console.error('Error checking link in bio existence:', error);
      setLinkInBioExists(false);
      return false;
    }
  };

  const resetExistence = () => {
    setLinkInBioExists(null);
  };

  // Auto-check on mount if not already checked
  useEffect(() => {
    if (moduleStates.linkInBioExists === null && !moduleStates.isCheckingLinkInBio) {
      checkExistence();
    }
  }, []);

  return {
    linkInBioExists: moduleStates.linkInBioExists,
    isChecking: moduleStates.isCheckingLinkInBio,
    checkExistence,
    resetExistence,
  };
};
