import React from 'react';
import { render, screen, container, act, fireEvent } from '@testing-library/react';
import EditBlogView from './EditBlogView';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { testUser, signOut } from '../testing';
import { unmountComponentAtNode } from "react-dom";


import userEvent from '@testing-library/user-event'
// import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'

// Not needed
// import { updateBlog } from "../helpers/blogLambda";


// Mock at global scope :: https://dev.to/viewplatdevto/jest-mock-module-not-working-double-check-these-4mnp
jest.mock("../helpers/blogLambda");


async function renderPage( props = { id: "2" }) {
    const { id } = props;
    return await act(async () => {
        render(
            <MemoryRouter initialEntries={[`/e/${id}`]}>
                <Routes>
                    <Route path="/e/:id" element={<EditBlogView user={testUser} signOut={signOut} />} ></Route >
                    <Route path="/u" element={<div>SUCCESS</div>} ></Route >
                </Routes>
            </MemoryRouter>
        );
    });
}

describe('EditBlogView', () => {
    it('Should render an element', async () => {
        await renderPage();
        const el = screen.getByTestId('edit-blog-view');
        expect(el).toBeInTheDocument();
    });
});

describe('EditBlogView - buttons', () => {
    it('Should render save', async () => {
        await renderPage();
        // screen.debug();
        const elSave = screen.getByText('Save');
        expect(elSave).toBeInTheDocument();
    });

    it('Should render delete', async () => {
        await renderPage();
        const elDelete = screen.getByText('Delete');
        expect(elDelete).toBeInTheDocument();
    });

    it('Should render Public', async () => {
        await renderPage();
        const elPublic = screen.getByText('Public');
        expect(elPublic).toBeInTheDocument();
    });

    it('Should render Private', async () => {
        await renderPage();
        const elPrivate = screen.getByText('Private');
        expect(elPrivate).toBeInTheDocument();
    });
});

describe('EditBlogView - QUILL - change in content should update blog content', () => {
    let container = null;
    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        // cleanup on exiting
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    it('Should render blog', async () => {
        await renderPage();
        const blogText = screen.getByText('this is some body text');
        expect(blogText).toBeInTheDocument();
    });

    it('Quill Element should render', async () => {
        await act(async () => {
            return render(
                <MemoryRouter initialEntries={["/e/1c816a36-9d87-417f-bbda-12d59daef4dd"]}>
                    <EditBlogView user={testUser} signOut={signOut} />
                </MemoryRouter>
                , container);
        });
        const elQuill = container.parentElement.querySelector('.ql-editor');
        expect(elQuill).toBeInTheDocument();
    });

    it('Blog text should update as you type', async () => {
        await act(async () => {
            return render(
                <MemoryRouter initialEntries={["/e/1c816a36-9d87-417f-bbda-12d59daef4dd"]}>
                    <EditBlogView user={testUser} signOut={signOut} />
                </MemoryRouter>
                , container);
        });
        const elQuill = container.parentElement.querySelector('.ql-editor');

        await userEvent.click(elQuill);
        await act(async () => {
            await userEvent.type(elQuill, '{enter}');
            await userEvent.keyboard('Hello, World');
        })
        const newText = screen.getByText('Hello, World', { exact: false });
        expect(newText).toBeInTheDocument();
    });
});

describe('EditBlogView - API Methods', () => {
    const log = console.log; // save original console.log function
    beforeEach(() => {
        console.log = jest.fn(); // create a new mock function for each test
    });
    afterAll(() => {
        console.log = log; // restore original console.log after all tests
    });

    it('SAVE :: updateBlog should be called', async () => {
        await renderPage();
        const elSave = screen.getByText('Save');
        expect(elSave).toBeInTheDocument();
        await act(async () => {
            await userEvent.click(elSave);
        });
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("TEST_PASS_UPDATE_BLOG")
        );
    });

    it('DELETE :: updateBlog should be called', async () => {
        await renderPage();
        const elDelete = screen.getByText('Delete');
        expect(elDelete).toBeInTheDocument();
        await act(async () => {
            await userEvent.click(elDelete);
        });
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("TEST_PASS_DELETE_BLOG")
        );
    });

    it('PUBLISH :: updateBlog should be called', async () => {
        await renderPage();
        const elPublish = screen.getByTestId('publish-button');
        expect(elPublish).toBeInTheDocument();
        await act(async () => {
            await userEvent.click(elPublish);
        });
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("TEST_PASS_PUBLISH_BLOG")
        );
    });

    it('GET :: Should load a blog', async () => {
        await renderPage({ id: "1" });
        const headline = screen.getByRole('heading', { level: 1, text: { value: 'Blog 1 Heading' } });
        expect(headline).toBeInTheDocument();
        const text = screen.getByText('this is some body text');
        expect(text).toBeInTheDocument();
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("TEST_PASS_GET_BLOG")
        );
    });
});