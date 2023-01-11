import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getPreference, updatePreference } from '../services/api/profile';
import {
  addLocalPreference,
  getLocalPreference,
} from '../utils/localPreference';

export default function usePreference(userToken: string) {
  const [loading, setLoading] = useState(false);
  const [preference, setPreference] = useState<{ [key: string]: any }>(
    getLocalPreference()
  );

  const fetchPreference = useCallback(
    async (token: string) => {
      if (!token) return;
      if (Object.keys(preference).length > 0) return;
      if (loading) return;
      setLoading(true);
      try {
        const { data } = await getPreference(token);
        addLocalPreference(data.data);
        setPreference(data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    [preference, loading]
  );

  const postPreference = useCallback(
    async (data: {
      eventRewards: string[];
      eventTypes: string[];
      projectTypes: string[];
      contentTypes: string[];
      langs: string[];
    }) => {
      if (!userToken) return;
      try {
        await updatePreference(data, userToken);
        addLocalPreference(data);
        setPreference(data);
      } catch (error) {
        toast.error(error.message);
      }
    },
    [userToken]
  );

  useEffect(() => {
    if (!userToken) return;
    fetchPreference(userToken);
  }, [userToken]);

  return { preference, postPreference };
}
