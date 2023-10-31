import React from "react";
import CreateBlogView from "./CreateBlogView";
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import userEvent from '@testing-library/user-event'

import { testUser, signOut } from '../testing';

jest.mock("../helpers/blogLambda");

async function renderBlog() {
    return await act(async () => {
        render(
            <MemoryRouter initialEntries={['/c']}>
                <CreateBlogView />
            </MemoryRouter>
        );
    });
}

it('Should render a title', async () => {
    await renderBlog(); 
    const form = screen.queryByTestId('create-blog-view');
    expect(form).toBeInTheDocument();
});

it("Should render prompt text", async () => {
    await renderBlog();
    const title = screen.getByRole("heading", { level: 1, value: { text: "What's the title for your new blog?" }});
    expect(title).toBeInTheDocument();
});

it('Should render an input field', async () => {
    await renderBlog();
    const input = screen.queryByTestId('create-title-input');
    expect(input).toBeInTheDocument();
});

it("Should render 'OK' button", async () => {
    await renderBlog();
    const button = screen.getByText('OK');
    expect(button).toBeInTheDocument();
});

describe('Redirect after create', () => {
    const setupMyTest = () => {
        const router = createMemoryRouter(
            [
                {
                    path: '/e/:id',
                    element: <>test-pass</>,
                },
                {
                    path: '/c',
                    // Render the component causing the navigate to '/'
                    element: <CreateBlogView user={testUser} signOut={signOut} />
                },
            ],
            {
                // Set for where you want to start in the routes. Remember, KISS (Keep it simple, stupid) the routes.
                initialEntries: ['/c'],
                // We don't need to explicitly set this, but it's nice to have.
                initialIndex: 0,
            }
        )

        render(<RouterProvider router={router} />)

        // Objectify the router so we can explicitly pull when calling setupMyTest
        return { router }
    }

    it('navigates to the new blog page with the correct id', async () => {
        const { router } = setupMyTest();

        // Given we do start where we want to start
        expect(router.state.location.pathname).toEqual('/c')

        // Navigate away from /starting/path
        const event = {
            target: { value: 'test-new-blog' }
        };
        const input = await screen.findByTestId('search-input');
        fireEvent.change(input, event);
        userEvent.click(screen.getByRole('button', { name: 'OK' }))

        // Don't forget to await the update since not all actions are immediate
        await waitFor(() => {
            expect(router.state.location.pathname).toEqual('/e/1234');
        })
    });

    // it('input onChange handler works', async () => {
    //     const { router } = setupMyTest();

    //     // Given we do start where we want to start
    //     expect(router.state.location.pathname).toEqual('/')

    //     // Navigate away from /starting/path
    //     const event = {
    //         target: { value: 'test-two' }
    //     };
    //     const input = await screen.findByTestId('search-input');
    //     fireEvent.change(input, event);

    //     userEvent.click(screen.getByRole('button', { name: 'Search' }))

    //     // Don't forget to await the update since not all actions are immediate
    //     await waitFor(() => {
    //         // console.log(router.state.location);
    //         expect(router.state.location.pathname).toEqual('/search');
    //         expect(router.state.location.search).toEqual('?title=test-two');
    //     })
    // });
});