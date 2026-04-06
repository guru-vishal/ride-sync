import api from "./ridesService";

const normalizeUser = (data) => {
  const candidate = data?.user ?? data;
  return {
    userId: candidate?.userId ?? candidate?.id ?? "",
    name: candidate?.name ?? candidate?.fullName ?? "",
    role: candidate?.role ?? "rider",
    email: candidate?.email ?? "",
    mobile: candidate?.mobile ?? candidate?.phone ?? "",
  };
};

export const authService = {
  login: async ({ identifier, email, mobile, userId, password }) => {
    const trimmedIdentifier = (identifier || "").toString().trim();
    const fallbackIdentifier = (email || mobile || userId || "").toString().trim();
    const emailOrMobile = trimmedIdentifier || fallbackIdentifier;

    const payload = { emailOrMobile, password };
    const response = await api.post("/auth/login", payload);

    const token = response?.data?.token;
    if (token) localStorage.setItem("ridesync_token", token);

    return normalizeUser(response.data);
  },

  signup: async ({ name, email, mobile, password, confirmPassword }) => {
    const payload = { name, email, mobile, password, confirmPassword };
    const response = await api.post("/auth/signup", payload);

    const token = response?.data?.token;
    if (token) localStorage.setItem("ridesync_token", token);

    return normalizeUser(response.data);
  },
};
