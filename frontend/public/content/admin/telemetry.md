# Overview

OmniEconomy includes **optional anonymous telemetry** to help us understand mod usage and improve future updates. This page explains exactly what data is collected, why, and how to opt-out.

# Privacy First

We take your privacy seriously:

- ✅ **Completely Anonymous** - No personal information, IP addresses, or player data is collected
- ✅ **Opt-Out Anytime** - Disable telemetry with a single config change
- ✅ **Transparent** - All collected data is documented below
- ✅ **Open Source** - You can review the telemetry code in our repository

# What Data is Collected?

Telemetry collects the following anonymous technical information:

## Server Identification

- **Unique Server ID**: A randomly generated UUID stored locally in your world folder
  - File location: `world/data/omnieconomy/server_id.dat`
  - Never contains server name, IP, or identifying information
  - Only used to prevent duplicate counting

## Technical Information

- **Mod Version**: Which version of OmniEconomy you're running (e.g., "0.1.1")
- **Minecraft Version**: Your Minecraft server version (e.g., "1.20.1")
- **Timestamp**: When the data was sent

## Heartbeat Schedule

- **Registration**: Sent once when the server starts for the first time with telemetry enabled
- **Heartbeats**: Sent every **1 hour** while the server is running

# What is NOT Collected

We explicitly do NOT collect:

❌ Server IP addresses or hostnames  
❌ Server names or descriptions  
❌ Player names or UUIDs  
❌ Economy balances or transaction data  
❌ World data or configurations  
❌ Chat logs or commands  
❌ Performance metrics  
❌ Crash reports

# Why Collect Telemetry?

This data helps us:

1. **Understand Active Users** - How many servers are actively using OmniEconomy
2. **Version Distribution** - Which versions are most popular to prioritize support
3. **Update Planning** - When it's safe to deprecate older versions
4. **Minecraft Compatibility** - Which Minecraft versions to focus development on

# Example Data Payload

Here's exactly what gets sent in a heartbeat:

```json
{
  "serverId": "550e8400-e29b-41d4-a716-446655440000",
  "modVersion": "0.1.1",
  "minecraftVersion": "1.20.1",
  "timestamp": 1730073600000,
  "type": "heartbeat"
}
```

That's it. Nothing else.

# How to Opt-Out

If you prefer not to send telemetry data, you can disable it:

## Step 1: Locate Config File

Find your OmniEconomy configuration file:

```
config/omnieconomy-common.toml
```

## Step 2: Disable Telemetry

Change the `enableTelemetry` setting to `false`:

```toml
"This helps us understand how many servers use the mod.",
"No personal data, IP addresses, or player information is collected.",
"Only a randomly generated server ID and mod version are sent.",
"You can opt-out at any time by setting this to false."
enableTelemetry = false
```

## Step 3: Restart Server

Restart your Minecraft server for the changes to take effect.

## Step 4: Verify (Optional)

Check your server logs. You should NOT see messages like:

```
[OmniEconomy-Telemetry] Sending anonymous telemetry registration...
```

# Server ID Management

## Where is it stored?

The server ID is stored in your world data folder:

```
world/data/omnieconomy/server_id.dat
```

## Can I reset it?

Yes, simply delete the `server_id.dat` file. A new ID will be generated on next server start.

## What if I copy my world?

Each world folder has its own server ID. If you copy a world, it will initially share the same ID but you can reset it by deleting the file.

# Logging

When telemetry is enabled, you'll see these log messages on server start:

```
[OmniEconomy-Telemetry] Sending anonymous telemetry registration...
[OmniEconomy-Telemetry] Server ID: 550e8400-e29b-41d4-a716-446655440000 | Mod Version: 0.1.1 | MC Version: 1.20.1
[OmniEconomy-Telemetry] To opt-out, set 'enableTelemetry = false' in omnieconomy-common.toml
```

This transparency ensures you always know when telemetry is active.

# Technical Details

## Network Requests

- **Endpoint**: Telemetry data is sent to our secure telemetry server via HTTPS
- **Timeout**: Requests timeout after 5 seconds to prevent lag
- **Async**: All network calls are asynchronous and never block server ticks
- **Failure Handling**: Failed requests are silently ignored - telemetry never impacts gameplay

## Source Code

The telemetry system is open source and can be reviewed [here](https://github.com/matejhozlar/omnieconomy/tree/neoforge-1.21.1/src/main/java/com/saunhardy/omnieconomy/telemetry):

- `ServerIdentifier.java` - Server ID generation and storage
- `TelemetryClient.java` - HTTP request handling
- `TelemetryManager.java` - Event handling and scheduling

# Frequently Asked Questions

## Q: Does telemetry affect server performance?

**A:** No. All telemetry requests are:

- Asynchronous (non-blocking)
- Sent only once per hour
- Lightweight (< 200 bytes per request)
- Timeout after 5 seconds
- Completely ignored if they fail

## Q: Can you track my server's location?

**A:** No. We deliberately do not log IP addresses. The only identifier is a random UUID that has no connection to your server's real identity.

## Q: What happens if I disable telemetry mid-session?

**A:** The setting is checked before every heartbeat. Disabling it will immediately stop all telemetry transmission. No restart required for the change to take effect.

## Q: Is telemetry required for the mod to work?

**A:** No. OmniEconomy works identically whether telemetry is enabled or disabled. It's completely optional.

## Q: Do you share or sell telemetry data?

**A:** Never. The data is used exclusively for internal development decisions and is not shared with third parties.

## Q: Can I see all telemetry sent from my server?

**A:** Yes, if you have access to your server logs, all telemetry transmissions are logged with the data being sent.

# Contact

If you have questions or concerns about telemetry and privacy:

- **GitHub Issues**: [Report on GitHub](https://github.com/matejhozlar/omnieconomy/issues)
- **Discord**: Join our [Discord server](https://discord.gg/mNcm76HXFy)

---

**Last Updated**: October 28, 2025  
**Applies to**: OmniEconomy v0.1.2 and later
