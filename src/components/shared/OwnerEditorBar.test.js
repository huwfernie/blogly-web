import React from "react";
import OwnerEditorBar from "./OwnerEditorBar";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

it('Should render a parent element with a test ID', () => {
    render(<MemoryRouter><OwnerEditorBar showEditorBar={true} blogId={"1234"} /></MemoryRouter>);
    const element = screen.queryByTestId('owner-edit-bar');
    expect(element).not.toBe(null);
});

it("Should render 'Edit' text to an owner", () => {
    render(<MemoryRouter><OwnerEditorBar showEditorBar={true} blogId={"1234"} /></MemoryRouter>);
    // Grab the edit by it's text
    const edit = screen.getByText('Edit');
    // Assert that the edit appears
    expect(edit).toBeInTheDocument();
});

it("Should not render 'Edit' text to a non owner", () => {
    render(<MemoryRouter><OwnerEditorBar showEditorBar={false} blogId={"1234"} /></MemoryRouter>);
    // Grab the edit by it's text
    const edit = screen.queryByText('Edit');
    // Assert that the edit appears
    expect(edit).not.toBeInTheDocument();
});

it("Should assume no data is a non-owner (fail gently)", () => {
    render(<MemoryRouter><OwnerEditorBar blogId={"1234"} /></MemoryRouter>);
    // Grab the edit by it's text
    const edit = screen.queryByText('Edit');
    // Assert that the edit appears
    expect(edit).not.toBeInTheDocument();
});
