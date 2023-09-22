import { render, screen } from '@testing-library/react';
import React from 'react';
import Spinner from './spinner';

describe('spinner', () => {
    it('Should render an element', ()=> {
        render(<Spinner show={true} />);
        const el = screen.getByTestId('spinner');
        expect(el).toBeInTheDocument();
    });

    it('Should not render an element by default', ()=> {
        render(<Spinner />);
        const el = screen.queryByTestId('spinner');
        expect(el).toBe(null);
    });

    it('Should not render an element if false', ()=> {
        render(<Spinner show={false} />);
        const el = screen.queryByTestId('spinner');
        expect(el).toBe(null);
    });
})