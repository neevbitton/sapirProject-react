import { create } from 'zustand';
import { Camera, User, NewUser } from '../types';
import { useAuthStore } from './authStore'; // Store for the currently logged-in user

// Define the state and actions available in the Admin store
interface AdminState {
  users: User[];                      // List of all users
  cameras: Camera[];                  // List of all cameras
  addUser: (newUser: NewUser) => Promise<void>;   // Add a new user (only by admin)
  removeUser: (userId: string) => Promise<void>;  // Remove user by ID
  fetchCameras: () => Promise<void>;              // Fetch all cameras from server
  addCamera: (camera: Partial<Camera>) => Promise<void>; // Add a new camera
  removeCamera: (cameraId: string) => Promise<void>;     // Remove camera by ID
  fetchUsersByAdmin: () => Promise<void>;               // Fetch users assigned by this admin
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],     // Initial empty users list
  cameras: [],   // Initial empty cameras list

  // Fetch all users (no admin restriction here)
  fetchUsers: async () => {
    const res = await fetch("http://localhost:4001/api/users");
    const data = await res.json();
    set({ users: data });
  },

  // Add a new user (only if the current user is an admin)
  addUser: async (newUser: NewUser) => {
    const currentUser = useAuthStore.getState().currentUser;

    // Security check: only admins can add users
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Only admin can add users');
    }

    console.log("Sending newUser to server:", newUser); // Debugging

    // Send request to backend with the current admin info in the x-user header
    const res = await fetch("http://localhost:4001/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user": JSON.stringify(currentUser), // Admin authentication
      },
      body: JSON.stringify({ newUser }), // Send the new user object inside "newUser"
    });

    // Handle server response
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message);
    }

    // Extract the created user from response and update local state
    const { user } = await res.json();
    set((state) => ({ users: [...state.users, user] }));
  },

  // Remove a user by ID
  removeUser: async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }

      // Remove the user locally from the state
      set((state) => ({
        users: state.users.filter((u) => u._id !== userId && u.id !== userId),
      }));
    } catch (err) {
      const error = err as Error;
      console.error("Failed to delete user:", error);
      alert("Failed to delete user: " + error.message);
    }
  },

  // Fetch all cameras
  fetchCameras: async () => {
    const res = await fetch("http://localhost:4001/api/cameras");
    const data = await res.json();
    set({ cameras: data });
  },

  // Add a new camera
  addCamera: async (camera: Partial<Camera>) => {
    const res = await fetch("http://localhost:4001/api/cameras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(camera),
    });

    // Add the new camera to local state
    const newCamera = await res.json();
    set((state) => ({ cameras: [...state.cameras, newCamera] }));
  },

  // Remove a camera by ID
  removeCamera: async (cameraId: string) => {
    const res = await fetch(`http://localhost:4001/api/cameras/${cameraId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message);
    }

    // Update state by removing the deleted camera
    set((state) => ({
      cameras: state.cameras.filter((c) => c._id !== cameraId && c.id !== cameraId),
    }));
  },

  // Fetch only the users created by the currently logged-in admin
  fetchUsersByAdmin: async () => {
    const currentUser = useAuthStore.getState().currentUser;
    if (!currentUser) return;

    const res = await fetch(`http://localhost:4001/api/users/by-admin/${currentUser._id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-user': JSON.stringify(currentUser), // Required for requireAdmin middleware
      }
    });

    const data = await res.json();
    set({ users: data });
  },
}));