import React, { createContext, useContext, useState, useCallback } from "react";
import { getUser, downloadFile } from '../services/apiService';

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const [memories, setMemories] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [imageCache, setImageCache] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUserAndImages = useCallback(async (force = false) => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      const user = await getUser(userId);

      const memArr = await Promise.all(
        (user.memories || []).map(async (m) => {
          let url = imageCache[m._id];
          if (!url && m.image) {
            url = await downloadFile(m.image);
            setImageCache(prev => ({ ...prev, [m._id]: url }));
          }
          return { ...m, file: url, type: "memory" };
        })
      );
      const milArr = await Promise.all(
        (user.milestones || []).map(async (m) => {
          let url = imageCache[m._id];
          if (!url && m.image) {
            url = await downloadFile(m.image);
            setImageCache(prev => ({ ...prev, [m._id]: url }));
          }
          return { ...m, file: url, type: "milestone" };
        })
      );
      setMemories(memArr);
      setMilestones(milArr);
    } catch {
      setMemories([]);
      setMilestones([]);
    }
    setLoading(false);
  }, [imageCache]);

  // ADD
  const addItem = async (item, type) => {
    if (type === "memory") setMemories((prev) => [...prev, { ...item}]);
    else setMilestones((prev) => [...prev, { ...item}]);
  };

  // EDIT
  const updateItem = async (updated, type) => {
    if (type === "memory") {
      setMemories((arr) =>
        arr.map((m) =>
          m._id === updated._id
            ? { ...m, title: updated.title, description: updated.description, date: updated.date }
            : m
        )
      );
    } else {
      setMilestones((arr) =>
        arr.map((m) =>
          m._id === updated._id
            ? { ...m, title: updated.title, description: updated.description, date: updated.date }
            : m
        )
      );
    }
  };

  // DELETE
  const deleteItem = (deletedId, type) => {
    if (type === "memory") setMemories(arr => arr.filter(m => m._id !== deletedId));
    else setMilestones(arr => arr.filter(m => m._id !== deletedId));
    setImageCache(prev => {
      const result = { ...prev };
      delete result[deletedId];
      return result;
    });
  };

  const resetContext = () => {
    setMemories([]);
    setMilestones([]);
    setImageCache({});
  };

  return (
    <UserDataContext.Provider
      value={{
        memories,
        milestones,
        loading,
        fetchUserAndImages,
        addItem,
        updateItem,
        deleteItem,
        resetContext
      }}>
      {children}
    </UserDataContext.Provider>
  );
};

export function useUserData() {
  return useContext(UserDataContext);
}