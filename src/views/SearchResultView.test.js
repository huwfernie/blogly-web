import React from "react";
import CreateBlogView from "./CreateBlogView";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';


it('Should render a title', async () => {
    render(<MemoryRouter><CreateBlogView /></MemoryRouter>);
    const form = screen.queryByTestId('new-blog-form');
    expect(form).toBeInTheDocument();
});

it("Should render a list of search results", () => {
    render(<MemoryRouter><CreateBlogView /></MemoryRouter>);
    // Grab the home by it's text
    const title = screen.getByText("What's the title for your new blog?");
    // Assert that the title appears
    expect(title).toBeInTheDocument();
});
