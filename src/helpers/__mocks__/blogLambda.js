// file: helpers/__mocks__/blogLambda.js

async function getBlog({ blogId }) {
  const _blogId = blogId || "1eaadf37bd4e4f1097d122983daa56ca";

  const dummyData = {
    success: true,
    body: {
      blogId: _blogId,
      userId: "12",
      title: "Blog 1 Heading",
      body: "<p>this is some body text</p>",
      author: "A B Creely",
      publishedDate: "10/11/2012",
      published: true
    }
  }

  return Promise.resolve(dummyData);
}

async function getBlogsByAuthor({ authorId }) {

  const dummyData =
  {
    success: true,
    body: [
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
    ]
  }

  return Promise.resolve(dummyData);
}

async function getFiveBlogs() {
  const dummyData = [
    {
      id: "1eaadf37bd4e4f1097d122983daa56ca",
      title: "blog_1"
    },
    {
      id: "2eaadf37bd4e4f1097d122983daa56ca",
      title: "blog_2"
    },
    {
      id: "3eaadf37bd4e4f1097d122983daa56ca",
      title: "blog_3"
    },
    {
      id: "4eaadf37bd4e4f1097d122983daa56ca",
      title: "blog_4"
    },
    {
      id: "5eaadf37bd4e4f1097d122983daa56ca",
      title: "blog_5"
    }
  ];

  return Promise.resolve(dummyData);
}

export { getBlog, getBlogsByAuthor, getFiveBlogs };
