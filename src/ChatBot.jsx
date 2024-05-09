import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, { useNodesState, useEdgesState, addEdge } from "reactflow";
import "reactflow/dist/style.css";
import { ArrowLeftOutlined, MessageOutlined } from "@ant-design/icons";
import { Input, Typography, message } from "antd";
import "./Chatbot.css";
const { TextArea } = Input;

const ChatBot = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [input, setInput] = useState("");
  const [selectedId, setSelectedId] = useState({});
  const [cond, setCond] = useState(false);

  function handleSelectedNode(obj) {
    setSelectedId(obj);
  }

  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    []
  );

  const nodegenerator = (msglabel, lastnode) => {
    return {
      id: `${nodes.length + 1}-new`,
      ...(!lastnode && { type: "input" }),
      data: {
        label: (
          <Typography
            onClick={() =>
              handleSelectedNode({
                id: `${nodes.length + 1}-new`,
                msg: msglabel,
              })
            }
            style={{
              boxShadow: " -1px 7px 30px -7px rgba(0,0,0,0.75)",
              border: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#40E0D080",
                padding: "5px 10px",
                borderRadius: "5px 5px 0px 0px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  height={12}
                  width={12}
                  src="https://upload.wikimedia.org/wikipedia/commons/7/72/Message-icon-grey.png"
                  alt="msg"
                />
                <span
                  style={{
                    fontWeight: 500,
                    margin: "0px 8px",
                    fontSize: 14,
                    fontFamily: "sans-serif",
                  }}
                >
                  Send Message
                </span>
              </div>
              <img
                height={14}
                width={14}
                alt="whatsapp"
                src="https://upload.wikimedia.org/wikipedia/commons/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg"
              />
            </div>
            <div
              style={{
                padding: "10px 5px",
                fontFamily: "sans-serif",
                textAlign: "left",
                borderBottomLeftRadius: "6px",
                borderBottomRightRadius: "6px",
              }}
            >
              {msglabel}
            </div>
          </Typography>
        ),
      },
      sourcePosition: "right",
      ...(lastnode && { targetPosition: "left" }),
      position: { x: 250, y: lastnode + 100 },
      selected: false,
      style: {
        padding: 0,
        width: 200,
        border: "none",
      },
    };
  };

  const handleClicked = () => {
    if (input && Math.abs(edges.length - nodes.length) < 2) {
      const lastnode = nodes[nodes.length - 1]?.position?.y || 0;
      const dataobj = nodegenerator(input, lastnode);
      setNodes([...nodes, dataobj]);
      setInput("");
    } else {
      messageApi.open({
        type: "error",
        content: "Can't save flow",
      });
    }
  };

  useEffect(() => {
    const changebg = nodes.map((el) => {
      if (selectedId.id == el.id) {
        setInput(selectedId.msg);
        return { ...el, selected: true };
      } else if (selectedId.id !== el.id && el.selected) {
        return { ...el, selected: false };
      }
      return el;
    });
    setNodes(changebg);
  }, [selectedId]);
  return (
    <>
      {contextHolder}
      <div className="main_wrapper">
        {/* topbar with save btn */}
        {cond && (
          <Typography.Text className="button-style" onClick={handleClicked}>
            Save changes
          </Typography.Text>
        )}
      </div>
      {/* main content wrapper */}
      <div className="main_cont_wrapper">
        {/* react flow code goes here */}
        <div className="flow_wrap">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          ></ReactFlow>
        </div>

        {/* msg input box code goes here */}
        <div className="border_style">
          {/* conditional rendering of input msg box and static textbox */}
          {cond ? (
            <>
              <div className="msg_wrapper">
                <ArrowLeftOutlined onClick={() => setCond(false)} />
                <Typography.Text className="msg_text">Message</Typography.Text>
              </div>
              <div style={{ padding: "15px", borderBottom: "1px solid black" }}>
                <Typography.Text className="text_style">Text</Typography.Text>

                <TextArea
                  rows={4}
                  placeholder="your message here"
                  style={{ margin: "7px 0px" }}
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                />
              </div>
            </>
          ) : (
            <Typography
              type="div"
              className="msgbox_container"
              onClick={() => setCond(true)}
            >
              <MessageOutlined style={{ fontSize: 18, color: "#000080" }} />
              <Typography type="p" className="msg_style">
                Message
              </Typography>
            </Typography>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBot;
