import React, { Component } from "react";
import "./Home.css";
import profilePic from "../../assets/profilepic.JPG";
import Header from "../../common/header/Header";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import FavoriteIconBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIconFill from "@material-ui/icons/Favorite";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { constants } from "../../common/utils";

const styles = (theme) => ({
  card: {
    maxWidth: 1100,
  },
  avatar: {
    margin: 10,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  formControl: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  comment: {
    display: "flex",
    alignItems: "center",
  },
  hr: {
    marginTop: "10px",
    borderTop: "2px solid #f2f2f2",
  },
  gridList: {
    width: 1100,
    height: "auto",
    overflowY: "auto",
  },
  grid: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 90,
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    if (sessionStorage.getItem("access-token") == null) {
      props.history.replace("/");
    }
    this.state = {
      comments: {},
      currrentComment: "",
    };
  }

   /* Calling getuserinfo and initialising search to blank */
  componentDidMount() {
    this.getUserInfo().then(() => {
      this.onSearchEntered("");
    });
  }

  render() {
    const { classes } = this.props;
    let torender;
    if (this.state.userData && this.state.filteredData) {
      torender = (
        <GridList className={classes.gridList} cellHeight={"auto"}>
          {this.state.filteredData.map((item) => (
            <GridListTile key={item.id}>
              <HomeItem
                classes={classes}
                item={item}
                onAddCommentClicked={this.addCommentClickHandler}
                commentChangeHandler={this.commentChangeHandler}
                comments={this.state.comments}
              />
            </GridListTile>
          ))}
        </GridList>
      );
    }
    return (
      <div>
        <Header
          screen={"Home"}
          searchHandler={this.onSearchEntered}
          handleLogout={this.logout}
          handleAccount={this.navigateToAccount}
        />
        <div className={classes.grid}>{torender}</div>
      </div>
    );
  }

   /* On click of enter for searching */
  onSearchEntered = (value) => {
    console.log(this.state);
    let filteredData = this.state.userData;
    filteredData = filteredData.filter((data) => {
      let string = data.caption.toLowerCase();
      let subString = value.toLowerCase();
      console.log(string.includes(subString));
      return string.includes(subString);
    });
    this.setState({
      filteredData,
    });
    //console.log(this.state)
  };

   /* Handler for comment */
  addCommentClickHandler = (id) => {
    if (
      this.state.currentComment === "" ||
      typeof this.state.currentComment === undefined
    ) {
      return;
    }

    let commentList = this.state.comments.hasOwnProperty(id)
      ? this.state.comments[id].concat(this.state.currentComment)
      : [].concat(this.state.currentComment);

    this.setState({
      comments: {
        ...this.state.comments,
        [id]: commentList,
      },
      currentComment: "",
    });
  };

   /* Method to set new comment */
  commentChangeHandler = (e) => {
    this.setState({
      currentComment: e.target.value,
    });
  };

   /* Method to get user information using API call */
  getUserInfo = () => {
    let url = `${constants.userInfoUrl}&access_token=${sessionStorage.getItem(
      "access-token"
    )}`;
    return fetch(url, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        this.setState({
          userData: jsonResponse.data,
        });
      })
      .catch((error) => {
        console.log("error user data", error);
      });
  };

   /* Method to handle logout click */
  logout = () => {
    sessionStorage.clear();
    this.props.history.replace("/");
  };

   /* Handler to navigate to profile page */
  navigateToAccount = () => {
    this.props.history.push("/profile");
  };
}

class HomeItem extends Component {
  constructor() {
    super();
    this.state = {
      isLiked: Math.round(Math.random()) ? true : false,
      numberoflikes: Math.floor(Math.random() * 100),
      comment: "",
    };
  }

   /* Method for handling like click */
  likeClickHandler = () => {
    if (this.state.isLiked === true) {
      this.setState({ isLiked: false });
      this.setState({ numberoflikes: this.state.numberoflikes - 1 });
    } else {
      this.setState({ isLiked: true });
      this.setState({ numberoflikes: this.state.numberoflikes + 1 });
    }
  };

  render() {
    const { classes, item, comments } = this.props;
    let createdTime = new Date(item.timestamp);
    let yyyy = createdTime.getFullYear();
    let mm = createdTime.getMonth() + 1;
    let dd = createdTime.getDate();

    let HH = createdTime.getHours();
    let MM = createdTime.getMinutes();
    let ss = createdTime.getSeconds();

    let time = dd + "/" + mm + "/" + yyyy + " " + HH + ":" + MM + ":" + ss;
    let tags = item.caption.match(/#[a-z]+/gi);

     /* Regex for hashtags */
    var regexp = new RegExp("#([^\\s]*)", "g");
    let captiontxt = item.caption.replace(regexp, "");

    return (
      <div className="home-item-main-container"> 
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar
                alt="User Profile Pic"
                src={profilePic}
                className={classes.avatar}
              />
            }
            title={item.username}
            subheader={time}
          />
          <CardContent>
            <CardMedia
              className={classes.media}
              image={item.media_url}
              title={item.caption}
            />
            <div className={classes.hr}>
              <Typography component="p">{captiontxt}</Typography>
              <Typography style={{ color: "#4dabf5" }} component="p">
                {tags.map((x) => x + " ")}
              </Typography>
            </div>
          </CardContent>

          <CardActions>
            <IconButton
              aria-label="Add to favorites"
              onClick={this.likeClickHandler}
            >
              {this.state.isLiked ? (
                <FavoriteIconFill style={{ color: "#F44336" }} />
              ) : (
                <FavoriteIconBorder />
              )}
            </IconButton>
            <Typography component="p">
              {this.state.numberoflikes} Likes
            </Typography>
          </CardActions>

          <CardContent>
            {comments.hasOwnProperty(item.id) &&
              comments[item.id].map((comment, index) => {
                return (
                  <div key={index} className="row">
                    <Typography component="p" style={{ fontWeight: "bold" }}>
                      {sessionStorage.getItem("username")}:
                    </Typography>
                    <Typography component="p">{comment}</Typography>
                  </div>
                );
              })}
            <div className={classes.formControl}>
              <FormControl style={{ flexGrow: 1 }}>
                <InputLabel htmlFor="comment">Add Comment</InputLabel>
                <Input
                  value={this.state.comment}
                  onChange={this.commentChangeHandler}
                />
              </FormControl>
              <FormControl>
                <Button
                  onClick={this.onAddCommentClicked.bind(this, item.id)}
                  style={{ marginLeft: "10px" }}
                  variant="contained"
                  color="primary"
                >
                  ADD
                </Button>
              </FormControl>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

   /* Method for triggering hanleAccount method and handleClose method */
  commentChangeHandler = (e) => {
    this.setState({
      comment: e.target.value,
    });
    this.props.commentChangeHandler(e);
  };

   /* Method for adding new comment */
  onAddCommentClicked = (id) => {
    if (this.state.comment === "" || typeof this.state.comment === undefined) {
      return;
    }
    this.setState({
      comment: "",
    });
    this.props.onAddCommentClicked(id);
  };
}

export default withStyles(styles)(Home);