import React from "react";
import SearchBar from "./SearchBar";
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'

// // @TODO - Mock the handleSearch function and test it

describe('Search Bar Basic', () => {

    function renderPage() {
        return render(<MemoryRouter><SearchBar placeholder="Search" initialValue="" /></MemoryRouter>);
    }

    it('Should render a parent element with a test ID', () => {
        renderPage();
        const element = screen.queryByTestId('search-input');
        expect(element).not.toBe(null);
    });

    it("Should render a <button> with 'Search' text", () => {
        renderPage();
        const home = screen.getByText('Search');
        expect(home).toBeInTheDocument();
    });

    it("input onChange should change input value", async () => {
        renderPage();
        const input = await screen.findByTestId('search-input');
        fireEvent.change(input, { target: { value: '23' } });
        expect(input.value).toBe('23');
    });
});

describe('placeholder prop works', () => {

    function renderPage() {
        return render(<MemoryRouter><SearchBar placeholder="TEST-PLACEHOLDER" initialValue="" /></MemoryRouter>);
    }

    it("Should render 'TEST-PLACEHOLDER' text", () => {
        renderPage();
        const input = screen.getByTestId('search-input');
        expect(input.placeholder).toBe('TEST-PLACEHOLDER');
    });
});

describe('initialValue prop works', () => {

    function renderPage() {
        return render(<MemoryRouter><SearchBar placeholder="" initialValue="TEST-INITIAL-VALUE" /></MemoryRouter>);
    }
    
    it("Should render 'TEST-INITIAL-VALUE' text", () => {
        renderPage();
        const input = screen.getByTestId('search-input');
        expect(input.value).toBe('TEST-INITIAL-VALUE');
    });
});

describe('Search Bar Advanced', () => {
    const setupMyTest = () => {
        const router = createMemoryRouter(
            [
                {
                    path: '/search',
                    element: <>test-pass</>,
                },
                {
                    path: '/',
                    // Render the component causing the navigate to '/'
                    element: <SearchBar placeholder="Search" initialValue="testing" />,
                },
            ],
            {
                // Set for where you want to start in the routes. Remember, KISS (Keep it simple, stupid) the routes.
                initialEntries: ['/'],
                // We don't need to explicitly set this, but it's nice to have.
                initialIndex: 0,
            }
        )

        render(<RouterProvider router={router} />)

        // Objectify the router so we can explicitly pull when calling setupMyTest
        return { router }
    }

    it('navigates to the search results page with correct query string', async () => {
        const { router } = setupMyTest();

        // Given we do start where we want to start
        expect(router.state.location.pathname).toEqual('/')

        // Navigate away from /starting/path
        userEvent.click(screen.getByRole('button', { name: 'Search' }))

        // Don't forget to await the update since not all actions are immediate
        await waitFor(() => {
            // console.log(router.state.location);
            expect(router.state.location.pathname).toEqual('/search');
            expect(router.state.location.search).toEqual('?title=testing');
        })
    });

    it('input onChange handler works', async () => {
        const { router } = setupMyTest();

        // Given we do start where we want to start
        expect(router.state.location.pathname).toEqual('/')

        // Navigate away from /starting/path
        const event = {
            target: { value: 'test-two' }
        };
        const input = await screen.findByTestId('search-input');
        fireEvent.change(input, event);

        userEvent.click(screen.getByRole('button', { name: 'Search' }))

        // Don't forget to await the update since not all actions are immediate
        await waitFor(() => {
            // console.log(router.state.location);
            expect(router.state.location.pathname).toEqual('/search');
            expect(router.state.location.search).toEqual('?title=test-two');
        })
    });
});