import React, { useState, useEffect }from "react";
import {Slider} from "antd"
import "../css/GarageList.css";



export const GarageList = (showResults) => {  

  const [showMainPage, setShowMainPage] = useState()
  const [grageList, setGarageList] = useState([])
  const [problemsList, setProblemsList] = useState([])


  useEffect(()=>{
		setShowMainPage(false);
	}, [])

  //get data from csv
  useEffect(() => {
    if(!showResults.openText && grageList.length === 0){
      fetch(`/getGaragesByProblem/${showResults.problem}`).then(
        res => res.json()
      ).then(
        data_json => {
          setGarageList(data_json)
        }
      )
    }
    else if(showResults.openText && problemsList.length === 0){
      fetch(`/getFreeText/${showResults.freeText}`).then(
        res => res.json()
      ).then(
        data_json => {
          setProblemsList(data_json)
        }
      )
    }
  })



  const getProblem = () => {
    return showResults.problem ? 
    <div className="problem">{showResults.problem}</div> : ''
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

  
  const getDrpdownsTableResult = () => {
    return(
      grageList.length == 0? <div className="loading">Loading...</div> :
      <div className="garage_list">
        <table>
          <tr>
            <th>garage name</th>
            <th>distance</th>
            <th>price</th>
          </tr>
          {grageList.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.garageName}</td>
                <td>{val.distance} meters </td>
                <td>{val.price} ILS</td>
              </tr>
            )
          })}
        </table>
      </div>
    )
  }

  const getFreeTextTableResult = () => {
    return(
      problemsList.length == 0? <div className="loading">Loading...</div> :
      <div className="garage_list">
        <table>
          <tr>
            <th>symptomA</th>
            <th>symptomB</th>
            <th>symptomC</th>
            <th>problem</th>
          </tr>
          {problemsList.map((val, key) => {
            return (
              <tr key={key}>
                <td>{val.symptomA}</td>
                <td>{val.symptomB}</td>
                <td>{val.symptomC}</td>
                <td>{val.problem}</td>
              </tr>
            )
          })}
        </table>
      </div>
    )
  }

  const getOpenTextResult = () => {
    return(
      <div className="bacground_img">
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <h2 className="problem">{"Your search: " + showResults.freeText }</h2>
        <h2 className="problem">{"Your car's problem migh be the following: "}</h2>
        {getFreeTextTableResult()}  
      </div> 
    )
  }

  const sortData = (lambda) => {
    fetch(`/getGaragesListByLambda/${showResults.problem}/${lambda/10}`).then(
      res => res.json()
    ).then(
      data_json => {
        setGarageList(data_json)
      }
    )
    
  }

  const getDropdownsResult = () => {
    return(
      <div className="bacground_img">
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <h2>{getProblem()}</h2>
        <div className="grages_text">Here are some good garages near you:</div>
        <input 
          type='range' 
          min={0} 
          max={10} 
          onChange={(e) => sortData(e.target.value)}
        />
        <br/>
        <span className="slider_closer">cheaper</span>
        <span className="slider_cheaper">closer</span>
        {getDrpdownsTableResult()}  
        {getSlider()}
      </div> 
    )

  }

  const getResult = () => {
    return(
      showResults.openText? 
      <div>{getOpenTextResult()}</div> : <div>{getDropdownsResult()}</div>
    )

  }

  return (
    showResults ?
      <div>{getResult()}</div> : null
  );
}


// <GarageTable/>
