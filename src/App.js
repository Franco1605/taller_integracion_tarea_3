import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { socket1 } from "./lib/socket";
import Header from "./components/header";
import Mercado_Valores from "./components/pages/mercado-valores";
import "antd/dist/antd.css";
import { Layout } from "antd";
import { Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";
import "./Styles.css";

const { Content } = Layout;

const App = () => {
  const [data, setData] = useState(); // Contiene la información de todos los ticker a ser evaluados
  const [data_update, setDataUpdate] = useState([]); // Contiene la información de todos los ticker que entrega update
  const [data_buy, setDataBuy] = useState([]); // Contiene la información de todos los ticker que entrega buy
  const [data_sell, setDataSell] = useState([]); // Contiene la información de todos los ticker que entrega buy

  // Guardamos en data los tickers disponibles
  useEffect(() => {
    socket1.emit("STOCKS");
    socket1.on("STOCKS", (res) => {
      setData(res);
    });
  }, []);

  // Escuchamos los eventos de buy, sell y update para tener la información que necesitamos
  useEffect(() => {
    socket1.on("BUY", (res) => {
      setDataBuy((currentData1) => [...currentData1, res]);
    });
    socket1.on("SELL", (res) => {
      setDataSell((currentData1) => [...currentData1, res]);
    });
    socket1.on("UPDATE", (res) => {
      let unix_timestamp = res.time;
      var date = new Date(unix_timestamp);
      var months_arr = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      var year = date.getFullYear(0);
      var month = months_arr[date.getMonth()];
      var day = date.getDate();
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var seconds = "0" + date.getSeconds();
      var convdataTime =
        day +
        "-" +
        month +
        "-" +
        year +
        " " +
        hours +
        ":" +
        minutes.substr(-2) +
        ":" +
        seconds.substr(-2);

      res.time = convdataTime;
      setDataUpdate((currentData1) => [...currentData1, res]);
    });
  }, []);

  var info_acciones = [];
  var diccionario_valores = {};
  if (data !== undefined) {
    for (var i in data) {
      diccionario_valores[data[i].ticker] = { update: [], buy: [], sell: [] };
      let accion = [
        data[i].ticker,
        data[i].company_name,
        data[i].country,
        data[i].quote_base,
      ];
      info_acciones.push(accion);
    }
  }
  if (data !== undefined && data_update !== undefined) {
    for (var j in data_update) {
      console.log("···························");
      console.log(data_update[j]);
      console.log("···························");
      diccionario_valores[data_update[j].ticker].update.push(data_update[j]);
    }
  }
  if (data !== undefined && data_buy !== undefined) {
    for (var k in data_buy) {
      diccionario_valores[data_buy[k].ticker].buy.push(data_buy[k]);
    }
  }
  if (data !== undefined && data_sell !== undefined) {
    for (var l in data_sell) {
      diccionario_valores[data_sell[l].ticker].sell.push(data_sell[l]);
    }
  }
  // Generamos los gráficos para cada variable
  var lista = [];
  if (diccionario_valores !== undefined) {
    for (var m in diccionario_valores) {
      let grafico = [
        <h2>Gráfico {m}</h2>,
        <LineChart
          width={500}
          height={300}
          data={diccionario_valores[m].update}
        >
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" />
        </LineChart>,
      ];
      lista.push(grafico);
    }
  }

  // Obtenemos las estadísticas generales para cada acción
  var lista_estadisticas = [];
  if (diccionario_valores !== undefined) {
    for (var n in diccionario_valores) {
      var lista_accion = [];
      if (diccionario_valores[n].update.length !== 0) {
        lista_accion.push(n);
        var ultimo_precio =
          diccionario_valores[n].update[
            diccionario_valores[n].update.length - 1
          ].value;
        lista_accion.push(ultimo_precio);
        let minimo_precio = Math.min.apply(
          Math,
          diccionario_valores[n].update.map(function (o) {
            return o.value;
          })
        );
        lista_accion.push(minimo_precio);
        let maximo_precio = Math.max.apply(
          Math,
          diccionario_valores[n].update.map(function (o) {
            return o.value;
          })
        );
        lista_accion.push(maximo_precio);
        if (diccionario_valores[n].update.length > 1) {
          let v2 = ultimo_precio;
          let v1 =
            diccionario_valores[n].update[
              diccionario_valores[n].update.length - 2
            ].value;
          var variacion = ((v2 - v1) / v1) * 100;
          lista_accion.push(variacion);
        } else {
          variacion = 0;
          lista_accion.push(variacion);
        }
        if (diccionario_valores[n].buy.length !== 0) {
          var volumen = 0;
          for (var v in diccionario_valores[n].buy) {
            volumen += diccionario_valores[n].buy[v].volume;
          }
          if (diccionario_valores[n].sell.length !== 0) {
            for (var x in diccionario_valores[n].sell) {
              volumen += diccionario_valores[n].sell[x].volume;
            }
          }
          lista_accion.push(volumen);
        }
      }
      lista_estadisticas.push(lista_accion);
    }
  }

  return (
    <Router>
      <div>
        <Header />
        <Route
          exact
          path="/"
          render={(props) => (
            <Layout>
              <Content>
                <h1>Acciones disponibles</h1>
                <table>
                  <tr>
                    <th>Ticker</th>
                    <th>Compañía/Empresa</th>
                    <th>País</th>
                    <th>Moneda</th>
                  </tr>
                  {info_acciones.map((elemento) => (
                    <tr>
                      <td>{elemento[0]}</td>
                      <td>{elemento[1]}</td>
                      <td>{elemento[2]}</td>
                      <td>{elemento[3]}</td>
                    </tr>
                  ))}
                </table>

                {lista.map((grafico) => (
                  <div className="grafico">
                    {grafico[0]}
                    {grafico[1]}
                  </div>
                ))}
                <h1>Estadísticas Generales</h1>
                {lista_estadisticas.map((elemento) => (
                  <div>
                    <table>
                      <tr>
                        <th>Acción</th>
                        <th>Último Precio</th>
                        <th>Precio más alto</th>
                        <th>Precio más bajo</th>
                        <th>Volumen transado</th>
                        <th>Variación porcentual</th>
                      </tr>
                      <tr>
                        <td>{elemento[0]}</td>
                        <td>{elemento[1]}</td>
                        <td>{elemento[3]}</td>
                        <td>{elemento[2]}</td>
                        <td>{elemento[5]}</td>
                        <td>{elemento[4]}%</td>
                      </tr>
                    </table>
                  </div>
                ))}
              </Content>
            </Layout>
          )}
        />
        <Route path="/mercado-valores" component={Mercado_Valores} />
      </div>
    </Router>
  );
};

export default App;
