import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout(children: any): JSX.Element {
  return (
    <main>
      <Outlet />
    </main>
  );
}
