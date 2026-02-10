import {render, screen, fireEvent} from "@testing-library/react"; 
import {BrowserRouter} from "react-router-dom";
import Step1Name from "./Step1Name";

test("renders name input field", ()=> {
    const testhandleName = jest.fn();
    const testuserData = {"name": ""};
    render(
        <BrowserRouter>
            <Step1Name userData={testuserData} handleName={testhandleName}/>
        </BrowserRouter>
    ); 
    const input = screen.getByPlaceholderText(/enter your name/i);
    expect(input).toBeInTheDocument();
});

test("button is disabled when input field is empty", ()=> {
    const testHandleName = jest.fn(); 
    const testuserData = {"name": ""}; 
    render (
        <BrowserRouter>
            <Step1Name userData={testuserData} handleName={testHandleName} />
        </BrowserRouter>
    );
    const button = screen.getByRole("button"); 
    expect(button).toBeDisabled();
}); 

test("button is not disabled when input field is not empty", ()=> {
    const testHandleName = jest.fn(); 
    const testuserData = {"name": "Test"};
    render(
        <BrowserRouter>
            <Step1Name userData={testuserData} handleName={testHandleName} />
        </BrowserRouter>
    )
    const button = screen.getByRole("button");
    expect(button).not.toBeDisabled(); 
}); 