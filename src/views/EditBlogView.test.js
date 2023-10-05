import React from 'react';
import { render, screen, act } from '@testing-library/react';
import EditBlogView from './EditBlogView';
import { MemoryRouter } from 'react-router';
import { testUser, signOut } from '../testing';

// Not needed
// import { getBlog } from "../helpers/blogLambda";

// Mock at global scope :: https://dev.to/viewplatdevto/jest-mock-module-not-working-double-check-these-4mnp
jest.mock("../helpers/blogLambda");

async function renderPage() {
    return await act(async () => {
        render(
            <MemoryRouter initialEntries={["/e/1c816a36-9d87-417f-bbda-12d59daef4dd"]}>
                <EditBlogView user={testUser} signOut={signOut} />
            </MemoryRouter>
        );
    });
}

describe('EditBlogView', () => {
    it('Should render an element', async () => {
        await renderPage();
        const el = screen.getByTestId('edit-blog-view');
        expect(el).toBeInTheDocument();
    });
});

describe('EditBlogView - buttons', () => {
    it('Should render save', async () => {
        await renderPage();
        // screen.debug();
        const elSave = screen.getByText('Save');
        expect(elSave).toBeInTheDocument();
    });

    it('Should render delete', async () => {
        await renderPage();
        const elDelete = screen.getByText('Delete');
        expect(elDelete).toBeInTheDocument();
    });

    it('Should render Public', async () => {
        await renderPage();
        const elPublic = screen.getByText('Public');
        expect(elPublic).toBeInTheDocument();
    });

    it('Should render Private', async () => {
        await renderPage();
        const elPrivate = screen.getByText('Private');
        expect(elPrivate).toBeInTheDocument();
    });
});