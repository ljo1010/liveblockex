import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: "pk_dev_D0wfBLYE808M7fX_lLoN_qZ9LaSNWrITw1rZc5ruC63IiaVpIczKB6NG_XCCVFjA",
});

export const { RoomProvider, useOthers, useMyPresence, useMap } =
  createRoomContext(client);