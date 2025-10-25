import React, { useEffect, useState } from 'react'

const useDebounce = (value,delay) => {
    const [debounceValue,SetdebouncedValue] = useState(value)
    useEffect(()=>{
        const handler = setTimeout(() => 
            SetdebouncedValue(value),delay);
        // cleanup timer
        return (()=>clearTimeout(handler))
    },[value,delay])
  return debounceValue
}

export default useDebounce