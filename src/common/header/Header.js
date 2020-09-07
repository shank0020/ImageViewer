import React, {Component} from 'react';
import './Header.css';

class Header extends Component{
  render(){
    const {classes,screen} = this.props;
    return (<div>
        <AppBar className={classes.appHeader}>
          <Toolbar>
            {(screen === "Login" || screen === "Home") && <span className="header-logo">Image Viewer</span>}
            {(screen === "Profile") && <Link style={{ textDecoration: 'none', color: 'white' }} to="/home"><span className="header-logo">Image Viewer</span></Link>}
            <div className={classes.grow}/>
            {(screen === "Home") &&
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase onChange={(e)=>{this.props.searchHandler(e.target.value)}} placeholder="Search…" classes={{
                    input: classes.inputInput
                  }}/>
              </div>
            }
            {(screen === "Home" || screen === "Profile")  &&
              <div>
                <IconButton onClick={this.handleClick}>
                  <Avatar alt="Profile Pic" src={this.props.userProfileUrl} className={classes.avatar} style={{border: "1px solid #fff"}}/>
                </IconButton>
                <Popover
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}>
                    <div style={{padding:'5px'}}>
                      { (screen === "Home") &&
                        <div>
                          <MenuItem onClick={this.handleAccount}>My Account</MenuItem>
                          <div className={classes.hr}/>
                        </div>
                      }
                      <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                    </div>
                </Popover>
              </div>
            }
          </Toolbar>
        </AppBar>
    </div>)
  }
}