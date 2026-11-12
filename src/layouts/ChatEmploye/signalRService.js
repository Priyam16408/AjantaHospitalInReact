import * as signalR from "@microsoft/signalr";

let connection = null;

export const setupSignalRConnection = (url) => {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(url) // Your SignalR hub endpoint
        .withAutomaticReconnect() // Automatically reconnect on disconnect
        .configureLogging(signalR.LogLevel.Information) // Optional: Set log level
        .build();

    connection.onreconnected(() => console.log("Reconnected to SignalR hub."));
    connection.onclose(() => console.log("SignalR connection closed."));
    connection.on("ReceiveMessage", (message) => {
        console.log("Received message:", message);
    });

    return connection;
};

export const startSignalRConnection = async () => {
    try {
        await connection.start();
        console.log("SignalR connected.");
    } catch (err) {
        console.error("Error establishing SignalR connection:", err);
        setTimeout(startSignalRConnection, 5000); // Retry on failure
    }
};

export const stopSignalRConnection = async () => {
    if (connection) {
        try {
            await connection.stop();
            console.log("SignalR connection stopped.");
        } catch (err) {
            console.error("Error stopping SignalR connection:", err);
        }
    }
};
