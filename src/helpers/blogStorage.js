import { Storage } from "@aws-amplify/storage"
import { Auth } from "aws-amplify";

// CREATE
async function createBlog({ blogId, file, level }) {
    if (blogId === undefined || file === undefined || level === undefined) {
        throw new Error('Missing params in function createBlog');
    } else {
        const data = await Storage.put(`${blogId}/blog.txt`, file, {
            level,
            contentType: 'text/plain'
        });
        return data;
    }
}

// READ
async function getBlog({ blogId, level }) {
    await Auth.currentCredentials();
    if (blogId === undefined) {
        return "ID must be defined";
    } else {
        const data = await Storage.get(`${blogId}/blog.txt`, {
            level,
            download: true
        });
        const text = await data.Body.text();
        return text;
    }
}

// UPDATE
async function updateBlog({ blogId, file, level }) {
    // const level = user === undefined ? 'public' : 'protected';
    if (blogId === undefined) {
        return "ID must be defined";
    } else {
        const data = await Storage.put(`${blogId}/blog.txt`, file, {
            level,
            contentType: 'text/plain'
        });
        return data;
    }
}

// DELETE
async function deleteBlog({ blogId, level }) {
    if (blogId === undefined) {
        return "ID must be defined";
    } else {
        await Storage.remove(`${blogId}/blog.txt`, { level });
    }
}

// READ FIVE
async function getFiveBlogs() {
    try {
        let response = await Storage.list('', {
            level: 'public',
            pageSize: 5
        });
        return response.results.map((el) => {
            return el.key.replace("/blog.txt", "");
        });
    } catch (error) {
        return [];
    }
}

export { createBlog, getBlog, updateBlog, deleteBlog, getFiveBlogs }
