import React from "react";
import MainBar from "./MainBar";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "regenerator-runtime/runtime";
import { MemoryRouter } from "react-router";

describe('Un-Authenticated User', () => {
    
    function renderPage() {
        return render(<MemoryRouter><MainBar user={undefined} signOut={null} /></MemoryRouter>);
    }

    it('Should render a parent element with a test ID', () => {
        renderPage();
        const element = screen.queryByTestId('main-bar');
        expect(element).not.toBe(null);
    });
    
    it("Should render 'Home' text", () => {
        renderPage();
        // Grab the home by it's text
        const home = screen.getByText('Home');
        // Assert that the home appears
        expect(home).toBeInTheDocument();
    });
    
    it("Should render 'Search' text", () => {
        renderPage();
        const create = screen.getByText('Search');
        expect(create).toBeInTheDocument();
    });
    
    it("Should render 'Sign In' text", () => {
        renderPage();
        const create = screen.getByText('Sign In');
        expect(create).toBeInTheDocument();
    });
    
    it("Should render 'Sign Up' text", () => {
        renderPage();
        const create = screen.getByText('Sign Up');
        expect(create).toBeInTheDocument();
    });
});


describe('Authenticated User', () => {
    
    function renderPage() {
        return render(<MemoryRouter><MainBar user={"user"} signOut={null} /></MemoryRouter>);
    }

    it('Should render a parent element with a test ID', () => {
        renderPage();
        const element = screen.queryByTestId('main-bar');
        expect(element).not.toBe(null);
    });

    it("Should render 'Home' text", () => {
        renderPage();
        // Grab the home by it's text
        const home = screen.getByText('Home');
        // Assert that the home appears
        expect(home).toBeInTheDocument();
    });

    it("Should render 'Search' text", () => {
        renderPage();
        const create = screen.getByText('Search');
        expect(create).toBeInTheDocument();
    });

    it("Should render 'Create' text", () => {
        renderPage();
        const create = screen.getByText('Create');
        expect(create).toBeInTheDocument();
    });

    it("Should render 'Sign Out' text", () => {
        renderPage();
        const create = screen.getByText('Sign Out');
        expect(create).toBeInTheDocument();
    });

    it("Should render 'My Account' text", () => {
        renderPage();
        const create = screen.getByText('My Account');
        expect(create).toBeInTheDocument();
    }); 
});