import {render, screen, fireEvent} from "@testing-library/react"; 
import {BrowserRouter} from "react-router-dom";
import Step2Age from "./Step2Age";

test("test if button is disabled if age is too young(<12)", () => {
    const testhandleAge = jest.fn(); 
    const testvalidateAge = jest.fn(); 
    const testerror = ""; 
    const testuserData = {"age": 0}; 
    render (
        <BrowserRouter>
            <Step2Age userData={testuserData} handleAge={testhandleAge} validateAge={testvalidateAge} error={testerror}/> 
        </BrowserRouter>
    );
    const buttons = screen.getAllByRole("button");
    const button_next = buttons[1]; 
    expect(button_next).toBeDisabled();
})

test("test if button is disabled if age is too old (>100)", () => {
    const testhandleAge = jest.fn(); 
    const testvalidateAge = jest.fn(); 
    const testerror = ""; 
    const testuserData = {"age": 101}; 
    render (
        <BrowserRouter>
            <Step2Age userData={testuserData} handleAge={testhandleAge} validateAge={testvalidateAge} error={testerror}/> 
        </BrowserRouter>
    );
    const buttons = screen.getAllByRole("button");
    const button_next = buttons[1]; 
    expect(button_next).toBeDisabled();
})

test("test if button is disabled if age is not a number", () => {
    const testhandleAge = jest.fn(); 
    const testvalidateAge = jest.fn(); 
    const testerror = ""; 
    const testuserData = {"age": "abc"}; 
    render (
        <BrowserRouter>
            <Step2Age userData={testuserData} handleAge={testhandleAge} validateAge={testvalidateAge} error={testerror}/> 
        </BrowserRouter>
    );
    const buttons = screen.getAllByRole("button");
    const button_next = buttons[1]; 
    expect(button_next).toBeDisabled();
})

test("test if button is enabled if age input is valid", () => {
    const testhandleAge = jest.fn(); 
    const testvalidateAge = jest.fn(); 
    const testerror = ""; 
    const testuserData = {"age": 22}; 
    render (
        <BrowserRouter>
            <Step2Age userData={testuserData} handleAge={testhandleAge} validateAge={testvalidateAge} error={testerror}/> 
        </BrowserRouter>
    );
    const buttons = screen.getAllByRole("button");
    const button_next = buttons[1]; 
    expect(button_next).not.toBeDisabled();
})