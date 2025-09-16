import React, { useEffect } from 'react'
import DynamicDataTable from '../../../Components/Tables/DynamicDataTable'
import MetaLeads from "../../../Zustand/MetaLeadsGet"
const Meta = () => {
  const {metaleads , error , loading,fetchMetaLeads} = MetaLeads()

  useEffect(()=>{
fetchMetaLeads()
  },[])
  console.log(metaleads)
  return (
    <div>
      <DynamicDataTable apiData={metaleads}/>
    </div>
  )
}

export default Meta