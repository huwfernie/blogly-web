

// async function getFiveRecentBlogs() {
//     console.log("TEST CALL");
//     try {
//         // const url = "/getrecentblogs?num=5";
//         // let data = await fetch(url);
//         // data = await data.json();
//         let data = [
//           {
//             id: crypto.randomUUID(),
//             title: "blog_1"
//           },
//           {
//             id: crypto.randomUUID(),
//             title: "blog_2"
//           },
//           {
//             id: crypto.randomUUID(),
//             title: "blog_3"
//           },
//           {
//             id: crypto.randomUUID(),
//             title: "blog_4"
//           },
//           {
//             id: crypto.randomUUID(),
//             title: "blog_5"
//           }
//         ]
//         return data;
//     } catch (error) {
//         console.log("**** Error **** ", error);
//         return [];
//     }
// }

// export { getFiveRecentBlogs };

// import axios from "axios"
// import "regenerator-runtime/runtime.js";

// const getFiveRecentBlogs = async (alpha2Code) => {
//   const result = await axios.get(`https://restcountries.com/v2/lang/${alpha2Code}`)
//   if (result.status) {
//       console.log(`REST API call status: ${result.status}`)
//   }
//   return result
// }

// export default getFiveRecentBlogs;