import { API } from "aws-amplify";
import { getBlog as getBlogStorage } from './blogStorage';
import { createBlog as createBlogStorage } from './blogStorage';
import { updateBlog as updateBlogStorage } from './blogStorage';
import { deleteBlog as deleteBlogStorage } from './blogStorage';
import { getFiveBlogs as getFiveBlogsStorage } from "./blogStorage";

const apiName = 'blogApi';

// @TODO JSDOC

// CREATE
async function createBlog({ title, authorId }) {
    try {
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
        return { success: true, blogId };
    } catch (error) {
        return { success: false };
    }
}

// READ
async function getBlog({ blogId, userId }) {
    try {
        if (blogId === undefined || userId === undefined) {
            throw new Error("missing params " + JSON.stringify({ blogId, userId }));
        }
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
        return { success: true, body: data };

    } catch (error) {
        console.log("getBlog - error", error);
        // @TODO - make a test for what happens when the wrong blogId is used
        return { success: false };
    }
}

// Toggle the publish or unpublish status of a blog (moves files in S3) (authorId)
// @param currentStatus STRING 'protected' : 'public'
async function publishUnpublishBlog(args) {
    try {
        const { blogId, title, authorId, published, body } = args;
        if (blogId === undefined || title === undefined || authorId === undefined || published === undefined || body === undefined) {
            throw new Error("missing params " + JSON.stringify(args));
        }

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
        return { success: true, body: myInit.body };
    } catch (error) {
        console.log("publishUnpublishBlog - error", error);
        return { success: false };
    }

    // // const user = await Auth.currentCredentials();
    // // const userIdentityId = user.identityId;
    // // // @ TODO handle guest users
    // // // if user === not logged in then return, else -->
    // // console.log(userIdentityId);

    // // let path = `/author/${blogId}`;
    // // let myInit = {
    // //     body: {
    // //         userIdentityId,
    // //         currentStatus
    // //     }
    // // };
    // // // moves blog content and images to public/private dir in S3
    // // const data = await API.put(apiName, path, myInit);
    // // console.log(data);

    // // --database;

    // // Step 1. Send basic data to Dynamo DB through API Gateway (blogApi) and Lambda (blogLamdba)
    // // let path2 = `/blog/create/`;
    // // let myInit2 = {
    // //     body: {
    // //         blogId,
    // //         userId: "12",
    // //         published: published === true ? false : true
    // //     }
    // // };
    // // console.log(myInit2);
    // let path = `/blog/${blogId}/object/${blogId}/12`;
    // const data = await API.get(apiName, path, {});
    // // data.published = !data.published;
    // // data.published = data.published === false ? true : false;

    // // if (data.published === false) {
    // //     data.published = true;
    // // } else if (data.published === true) {
    // //     data.published = false;
    // // }

    // let myInit2 = {
    //     body: {
    //         blogId: String(data.blogId),
    //         userId: String(data.userId),
    //         published: Boolean(data.published),
    //         publishedDate: String(data.publishedDate),
    //         title: String(data.title)
    //     }
    // };

    // await API.put(apiName, "/blog/create", myInit2);

    // console.log(data);
    // // // await API.put(apiName, path, myInit);
    // // const databaseResponse = await API.put(apiName, path2, myInit2);
    // // console.log(databaseResponse);
    // // // console.log(s3Response);

    // // // Step 3. Finish
    // // return myInit2.body;
    // return data;
}

// LIST ALL BLOGS BY AUTHOR (authorId)
async function getBlogsByAuthor({ authorId }) {
    try {
        if (authorId === undefined) {
            throw new Error("missing params " + JSON.stringify(authorId));
        }
        const myInit = {
            response: false, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {}
        };

        let path = `/author/${authorId}`;
        const response = await API.get(apiName, path, myInit);
        // @TODO - validate response

        return { success: true, body: response };
    } catch (error) {
        console.log("getBlogsByAuthor - error", error);
        return { success: false };
    }
}

// UPDATE
async function updateBlog({ blogId, title, authorId, publishedDate, published, body }) {
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

// DELETE
async function deleteBlog({ blogId, userId = "12" }) {
    try {
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
    } catch (error) {
        console.log("deleteBlog - error", error);
        return { success: false };
    }
}

// READ FIVE
async function getFiveBlogs() {
    // Get five random blog ids using the storage API
    let blogs = await getFiveBlogsStorage();

    blogs = await Promise.all(blogs.map(async(blogId) => {
        let path = `/blog/${blogId}/object/${blogId}/12`;
        const data = await API.get(apiName, path, { response: false, queryStringParameters: {} });
        return {
            id: blogId,
            title: data.title
        }
    }));
    return blogs;
}

// READ ALL
async function getAllBlogs() {
    try {
        // console.log('Delete ', blogId, userId);
        // Step 1. Delete basic data in Dynamo DB through API Gateway (blogApi) and Lambda (blogLamdba)
        let path = '/blog/list';

        const myInit = {};
        const results = await API.get(apiName, path, myInit);

        // Step 3. Finish
        return { success: true, data: results };
    } catch (error) {
        console.log("getAllBlogs - error", error);
        return { success: false };
    }
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

export { createBlog, getBlog, updateBlog, deleteBlog, getBlogsByAuthor, publishUnpublishBlog, getFiveBlogs, getAllBlogs, sanitizeText }
