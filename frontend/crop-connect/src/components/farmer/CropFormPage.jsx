import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useFormValues } from '../../hooks/useFormValues';

const CropFormPage = () => {
  const { formValues, setFormValues } = useFormValues();
  const [categories, setCategories] = useState([]);
  const [quantityError, setQuantityError] = useState('');
  const [costError, setCostError] = useState('');
  const formRef = useRef(null);

  const resultJSON = localStorage.getItem("user");  
  const user = JSON.parse(resultJSON);
  const userId = user.id;

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const response = await axios.get(`/api/farmers/user/${userId}`);
        const farmerData = response.data;
        const farmerId = farmerData.id;
        setFormValues({ ...formValues, farmerId: farmerId });
      } catch (error) {
        alert("Error fetching farmer by user id", error);
      }
    };

    fetchFarmer();

    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);

      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [userId, setFormValues]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'quantity') {
      if (value === '') {
        setQuantityError(''); 
      } else if (value < 1) {
        setQuantityError("Quantity can't be less than 1");
        
      }else if (isNaN(value)) {
        setCostError("Enter a valid cost");
      } 
      else {
        setQuantityError('');
      }
    }

    if (name === 'price') {
      if (value === '') {
        setCostError(''); // Clear the error if input is empty
      } else if (value < 10) {
        setCostError("Cost can't be less than 10");
      } else if (isNaN(value)) {
        setCostError("Enter a valid cost");
      } else {
        setCostError('');
      }
    }

    setFormValues({ ...formValues, [name]: value });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.cropName || !formValues.price || !formValues.quantity || !formValues.categoryId || quantityError || costError) {
      return;
    }
    try {
      const payload = {
        ...formValues,
        imageUrl: formValues.imageUrl || null,
      };
      if (formValues.id === null) {
        await axios.post('/api/crops', payload);
      } else {
        await axios.put(`/api/crops/${formValues.id}`, payload);
      }
      resetForm();
      window.alert("Crop added successfully!");

    } catch (error) {
      console.error('Error saving crop:', error);
    }
  };

  const resetForm = () => {
    setFormValues({
      id: null,
      cropName: '',
      price: '',
      imageUrl: '',
      quantity: '',
      categoryId: '',
      farmerId: formValues.farmerId,  
    });
  };

  return (
    <div className="card">
      <div className="card-header"></div>
      <div className="card-body" ref={formRef}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="cropName" className="form-label">Crop Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="form-control"
              id="cropName"
              name="cropName"
              value={formValues.cropName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="form-control"
              id="price"
              name="price"
              value={formValues.price}
              onChange={handleInputChange}
              required
            />
            {costError && <div className="text-danger">{costError}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="imageUrl" className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              id="imageUrl"
              name="imageUrl"
              value={formValues.imageUrl}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity <span className="text-red-500">*</span></label>
            <input
              type="number"
              className="form-control"
              id="quantity"
              name="quantity"
              value={formValues.quantity}
              onChange={handleInputChange}
              required
            />
            {quantityError && <div className="text-danger">{quantityError}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="categoryId" className="form-label">Category <span className="text-red-500">*</span></label>
            <select
              className="form-control"
              id="categoryId"
              name="categoryId"
              value={formValues.categoryId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary" disabled={quantityError || costError}>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CropFormPage;
