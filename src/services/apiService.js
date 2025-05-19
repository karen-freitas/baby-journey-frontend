import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sets the JWT token for authorization in subsequent requests.
 * @param {string | null} token - The JWT token.
 */
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    localStorage.setItem("token", token);
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

/**
 * Logs in a user.
 * @param {object} credentials - LoginDTO: { email, password }
 * @returns {Promise<object>} The response data, typically including an access token.
 * @throws Will throw an error if login fails.
 */
export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    if (response.data?.token && response.data?.id) {
      setAuthToken(response.data.token);
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("loginTimestamp", new Date().toISOString());
    }
    return response.data;
  } catch (error) {
    console.error(
      "Login failed:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error("Login failed");
  }
};

/**
 * Creates a new user.
 * @param {object} userData - CreateUserDto: { name, email, password }
 * @returns {Promise<object>} The created user data.
 * @throws Will throw an error if user creation fails.
 */
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/users", userData);
    return response.data;
  } catch (error) {
    console.error(
      "Create user failed:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("User creation failed");
  }
};

/**
 * Fetches a user by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} The user data.
 * @throws Will throw an error if fetching fails.
 */
export const getUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`/users/${userId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Get user ${userId} failed:`,
      error.response ? error.response.data : error.message
    );
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.clear();
      window.location.href = '/login';
    }
    throw error.response
      ? error.response.data
      : new Error("Failed to get user");
  }
};

/**
 * Deletes a user by ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} The response data.
 * @throws Will throw an error if deletion fails.
 */
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete(`/users/${userId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Delete user ${userId} failed:`,
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Failed to delete user");
  }
};

// --- Milestone Endpoints ---
/**
 * Creates a new milestone.
 * @param {object} milestoneData - SaveRecordDTO: { userId, title, description, date, image? }
 *   - IMPORTANT: 'image' is expected to be a string (filename/identifier obtained from a separate file upload).
 * @returns {Promise<object>} The created milestone data.
 * @throws Will throw an error if creation fails.
 */
export const postMilestone = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post("/milestone", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Post milestone failed:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Failed to post milestone");
  }
};

/**
 * Updates an existing milestone.
 * @param {string} milestoneId - The ID of the milestone to update.
 * @param {object} milestoneData - SaveRecordDTO for updates.
 * @returns {Promise<object>} The updated milestone data.
 * @throws Will throw an error if update fails.
 */
export const updateMilestone = async (milestoneId, milestoneData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(
      `/milestone/${milestoneId}`,
      milestoneData,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Update milestone ${milestoneId} failed:`,
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Failed to update milestone");
  }
};

/**
 * Deletes a milestone.
 * @param {string} milestoneId - The ID of the milestone to delete.
 * @param {string} userId - The ID of the user (required as a query parameter by the API).
 * @returns {Promise<object>} The response data.
 * @throws Will throw an error if deletion fails.
 */
export const deleteMilestone = async (milestoneId, userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete(`/milestone/${milestoneId}`, {
      params: { user: userId },
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Delete milestone ${milestoneId} failed:`,
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Failed to delete milestone");
  }
};

// --- Memory Endpoints ---
/**
 * Creates a new memory.
 * @param {object} memoryData - SaveRecordDTO: { userId, title, description, date, image? }
 *   - IMPORTANT: 'image' is expected to be a string (filename/identifier obtained from a separate file upload).
 * @returns {Promise<object>} The created memory data.
 * @throws Will throw an error if creation fails.
 */
export const postMemory = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.post("/memory", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Post memory failed:",
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Failed to post memory");
  }
};

/**
 * Updates an existing memory.
 * @param {string} memoryId - The ID of the memory to update.
 * @param {object} memoryData - SaveRecordDTO for updates.
 * @returns {Promise<object>} The updated memory data.
 * @throws Will throw an error if update fails.
 */
export const updateMemory = async (memoryId, memoryData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.put(
      `/memory/${memoryId}`,
      memoryData,
      {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Update memory ${memoryId} failed:`,
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Failed to update memory");
  }
};

/**
 * Deletes a memory.
 * @param {string} memoryId - The ID of the memory to delete.
 * @param {string} userId - The ID of the user (required as a query parameter by the API).
 * @returns {Promise<object>} The response data.
 * @throws Will throw an error if deletion fails.
 */
export const deleteMemory = async (memoryId, userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.delete(`/memory/${memoryId}`, {
      params: { user: userId },
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      `Delete memory ${memoryId} failed:`,
      error.response ? error.response.data : error.message
    );
    throw error.response
      ? error.response.data
      : new Error("Failed to delete memory");
  }
};

// --- File Endpoint ---
/**
 * Downloads a specific file and returns its blob URL.
 * @param {string} filename - The name of the file to download.
 * @returns {Promise<string>} A blob URL for the downloaded file.
 * @throws Will throw an error if download fails.
 */
export const downloadFile = async (filename) => {
  if (!filename) return null;
  try {
    const token = localStorage.getItem("token");
    const response = await axiosInstance.get(`/file?filename=${filename}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
