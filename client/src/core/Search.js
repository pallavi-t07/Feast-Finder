import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import { InputAdornment } from "@material-ui/core";

import { getCategories, list } from "./apiCore";
import Card from "./Card";

const useStyles = makeStyles((theme) => ({
  formControl: {
    borderRadius: theme.shape.borderRadius,
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
    marginRight: theme.spacing(2),
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minWidth: 200,
    padding: "0 10px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: theme.spacing(0),
      marginRight: 0,
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  tField: {
    width: 600,
  },
  searchButton: {
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  searchIcon: {
    marginRight: theme.spacing(1),
  },
  searchBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      justifyContent: "space-between",
    },
  },
  searchSection: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  searchInput: {
    flex: 4,
    marginRight: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginBottom: theme.spacing(1),
    },
  },
  inputLabel: {
    textAlign: "center",
    lineHeight: "1.4375em",
    paddingLeft: theme.spacing(1),
  },

  root: {
    "& > *": {
      margin: theme.spacing(2),
    },
  },
}));
const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: "",
    search: "",
    results: [],
    searched: false,
  });

  const { categories, category, search, results, searched } = data;

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setData({ ...data, categories: data });
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const searchData = () => {
    // console.log(search, category);
    if (search) {
      list({ search: search || undefined, category: category }).then(
        (response) => {
          if (response.error) {
            console.log(response.error);
          } else {
            setData({ ...data, results: response, searched: true });
          }
        }
      );
    }
  };

  const searchSubmit = (e) => {
    e.preventDefault();
    searchData();
  };

  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false });
  };

  const searchMessage = (searched, results) => {
    if (searched && results.length > 0) {
      return `Found ${results.length} products`;
    }
    if (searched && results.length < 1) {
      return `Search: No products found`;
    }
  };

  const searchedProducts = (results = []) => {
    return (
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          <h2 className="mt-4 mb-4 text-center">
            {searchMessage(searched, results)}
          </h2>
          <div className="row">
            {results.map((product, i) => (
              <div className="col-md-4 mb-3">
                <Card key={i} product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-1"></div>
      </div>
    );
  };

  const classes = useStyles();

  const searchForm = () => (
    <form onSubmit={searchSubmit} className={classes.searchBar}>
      <span className="input-group-text">
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <FormControl className={classes.formControl}>
              <InputLabel
                id="demo-simple-select-helper-label"
                className={classes.inputLabel}
              >
                Select
              </InputLabel>
              <Select
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={data.name}
                onChange={handleChange("category")}
                displayEmpty
                className={classes.selectEmpty}
              >
                <MenuItem value="All">
                  <em>All</em>
                </MenuItem>
                {categories.map((c, i) => (
                  <MenuItem key={i} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <TextField
            id="outlined-search"
            variant="outlined"
            placeholder="Search by name"
            type="search"
            className={classes.tField}
            onChange={handleChange("search")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <div className="ml-3 mt-2" style={{ border: "none" }}>
            <Button
              ml={2}
              variant="contained"
              color="primary"
              type="submit"
              className={classes.searchButton}
            >
              <SearchIcon className={classes.searchIcon} />
              Search
            </Button>
          </div>
        </div>
      </span>
    </form>
  );

  return (
    <div className="row">
      <div className="container mb-3">{searchForm()}</div>
      <div className="container-fluid mb-3">{searchedProducts(results)}</div>
    </div>
  );
};

export default Search;
