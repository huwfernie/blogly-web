import React from "react";
import ShowBlogView from "./ShowBlogView";
import { render, screen, act } from '@testing-library/react';
import "@testing-library/jest-dom";
import "regenerator-runtime/runtime";
import { MemoryRouter } from "react-router";
import { testUser, signOut } from "../testing";

jest.mock("../helpers/blogLambda");

async function renderPage() {
    return await act(async () => {
        render(
            <MemoryRouter initialEntries={["/b/1c816a36-9d87-417f-bbda-12d59daef4dd"]}>
                <ShowBlogView user={testUser} signOut={signOut} />
            </MemoryRouter>
        );
    });
}

describe('Render a Blog', () => {
    it('Should render a blog title', async () => {
        await renderPage();
        const blogTitle = screen.getByText('Blog 1 Heading');
        expect(blogTitle).toBeInTheDocument();
    });

    it('Should render a blog content', async () => {
        await renderPage();
        const blogText = screen.getByText('this is some body text');
        expect(blogText).toBeInTheDocument();
    });

    it('Should render a blog author', async () => {
        await renderPage();
        const blogTitle = screen.getByText('By : A B Creely');
        expect(blogTitle).toBeInTheDocument();
    });

    it('Should render a blog publishing date', async () => {
        await renderPage();
        const blogTitle = screen.getByText(', published on 10/11/2012');
        expect(blogTitle).toBeInTheDocument();
    });
});
