import React, { Component } from "react";
import "./Profile.css";
import profilePic from "../../assets/profilepic.JPG";
import { constants } from "../../common/utils";
import Header from "../../common/header/Header";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardMedia from "@material-ui/core/CardMedia";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIconBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIconFill from "@material-ui/icons/Favorite";

const styles = {
  paper: {
    position: "relative",
    width: "180px",
    backgroundColor: "#fff",
    top: "30%",
    margin: "0 auto",
    boxShadow: "2px 2px #888888",
    padding: "20px",
  },
  media: {
    height: "200px",
    paddingTop: "56.25%", // 16:9
  },
  imageModal: {
    backgroundColor: "#fff",
    margin: "0 auto",
    boxShadow: "2px 2px #888888",
    padding: "10px",
  },
};

class Profile extends Component {
  constructor(props) {
    super(props);
    if (sessionStorage.getItem("access-token") == null) {
      props.history.replace("/");
    }
    this.state = {
      profile_picture: profilePic,
      username: null,
      full_name: "Shashank Saxena",
      posts: null,
      editOpen: false,
      fullNameRequired: "dispNone",
      newFullName: "",
      mediaData: null,
      imageModalOpen: false,
      currentItem: null,
      comments: {},
      numberoflikes: 0,
      isLiked: false,
    };
  }

/* Callling Methods for getting user data */
  componentDidMount() {
    this.getUserInfo();
    this.getMediaData();
  }

  /* Method for getting user data */
  getUserInfo = () => {
    let that = this;
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
        that.setState({
          profile_picture: jsonResponse.data.media_url,
          username: jsonResponse.data[0].username,
          posts: jsonResponse.data.length,
        });
      })
      .catch((error) => {
        console.log("error user data", error);
      });
  };

  /* Method for getting Media data */
  getMediaData = () => {
    let that = this;
    let url = `${constants.userMediaUrl}&access_token=${sessionStorage.getItem(
      "access-token"
    )}`;
    return fetch(url, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        that.setState({
          mediaData: jsonResponse.data,
        });
      })
      .catch((error) => {
        console.log("error media data", error);
      });
  };

  /* Method for opening edit popup */
  handleOpenEditModal = () => {
    this.setState({ editOpen: true });
  };

  /* Method for closing edit popup */
  handleCloseEditModal = () => {
    this.setState({ editOpen: false });
  };

  /* Method for opening image popup */
  handleOpenImageModal = (event) => {
    var result = this.state.mediaData.find((item) => {
      return item.id === event.target.id;
    });
    this.setState({
      imageModalOpen: true,
      currentItem: result,
      numberoflikes: Math.floor(Math.random() * 100),
      isLiked: Math.round(Math.random()) ? true : false,
    });
  };

  /* Method for closing image popup */
  handleCloseImageModal = () => {
    this.setState({ imageModalOpen: false });
  };

  /* Method for editing full name */
  inputFullNameChangeHandler = (e) => {
    this.setState({
      newFullName: e.target.value,
    });
  };

  /* Method for updating full name */
  updateClickHandler = () => {
    if (this.state.newFullName === "") {
      this.setState({ fullNameRequired: "dispBlock" });
    } else {
      this.setState({ fullNameRequired: "dispNone" });
    }

    if (this.state.newFullName === "") {
      return;
    }

    this.setState({
      full_name: this.state.newFullName,
    });

    this.handleCloseEditModal();
  };

  /* Method for handling like button click */
  likeClickHandler = (id) => {
    if (this.state.isLiked === true) {
      this.setState({ isLiked: false });
      this.setState({ numberoflikes: this.state.numberoflikes - 1 });
    } else {
      this.setState({ isLiked: true });
      this.setState({ numberoflikes: this.state.numberoflikes + 1 });
    }
  };

  /* Method for adding comment */
  onAddCommentClicked = (id) => {
    console.log("id", id);
    if (
      this.state.currentComment === "" ||
      typeof this.state.currentComment === undefined
    ) {
      return;
    }

    /* maintaining list of comments */
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

  /* Updating current comment on adding a new comment */
  commentChangeHandler = (e) => {
    this.setState({
      currentComment: e.target.value,
    });
  };

  /* Clearing sessions on Logout click */
  logout = () => {
    sessionStorage.clear();
    this.props.history.replace("/");
  };

  render() {
    let hashTags = [];
    if (this.state.currentItem !== null) {
      hashTags = this.state.currentItem.caption.match(/#[a-z]+/gi);
      console.log("state", this.state);
    }
    var regexp = new RegExp("#([^\\s]*)", "g");
    return (
      <div>
        {/* Header*/}
        <Header
          screen={"Profile"}
          userProfileUrl={profilePic}
          handleLogout={this.logout}
        />
        <div className="information-section">
          <Avatar
            alt="User Image"
            src={profilePic}
            style={{ width: "100px", height: "100px" }}
          />
          <span style={{ marginLeft: "20px" }}>
            <div style={{ width: "600px", fontSize: "big" }}>
              {" "}
              {this.state.username} <br />
              <div style={{ float: "left", width: "200px", fontSize: "small" }}>
                {" "}
                Posts: {this.state.posts}{" "}
              </div>
              <div style={{ float: "left", width: "200px", fontSize: "small" }}>
                {" "}
                Follows: {100}{" "}
              </div>
              <div style={{ float: "left", width: "200px", fontSize: "small" }}>
                {" "}
                Followed By: {10000}
              </div>{" "}
              <br />
            </div>
            <div style={{ fontSize: "large" }}>
              {this.state.full_name}
              <Button
                mini
                variant="fab"
                color="secondary"
                aria-label="Edit"
                style={{ marginLeft: "20px" }}
                onClick={this.handleOpenEditModal}
              >
                <Icon>edit_icon</Icon>
              </Button>
            </div>
            {/* Modal Popup for editing Name */}
            <Modal
              aria-labelledby="edit-modal"
              aria-describedby="modal to edit user full name"
              open={this.state.editOpen}
              onClose={this.handleCloseEditModal}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <div style={styles.paper}>
                <Typography variant="h5" id="modal-title">
                  Edit
                </Typography>
                <br />
                <FormControl required>
                  <InputLabel htmlFor="fullname">Full Name</InputLabel>
                  <Input
                    id="fullname"
                    onChange={this.inputFullNameChangeHandler}
                  />
                  <FormHelperText className={this.state.fullNameRequired}>
                    <span className="red">required</span>
                  </FormHelperText>
                </FormControl>
                <br />
                <br />
                <br />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.updateClickHandler}
                >
                  UPDATE
                </Button>
              </div>
            </Modal>
          </span>
        </div>
        {/* List of photos */}
        {this.state.mediaData != null && (
          <GridList cellHeight={"auto"} cols={3} style={{ padding: "40px" }}>
            {this.state.mediaData.map((item) => (
              <GridListTile key={item.id}>
                <CardMedia
                  id={item.id}
                  style={styles.media}
                  image={item.media_url}
                  title={item.caption}
                  onClick={this.handleOpenImageModal}
                />
              </GridListTile>
            ))}
          </GridList>
        )}
        {/* Media details modal */}
        {this.state.currentItem != null && (
          <Modal
            aria-labelledby="image-modal"
            aria-describedby="modal to show image details"
            open={this.state.imageModalOpen}
            onClose={this.handleCloseImageModal}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "#fff",
                width: "70%",
                height: "70%",
              }}
            >
              <div style={{ width: "50%", padding: 10 }}>
                <img
                  style={{ height: "100%", width: "100%" }}
                  src={this.state.currentItem.media_url}
                  alt={this.state.currentItem.caption}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "50%",
                  padding: 10,
                }}
              >
                <div
                  style={{
                    borderBottom: "2px solid #f2f2f2",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    alt="User Image"
                    src={profilePic}
                    style={{ width: "50px", height: "50px", margin: "10px" }}
                  />
                  <Typography component="p">{this.state.username}</Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Typography component="p">
                      {this.state.currentItem.caption.replace(regexp, "")}
                    </Typography>
                    <Typography style={{ color: "#4dabf5" }} component="p">
                      {hashTags.join(" ")}
                    </Typography>
                    {this.state.comments.hasOwnProperty(
                      this.state.currentItem.id
                    ) &&
                      this.state.comments[this.state.currentItem.id].map(
                        (comment, index) => {
                          return (
                            <div key={index} className="row">
                              <Typography
                                component="p"
                                style={{ fontWeight: "bold" }}
                              >
                                {sessionStorage.getItem("username")}:
                              </Typography>
                              <Typography component="p">{comment}</Typography>
                            </div>
                          );
                        }
                      )}
                  </div>
                  <div>
                    <div className="row">
                      <IconButton
                        aria-label="Add to favorites"
                        onClick={this.likeClickHandler.bind(
                          this,
                          this.state.currentItem.id
                        )}
                      >
                        {this.state.isLiked === true && (
                          <FavoriteIconFill style={{ color: "#F44336" }} />
                        )}
                        {this.state.isLiked === false && <FavoriteIconBorder />}
                      </IconButton>
                      <Typography component="p">
                        {this.state.numberoflikes} Likes
                      </Typography>
                    </div>
                    <div className="row">
                      <FormControl style={{ flexGrow: 1 }}>
                        <InputLabel htmlFor="comment">Add Comment</InputLabel>
                        <Input
                          id="comment"
                          value={this.state.currentComment}
                          onChange={this.commentChangeHandler}
                        />
                      </FormControl>
                      <FormControl>
                        <Button
                          onClick={this.onAddCommentClicked.bind(
                            this,
                            this.state.currentItem.id
                          )}
                          variant="contained"
                          color="primary"
                        >
                          ADD
                        </Button>
                      </FormControl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

export default Profile;