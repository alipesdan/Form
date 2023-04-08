import React from "react";
import { Form as WebForm } from "react-bootstrap";

export const StateInput = ({ updateData, question }) => {
    return <WebForm.Select
        size={"lg"}
        onChange={({ target }) => updateData(question.key, target.value)}
        aria-label="Default select example">
        <option value="" selected="" disabled="">State</option>
        <option value="CA" data-products="null" data-min="100" data-max="255">California</option>
        <option value="DE" data-products="null" data-min="100" data-max="1000">Delaware</option>
        <option value="ID" data-products="null" data-min="100" data-max="1000">Idaho</option>
        <option value="MO" data-products="null" data-min="100" data-max="1500">Missouri</option>
        <option value="NV" data-products="{&quot;i&quot;:&quot;Installment Loan&quot;,&quot;p&quot;:&quot;Payday Loan&quot;}" data-min="100" data-max="1000">Nevada</option>
        <option value="TX" data-products="{&quot;i&quot;:&quot;Installment Loan&quot;,&quot;p&quot;:&quot;Payday Loan&quot;}" data-min="100" data-max="1500">Texas</option>
        <option value="UT" data-products="null" data-min="100" data-max="1000">Utah</option>
        <option value="WI" data-products="null" data-min="100" data-max="1500">Wisconsin</option>
    </WebForm.Select>;
};

export default StateInput;
