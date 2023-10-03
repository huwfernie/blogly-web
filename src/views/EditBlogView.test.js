import React from 'react';
import { render, screen, act } from '@testing-library/react';
import EditBlogView from './EditBlogView';
import { MemoryRouter } from 'react-router';

const testUser = {
    attributes: {
        sub: '1234'
    }
}

function signOut(el) {
    console.log(el);
}

// Not needed
// import { getBlog } from "../helpers/blogLambda";

describe('EditBlogView', () => {
    it('Should render an element', async () => {
        await act(async () => {
            // render components
            jest.mock("../helpers/blogLambda");
            render(
                <MemoryRouter initialEntries={["/e/1c816a36-9d87-417f-bbda-12d59daef4dd"]}>
                    <EditBlogView user={testUser} signOut={signOut} />
                </MemoryRouter>
            );
        });
        // render components
        const el = screen.getByTestId('edit-blog-view');
        expect(el).toBeInTheDocument();
    });
});

describe('EditBlogView - buttons', () => {
    it('Should render save', async () => {
        await act(async () => {
            // render components
            jest.mock("../helpers/blogLambda");
            render(
                <MemoryRouter initialEntries={["/e/1c816a36-9d87-417f-bbda-12d59daef4dd"]}>
                    <EditBlogView user={testUser} signOut={signOut} />
                </MemoryRouter>
            );
        });
        // screen.debug();
        // render components
        const elSave = screen.getByText('Save');
        expect(elSave).toBeInTheDocument();
    });

    it('Should render delete', async () => {
        await act(async () => {
            // render components
            jest.mock("../helpers/blogLambda");
            render(
                <MemoryRouter initialEntries={["/e/1c816a36-9d87-417f-bbda-12d59daef4dd"]}>
                    <EditBlogView user={testUser} signOut={signOut} />
                </MemoryRouter>
            );
        });
        // render components
        const elDelete = screen.getByText('Delete');
        expect(elDelete).toBeInTheDocument();
    });

    it('Should render Public', async () => {
        await act(async () => {
            // render components
            jest.mock("../helpers/blogLambda");
            render(
                <MemoryRouter initialEntries={["/e/1c816a36-9d87-417f-bbda-12d59daef4dd"]}>
                    <EditBlogView user={testUser} signOut={signOut} />
                </MemoryRouter>
            );
        });
        // render components
        const elPublic = screen.getByText('Public');
        expect(elPublic).toBeInTheDocument();
    });

    it('Should render Private', async () => {
        await act(async () => {
            // render components
            jest.mock("../helpers/blogLambda");
            render(
                <MemoryRouter initialEntries={["/e/1c816a36-9d87-417f-bbda-12d59daef4dd"]}>
                    <EditBlogView user={testUser} signOut={signOut} />
                </MemoryRouter>
            );
        });
        // render components
        const elPrivate = screen.getByText('Private');
        expect(elPrivate).toBeInTheDocument();
    });
});