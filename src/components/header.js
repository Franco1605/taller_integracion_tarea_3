import React from "react";
import { useState } from "react";
import { socket1 } from "../lib/socket";
import "antd/dist/antd.css";
import { Button, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import "../Header.css";

export const Header = () => {
  const [state, setState] = useState({
    texto: "Apagar Socket",
    estado: "Usted está Conectado",
  });
  const { Header } = Layout;
  const handleClick = () => {
    if (state.texto === "Apagar Socket") {
      setState({ estado: "Usted está Desconectado", texto: "Prender Socket" });
      socket1.disconnect();
    } else {
      setState({ estado: "Usted está Conectado", texto: "Apagar Socket" });
      socket1.connect();
    }
  };
  return (
    <div>
      <Layout>
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <Link to="/">Valor Acciones</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/mercado-valores">Mercado Valores</Link>
            </Menu.Item>
            <Menu.Item key="4" style={{ marginLeft: "250px" }}>
              {state.estado}
            </Menu.Item>
            <Button
              type="primary"
              onClick={handleClick}
              style={{ marginLeft: "500px" }}
              value={state.texto}
            >
              {state.texto}
            </Button>
          </Menu>
        </Header>
      </Layout>
    </div>
  );
};

export default Header;
