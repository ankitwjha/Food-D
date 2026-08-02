import React from 'react'
import './MyOrders.css'
import { useState } from 'react'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { useEffect } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'


const MyOrders = () => {
    const {url,token}=useContext(StoreContext)
    const [data,setData]=useState([]);
    const [removingId, setRemovingId] = useState(null);

    const fetchOrders=async()=>{
        const response=await axios.post(url+'/api/order/userorders',{},{headers:{token}})
        setData(response.data.data);
    }

    const removeOrder=async(orderId)=>{
        try {
            setRemovingId(orderId);
            setTimeout(async () => {
                const response=await axios.post(url+'/api/order/hide',{orderId},{headers:{token}})
                if (response.data.success) {
                    fetchOrders();
                } else {
                    alert(response.data.message);
                }
                setRemovingId(null);
            }, 500);
        } catch (error) {
            console.log(error);
            setRemovingId(null);
        }
    }

    useEffect(()=>{
        if (token) {
            fetchOrders();
        }
    },[token])


  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order,index)=>{
            return (
                <div key={index} className={`my-orders-order ${removingId === order._id ? 'removing' : ''}`}>
                    <img src={assets.parcel_icon} alt="" />
                    <p>{order.items.map((item,index)=>{
                        if(index===order.items.length-1){
                            return item.name+'x'+item.quantity
                        }else{
                            return item.name+'x'+item.quantity+', '
                        }
                    })}</p>
                    <p>₹{order.amount}.00</p>
                    <p>Items:{order.items.length}</p>
                    <p><span>&#x25cf;</span><b>{order.status}</b></p>
                    <div className="order-actions">
                        <button className="btn-track" onClick={()=>fetchOrders()}>Track Order</button>
                        {order.status === "Delivered" && (
                            <button className="btn-remove" onClick={()=>removeOrder(order._id)}>Remove</button>
                        )}
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  )
}

export default MyOrders
