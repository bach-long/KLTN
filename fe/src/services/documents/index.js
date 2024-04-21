import {instancePython} from '../../config/axios'

export const myDocuments = (parentId = null, marked = null, deleted = null, type = null, start = null, end = null) => {
  return instancePython
  .get(`/api/documents?parent_id=${parentId ?? ''}&marked=${marked ?? ''}&deleted=${deleted ?? ''}&type=${type ?? ''}&start=${start ?? ''}&end=${end ?? ''}`);
};

export const storeDocument = (data) => {
  return instancePython.post('/api/store', data);
};

export const getMetadata = (id) => {
  return instancePython.get(`/api/documents/${id}`);
};

export const getContent = (id) => {
  return instancePython.get(`/api/content/${id}`);
};

export const updateDocument = (id, data) => {
  return instancePython.put(`/api/documents/${id}`, data);
}

export const toggleTrash = (id, data) => {
  return instancePython.put(`/api/trash/${id}`, data);
}

export const getMovingMenu = (parentId = null) => {
  console.log(parentId)
  return instancePython.get(`/api/move?parent_id=${parentId ?? ''}`);
}

export const permanentDelete = (id) => {
  return instancePython.delete(`/api/delete/${id}`);
}

export const saveDocument = (id, data) => {
  return instancePython.post(`/api/save/${id}`, data);
}
