import React from "react";
import CreateBlogView from "./CreateBlogView";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

it('Should render a form', async () => {
    render(<MemoryRouter><CreateBlogView /></MemoryRouter>);
    const form = screen.queryByTestId('new-blog-form');
    expect(form).toBeInTheDocument();
});

it("Should render prompt text", () => {
    render(<MemoryRouter><CreateBlogView /></MemoryRouter>);
    // Grab the home by it's text
    const title = screen.getByText("What's the title for your new blog?");
    // Assert that the title appears
    expect(title).toBeInTheDocument();
});

it("Should render 'OK' button", () => {
    render(<MemoryRouter><CreateBlogView /></MemoryRouter>);
    const button = screen.getByText('OK');
    expect(button).toBeInTheDocument();
});
