import React from 'react';
import UserView from './UserView';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { testUser, signOut } from '../testing';
import userEvent from '@testing-library/user-event'

import { Auth } from 'aws-amplify';

jest.mock('aws-amplify', () => ({
    Auth: {
        currentAuthenticatedUser: jest.fn(() => {
            return { user: 'test-user' }
        }),
        updateUserAttributes: jest.fn(() => {
            return;
        })
    }
}));

jest.mock("../helpers/blogLambda");

async function renderBlog() {
    return await act(async () => {
        render(
            <MemoryRouter>
                <UserView user={testUser} signOut={signOut} />
            </MemoryRouter>
        );
    });
}

describe('Parent Component', () => {
    it('renders Child component - main bar', async () => {
        await renderBlog();
        const child = screen.queryByTestId('main-bar');
        expect(child).not.toBe(null);
    });
});

describe('User View Component', () => {
    it('renders a list of blogs heading', async () => {
        await renderBlog();
        const blogListTitle = screen.getByText('Your Blogs');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders user account settings heading', async () => {
        await renderBlog();
        const blogListTitle = screen.getByText('Account settings');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders user id', async () => {
        await renderBlog();
        const blogListTitle = screen.getByText('1234');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders user name', async () => {
        await renderBlog();
        const blogListTitle = screen.getByText('A B Creely');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders user email', async () => {
        await renderBlog();
        const blogListTitle = screen.getByText('test@test.com');
        expect(blogListTitle).toBeInTheDocument();
    });
});

describe('User View Component - render blog one', () => {
    it('renders blog name', async () => {
        await renderBlog();
        const blogListTitle = screen.getByText('Test Blog One');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders blog published date', async () => {
        await renderBlog();
        const blogListTitle = screen.getByText('10/11/2011');
        expect(blogListTitle).toBeInTheDocument();
    });
});

describe('User View Component - render blog two', () => {
    it('renders blog name', async () => {
        await renderBlog();
        const blogListTitle = screen.getByText('Test Blog Two');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders blog published date', async () => {
        await renderBlog();
        const blogListTitle = screen.getByText('11/11/2011');
        expect(blogListTitle).toBeInTheDocument();
    });
});

describe('User View Component - Edit username', () => {
    beforeEach(() => {
        jest.spyOn(window, 'prompt').mockImplementation(() => 'Joie');
    });

    afterEach(() => {
        window.prompt.mockRestore();
    });

    it('renders EDIT button', async () => {
        await renderBlog();
        const editButton = screen.getByRole('button', { name: 'Edit' });
        expect(editButton).toBeInTheDocument();

    });
    it('Edit button onClick calls prompt', async () => {
        await renderBlog();
        const editButton = screen.getByRole('button', { name: 'Edit' });
        await userEvent.click(editButton);
        expect(window.prompt).toHaveBeenCalled();
    });
    it('Calls Auth methods', async () => {
        await renderBlog();
        const editButton = screen.getByRole('button', { name: 'Edit' });
        await userEvent.click(editButton);
        expect(Auth.currentAuthenticatedUser).toHaveBeenCalled();
        expect(Auth.updateUserAttributes).toHaveBeenCalled();
    });
});

// @TODO - fix this
// describe('User Data Component - loading stateÍ', () => {
//     it('Error will fall back to text', async () => {
//         await act(async () => {
//             render(
//                 <MemoryRouter>
//                     <UserView user={{ attributes: { sub: '123' } }} signOut={signOut} />
//                 </MemoryRouter>
//             ); 
//         });
//         const fallback = screen.getByText('...loading account settings');
//         expect(fallback).toBeInTheDocument();Í
//     });
// });
