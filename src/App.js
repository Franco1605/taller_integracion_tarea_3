import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { socket1 } from "./lib/socket";
import Header from "./components/header";
import Acciones from "./components/pages/acciones";
import Mercado_Valores from "./components/pages/mercado-valores";
import Inicio from "./components/pages/mercado-valores";
import "antd/dist/antd.css";
import { Layout } from "antd";
import { Line, LineChart, XAxis, YAxis, Tooltip } from "recharts";

const { Content } = Layout;

const App = () => {
  const [data, setData] = useState(); // Contiene la información de todos los ticker a ser evaluados
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);

  const [data1_buy, setData1_buy] = useState([]);
  const [data2_buy, setData2_buy] = useState([]);
  const [data3_buy, setData3_buy] = useState([]);
  const [data4_buy, setData4_buy] = useState([]);
  const [data5_buy, setData5_buy] = useState([]);

  const [data1_sell, setData1_sell] = useState([]);
  const [data2_sell, setData2_sell] = useState([]);
  const [data3_sell, setData3_sell] = useState([]);
  const [data4_sell, setData4_sell] = useState([]);
  const [data5_sell, setData5_sell] = useState([]);
  // Guardamos en data los tickers disponibles
  useEffect(() => {
    socket1.emit("STOCKS");
    socket1.on("STOCKS", (res) => {
      setData(res);
    });
  }, []);

  console.log(data);

  useEffect(() => {
    socket1.on("BUY", (res) => {
      if (res.ticker === "IBM") {
        setData1_buy((currentData1) => [...currentData1, res]);
      } else if (res.ticker === "FB") {
        setData2_buy((currentData2) => [...currentData2, res]);
      } else if (res.ticker === "AAPL") {
        setData3_buy((currentData3) => [...currentData3, res]);
      } else if (res.ticker === "TWTR") {
        setData4_buy((currentData4) => [...currentData4, res]);
      } else {
        setData5_buy((currentData5) => [...currentData5, res]);
      }
    });
    socket1.on("SELL", (res) => {
      if (res.ticker === "IBM") {
        setData1_sell((currentData1) => [...currentData1, res]);
      } else if (res.ticker === "FB") {
        setData2_sell((currentData2) => [...currentData2, res]);
      } else if (res.ticker === "AAPL") {
        setData3_sell((currentData3) => [...currentData3, res]);
      } else if (res.ticker === "TWTR") {
        setData4_sell((currentData4) => [...currentData4, res]);
      } else {
        setData5_sell((currentData5) => [...currentData5, res]);
      }
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

      if (res.ticker === "IBM") {
        setData1((currentData1) => [...currentData1, res]);
      } else if (res.ticker === "FB") {
        setData2((currentData2) => [...currentData2, res]);
      } else if (res.ticker === "AAPL") {
        setData3((currentData3) => [...currentData3, res]);
      } else if (res.ticker === "TWTR") {
        setData4((currentData4) => [...currentData4, res]);
      } else {
        setData5((currentData5) => [...currentData5, res]);
      }
    });
  }, []);
  var ultimo_precio_ibm = 0;
  var ultimo_precio_fb = 0;
  var ultimo_precio_aapl = 0;
  var ultimo_precio_twtr = 0;
  var ultimo_precio_snap = 0;
  if (data1.length !== 0) {
    ultimo_precio_ibm = data1[data1.length - 1].value;
    if (data1.length > 1) {
      var v2 = ultimo_precio_ibm;
      var v1 = data1[data1.length - 2].value;
      var variacion_ibm = ((v2 - v1) / v1) * 100;
    }
  }
  if (data2.length !== 0) {
    ultimo_precio_fb = data2[data2.length - 1].value;
    if (data2.length > 1) {
      var v2 = ultimo_precio_fb;
      var v1 = data2[data2.length - 2].value;
      var variacion_fb = ((v2 - v1) / v1) * 100;
    }
  }
  if (data3.length !== 0) {
    ultimo_precio_aapl = data3[data3.length - 1].value;
    if (data3.length > 1) {
      var v2 = ultimo_precio_aapl;
      var v1 = data3[data3.length - 2].value;
      var variacion_aapl = ((v2 - v1) / v1) * 100;
    }
  }
  if (data4.length !== 0) {
    ultimo_precio_twtr = data4[data4.length - 1].value;
    if (data4.length > 1) {
      var v2 = ultimo_precio_twtr;
      var v1 = data4[data4.length - 2].value;
      var variacion_twtr = ((v2 - v1) / v1) * 100;
    }
  }
  if (data5.length !== 0) {
    ultimo_precio_snap = data5[data5.length - 1].value;
    if (data5.length > 1) {
      var v2 = ultimo_precio_snap;
      var v1 = data5[data5.length - 2].value;
      var variacion_snap = ((v2 - v1) / v1) * 100;
    }
  }

  var minimo_precio_ibm = Math.min.apply(
    Math,
    data1.map(function (o) {
      return o.value;
    })
  );
  var minimo_precio_fb = Math.min.apply(
    Math,
    data2.map(function (o) {
      return o.value;
    })
  );
  var minimo_precio_aapl = Math.min.apply(
    Math,
    data3.map(function (o) {
      return o.value;
    })
  );
  var minimo_precio_twtr = Math.min.apply(
    Math,
    data4.map(function (o) {
      return o.value;
    })
  );
  var minimo_precio_snap = Math.min.apply(
    Math,
    data5.map(function (o) {
      return o.value;
    })
  );
  var maximo_precio_ibm = Math.max.apply(
    Math,
    data1.map(function (o) {
      return o.value;
    })
  );
  var maximo_precio_fb = Math.max.apply(
    Math,
    data2.map(function (o) {
      return o.value;
    })
  );
  var maximo_precio_aapl = Math.max.apply(
    Math,
    data3.map(function (o) {
      return o.value;
    })
  );

  var maximo_precio_twtr = Math.max.apply(
    Math,
    data4.map(function (o) {
      return o.value;
    })
  );
  var maximo_precio_snap = Math.min.apply(
    Math,
    data5.map(function (o) {
      return o.value;
    })
  );

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
                <h1>IBM</h1>
                <LineChart width={500} height={300} data={data1}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" />
                </LineChart>
                <table>
                  <tr>
                    <th>Último Precio</th>
                    <th>Precio más alto</th>
                    <th>Precio más bajo</th>
                    <th>Volumen transado</th>
                    <th>Variación porcentual</th>
                  </tr>
                  <tr>
                    <td>{ultimo_precio_ibm}</td>
                    <td>{maximo_precio_ibm}</td>
                    <td>{minimo_precio_ibm}</td>
                    <td>0</td>
                    <td>{variacion_ibm}%</td>
                  </tr>
                </table>
                <h1>FB</h1>
                <LineChart width={500} height={300} data={data2}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" />
                </LineChart>
                <table>
                  <tr>
                    <th>Último Precio</th>
                    <th>Precio más alto</th>
                    <th>Precio más bajo</th>
                    <th>Volumen transado</th>
                    <th>Variación porcentual</th>
                  </tr>
                  <tr>
                    <td>{ultimo_precio_fb}</td>
                    <td>{maximo_precio_fb}</td>
                    <td>{minimo_precio_fb}</td>
                    <td>0</td>
                    <td>{variacion_fb}%</td>
                  </tr>
                </table>
                <h1>AAPL</h1>
                <LineChart width={500} height={300} data={data3}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" />
                </LineChart>
                <table>
                  <tr>
                    <th>Último Precio</th>
                    <th>Precio más alto</th>
                    <th>Precio más bajo</th>
                    <th>Volumen transado</th>
                    <th>Variación porcentual</th>
                  </tr>
                  <tr>
                    <td>{ultimo_precio_aapl}</td>
                    <td>{maximo_precio_aapl}</td>
                    <td>{minimo_precio_aapl}</td>
                    <td>0</td>
                    <td>{variacion_aapl}%</td>
                  </tr>
                </table>
                <h1>TWTR</h1>
                <LineChart width={500} height={300} data={data4}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" />
                </LineChart>
                <table>
                  <tr>
                    <th>Último Precio</th>
                    <th>Precio más alto</th>
                    <th>Precio más bajo</th>
                    <th>Volumen transado</th>
                    <th>Variación porcentual</th>
                  </tr>
                  <tr>
                    <td>{ultimo_precio_twtr}</td>
                    <td>{maximo_precio_twtr}</td>
                    <td>{minimo_precio_twtr}</td>
                    <td>0</td>
                    <td>{variacion_twtr}%</td>
                  </tr>
                </table>
                <h1>SNAP</h1>
                <LineChart width={500} height={300} data={data5}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" />
                </LineChart>
                <table>
                  <tr>
                    <th>Último Precio</th>
                    <th>Precio más alto</th>
                    <th>Precio más bajo</th>
                    <th>Volumen transado</th>
                    <th>Variación porcentual</th>
                  </tr>
                  <tr>
                    <td>{ultimo_precio_snap}</td>
                    <td>{maximo_precio_snap}</td>
                    <td>{minimo_precio_snap}</td>
                    <td>0</td>
                    <td>{variacion_snap}%</td>
                  </tr>
                </table>
              </Content>
            </Layout>
          )}
        />
        <Route path="/acciones" component={Acciones} />
        <Route path="/mercado-valores" component={Mercado_Valores} />
        <Route path="/inicio" component={Inicio} />
      </div>
    </Router>
  );
};

export default App;
