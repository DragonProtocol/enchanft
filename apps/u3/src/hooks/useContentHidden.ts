import { useCallback, useEffect, useMemo, useState } from 'react';
import { addOrRemoveFromLocal, getLocalData } from '../utils/contentStore';

export default function useContentHidden() {
  const [localData, setLocalData] = useState<{
    [key: number | string]: number | string;
  }>({});

  useEffect(() => {
    const data = getLocalData();
    setLocalData(data);
  }, []);

  const contentHiddenOrNot = useCallback((id: number | string) => {
    const data = addOrRemoveFromLocal(id);
    setLocalData(data);
  }, []);

  const keysFilter = useMemo(() => {
    return Object.values(localData);
  }, [localData]);

  return {
    keysFilter,
    contentHiddenOrNot,
  };
}
