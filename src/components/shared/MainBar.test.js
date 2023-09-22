import React from "react";
import MainBar from "./MainBar";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "regenerator-runtime/runtime";
import { MemoryRouter } from "react-router";

it('Should render a parent element with a test ID', () => {
    render(<MemoryRouter><MainBar /></MemoryRouter>);
    const element = screen.queryByTestId('main-bar');
    expect(element).not.toBe(null);
});

it("Should render 'Home' text", () => {
    render(<MemoryRouter><MainBar /></MemoryRouter>);
    // Grab the home by it's text
    const home = screen.getByText('Home');
    // Assert that the home appears
    expect(home).toBeInTheDocument();
});

it("Should render 'Search' text", () => {
    render(<MemoryRouter><MainBar /></MemoryRouter>);
    const create = screen.getByText('Search');
    expect(create).toBeInTheDocument();
});

it("Should render 'Create' text", () => {
    render(<MemoryRouter><MainBar /></MemoryRouter>);
    const create = screen.getByText('Create');
    expect(create).toBeInTheDocument();
});

it("Should render 'Sign Out' text", () => {
    render(<MemoryRouter><MainBar /></MemoryRouter>);
    const create = screen.getByText('Sign Out');
    expect(create).toBeInTheDocument();
});

it("Should render 'Sign Up' text", () => {
    render(<MemoryRouter><MainBar /></MemoryRouter>);
    const create = screen.getByText('Sign Up');
    expect(create).toBeInTheDocument();
});

it("Should render 'User Page' text", () => {
    render(<MemoryRouter><MainBar /></MemoryRouter>);
    const create = screen.getByText('My Account');
    expect(create).toBeInTheDocument();
});
