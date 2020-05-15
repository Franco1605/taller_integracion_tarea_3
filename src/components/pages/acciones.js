import React from "react";
import { socket1 } from "../../lib/socket";
import { useEffect, useState } from "react";

function Acciones() {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  /*useEffect(() => {
    socket1.on("BUY", (res) => {
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
  }, []);*/
  return (
    <div>
      <h1>Aquí estarán las acciones</h1>
    </div>
  );
}
export default Acciones;
