import React from 'react';
import UserView from './UserView';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('Parent Component', () => {
    it('renders Child component - main bar', () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const child = screen.queryByTestId('main-bar');
        expect(child).not.toBe(null);
    });
});

describe('User View Component', () => {
    it('renders a list of blogs heading', () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const blogListTitle = screen.getByText('Your Blogs');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders user account settings heading', () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const blogListTitle = screen.getByText('Account settings');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders user name', async () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const blogListTitle = await screen.findByText('A B Creely');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders user joined date', async () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const blogListTitle = await screen.findByText('01/11/2011');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders user id', async () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const blogListTitle = await screen.findByText('007df37bd4e4f1097d122983daa56ca');
        expect(blogListTitle).toBeInTheDocument();
    });
});

describe('User View Component - render blog one', () => {
    it('renders blog name', async () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const blogListTitle = await screen.findByText('blog_1');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders blog published date', async () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const blogListTitle = await screen.findByText('10/11/2011');
        expect(blogListTitle).toBeInTheDocument();
    });
});

describe('User View Component - render blog two', () => {
    it('renders blog name', async () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const blogListTitle = await screen.findByText('blog_2');
        expect(blogListTitle).toBeInTheDocument();
    });
    it('renders blog published date', async () => {
        render(<MemoryRouter><UserView /></MemoryRouter>);
        const blogListTitle = await screen.findByText('11/11/2011');
        expect(blogListTitle).toBeInTheDocument();
    });
});