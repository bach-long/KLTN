import {instancePython} from '../../config/axios'
import qs from 'qs'

export const searchDocument = ({
  page = 1,
  per_page = 20,
  query = '',
  params = {},
}) => {
  console.log(query)
  return instancePython.get(`/api/search?page=${page}&per_page=${per_page}&query=${query}`, {
    params: params,
    paramsSerializer: (param) => qs.stringify(param),
  });
};
