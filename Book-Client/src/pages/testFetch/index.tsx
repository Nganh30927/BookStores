import React from 'react'
import config from '../../constants/config';

const testFetch = () => {
    const [book, setBook] = React.useState(null);
    React.useEffect(()=>{
        const fetchData = async () =>{
            const res = await fetch ( config.urlAPI+'/books');
            const data = await res.json();
            console.log(data)
        }
        fetchData();
    },[])


  return (
    <div className='container mx-auto mt-10'>
       
    </div>
  )
}

export default testFetch