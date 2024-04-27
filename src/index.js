import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createClient } from "@liveblocks/client";

import { LiveMap } from "@liveblocks/client";
import { RoomProvider } from "./liveblocks.config";

const client = createClient({
  publicApiKey: "pk_dev_D0wfBLYE808M7fX_lLoN_qZ9LaSNWrITw1rZc5ruC63IiaVpIczKB6NG_XCCVFjA",
});

ReactDOM.render(
  <React.StrictMode>
    <RoomProvider
      id="react-whiteboard-app"
      initialPresence={{}}
      initialStorage={{
        shapes: new LiveMap(),
      }}
    >
      <App />
    </RoomProvider>
  </React.StrictMode>,
  document.getElementById("root")
);