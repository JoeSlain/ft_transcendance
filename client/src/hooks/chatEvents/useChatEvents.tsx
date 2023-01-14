import axios from "axios";
import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/socketContext";
import { channelType } from "../../types/channelType";

type IProps = {
  privateChans: channelType[];
  publicChans: channelType[];
  setPrivateChans: (props: any) => void;
  setPublicChans: (props: any) => void;
  setSelected: (props: any) => void;
};

export default function useChatEvents({
  publicChans,
  privateChans,
  setPrivateChans,
  setPublicChans,
  setSelected,
}: IProps) {
  const socket = useContext(ChatContext);

  // update functions
  const updateSelected = (newChan: channelType) => {
    setSelected((prev: any) => {
      console.log("update selected", newChan);
      console.log("prev", prev);
      if (prev && prev.id === newChan.id) {
        console.log("update selected");
        return newChan;
      }
      return prev;
    });
  };

  const updateChannel = (newChan: channelType) => {
    console.log("channel in updateChan", newChan);
    if (newChan.type === "private") {
      setPrivateChans((prev: any) =>
        prev.map((chan: any) => {
          if (chan.id === newChan.id) {
            console.log("updating private");
            return newChan;
          }
          return chan;
        })
      );
    } else {
      console.log("updating public");
      setPublicChans((prev: any) =>
        prev.map((chan: any) => {
          if (chan.id === newChan.id) return newChan;
          return chan;
        })
      );
    }
    updateSelected(newChan);
  };

  // on mount
  useEffect(() => {
    console.log("use chat effect");
    // get Channels
    axios
      .get("http://localhost:3001/api/chat/privateChannels", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("privateChans", response.data);
        setPrivateChans(privateChans.concat(response.data));
      });
    axios
      .get("http://localhost:3001/api/chat/publicChannels", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("publicChans", response.data);
        setPublicChans(publicChans.concat(response.data));
      });

    // events
    socket.on("newChannel", (channel) => {
      console.log("new chan", channel);
      if (channel.type === "private")
        setPrivateChans((prev: any) => [...prev, channel]);
      else setPublicChans((prev: any) => [...prev, channel]);
    });

    socket.on("joinedChannel", (channel) => {
      console.log("joined channel", channel);
      setSelected(channel);
      updateChannel(channel);
    });

    socket.on("updateChannel", (channel) => {
      console.log("updating channel");
      updateChannel(channel);
    });

    socket.on("updateSelected", (data) => {
      console.log("updating selected");
      updateSelected(data.channel);
    });

    socket.on("removeChannel", (channel) => {
      console.log("removeChan", channel);
      if (channel.type === "private")
        setPrivateChans((prev: any) =>
          prev.filter((chan: any) => chan.id !== channel.id)
        );
      /*else
        setPublicChans((prev: any) =>
          prev.filter((chan: any) => chan.id !== channel.id)
        );
      setSelected((prev: any) => {
        if (prev && prev.id === channel.id) return null;
        return prev;
      });*/
    });

    socket.on("leftChannel", (channel) => {
      console.log(`client left ${channel.name}`);
      console.log("channel in event", channel);
      updateChannel(channel);
    });

    socket.on("newMessage", (message) => {
      console.log("newmessage", message);

      setSelected((prev: any) => {
        if (prev && prev.id === message.channel.id)
          return { ...prev, messages: prev.messages.concat(message) };
        return prev;
      });
    });

    socket.on("banned", (data) => {
      console.log("ban event");
      alert(
        `You have been banned from ${data.channel.name} until ${data.date}`
      );
      setSelected((prev: any) => {
        if (prev && prev.id === data.channel.id) return null;
      });
      socket.emit("leaveChannel", { user: data.user, channel: data.channel });
    });

    socket.on("userBanned", (data) => {
      setSelected((prev: any) => {
        if (prev && prev.id === data.channel.id) {
          const message = {
            from: "server",
            content: `${data.user.username} was banned from channel`,
          };
          return { ...prev, messages: prev.messages.concat(message) };
        }
      });
    });

    return () => {
      socket.off("newChannel");
      socket.off("joinedChannel");
      socket.off("removeChannel");
      socket.off("leftChannel");
      socket.off("newMessage");
      socket.off("banned");
    };
  }, []);
}
