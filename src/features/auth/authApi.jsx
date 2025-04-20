import PrivateAxios from "../../api/PrivateAxios";
import PublicAxios from "../../api/PublicAxios";

export async function loginUser(payload) {
  const response = await PublicAxios.post("/api/auth/login", payload);
  return response.data
}

export const logoutUser = async () => {
  // return new Promise((resolve) => {
  //   setTimeout(() => resolve({ message: "Logged out" }), 500); // Simulated logout
  // });
  const response = await PrivateAxios.post("/api/auth/logout");
  return response
};

export async function updatedPasswordApi(payload){
  const response = await PrivateAxios.post("/api/auth/update-password", payload)
  return response
}

export async function updateProfileImageUrlApi(userId, payload){
  console.log('user id = ', userId);
  
  const response = await PrivateAxios.put(`/api/users/update-profile-image-url/${userId}`, {...payload})
  return response
}


