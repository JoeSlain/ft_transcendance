import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./Router";
import "./styles/App.css";
import {
  ChatContext,
  GameContext,
  chatSocket,
  gameSocket,
} from "./context/socketContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatContext.Provider value={chatSocket}>
        <GameContext.Provider value={gameSocket}>
          <Router />
        </GameContext.Provider>
      </ChatContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
