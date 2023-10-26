import React from "react";
import SearchResultView from "./SearchResultView";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';

jest.mock("../helpers/blogLambda");

async function renderBlog() {
    return await act(async () => {
        render(
            <MemoryRouter initialEntries={['/search?title=same']}>
                <SearchResultView />
            </MemoryRouter>
        );
    });
}

it('Should render a test id', async () => {
    await renderBlog(); 
    const form = screen.queryByTestId('search-result-view');
    expect(form).toBeInTheDocument();
});

describe('Show blog list', () => {
    it("Should show blog one", async () => {
        await renderBlog(); 
        const title = screen.getByText("Same One");
        expect(title).toBeInTheDocument();
    });
    it("Should show blog two", async () => {
        await renderBlog(); 
        const title = screen.getByText("Same Two");
        expect(title).toBeInTheDocument();
    });
    it("Should not show blog three", async () => {
        await renderBlog(); 
        const title = screen.queryByText("Different three");
        expect(title).not.toBeInTheDocument();
    });

});

