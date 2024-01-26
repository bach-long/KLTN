import {instancePython} from '../../config/axios'

export const storeDocument = (data) => {
  return instancePython.post('/api/store', data);
};
