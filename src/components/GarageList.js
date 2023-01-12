import React, { useState, useEffect }from "react";
import {Slider} from "antd"
import {GarageTable} from "./GarageTable"
import "../css/GarageList.css";
//import 'react-dropdown/style.css';



export const GarageList = (showResults, problem) => {  

  const [showMainPage, setShowMainPage] = useState()
  const [grageList, setGarageList] = useState([])

  useEffect(()=>{
		setShowMainPage(false);
	}, [])

  //get data from csv
  useEffect(() => {
    if(grageList.length === 0){
      fetch("/getGaragesList").then(
        res => res.json()
      ).then(
        data_json => {
          setGarageList(data_json)
        }
      )
    }
    console.log("--------------------> grageList: ", grageList)
  })

  //console.log("------> showResults: ", showResults)
  //console.log("------> problem: ", showResultsproblem)

  const getProblem = () => {
    return showResults.problem ? showResults.problem : ''
  }

  const getSlider = () => {
    return(
      <div>
         <div style={{color:'white', marginLeft:'90px'}}>Modify your search by picking garage by location/cost</div>
          <br/>
          <div style={{maxWidth:'200px', marginLeft:'100px'}}>
            <Slider min={0} max={1} defaultValue={0.5} style={{borderColor:'white'}}/>
            <span style={{color:'white'}}>price</span>
            <span style={{color:'white', marginLeft:'130px'}}>location</span>
            <button style={{marginTop:'20px'}}>Refresh</button>
          </div>
      </div>
    )

  }

  return (
    showResults ?
      <div className="bacground_img">
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <h2 className="problem_display">{getProblem()}</h2>
        <div className="grages_text">Here are some good garages near you:</div>
        <GarageTable/>
        {getSlider()}
      </div> : null
  );
}

