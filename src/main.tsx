import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { check } from '@tauri-apps/plugin-updater';
import { ask, message } from '@tauri-apps/plugin-dialog';
import { invoke } from "@tauri-apps/api/core";

async function checkForAppUpdates(onUserClick: false) {
  const update = await check();
  if (update === null) {
    return;
  } else if (update?.available) {
    const yes = await ask(`Update to ${update.version} is available!\n\nRelease notes: ${update.body}`, {
      title: 'Update Available',
      kind: 'info',
      okLabel: 'Update',
      cancelLabel: 'Cancel'
    });
    if (yes) {
      await update.downloadAndInstall();
      // Restart the app after the update is installed by calling the Tauri command that handles restart for your app
      // It is good practice to shut down any background processes gracefully before restarting
      // As an alternative, you could ask the user to restart the app manually
      await invoke("graceful_restart");
    }
  } else if (onUserClick) {
    await message('You are on the latest version. Stay awesome!', {
      title: 'No Update Available',
      kind: 'info',
      okLabel: 'OK'
    });
  }
}

checkForAppUpdates(false);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
