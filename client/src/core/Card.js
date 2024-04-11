import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import moment from "moment";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import CardM from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import DeleteIcon from "@material-ui/icons/Delete";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

import { addItem, updateItem, removeItem } from "./cartHelpers";

const palette = {
  primary: "#3f51b5", // Example primary color
  secondary: "#f50057", // Example secondary color
  textPrimary: "#333", // Dark grey for primary text
  textSecondary: "#777", // Light grey for secondary text
  stockIn: "#2e7d32", // Green for items in stock
  stockOut: "#d32f2f", // Red for items out of stock
  button: "#ffffff", // White for button text
  background: {
    default: "#f4f5fd", // Light grey for card background
    hover: "rgba(0,0,0,0.04)", // Slight dark on hover
  },
};

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: theme.shadows[4],
    },
  },
  cardMedia: {
    height: "200px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    paddingTop: "56.25%",
    "&:hover": {
      opacity: 0.9,
    },
  },

  cardContent: {
    flexGrow: 1,
    backgroundColor: "transparent",
    padding: theme.spacing(2),
    "& p": {
      backgroundColor: "transparent",
      margin: theme.spacing(1),
    },
  },
  button: {
    margin: theme.spacing(1),
    color: palette.button,
    "&:hover": {
      backgroundColor: palette.secondary,
      color: "#fff",
    },
  },
  stockIndicator: {
    display: "inline-block",
    color: (product) =>
      product.quantity > 0 ? palette.stockIn : palette.stockOut,
    fontWeight: "bold",
    margin: theme.spacing(1),
    padding: theme.spacing(0.5),
    backgroundColor: "transparent",
  },

  typography: {
    color: theme.palette.text.primary,
  },

  productDescription: {
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  productPrice: {
    color: palette.textPrimary,
    fontWeight: "bold",
  },

  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const Card = ({
  product,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = (f) => f, // default value of function
  run = undefined, // default value of undefined
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(product.count);

  const showViewButton = (showViewProductButton) => {
    return (
      showViewProductButton && (
        <Link href={`/product/${product._id}`} className="mr-2">
          <Button variant="contained" color="primary">
            View Product
          </Button>
        </Link>
      )
    );
  };

  const addToCart = () => {
    // console.log('added');
    addItem(product, setRedirect(true));
  };

  const shouldRedirect = (redirect) => {
    if (redirect) {
      return <Redirect to="/cart" />;
    }
  };

  const showAddToCartBtn = (showAddToCartButton) => {
    return (
      showAddToCartButton && (
        <Button onClick={addToCart} variant="outlined" color="secondary">
          Add to cart
        </Button>
      )
    );
  };

  const showStock = (quantity) => {
    return (
      <Typography component="span" className={classes.stockIndicator}>
        {quantity > 0 ? "In Stock" : "Out of Stock"}
      </Typography>
    );
  };

  const handleChange = (productId) => (event) => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      updateItem(productId, event.target.value);
    }
  };

  const showCartUpdateOptions = (cartUpdate) => {
    return (
      cartUpdate && (
        <div className="mt-2">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input
              type="number"
              className="form-control"
              value={count}
              onChange={handleChange(product._id)}
            />
          </div>
        </div>
      )
    );
  };

  const showRemoveButton = (showRemoveProductButton) => {
    return (
      showRemoveProductButton && (
        <Button
          onClick={() => {
            removeItem(product._id);
            setRun(!run); // run useEffect in parent Cart
          }}
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<DeleteIcon />}
        >
          Remove Product
        </Button>
      )
    );
  };

  const classes = useStyles();

  return (
    // <div className='card'>
    //   <div className='card-header name'>{product.name}</div>
    //   <div className='card-body'>
    //     {shouldRedirect(redirect)}
    //     <ShowImage item={product} url='product' />
    //     <p className='lead mt-2'>{product.description.substring(0, 100)}</p>
    //     <p className='black-10'>${product.price}</p>
    //     <p className='black-9'>
    //       Category: {product.category && product.category.name}
    //     </p>
    //     <p className='black-8'>
    //       Added on {moment(product.createdAt).fromNow()}
    //     </p>

    //     {showStock(product.quantity)}
    //     <br></br>

    //     {showViewButton(showViewProductButton)}

    //     {showAddToCartBtn(showAddToCartButton)}

    //     {showRemoveButton(showRemoveProductButton)}

    //     {showCartUpdateOptions(cartUpdate)}
    //   </div>
    // </div>

    <Container className={classes.cardGrid} maxWidth="md">
      <CssBaseline />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <CardM className={classes.card}>
            {shouldRedirect(redirect)}
            <ShowImage
              item={product}
              url="product"
              className={classes.cardMedia}
            />
            <CardContent className={classes.cardContent}>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                className={classes.typography}
              >
                {product.name}
              </Typography>
              <Typography className={classes.productDescription}>
                {product.description.substring(0, 100)}
              </Typography>
              <p className="black-10">
                <b>Price:</b> ${product.price}
              </p>
              <p className="black-9">
                <b>Category:</b> {product.category && product.category.name}
              </p>
              <p className="black-8">
                <b>Added on</b> {moment(product.createdAt).fromNow()}
              </p>
              {showStock(product.quantity)}
              <br></br>
              <span>
                {showViewButton(showViewProductButton)}
                {showAddToCartBtn(showAddToCartButton)}
                {showRemoveButton(showRemoveProductButton)}
              </span>
              {showCartUpdateOptions(cartUpdate)}
            </CardContent>
          </CardM>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Card;
