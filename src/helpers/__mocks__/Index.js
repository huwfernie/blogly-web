

// // file: utils/__mocks__/api-request.js
// // Create a Jest mock function with the same name as the function we're mocking
// const getFiveRecentBlogs = jest.fn( async () => {
//     const _data = [
//       {
//         id: crypto.randomUUID(),
//         title: "blog_1"
//       },
//       {
//         id: crypto.randomUUID(),
//         title: "blog_2"
//       },
//       {
//         id: crypto.randomUUID(),
//         title: "blog_3"
//       },
//       {
//         id: crypto.randomUUID(),
//         title: "blog_4"
//       },
//       {
//         id: crypto.randomUUID(),
//         title: "blog_5"
//       }
//     ]
//     //Return a resolved Promise with a mock response object
//     return new Promise.resolve({ 
//       _data
//     });
//   });
  
//   export { getFiveRecentBlogs };