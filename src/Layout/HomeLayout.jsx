import style from "./layout.module.scss";
//
import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
// Image logo
import logo from "../Assets/Images/logo.png";
// React router
import { Link, Outlet } from "react-router-dom";
// Cookies
import { useCookies } from "react-cookie";
// API
import { useLogoutApi } from "../API/useLogoutApi";

const drawerWidth = 240;

const pages = [
  {
    id: 1,
    title: "المعرض",
    path: "/",
  },
  {
    id: 2,
    title: "الجداول",
    path: "tables",
  },
  // {
  //   id: 3,
  //   title: "About",
  //   path: "about",
  // },
];

function DrawerAppBar(props) {
  // Cookie
  const [cookies, setCookie] = useCookies(["token", "verified", "pinStatus"]);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { window } = props;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Toolbar
        style={{ justifyContent: "center" }}
        sx={{ marginLeft: { xs: "0px", sm: "24px" } }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar
              alt="Remy Sharp"
              src={logo}
              sx={{
                width: 50,
                height: 50,
                textAlign: "center",
                borderRadius: 0,
              }}
            />
          </Stack>
        </Link>
      </Toolbar>

      <Divider />
      <List>
        {pages.map(({ id, title, path }) => (
          <ListItem key={id} to={path} component={Link} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}

        {cookies.pinStatus === true && (
          <ListItem key="9999" to="dashboard" component={Link} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemText primary="لوحة التحكم" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  // Logout
  const { mutate, isPending } = useLogoutApi();
  const logout = () => {
    mutate();
  };

  return (
    <Box className={style.container} sx={{ display: "flex" }}>
      <AppBar component="nav" sx={{ direction: "ltr" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo in large screen */}
            <Toolbar
              sx={{ display: { xs: "none", md: "flex" } }}
              style={{
                justifyContent: "center",
                paddingLeft: 0,
                marginLeft: "24px",
              }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center" }}
                >
                  <Avatar
                    alt="Logo"
                    src={logo}
                    sx={{
                      width: 50,
                      height: 50,
                      textAlign: "center",
                      borderRadius: 0,
                    }}
                  />
                </Stack>
              </Link>
            </Toolbar>

            {/* Pages in small screen */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerToggle}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Logo in small screen */}
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <Toolbar style={{ justifyContent: "center" }}>
                <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center" }}
                  >
                    {/* <Avatar
                      alt="Remy Sharp"
                      src={logo}
                      sx={{
                        width: 50,
                        height: 50,
                        textAlign: "center",
                        borderRadius: 0,
                      }}
                    /> */}
                  </Stack>
                </Link>
              </Toolbar>
            </Box>

            {/* Pages in large screen */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <List sx={{ display: "flex" }}>
                {pages.map(({ id, title, path }) => (
                  <ListItem key={id} to={path} component={Link} disablePadding>
                    <ListItemButton
                      sx={{ textAlign: "center", color: "white" }}
                    >
                      <ListItemText primary={title} />
                    </ListItemButton>
                  </ListItem>
                ))}

                {cookies.pinStatus === true && (
                  <ListItem
                    key="9999"
                    to="dashboard"
                    component={Link}
                    disablePadding
                  >
                    <ListItemButton
                      sx={{
                        textAlign: "center",
                        color: "white",
                        textWrap: "nowrap",
                      }}
                    >
                      <ListItemText primary="لوحة التحكم" />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </Box>

            {/* Login button */}
            <Box
              sx={{
                flexGrow: 0,
                marginRight: { xs: "0px", sm: "24px" },
              }}
            >
              <div
                className="nav_link"
                style={{
                  marginLeft: "auto",
                }}
              >
                {!cookies.token ? (
                  <Button
                    component={Link}
                    to={cookies.token ? "dashboard" : "login"}
                    variant="contained"
                    sx={{
                      backgroundColor: "#fbfbfb",
                      color: "#7431fa",
                      border: "1px solid transparent",

                      "&:hover": {
                        backgroundColor: "#7431fa",
                        color: "#fbfbfb",
                        border: "1px solid #fbfbfb",
                      },
                    }}
                  >
                    دخول
                  </Button>
                ) : (
                  <LoadingButton
                    onClick={logout}
                    variant="contained"
                    disableRipple
                    loading={isPending}
                    loadingIndicator={
                      <CircularProgress sx={{ color: "#fbfbfb" }} size={24} />
                    } // Customize the loader color here
                    sx={{
                      backgroundColor: "#fbfbfb",
                      color: "#7431fa",
                      border: "1px solid #fbfbfb",
                      transition: "0.1s",
                      "&:hover": {
                        backgroundColor: "#7431fa",
                        color: "#fbfbfb",
                      },
                    }}
                  >
                    خروج
                  </LoadingButton>
                )}
              </div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Pages in small screen */}
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      {/* Outlet */}
      <Box
        dir="rtl"
        component="main"
        sx={{ p: 3, width: "100%", backgroundColor: "#fbfbfb" }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
