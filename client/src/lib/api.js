import axiosInstance from "./axios";

// ================= PRODUCTS =================
export const productApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/admin/products");
    return data;
  },

  create: async (formData) => {
    const { data } = await axiosInstance.post("/admin/products", formData);
    return data;
  },

  update: async ({ id, formData }) => {
    const { data } = await axiosInstance.put(`/admin/products/${id}`, formData);
    return data;
  },

  delete: async (productId) => {
    const { data } = await axiosInstance.delete(`/admin/products/${productId}`);
    return data;
  },
};

// ================= ORDERS =================
export const orderApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/admin/orders");
    return data;
  },

  updateStatus: async ({ orderId, status }) => {
    const { data } = await axiosInstance.patch(
      `/admin/orders/${orderId}/status`,
      { status },
    );
    return data;
  },
};

// ================= STATS =================
export const statsApi = {
  getDashboard: async () => {
    const { data } = await axiosInstance.get("/admin/stats");
    return data;
  },
};

// ================= CUSTOMERS =================
export const customerApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/admin/customers");
    return data;
  },
};

// ================= CATEGORIES =================
export const categoryApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("/categories");
    return data;
  },

  getById: async (id) => {
    const { data } = await axiosInstance.get(`/categories/${id}`);
    return data;
  },

  create: async (body) => {
    const { data } = await axiosInstance.post("/categories", body);
    return data;
  },

  update: async ({ id, body }) => {
    const { data } = await axiosInstance.put(`/categories/${id}`, body);
    return data;
  },

  delete: async (id) => {
    const { data } = await axiosInstance.delete(`/categories/${id}`);
    return data;
  },
};
