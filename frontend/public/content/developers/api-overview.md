# Economy Core API

**Package:** `com.saunhardy.omnieconomy.core.Economy`

The core economy system that manages player balances, transactions, and rewards.

## Balance Management

### `getBalance(MinecraftServer server, UUID playerId)`

Returns the current balance of a player.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `playerId` - UUID of the player
- **Returns:** `int` - The player's current balance
- **Example:**
  ```java
  int balance = Economy.getBalance(server, playerUUID);
  ```

### `setBalance(MinecraftServer server, UUID playerId, int newBalance)`

Sets a player's balance to a specific amount. The balance is clamped to the configured maximum.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `playerId` - UUID of the player
  - `newBalance` - The new balance to set
- **Returns:** `int` - The actual balance set (after clamping)
- **Example:**
  ```java
  int actualBalance = Economy.setBalance(server, playerUUID, 1000);
  ```

### `deposit(MinecraftServer server, UUID playerId, int amount)`

Adds money to a player's account.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `playerId` - UUID of the player
  - `amount` - Amount to deposit (must be > 0)
- **Returns:** `int` - The new balance after deposit
- **Example:**
  ```java
  int newBalance = Economy.deposit(server, playerUUID, 500);
  ```

### `withdraw(MinecraftServer server, UUID playerId, int amount)`

Removes money from a player's account.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `playerId` - UUID of the player
  - `amount` - Amount to withdraw (must be > 0)
- **Returns:** `boolean` - `true` if withdrawal successful, `false` if insufficient funds
- **Example:**
  ```java
  boolean success = Economy.withdraw(server, playerUUID, 250);
  if (success) {
      // Withdrawal successful
  }
  ```

## Transactions

### `pay(MinecraftServer server, UUID from, UUID to, int amount)`

Transfers money from one player to another.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `from` - UUID of the paying player
  - `to` - UUID of the receiving player
  - `amount` - Amount to transfer (must be > 0)
- **Returns:** `PayResult` enum value
  - `SUCCESS` - Payment completed successfully
  - `INSUFFICIENT_FUNDS` - Sender doesn't have enough money
  - `RECEIVER_CLAMPED` - Receiver would exceed max balance
  - `SELF_PAYMENT` - Cannot pay yourself
  - `INVALID_AMOUNT` - Amount is invalid
- **Example:**
  ```java
  PayResult result = Economy.pay(server, senderUUID, receiverUUID, 100);
  switch (result) {
      case SUCCESS -> player.sendMessage("Payment sent!");
      case INSUFFICIENT_FUNDS -> player.sendMessage("Not enough funds");
      // Handle other cases...
  }
  ```

## Daily Rewards

### `canClaimDaily(MinecraftServer server, UUID playerId, long todayEpochDay)`

Checks if a player can claim their daily reward.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `playerId` - UUID of the player
  - `todayEpochDay` - Current day as epoch day
- **Returns:** `boolean` - `true` if player can claim
- **Example:**
  ```java
  long today = LocalDate.now(ZoneOffset.UTC).toEpochDay();
  if (Economy.canClaimDaily(server, playerUUID, today)) {
      // Player can claim
  }
  ```

### `claimDaily(MinecraftServer server, UUID playerId, long todayEpochDay, int amount)`

Processes a daily reward claim.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `playerId` - UUID of the player
  - `todayEpochDay` - Current day as epoch day
  - `amount` - Reward amount to give
- **Returns:** `boolean` - `true` if claim successful
- **Example:**
  ```java
  long today = LocalDate.now(ZoneOffset.UTC).toEpochDay();
  int rewardAmount = Config.DAILY_REWARD_AMOUNT.get();
  boolean claimed = Economy.claimDaily(server, playerUUID, today, rewardAmount);
  ```

## Playtime Rewards

### `addPlaytimeReward(MinecraftServer server, UUID playerId, int proposedAmount)`

Adds playtime reward money to a player, respecting the daily cap.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `playerId` - UUID of the player
  - `proposedAmount` - Amount to attempt to credit
- **Returns:** `int` - Actual amount credited (may be less due to daily cap)
- **Example:**
  ```java
  int credited = Economy.addPlaytimeReward(server, playerUUID, 10);
  if (credited > 0) {
      player.sendMessage("You earned $" + credited);
  }
  ```

### `resetPlaytimeEarnedToday(MinecraftServer server, UUID playerId)`

Resets a player's playtime earnings for the day.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `playerId` - UUID of the player
- **Example:**
  ```java
  Economy.resetPlaytimeEarnedToday(server, playerUUID);
  ```

## Leaderboards

### `getBaltop(MinecraftServer server, int topN)`

Gets the top N richest players.

- **Parameters:**
  - `server` - The Minecraft server instance
  - `topN` - Number of top players to retrieve
- **Returns:** `List<Map.Entry<UUID, Integer>>` - Sorted list of player UUIDs and balances
- **Example:**
  ```java
  var topPlayers = Economy.getBaltop(server, 10);
  for (var entry : topPlayers) {
      UUID playerId = entry.getKey();
      int balance = entry.getValue();
      // Display leaderboard entry
  }
  ```

---

# Withdrawal Helper API

**Package:** `com.saunhardy.omnieconomy.util.WithdrawalHelper`

Helper utility for withdrawing currency bills from player accounts with inventory management.

## Withdrawal Methods

### `withdrawBills(ServerPlayer player, Item billItem, int count, int denomination)`

Withdraws bills from a player's account and adds them to inventory.

- **Parameters:**
  - `player` - The server player
  - `billItem` - The item representing the bill
  - `count` - Number of bills to withdraw
  - `denomination` - Value of each bill
- **Returns:** `WithdrawalResponse` - Response object containing result and success status
- **Example:**
  ```java
  WithdrawalResponse response = WithdrawalHelper.withdrawBills(
      player,
      OmniEconomy.BILL_100.get(),
      5,
      100
  );
  if (response.success) {
      player.sendMessage("Withdrew 5x $100 bills");
  }
  ```

### `withdrawBillsWithSpaceCheck(ServerPlayer player, Item billItem, int count, int denomination)`

Withdraws bills with pre-check for inventory space.

- **Parameters:**
  - `player` - The server player
  - `billItem` - The item representing the bill
  - `count` - Number of bills to withdraw
  - `denomination` - Value of each bill
- **Returns:** `WithdrawalResponse` - Response object containing result and success status
- **Example:**
  ```java
  WithdrawalResponse response = WithdrawalHelper.withdrawBillsWithSpaceCheck(
      player,
      OmniEconomy.BILL_50.get(),
      10,
      50
  );
  ```

## Inventory Utilities

### `hasInventorySpace(ServerPlayer player, int slotsNeeded)`

Checks if player has enough free inventory slots.

- **Parameters:**
  - `player` - The server player
  - `slotsNeeded` - Number of free slots required
- **Returns:** `boolean` - `true` if enough space available
- **Example:**
  ```java
  if (WithdrawalHelper.hasInventorySpace(player, 3)) {
      // Player has 3+ free slots
  }
  ```

### `calculateSlotsNeeded(int count, int maxStackSize)`

Calculates how many inventory slots are needed for a quantity of items.

- **Parameters:**
  - `count` - Total item count
  - `maxStackSize` - Maximum stack size for the item
- **Returns:** `int` - Number of slots needed
- **Example:**
  ```java
  int slots = WithdrawalHelper.calculateSlotsNeeded(200, 64); // Returns 4
  ```

## Result Types

### `WithdrawalResult` Enum

- `SUCCESS` - Withdrawal completed successfully
- `FAILED_API` - API call failed (invalid parameters, insufficient funds)
- `FAILED_CONNECTION` - Server connection issue
- `FAILED_INVENTORY` - Not enough inventory space
- `FAILED_DEV_MODE` - Development mode failure (non-critical)

### `WithdrawalResponse` Class

- **Fields:**
  - `result` - The `WithdrawalResult` enum value
  - `success` - Boolean indicating if withdrawal succeeded
- **Static Methods:**
  - `WithdrawalResponse.success()` - Creates success response
  - `WithdrawalResponse.failed(WithdrawalResult)` - Creates failure response
  - `WithdrawalResponse.devMode()` - Creates dev mode response

---

# AFK Integration API

**Package:** `com.saunhardy.omnieconomy.integration.AFKIntegration`

Integration with AFKStatus mod for detecting AFK players.

## Detection Methods

### `isAfk(ServerPlayer player)`

Checks if a player is currently AFK.

- **Parameters:**
  - `player` - The server player to check
- **Returns:** `boolean` - `true` if player is AFK
- **Behavior:**
  - If AFKStatus mod is present, uses its API
  - Falls back to scoreboard-based detection
  - Checks for "afk" team membership
  - Checks for "afk" objective score > 0
- **Example:**
  ```java
  if (AFKIntegration.isAfk(player)) {
      // Skip playtime rewards
  }
  ```

---

# Network Payloads

**Package:** `com.saunhardy.omnieconomy.network`

Custom network packets for client-server communication.

## Client → Server Payloads

### `ATMDepositPayload()`

Requests deposit of all currency bills from inventory.

- **No parameters**
- **Usage:** Sent when player clicks "Deposit All" in ATM

### `ATMWithdrawPayload(int mode, int a, int b)`

Requests withdrawal of currency.

- **Parameters:**
  - `mode` - Withdrawal mode (0 = specific bills, 1 = total amount)
  - `a` - Mode 0: denomination; Mode 1: total amount
  - `b` - Mode 0: count; Mode 1: unused
- **Example (specific bills):**
  ```java
  // Withdraw 5x $100 bills
  new ATMWithdrawPayload(0, 100, 5)
  ```
- **Example (total amount):**
  ```java
  // Withdraw $500 optimized
  new ATMWithdrawPayload(1, 500, 0)
  ```

### `ATMQueryBalancePayload()`

Requests current balance from server.

- **No parameters**
- **Usage:** Sent when opening ATM screen

## Server → Client Payloads

### `ATMBalancePayload(int balance)`

Sends player's current balance to client.

- **Parameters:**
  - `balance` - The player's balance
- **Usage:** Response to balance query or after transaction

### `ATMResultPayload(int kind, String message)`

Sends transaction result to client.

- **Parameters:**
  - `kind` - Result type (0 = default, 1 = success, 2 = error)
  - `message` - Human-readable message
- **Example:**
  ```java
  new ATMResultPayload(1, "Successfully deposited $500")
  ```

---

# Website APIs

## TODO

The following website API endpoints will be documented here:

- Authentication endpoints
- Server registration
- Telemetry data collection
- Server statistics queries
- Health check endpoints

_This section will be completed when the backend API specification is finalized._

---

# Notes

## Configuration Integration

Most API methods respect the mod's configuration settings. Key config values include:

- `MAX_BALANCE` - Maximum account balance
- `ENABLE_DAILY_REWARDS` - Toggle daily rewards
- `ENABLE_PLAYTIME_REWARDS` - Toggle playtime rewards
- `PLAYTIME_DAILY_CAP` - Daily playtime earnings cap
- `PLAYTIME_AFK_INTEGRATION` - Enable AFK detection

## Thread Safety

- The `Economy` API uses `OmniEconomySavedData` which employs `ConcurrentHashMap` for thread-safe operations
- Network payload handlers execute on the server thread via `ctx.enqueueWork()`
- All balance modifications should occur on the server thread

## Error Handling

- Balance operations are clamped to configured limits
- Withdrawal operations return boolean or enum results for error handling
- Network operations include result payloads for client feedback

## Best Practices

1. Always check return values from `withdraw()` operations
2. Use `WithdrawalHelper` for complex bill dispensing logic
3. Check AFK status before awarding playtime rewards (if enabled)
4. Handle all `PayResult` enum cases when processing payments
5. Validate player UUID and server instance before API calls
