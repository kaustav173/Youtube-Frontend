// const CHUNK_SIZE = 5 * 1024 * 1024;

// export const initiateVideo = async (file: File) => {
//   const token = localStorage.getItem("token");
//   const fileName = file.name;
//   const fileType = file.type;
//   const fileSize = file.size;
//   let uploadId = "";
//   let parts = [];
//   setTimeout(() => {
//     console.log("initiating");
//   }, 3000);
//   try {
//     const startUploadResponse = await fetch(
//       "https://yt-assesment.onrender.com/api/v1/uploads/videos/initiate",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           fileName,
//           fileSize,
//           contentType: fileType,
//         }),
//       },
//     );
//     const val = await startUploadResponse.json();
//     uploadId = val.data.uploadId;
//     const totalParts = val.data.totalParts;

//     console.log(totalParts);

//     for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
//       const start = (partNumber - 1) * CHUNK_SIZE;
//       const end = Math.min(start + CHUNK_SIZE, file.size);
//       const fileChunk = file.slice(start, end);

//       const reader = new FileReader();
//       reader.readAsArrayBuffer(fileChunk);

//       const uploadPart = () => {
//         return new Promise((resolve, reject) => {
//           reader.onload = async () => {
//             const res = await fetch(
//               `https://yt-assesment.onrender.com/api/v1/uploads/videos/${uploadId}/parts/presign`,
//               {
//                 method: "POST",
//                 headers: {
//                   Accept: "application/json",
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                   partNumber,
//                 }),
//               },
//             );

//             const uploadPartResponse = await res.json();

//             parts.push({
//               ETag: uploadPartResponse.data.ETag,
//               PartNumber: partNumber,
//             });
//             resolve();
//           };
//           reader.onerror = reject;
//         });
//       };

//       await uploadPart();
//     }

//     const completeUploadResponse = await fetch(
//       `https://yt-assesment.onrender.com/api/v1/uploads/videos/${uploadId}/complete`,
//       {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           parts,
//         }),
//       },
//     );
//     const data = await completeUploadResponse.json();
//     alert("File uploaded successfully");
//     return data.data.fileUrl;
//   } catch (error) {
//     console.log(error);
//   }
// };
