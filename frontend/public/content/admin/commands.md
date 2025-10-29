# Overview

Admin commands allow server operators to manage the economy system. All commands require **OP level 4**.

# Getting Help

| Command          | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| `/omniecon help` | Shows all available commands (including admin commands for OPs) |

> **Tip**: All commands in the help menu are clickable! Just click to insert them into chat.

# Economy Management

## Balance Operations

| Command                                  | Description                            |
| ---------------------------------------- | -------------------------------------- |
| `/omniecon admin give <player> <amount>` | Give money to a player                 |
| `/omniecon admin take <player> <amount>` | Remove money from a player's balance   |
| `/omniecon admin set <player> <amount>`  | Set a player's balance to exact amount |
| `/omniecon admin balance <player>`       | Check any player's balance             |

**Examples:**

```
/omniecon admin give Steve 1000
/omniecon admin take Alex 500
/omniecon admin set PlayerName 10000
/omniecon admin balance Steve
```

> **Note**: All balance changes respect the configured maximum balance limit. Players affected by admin commands receive notifications about the changes.

## Reward Resets

| Command                                  | Description                            |
| ---------------------------------------- | -------------------------------------- |
| `/omniecon admin resetdaily <player>`    | Reset a player's daily reward cooldown |
| `/omniecon admin resetplaytime <player>` | Reset a player's playtime earnings cap |

**Use Cases:**

- **Reset Daily**: Allow a player to claim their daily reward again immediately
- **Reset Playtime**: Clear a player's daily playtime earnings cap (useful if they hit the limit early)

# Lottery Management (if enabled)

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `/lottery start`  | Start a new lottery (OP only) |
| `/lottery status` | Check current lottery status  |

> **Note**: Lottery cooldowns and settings are controlled via the config file.

# Telemetry Commands (if enabled)

| Command                     | Description                            |
| --------------------------- | -------------------------------------- |
| `/omni telemetry status`    | View telemetry configuration and stats |
| `/omni telemetry heartbeat` | Manually send a telemetry heartbeat    |

# Important Notes

## Permissions

- All admin commands require **OP level 4** (`/op <player>`)
- Regular players cannot see or use admin commands
- Admin actions are broadcasted to other online operators

## Player Notifications

When you perform admin actions:

- You receive a confirmation message with the new balance
- The affected player receives a notification about the change
- Other online operators see the admin action (for transparency)

## Configuration

Admin commands respect all feature toggles in the config:

- If daily rewards are disabled, you can't reset them
- If lottery is disabled, lottery commands won't appear
- If telemetry is disabled, telemetry commands won't appear

# Best Practices

## Economy Management

1. **Monitor Inflation**: Use `/baltop` to track wealth distribution
2. **Set Reasonable Caps**: Configure `maxBalance` in the config to prevent hoarding
3. **Use Set Sparingly**: Prefer `give` and `take` to maintain transaction history context
4. **Document Changes**: Keep track of major balance adjustments for server records

## Player Support

1. **Reset Daily Wisely**: Only reset daily rewards for legitimate reasons (bugs, special events)
2. **Communicate Changes**: Let players know why their balance was adjusted
3. **Be Transparent**: Admin actions are logged to other OPs for accountability

## Testing & Debugging

1. **Test Features**: Use admin commands to test economy features before enabling them server-wide
2. **Balance Testing**: Create test scenarios with set/give commands
3. **Monitor Playtime**: Check if playtime rewards are working with resetplaytime

# Troubleshooting

**"Command not found"**

- Ensure you have OP level 2 or higher
- Check if the feature is enabled in the config

**"Player doesn't have enough funds" (take command)**

- Player's balance is lower than the amount you're trying to take
- Check their balance first with `/omniecon admin balance <player>`

**"Maximum balance reached" (give/set commands)**

- Player has hit the configured `maxBalance` limit
- Adjust the limit in `omnieconomy-common.toml` if needed

# Configuration Reference

Key admin-related config options:

```toml
[economy]
maxBalance = 2000000000  # Maximum allowed balance per player

[commands]
enableMoneyCommand = true
enablePayCommand = true
enableBaltopCommand = true

[dailyRewards]
enableDailyReward = true
amount = 100

[playtimeRewards]
enablePlaytimeRewards = false
dailyCap = 1000
```

---

**Need Help?** Use `/omniecon help` in-game to see all available commands with descriptions!
