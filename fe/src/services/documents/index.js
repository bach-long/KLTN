import {instancePython} from '../../config/axios'

export const myDocuments = () => {
  return instancePython.get('/api/documents');
};
