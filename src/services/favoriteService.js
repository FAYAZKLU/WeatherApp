import axios from "axios";

const API_BASE_URL = "http://localhost:8082/api/favorites"; // Spring Boot backend

const getAll = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

const add = async (favorite) => {
  const response = await axios.post(API_BASE_URL, favorite);
  return response.data;
};

const remove = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

const clearAll = async () => {
  const all = await getAll();
  await Promise.all(all.map((fav) => remove(fav.id)));
};

// ✅ Default export (fixes your error)
export default {
  getAll,
  add,
  remove,
  clearAll,
};
