import api from "./ridesService";

export const usersService = {
  getUserPublic: async (id) => {
    const response = await api.get(`/users/${encodeURIComponent(id)}`);
    return response.data;
  },
};
