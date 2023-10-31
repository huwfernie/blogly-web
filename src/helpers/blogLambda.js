import { API } from "aws-amplify";
import { getBlog as getBlogStorage } from './blogStorage';
import { createBlog as createBlogStorage } from './blogStorage';
import { updateBlog as updateBlogStorage } from './blogStorage';
import { deleteBlog as deleteBlogStorage } from './blogStorage';
import { getFiveBlogs as getFiveBlogsStorage } from "./blogStorage";

const apiName = 'blogApi';

// @TODO JSDOC

function createMethod(func, reqParams, name, logging = false) {
    return async function (params) {
        try {
            reqParams.forEach((key) => {
                if (params[key] === undefined) {
                    throw new Error(`Missing argument "${key}" in function ${name}`);
                }
            })
            const response = await func(params)
            return { success: true, response }
        } catch (error) {
            if (logging === true) {
                console.error(`${name} -- error`, error);
            }
            return { success: false };
        }
    }
}

const createBlog = createMethod(createBlogFunction, ["title", "authorId"], "createBlog");
const getBlog = createMethod(getBlogFunction, ["blogId", "userId"], "getBlog");
const updateBlog = createMethod(updateBlogFunction, ["blogId", "title", "authorId", "publishedDate", "published", "body"], "updateBlog");
const deleteBlog = createMethod(deleteBlogFunction, ["blogId"], "deleteBlog");

const getBlogsByAuthor = createMethod(getBlogsByAuthorFunction, ["authorId"], "getBlogsByAuthor");
const publishUnpublishBlog = createMethod(publishUnpublishBlogFunction, ["blogId", "title", "authorId", "published", "body"], "publishUnpublishBlog");
const getFiveBlogs = createMethod(getFiveBlogsFunction, [], "getFiveBlogs");
const getAllBlogs = createMethod(getAllBlogsFunction, [], "getAllBlogs");


// CREATE
// USED IN BLOG CREATE VIEW
async function createBlogFunction({ title, authorId }) {
    // Step 1. Send basic data to Dynamo DB through API Gateway (blogApi) and Lambda (blogLamdba)
    let path = "/blog/create";
    const myInit = {
        body: {
            blogId: "STUB", // STUB VALUE IS REPLACED IN THE BACKEND
            userId: "12",
            authorId,
            title,
            published: false,
            publishedDate: ""
        }
    };
    const databaseResponse = await API.post(apiName, path, myInit);
    const blogId = databaseResponse.blogId;
    // console.log(blogId);

    // Step 2. Send blog textContent data to S3
    // Note - all blogs created with this method are Protected level to begin with
    const file = `<h1>${title}</h1>`;
    await createBlogStorage({ blogId, file, level: 'protected' });
    // const s3Response = await createBlogStorage({ blogId, file, level: 'protected' });
    // console.log(s3Response);

    // Step 3. Finish
    return { blogId };
}

// READ
// USED IN EDIT VIEW && BLOG SHOW VIEW
async function getBlogFunction({ blogId, userId }) {
    const myInit = {
        response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
        queryStringParameters: {}
    };

    // Step 1. Get basic data from Dynamo DB through API Gateway (blogApi) and Lambda (blogLamdba)
    let path = `/blog/${blogId}/object/${blogId}/12`;
    const data = await API.get(apiName, path, myInit);

    // @TODO - this will show a private blog to it's author but not to the public, move to backend
    if (data.published === false && data.authorId !== userId) {
        return {
            success: true,
            body: {
                blogId,
                userId: "12",
                title: "Ooops, we can't find that one",
                body: "<br/><p>It may have been deleted, you can try to find it again from <a href=\"/\">Home</a></p>",
                author: "Blogly Suport",
                publishedDate: "",
                published: false
            }
        }
    }

    // // Step 2. Get blog textContent data from S3
    const level = data.published === true ? 'public' : 'protected';
    const textContent = await getBlogStorage({ blogId, level });
    const { title, body } = sanitizeText(textContent);

    // Step 3. Massage return data object
    delete data.authorId;
    data.title = title;
    data.body = body;

    // Step 4. return clean data object
    return data;
}

// Toggle the publish or unpublish status of a blog (moves files in S3) (authorId)
// @param currentStatus STRING 'protected' : 'public'
// @TODO - refactor this it should just be a wrapper around update blog
// USED IN EDIT VIEW
async function publishUnpublishBlogFunction({ blogId, title, authorId, published, body }) {
    // Step 1. Send basic data to Dynamo DB through API Gateway (blogApi) and Lambda (blogLamdba)
    let path = `/blog/create/`;
    const date = new Date();
    const _publishedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const myInit = {
        body: {
            blogId,
            userId: "12",
            title,
            authorId,
            publishedDate: _publishedDate,
            published: !published
        }
    };
    await API.put(apiName, path, myInit);

    // Step 2. Delete old blog from S3
    let level = myInit.body.published === false ? 'public' : 'protected';
    await deleteBlogStorage({ blogId, level });

    // Step 3. Add new blog to S3
    const file = `<h1>${title}</h1>${body}`;
    level = myInit.body.published === true ? 'public' : 'protected';
    await createBlogStorage({ blogId, file, level });

    // Step 3. Finish
    return myInit.body;
}

// LIST ALL BLOGS BY AUTHOR (authorId)
// USED IN USER PAGE VIEW
async function getBlogsByAuthorFunction({ authorId }) {
    const myInit = {
        response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
        queryStringParameters: {}
    };

    let path = `/author/${authorId}`;
    const response = await API.get(apiName, path, myInit);
    // @TODO - validate response

    return response;
}

// UPDATE USED IN EDIT VIEW
async function updateBlogFunction({ blogId, title, authorId, publishedDate, published, body }) {
    try {
        if (blogId === undefined || title === undefined || authorId === undefined || publishedDate === undefined || published === undefined || body === undefined) {
            throw new Error("missing params " + JSON.stringify({ blogId, title, authorId, publishedDate, published, body }));
        }
        // Step 1. Send basic data to Dynamo DB through API Gateway (blogApi) and Lambda (blogLamdba)
        let path = `/blog/create/`;
        const myInit = {
            body: {
                blogId,
                userId: "12",
                title,
                authorId,
                publishedDate,
                published
            }
        };
        await API.put(apiName, path, myInit);
        // const databaseResponse = await API.put(apiName, path, myInit);
        // console.log(databaseResponse);

        // // Step 2. Send blog textContent data to S3
        const file = `<h1>${title}</h1>${body}`;
        // console.log(file);
        const level = published === true ? 'public' : 'protected';
        await updateBlogStorage({ blogId, file, level });
        // const s3Response = await updateBlogStorage({ blogId, file });
        // console.log(s3Response);

        // Step 3. Finish
        return { success: true };
    } catch (error) {
        console.log("updateBlog - error", error);
        return { success: false };
    }
}

// DELETE - USED IN EDIT VIEW
async function deleteBlogFunction({ blogId, userId = "12" }) {
    // console.log('Delete ', blogId, userId);
    // Step 1. Delete basic data in Dynamo DB through API Gateway (blogApi) and Lambda (blogLamdba)
    let path = `/blog/${blogId}/object/${blogId}/${userId}`;
    const myInit = {};
    await API.del(apiName, path, myInit);
    // const databaseResponse = await API.del(apiName, path, myInit);
    // console.log(databaseResponse);

    // Step 2. Delete blog data from S3
    await deleteBlogStorage({ blogId });
    // const s3Response = await deleteBlogStorage({ blogId });
    // console.log(s3Response);

    // Step 3. Finish
    return { success: true };
}

// READ FIVE (USED IN INDEX PAGE VIEW)
async function getFiveBlogsFunction() {
    // Get five random blog ids using the storage API
    let blogs = await getFiveBlogsStorage();

    blogs = await Promise.all(blogs.map(async (blogId) => {
        let path = `/blog/${blogId}/object/${blogId}/12`;
        const data = await API.get(apiName, path, { response: false, queryStringParameters: {} });
        return {
            id: blogId,
            title: data.title
        }
    }));
    return [...blogs];
}

// READ ALL - USED IN SEARCH RESULT VIEW
async function getAllBlogsFunction() {
    let path = '/blog/list';

    const myInit = {};
    const results = await API.get(apiName, path, myInit);

    // Step 3. Finish
    return results;
}


// HELPERS
// const { title, body } = sanitizeText(textContent);
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

export { createBlog, getBlog, updateBlog, deleteBlog, getBlogsByAuthor, publishUnpublishBlog, getFiveBlogs, getAllBlogs, sanitizeText }
