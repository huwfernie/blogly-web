// file: helpers/__mocks__/blogLambda.js

async function getBlog({ blogId }) {
    const _blogId = blogId || "1eaadf37bd4e4f1097d122983daa56ca";

    const dummyData = {
        author: "A B Creely",
        blogId: _blogId,
        body: "<p>this is some body text</p>",
        published: true,
        publishedDate: "10/11/2012",
        title: "Blog 1 Heading",
        userId: "12"
    };
 
    return Promise.resolve(dummyData);
}

async function getBlogsByAuthor({ authorId }) {

    const dummyData = [
        {
            authorId: authorId,
            blogId: "1eaadf37bd4e4f1097d122983daa56ca",
            userId: '12',
            title: "Test Blog One",
            published: true,
            publishedDate: "10/11/2011"
        },
        {
            authorId: authorId,
            blogId: "2eaadf37bd4e4f1097d122983daa56ca",
            userId: '12',
            title: "Test Blog Two",
            published: true,
            publishedDate: "11/11/2011"
        }
    ];

    return Promise.resolve(dummyData);
}

export { getBlog, getBlogsByAuthor };
