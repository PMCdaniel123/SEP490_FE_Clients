"use client";

import React from "react";
import { ConfigProvider } from "antd";
import theme from "@/libs/antd-theme";

interface AntdProviderProps {
  children: React.ReactNode;
}

const AntdProvider: React.FC<AntdProviderProps> = ({ children }) => {
  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
};

export default AntdProvider;
