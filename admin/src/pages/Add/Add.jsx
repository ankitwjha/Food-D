import React, { useEffect, useState } from 'react'
import "./Add.css"
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({url}) => {
    
    const [image,setImage]=useState(false);
    const [data,setData]=useState({
        name:"",
        description:"",
        category:"Salad",
        price:""
    })

    const onChangeHandler=(event)=>{
        const name=event.target.name;
        const value=event.target.value;
        setData(data=>({...data,[name]:value}))
    }

    const onSubmitHAndler=async(event)=>{
        event.preventDefault();
        const formData=new FormData();
        formData.append("name",data.name);
        formData.append("description",data.description);
        formData.append("category",data.category);
        formData.append("price",Number(data.price));
        formData.append("image",image);
        formData.append("owner",localStorage.getItem("adminUsername") || "abir123@12.com");
        formData.append("restaurantName",localStorage.getItem("restaurantName") || "Food-D Express");
        const response=await axios.post(`${url}/api/food/add`,formData)
        if (response.data.success) {
            setData({
                name:"",
                description:"",
                category:"Salad",
                price:""
            })
            setImage(false);
            toast.success(response.data.message)
        }else{
            toast.error(response.data.message)
        }
    }

  return (
    <div className='add'>
        <form className='flex-col' onSubmit={onSubmitHAndler}>
            <div className="add-img-upload flex-col">
                <p>Upload Image</p>
                <label htmlFor="image" className={`upload-dropzone ${image ? 'has-preview' : ''}`}>
                    {image ? (
                        <img src={URL.createObjectURL(image)} alt="Preview" className="upload-preview-img" />
                    ) : (
                        <div className="upload-placeholder-content">
                            <svg className="upload-cloud-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="upload-title">Choose image file</span>
                            <span className="upload-subtitle">PNG, JPG, or WEBP</span>
                        </div>
                    )}
                </label>
                <input onChange={(e)=>setImage(e.target.files[0])}  type="file" id="image" hidden required/>
            </div>
            <div className="add-product-name flex-col">
                <p>Product Name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here' />
            </div>
            <div className="add-product-description flex-col"> <p>Product Description</p>
                <textarea onChange={onChangeHandler} value={data.description} name="description" rows='6' placeholder='Write Content Here'required></textarea>
                </div>
               <div className="add-category-price ">
                <div className="add-category flex-col">
                    <p>Product Category</p>
                    <select onChange={onChangeHandler} name="category" >
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Pure Veg">Pure Veg</option>
                        <option value="Pasta">Pasta</option>
                        <option value="Noodles">Noodles</option>
                    </select>
                </div>
                <div className="add-price flex-col">
                    <p>Product Price</p>
                    <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='Rs.120' />
                </div>
               </div>
               <button type="submit" className='add-btn'>ADD</button>
        </form>
      
    </div>
  )
}

export default Add
