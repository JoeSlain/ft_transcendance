import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import Router from "./Router";
import "./styles/App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
