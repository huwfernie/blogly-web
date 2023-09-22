import React from 'react';
import { render, screen } from '@testing-library/react';
import EditBlogView from './EditBlogView';
import { MemoryRouter } from 'react-router';

describe('EditBlogView', () => {
    it('Should render an element', () => {
        render(<MemoryRouter><EditBlogView /></MemoryRouter>);
        const el = screen.getByTestId('edit-blog-view');
        expect(el).toBeInTheDocument();
    });

    // it('Should not render an element by default', ()=> {
    //     render(<MemoryRouter><EditBlogView /></MemoryRouter>);
    //     const el = screen.queryByTestId('EditBlogView');
    //     expect(el).toBe(null);
    // });

    // it('Should not render an element if false', ()=> {
    //     render(<EditBlogView show={false} />);
    //     const el = screen.queryByTestId('EditBlogView');
    //     expect(el).toBe(null);
    // });
});

describe('EditBlogView - buttons', () => {
    it('Should render save', () => {
        render(<MemoryRouter><EditBlogView /></MemoryRouter>);
        const el = screen.getByText('Save');
        expect(el).toBeInTheDocument();
    });

    it('Should render delete', () => {
        render(<MemoryRouter><EditBlogView /></MemoryRouter>);
        const el = screen.getByText('Delete');
        expect(el).toBeInTheDocument();
    });

    it('Should render publish', () => {
        render(<MemoryRouter><EditBlogView /></MemoryRouter>);
        const el = screen.getByText('Publish');
        expect(el).toBeInTheDocument();
    });
});