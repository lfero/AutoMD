//import React, { useState, useEffect }from "react";
import {Table} from "antd"
import "../css/App.css";


export const GarageTable = (showResults, problem) => {  

  
  //get data from csv
  /*useEffect(() => {
    fetch("/getGaragesList").then(
      res => res.json()
    ).then(
      data_json => {
       console.log("------------> data is: ", data_json)
      }
    )
  })*/
    
    const dataSource = [
        {
          key: '1',
          name: 'Kaya habonim',
          phone: '04-7703242',
          address: 'Tel Aviv 20, Haifa',
        },
        {
          key: '2',
          name: 'Mosach tzameret',
          phone: '04-8414929',
          address: 'Ha-hestadrot 37, Haifa',
        },
      ];
      
      const columns = [
        {
          title: 'Garage name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Phone',
          dataIndex: 'phone',
          key: 'phone',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
      ];


    return (
        <div style={{margin:'90px'}}>
            <Table dataSource={dataSource} columns={columns} />
        </div>
      )
}