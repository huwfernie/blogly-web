import React from "react";
import IndexView from "./IndexView";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from 'react-router';

jest.mock("../helpers/blogLambda");

async function renderPage() {
    return await act(async () => {
        render(
            <MemoryRouter><IndexView /></MemoryRouter>
        );
    });
}

it("Should render a headline", async () => {
    renderPage();
    // Grab the headline by it's text
    const headline = await screen.findByRole('heading', { level: 1, name: "Welcome to Blogly" });
    // Assert that the headline appears
    expect(headline).toBeInTheDocument();
});

it("Should render a search box", async () => {
    renderPage();
    // const searchBox = await screen.findByText("Placeholder");
    // const searchBox = await screen.findByRole('searchbox', { value: { text: "Placeholder" } });
    const searchBox = await screen.findByTestId('search-input');
    
    // Assert that the search box appears
    expect(searchBox).toBeInTheDocument();
});

it("Should render a search button", async () => {
    renderPage();
    // const searchBox = await screen.findByText("Search");
    let searchBox = await screen.findAllByRole('button', { value: { text: "Search" } });
    searchBox = searchBox[0];
    // Assert that the search box appears
    expect(searchBox).toBeInTheDocument();
});

it("Should render a blog list headline", async () => {
    renderPage();
    const recentBlogsTitle = await screen.findByRole('heading', { level: 2, name: "Recently published" });
    // Assert that the headline appears
    expect(recentBlogsTitle).toBeInTheDocument();
});

// it("Should render latest five blogs", async () => {   
//     render(<IndexView />);
//     const blogList = await screen.findAllByRole('listitem');
//     // Assert that their are 5 blogs on screen.
//     expect(blogList.length).toBe(5);
// });
