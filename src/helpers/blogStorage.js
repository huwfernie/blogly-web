import { Storage } from "@aws-amplify/storage"

async function getBlog({ id }) {
    if (id === undefined) {
        return "ID must be defined";
    } else {
        const data = await Storage.get(`blog/${id}.txt`, {
            level: 'protected',
            download: true
        });
        const text = await data.Body.text();
        return text;
    }
}

async function updateBlog({ id, file }) {
    if (id === undefined) {
        return "ID must be defined";
    } else {
        const data = await Storage.put(`blog/${id}.txt`, file, {
            level: 'protected',
            contentType: 'text/plain'
        });
        return data;
    }
}

async function deleteBlog({ id }) {
    if (id === undefined) {
        return "ID must be defined";
    } else {
        await Storage.remove(`blog/${id}.txt`, { level: 'protected' });
    }
}

async function getFiveBlogs() {
    let response = await Storage.list('blog/', {
        level: 'protected',
        pageSize: 5
    });
    return response;
}

export { getBlog, updateBlog, deleteBlog, getFiveBlogs }
