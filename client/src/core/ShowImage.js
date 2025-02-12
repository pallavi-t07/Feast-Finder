import React from "react";
import { API } from "../config";

const ShowImage = ({ item, url }) => (
  <div
    className="product-img"
    style={{
      height: "250px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name}
      className="mb-3"
      style={{
        maxHeight: "250px",
        width: "auto",
        maxWidth: "100%",
        objectFit: "contain",
        objectPosition: "center",
      }}
    />
  </div>
);

export default ShowImage;
