import React, { useEffect, useContext } from "react";
import RestaurantFinder from "../apis/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import StarRating from "./StarRating";

const RestaurantList = (props) => {
  const { restaurants, setRestaurants, deleteRestaurant } = useContext(
    RestaurantsContext
  );

  const history = useHistory();

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const { data } = await RestaurantFinder.get("/");
        setRestaurants(data?.data?.restaurants);
      } catch (err) {}
    };

    getRestaurants();
  }, []);

  const handleDeleteRestaurant = (e, { name, id, location }) => {
    e.stopPropagation();
    try {
      Swal.fire({
        title: `Are you sure that you want to delete ${name} in ${location}`,
        text: "You won't be able to revert this action",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
      }).then(async ({ isConfirmed }) => {
        if (isConfirmed) {
          await RestaurantFinder.delete(`/${id}`);
          Swal.fire(
            "Deleted",
            `${name} in ${location} was deleted successfully`,
            "success"
          );
          deleteRestaurant(id);
        }
      });
    } catch (error) {}
  };

  const handleUpdateRestaurant = (e, id) => {
    e.stopPropagation();
    history.push(`/restaurants/${id}/update`);
  };

  const handleRestaurantSelect = (id) => {
    history.push(`/restaurants/${id}`);
  };

  const renderRating = (restaurant) => {
    if (!restaurant.count) {
      return <span className="text-warning">0 reviews</span>;
    }

    return (
      <>
        <StarRating rating={restaurant.id} />
        <span className="text-warning ml-1">({restaurant.count})</span>
      </>
    );
  };

  return (
    <div className="list-group">
      <table className="table table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Restaurants</th>
            <th scope="col">Location</th>
            <th scope="col">Price Range</th>
            <th scope="col">Ratings</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {restaurants &&
            restaurants.map((restaurant) => (
              <tr
                onClick={() => handleRestaurantSelect(restaurant.id)}
                key={restaurant.id}
              >
                <td>{restaurant.name}</td>
                <td>{restaurant.location}</td>
                <td>{"$".repeat(restaurant.price_range)}</td>
                <td>{renderRating(restaurant)}</td>
                <td>
                  <button
                    onClick={(e) => handleUpdateRestaurant(e, restaurant.id)}
                    className="btn btn-warning"
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    onClick={(e) => handleDeleteRestaurant(e, restaurant)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantList;
