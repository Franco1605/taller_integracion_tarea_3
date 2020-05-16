import React from "react";
import { socket2 } from "../../lib/socket";
import { useEffect, useState } from "react";
import { Layout } from "antd";

const { Content } = Layout;

function Mercado_Valores() {
  const [data, setData] = useState();
  useEffect(() => {
    socket2.emit("EXCHANGES");
    socket2.on("EXCHANGES", (res) => {
      setData(res);
    });
  }, []);

  var info_exchanges = [];
  if (data !== undefined) {
    for (var i in data) {
      let exchange = [
        data[i].name,
        data[i].country,
        data[i].address,
        data[i].exchange_ticker,
        data[i].listed_companies,
      ];
      info_exchanges.push(exchange);
    }
  }
  console.log("GGGGGGGGGG");
  console.log(info_exchanges);
  console.log("GGGGGGGGGG");
  return (
    <div>
      <Layout>
        <Content>
          {info_exchanges.map((elemento) => (
            <table>
              <tr>
                <th>Nombre</th>
                <th>País</th>
                <th>Dirección</th>
                <th>Ticker</th>
                <th>Compañías</th>
              </tr>
              <tr>
                <td>{elemento[0]}</td>
                <td>{elemento[1]}</td>
                <td>{elemento[2]}</td>
                <td>{elemento[3]}</td>
                <td>{elemento[4]}</td>
              </tr>
            </table>
          ))}
        </Content>
      </Layout>
    </div>
  );
}

export default Mercado_Valores;
