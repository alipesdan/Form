import React from "react";
import { Form as WebForm, FormControl,InputGroup } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';
import  formatters  from "./formatters";
import  validators  from "./validators";
import  StateInput  from "./inputs/StateInput";

import  GooglePlaceSearch  from "./inputs/GooglePlaceSearch";
import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';


const extractContent = (s) => {
  var span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
}



export const Form = (props) => {
    // const { questions, data, setData, setIsValid,lang }
    const [data,setData] = React.useState({});
    const [isValid,setIsValid] = React.useState(false);
    const [questions,setQuestions] = React.useState(props.questions)
    const lang = "English";


    const [isVisible,setIsVisible] = React.useState({});
    const [validation,setValidation] = React.useState({});
    const [reset,setReset] = React.useState(false);

    const updateData = (key,value)=>{
        const nData = {...data};
        nData[key] = value;
        setData(nData);       
    }


    const  conditionsChecker = (question) => {
        let conditionsMet = true;
            if(question?.conditionals){
                 conditionsMet = (
                (question?.conditionals === null || question?.conditionals?.length === 0) || 
                    Boolean(question?.conditionals.filter((condition)=>{
                        if(condition.action === "show"){
                            if(condition.condition === "equals"){
                                return ["submissionAttempts"].includes(condition.key) ? 
                                        Number(data[condition.key]) === Number(condition.value) :  data[condition.key] === condition.value
                            }
                            if(condition.condition === "less_than"){
                                return data[condition.key] < condition.value
                            }
                            if(condition.condition === "greater_than"){
                                return data[condition.key] > condition.value
                            }

                            if(condition.condition === "greater_than_or_equal"){
                                return data[condition.key] >= condition.value
                            }

                            if(condition.condition === "less_than_or_equal"){
                                return data[condition.key] <= condition.value
                            }
                        }
                         else if(condition.action === "hide"){
                            if(condition.condition === "equals"){
                                return !Boolean(data[condition.key] === condition.value)
                            }
                            if(condition.condition === "less_than"){
                                return !Boolean(data[condition.key] < condition.value)
                            }
                            if(condition.condition === "greater_than"){
                                return !Boolean(data[condition.key] > condition.value)
                            }

                            if(condition.condition === "greater_than_or_equal"){
                                return !Boolean(data[condition.key] >= condition.value)
                            }

                            if(condition.condition === "less_than_or_equal"){
                                return !Boolean(data[condition.key] <= condition.value)
                            }
                        } else{
                            return true
                        }
                    }).length)
                )
            }

            return conditionsMet
    }


    React.useEffect(()=>{
        const validate = (key,value) => {
                const question = questions.find((q)=>q.key === key);
                if(!Boolean(question)){
                    return {pass:false}
                }  

                const {type,required} = question;
                if(required){
                    if(validators?.[type]){
                        return (
                            Boolean(typeof(value) === "string" && value?.length > 0) ||
                            Boolean(typeof(value) === "object" && Object.keys(value).length > 0) ||
                            Boolean(typeof(value) === "boolean")
                        ) ?  validators[type](value) : {pass:false}
                    } else {
                        return question.type === "checkbox" ? {pass:Boolean(value)} : {pass:Boolean(value?.length > 0)}
                    }
                }
            }

        const nValidation = {};
        // if( Object.keys(data)?.length){
        //     Object.keys(data).forEach((key)=>{
        //         nValidation[key] = validate(key,data[key]);
        //     })
        //     setValidation(nValidation);
        // }   

        const nIsVisible = {};
        // questions.forEach(q=>{
        //    nIsVisible[q.key] = conditionsChecker(q);
        // })
        setIsVisible(nIsVisible);

        // eslint-disable-next-line
    },[data,questions])


    React.useEffect(()=>{        
        const givenAnswers = Object.keys(validation)
            ?.filter((key)=>Boolean(validation?.[key]?.pass) && !Boolean(key === "submissionAttempts") && Boolean(isVisible[key])
            );

        const givenQuestions = questions
            ?.filter(q=>Boolean(q?.required) && Boolean(q?.type !== "no-input") && Boolean(isVisible[q?.key])
            )

    
        let check =  givenAnswers?.length >= (givenQuestions?.length)
            
        setIsValid(
            Boolean(check)
        )
        // eslint-disable-next-line
    },[validation,isVisible])

    
    
    return questions?.length ? <>
    <div className="row" style={{justifyContent: 'left'}}>
        {questions
        ?.filter(q=>Boolean(q.active))
        .map((question) => {
            const label = question.label
            let placeholder = null;
            if( question?.placeholder ){
                placeholder = question?.placeholder?.find(l=>l.language === lang)?.text;
            }
            return <div key={question.key} className={`col-lg-${question.col} mb-3`}>      
                    {Boolean(question.type !== "checkbox") && <WebForm.Text className="text-muted p-0 m-0">
                        { question.type !== "no-input" ? 
                        <div dangerouslySetInnerHTML={{__html: label}} />
                          : 
                        <div className={question.template.includes("alert") ? "alert "+question.template : "" } dangerouslySetInnerHTML={{__html: label}}/>
                        }
                </WebForm.Text>}
                <InputGroup key={question.key}>
                    
                {Boolean(question?.prepend) && <InputGroup.Text id="basic-addon1">{question.prepend}</InputGroup.Text> }
                    {
                    question.type === "no-input" ?
                        null
                    :
                  
                    question.type === "radio" ?
                        <div>
                            {question?.choices?.map((option,i)=><WebForm.Check 
                                key={question?.key+"_"+i}
                                type={"radio"}
                                name={question?.key}
                                selected={option.value === data[question?.key]} 
                                value={option.value} 
                                label={extractContent(option.label)}
                                onChange={()=>updateData(question.key, option.value)} 
                            />)}
                        </div>
                    :
                    
                    question.type === "google_place_address" ?
                        <GooglePlaceSearch   {...{setData,data, question}} />
                    :
                    ["checkbox"].includes(question.type)  ?
                        <label > 
                        <div style={{display:"flex",flexDirection:"row"}}>                         
                                <div style={{flex:.5}}>
                                    <WebForm.Check
                                        inputClass="p-0 ml-auto" 
                                        type={question.type} 
                                        onChange={({target})=>updateData(question.key, data[question?.key] ? !data[question?.key] : true)} 
                                        name={question.key} 
                                        checked={Boolean(data[question?.key])}
                                    /> 
                                    </div>
                                  {Boolean(question?.required) &&  <span className="text-danger">*</span> }
                                    <div dangerouslySetInnerHTML={{__html: label}}/>
                                </div>
                        </label>
                        :
                        question.type === "state" ?
                            <StateInput {...{updateData,question}} />
                        :
                        question.type === "select" ?
                            <WebForm.Select
                                className="form-control form-select-lg"
                                style={{minHeight:49}}
                                name={question.key}
                                value={data[question?.key]}
                                onChange={({target})=>updateData(question.key,target.value)}
                            >
                                <option disabled={true} selected={!Boolean(data[question?.key])} hidden={true}>{extractContent(label)}...</option>
                                {question?.choices?.map((option,i)=><option 
                                key={question?.key+"_"+i}
                                selected={option.value === data[question?.key]} value={option.value}>{option.label}</option>)}
                            </WebForm.Select>
                        :
                        <>
                            <FormControl
                                className={`my-0
                                ${ validation?.[question?.key] 
                                && 
                                !Boolean(validation[question?.key]?.pass) 
                                && 
                                `border-warning` } 
                                `}
                                size={"lg"}
                                type={question.type}
                                max={Number(question?.number_input_options?.max)}
                                min={Number(question?.number_input_options?.min)}
                                step={Number(question?.number_input_options?.step)}
                                value={ data[question?.key] }
                                placeholder={placeholder ?? extractContent(label)}
                                as={question.type === "textarea" ? "textarea" : "input" }
                                onChange={({target})=>updateData(question.key,
                                    formatters?.[question?.type] ?
                                    formatters?.[question?.type](target.value) :
                                    target.value
                                )}
                            />
                        </>}
                    {Boolean(question?.append) && <InputGroup.Text id="basic-addon1">{question?.append}</InputGroup.Text> }
                </InputGroup>
                 <div>
                    {Boolean(validation[question?.key]?.message) &&  <div className="text-danger">{validation[question?.key]?.message}</div>} 
                </div>
                {question?.number_input_options?.show_slider && question?.type === "number"  && <>
                <RangeSlider
                    value={data[question?.key] ?? 0}
                    step={ question?.number_input_options?.step ? Number(question?.number_input_options?.step ) : 25}
                    min={ question?.number_input_options?.min ? Number(question?.number_input_options?.min ) : 0}
                    max={ question?.number_input_options?.max ? Number(question?.number_input_options?.max ) : 1000}
                    onChange={changeEvent => updateData(question.key,changeEvent.target.value)}
                />
                </> }
            </div>;
        })}
    </div>
    </> : null
};

export default Form