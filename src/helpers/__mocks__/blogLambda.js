// file: helpers/__mocks__/blogLambda.js

function sanitizeText(content) {
  // frist line should always be an H1
  content = content.replace(/<(.*?)>(.*?)<(.*?)>/, '<h1>$2</h1>');
  // title is the contents of the H1
  const title = content.replace(/<h1>(.*?)<\/h1>(.*)/, '$1');
  // body is everything after the h1
  const body = content.replace(/(.*?)<\/h1>/, '');
  // console.log("Title = ", title);
  // console.log("Body = ", body);
  return { title, body };
}

async function createBlog({ title, authorId }) {
  const test1 = title !== undefined;
  const test2 = authorId !== undefined;

  const dummyData = {
    success: true,
    blogId: "1234"
  }
  
  if (test1 && test2) {
    return Promise.resolve(dummyData);
  } else {
    throw new Error("title and author must be defined");
  }
}

async function getBlog({ blogId }) {
  if (blogId === "1" ) {
    console.log(blogId);
    console.log("TEST_PASS_GET_BLOG");
  }
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

async function updateBlog() {
  console.log("TEST_PASS_UPDATE_BLOG");
  return Promise.resolve({ success: true });
}

async function getBlogsByAuthor({ authorId }) {

  const dummyData = {
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

async function getAllBlogs() {
  const dummyData = {
    success: true,
    data: [
      {
        blogId: "1",
        title: "Same One"
      },
      {
        blogId: "2",
        title: "Same Two"
      },
      {
        blogId: "3",
        title: "Different three"
      }
    ]
  }

  return Promise.resolve(dummyData);
}

async function deleteBlog() {
  console.log("TEST_PASS_DELETE_BLOG");
  return Promise.resolve({ success: true });
}

async function publishUnpublishBlog() {
  console.log("TEST_PASS_PUBLISH_BLOG");
  const body = {
      blogId: "12",
      userId: "12",
      title: "test-blog",
      authorId: "1234",
      publishedDate: "today",
      published: true
  }
  return Promise.resolve({ success: true, body });
}

export { createBlog, getBlog, updateBlog, deleteBlog, getBlogsByAuthor, publishUnpublishBlog, getFiveBlogs, getAllBlogs, sanitizeText }
