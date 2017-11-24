import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import {NavLink} from 'react-router-dom'
import Divider from 'material-ui/Divider';

class RoutesList extends Component {
  render() {
    // Parent list style
    const style = {
      padding: '16px 16px 16px 55px',
      fontSize: '14px',
    }
    // childern dropdown innerdiv styler
    const styleChild = {
      padding: '12px 13px 12px 40px',
      fontSize: '14px'
    }
    return (
      <List className="nav-menu">
        <ListItem
          primaryText="Dashboard"
          innerDivStyle={style}
          leftIcon={<i className="material-icons">dashboard</i>}
          containerElement={<NavLink to="/" exact />}
        />
        <ListItem
          primaryText="E-commerce"
          initiallyOpen={false}
          innerDivStyle={style}
          className="childmenu"
          primaryTogglesNestedList={true}
          leftIcon={<i className="material-icons">shopping_cart</i>}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="Dashboard"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ecommerce/dashboard" exact />}
            />,
            <ListItem
              key={2}
              primaryText="Products"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ecommerce/products" exact />}
            />,
            <ListItem
              key={3}
              primaryText="Order reviews"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ecommerce/order-review" exact />}
            />,
          ]}
        />
        <div className="menudivider">
          <Divider />
        </div>
        <ListItem
          primaryText="Ui Kit"
          initiallyOpen={false}
          innerDivStyle={style}
          className="childmenu"
          primaryTogglesNestedList={true}
          leftIcon={<i className="material-icons">folder</i>}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="Buttons"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/buttons" exact />}
            />,
            <ListItem
              key={2}
              primaryText="App bar"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/appbars" exact />}
            />,
            <ListItem
              key={3}
              primaryText="Ui Components"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/ui-components" exact />}
            />,
            <ListItem
              key={4}
              primaryText="Cards"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/cards" exact />}
            />,
            <ListItem
              key={5}
              primaryText="Slider"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/sliders" exact />}
            />,
            <ListItem
              key={6}
              primaryText="Date pickers"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/datepickers" exact />}
            />,
            <ListItem
              key={7}
              primaryText="Time pickers"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/timepickers" exact />}
            />,
            <ListItem
              key={8}
              primaryText="Dialogs"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/dialogs" exact />}
            />,
            <ListItem
              key={9}
              primaryText="Tabs"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/tabs" exact />}
            />,
            <ListItem
              key={10}
              primaryText="Progress"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/progress" exact />}
            />,
            <ListItem
              key={11}
              primaryText="Popovers"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/popovers" exact />}
            />,
            <ListItem
              key={12}
              primaryText="Lists"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/lists" exact />}
            />,
            <ListItem
              key={13}
              primaryText="Menus"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/menus" exact />}
            />,
            <ListItem
              key={14}
              primaryText="Icons + Snackbar"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/icons" exact />}
            />,
            <ListItem
              key={15}
              primaryText="Grid lists"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/gridlists" exact />}
            />,
            <ListItem
              key={16}
              primaryText="Grids"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/ui-kit/grids" exact />}
            />,
          ]}
        />
        <ListItem
          primaryText="Forms"
          initiallyOpen={false}
          innerDivStyle={style}
          className="childmenu"
          primaryTogglesNestedList={true}
          leftIcon={<i className="material-icons">border_color</i>}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="Basic Forms"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/forms/basic-forms" exact />}
            />,
            <ListItem
              key={2}
              primaryText="Switches"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/forms/switches" exact />}
            />,
            <ListItem
              key={3}
              primaryText="Form layouts"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/forms/form-layouts" exact />}
            />,
          ]}
        />
        <ListItem
          primaryText="Charts"
          initiallyOpen={false}
          innerDivStyle={style}
          className="childmenu"
          primaryTogglesNestedList={true}
          leftIcon={<i className="material-icons">equalizer</i>}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="Line charts"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/charts/line-charts" exact />}
            />,
            <ListItem
              key={2}
              primaryText="Bar charts"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/charts/bar-charts" exact />}
            />,
            <ListItem
              key={3}
              primaryText="Area charts"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/charts/area-charts" exact />}
            />,
            <ListItem
              key={4}
              primaryText="Pie charts"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/charts/pie-charts" exact />}
            />,
            <ListItem
              key={5}
              primaryText="Other charts"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/charts/other-charts" exact />}
            />,
          ]}
        />
        <ListItem
          primaryText="Tables"
          initiallyOpen={false}
          innerDivStyle={style}
          className="childmenu"
          primaryTogglesNestedList={true}
          leftIcon={<i className="material-icons">list</i>}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="Bootstrap table"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/table/bootstrap-tables" exact />}
            />,
            <ListItem
              key={2}
              primaryText="User table"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/table/user-tables" exact />}
            />,
          ]}
        />
        <ListItem
          primaryText="Pages"
          initiallyOpen={false}
          innerDivStyle={style}
          className="childmenu"
          primaryTogglesNestedList={true}
          leftIcon={<i className="material-icons">content_copy</i>}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="About"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/pages/about" exact />}
            />,
            <ListItem
              key={2}
              primaryText="Services"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/pages/services" exact />}
            />,
            <ListItem
              key={3}
              primaryText="Contact"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/pages/contact" exact />}
            />,
            <ListItem
              key={4}
              primaryText="Blog"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/pages/blog" exact />}
            />,
            <ListItem
              key={5}
              primaryText="Pricing table"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/pages/pricing-table" exact />}
            />,
            <ListItem
              key={6}
              primaryText="FAQ"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/pages/faq" exact />}
            />,
          ]}
        />
        <div className="menudivider">
          <Divider />
        </div>
        <ListItem
          primaryText="Other pages"
          initiallyOpen={false}
          innerDivStyle={style}
          className="childmenu"
          primaryTogglesNestedList={true}
          leftIcon={<i className="material-icons">widgets</i>}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="Login"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/other-pages/login" exact />}
            />,
            <ListItem
              key={2}
              primaryText="Register"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/other-pages/register" exact />}
            />,
            <ListItem
              key={3}
              primaryText="Forgot password"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/other-pages/forgot-password" exact />}
            />,
            <ListItem
              key={4}
              primaryText="Confirm mail"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/other-pages/mail-confirmation" exact />}
            />,
            <ListItem
              key={5}
              primaryText="Page 404"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/other-pages/404" exact />}
            />,
          ]}
        />
        <ListItem
          primaryText="Page layout"
          initiallyOpen={false}
          innerDivStyle={style}
          className="childmenu"
          primaryTogglesNestedList={true}
          leftIcon={<i className="material-icons">extension</i>}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="Layout default"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/page-layout/default" exact />}
            />,
            <ListItem
              key={2}
              primaryText="Layout with banner"
              innerDivStyle={styleChild}
              containerElement={<NavLink to="/page-layout/banner" exact />}
            />,
          ]}
        />
        <ListItem
          primaryText="Menu Level"
          initiallyOpen={false}
          innerDivStyle={style}
          className="childmenu"
          primaryTogglesNestedList={true}
          leftIcon={<i className="material-icons">more_vert</i>}
          nestedItems={[
            <ListItem
              key={1}
              primaryText="Level 1"
              initiallyOpen={false}
              innerDivStyle={styleChild}
              primaryTogglesNestedList={true}
            />,
            <ListItem
              key={2}
              primaryText="Level 2"
              initiallyOpen={false}
              innerDivStyle={styleChild}
              primaryTogglesNestedList={true}
              nestedItems={[
              <ListItem
                key={1}
                primaryText="Level 2"
                initiallyOpen={false}
                innerDivStyle={styleChild}
                primaryTogglesNestedList={true}
              />,
              <ListItem
                key={2}
                primaryText="Level 3"
                initiallyOpen={false}
                innerDivStyle={styleChild}
                primaryTogglesNestedList={true}
                nestedItems={[
                <ListItem
                  key={1}
                  primaryText="Level 3"
                  initiallyOpen={false}
                  innerDivStyle={styleChild}
                  primaryTogglesNestedList={true}
                />,
                <ListItem
                  key={2}
                  primaryText="Level 3"
                  initiallyOpen={false}
                  innerDivStyle={styleChild}
                  primaryTogglesNestedList={true}
                />,

              ]}
              />,
            ]}
            />,
          ]}

        />
        <div className="menudivider"></div>
        <div className="menudivider"></div>
      </List>
    );
  }
}

export default RoutesList;
