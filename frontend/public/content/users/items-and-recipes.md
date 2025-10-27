# Items & Blocks

A complete reference of all items and blocks in OmniEconomy.

## Currency Items

### Bills

Physical currency that exists as items in your inventory. Used for trading, shopping, and day-to-day transactions.

<div class="item-grid">

<div class="item-card">
  <img src="/assets/mod/items/bills/1_bill.png" alt="$1 Bill" width="64" />
  <div class="item-details">
    <h4>$1 Bill</h4>
    <code>omnieconomy:bill_1</code>
    <p>Basic currency unit. Commonly dropped by mobs.</p>
  </div>
</div>

<div class="item-card">
  <img src="/assets/mod/items/bills/5_bill.png" alt="$5 Bill" width="64" />
  <div class="item-details">
    <h4>$5 Bill</h4>
    <code>omnieconomy:bill_5</code>
    <p>Rare mob drop. Used for small transactions.</p>
  </div>
</div>

<div class="item-card">
  <img src="/assets/mod/items/bills/10_bill.png" alt="$10 Bill" width="64" />
  <div class="item-details">
    <h4>$10 Bill</h4>
    <code>omnieconomy:bill_10</code>
    <p>Common denomination for everyday trades.</p>
  </div>
</div>

<div class="item-card">
  <img src="/assets/mod/items/bills/20_bill.png" alt="$20 Bill" width="64" />
  <div class="item-details">
    <h4>$20 Bill</h4>
    <code>omnieconomy:bill_20</code>
    <p>Medium-value transactions.</p>
  </div>
</div>

<div class="item-card">
  <img src="/assets/mod/items/bills/50_bill.png" alt="$50 Bill" width="64" />
  <div class="item-details">
    <h4>$50 Bill</h4>
    <code>omnieconomy:bill_50</code>
    <p>Higher-value trades.</p>
  </div>
</div>

<div class="item-card">
  <img src="/assets/mod/items/bills/100_bill.png" alt="$100 Bill" width="64" />
  <div class="item-details">
    <h4>$100 Bill</h4>
    <code>omnieconomy:bill_100</code>
    <p>Significant transactions.</p>
  </div>
</div>

<div class="item-card">
  <img src="/assets/mod/items/bills/500_bill.png" alt="$500 Bill" width="64" />
  <div class="item-details">
    <h4>$500 Bill</h4>
    <code>omnieconomy:bill_500</code>
    <p>Major purchases.</p>
  </div>
</div>

<div class="item-card">
  <img src="/assets/mod/items/bills/1000_bill.png" alt="$1000 Bill" width="64" />
  <div class="item-details">
    <h4>$1000 Bill</h4>
    <code>omnieconomy:bill_1000</code>
    <p>Highest denomination available.</p>
  </div>
</div>

</div>

**💡 Note**: Bills cannot be crafted. Obtain them through mob drops, daily rewards, or ATM withdrawals.

---

## Special Items

### Bank Card

<div class="item-showcase">
  <img src="/assets/mod/items/bank_card/bank_card.png" alt="Bank Card" width="96" />
  <div class="item-info">
    <h3>Bank Card</h3>
    <p class="item-id"><code>omnieconomy:bank_card</code></p>
    <p class="item-description">
      Required for <a href="https://createmod.net/" target="_blank">Create mod</a> integration. Use with Stock Ticker shopping lists to automatically withdraw currency from your account.
    </p>
    <p><strong>How to use:</strong></p>
    <ol>
      <li>Hold shopping list in main hand</li>
      <li>Hold bank card in offhand</li>
      <li>Right-click Stock Ticker or Blaze Burner</li>
      <li>Bills are withdrawn automatically</li>
    </ol>
    <p>
      <a href="/users/mod-integrations">Learn more about Create integration →</a>
    </p>
  </div>
</div>

#### Crafting

Currently not craftable - obtained through other means.

---

## Crafting Components

### Circuit Board

<div class="component-card">
  <div class="component-image">
    <img src="/assets/mod/items/circuit_board/circuit_board.png" alt="Circuit Board" width="96" />
  </div>
  <div class="component-details">
    <h4>Circuit Board</h4>
    <p class="item-id"><code>omnieconomy:circuit_board</code></p>
    <p>Essential component for crafting ATM blocks. Represents the electronic system.</p>
  </div>
</div>

**Recipe:**

![Circuit Board Recipe](/assets/mod/recipes/circuit-board-recipe.png)

```
[Copper Ingot] [Gold Ingot]
[Redstone]     [Iron Ingot]
```

---

### Keypad

<div class="component-card">
  <div class="component-image">
    <img src="/assets/mod/items/keypad/keypad.png" alt="Keypad" width="96" />
  </div>
  <div class="component-details">
    <h4>Keypad</h4>
    <p class="item-id"><code>omnieconomy:keypad</code></p>
    <p>Input device for ATM blocks. Required for user interaction.</p>
  </div>
</div>

**Recipe:**

![Keypad Recipe](/assets/mod/recipes/keypad-recipe.png)

```
[Button] [Button] [Button]
         [Iron Ingot]
```

---

## Blocks

### ATM Block

<div class="block-showcase">
  <div class="block-preview">
    <img src="/assets/mod/blocks/atm/atm_preview.png" alt="ATM Block" width="128" />
  </div>
  <div class="block-info">
    <h3>ATM Block</h3>
    <p class="item-id"><code>omnieconomy:atm</code></p>
    
    <h4>Description</h4>
    <p>The central banking block. Place anywhere to deposit and withdraw currency.</p>
    
    <h4>Features</h4>
    <ul>
      <li>✅ Deposit all bills from inventory</li>
      <li>✅ Withdraw specific denominations</li>
      <li>✅ Automatic bill optimization</li>
      <li>✅ PIN entry animation</li>
      <li>✅ Keyboard navigation support</li>
    </ul>
    
    <h4>Usage</h4>
    <p>Right-click the ATM block to open the banking interface. You can deposit all currency from your inventory or withdraw exact amounts.</p>
    
    <p><a href="/users/atm-blocks">View detailed ATM guide →</a></p>
  </div>
</div>

#### Crafting Recipe

![ATM Recipe](/assets/mod/recipes/atm-recipe.png)

```
[Iron Block]    [Circuit Board] [Iron Block]
[Circuit Board] [Chest]         [Circuit Board]
[Iron Block]    [Keypad]        [Iron Block]
```

**Materials needed:**

- 4× Iron Block
- 3× Circuit Board
- 1× Chest
- 1× Keypad

---

## Item Tags

Items in OmniEconomy use the following tags:

| Tag                            | Items                 | Purpose                 |
| ------------------------------ | --------------------- | ----------------------- |
| `omnieconomy:bills`            | All bill items        | Currency identification |
| `omnieconomy:components`       | Circuit Board, Keypad | Crafting materials      |
| `create:shopping_list_payment` | All bills             | Create mod integration  |

---

## Quick Reference

### All Item IDs

```
Currency:
  omnieconomy:bill_1
  omnieconomy:bill_5
  omnieconomy:bill_10
  omnieconomy:bill_20
  omnieconomy:bill_50
  omnieconomy:bill_100
  omnieconomy:bill_500
  omnieconomy:bill_1000

Special:
  omnieconomy:bank_card

Components:
  omnieconomy:circuit_board
  omnieconomy:keypad

Blocks:
  omnieconomy:atm
```

### Give Commands

```
/give @p omnieconomy:bill_100 64
/give @p omnieconomy:bank_card 1
/give @p omnieconomy:atm 1
```

---

## See Also

- [ATM Blocks Guide](/users/atm-blocks) - How to use ATM blocks
- [Currency System](/users/currency) - Understanding money in OmniEconomy
- [Mod Integrations](/users/mod-integrations) - Create mod and other integrations
- [Commands](/users/commands) - Console commands for items
