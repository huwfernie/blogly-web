import React from "react";
import IndexBar from "./IndexBar";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "regenerator-runtime/runtime";
import { MemoryRouter } from "react-router";

// @TODO - Mock the signout function and test it

describe('Un-Authenticated User', () => {

    function renderPage() {
        return render(<MemoryRouter><IndexBar user={undefined} signOut={null} /></MemoryRouter>);
    }

    it('Should render a parent element with a test ID', () => {
        renderPage();
        const element = screen.queryByTestId('index-bar');
        expect(element).not.toBe(null);
    });

    it("Should render 'Sign In' text", () => {
        renderPage();
        const home = screen.getByText('Sign In');
        expect(home).toBeInTheDocument();
    });

    it("Should render 'Sign Up' text", () => {
        renderPage();
        const create = screen.getByText('Sign Up');
        expect(create).toBeInTheDocument();
    });
});


describe('Authenticated User', () => {

    function renderPage() {
        return render(<MemoryRouter><IndexBar user={"user"} signOut={null} /></MemoryRouter>);
    }
    it('Should render a parent element with a test ID', () => {
        renderPage();
        const element = screen.queryByTestId('index-bar');
        expect(element).not.toBe(null);
    });

    it("Should render 'Create' text", () => {
        renderPage();
        const home = screen.getByText('Create');
        expect(home).toBeInTheDocument();
    });

    it("Should render 'Sign Out' text", () => {
        renderPage();
        const home = screen.getByText('Sign Out');
        expect(home).toBeInTheDocument();
    });

    it("Should render 'My Account' text", () => {
        renderPage();
        const create = screen.getByText('My Account');
        expect(create).toBeInTheDocument();
    });
});