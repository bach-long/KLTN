import {instancePython} from '../../config/axios'

export const myDocuments = (parent_id) => {
  return instancePython.get(`/api/documents?parent_id=${parent_id ?? ''}`);
};

export const storeDocument = (data) => {
  return instancePython.post('/api/store', data);
};
