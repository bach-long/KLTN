import {instancePython} from '../../config/axios'

export const myDocuments = (parent_id = null, marked = null, deleted = null) => {
  return instancePython.get(`/api/documents?parent_id=${parent_id ?? ''}&marked=${marked ?? ''}&deleted=${deleted ?? ''}`);
};

export const storeDocument = (data) => {
  return instancePython.post('/api/store', data);
};

export const getMetadata = (id) => {
  return instancePython.get(`/api/documents/${id}`);
};
