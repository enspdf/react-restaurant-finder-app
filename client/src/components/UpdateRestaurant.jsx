import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import RestaurantFinder from "../apis/RestaurantFinder";

const UpdateRestaurant = () => {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { data },
        } = await RestaurantFinder.get(`/${id}`);

        setName(data?.restaurant?.name);
        setLocation(data?.restaurant?.location);
        setPriceRange(data?.restaurant?.price_range);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await RestaurantFinder.put(`/${id}`, {
        name,
        location,
        price_range: priceRange,
      });

      history.push("/");
    } catch (error) {}
  };

  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="name"
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            id="location"
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price_range">Price Range</label>
          <input
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            id="price_range"
            type="number"
            className="form-control"
          />
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateRestaurant;
