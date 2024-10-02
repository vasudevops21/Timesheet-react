// import { useState, useEffect } from "react";
// import axios from "axios";
 
// const useUserProfile = () => {
//   const [imageSrc, setImageSrc] = useState(null);
//   const [userProfile, setUserProfile] = useState({});
//   const [userId, setUserId] = useState("");
 
//   const fetchImage = async (userId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/profile/image/${userId}`,
//         {
//           responseType: "arraybuffer",
//         }
//       );
//       const blob = new Blob([response.data], {
//         type: response.headers["content-type"],
//       });
//       const imageUrl = URL.createObjectURL(blob);
//       setImageSrc(imageUrl);
//     } catch (error) {
//       console.error("Error fetching profile image:", error);
//     }
//   };
 
//   useEffect(() => {
//     const retrieveUserProfile = localStorage.getItem("userInfo");
//     if (retrieveUserProfile) {
//       setUserProfile(JSON.parse(retrieveUserProfile));
//     }
//   }, []);
 
//   useEffect(() => {
//     if (userId || userProfile.employeesid) {
//       fetchImage(userId || userProfile.employeesid);
//     }
//   }, [userId, userProfile.employeesid]);
 
//   return { imageSrc, setImageSrc, userProfile, setUserProfile, userId, setUserId };
// };
 
// export default useUserProfile;

