import {render, screen, fireEvent} from "@testing-library/react"; 
import {BrowserRouter} from "react-router-dom";
import Step3Skintype from "./Step3Skintype";

test("check if button is disabled if data is empty", () => {
    const testHandlePopup = jest.fn();
    const testPopup = false;
    const testSkintypeInfo = <div><p>Test</p></div>
    const testHandleSkintype = jest.fn();
    const testUserData = {skin_type: ""}; 

    render(
        <BrowserRouter> 
            <Step3Skintype handlePopup={testHandlePopup} popup={testPopup} skintypeInfo={testSkintypeInfo} handleSkinType={testHandleSkintype} userData={testUserData} />
        </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button"); 
    const button_next = buttons[1]; 
    expect(button_next).toBeDisabled();

});

test("skintypeInfo is rendered if popup is true", () => {
    const testHandlePopup = jest.fn();
    const testPopup = true;
    const testSkintypeInfo = <div><p>There is skintype info</p></div>
    const testHandleSkintype = jest.fn();
    const testUserData = {skin_type: ""}; 

    render(
        <BrowserRouter> 
            <Step3Skintype handlePopup={testHandlePopup} popup={testPopup} skintypeInfo={testSkintypeInfo} handleSkinType={testHandleSkintype} userData={testUserData} />
        </BrowserRouter>
    );

    const input = screen.getByText(/there is skintype info/i);
    expect(input).toBeInTheDocument();
});
