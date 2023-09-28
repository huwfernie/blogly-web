import { API } from "aws-amplify";
// import { Storage } from "aws-amplify";
import { getBlog as getBlogStorage } from './blogStorage';
import { updateBlog as updateBlogStorage } from './blogStorage';
import { deleteBlog as deleteBlogStorage } from './blogStorage';

const apiName = 'blogApi';

// CREATE
async function createBlog({ title, authorId }) {
    // Step 0. Sanitize params

    // Step 1. Send basic data to Dynamo DB through API Gateway (bloglyApi) and Lambda (bloglyLamdbaTwo)
    let path = "/blog/create";
    const myInit = {
        body: {
            blogId: "1234", // STUB VALUE IS REPLACED IN THE BACKEND
            userId: authorId,
            title
        }
    };
    const databaseResponse = await API.post(apiName, path, myInit);
    console.log(databaseResponse.blogId);

    // Step 2. Send blog textContent data to S3
    // const file = `<h1>${title}</h1>`;
    // const s3Response = await updateBlogStorage({ id, file });
    // console.log(s3Response);

    // Step 3. Finish
    return;
}

// READ
async function getBlog({ blogId, authorId }) {
    if (blogId === undefined) {
        return "ID must be defined";
    } else {
        const myInit = {
            response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {}
        };

        // Step 1. Get basic data from Dynamo DB through API Gateway (bloglyApi) and Lambda (bloglyLamdbaTwo)
        let path = `/blog/${blogId}/object/${blogId}/${authorId}`;
        const response = await API.get(apiName, path, myInit);
        const data = { ...response[0] };
        // console.log(data);

        // Step 2. exchange authorId for author username, via new request through API Gateway (bloglyApi) and Lambda (bloglyWebUsersLambda)
        path = `/users/${data.authorId}`;
        // const userNameLookup = await API.get(apiName, path, myInit);
        const userNameLookup = "TEST NAME STRING";
        // console.log(userNameLookup);

        // Step 3. Get blog textContent data from S3
        const textContent = await getBlogStorage({ id: blogId });
        console.log(textContent);
        const { title, body } = sanitizeText(textContent);

        // Step 4. Massage return data object
        // delete data.authorId;
        data.author = userNameLookup;
        data.title = title;
        data.body = body;
        console.log(data);

        // Step 5. return clean data object
        return data;
    }
}

// UPDATE
async function updateBlog({ blogId, title, authorId }) {
    // Step 1. Send basic data to Dynamo DB through API Gateway (bloglyApi) and Lambda (bloglyLamdbaTwo)
    let path = `/blog/${blogId}/`;
    const myInit = {
        body: {
            blogId,
            userId: authorId,
            title
        }
    };
    const databaseResponse = await API.put(apiName, path, myInit);
    console.log(databaseResponse);

    // // Step 2. Send blog textContent data to S3
    // const file = `<h1>${title}</h1>${textContent}`;
    // console.log(file);
    // const s3Response = await updateBlogStorage({ id, file });
    // console.log(s3Response);

    // Step 3. Finish
    return;
}

// DELETE
async function deleteBlog({ blogId, userId }) {
    console.log('Delete ', blogId, userId);
    // Step 1. Delete basic data in Dynamo DB through API Gateway (bloglyApi) and Lambda (bloglyLamdbaTwo)
    let path = `/blog/${blogId}/object/${blogId}/${userId}`;
    const myInit = {};
    const databaseResponse = await API.del(apiName, path, myInit);
    console.log(databaseResponse);


    // Step 2. Delete blog data from S3
    // const s3Response = await deleteBlogStorage({ id });
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

export { createBlog, getBlog, updateBlog, deleteBlog }
