import React from "react";
import { socket1 } from "../../lib/socket";
import { useEffect, useState } from "react";
import { Layout } from "antd";

const { Content } = Layout;

function Mercado_Valores() {
  const [data, setData] = useState([]);
  useEffect(() => {
    socket1.emit("EXCHANGES");
    socket1.on("EXCHANGES", (res) => {
      setData(res);
    });
  }, []);
  console.log("GGGGGGGGGG");
  console.log(data);
  console.log("GGGGGGGGGG");
  return (
    <div>
      <Layout>
        <Content>
          <h1>Aquí estará la información del mercado de valores</h1>
        </Content>
      </Layout>
    </div>
  );
}

export default Mercado_Valores;
