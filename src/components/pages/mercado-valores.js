import React from "react";
import { socket2 } from "../../lib/socket";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import { PieChart, Pie, Tooltip } from "recharts";
import "../../Styles2.css";

const { Content } = Layout;

function Mercado_Valores() {
  const [data, setData] = useState();
  const [data_stocks, setDataStocks] = useState([]); // Contiene la información de todos los ticker que entrega update
  const [data_buy, setDataBuy] = useState([]); // Contiene la información de todos los ticker que entrega buy
  const [data_sell, setDataSell] = useState([]);

  // Veo a todos los mercados disponibles
  useEffect(() => {
    socket2.emit("EXCHANGES");
    socket2.on("EXCHANGES", (res) => {
      setData(res);
    });
  }, []);
  // Veo a todos las acciones disponibles
  useEffect(() => {
    socket2.emit("STOCKS");
    socket2.on("STOCKS", (res) => {
      setDataStocks(res);
    });
  }, []);
  // Obtengo todas las ventas y compras
  useEffect(() => {
    socket2.on("BUY", (res) => {
      setDataBuy((currentData1) => [...currentData1, res]);
    });
    socket2.on("SELL", (res) => {
      setDataSell((currentData2) => [...currentData2, res]);
    });
  }, []);

  // Obtengo la información de cada mercado
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

  // Obtengo ticker por cada uno de los mercados
  var diccionario_tickers_mercado = {};
  if (data !== undefined) {
    for (var t in data) {
      diccionario_tickers_mercado[t] = [];
      for (var y in data[t].listed_companies) {
        if (data_stocks !== undefined) {
          for (var r in data_stocks) {
            if (data_stocks[r].company_name === data[t].listed_companies[y]) {
              diccionario_tickers_mercado[t].push(data_stocks[r].ticker);
            }
          }
        }
      }
    }
  }

  // Obtengo el volumen total de compra
  var volumen_total_compra = {};
  if (diccionario_tickers_mercado !== undefined) {
    for (var e in diccionario_tickers_mercado) {
      volumen_total_compra[e] = 0;
      if (data_buy !== undefined) {
        for (var x in data_buy) {
          if (diccionario_tickers_mercado[e].includes(data_buy[x].ticker)) {
            volumen_total_compra[e] += data_buy[x].volume;
          }
        }
      }
    }
  }
  // Obtengo el volumen total de venta
  var volumen_total_venta = {};
  if (diccionario_tickers_mercado !== undefined) {
    for (var q in diccionario_tickers_mercado) {
      volumen_total_venta[q] = 0;
      if (data_sell !== undefined) {
        for (var k in data_sell) {
          if (diccionario_tickers_mercado[q].includes(data_sell[k].ticker)) {
            console.log("WWWWWWWWWWW");
            volumen_total_venta[q] += data_sell[k].volume;
          }
        }
      }
    }
  }

  // Obtengo el volumen total por mercado
  var volumen_total = {};
  if (diccionario_tickers_mercado !== undefined) {
    for (var b in diccionario_tickers_mercado) {
      volumen_total[b] = volumen_total_compra[b] + volumen_total_venta[b];
    }
  }

  // Obtengo el volumen total de todos los mercados
  var volumen_total_general = 0;
  if (volumen_total !== undefined) {
    for (var z in volumen_total) {
      volumen_total_general += volumen_total[z];
    }
  }

  console.log("&&&&&&&&&&&&&&&&&&&&&&");
  console.log(volumen_total_compra);
  console.log(volumen_total_venta);
  console.log(volumen_total);
  console.log(volumen_total_general);
  console.log("&&&&&&&&&&&&&&&&&&&&&&");

  // Compongo la data para hacer el gráfico de torta de la participación de mercado
  const data01 = [];
  if (volumen_total !== undefined) {
    for (var f in volumen_total) {
      data01.push({
        name: f,
        value: (volumen_total[f] * 100) / volumen_total_general,
      });
    }
  }
  var grafico = (
    <PieChart width={400} height={400}>
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={data01}
        cx={200}
        cy={200}
        outerRadius={80}
        fill="#8884d8"
        label
      />
      <Tooltip />
    </PieChart>
  );

  return (
    <div>
      <Layout>
        <Content>
          <h1>Mercados disponibles</h1>
          <table id="tablainicio">
            <tr>
              <th>Nombre</th>
              <th>País</th>
              <th>Dirección</th>
              <th>Ticker</th>
              <th>Compañías</th>
              <th>Cantidad de Acciones</th>
            </tr>
            {info_exchanges.map((elemento) => (
              <tr>
                <td>{elemento[0]}</td>
                <td>{elemento[1]}</td>
                <td>{elemento[2]}</td>
                <td>{elemento[3]}</td>
                <td>{elemento[4]}</td>
                <td>{elemento[4].length}</td>
              </tr>
            ))}
          </table>
          <h1>Participación de Mercado</h1>
          <div className="grafico">{grafico}</div>

          <h1>Volumen Compra</h1>
          <table>
            <tr>
              <th>Nombre</th>
              <th>Volumen Compra</th>
            </tr>
            {Object.keys(volumen_total_compra).map((key) => (
              <tr>
                <td>{key}</td>
                <td>{volumen_total_compra[key]}</td>
              </tr>
            ))}
          </table>
          <h1>Volumen Venta</h1>
          <table>
            <tr>
              <th>Nombre</th>
              <th>Volumen Venta</th>
            </tr>
            {Object.keys(volumen_total_venta).map((key) => (
              <tr>
                <td>{key}</td>
                <td>{volumen_total_venta[key]}</td>
              </tr>
            ))}
          </table>
          <h1>Volumen Total</h1>
          <table>
            <tr>
              <th>Nombre</th>
              <th>Volumen Total (compra y venta)</th>
            </tr>
            {Object.keys(volumen_total).map((key) => (
              <tr>
                <td>{key}</td>
                <td>{volumen_total[key]}</td>
              </tr>
            ))}
          </table>
        </Content>
      </Layout>
    </div>
  );
}

export default Mercado_Valores;
