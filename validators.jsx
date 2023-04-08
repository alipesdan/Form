export const validators = {
    email:(value,question) => {
        // eslint-disable-next-line
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (regex.test(value)) {
            return { pass: true };
        } else {
            return {
                pass: false,
                message: "Please include an '@' and a domain (site.com,org,net...etc) in your answer"
            };
        }
    },
    routing_number:(value,question)=>{
        if(value){
            return Boolean(value?.length !== 9) ? {
                pass: false,
                message:"Routing number is too short"
            } : {pass:true}
        }
    },
    tel:(value,question)=>{
        if(value){
            const count = value.replace(/\D/g,'').length
            return count <10 ? {
                pass:false,
                message:"Phone number is too short."
            } : {pass:true}
        }
    },
    bank_account:(value,question)=>{
        if(value){
            return  Boolean(value && String(value)?.length < 7) ? {
                pass:false,
                message:"Bank account number is too short."
            } : {pass:true}
        }
    },
    google_place_address:(value,question)=>{
        if(value){
            return !Boolean(value.address && value.city && value.state && value.zip_code) ? 
            {
                pass:false,
                message:"Address incomplete."
            } : {pass:true}
        }
    },
    ssn:(value,question)=>{
        if(value){
            const count = value.replace(/-/g,"").length
            return count <9 ? {
                pass:false,
                message:"Social security number is too short."
            } : {pass:true}
        }
    },
    twilio_verify:(value,question)=>{
            console.log("!!!! VALIDATOR")
             return {pass:Boolean(value)}
    }
};


export default validators;