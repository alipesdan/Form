import React from "react";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

export const GooglePlaceSearch = ({setData,data, question})=>{
    
    // Keep hardcoded for now. Shared ENV variables between Laravel and React are in progress.
    const key = "AIzaSyDIfyCjV5lWqZ8RbaYA5eW3nS4sxu5ODXc";
    const [placeId,setPlaceId] = React.useState(null);
    const {
        placesService,
    } = usePlacesService({
        apiKey: key,
    });

    React.useEffect(()=>{
        if(placeId){
            placesService?.getDetails(
                {placeId},
                ({address_components}) => {
                    const findAttr = (key)=> address_components.find((ac)=>{
                        return ac.types.includes(key)
                    })
                    const nData = {...data}
                    nData[question.key] ={
                        address:findAttr("street_number").long_name+" "+findAttr("route").long_name,
                        city:findAttr("locality").long_name,
                        state:findAttr("administrative_area_level_1").long_name,
                        zip_code:findAttr("postal_code").long_name,
                    }
                    setData(nData);

                }
            )
        }
    },[placeId])

    return <div className="w-100" style={{zIndex:2,position: "relative"}}>
        <GooglePlacesAutocomplete 
        apiKey={key}
       
    selectProps={{
    styles:{
        control: (provided, state) => ({
        ...provided,
        minHeight:50
        }),    
    },
    onChange:(e)=>{
        setPlaceId(e.value.place_id)
    }}} />
    </div>
}

export default GooglePlaceSearch;