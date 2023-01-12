import Dropdown from 'react-dropdown';
import React, { useState, useEffect }from "react";
import {GarageList} from "./GarageList"
import "../css/Dropdowns.css";

export const Dropdowns = () => {  

  //set states
  const [data_json, setData_json] = useState([])
  const [openText, setOpenText] = useState(false)
  const [firstValuePicked, setFirstValuePicked] = useState("") //High engine temperature
  const [secondValuePicked, setSecondValuePicked] = useState("")
  const [thirdValuePicked, setThirdValuePicked] = useState("")
  const [secondDropdown, setSecondDropdown] = useState([])
  const [thirdDropdown, setThirdDropdown] = useState([])
  const [problem, setProblem] = useState()
  const [showResultComponent, setShowResultComponent] = useState()

  useEffect(()=>{
		setShowResultComponent(false);
	}, [])


  //get data from csv
  useEffect(() => {
    if(data_json.length === 0){
      fetch("/readCsv").then(
        res => res.json()
      ).then(
        data_json => {
          setData_json(data_json)
        }
      )
    }
  })

  //update data when picking from dropdown
  const updateData = (valuePicked, jsonLevel) => {
    if(jsonLevel == 0){
      setFirstValuePicked(valuePicked)
      setSecondDropdown(Object.keys(data_json[valuePicked]))
    } else{
      setThirdDropdown(Object.keys(data_json[firstValuePicked][valuePicked]))
      setSecondValuePicked(valuePicked)
      setThirdValuePicked("")
    }
  }

  //update problem when selecting 3 symptoms
  const updateProblem = (valuePicked) => {
    setThirdValuePicked(valuePicked)
    setProblem(data_json[firstValuePicked][secondValuePicked][valuePicked])

  }

  const showOpenText = (showOpenText) => {
    setOpenText(showOpenText)
  }

  const getDropdownOrTextLink = () => {
    return(
      <div>
        <a hidden={openText} href='#' onClick={() => showOpenText(true)} className='dropdowns_or_freetext_link'>or click here to pick symptoms from dropdowns</a>
          <div hidden={openText}>
            <br/><br/>
            <input className='free_text' type="text" name="name" />
          </div>
        <a hidden={!openText} href='#' onClick={() => showOpenText(false)} className='dropdowns_or_freetext_link'>or click here to insert free text</a>
      </div>
    )
  }

  const getDropdowns = () => {
    return(
      <div>
        <div hidden={!openText}>
        <Dropdown onChange={(option) => updateData(option.value, 0)} className="dropdown_option"  options={Object.keys(data_json)} placeholder="select symptom.." />
        </div>
        <div hidden={firstValuePicked.length === 0 }>
        <Dropdown onChange={(option) => updateData(option.value, 1)} className="dropdown_option" options={secondDropdown} placeholder="select symptom.." />
        </div>
        <div hidden={secondValuePicked.length === 0}>
        <Dropdown hidden={true} onChange={(option) => updateProblem(option.value)} className="dropdown_option" options={thirdDropdown} placeholder="select symptom.." />
        </div>
      </div>

    )
  }

  return (
    showResultComponent ?  
    <GarageList showResults={showResultComponent} problem={problem}/> :
    <div>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <h2 className='welcome_text'>Get your initial car diagnosis before hitting the garage</h2>
        <div className='select_symptom_text'>Please pick you car symptom in order to diagnose the problem</div>
        {getDropdownOrTextLink()}
        {getDropdowns()}
        <div className='comment_text'>* Doctor Motor only gives you information about your car problem and does not replace any profissional car check or treatment </div>
        <button onClick={() => setShowResultComponent(true)} className="diagnose_button">show results</button>
        <button className="result_button">reset</button>
    </div>

  )
}
