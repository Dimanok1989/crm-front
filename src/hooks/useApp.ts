import { AppContext } from '@/crm/Provider';
import { useContext } from 'react';

export const useApp = () => useContext(AppContext);
