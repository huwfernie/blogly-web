import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import "regenerator-runtime/runtime";
import { MemoryRouter } from "react-router";
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsExports from '../../../src/aws-exports';

import { BypassAuth } from './BypassAuth';

Amplify.configure(awsExports);

jest.mock('../shared/IndexBar', () => {
    return jest.fn(() => null)
  })

describe('Un-Authenticated User', () => {

    function Children() {
        return (<div data-testid="children">CHILREN</div>)
    }


    async function renderPage() {
        return await act(async () => {
            render(
                <MemoryRouter>
                    <Authenticator.Provider>
                        <BypassAuth>
                            <Children />
                        </BypassAuth>
                    </Authenticator.Provider>
                </MemoryRouter>
            );
        });
    }

    it('Should render children', async () => {
        await renderPage();
        const element = screen.getByTestId('children');
        expect(element).not.toBe(null);
        expect(element).toBeInTheDocument();
    });
});
