// file: helpers/__mocks__/blogLambda.js

// Create a Jest mock function with the same name as the function we're mocking
const getBlog = jest.fn(({ blogId }) => {
    //Return a resolved Promise with a mock response object
    const _blogId = blogId || "1eaadf37bd4e4f1097d122983daa56ca";

    return Promise.resolve({
        author: "A B Creely",
        blogId: _blogId,
        body: "BODY",
        published: false,
        publishedDate: null,
        title: "Blog 1 Heading",
        userId: "12"
    });
});

export { getBlog };