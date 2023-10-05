import { API } from "aws-amplify";
import { getBlog as getBlogStorage } from './blogStorage';
import { createBlog as createBlogStorage } from './blogStorage';
import { updateBlog as updateBlogStorage } from './blogStorage';
import { deleteBlog as deleteBlogStorage } from './blogStorage';

const apiName = 'blogApi';

// CREATE
async function createBlog({ title, authorId }) {
    // Step 0. Sanitize params
    // @TODO - ?

    // Step 1. Send basic data to Dynamo DB through API Gateway (blogApi) and Lambda (blogLamdba)
    let path = "/blog/create";
    const myInit = {
        body: {
            blogId: "STUB", // STUB VALUE IS REPLACED IN THE BACKEND
            userId: "12",
            authorId,
            title,
            published: false,
            publishedDate: null
        }
    };
    const databaseResponse = await API.post(apiName, path, myInit);
    const blogId = databaseResponse.blogId;
    // console.log(blogId);

    // Step 2. Send blog textContent data to S3
    const file = `<h1>${title}</h1>`;
    const s3Response = await createBlogStorage({ blogId, file });
    console.log(s3Response);

    // Step 3. Finish
    return blogId;
}

// READ
async function getBlog({ blogId }) {
    // console.log("getBlog :: ", blogId);
    try {
        if (blogId === undefined) {
            return "ID must be defined -- getBlog --";
        } else {
            const myInit = {
                response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
                queryStringParameters: {}
            };

            // Step 1. Get basic data from Dynamo DB through API Gateway (blogApi) and Lambda (blogLamdba)
            let path = `/blog/${blogId}/object/${blogId}/12`;
            const response = await API.get(apiName, path, myInit);
            const data = response
            // console.log(data);

            // Step 2. Get blog textContent data from S3
            const textContent = await getBlogStorage({ blogId });
            // console.log(textContent);
            const { title, body } = sanitizeText(textContent);

            // Step 3. Massage return data object
            delete data.authorId;
            data.title = title;
            data.body = body;
            // console.log(data);

            // Step 4. return clean data object
            return data;
        }
    } catch (error) {
        return null;
    }
}

// LIST ALL BLOGS BY AUTHOR (authorId)
async function getBlogsByAuthor({ authorId }) {
    // console.log("getBlogsByAuthor :: ", authorId);
    if (authorId === undefined) {
        return "ID must be defined";
    } else {
        const myInit = {
            response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {}
        };

        let path = `/author/${authorId}`;
        const response = await API.get(apiName, path, myInit);

        return response;
    }
}

// UPDATE
async function updateBlog({ blogId, title, authorId, publishedDate, published, body }) {
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
    await updateBlogStorage({ blogId, file });
    // const s3Response = await updateBlogStorage({ blogId, file });
    // console.log(s3Response);

    // Step 3. Finish
    return;
}

// DELETE
async function deleteBlog({ blogId, userId = "12" }) {
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
    return;
}

// HELPERS
function sanitizeText(content) {
    // heading should always be an H1
    content = content.replace(/<(.*?)>(.*?)<(.*?)>/, '<h1>$2</h1>');
    // title is the contents of the H1
    const title = content.replace(/<h1>(.*?)<\/h1>(.*)/, '$1');
    // body is everything after the h1
    const body = content.replace(/(.*?)<\/h1>/, '');
    // console.log("Title = ", title);
    // console.log("Body = ", body);
    return { title, body };
    // const { title, body } = sanitizeText(textContent);
}

export { createBlog, getBlog, updateBlog, deleteBlog, getBlogsByAuthor, sanitizeText }
