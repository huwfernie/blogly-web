import React from "react";
import IndexView from "./IndexView";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from 'react-router';



it("Should render a headline", async () => {
    render(<MemoryRouter><IndexView /></MemoryRouter>);
    // Grab the headline by it's text
    const headline = await screen.findByRole('heading', { level: 1, name: "Welcome to Blogly" });
    // Assert that the headline appears
    expect(headline).toBeInTheDocument();
});

// it("Should render a search box", async () => {
//     render(<IndexView />);
//     // const searchBox = await screen.findByText("Placeholder");
//     const searchBox = await screen.findByRole('searchbox', { value: { text: "Placeholder" }});
//     // Assert that the search box appears
//     expect(searchBox).toBeInTheDocument();
// });

// it("Should render a search button", async () => {
//     render(<IndexView />);
//     // const searchBox = await screen.findByText("Search");
//     let searchBox = await screen.findAllByRole('button', { value: { text: "Search" }});
//     searchBox = searchBox[0];
//     // Assert that the search box appears
//     expect(searchBox).toBeInTheDocument();
// });

// it("Should render a blog list headline", async () => {
//     render(<IndexView />);
//     const recentBlogsTitle = await screen.findByRole('heading', { level: 2, name: "Recently published" });
//     // Assert that the headline appears
//     expect(recentBlogsTitle).toBeInTheDocument();
// });

// it("Should render latest five blogs", async () => {   
//     render(<IndexView />);
//     const blogList = await screen.findAllByRole('listitem');
//     // Assert that their are 5 blogs on screen.
//     expect(blogList.length).toBe(5);
// });
