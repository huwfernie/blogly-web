import { Storage } from "@aws-amplify/storage"

// CREATE
async function createBlog({ blogId, file }) {
    if (blogId === undefined) {
        return "ID must be defined";
    } else {
        const data = await Storage.put(`blog/${blogId}.txt`, file, {
            level: 'protected',
            contentType: 'text/plain'
        });
        return data;
    }
}

// READ
async function getBlog({ blogId }) {
    if (blogId === undefined) {
        return "ID must be defined";
    } else {
        const data = await Storage.get(`blog/${blogId}.txt`, {
            level: 'protected',
            download: true
        });
        const text = await data.Body.text();
        return text;
    }
}

// UPDATE
async function updateBlog({ blogId, file }) {
    if (blogId === undefined) {
        return "ID must be defined";
    } else {
        const data = await Storage.put(`blog/${blogId}.txt`, file, {
            level: 'protected',
            contentType: 'text/plain'
        });
        return data;
    }
}

// DELETE
async function deleteBlog({ blogId }) {
    if (blogId === undefined) {
        return "ID must be defined";
    } else {
        await Storage.remove(`blog/${blogId}.txt`, { level: 'protected' });
    }
}

// READ FIVE
async function getFiveBlogs() {
    let response = await Storage.list('blog/', {
        level: 'protected',
        pageSize: 5
    });
    return response;
}

export { createBlog, getBlog, updateBlog, deleteBlog, getFiveBlogs }
