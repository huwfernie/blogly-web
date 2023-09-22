import React from "react";
import ShowBlogView from "./ShowBlogView";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "regenerator-runtime/runtime";
import { MemoryRouter } from "react-router";

describe('Parent Component', () => {
    it('renders Child component - main bar', () => {
        render(<MemoryRouter><ShowBlogView /></MemoryRouter>);
        const child = screen.queryByTestId('main-bar');
        expect(child).not.toBe(null);
    });

    it('renders Child component - edit bar', () => {
        render(<MemoryRouter><ShowBlogView /></MemoryRouter>);
        const child = screen.queryByTestId('owner-edit-bar');
        expect(child).not.toBe(null);
    });
});

describe('Render a Blog', () => {
    it('Should render a blog title', () => {
        render(<MemoryRouter><ShowBlogView /></MemoryRouter>);
        const blogTitle = screen.getByText('Blog 1 Heading');
        expect(blogTitle).toBeInTheDocument();
    });

    it('Should render a blog content', () => {
        render(<MemoryRouter><ShowBlogView /></MemoryRouter>);
        const blogText = screen.getByText('this is some text');
        expect(blogText).toBeInTheDocument();
    });

    it('Should render a blog author', () => {
        render(<MemoryRouter><ShowBlogView /></MemoryRouter>);
        const blogTitle = screen.getByText('A B Creely');
        expect(blogTitle).toBeInTheDocument();
    });

    it('Should render a blog publishing date', () => {
        render(<MemoryRouter><ShowBlogView /></MemoryRouter>);
        const blogTitle = screen.getByText('10/11/12');
        expect(blogTitle).toBeInTheDocument();
    });

    // -- Remove favourite counter -- 
    // it('Should render a blog favorite counter', () => {
    //     render(<ShowBlogView />);
    //     const blogTitle = screen.getByText('21');
    //     expect(blogTitle).toBeInTheDocument();
    // });
});

describe('Favourite Counter', () => {
    it('Should be able to click to increase the favourite counter', () => {
        // @TODO
        // render(<ShowBlogView />);
        // const blogTitle = screen.getByText('blog_1');
        // expect(blogTitle).toBeInTheDocument();
        return;
    });
});

