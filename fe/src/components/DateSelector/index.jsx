import React from 'react'
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;

function DateSelector({date, setDate}) {
  const handlePick = (value, dateString) => {
    if(dateString && dateString[0]) {
      dateString[0] = dateString[0] + "T00:00:00Z";
    }
    if(dateString && dateString[1]) {
      dateString[1] = dateString[1] + "T00:00:00Z";
    }
    setDate({value, dateString})}
  return (
    <RangePicker value={date ? date.value : [null, null]} format="YYYY-MM-DD" onChange={handlePick}
    allowEmpty={[true, true]} style={{marginLeft: 10}}/>
  )
}

export default DateSelector
