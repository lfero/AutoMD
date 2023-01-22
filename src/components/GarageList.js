import React, { useState, useEffect }from "react";
import {Dropdowns} from "./Dropdowns"
import "../css/GarageList.css";



export const GarageList = (showResults) => {  

  console.log("=======> showResults is: ", showResults)
  const [showMainPage, setShowMainPage] = useState()
  const [grageList, setGarageList] = useState([])
  const [problemsList, setProblemsList] = useState([])
  
  const[problem, setProblem] = useState(showResults.problem)
  const[openText, setOpenText] = useState(showResults.openText)


  useEffect(()=>{
		setShowMainPage(false);
	}, [])

  //get data from csv
  useEffect(() => {
    if(!openText && grageList.length === 0){
        fetch(`/api/getGaragesListByLambda/${problem}/${1}`).then(
        res => res.json()
      ).then(
        data_json => {
          setGarageList(data_json)
        }
      )
    }
    else if(openText && problemsList.length === 0 && showResults.freeText.length != 0){
      fetch(`/api/getFreeText/${showResults.freeText}`).then(
        res => res.json()
      ).then(
        data_json => {
          setProblemsList(data_json)
        }
      )
    }
  })



  const getProblem = () => {
    return problem ? 
    <div className="problem">{problem}</div> : ''
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
        <button onClick={() => setShowMainPage(true)} className="back_button">Back</button>
      </div>
    )
  }

  const getFreeTextTableResult = () => {
    if(showResults.freeText.length === 0){
      return(
        <div className="garage_list">
          <br/><br/>
          <div className="empty_text">You entered empty text. please insert some text to diagnose your problem</div>
          <button onClick={() => setShowMainPage(true)} className="back_button">Back</button>
        </div>
      )
    }
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
                <td><a style={{color:'white'}} href='#' onClick={() => problemClicked(val.problem)}>{val.problem}</a></td>
              </tr>
            )
          })}
        </table>
        <br/>
        <button onClick={() => setShowMainPage(true)} className="back_button">Back</button>
      </div>
    )
  }

  const problemClicked = (problemClicked) => {
   setProblem(problemClicked)
   setOpenText(false)
   //TODO: fetch again with the new problem
   fetch(`/api/getGaragesListByLambda/${problemClicked}/${1}`).then(
    res => res.json()
    ).then(
      data_json => {
        setGarageList(data_json)
      }
    )
  }

  const getOpenTextResult = () => {
    return(
      <div className="bacground_img">
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <h2 className="problem">{"Your car's problem migh be the following: "}</h2>
        <div className="more_details">{"(Click on the problem to get more details)"}</div>
        {getFreeTextTableResult()}  
      </div> 
    )
  }

  const sortData = (lambda) => {
    fetch(`/api/getGaragesListByLambda/${problem}/${lambda/10}`).then(
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
      </div> 
    )

  }

  const getResult = () => {
    return(
      openText? 
      <div>{getOpenTextResult()}</div> : <div>{getDropdownsResult()}</div>
    )

  }

  const showDropdownsPage = () => {
    console.log("----------> in showDropdownsPage")
    return(
      showMainPage? 
      <Dropdowns/> : null
    )
  }

  return (
    showResults && !showMainPage ?
      getResult() : showDropdownsPage()
  );
}


// <GarageTable/>
